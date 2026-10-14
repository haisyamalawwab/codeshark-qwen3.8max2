/* Lapisan penyimpanan lokal (localStorage, namespace codeshark:v1).
    Sejak v0.1 MVP hingga v0.9 pilihan paling tepat — SQLite browser (sql.js/WASM)
    bisa dipertimbangkan bila data makin kompleks. */

export type AgeId = "junior" | "teen" | "senior" | "academy";

export interface Profile {
  name: string;
  age: AgeId;
  sound: boolean;
  createdAt: number;
}

export interface Best {
  stars: number;
  score: number;
  accuracy: number;
  wpm: number;
}

export interface ModProg {
  materiDone: boolean;
  quizXp: number;
  best?: Best;
  completions: number;
  /** sesi (misi/quest/drill/juggling) sudah memenuhi target akurasi */
  passed?: boolean;
  /** XP & koin tertinggi yang pernah dihitung — hanya selisih di atasnya yang diberikan (anti-farm) */
  xpBest?: number;
  coinsBest?: number;
}

export interface Stats {
  games: number;
  wins: number;
  bestWpm: number;
  bestCombo: number;
  keystrokes: number;
  correct: number;
}

export interface SaveData {
  profile: Profile | null;
  xp: number;
  coins: number;
  modules: Record<string, ModProg>;
  stats: Stats;
  /** identitas perangkat untuk sync NeonDB (stabil antar sesi) */
  deviceId: string;
  updatedAt: number;
}

const KEY = "codeshark:save:v1";
const DEVICE_KEY = "codeshark:device:v1";
const SAVE_PREFIX = "codeshark:save:v1:";

/** Kunci save per-user — satu perangkat bisa dipakai banyak anak tanpa tabrakan. */
export function saveKeyFor(userId?: string | null): string {
  if (!userId || userId === "guest") return KEY;
  return `${SAVE_PREFIX}${userId}`;
}

export function listLocalUserIds(): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(SAVE_PREFIX)) out.push(k.slice(SAVE_PREFIX.length));
    }
  } catch {
    /* abaikan */
  }
  return out;
}

export function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "web";
  }
}

export const defaultSave = (): SaveData => ({
  profile: null,
  xp: 0,
  coins: 0,
  modules: {},
  stats: { games: 0, wins: 0, bestWpm: 0, bestCombo: 0, keystrokes: 0, correct: 0 },
  deviceId: deviceId(),
  updatedAt: Date.now(),
});

export function loadSaveFor(userId?: string | null): SaveData {
  try {
    const raw = localStorage.getItem(saveKeyFor(userId));
    if (!raw) {
      // migrasi: save lama tanpa userId pindah ke namespace baru sekali saja
      if (userId && userId !== "guest") {
        const legacy = localStorage.getItem(KEY);
        if (legacy) {
          try {
            localStorage.setItem(saveKeyFor(userId), legacy);
          } catch { /* abaikan */ }
          return parseSave(legacy);
        }
      }
      return defaultSave();
    }
    return parseSave(raw);
  } catch {
    return defaultSave();
  }
}

function parseSave(raw: string): SaveData {
  const d = JSON.parse(raw) as Partial<SaveData>;
  const base = defaultSave();
  return {
    ...base,
    ...d,
    stats: { ...base.stats, ...(d.stats || {}) },
    modules: { ...(d.modules || {}) },
    deviceId: typeof d.deviceId === "string" && d.deviceId ? d.deviceId : base.deviceId,
    updatedAt: typeof d.updatedAt === "number" ? d.updatedAt : 0,
  };
}

export function loadSave(): SaveData {
  try {
    const last = localStorage.getItem("codeshark:lastUser:v1");
    if (last && last !== "guest") return loadSaveFor(last);
  } catch { /* abaikan */ }
  return loadSaveFor(null);
}

export function persistFor(s: SaveData, userId?: string | null) {
  try {
    localStorage.setItem(saveKeyFor(userId), JSON.stringify({ ...s, updatedAt: Date.now() }));
  } catch {
    /* storage penuh / private mode — abaikan */
  }
}

export function persist(s: SaveData) {
  try {
    const last = localStorage.getItem("codeshark:lastUser:v1");
    persistFor(s, last && last !== "guest" ? last : null);
  } catch {
    persistFor(s, null);
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}

/* ============ RANK SYSTEM ============ */
export interface Rank {
  xp: number;
  name: string;
}

export const RANKS: Rank[] = [
  { xp: 0, name: "Plankton" },
  { xp: 120, name: "Ikan Kecil" },
  { xp: 280, name: "Kuda Laut" },
  { xp: 500, name: "Lumba-Lumba" },
  { xp: 800, name: "Hiu Muda" },
  { xp: 1200, name: "Megalodon" },
  { xp: 1700, name: "Legenda Samudra" },
];

export function rankOf(xp: number): { cur: Rank; next: Rank | null; pct: number } {
  let cur = RANKS[0];
  let next: Rank | null = null;
  for (const r of RANKS) {
    if (xp >= r.xp) cur = r;
    else {
      next = r;
      break;
    }
  }
  const pct = next
    ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100))
    : 100;
  return { cur, next, pct };
}
