import type { SaveData, DailyStreak } from "./storage";
import { getLocalDateString, getCalendarDayDiff } from "./storage";

export interface StreakMultiplierTier {
  tier: number;
  name: string;
  subtitle: string;
  streakRequired: number;
  multiplier: number;
  bonusPercent: number;
  color: string;
  glowColor: string;
  badgeBg: string;
  iconChar: string;
  description: string;
}

export const STREAK_MULTIPLIER_TIERS: StreakMultiplierTier[] = [
  {
    tier: 0,
    name: "Kadet Samudra",
    subtitle: "Tingkat Dasar",
    streakRequired: 0,
    multiplier: 1.0,
    bonusPercent: 0,
    color: "#94a3b8",
    glowColor: "rgba(148, 163, 184, 0.3)",
    badgeBg: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
    iconChar: "⚓",
    description: "Selesaikan 3 hari login berturut-turut untuk membuka Pengali Streak perdanamu!",
  },
  {
    tier: 1,
    name: "Percikan Samudra",
    subtitle: "3 Hari Streak",
    streakRequired: 3,
    multiplier: 1.1,
    bonusPercent: 10,
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.45)",
    badgeBg: "linear-gradient(135deg, rgba(8, 47, 73, 0.9) 0%, rgba(3, 28, 48, 0.95) 100%)",
    iconChar: "⚡",
    description: "Bonus permanen +10% XP & Koin untuk setiap misi yang berhasil diselesaikan.",
  },
  {
    tier: 2,
    name: "Arus Kilat",
    subtitle: "7 Hari Streak (1 Minggu)",
    streakRequired: 7,
    multiplier: 1.25,
    bonusPercent: 25,
    color: "#2ee6c8",
    glowColor: "rgba(46, 230, 200, 0.55)",
    badgeBg: "linear-gradient(135deg, rgba(6, 44, 48, 0.9) 0%, rgba(3, 28, 32, 0.95) 100%)",
    iconChar: "🌊",
    description: "Bonus permanen +25% XP & Koin untuk setiap misi yang berhasil diselesaikan.",
  },
  {
    tier: 3,
    name: "Gelombang Badai",
    subtitle: "14 Hari Streak (2 Minggu)",
    streakRequired: 14,
    multiplier: 1.4,
    bonusPercent: 40,
    color: "#c084fc",
    glowColor: "rgba(192, 132, 252, 0.55)",
    badgeBg: "linear-gradient(135deg, rgba(46, 16, 77, 0.9) 0%, rgba(24, 9, 44, 0.95) 100%)",
    iconChar: "🌪️",
    description: "Bonus permanen +40% XP & Koin untuk setiap misi yang berhasil diselesaikan.",
  },
  {
    tier: 4,
    name: "Pusaran Megalodon",
    subtitle: "21 Hari Streak (3 Minggu)",
    streakRequired: 21,
    multiplier: 1.65,
    bonusPercent: 65,
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    badgeBg: "linear-gradient(135deg, rgba(69, 36, 6, 0.9) 0%, rgba(41, 20, 3, 0.95) 100%)",
    iconChar: "🦈",
    description: "Bonus permanen +65% XP & Koin untuk setiap misi yang berhasil diselesaikan.",
  },
  {
    tier: 5,
    name: "Legenda Samudra",
    subtitle: "30 Hari Streak (1 Bulan Penuh)",
    streakRequired: 30,
    multiplier: 2.0,
    bonusPercent: 100,
    color: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.7)",
    badgeBg: "linear-gradient(135deg, rgba(76, 5, 25, 0.9) 0%, rgba(43, 3, 14, 0.95) 100%)",
    iconChar: "👑",
    description: "2× DOUBLE XP & Koin Permanen! Pangkat pengali tertinggi di seluruh samudra koding.",
  },
];

/** Ambil tier multiplier berdasarkan jumlah hari streak tertentu */
export function getTierForStreakDays(days: number): StreakMultiplierTier {
  let highest = STREAK_MULTIPLIER_TIERS[0];
  for (const t of STREAK_MULTIPLIER_TIERS) {
    if (days >= t.streakRequired) {
      highest = t;
    }
  }
  return highest;
}

/** Hitung tier permanen yang sudah dibuka oleh pemain berdasarkan save data */
export function getPermanentStreakTier(save: SaveData): StreakMultiplierTier {
  // Hitung streak terbaik dari all-time streak practice maupun login
  const bestPractice = save.streak?.best ?? 0;
  const currentPractice = save.streak?.current ?? 0;
  const bestLogin = save.loginStreak?.best ?? 0;
  const currentLogin = save.loginStreak?.current ?? 0;
  const maxStreakDays = Math.max(bestPractice, currentPractice, bestLogin, currentLogin);

  // Periksa juga unlockedStreakMilestones jika ada
  let highestTierIndex = 0;
  if (Array.isArray(save.unlockedStreakMilestones)) {
    for (const t of save.unlockedStreakMilestones) {
      if (typeof t === "number" && t > highestTierIndex && t < STREAK_MULTIPLIER_TIERS.length) {
        highestTierIndex = t;
      }
    }
  }

  const streakTier = getTierForStreakDays(maxStreakDays);
  if (streakTier.tier > highestTierIndex) {
    highestTierIndex = streakTier.tier;
  }

  return STREAK_MULTIPLIER_TIERS[highestTierIndex];
}

