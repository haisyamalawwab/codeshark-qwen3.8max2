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
  /** Total baris kode yang berhasil diketik sepanjang sesi */
  linesTyped: number;
}

export interface DailyStreak {
  current: number;
  best: number;
  /** Tanggal aktivitas terakhir dalam format lokal YYYY-MM-DD */
  lastActiveDate: string | null;
}

export interface DailyChallengeAttempt {
  /** Tanggal penyelesaian dalam format lokal YYYY-MM-DD */
  date: string;
  /** Judul tantangan harian */
  title: string;
  /** Bahasa tantangan (html | css | js) */
  lang?: string;
  /** Skor yang diperoleh */
  score: number;
  /** Akurasi ketikan dalam persen (0-100) */
  accuracy: number;
  /** Kecepatan ketik (WPM) */
  wpm?: number;
  /** Bintang yang diraih */
  stars?: number;
  /** Waktu penyelesaian dalam detik */
  timeSec?: number;
  /** Waktu timestamp milidetik */
  completedAt: number;
}

export interface DailyChallengeRecord {
  /** Tanggal tantangan terakhir yang diselesaikan (YYYY-MM-DD) */
  lastCompletedDate: string | null;
  /** Skor terbaik tantangan hari ini */
  todayScore?: number;
  /** Akurasi terbaik tantangan hari ini */
  todayAccuracy?: number;
  /** Total tantangan harian yang telah diselesaikan */
  totalCompleted: number;
  /** Riwayat seluruh percobaan tantangan harian yang tuntas */
  history?: DailyChallengeAttempt[];
}

export interface SaveData {
  profile: Profile | null;
  xp: number;
  coins: number;
  modules: Record<string, ModProg>;
  stats: Stats;
  streak: DailyStreak;
  dailyChallenge: DailyChallengeRecord;
  /** Riwayat login harian beruntun */
  loginStreak?: DailyStreak;
  /** Milestone streak permanen yang telah dibuka (daftar tier index: 0, 1, 2, ...) */
  unlockedStreakMilestones?: number[];
  /** Timestamp buka tier streak (tier -> timestamp) */
  unlockedStreakTiers?: Record<number, number>;
  /** Lencana prestasi yang sudah diklaim hadiahnya (id -> timestamp klaim) */
  claimedAchievements?: Record<string, number>;
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
  stats: { games: 0, wins: 0, bestWpm: 0, bestCombo: 0, keystrokes: 0, correct: 0, linesTyped: 0 },
  streak: { current: 0, best: 0, lastActiveDate: null },
  dailyChallenge: {
    lastCompletedDate: null,
    totalCompleted: 0,
    history: [],
  },
  loginStreak: { current: 1, best: 1, lastActiveDate: null },
  unlockedStreakMilestones: [0],
  unlockedStreakTiers: { 0: Date.now() },
  claimedAchievements: {},
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
  const d = JSON.parse(raw) as Partial<SaveData> & {
    streak?: Partial<DailyStreak>;
    dailyChallenge?: Partial<DailyChallengeRecord>;
    claimedAchievements?: Record<string, number>;
  };
  const base = defaultSave();
  const rawStreak = d.streak;
  const streak: DailyStreak = {
    current: typeof rawStreak?.current === "number" ? Math.max(0, rawStreak.current) : 0,
    best: typeof rawStreak?.best === "number" ? Math.max(0, rawStreak.best) : 0,
    lastActiveDate: typeof rawStreak?.lastActiveDate === "string" ? rawStreak.lastActiveDate : null,
  };
  const rawDaily = d.dailyChallenge;
  const rawHist = rawDaily?.history;
  const history: DailyChallengeAttempt[] = Array.isArray(rawHist)
    ? rawHist.filter((h) => h && typeof h.score === "number" && typeof h.accuracy === "number")
    : [];

  if (history.length === 0 && rawDaily?.lastCompletedDate && typeof rawDaily?.todayScore === "number") {
    history.push({
      date: rawDaily.lastCompletedDate,
      title: "Tantangan Harian Samudra",
      lang: "html",
      score: rawDaily.todayScore,
      accuracy: rawDaily.todayAccuracy ?? 95,
      wpm: 42,
      stars: 3,
      completedAt: Date.now() - 3600000,
    });
  }

  const dailyChallenge: DailyChallengeRecord = {
    lastCompletedDate: typeof rawDaily?.lastCompletedDate === "string" ? rawDaily.lastCompletedDate : null,
    todayScore: typeof rawDaily?.todayScore === "number" ? rawDaily.todayScore : undefined,
    todayAccuracy: typeof rawDaily?.todayAccuracy === "number" ? rawDaily.todayAccuracy : undefined,
    totalCompleted: typeof rawDaily?.totalCompleted === "number" ? Math.max(0, rawDaily.totalCompleted) : 0,
    history,
  };
  const rawStats = d.stats;
  const stats: Stats = {
    games: typeof rawStats?.games === "number" ? rawStats.games : 0,
    wins: typeof rawStats?.wins === "number" ? rawStats.wins : 0,
    bestWpm: typeof rawStats?.bestWpm === "number" ? rawStats.bestWpm : 0,
    bestCombo: typeof rawStats?.bestCombo === "number" ? rawStats.bestCombo : 0,
    keystrokes: typeof rawStats?.keystrokes === "number" ? rawStats.keystrokes : 0,
    correct: typeof rawStats?.correct === "number" ? rawStats.correct : 0,
    linesTyped: typeof rawStats?.linesTyped === "number"
      ? Math.max(0, rawStats.linesTyped)
      : Math.max(0, Math.floor((rawStats?.correct ?? 0) / 18)),
  };
  const claimedAchievements = (d.claimedAchievements && typeof d.claimedAchievements === "object")
    ? { ...d.claimedAchievements }
    : {};
  const rawLoginStreak = d.loginStreak;
  const loginStreak: DailyStreak = {
    current: typeof rawLoginStreak?.current === "number" ? Math.max(0, rawLoginStreak.current) : 1,
    best: typeof rawLoginStreak?.best === "number" ? Math.max(0, rawLoginStreak.best) : 1,
    lastActiveDate: typeof rawLoginStreak?.lastActiveDate === "string" ? rawLoginStreak.lastActiveDate : null,
  };
  const unlockedStreakMilestones: number[] = Array.isArray(d.unlockedStreakMilestones) && d.unlockedStreakMilestones.length > 0
    ? [...d.unlockedStreakMilestones]
    : [0];
  const unlockedStreakTiers: Record<number, number> = (d.unlockedStreakTiers && typeof d.unlockedStreakTiers === "object")
    ? { ...d.unlockedStreakTiers }
    : { 0: Date.now() };

  return {
    ...base,
    ...d,
    stats,
    modules: { ...(d.modules || {}) },
    streak,
    dailyChallenge,
    loginStreak,
    unlockedStreakMilestones,
    unlockedStreakTiers,
    claimedAchievements,
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

/** Cek apakah tantangan harian hari ini sudah diselesaikan */
export function isDailyCompletedToday(save: SaveData, now: number = Date.now()): boolean {
  const today = getLocalDateString(now);
  return save.dailyChallenge?.lastCompletedDate === today;
}


