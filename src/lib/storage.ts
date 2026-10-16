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

export interface DailyStreak {
  current: number;
  best: number;
  /** Tanggal aktivitas terakhir dalam format lokal YYYY-MM-DD */
  lastActiveDate: string | null;
}

export interface SaveData {
  profile: Profile | null;
  xp: number;
  coins: number;
  modules: Record<string, ModProg>;
  stats: Stats;
  streak: DailyStreak;
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
  streak: { current: 0, best: 0, lastActiveDate: null },
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
  const d = JSON.parse(raw) as Partial<SaveData> & { streak?: Partial<DailyStreak> };
  const base = defaultSave();
  const rawStreak = d.streak;
  const streak: DailyStreak = {
    current: typeof rawStreak?.current === "number" ? Math.max(0, rawStreak.current) : 0,
    best: typeof rawStreak?.best === "number" ? Math.max(0, rawStreak.best) : 0,
    lastActiveDate: typeof rawStreak?.lastActiveDate === "string" ? rawStreak.lastActiveDate : null,
  };
  return {
    ...base,
    ...d,
    stats: { ...base.stats, ...(d.stats || {}) },
    modules: { ...(d.modules || {}) },
    streak,
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
  { xp: 0, name: "Kadet Baru" },
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

/* ============ DAILY STREAK SYSTEM ============ */

/** Format tanggal lokal perangkat YYYY-MM-DD */
export function getLocalDateString(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Hitung selisih hari kalender antara dua tanggal YYYY-MM-DD (toDate - fromDate) */
export function getCalendarDayDiff(fromDate: string, toDate: string): number {
  const [y1, m1, d1] = fromDate.split("-").map(Number);
  const [y2, m2, d2] = toDate.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const msDiff = date2.getTime() - date1.getTime();
  return Math.round(msDiff / (1000 * 60 * 60 * 24));
}

export interface StreakStatus {
  /** Streak hari berturut-turut yang sedang berjalan (0 jika sudah putus) */
  current: number;
  /** Rekor streak terbaik sepanjang masa */
  best: number;
  /** Tanggal aktivitas terakhir YYYY-MM-DD */
  lastActiveDate: string | null;
  /** True jika pemain sudah latihan di hari ini */
  practicedToday: boolean;
  /** True jika streak masih menyala (latihan hari ini atau kemarin) */
  isStreakActive: boolean;
  /** Berapa hari bolong (0 jika aman) */
  daysMissed: number;
}

/** Evaluasi status streak terkini tanpa memutasi data */
export function evaluateStreak(streak?: DailyStreak | null, now: number = Date.now()): StreakStatus {
  const s = streak ?? { current: 0, best: 0, lastActiveDate: null };
  if (!s.lastActiveDate || s.current <= 0) {
    return {
      current: 0,
      best: s.best,
      lastActiveDate: s.lastActiveDate,
      practicedToday: false,
      isStreakActive: false,
      daysMissed: 0,
    };
  }

  const today = getLocalDateString(now);
  const diff = getCalendarDayDiff(s.lastActiveDate, today);

  if (diff <= 0) {
    // Sudah latihan hari ini (atau di hari yang sama)
    return {
      current: s.current,
      best: Math.max(s.best, s.current),
      lastActiveDate: s.lastActiveDate,
      practicedToday: true,
      isStreakActive: true,
      daysMissed: 0,
    };
  } else if (diff === 1) {
    // Latihan kemarin: streak masih hidup, hari ini belum latihan
    return {
      current: s.current,
      best: Math.max(s.best, s.current),
      lastActiveDate: s.lastActiveDate,
      practicedToday: false,
      isStreakActive: true,
      daysMissed: 0,
    };
  } else {
    // Lewat lebih dari 1 hari kalender: streak putus
    return {
      current: 0,
      best: s.best,
      lastActiveDate: s.lastActiveDate,
      practicedToday: false,
      isStreakActive: false,
      daysMissed: diff - 1,
    };
  }
}

/** Catat sesi latihan dan perbarui hitungan streak */
export function recordDailyStreak(streak?: DailyStreak | null, now: number = Date.now()): {
  nextStreak: DailyStreak;
  increased: boolean;
  status: StreakStatus;
} {
  const current = streak ?? { current: 0, best: 0, lastActiveDate: null };
  const today = getLocalDateString(now);

  if (current.lastActiveDate === today) {
    // Sudah dicatat hari ini, streak tidak perlu dihitung ganda
    const status = evaluateStreak(current, now);
    return { nextStreak: current, increased: false, status };
  }

  let nextCurrent = 1;
  if (current.lastActiveDate) {
    const diff = getCalendarDayDiff(current.lastActiveDate, today);
    if (diff === 1) {
      // Berturut-turut hari berikutnya!
      nextCurrent = current.current + 1;
    } else {
      // Putus / mulai baru
      nextCurrent = 1;
    }
  }

  const nextBest = Math.max(current.best, nextCurrent);
  const nextStreak: DailyStreak = {
    current: nextCurrent,
    best: nextBest,
    lastActiveDate: today,
  };

  const status = evaluateStreak(nextStreak, now);
  return { nextStreak, increased: true, status };
}

