const test = require('node:test');
const assert = require('node:assert/strict');

const { getCookieOptions, getAllowedOrigins } = require('../utils/cookieConfig');

test('production cookies are secure and cross-site friendly', () => {
  const options = getCookieOptions(true);

  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, 'none');
});

test('local cookies stay relaxed for development', () => {
  const options = getCookieOptions(false);

  assert.equal(options.secure, false);
  assert.equal(options.sameSite, 'lax');
});

test('allowed origins includes the configured frontend URL', () => {
  const origins = getAllowedOrigins('https://example.com');

  assert.ok(origins.includes('https://example.com'));
  assert.ok(origins.includes('http://localhost:5173'));
});
