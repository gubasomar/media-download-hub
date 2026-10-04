# Sora

A responsive, bilingual discovery hub for open-source games and films from trusted creators. Sora keeps a curated catalog, saves a local reading list, and directs users to official creator or rights-holder pages instead of hosting media files.

## Features

- Responsive games and films catalog with search, genre/type filters, and sorting
- English/Arabic interface, including right-to-left layout, plus dark/light themes
- Product details, ratings, comments, saved items, and download history
- MySQL-backed REST API for catalog, accounts, reviews, history, and admin metrics
- Password hashing with scrypt, signed bearer tokens, rate-limited authentication, and parameterized SQL
- Search-engine metadata, keyboard search shortcut (`Ctrl/⌘ + K`), and accessible dialogs

## Run locally

Requirements: Node.js 20+ and MySQL 8+.

1. Install dependencies: `npm install`
2. Create the schema and sample catalog: `mysql -u root -p < schema.sql`
3. Copy `.env.example` to `.env` and configure the MySQL connection and a random `TOKEN_SECRET` of at least 32 characters.
4. Start the site: `npm start`
5. Open `http://localhost:3000`

Set an existing account's role to `admin` to enable the metrics dashboard:

```sql
UPDATE media_download_hub.users SET role = 'admin' WHERE email = 'admin@example.com';
```

For deployment, terminate TLS at a trusted reverse proxy, keep `.env` private, and restrict MySQL to the application host. The server does not serve uploaded media or accept media uploads; catalog download links are outbound HTTPS links maintained by the respective creator/rightsholder.

## API overview

- `GET /api/health`
- `GET /api/catalog?type=game&search=...&genre=...&sort=rating`
- `GET /api/catalog/:slug`
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/me`, `PATCH /api/me`
- `GET /api/me/downloads`, `POST /api/me/downloads`
- `POST /api/me/reviews`
- `GET /api/admin/stats` (admin role)

Authenticated routes require an `Authorization` header containing a signed bearer token. The SQL schema in `schema.sql` includes sample records and may be safely re-run to refresh those catalog entries.

## Tests

Run `npm test`.
