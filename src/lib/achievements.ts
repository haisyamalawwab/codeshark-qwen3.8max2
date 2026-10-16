/* Sistem Prestasi & Lencana (Achievements System) Codeshark Academy.
   Menyediakan definisi lencana, penghitungan progres dinamis terhadap SaveData,
   serta status pencapaian dan klaim hadiah. */

import type { SaveData } from "./storage";

export type AchievementCategory = "all" | "lines" | "daily" | "speed" | "adventure";

export type AchievementTier = "bronze" | "silver" | "gold" | "diamond";

export interface AchievementDef {
  id: string;
  category: "lines" | "daily" | "speed" | "adventure";
  name: string;
  nameEn: string;
  desc: string;
  tier: AchievementTier;
  icon: string;
  target: number;
  unit: string;
  rewardXp: number;
  rewardCoins: number;
  /** Ambil progres saat ini dari SaveData */
  getProgress: (save: SaveData) => number;
}

export interface AchievementStatus {
  def: AchievementDef;
  current: number;
  target: number;
  pct: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  claimedAt?: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  /* ========================================================
     1. KETIK BARIS KODE (LINES OF CODE TYPED)
     ======================================================== */
  {
    id: "lines-50",
    category: "lines",
    name: "Tinta Pertama",
    nameEn: "First 50 Lines",
    desc: "Ketik 50 baris kode program di samudra",
    tier: "bronze",
    icon: "📝",
    target: 50,
    unit: "baris",
    rewardXp: 50,
    rewardCoins: 15,
    getProgress: (s) => s.stats.linesTyped || 0,
  },
  {
    id: "lines-250",
    category: "lines",
    name: "Pengetik Samudra",
    nameEn: "Ocean Scripter",
    desc: "Ketik 250 baris kode program dengan tangkas",
    tier: "silver",
    icon: "⚡",
    target: 250,
    unit: "baris",
    rewardXp: 120,
    rewardCoins: 30,
    getProgress: (s) => s.stats.linesTyped || 0,
  },
  {
    id: "lines-500",
    category: "lines",
    name: "Arsitek Kode Samudra",
    nameEn: "Code Architect",
    desc: "Ketik 500 baris kode program terstruktur",
    tier: "gold",
    icon: "🏗️",
    target: 500,
    unit: "baris",
    rewardXp: 250,
    rewardCoins: 60,
    getProgress: (s) => s.stats.linesTyped || 0,
  },
  {
    id: "lines-1000",
    category: "lines",
    name: "1000 Total Lines Typed",
    nameEn: "1000 Total Lines Typed",
    desc: "Milestone legendaris: ketik 1.000 total baris kode program!",
    tier: "diamond",
    icon: "👑",
    target: 1000,
    unit: "baris",
    rewardXp: 500,
    rewardCoins: 120,
    getProgress: (s) => s.stats.linesTyped || 0,
  },
  {
    id: "lines-2500",
    category: "lines",
    name: "Maestro Samudra 2500",
    nameEn: "2500 Lines Maestro",
    desc: "Ketik 2.500 baris kode tanpa tanding di kedalaman",
    tier: "diamond",
    icon: "🔱",
    target: 2500,
    unit: "baris",
    rewardXp: 1000,
    rewardCoins: 250,
    getProgress: (s) => s.stats.linesTyped || 0,
  },

