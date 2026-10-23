import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { createAdminSetupHandler } from '../server/admin-setup.mjs';
import { createNetlifyAdminSetupHandler } from '../netlify/functions/admin-setup.mjs';

const env = { DB_PROVIDER: 'tidb', TIDB_HOST: 'private-host.invalid', TIDB_USER: 'private-user', TIDB_PASSWORD: 'private-password', TIDB_DATABASE: 'codeshark', SUPABASE_URL: 'https://private-auth.invalid', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_private-test', ADMIN_USER_IDS: 'private-admin-id' };
function database(failSchema = false) {
  const calls = [];
  return { calls, released: 0, async getConnection() { return {
    query: async ({ sql }) => { calls.push(sql); if (failSchema && sql.includes('cs_site_settings')) throw new Error('private SQL details'); return [[]]; },
    release: () => { this.released++; }, destroy() {},
  }; } };
}
async function invoke(handle, method = 'GET') {
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handle({ method }, res); return res;
}
const state = (res, id) => res.body.items.find(i => i.id === id)?.status;

test('missing config is visible before login, without opening DB or exposing credential values', async () => {
  const res = await invoke(createAdminSetupHandler({ env: {}, pool: () => { throw new Error('Must not connect'); } }));
  assert.equal(res.code, 200);
  assert.equal(state(res, 'TIDB_PASSWORD'), 'missing');
  assert.equal(state(res, 'ADMIN_USER_IDS'), 'missing');
  assert.equal(state(res, 'settings_schema'), 'blocked');
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert(!res.body.items.some(i => i.id === 'SUPABASE_SECRET_KEY'));
});

test('settings tables checked read-only, cached and single-flight, without reading user data', async () => {
  const pool = database();
  const handle = createAdminSetupHandler({ env, pool: () => pool, options: () => {} });
  const [res] = await Promise.all([invoke(handle), invoke(handle)]);
  assert.equal(state(res, 'settings_schema'), 'ready');
  assert.equal(state(res, 'tidb_connection'), 'ready');
  assert.equal(state(res, 'ADMIN_USER_IDS'), 'configured');
  assert.equal(pool.calls.length, 3);
  assert(pool.calls.every(sql => sql.startsWith('SELECT')));
  assert(pool.calls.slice(1).every(sql => sql.endsWith('LIMIT 0')));
  assert.equal(pool.released, 1);
  for (const value of Object.values(env).filter(v => v.includes('private'))) assert(!JSON.stringify(res.body).includes(value));
  await invoke(handle); assert.equal(pool.calls.length, 3);
});

test('missing settings schema is distinguished from missing database config and never leaks SQL errors', async () => {
  const res = await invoke(createAdminSetupHandler({ env, pool: () => database(true), options: () => {} }));
  assert.equal(state(res, 'tidb_connection'), 'ready'); assert.equal(state(res, 'settings_schema'), 'failed');
  assert(!JSON.stringify(res.body).includes('private SQL'));
});

test('invalid TLS/config, network failure and unsupported methods are safe', async () => {
  const invalid = await invoke(createAdminSetupHandler({ env, options: () => { throw new Error(); } }));
  assert.equal(state(invalid, 'tidb_connection'), 'invalid');
  const failed = await invoke(createAdminSetupHandler({ env, options: () => {}, pool: () => ({ getConnection: async () => { throw new Error('private error'); } }) }));
  assert.equal(state(failed, 'tidb_connection'), 'failed');
  assert.equal(state(failed, 'settings_schema'), 'blocked');
  const wrongMethod = await invoke(createAdminSetupHandler(), 'POST');
  assert.equal(wrongMethod.code, 405); assert.equal(wrongMethod.headers.Allow, 'GET');
});

test('Netlify setup adapter returns JSON bootstrap diagnostics with no-store', async () => {
  const handle = createNetlifyAdminSetupHandler({ env: {} });
  const res = await handle({ httpMethod: 'GET' });
  assert.equal(res.statusCode, 200); assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(JSON.parse(res.body).ok, true);
  assert.equal((await handle({ httpMethod: 'PUT' })).statusCode, 405);
});

test('client validates setup reports and rejects HTML, unknown IDs, empty/duplicate or incomplete reports', async () => {
  const source = await readFile(new URL('../src/admin/setupStatus.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { fetchSetupStatus } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  const good = (await invoke(createAdminSetupHandler({ env: {} }))).body;
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json(good);
    assert.equal((await fetchSetupStatus(new AbortController().signal)).items.find(i => i.id === 'ADMIN_USER_IDS').status, 'missing');
    for (const body of [{ ...good, items: [] }, { ...good, items: [...good.items, { id: 'unknown', status: 'ready' }] }, { ...good, items: [...good.items, good.items[0]] }]) {
      globalThis.fetch = async () => Response.json(body);
      await assert.rejects(fetchSetupStatus(new AbortController().signal));
    }
    globalThis.fetch = async () => new Response('<html>fallback</html>', { headers: { 'Content-Type': 'text/html' } });
    await assert.rejects(fetchSetupStatus(new AbortController().signal));
  } finally { globalThis.fetch = original; }
});

test('admin renders setup guidance before login or settings access, outside restricted form', async () => {
  const { build } = await import('esbuild');
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  await mkdir('.cache', { recursive: true });
  const folder = await mkdtemp('.cache/admin-setup-render-');
  try {
    const outfile = `${folder}/admin.mjs`;
    await build({ entryPoints: ['src/admin/AdminSettings.tsx'], outfile, bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic', define: { 'import.meta.env': '{}' }, logLevel: 'silent' });
    const { default: AdminSettings } = await import(pathToFileURL(`${process.cwd()}/${outfile}`).href);
    const html = renderToStaticMarkup(createElement(AdminSettings));
    assert(html.includes('Setup yang perlu diselesaikan'));
    assert(html.includes('VITE_SUPABASE_URL'));
    assert(html.includes('Google OAuth'));
    assert(html.includes('Koneksi database dan environment'));
    assert(!html.includes('<form'));
    assert(!html.includes('Simpan ke database'));
  } finally { await rm(folder, { recursive: true, force: true }); }
});
