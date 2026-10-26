import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultSettings, GAME_IDS, RETIRED_GAME_IDS, migrateSettings, validateSettings } from '../shared/site-settings.mjs';
import { createSettingsHandler } from '../server/site-settings.mjs';
import { createNetlifySettingsHandler } from '../server/netlify-settings.mjs';

const env = { SUPABASE_URL: 'https://auth.invalid', SUPABASE_ANON_KEY: 'public-test', ADMIN_USER_IDS: 'admin-id', TIDB_ALLOW_GUEST_SYNC: 'true' };
const request = async () => ({ ok: true, json: async () => ({ id: 'admin-id' }) });
function mockPool() {
  let row;
  let backup;
  const calls = [];
  const db = {
    calls,
    async execute(options, values = []) {
      const sql = options.sql;
      calls.push({ sql, values });
      if (sql.startsWith('SELECT')) return [row ? [structuredClone(row)] : []];
      if (sql.startsWith('INSERT IGNORE') && !row) row = { settings_json: values[0], revision: 0, updated_by: null, updated_at: '2026-10-23T00:00:00Z' };
      if (sql.startsWith('UPDATE')) row = { ...row, settings_json: values[0], revision: row.revision + 1, updated_by: values[1] };
      return [{}];
    },
    async getConnection() { return db; },
    async beginTransaction() { backup = structuredClone(row); calls.push('begin'); },
    async commit() { calls.push('commit'); },
    async rollback() { row = backup; calls.push('rollback'); },
    release() { calls.push('release'); },
  };
  return db;
}
async function invoke(handler, method = 'GET', body, headers = { authorization: 'Bearer test' }) {
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler({ method, body, headers }, res);
  return res;
}

test('strict schema rejects unknown keys, injected roles, string booleans, oversized values and missing games', () => {
  assert.deepEqual(validateSettings(defaultSettings()), defaultSettings());
  for (const patch of [{ admin: true }, { siteName: '' }, { maintenance: 'false' }, { announcement: 'a'.repeat(1001) }, { games: { shark: true } }, { modules: { ...defaultSettings().modules, secret: true } }]) {
    assert.throws(() => validateSettings({ ...defaultSettings(), ...patch }));
  }
});

test('legacy settings with retired backend and cross-platform games migrate on read; schema stays strict', () => {
  // MK Sistem Aplikasi Web (ci_backend/py_backend) dan Cross Platform pensiun 26-10-2026:
  // tidak lagi sub-game aktif, tetapi dokumen lama tidak boleh menggagalkan boot.
  assert.deepEqual(GAME_IDS, ['tower', 'shark']);
  assert.deepEqual(RETIRED_GAME_IDS, ['ci_backend', 'py_backend', 'crossplatform']);
  const legacy = defaultSettings();
  legacy.games = { ...legacy.games, ci_backend: false, py_backend: true, crossplatform: false };
  assert.throws(() => validateSettings(legacy));
  assert.deepEqual(validateSettings(migrateSettings(legacy)), defaultSettings());
  // Migrasi tidak memutasi dokumen asal dan passthrough untuk nilai non-dokumen.
  assert.equal(Object.hasOwn(legacy.games, 'ci_backend'), true);
  assert.equal(migrateSettings(null), null);
  assert.equal(migrateSettings('bukan dokumen'), 'bukan dokumen');
  const clean = defaultSettings();
  assert.equal(migrateSettings(clean), clean);
});

test('public GET returns defaults without writing, never reveals admin identity', async () => {
  const pool = mockPool();
  const res = await invoke(createSettingsHandler({ pool }));
  assert.equal(res.code, 200);
  assert.equal(res.body.revision, 0);
  assert.deepEqual(res.body.settings, defaultSettings());
  assert.equal(Object.hasOwn(res.body, 'updatedBy'), false);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(pool.calls.length, 1);
});

test('admin GET and PUT require a verified bearer; guest opt-in cannot grant admin', async () => {
  const pool = mockPool();
  const handle = createSettingsHandler({ admin: true, env, request, pool });
  for (const method of ['GET', 'PUT']) assert.equal((await invoke(handle, method, {}, {})).code, 401);
  assert.equal(pool.calls.length, 0);
});

test('non-admin identity and spoofed request role or metadata are forbidden', async () => {
  const pool = mockPool();
  const handle = createSettingsHandler({ admin: true, env, pool, request: async () => ({ ok: true, json: async () => ({ id: 'ordinary-user', user_metadata: { role: 'admin' } }) }) });
  const res = await invoke(handle, 'PUT', { settings: defaultSettings(), revision: 0, role: 'admin' });
  assert.equal(res.code, 403);
  assert.equal(pool.calls.length, 0);
});

