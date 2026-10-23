import { createDatabaseStatusService } from './database-status.mjs';

const SETTINGS_QUERIES = [
  'SELECT id, settings_json, revision, updated_by, updated_at FROM cs_site_settings LIMIT 0',
  'SELECT revision, actor_id, settings_json, created_at FROM cs_site_settings_audit LIMIT 0',
];
// Public bootstrap diagnostics: fixed names/statuses only. No credentials, user IDs,
// row contents, or raw errors. This does NOT grant access to admin settings.
export function createAdminSetupHandler(dependencies = {}) {
  const env = dependencies.env || process.env;
  const inspect = createDatabaseStatusService({ ...dependencies, queries: SETTINGS_QUERIES });
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    try {
      const report = await inspect();
      const items = report.environment.map(field => ({
        id: field.name,
        status: field.status === 'set' ? 'configured' : field.status === 'missing' ? 'missing' : field.status === 'invalid' ? 'invalid' : 'optional',
      }));
      const ids = (env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
      items.push({ id: 'ADMIN_USER_IDS', status: ids.length && ids.every(id => !/[<>•\s]/.test(id)) ? 'configured' : 'missing' });
      items.push({ id: 'tidb_connection', status: report.database === 'connected' ? 'ready' : report.state === 'connection_failed' || report.state === 'timeout' ? 'failed' : report.state === 'config_invalid' ? 'invalid' : 'blocked' });
      items.push({ id: 'settings_schema', status: report.schema === 'ready' ? 'ready' : report.schema === 'missing' ? 'failed' : 'blocked' });
      // Deliberately exclude optional privileged keys: not prerequisites for user auth.
      return res.status(200).json({ ok: true, checkedAt: report.checkedAt, cacheSeconds: 30, items });
    } catch {
      return res.status(503).json({ ok: false, error: 'Setup status unavailable' });
    }
  };
}
