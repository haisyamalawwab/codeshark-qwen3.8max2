import { readFile } from 'node:fs/promises';
import { getTidbPool, closeTidbPool } from '../server/tidb.mjs';
import { exitIfLocalMode } from '../server/local-mode.mjs';

// MODE DATA: migrasi settings cloud dilewati HANYA bila DATA_MODE=local.
exitIfLocalMode('scripts/init-site-settings.mjs (db:settings:init)');
try {
  const source = await readFile(new URL('../db/settings-schema.sql', import.meta.url), 'utf8');
  for (const sql of source.replace(/^\s*--.*$/gm, '').split(';').map(s => s.trim()).filter(Boolean)) await getTidbPool().query(sql);
  console.log('Settings schema ready. Existing configuration is preserved.');
} catch {
  console.error('Settings migration failed. Check TiDB environment, TLS and database permissions.');
  process.exitCode = 1;
} finally { await closeTidbPool(); }