/** Ambil tier berikutnya yang belum terbuka */
export function getNextStreakTier(currentTier: StreakMultiplierTier): StreakMultiplierTier | null {
  const nextIdx = currentTier.tier + 1;
  if (nextIdx < STREAK_MULTIPLIER_TIERS.length) {
    return STREAK_MULTIPLIER_TIERS[nextIdx];
  }
  return null;
}

/** Terapkan pengali streak ke perolehan XP dan Koin */
export function applyStreakMultiplier(
  baseXp: number,
  baseCoins: number,
  tier: StreakMultiplierTier
): {
  baseXp: number;
  baseCoins: number;
  bonusXp: number;
  bonusCoins: number;
  totalXp: number;
  totalCoins: number;
  multiplier: number;
  tier: StreakMultiplierTier;
} {
  const bonusXp = Math.round(baseXp * (tier.multiplier - 1));
  const bonusCoins = Math.round(baseCoins * (tier.multiplier - 1));

  return {
    baseXp,
    baseCoins,
    bonusXp,
    bonusCoins,
    totalXp: baseXp + bonusXp,
    totalCoins: baseCoins + bonusCoins,
    multiplier: tier.multiplier,
    tier,
  };
}

/**
 * Catat aktivitas login harian dan perbarui login streak.
 * Jika pemain mencapai rekor streak baru yang membuka tier baru,
 * kembalikan newlyUnlockedTier untuk memicu perayaan.
 */
export function recordDailyLoginStreak(
  save: SaveData,
  now: number = Date.now()
): {
  nextSave: SaveData;
  newlyUnlockedTier: StreakMultiplierTier | null;
  isNewDay: boolean;
} {
  const today = getLocalDateString(now);
  const currentLogin = save.loginStreak ?? {
    current: 0,
    best: 0,
    lastActiveDate: null,
  };

  let nextCurrent = currentLogin.current;
  let isNewDay = false;

  if (currentLogin.lastActiveDate === today) {
    // Sudah login hari ini
    nextCurrent = Math.max(1, currentLogin.current);
  } else if (!currentLogin.lastActiveDate) {
    // Login perdana
    nextCurrent = 1;
    isNewDay = true;
  } else {
    const diff = getCalendarDayDiff(currentLogin.lastActiveDate, today);
    if (diff === 1) {
      // Login hari berikutnya beruntun!
      nextCurrent = currentLogin.current + 1;
      isNewDay = true;
    } else {
      // Bolong lebih dari 1 hari -> mulai hitungan baru hari ini
      nextCurrent = 1;
      isNewDay = true;
    }
  }

  const nextBest = Math.max(currentLogin.best, nextCurrent);
  const updatedLoginStreak: DailyStreak = {
    current: nextCurrent,
    best: nextBest,
    lastActiveDate: today,
  };

  // Evaluasi pembukaan tier baru
  const prevTier = getPermanentStreakTier(save);
  const highestStreak = Math.max(
    save.streak?.best ?? 0,
    save.streak?.current ?? 0,
    nextBest,
    nextCurrent
  );

  const potentialTier = getTierForStreakDays(highestStreak);
  let newlyUnlockedTier: StreakMultiplierTier | null = null;

  const prevMilestones = new Set(save.unlockedStreakMilestones ?? [0]);
  if (potentialTier.tier > prevTier.tier || !prevMilestones.has(potentialTier.tier)) {
    for (let t = 0; t <= potentialTier.tier; t++) {
      prevMilestones.add(t);
    }
    if (potentialTier.tier > prevTier.tier) {
      newlyUnlockedTier = potentialTier;
    }
  }

  const updatedMilestones = Array.from(prevMilestones).sort((a, b) => a - b);
  const updatedTiers = { ...(save.unlockedStreakTiers ?? {}) };
  if (newlyUnlockedTier) {
    updatedTiers[newlyUnlockedTier.tier] = now;
  }

  return {
    nextSave: {
      ...save,
      loginStreak: updatedLoginStreak,
      unlockedStreakMilestones: updatedMilestones,
      unlockedStreakTiers: updatedTiers,
    },
    newlyUnlockedTier,
    isNewDay,
  };
}

/**
 * Cek dan buka tier jika streak latihan bertambah saat menyelesaikan misi.
 */
export function checkStreakMilestoneUnlocked(
  save: SaveData,
  streakDays: number,
  now: number = Date.now()
): {
  nextSave: SaveData;
  newlyUnlockedTier: StreakMultiplierTier | null;
} {
  const currentTier = getPermanentStreakTier(save);
  const potentialTier = getTierForStreakDays(streakDays);

  if (potentialTier.tier > currentTier.tier) {
    const milestones = new Set(save.unlockedStreakMilestones ?? [0]);
    for (let t = 0; t <= potentialTier.tier; t++) {
      milestones.add(t);
    }
    const updatedTiers = { ...(save.unlockedStreakTiers ?? {}) };
    updatedTiers[potentialTier.tier] = now;

    return {
      nextSave: {
        ...save,
        unlockedStreakMilestones: Array.from(milestones).sort((a, b) => a - b),
        unlockedStreakTiers: updatedTiers,
      },
      newlyUnlockedTier: potentialTier,
    };
  }

  return {
    nextSave: save,
    newlyUnlockedTier: null,
  };
}
