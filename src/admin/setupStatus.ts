export const SETUP_FIELDS = {
  DB_PROVIDER: ['Provider database', 'Set DB_PROVIDER=tidb di environment server.'],
  TIDB_HOST: ['Host TiDB', 'Isi TIDB_HOST di environment server.'],
  TIDB_USER: ['User TiDB', 'Isi TIDB_USER dengan akun database aplikasi.'],
  TIDB_PASSWORD: ['Password TiDB', 'Isi TIDB_PASSWORD di .env lokal atau secret deployment, bukan di browser.'],
  TIDB_DATABASE: ['Database aplikasi', 'Isi TIDB_DATABASE; gunakan database aplikasi, bukan sys/mysql.'],
  TIDB_PORT: ['Port TiDB', 'Default 4000; ubah hanya jika cluster memerlukannya.'],
  TIDB_CA_PATH: ['CA file', 'Opsional: pilih CA path ATAU CA PEM, jangan keduanya. TLS tetap diverifikasi.'],
  TIDB_CA_CERT: ['CA PEM', 'Opsional: kosongkan kedua sumber CA untuk trusted roots Node.'],
  SUPABASE_URL: ['URL Auth server', 'Isi SUPABASE_URL dengan origin HTTPS project.'],
  SUPABASE_PUBLISHABLE_KEY: ['Publishable key server', 'Isi SUPABASE_PUBLISHABLE_KEY, bukan secret/service-role key.'],
  SUPABASE_ANON_KEY: ['Key Auth server (legacy)', 'Isi SUPABASE_PUBLISHABLE_KEY atau fallback SUPABASE_ANON_KEY.'],
  SUPABASE_JWKS_URL: ['JWKS Auth', 'Opsional: isi endpoint JWKS project yang sama. Kosong memakai verifier online legacy.'],
  AUTH_DATABASE_URL: ['Database Better Auth', 'Isi AUTH_DATABASE_URL dari Layerbase Connect, gunakan DATABASE_URL, atau lengkapi field HOST/username/database/PORT/password; server saja, bukan variable browser.'],
  DATABASE_URL: ['Database Better Auth (Layerbase)', 'Alternatif AUTH_DATABASE_URL: connection string MariaDB dari Layerbase Connect, atau gunakan field Layerbase terpisah. Jangan gunakan untuk Aiven MySQL.'],
  BETTER_AUTH_SECRET: ['Secret Better Auth', 'Generate dengan openssl rand -base64 32 dan isi hanya di environment server.'],
  BETTER_AUTH_URL: ['URL Better Auth', 'Isi origin aplikasi tanpa /api/auth; kosong memakai origin deployment yang terdeteksi.'],
  ADMIN_USER_IDS: ['Allowlist admin', 'Isi ADMIN_USER_IDS dengan ID user Auth yang diizinkan, lalu restart/deploy server.'],
  tidb_connection: ['Koneksi database', 'Lengkapi environment TiDB, periksa jaringan/TLS dan izin koneksi.'],
  settings_schema: ['Tabel konfigurasi & audit', 'Jika koneksi siap tetapi tabel belum siap, jalankan npm run db:settings:init secara terpisah.'],
} as const;
export type SetupId = keyof typeof SETUP_FIELDS;
export const SETUP_STATES = ['configured', 'ready', 'missing', 'invalid', 'failed', 'blocked', 'optional', 'unverified'] as const;
export type SetupState = typeof SETUP_STATES[number];
export interface SetupReport { checkedAt: string; cacheSeconds: number; items: Array<{ id: SetupId; status: SetupState }> }
export async function fetchSetupStatus(signal: AbortSignal): Promise<SetupReport> {
  const response = await fetch('/api/admin-setup', { signal, cache: 'no-store', headers: { Accept: 'application/json' } });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Setup API unavailable');
  const value = await response.json();
  const ids = new Set<string>();
  if (value?.ok !== true || typeof value.checkedAt !== 'string' || !Number.isFinite(Date.parse(value.checkedAt)) ||
    !Number.isFinite(value.cacheSeconds) || !Array.isArray(value.items) || value.items.length < 1 || value.items.length > Object.keys(SETUP_FIELDS).length ||
    !value.items.every((item: { id?: unknown; status?: unknown } | null) => {
      if (!item || typeof item.id !== 'string' || !Object.hasOwn(SETUP_FIELDS, item.id) || ids.has(item.id) || !SETUP_STATES.includes(item.status as SetupState)) return false;
      ids.add(item.id); return true;
    }) || !['DB_PROVIDER', 'TIDB_PASSWORD', 'ADMIN_USER_IDS', 'tidb_connection', 'settings_schema'].every(id => ids.has(id)) ||
    (!ids.has('SUPABASE_URL') && !ids.has('BETTER_AUTH_SECRET')) ||
    ((!ids.has('SUPABASE_PUBLISHABLE_KEY') && !ids.has('SUPABASE_ANON_KEY')) && !ids.has('BETTER_AUTH_SECRET'))) throw new Error('Invalid setup report');
  return value as SetupReport;
}
