import { getTidbPool } from './tidb.mjs';
import { resolveOwner } from './tidb-sync.mjs';
import { defaultSettings, validateSettings } from '../shared/site-settings.mjs';

class SettingsError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const query = (db, sql, values = []) => db.execute({ sql, timeout: 5000 }, values);
function decode(row) {
  return {
    settings: validateSettings(typeof row.settings_json === 'string' ? JSON.parse(row.settings_json) : row.settings_json),
    revision: Number(row.revision), updatedAt: row.updated_at, updatedBy: row.updated_by,
  };
}
export async function requireAdmin(req, env, request) {
  // Never accept guest identities, request roles, or user-editable user_metadata.
  const owner = await resolveOwner(req, {}, { ...env, NODE_ENV: 'production', TIDB_ALLOW_GUEST_SYNC: 'false' }, request);
  const ids = (env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
  if (!ids.length) throw new SettingsError(503, 'Daftar admin server belum dikonfigurasi.');
  if (!ids.includes(owner.slice(5))) throw new SettingsError(403, 'Akses khusus admin.');
  return owner;
}
export async function readSettings(db) {
  const [rows] = await query(db, 'SELECT settings_json, revision, updated_at, updated_by FROM cs_site_settings WHERE id=1');
  return rows.length ? decode(rows[0]) : { settings: defaultSettings(), revision: 0, updatedAt: null, updatedBy: null };
}
export async function saveSettings(db, settings, revision, actor) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await query(conn, 'INSERT IGNORE INTO cs_site_settings (id, settings_json, revision) VALUES (1, ?, 0)', [JSON.stringify(defaultSettings())]);
    const current = await readSettings({ execute: (options, values) => conn.execute({ ...options, sql: options.sql + ' FOR UPDATE' }, values) });
    if (current.revision !== revision) throw new SettingsError(409, 'Konfigurasi telah diubah admin lain. Muat ulang sebelum menyimpan.');
    await query(conn, 'UPDATE cs_site_settings SET settings_json=?, revision=revision+1, updated_by=? WHERE id=1', [JSON.stringify(settings), actor]);
    await query(conn, 'INSERT INTO cs_site_settings_audit (revision, actor_id, settings_json) VALUES (?, ?, ?)', [revision + 1, actor, JSON.stringify(settings)]);
    const saved = await readSettings(conn);
    await conn.commit();
    return saved;
  } catch (error) {
    await conn.rollback().catch(() => {});
    throw error;
  } finally { conn.release(); }
}
export function createSettingsHandler({ admin = false, env = process.env, pool = getTidbPool, request = fetch } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const methods = admin ? ['GET', 'PUT'] : ['GET'];
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    try {
      const actor = admin ? await requireAdmin(req, env, request) : null;
      let settings;
      if (req.method === 'PUT') {
        const body = req.body;
        if (!body || Object.keys(body).length !== 2 || !Object.hasOwn(body, 'settings') || !Number.isSafeInteger(body.revision) || body.revision < 0 || body.revision >= Number.MAX_SAFE_INTEGER) throw new SettingsError(400, 'Payload konfigurasi tidak valid.');
        if (Buffer.byteLength(JSON.stringify(body)) > 16384) throw new SettingsError(413, 'Konfigurasi terlalu besar.');
        try { settings = validateSettings(body.settings); } catch (error) { throw new SettingsError(400, error.message); }
      }
      const db = typeof pool === 'function' ? pool() : pool;
      const result = req.method === 'PUT' ? await saveSettings(db, settings, req.body.revision, actor) : await readSettings(db);
      // Public projection explicitly excludes administrator identities and audit history.
      return res.status(200).json({ ok: true, settings: result.settings, revision: result.revision, updatedAt: result.updatedAt, ...(admin ? { updatedBy: result.updatedBy } : {}) });
    } catch (error) {
      const status = error.status || 503;
      return res.status(status).json({ ok: false, error: error.status ? error.message : 'Konfigurasi website belum tersedia. Periksa koneksi database dan migrasi settings.' });
    }
  };
}