  /* ========================================================
     2. TANTANGAN HARIAN (DAILY CHALLENGES)
     ======================================================== */
  {
    id: "daily-1",
    category: "daily",
    name: "Penyelam Harian Pertama",
    nameEn: "First Daily Dive",
    desc: "Selesaikan 1 Tantangan Harian (Daily Challenge)",
    tier: "bronze",
    icon: "☀️",
    target: 1,
    unit: "tantangan",
    rewardXp: 60,
    rewardCoins: 20,
    getProgress: (s) => s.dailyChallenge?.totalCompleted || 0,
  },
  {
    id: "daily-3",
    category: "daily",
    name: "Disiplin Samudra",
    nameEn: "Ocean Discipline",
    desc: "Selesaikan 3 Tantangan Harian",
    tier: "silver",
    icon: "📅",
    target: 3,
    unit: "tantangan",
    rewardXp: 150,
    rewardCoins: 40,
    getProgress: (s) => s.dailyChallenge?.totalCompleted || 0,
  },
  {
    id: "daily-5",
    category: "daily",
    name: "Completed 5 Daily Challenges",
    nameEn: "Completed 5 Daily Challenges",
    desc: "Konsistensi tanpa henti: selesaikan 5 Tantangan Harian!",
    tier: "gold",
    icon: "🏅",
    target: 5,
    unit: "tantangan",
    rewardXp: 300,
    rewardCoins: 80,
    getProgress: (s) => s.dailyChallenge?.totalCompleted || 0,
  },
  {
    id: "daily-10",
    category: "daily",
    name: "Master Tantangan Harian",
    nameEn: "Daily Master",
    desc: "Capai 10 Tantangan Harian yang diselesaikan di samudra",
    tier: "diamond",
    icon: "💎",
    target: 10,
    unit: "tantangan",
    rewardXp: 600,
    rewardCoins: 150,
    getProgress: (s) => s.dailyChallenge?.totalCompleted || 0,
  },

  /* ========================================================
     3. KECEPATAN & KEMAHIRAN (SPEED & SKILL)
     ======================================================== */
  {
    id: "speed-30",
    category: "speed",
    name: "Kecepatan 30 WPM",
    nameEn: "30 WPM Cruiser",
    desc: "Capai rekor kecepatan ketik 30 WPM",
    tier: "bronze",
    icon: "🌊",
    target: 30,
    unit: "WPM",
    rewardXp: 80,
    rewardCoins: 25,
    getProgress: (s) => s.stats.bestWpm || 0,
  },
  {
    id: "speed-50",
    category: "speed",
    name: "Kilat Samudra (50 WPM)",
    nameEn: "Ocean Lightning",
    desc: "Capai rekor kecepatan ketik 50 WPM",
    tier: "silver",
    icon: "⚡",
    target: 50,
    unit: "WPM",
    rewardXp: 180,
    rewardCoins: 50,
    getProgress: (s) => s.stats.bestWpm || 0,
  },
  {
    id: "speed-70",
    category: "speed",
    name: "Badai Samudra (70 WPM)",
    nameEn: "Tempest 70 WPM",
    desc: "Capai rekor kecepatan ketik spektakuler 70 WPM",
    tier: "gold",
    icon: "🌪️",
    target: 70,
    unit: "WPM",
    rewardXp: 350,
    rewardCoins: 100,
    getProgress: (s) => s.stats.bestWpm || 0,
  },
  {
    id: "combo-50",
    category: "speed",
    name: "Kombo Membara 50x",
    nameEn: "50x Blazing Combo",
    desc: "Raih 50 ketikan beruntun tanpa ada satu pun kesalahan",
    tier: "silver",
    icon: "🔥",
    target: 50,
    unit: "combo",
    rewardXp: 150,
    rewardCoins: 40,
    getProgress: (s) => s.stats.bestCombo || 0,
  },

  /* ========================================================
     4. PETUALANGAN & PROGRESI (JOURNEY & STREAK)
     ======================================================== */
  {
    id: "streak-3",
    category: "adventure",
    name: "Api Streak 3 Hari",
    nameEn: "3-Day Flame",
    desc: "Pertahankan latihan harian 3 hari berturut-turut",
    tier: "bronze",
    icon: "🔥",
    target: 3,
    unit: "hari",
    rewardXp: 100,
    rewardCoins: 30,
    getProgress: (s) => Math.max(s.streak.current, s.streak.best),
  },
  {
    id: "streak-7",
    category: "adventure",
    name: "Seminggu Tak Terputus",
    nameEn: "Unbroken Week",
    desc: "Pertahankan rekor streak 7 hari berturut-turut",
    tier: "gold",
    icon: "🌟",
    target: 7,
    unit: "hari",
    rewardXp: 300,
    rewardCoins: 80,
    getProgress: (s) => Math.max(s.streak.current, s.streak.best),
  },
  {
    id: "missions-done",
    category: "adventure",
    name: "Penyelam Tiga Modul",
    nameEn: "Three Modules Cleared",
    desc: "Selesaikan praktikum ketiga modul utama (HTML, CSS, JS)",
    tier: "gold",
    icon: "📜",
    target: 3,
    unit: "modul",
    rewardXp: 250,
    rewardCoins: 70,
    getProgress: (s) => Object.values(s.modules).filter((m) => m.completions > 0).length,
  },
  {
    id: "rank-megalodon",
    category: "adventure",
    name: "Pangkat Megalodon",
    nameEn: "Megalodon Rank",
    desc: "Kumpulkan 1.200 XP dan raih gelar predator Megalodon",
    tier: "diamond",
    icon: "🦈",
    target: 1200,
    unit: "XP",
    rewardXp: 400,
    rewardCoins: 100,
    getProgress: (s) => s.xp || 0,
  },
];

