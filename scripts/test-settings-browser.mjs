// Optional browser smoke test. Use CHROMIUM_PATH=/path/to/chromium npm run test:settings:browser.
// Public API responses are intercepted fixtures; this is not a live database/OAuth test.
// MODE DATA: smoke test admin/cloud ini dilewati HANYA bila DATA_MODE=local
// (dan aplikasi di-build dengan VITE_DATA_MODE=cloud). Lihat docs/036_mode-lokal_26102026_0819.md.
import { exitIfLocalMode } from '../server/local-mode.mjs';
exitIfLocalMode('scripts/test-settings-browser.mjs (test:settings:browser)');
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { defaultSettings } from '../shared/site-settings.mjs';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
if (!process.env.CHROMIUM_PATH) throw new Error('Set CHROMIUM_PATH to an installed Chromium executable.');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let checks = 0;
try {
  const page = await browser.newPage();
  let settings = defaultSettings();
  await page.route('**/api/site-settings', route => route.fulfill({ json: { ok: true, settings, revision: 1, updatedAt: null }, headers: { 'Cache-Control': 'no-store' } }));
  await page.route('https://fonts.**/*', route => route.abort());
  await page.goto(`${base}/admin/`);
  await page.getByRole('button', { name: 'Login Google sebagai admin' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Simpan ke database' }).count(), 0);
  checks++;
  await page.getByRole('button', { name: 'Login Google sebagai admin' }).click();
  await page.getByRole('status').filter({ hasText: 'belum dikonfigurasi' }).waitFor(); checks++;
  settings.siteName = 'Test Academy'; settings.description = 'Konfigurasi dari API'; settings.announcement = 'Pengumuman admin';
  await page.goto(base);
  await page.getByText('Pengumuman admin', { exact: true }).waitFor();
  await page.getByText('Test Academy', { exact: true }).waitFor();
  assert.equal(await page.title(), 'Test Academy'); checks++;
  settings.games.tower = false;
  await page.reload();
  const tower = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Coding Tower', exact: true }) });
  await tower.getByRole('button', { name: 'Dinonaktifkan sementara' }).waitFor();
  assert.equal(await tower.getByRole('button', { name: 'Dinonaktifkan sementara' }).isDisabled(), true); checks++;
  await page.goto(`${base}/codingtower/`);
  await page.getByText('Sub-game ini dinonaktifkan sementara.', { exact: true }).waitFor(); checks++;
  settings.games.shark = false;
  await page.goto(`${base}/codingshark/`);
  await page.getByText('Sub-game ini dinonaktifkan sementara.', { exact: true }).waitFor(); checks++;
  settings.games.shark = true;
  settings.maintenance = true;
  await page.goto(`${base}/codingshark/`);
  await page.getByText('Website / konten belum tersedia', { exact: true }).waitFor();
  await page.getByText('Pengumuman admin', { exact: true }).waitFor();
  await page.goto(`${base}/admin/`);
  await page.getByRole('button', { name: 'Login Google sebagai admin' }).waitFor(); checks++;
  settings.maintenance = false; settings.modules.html = false;
  await page.goto(`${base}/codingshark/`);
  await page.evaluate(async () => {
    const { defaultSave, persist } = await import('/src/lib/storage.ts');
    const save = defaultSave(); save.profile = { name: 'Browser Test', age: 'teen', sound: false, createdAt: Date.now() };
    persist(save);
  });
  await page.reload();
  // Disabled HTML is absent from mission cards; CSS remains available.
  await page.getByText('CSS Dasar', { exact: true }).first().waitFor();
  assert.equal(await page.getByText('HTML Dasar', { exact: true }).count(), 0); checks++;
  await page.route('**/api/site-settings', route => route.fulfill({ status: 503, json: { ok: false } }));
  await page.goto(base);
  await page.getByText('Konfigurasi database tidak dapat dimuat. Periksa koneksi dan migrasi settings.', { exact: true }).waitFor();
  assert.equal(await page.locator('article').count(), 0); checks++;
  // Authenticated UI fixtures: exercise the form without claiming real OAuth/DB access.
  await page.route('**/src/lib/auth.ts*', route => route.fulfill({ contentType: 'application/javascript', body: `
    export const currentUser = async () => ({id:'admin-test',email:'admin@example.invalid',provider:'google'});
    export const onAuthChange = () => () => {};
    export const accessToken = async () => 'browser-fixture-token';
    export const signInWithGoogle = async () => {};
    export const signOut = async () => {};
  ` }));
  let stored = { settings: defaultSettings(), revision: 1, updatedAt: null };
  await page.route('**/api/admin-settings', async route => {
    assert.equal(route.request().headers().authorization, 'Bearer browser-fixture-token');
    if (route.request().method() === 'PUT') {
      const body = route.request().postDataJSON();
      stored = { settings: body.settings, revision: stored.revision + 1, updatedAt: '2026-10-23T00:00:00Z' };
    }
    return route.fulfill({ json: { ok: true, ...stored } });
  });
  await page.goto(`${base}/admin/`);
  await page.getByLabel('Nama website', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Simpan ke database' }).isDisabled(), true);
  await page.getByLabel('Nama website', { exact: true }).fill('Saved Academy');
  await page.getByLabel('Coding Tower', { exact: true }).uncheck();
  await page.getByLabel('CSS', { exact: true }).uncheck();
  await page.getByRole('button', { name: 'Simpan ke database' }).click();
  await page.getByText('Berhasil disimpan di database.', { exact: true }).waitFor();
  assert.equal(stored.settings.games.tower, false);
  assert.equal(stored.settings.modules.css, false);
  checks++;
  await page.reload();
  await page.getByLabel('Nama website', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Nama website', { exact: true }).inputValue(), 'Saved Academy');
  assert.equal(await page.getByLabel('Coding Tower', { exact: true }).isChecked(), false);
  checks++;
  await page.route('**/api/admin-settings', route => route.fulfill({ status: 409, json: { ok: false, error: 'Konflik revisi fixture' } }));
  await page.getByLabel('Nama website', { exact: true }).fill('Conflict');
  await page.getByRole('button', { name: 'Simpan ke database' }).click();
  await page.getByText('Konflik revisi fixture', { exact: true }).waitFor();
  assert.equal(stored.settings.siteName, 'Saved Academy');
  checks++;
  console.log(`PASS: ${checks} browser checks (mock API/auth fixtures; no live DB or OAuth).`);
} finally { await browser.close(); }
