import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import {
  createHandler,
  hashPassword,
  normalizeReview,
  validateEmail,
  validatePassword,
  verifyPassword
} from '../server.mjs';

test('email and password validation rejects malformed or weak credentials', () => {
  assert.equal(validateEmail('sam@example.com'), true);
  assert.equal(validateEmail('not-an-email'), false);
  assert.equal(validateEmail('a'.repeat(250) + '@a.com'), false);
  assert.equal(validatePassword('long-enough-password'), true);
  assert.equal(validatePassword('short'), false);
  assert.equal(validatePassword('a'.repeat(129)), false);
});

test('password hashes are salted, verifiable, and reject malformed values', async () => {
  const first = await hashPassword('a-secure-password');
  const second = await hashPassword('a-secure-password');
  assert.notEqual(first, second);
  assert.equal(await verifyPassword('a-secure-password', first), true);
  assert.equal(await verifyPassword('incorrect-password', first), false);
  assert.equal(await verifyPassword('a-secure-password', 'not-a-hash'), false);
});

test('review validation enforces the rating range and comment size', () => {
  assert.deepEqual(normalizeReview({ rating: 5, comment: '  lovely  ' }), { rating: 5, comment: 'lovely' });
  assert.equal(normalizeReview({ rating: 0, comment: '' }), null);
  assert.equal(normalizeReview({ rating: 6, comment: '' }), null);
  assert.equal(normalizeReview({ rating: 3.5, comment: '' }), null);
  assert.equal(normalizeReview({ rating: 4, comment: 'x'.repeat(1001) }), null);
});

test('protected endpoints reject missing and invalid bearer tokens', async t => {
  const server = createServer(createHandler({ pool: {}, tokenSecret: 's'.repeat(32) }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const address = server.address();
  for (const authorization of [undefined, '******']) {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/me`, {
      headers: authorization ? { authorization } : {}
    });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: 'Sign in to continue.' });
  }
});

test('handler rejects a missing or too-short token secret', () => {
  assert.throws(() => createHandler({ pool: {}, tokenSecret: 'short' }), /TOKEN_SECRET/);
  assert.throws(() => createHandler({ pool: {} }), /TOKEN_SECRET/);
});
