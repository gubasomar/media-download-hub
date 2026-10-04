import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac } from 'node:crypto';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';

const scrypt = promisify(scryptCallback);
const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const maxBodySize = 32 * 1024;
const authAttempts = new Map();

export function validateEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 10 && password.length <= 128;
}

export function normalizeReview(input) {
  const rating = Number(input?.rating);
  const comment = typeof input?.comment === 'string' ? input.comment.trim() : '';
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length > 1000) return null;
  return { rating, comment };
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString('hex')}:${Buffer.from(key).toString('hex')}`;
}

export async function verifyPassword(password, encoded) {
  const [algorithm, saltHex, keyHex] = String(encoded).split(':');
  if (algorithm !== 'scrypt' || !/^[a-f\d]{32}$/i.test(saltHex ?? '') || !/^[a-f\d]{128}$/i.test(keyHex ?? '')) return false;
  const actual = Buffer.from(await scrypt(password, Buffer.from(saltHex, 'hex'), 64));
  return timingSafeEqual(actual, Buffer.from(keyHex, 'hex'));
}

function issueToken(user, secret, ttl) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + ttl })).toString('base64url');
  const content = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(content).digest('base64url');
  return `${content}.${signature}`;
}

function readToken(token, secret) {
  if (typeof token !== 'string') return null;
  const [header, payload, signature, extra] = token.split('.');
  if (!header || !payload || !signature || extra) return null;
  const content = `${header}.${payload}`;
  const expected = createHmac('sha256', secret).update(content).digest();
  let actual;
  try {
    actual = Buffer.from(signature, 'base64url');
    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (claims.exp <= Math.floor(Date.now() / 1000) || !claims.sub) return null;
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    return claims;
  } catch {
    return null;
  }
}

function send(response, status, data, headers = {}) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers });
  response.end(JSON.stringify(data));
}

async function bodyJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > maxBodySize) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
  }
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 });
  }
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role, preferredLanguage: row.preferred_language ?? 'en' };
}

function checkAuthRateLimit(request) {
  const now = Date.now();
  const key = request.socket.remoteAddress ?? 'unknown';
  const current = authAttempts.get(key);
  if (current && current.until > now && current.count >= 20) return false;
  if (!current || current.until <= now) authAttempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  else current.count += 1;
  if (authAttempts.size > 5000) {
    for (const [address, value] of authAttempts) if (value.until <= now) authAttempts.delete(address);
  }
  return true;
}

function cleanCatalogRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleAr: row.title_ar,
    type: row.type,
    genre: row.genre,
    year: row.year,
    description: row.description,
    descriptionAr: row.description_ar,
    imageUrl: row.image_url,
    size: row.size_label,
    quality: row.quality,
    platform: row.platform,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    license: row.license_label,
    featured: Boolean(row.featured),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0)
  };
}

export function createHandler({ pool, tokenSecret, tokenTtl = 604800 }) {
  if (!pool || !tokenSecret || tokenSecret.length < 32) throw new Error('A MySQL pool and TOKEN_SECRET of at least 32 characters are required.');

  return async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const pathname = url.pathname;
    const method = request.method;
    const authRoute = pathname.startsWith('/api/auth/');
    if (authRoute && !checkAuthRateLimit(request)) return send(response, 429, { error: 'Too many attempts. Please try again later.' }, { 'retry-after': '900' });

    try {
      if (method === 'GET' && pathname === '/api/health') {
        await pool.query('SELECT 1');
        return send(response, 200, { status: 'ok' });
      }

      if (method === 'GET' && pathname === '/api/catalog') {
        const conditions = ['published = 1'];
        const params = [];
        if (['game', 'movie'].includes(url.searchParams.get('type'))) {
          conditions.push('type = ?');
          params.push(url.searchParams.get('type'));
        }
        if (url.searchParams.get('genre')) {
          conditions.push('genre = ?');
          params.push(url.searchParams.get('genre').slice(0, 80));
        }
        const search = (url.searchParams.get('search') ?? '').trim().slice(0, 100);
        if (search) {
          conditions.push('(title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR genre LIKE ?)');
          params.push(...Array(4).fill(`%${search}%`));
        }
        const order = url.searchParams.get('sort') === 'rating' ? 'rating DESC, c.created_at DESC' : url.searchParams.get('sort') === 'year' ? 'c.year DESC' : 'c.featured DESC, c.created_at DESC';
        const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 60, 1), 100);
        const [rows] = await pool.execute(
          `SELECT c.*, AVG(r.rating) AS rating, COUNT(r.id) AS review_count
           FROM catalog c LEFT JOIN reviews r ON r.catalog_id = c.id
           WHERE ${conditions.join(' AND ')} GROUP BY c.id ORDER BY ${order} LIMIT ?`,
          [...params, limit]
        );
        return send(response, 200, { items: rows.map(cleanCatalogRow) });
      }

      const detailMatch = pathname.match(/^\/api\/catalog\/([a-z0-9-]+)$/);
      if (method === 'GET' && detailMatch) {
        const [rows] = await pool.execute(
          `SELECT c.*, AVG(r.rating) AS rating, COUNT(r.id) AS review_count
           FROM catalog c LEFT JOIN reviews r ON r.catalog_id = c.id
           WHERE c.slug = ? AND c.published = 1 GROUP BY c.id`,
          [detailMatch[1]]
        );
        if (!rows[0]) return send(response, 404, { error: 'Item not found.' });
        const [reviews] = await pool.execute(
          `SELECT r.rating, r.comment, r.created_at, u.name
           FROM reviews r JOIN users u ON u.id = r.user_id
           WHERE r.catalog_id = ? ORDER BY r.created_at DESC LIMIT 20`,
          [rows[0].id]
        );
        return send(response, 200, { item: cleanCatalogRow(rows[0]), reviews });
      }

      if (method === 'POST' && pathname === '/api/auth/register') {
        const input = await bodyJson(request);
        const name = typeof input.name === 'string' ? input.name.trim() : '';
        const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
        if (name.length < 2 || name.length > 100 || !validateEmail(email) || !validatePassword(input.password)) {
          return send(response, 400, { error: 'Enter a name, valid email, and password with at least 10 characters.' });
        }
        const passwordHash = await hashPassword(input.password);
        const [result] = await pool.execute(
          'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
          [name, email, passwordHash]
        );
        const user = { id: result.insertId, name, email, role: 'user', preferred_language: 'en' };
        return send(response, 201, { user: publicUser(user), token: issueToken(user, tokenSecret, tokenTtl) });
      }

      if (method === 'POST' && pathname === '/api/auth/login') {
        const input = await bodyJson(request);
        const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        if (!rows[0] || !(await verifyPassword(String(input.password ?? ''), rows[0].password_hash))) {
          return send(response, 401, { error: 'Email or password is incorrect.' });
        }
        return send(response, 200, { user: publicUser(rows[0]), token: issueToken(rows[0], tokenSecret, tokenTtl) });
      }

      const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : '';
      const claims = readToken(token, tokenSecret);
      if (pathname.startsWith('/api/me') || pathname.startsWith('/api/admin')) {
        if (!claims) return send(response, 401, { error: 'Sign in to continue.' });
      }

      if (method === 'GET' && pathname === '/api/me') {
        const [rows] = await pool.execute('SELECT id, name, email, role, preferred_language FROM users WHERE id = ? LIMIT 1', [claims.sub]);
        if (!rows[0]) return send(response, 401, { error: 'Account no longer exists.' });
        return send(response, 200, { user: publicUser(rows[0]) });
      }

      if (method === 'PATCH' && pathname === '/api/me') {
        const input = await bodyJson(request);
        const name = typeof input.name === 'string' ? input.name.trim() : '';
        const language = input.preferredLanguage;
        if (name.length < 2 || name.length > 100 || !['en', 'ar'].includes(language)) return send(response, 400, { error: 'Enter a valid name and language.' });
        await pool.execute('UPDATE users SET name = ?, preferred_language = ? WHERE id = ?', [name, language, claims.sub]);
        return send(response, 200, { user: { ...claims, name, preferredLanguage: language } });
      }

      if (method === 'GET' && pathname === '/api/me/downloads') {
        const [rows] = await pool.execute(
          `SELECT d.id, d.created_at, c.slug, c.title, c.title_ar, c.type, c.image_url, c.source_url, c.license_label
           FROM downloads d JOIN catalog c ON c.id = d.catalog_id
           WHERE d.user_id = ? ORDER BY d.created_at DESC LIMIT 100`,
          [claims.sub]
        );
        return send(response, 200, { items: rows });
      }

      if (method === 'POST' && pathname === '/api/me/downloads') {
        const input = await bodyJson(request);
        const [rows] = await pool.execute('SELECT id, source_url FROM catalog WHERE slug = ? AND published = 1 LIMIT 1', [String(input.slug ?? '')]);
        if (!rows[0]) return send(response, 404, { error: 'Item not found.' });
        const [result] = await pool.execute('INSERT INTO downloads (user_id, catalog_id) VALUES (?, ?)', [claims.sub, rows[0].id]);
        return send(response, 201, { id: result.insertId, sourceUrl: rows[0].source_url });
      }

      if (method === 'POST' && pathname === '/api/me/reviews') {
        const input = await bodyJson(request);
        const review = normalizeReview(input);
        if (!review || typeof input.slug !== 'string') return send(response, 400, { error: 'Choose a rating from 1 to 5 and a comment under 1,000 characters.' });
        const [items] = await pool.execute('SELECT id FROM catalog WHERE slug = ? AND published = 1 LIMIT 1', [input.slug]);
        if (!items[0]) return send(response, 404, { error: 'Item not found.' });
        await pool.execute(
          `INSERT INTO reviews (user_id, catalog_id, rating, comment) VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = CURRENT_TIMESTAMP`,
          [claims.sub, items[0].id, review.rating, review.comment]
        );
        return send(response, 201, { review });
      }

      if (method === 'GET' && pathname === '/api/admin/stats') {
        if (claims.role !== 'admin') return send(response, 403, { error: 'Administrator access required.' });
        const [[users]] = await pool.query('SELECT COUNT(*) AS total FROM users');
        const [[catalog]] = await pool.query('SELECT COUNT(*) AS total FROM catalog');
        const [[downloads]] = await pool.query('SELECT COUNT(*) AS total FROM downloads');
        const [[reviews]] = await pool.query('SELECT COUNT(*) AS total FROM reviews');
        return send(response, 200, { users: users.total, catalog: catalog.total, downloads: downloads.total, reviews: reviews.total });
      }

      return send(response, 404, { error: 'Route not found.' });
    } catch (error) {
      if (error.status) return send(response, error.status, { error: error.message });
      if (error.code === 'ER_DUP_ENTRY') return send(response, 409, { error: 'An account with this email already exists.' });
      console.error('Request failed:', error.message);
      return send(response, 500, { error: 'Something went wrong. Please try again.' });
    }
  };
}

async function serveStatic(request, response) {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(publicRoot, requested);
  if (!file.startsWith(`${publicRoot}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  let info;
  try {
    info = await stat(file);
  } catch {
    response.writeHead(404).end();
    return;
  }
  if (!info.isFile()) {
    response.writeHead(404).end();
    return;
  }
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
  response.writeHead(200, {
    'content-type': types[path.extname(file)] ?? 'application/octet-stream',
    'content-security-policy': "default-src 'self'; img-src 'self' https://images.unsplash.com data:; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'DENY'
  });
  createReadStream(file).pipe(response);
}

export async function createAppServer(config = process.env) {
  const pool = mysql.createPool({
    host: config.MYSQL_HOST ?? '127.0.0.1',
    port: Number(config.MYSQL_PORT ?? 3306),
    user: config.MYSQL_USER ?? 'root',
    password: config.MYSQL_PASSWORD ?? '',
    database: config.MYSQL_DATABASE ?? 'media_download_hub',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });
  const tokenSecret = config.TOKEN_SECRET ?? '';
  if (tokenSecret.length < 32) throw new Error('Set TOKEN_SECRET to a random value of at least 32 characters.');
  const handler = createHandler({ pool, tokenSecret, tokenTtl: Number(config.TOKEN_TTL_SECONDS ?? 604800) });
  const server = createServer((request, response) => {
    if (request.url?.startsWith('/api/')) handler(request, response);
    else if (request.method === 'GET' || request.method === 'HEAD') serveStatic(request, response);
    else response.writeHead(405, { allow: 'GET, HEAD' }).end();
  });
  server.on('close', () => pool.end());
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const server = await createAppServer();
    const port = Number(process.env.PORT ?? 3000);
    server.listen(port, () => console.log(`Media Hub is ready on http://localhost:${port}`));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
