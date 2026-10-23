import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { verifyAuth } from '@supabase/server/core';
import { authConfig, authKeyName } from '../shared/supabase-config.mjs';
import { serverAuthConfig, verifySupabaseUser } from '../server/supabase-auth.mjs';
import { inspectAuth } from '../server/auth-readiness.mjs';
import { environmentReport } from '../server/database-status.mjs';

const env = { SUPABASE_URL: 'https://project.invalid', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test', SUPABASE_JWKS_URL: 'https://project.invalid/auth/v1/.well-known/jwks.json' };
const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1', privateKeyEncoding: { format: 'jwk' }, publicKeyEncoding: { format: 'jwk' } });
const jwks = { keys: [{ ...publicKey, kid: 'test-key', alg: 'ES256', use: 'sig' }] };
const claims = { sub: 'verified-id', role: 'authenticated', iss: 'https://project.invalid/auth/v1', aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 300 };
function token(patch = {}, key = privateKey) {
  const input = [Buffer.from(JSON.stringify({ alg: 'ES256', kid: 'test-key' })).toString('base64url'), Buffer.from(JSON.stringify({ ...claims, ...patch })).toString('base64url')].join('.');
  return `${input}.${sign('sha256', Buffer.from(input), { key: createPrivateKey({ key, format: 'jwk' }), dsaEncoding: 'ieee-p1363' }).toString('base64url')}`;
}
const req = value => ({ headers: { authorization: `Bearer ${value}` } });
const localVerify = async (request, options) => {
  assert.equal(options.auth, 'user');
  assert.equal(options.issuer, claims.iss); assert.equal(options.audience, 'authenticated');
  assert.equal(options.env.jwks.href, env.SUPABASE_JWKS_URL);
  assert.deepEqual(options.env.secretKeys, {});
  return verifyAuth(request, { ...options, env: { ...options.env, jwks } });
};
const rejectStatus = (promise, status) => assert.rejects(promise, error => error.status === status);

test('publishable configuration works for browser/server and legacy anon remains a fallback', () => {
  assert.equal(authConfig(env).key, env.SUPABASE_PUBLISHABLE_KEY);
  assert.equal(authConfig({ VITE_SUPABASE_URL: env.SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: env.SUPABASE_PUBLISHABLE_KEY }, 'VITE_').url, env.SUPABASE_URL);
  assert.equal(authConfig({ SUPABASE_URL: env.SUPABASE_URL, SUPABASE_ANON_KEY: 'legacy' }).key, 'legacy');
  assert.equal(authKeyName({ ...env, SUPABASE_ANON_KEY: 'legacy' }), 'SUPABASE_PUBLISHABLE_KEY');
  assert.equal(authConfig({}), null);
});

test('public configuration rejects privileged keys, markdown URLs and insecure origins', () => {
  const service = `e30.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')}.sig`;
  for (const key of ['sb_secret_never_public', service]) assert.throws(() => authConfig({ ...env, SUPABASE_PUBLISHABLE_KEY: key }));
  for (const url of ['http://project.invalid', '[https://project.invalid](https://project.invalid)', 'https://user:pass@project.invalid', 'https://project.invalid/?redirect=x']) assert.throws(() => authConfig({ ...env, SUPABASE_URL: url }));
});

test('JWKS URL must belong to configured project and secret key is optional/unused', () => {
  assert.equal(serverAuthConfig(env).jwks.href, env.SUPABASE_JWKS_URL);
  assert.equal(serverAuthConfig({ ...env, SUPABASE_SECRET_KEY: 'masked-not-used' }).key, env.SUPABASE_PUBLISHABLE_KEY);
  assert.throws(() => serverAuthConfig({ ...env, SUPABASE_JWKS_URL: 'https://attacker.invalid/keys' }));
});

test('@supabase/server verifies actual ES256 signatures and the user identity', async () => {
  assert.equal(await verifySupabaseUser(req(token()), env, undefined, localVerify), 'verified-id');
  // Ensure the fixture JWK really contains the generated public key.
  assert(createPublicKey({ key: jwks.keys[0], format: 'jwk' }));
});

test('expired/wrong issuer/wrong audience/missing expiry/invalid user claims are rejected', async () => {
  for (const patch of [{ exp: 1 }, { iss: 'https://other.invalid/auth/v1' }, { aud: 'anon' }, { exp: undefined }, { sub: '' }, { role: 'service_role' }]) {
    await rejectStatus(verifySupabaseUser(req(token(patch)), env, undefined, localVerify), 401);
  }
});

test('forged signatures, API keys and missing bearer never grant user access', async () => {
  const other = generateKeyPairSync('ec', { namedCurve: 'prime256v1', privateKeyEncoding: { format: 'jwk' }, publicKeyEncoding: { format: 'jwk' } });
  for (const value of [token({}, other.privateKey), 'sb_publishable_test', 'sb_secret_test', 'broken.token.value']) await rejectStatus(verifySupabaseUser(req(value), env, undefined, localVerify), 401);
  await rejectStatus(verifySupabaseUser({ headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY } }, env), 401);
});

test('JWKS failure returns unavailable and never falls back to unverified/online identity', async () => {
  let online = false;
  await rejectStatus(verifySupabaseUser(req(token()), env, async () => { online = true; }, async () => ({ error: { status: 500 } })), 503);
  assert.equal(online, false);
});

test('legacy online verifier sends publishable key and fails closed on invalid sessions/network errors', async () => {
  const legacyEnv = { ...env, SUPABASE_JWKS_URL: '' };
  const id = await verifySupabaseUser(req('test-session'), legacyEnv, async (url, options) => {
    assert.equal(url.href, 'https://project.invalid/auth/v1/user');
    assert.equal(options.headers.apikey, env.SUPABASE_PUBLISHABLE_KEY);
    return { ok: true, json: async () => ({ id: 'online-id' }) };
  });
  assert.equal(id, 'online-id');
  await rejectStatus(verifySupabaseUser(req('test'), legacyEnv, async () => ({ status: 401 })), 401);
  await rejectStatus(verifySupabaseUser(req('test'), legacyEnv, async () => { throw new Error('secret network detail'); }), 503);
});

test('redacted environment report accepts publishable key without requiring legacy anon', () => {
  const report = environmentReport(env);
  assert.equal(report.find(f => f.name === 'SUPABASE_PUBLISHABLE_KEY').status, 'set');
  assert(!report.some(f => f.name === 'SUPABASE_ANON_KEY'));
  assert(!JSON.stringify(report).includes(env.SUPABASE_PUBLISHABLE_KEY));
});

test('auth readiness probes are read-only, redacted and never report a verified login', async () => {
  const report = await inspectAuth(env, async (url, options) => {
    assert.equal(options.method, undefined);
    return { ok: true, json: async () => url.href.includes('jwks') ? jwks : { external: { google: true } } };
  });
  assert.equal(report.state, 'service_reachable'); assert.equal(report.googleEnabled, true); assert.equal(report.loginVerified, false);
  assert(!JSON.stringify(report).includes(env.SUPABASE_PUBLISHABLE_KEY));
  assert.equal((await inspectAuth(env, async () => { throw new Error(); })).state, 'unavailable');
});