test('missing server admin allowlist fails closed and expired token is rejected', async () => {
  assert.equal((await invoke(createSettingsHandler({ admin: true, env: { ...env, ADMIN_USER_IDS: '' }, request }))).code, 503);
  assert.equal((await invoke(createSettingsHandler({ admin: true, env, request: async () => ({ status: 401, ok: false }) }))).code, 401);
});

test('admin saves settings and audit atomically, public reads persist disabled game/module', async () => {
  const pool = mockPool();
  const handle = createSettingsHandler({ admin: true, env, request, pool });
  const settings = defaultSettings(); settings.siteName = 'Academy'; settings.games.tower = false; settings.modules.css = false;
  const saved = await invoke(handle, 'PUT', { settings, revision: 0 });
  assert.equal(saved.code, 200);
  assert.equal(saved.body.revision, 1);
  assert.equal(saved.body.updatedBy, 'user:admin-id');
  assert(pool.calls.some(call => call.sql?.endsWith('FOR UPDATE')));
  assert(pool.calls.some(call => call.sql?.includes('cs_site_settings_audit') && call.values[1] === 'user:admin-id'));
  assert(pool.calls.includes('commit'));
  assert.equal(pool.calls.at(-1), 'release');
  const publicRes = await invoke(createSettingsHandler({ pool }));
  assert.deepEqual(publicRes.body.settings, settings);
  assert.equal(publicRes.body.updatedBy, undefined);
});

test('stale revision returns 409 and does not overwrite newer configuration', async () => {
  const pool = mockPool(); const handle = createSettingsHandler({ admin: true, env, request, pool });
  await invoke(handle, 'PUT', { settings: defaultSettings(), revision: 0 });
  const settings = { ...defaultSettings(), siteName: 'stale' };
  assert.equal((await invoke(handle, 'PUT', { settings, revision: 0 })).code, 409);
  assert(pool.calls.includes('rollback'));
  const result = await invoke(handle);
  assert.equal(result.body.settings.siteName, defaultSettings().siteName);
  assert.equal(result.body.revision, 1);
});

test('audit failure rolls back configuration and never returns success', async () => {
  const pool = mockPool(); const execute = pool.execute.bind(pool);
  pool.execute = async (options, values) => { if (options.sql.includes('cs_site_settings_audit')) throw new Error('private database details'); return execute(options, values); };
  const res = await invoke(createSettingsHandler({ admin: true, env, request, pool }), 'PUT', { settings: defaultSettings(), revision: 0 });
  assert.equal(res.code, 503);
  assert(pool.calls.includes('rollback'));
  assert(!pool.calls.includes('commit'));
  assert(!JSON.stringify(res.body).includes('private database details'));
});

test('invalid payload and disallowed methods do not touch the database', async () => {
  const pool = mockPool(); const handle = createSettingsHandler({ admin: true, env, request, pool });
  for (const body of [{ settings: defaultSettings(), revision: -1 }, { settings: { ...defaultSettings(), siteName: '' }, revision: 0 }, { settings: defaultSettings(), revision: 0, injected: true }]) {
    assert.equal((await invoke(handle, 'PUT', body)).code, 400);
  }
  assert.equal((await invoke(handle, 'DELETE')).code, 405);
  assert.equal((await invoke(createSettingsHandler({ pool }), 'PUT', {})).code, 405);
  assert.equal(pool.calls.length, 0);
});

test('unavailable database or missing migration fails closed without secrets', async () => {
  const res = await invoke(createSettingsHandler({ pool: () => { throw new Error('SECRET PASSWORD'); } }));
  assert.equal(res.code, 503);
  assert.equal(res.body.ok, false);
  assert(!JSON.stringify(res.body).includes('SECRET'));
});

test('Netlify adapter handles uppercase headers, base64, malformed and oversized payloads', async () => {
  const handler = createNetlifySettingsHandler({ admin: true, env, request, pool: mockPool() });
  const saved = await handler({ httpMethod: 'PUT', headers: { Authorization: 'Bearer test' }, isBase64Encoded: true, body: Buffer.from(JSON.stringify({ settings: defaultSettings(), revision: 0 })).toString('base64') });
  assert.equal(saved.statusCode, 200);
  assert.equal(JSON.parse(saved.body).revision, 1);
  assert.equal((await handler({ httpMethod: 'PUT', body: '{' })).statusCode, 400);
  assert.equal((await handler({ httpMethod: 'PUT', body: 'x'.repeat(16385) })).statusCode, 413);
});
