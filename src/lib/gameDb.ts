/* Adapter penyimpanan siap-SQLite.
   Hari ini: localStorage. sql.js sudah terinstal tapi hanya di-load
   on-demand via initSqlite() (chunk game-sql terpisah, tak membebani first paint).
   API ini tidak berubah, jadi App.tsx tidak perlu disentuh lagi. */

import type { SaveData } from "./storage";
import type { AttemptRecord } from "./history";
import { loadHistory } from "./history";

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

/** Snapshot penuh untuk upload / backup — format yang kelak jadi tabel SQLite + Neon. */
export interface GameSnapshot {
  provider: DbProvider;
  save: SaveData;
  attempts: AttemptRecord[];
  exportedAt: number;
}

export function exportSnapshot(save: SaveData): GameSnapshot {
  return { provider: getProvider(), save, attempts: loadHistory(), exportedAt: Date.now() };
}

export function downloadSnapshot(save: SaveData) {
  const blob = new Blob([JSON.stringify(exportSnapshot(save), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `codeshark-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** Dipanggil saat user memilih mode SQLite di masa depan. Sekarang fallback aman. */
export async function initSqlite(): Promise<DbProvider> {
  try {
    const mod = await import("sql.js").catch(() => null);
    if (!mod) return "localStorage";
    setProvider("sqlite");
    return "sqlite";
  } catch {
    return "localStorage";
  }
}
