-- CodeShark / SQLite lokal (mode lokal sementara — docs/036_mode-lokal_26102026_0819.md).
-- Dipakai browser via sql.js (src/lib/gameDb.ts) untuk backup .sqlite.
-- Cermin longgar tabel cloud cs_* (db/tidb-schema.sql) agar kelak mudah
-- diimpor kembali ke TiDB Cloud/Aiven. TIDAK ada kredensial di file ini.
-- Buka hasil backup dengan: DB Browser for SQLite / `sqlite3 backup.sqlite .tables`

CREATE TABLE IF NOT EXISTS cs_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cs_saves (
  owner_id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  -- SaveData lengkap (JSON) — sumber yang sama dengan localStorage codeshark:save:v1
  save_data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cs_attempts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  won INTEGER NOT NULL,
  stars INTEGER NOT NULL,
  score INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  wpm REAL NOT NULL,
  max_combo INTEGER NOT NULL,
  xp_award INTEGER NOT NULL,
  coins_award INTEGER NOT NULL,
  passed INTEGER NOT NULL,
  played_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS cs_attempts_time ON cs_attempts(played_at);

INSERT OR IGNORE INTO cs_meta (key, value) VALUES ('schema_version', '001_local_sqlite');
