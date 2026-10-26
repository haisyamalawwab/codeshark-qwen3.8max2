/* Adapter penyimpanan lokal — dipakai pada mode lokal/efektif-lokal (lihat featureFlags.ts).
   ------------------------------------------------------------
   Sumber kebenaran saat runtime tetap localStorage (storage.ts +
   history.ts): sinkron, tanpa WASM, aman untuk first paint & HP.

   SQLite (sql.js/WASM) di-load ON-DEMAND saja (chunk game-sql):
   - initSqlite()  → bangun database SQLite in-memory dari snapshot
                     localStorage saat ini (tabel cs_meta/cs_saves/cs_attempts).
   - exportSqliteBackup() → unduh berkas .sqlite asli hasil db.export()
                     yang bisa dibuka di DB Browser for SQLite / sqlite3 CLI.
   Skema versi file: db/sqlite-schema.sql.

   Koneksi cloud (TiDB Cloud/Aiven) TIDAK dipakai modul ini. */

import type { SaveData } from "./storage";
import { loadSave } from "./storage";
import type { AttemptRecord } from "./history";
import { loadHistory } from "./history";
import type initSqlJs from "sql.js";

/* Tipe Database sql.js diturunkan dari konstruktor SqlJsStatic
   (paket @types/sql.js tidak mengekspor nama Database secara stabil). */
type SqlJsStatic = Awaited<ReturnType<typeof initSqlJs>>;
type Database = InstanceType<SqlJsStatic["Database"]>;

export type DbProvider = "localStorage" | "sqlite";
const PROVIDER_KEY = "codeshark:db:v1";

export function getProvider(): DbProvider {
  try {
    return localStorage.getItem(PROVIDER_KEY) === "sqlite" ? "sqlite" : "localStorage";
  } catch {
    return "localStorage";
  }
}

export function setProvider(p: DbProvider) {
  try {
    localStorage.setItem(PROVIDER_KEY, p);
  } catch {
    /* abaikan */
  }
}

/* ---------- info penyimpanan lokal (untuk kartu status) ---------- */

/** Perkiraan ukuran semua kunci codeshark:* di localStorage (byte, UTF-16). */
export function localStorageUsage(): { bytes: number; keys: number } {
  let bytes = 0;
  let keys = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("codeshark:")) continue;
      keys++;
      bytes += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2;
    }
  } catch {
    /* abaikan */
  }
  return { bytes, keys };
}

/* ---------- snapshot JSON (backup / pindah perangkat) ---------- */

/** Snapshot penuh untuk backup — bentuknya sama dengan isi tabel SQLite. */
export interface GameSnapshot {
  provider: DbProvider;
  save: SaveData;
  attempts: AttemptRecord[];
  exportedAt: number;
}

export function exportSnapshot(save: SaveData): GameSnapshot {
  return { provider: getProvider(), save, attempts: loadHistory(), exportedAt: Date.now() };
}

function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function downloadSnapshot(save: SaveData) {
  const blob = new Blob([JSON.stringify(exportSnapshot(save), null, 2)], { type: "application/json" });
  downloadBlob(blob, `codeshark-backup-${new Date().toISOString().slice(0, 10)}.json`);
}

/* ---------- SQLite sungguhan via sql.js (lazy) ---------- */

/* Cermin db/sqlite-schema.sql — ubah keduanya bersamaan. */
const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS cs_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cs_saves (
  owner_id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
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
`;

let sqliteDb: Database | null = null;
let sqlitePending: Promise<Database> | null = null;

async function ensureSqlite(): Promise<Database> {
  if (sqliteDb) return sqliteDb;
  if (!sqlitePending) {
    sqlitePending = (async () => {
      /* import dinamis: WASM sql.js dibundel Vite sebagai aset (?url),
         jadi tidak ada unduhan dari CDN dan tetap bekerja offline/PWA. */
      const [{ default: initSqlJs }, { default: wasmUrl }] = await Promise.all([
        import("sql.js"),
        import("sql.js/dist/sql-wasm.wasm?url"),
      ]);
      const SQL = await initSqlJs({ locateFile: () => wasmUrl });
      const db = new SQL.Database();
      db.run(SQLITE_SCHEMA);
      sqliteDb = db;
      return db;
    })().catch((error) => {
      sqlitePending = null; // izinkan coba lagi pada klik berikutnya
      throw error;
    });
  }
  return sqlitePending;
}

/** Tulis snapshot localStorage saat ini ke tabel SQLite (idempoten). */
function writeSnapshotToSqlite(db: Database, save: SaveData, attempts: AttemptRecord[]) {
  const ownerId = save.profile?.name ? `guest:${save.profile.name.trim().toLowerCase()}` : "guest";
  db.run("BEGIN TRANSACTION");
  try {
    db.run("INSERT OR REPLACE INTO cs_meta (key, value) VALUES (?, ?)", ["schema_version", "001_local_sqlite"]);
    db.run("INSERT OR REPLACE INTO cs_meta (key, value) VALUES (?, ?)", ["exported_at", String(Date.now())]);
    db.run(
      "INSERT OR REPLACE INTO cs_saves (owner_id, device_id, xp, coins, save_data, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [ownerId, save.deviceId, save.xp, save.coins, JSON.stringify(save), save.updatedAt || Date.now()],
    );
    db.run("DELETE FROM cs_attempts");
    for (const a of attempts) {
      db.run(
        "INSERT OR REPLACE INTO cs_attempts (id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          a.id, a.sessionId, a.won ? 1 : 0, a.stars, a.score, a.accuracy, a.wpm,
          a.maxCombo, a.xpAward, a.coinsAward, a.passed ? 1 : 0, a.at,
        ],
      );
    }
    db.run("COMMIT");
  } catch (error) {
    try { db.run("ROLLBACK"); } catch { /* abaikan */ }
    throw error;
  }
}

/**
 * Aktifkan SQLite: muat sql.js, buat database, dan isi dari data
 * localStorage saat ini. Gagal → tetap localStorage (tidak pernah
 * mengklaim "sqlite" bila WASM gagal dimuat).
 */
export async function initSqlite(): Promise<DbProvider> {
  try {
    const db = await ensureSqlite();
    writeSnapshotToSqlite(db, loadSave(), loadHistory());
    setProvider("sqlite");
    return "sqlite";
  } catch {
    return getProvider();
  }
}

/** Unduh database SQLite (.sqlite) berisi save + riwayat saat ini. */
export async function exportSqliteBackup(save: SaveData): Promise<void> {
  const db = await ensureSqlite();
  writeSnapshotToSqlite(db, save, loadHistory());
  setProvider("sqlite");
  const bytes = db.export();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/vnd.sqlite3" });
  downloadBlob(blob, `codeshark-backup-${new Date().toISOString().slice(0, 10)}.sqlite`);
}