/** Evaluasi status satu prestasi terhadap SaveData pemain */
export function getAchievementStatus(def: AchievementDef, save: SaveData): AchievementStatus {
  const current = Math.max(0, def.getProgress(save));
  const isUnlocked = current >= def.target;
  const pct = Math.min(100, Math.round((current / def.target) * 100));
  const claimedMap = save.claimedAchievements ?? {};
  const isClaimed = Boolean(claimedMap[def.id]);
  const claimedAt = claimedMap[def.id];

  return {
    def,
    current,
    target: def.target,
    pct,
    isUnlocked,
    isClaimed,
    claimedAt,
  };
}

/** Evaluasi seluruh prestasi untuk SaveData pemain */
export function getAllAchievementsWithStatus(save: SaveData): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => getAchievementStatus(def, save));
}

/** Hitung statistik ringkasan prestasi */
export function getAchievementSummary(save: SaveData): {
  total: number;
  unlockedCount: number;
  claimedCount: number;
  claimableCount: number;
  totalXpRewards: number;
  totalCoinsRewards: number;
  unlockedPct: number;
} {
  const all = getAllAchievementsWithStatus(save);
  const total = all.length;
  let unlockedCount = 0;
  let claimedCount = 0;
  let claimableCount = 0;
  let totalXpRewards = 0;
  let totalCoinsRewards = 0;

  for (const a of all) {
    if (a.isUnlocked) {
      unlockedCount += 1;
      if (a.isClaimed) {
        claimedCount += 1;
      } else {
        claimableCount += 1;
      }
      totalXpRewards += a.def.rewardXp;
      totalCoinsRewards += a.def.rewardCoins;
    }
  }

  const unlockedPct = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  return {
    total,
    unlockedCount,
    claimedCount,
    claimableCount,
    totalXpRewards,
    totalCoinsRewards,
    unlockedPct,
  };
}

export const TIER_CONFIG: Record<
  AchievementTier,
  {
    label: string;
    border: string;
    glow: string;
    bgBadge: string;
    text: string;
  }
> = {
  bronze: {
    label: "Perunggu",
    border: "rgba(217, 119, 6, 0.4)",
    glow: "rgba(217, 119, 6, 0.2)",
    bgBadge: "linear-gradient(135deg, rgba(180, 83, 9, 0.25), rgba(120, 53, 15, 0.4))",
    text: "#f59e0b",
  },
  silver: {
    label: "Perak",
    border: "rgba(203, 213, 225, 0.5)",
    glow: "rgba(203, 213, 225, 0.25)",
    bgBadge: "linear-gradient(135deg, rgba(148, 163, 184, 0.25), rgba(71, 85, 105, 0.4))",
    text: "#e2e8f0",
  },
  gold: {
    label: "Emas",
    border: "rgba(255, 194, 71, 0.65)",
    glow: "rgba(255, 194, 71, 0.35)",
    bgBadge: "linear-gradient(135deg, rgba(255, 194, 71, 0.3), rgba(217, 119, 6, 0.45))",
    text: "#ffc247",
  },
  diamond: {
    label: "Berlian",
    border: "rgba(46, 230, 200, 0.75)",
    glow: "rgba(46, 230, 200, 0.45)",
    bgBadge: "linear-gradient(135deg, rgba(46, 230, 200, 0.3), rgba(69, 198, 255, 0.45))",
    text: "#2ee6c8",
  },
};
