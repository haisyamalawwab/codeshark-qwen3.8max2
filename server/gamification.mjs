// Derivasi + persistensi gamifikasi ternormalisasi untuk provider MySQL
// cs_* (TiDB Cloud & Aiven for MySQL). cs_saves (blob) tetap sumber
// kebenaran restore; modul ini menurunkan baris-baris yang bisa ditanyakan
// halaman Profil & Membership: cs_gamification, cs_achievements,
// cs_badges, cs_attention_days, cs_memberships.
//
// Definisi rank/tier streak/achievement MENYALIN klien:
//   src/lib/storage.ts (RANKS), src/lib/streakMultiplier.ts (tier),
//   src/lib/achievements.ts (ACHIEVEMENTS). Ubah keduanya bersamaan.
// Semua fungsi defensif: snapshot save lama/sebagian tidak boleh
// menggagalkan sync (nilai hilang → 0/null).

export class GamificationError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const uint = (value, max = Number.MAX_SAFE_INTEGER) =>
  Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), max) : 0;
const unum = (value, max = 1e9) =>
  Number.isFinite(value) && value > 0 ? Math.min(value, max) : 0;
const validDate = (value) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
const toDateOrNull = (timestamp) =>
  Number.isFinite(timestamp) && timestamp > 0 ? new Date(timestamp) : null;

/* ================= Rank (mirror src/lib/storage.ts RANKS) ================= */

export const RANKS = [
  { xp: 0, name: "Kadet Baru" },
  { xp: 120, name: "Ikan Kecil" },
  { xp: 280, name: "Kuda Laut" },
  { xp: 500, name: "Lumba-Lumba" },
  { xp: 800, name: "Hiu Muda" },
  { xp: 1200, name: "Megalodon" },
  { xp: 1700, name: "Legenda Samudra" },
];

export function rankNameOf(xp) {
  let current = RANKS[0].name;
  for (const rank of RANKS) if (uint(xp) >= rank.xp) current = rank.name;
  return current;
}

const rankSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ============ Streak tier (mirror src/lib/streakMultiplier.ts) ============ */

export const STREAK_TIERS = [
  { tier: 0, days: 0, multiplier: 1.0 },
  { tier: 1, days: 3, multiplier: 1.1 },
  { tier: 2, days: 7, multiplier: 1.25 },
  { tier: 3, days: 14, multiplier: 1.4 },
  { tier: 4, days: 21, multiplier: 1.65 },
  { tier: 5, days: 30, multiplier: 2.0 },
];

export function streakTierOf(save) {
  const days = Math.max(
    uint(save?.streak?.best), uint(save?.streak?.current),
    uint(save?.loginStreak?.best), uint(save?.loginStreak?.current),
  );
  let highest = STREAK_TIERS[0];
  for (const tier of STREAK_TIERS) if (days >= tier.days) highest = tier;
  if (Array.isArray(save?.unlockedStreakMilestones)) {
    for (const milestone of save.unlockedStreakMilestones) {
      if (Number.isInteger(milestone) && milestone > highest.tier && milestone < STREAK_TIERS.length) {
        highest = STREAK_TIERS[milestone];
      }
    }
  }
  return highest;
}

/* ============== Achievements (mirror src/lib/achievements.ts) ============== */

export const ACHIEVEMENT_DEFS = [
  { id: "lines-50", tier: "bronze", target: 50, rewardXp: 50, rewardCoins: 15, progress: (s) => uint(s.stats?.linesTyped) },
  { id: "lines-250", tier: "silver", target: 250, rewardXp: 120, rewardCoins: 30, progress: (s) => uint(s.stats?.linesTyped) },
  { id: "lines-500", tier: "gold", target: 500, rewardXp: 250, rewardCoins: 60, progress: (s) => uint(s.stats?.linesTyped) },
  { id: "lines-1000", tier: "diamond", target: 1000, rewardXp: 500, rewardCoins: 120, progress: (s) => uint(s.stats?.linesTyped) },
  { id: "lines-2500", tier: "diamond", target: 2500, rewardXp: 1000, rewardCoins: 250, progress: (s) => uint(s.stats?.linesTyped) },
  { id: "daily-1", tier: "bronze", target: 1, rewardXp: 60, rewardCoins: 20, progress: (s) => uint(s.dailyChallenge?.totalCompleted) },
  { id: "daily-3", tier: "silver", target: 3, rewardXp: 150, rewardCoins: 40, progress: (s) => uint(s.dailyChallenge?.totalCompleted) },
  { id: "daily-5", tier: "gold", target: 5, rewardXp: 300, rewardCoins: 80, progress: (s) => uint(s.dailyChallenge?.totalCompleted) },
  { id: "daily-10", tier: "diamond", target: 10, rewardXp: 600, rewardCoins: 150, progress: (s) => uint(s.dailyChallenge?.totalCompleted) },
  { id: "speed-30", tier: "bronze", target: 30, rewardXp: 80, rewardCoins: 25, progress: (s) => Math.floor(unum(s.stats?.bestWpm)) },
  { id: "speed-50", tier: "silver", target: 50, rewardXp: 180, rewardCoins: 50, progress: (s) => Math.floor(unum(s.stats?.bestWpm)) },
  { id: "speed-70", tier: "gold", target: 70, rewardXp: 350, rewardCoins: 100, progress: (s) => Math.floor(unum(s.stats?.bestWpm)) },
  { id: "combo-50", tier: "silver", target: 50, rewardXp: 150, rewardCoins: 40, progress: (s) => uint(s.stats?.bestCombo) },
  { id: "streak-3", tier: "bronze", target: 3, rewardXp: 100, rewardCoins: 30, progress: (s) => Math.max(uint(s.streak?.current), uint(s.streak?.best)) },
  { id: "streak-7", tier: "gold", target: 7, rewardXp: 300, rewardCoins: 80, progress: (s) => Math.max(uint(s.streak?.current), uint(s.streak?.best)) },
  { id: "missions-done", tier: "gold", target: 3, rewardXp: 250, rewardCoins: 70, progress: (s) => countCompletedModules(s) },
  { id: "rank-megalodon", tier: "diamond", target: 1200, rewardXp: 400, rewardCoins: 100, progress: (s) => uint(s.xp) },
];

function countCompletedModules(save) {
  if (!isObject(save?.modules)) return 0;
  return Object.values(save.modules).filter((m) => uint(m?.completions) > 0).length;
}

/* ============================ Derivasi snapshot ============================ */

export function deriveGamification(rawSave, now = Date.now()) {
  const save = isObject(rawSave) ? rawSave : {};
  const stats = isObject(save.stats) ? save.stats : {};
  const claimed = isObject(save.claimedAchievements) ? save.claimedAchievements : {};
  const tier = streakTierOf(save);
  const xp = uint(save.xp);

  const achievements = ACHIEVEMENT_DEFS.map((def) => {
    const progress = def.progress(save);
    const claimedAt = toDateOrNull(Number(claimed[def.id]));
    return {
      achievementId: def.id,
      progress,
      target: def.target,
      unlocked: progress >= def.target,
      // Waktu unlock persis tidak tercatat klien; klaim adalah bukti
      // paling awal yang tersedia, jadi unlocked_at hanya diisi dari klaim.
      unlockedAt: claimedAt,
      claimedAt,
      rewardXp: def.rewardXp,
      rewardCoins: def.rewardCoins,
      tier: def.tier,
    };
  });

  const badges = [];
  for (const row of achievements) {
    if (row.claimedAt) {
      badges.push({ badgeId: `achievement:${row.achievementId}`, source: "achievement", tier: row.tier, awardedAt: row.claimedAt });
    }
  }
  const unlockedTiers = isObject(save.unlockedStreakTiers) ? save.unlockedStreakTiers : {};
  for (let t = 1; t <= tier.tier; t++) {
    badges.push({
      badgeId: `streak:tier-${t}`,
      source: "streak_tier",
      tier: String(t),
      awardedAt: toDateOrNull(Number(unlockedTiers[t])) ?? new Date(now),
    });
  }
  RANKS.forEach((rank, index) => {
    if (index > 0 && xp >= rank.xp) {
      badges.push({ badgeId: `rank:${rankSlug(rank.name)}`, source: "rank", tier: String(index), awardedAt: new Date(now) });
    }
  });

  const snapshot = {
    xp,
    coins: uint(save.coins),
    rankName: rankNameOf(xp),
    games: uint(stats.games),
    wins: uint(stats.wins),
    bestWpm: unum(stats.bestWpm),
    bestCombo: uint(stats.bestCombo),
    keystrokes: uint(stats.keystrokes),
    correctKeys: uint(stats.correct),
    linesTyped: uint(stats.linesTyped),
    streakCurrent: uint(save.streak?.current, 100000),
    streakBest: uint(save.streak?.best, 100000),
    loginStreakCurrent: uint(save.loginStreak?.current, 100000),
    loginStreakBest: uint(save.loginStreak?.best, 100000),
    streakTier: tier.tier,
    streakMultiplier: tier.multiplier,
    dailyCompleted: uint(save.dailyChallenge?.totalCompleted, 100000),
    achievementsClaimed: achievements.filter((row) => row.claimedAt).length,
    modulesCompleted: countCompletedModules(save),
    lastActiveDate: validDate(save.streak?.lastActiveDate) ?? validDate(save.loginStreak?.lastActiveDate),
  };

  return { snapshot, achievements, badges };
}

/* ============================= Penulis (SQL) ============================= */

/** Jalankan blok gamifikasi di dalam SAVEPOINT. Bila tabel 002 belum ada
 *  (deploy belum menjalankan db:tidb:init terbaru), hanya blok fitur ini
 *  yang digulung balik — sync inti (profil/save/attempts) tetap berhasil.
 *  Error lain tetap dilempar agar tidak menelan kegagalan data. */
export async function withGamificationSavepoint(connection, name, fn) {
  // SAVEPOINT bukan statement yang aman untuk prepared statement di semua
  // server MySQL; pakai protokol teks (query) bila tersedia.
  const run = typeof connection.query === "function"
    ? connection.query.bind(connection)
    : connection.execute.bind(connection);
  await run(`SAVEPOINT ${name}`);
  try {
    const result = await fn();
    await run(`RELEASE SAVEPOINT ${name}`);
    return result;
  } catch (error) {
    if (error?.code === "ER_NO_SUCH_TABLE" || error?.errno === 1146) {
      await run(`ROLLBACK TO SAVEPOINT ${name}`).catch(() => {});
      await run(`RELEASE SAVEPOINT ${name}`).catch(() => {});
      return null;
    }
    throw error;
  }
}

/** Upsert snapshot + achievements + badges. Dipanggil di dalam transaksi
 *  sync HANYA bila snapshot klien diterima sebagai yang terbaru. */
export async function persistGamification(connection, owner, save, sentAt, now = Date.now()) {
  const { snapshot, achievements, badges } = deriveGamification(save, now);
  await connection.execute(
    `INSERT INTO cs_gamification (owner_id, xp, coins, rank_name, games, wins, best_wpm, best_combo, keystrokes, correct_keys, lines_typed, streak_current, streak_best, login_streak_current, login_streak_best, streak_tier, streak_multiplier, daily_completed, achievements_claimed, modules_completed, last_active_date, client_sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE xp=VALUES(xp), coins=VALUES(coins), rank_name=VALUES(rank_name), games=VALUES(games), wins=VALUES(wins), best_wpm=VALUES(best_wpm), best_combo=VALUES(best_combo), keystrokes=VALUES(keystrokes), correct_keys=VALUES(correct_keys), lines_typed=VALUES(lines_typed), streak_current=VALUES(streak_current), streak_best=VALUES(streak_best), login_streak_current=VALUES(login_streak_current), login_streak_best=VALUES(login_streak_best), streak_tier=VALUES(streak_tier), streak_multiplier=VALUES(streak_multiplier), daily_completed=VALUES(daily_completed), achievements_claimed=VALUES(achievements_claimed), modules_completed=VALUES(modules_completed), last_active_date=VALUES(last_active_date), client_sent_at=VALUES(client_sent_at)`,
    [owner, snapshot.xp, snapshot.coins, snapshot.rankName, snapshot.games, snapshot.wins, snapshot.bestWpm, snapshot.bestCombo, snapshot.keystrokes, snapshot.correctKeys, snapshot.linesTyped, snapshot.streakCurrent, snapshot.streakBest, snapshot.loginStreakCurrent, snapshot.loginStreakBest, snapshot.streakTier, snapshot.streakMultiplier, snapshot.dailyCompleted, snapshot.achievementsClaimed, snapshot.modulesCompleted, snapshot.lastActiveDate, uint(sentAt)],
  );
  for (const row of achievements) {
    await connection.execute(
      `INSERT INTO cs_achievements (owner_id, achievement_id, progress, target, unlocked_at, claimed_at, reward_xp, reward_coins) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE progress=GREATEST(progress, VALUES(progress)), target=VALUES(target), unlocked_at=COALESCE(unlocked_at, VALUES(unlocked_at)), claimed_at=COALESCE(claimed_at, VALUES(claimed_at)), reward_xp=VALUES(reward_xp), reward_coins=VALUES(reward_coins)`,
      [owner, row.achievementId, row.progress, row.target, row.unlockedAt, row.claimedAt, row.rewardXp, row.rewardCoins],
    );
  }
  for (const badge of badges) {
    // Badge bersifat permanen: simpan awarded_at pertama, jangan ditimpa.
    await connection.execute(
      `INSERT INTO cs_badges (owner_id, badge_id, source, tier, awarded_at) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE badge_id=VALUES(badge_id)`,
      [owner, badge.badgeId, badge.source, badge.tier, badge.awardedAt],
    );
  }
  return { snapshot, achievements, badges };
}

/** Agregasi atensi per hari dihitung ulang dari cs_attempts (idempoten
 *  terhadap pengiriman ulang attempts yang sama). */
export async function refreshAttentionDays(connection, owner, attempts) {
  const dates = [...new Set((attempts ?? [])
    .map((a) => (Number.isFinite(a?.at) ? new Date(a.at).toISOString().slice(0, 10) : null))
    .filter(Boolean))];
  for (const date of dates) {
    await connection.execute(
      `INSERT INTO cs_attention_days (owner_id, activity_date, attempts_count, sessions_count, xp_earned, coins_earned, first_at, last_at)
       SELECT owner_id, DATE(played_at), COUNT(*), COUNT(DISTINCT session_id), COALESCE(SUM(xp_award), 0), COALESCE(SUM(coins_award), 0), MIN(played_at), MAX(played_at)
       FROM cs_attempts WHERE owner_id = ? AND DATE(played_at) = ?
       GROUP BY owner_id, DATE(played_at)
       ON DUPLICATE KEY UPDATE attempts_count=VALUES(attempts_count), sessions_count=VALUES(sessions_count), xp_earned=VALUES(xp_earned), coins_earned=VALUES(coins_earned), first_at=VALUES(first_at), last_at=VALUES(last_at)`,
      [owner, date],
    );
  }
  return dates;
}

/* =============================== Membership =============================== */

export const MEMBERSHIP_PLANS = ["free", "kelas", "pro"];

export function defaultMembership(owner) {
  return {
    ownerId: owner,
    plan: "free",
    role: "peserta",
    cohortCode: null,
    status: "active",
    startedAt: null,
    expiresAt: null,
    updatedAt: null,
  };
}

/** Pastikan baris membership ada (plan free). Role admin dari identitas
 *  Better Auth dicermin-kan hanya saat baris pertama dibuat. */
export async function ensureMembership(connection, owner, identityRole = "") {
  const role = identityRole === "admin" ? "admin" : "peserta";
  await connection.execute(
    `INSERT INTO cs_memberships (owner_id, plan, role) VALUES (?, 'free', ?)
     ON DUPLICATE KEY UPDATE owner_id=VALUES(owner_id)`,
    [owner, role],
  );
}

const COHORT_PATTERN = /^[A-Z0-9][A-Z0-9-]{3,31}$/;

/** Validasi update membership self-service. Plan "pro" hanya dari admin;
 *  plan "kelas" wajib punya kode cohort (dicek terhadap baris tersimpan
 *  di applyMembershipUpdate). Role tidak pernah bisa diubah sendiri. */
export function validateMembershipUpdate(body) {
  if (!isObject(body)) throw new GamificationError(400, "JSON object required");
  const update = {};
  if (Object.hasOwn(body, "plan")) {
    if (typeof body.plan !== "string" || !MEMBERSHIP_PLANS.includes(body.plan)) {
      throw new GamificationError(400, "Invalid plan");
    }
    if (body.plan === "pro") {
      throw new GamificationError(403, "Plan Pro hanya dapat diberikan oleh admin.");
    }
    update.plan = body.plan;
  }
  if (Object.hasOwn(body, "cohortCode")) {
    if (body.cohortCode === null || body.cohortCode === "") {
      update.cohortCode = null;
    } else if (typeof body.cohortCode === "string") {
      const code = body.cohortCode.trim().toUpperCase();
      if (!COHORT_PATTERN.test(code)) throw new GamificationError(400, "Kode kelas tidak valid (4–32 karakter A–Z, 0–9, '-').");
      update.cohortCode = code;
    } else {
      throw new GamificationError(400, "Invalid cohortCode");
    }
  }
  if (!Object.hasOwn(update, "plan") && !Object.hasOwn(update, "cohortCode")) {
    throw new GamificationError(400, "Tidak ada perubahan membership.");
  }
  return update;
}

/** Terapkan update dalam transaksi koneksi yang diberikan; kembalikan
 *  membership terbaru dalam bentuk baris mentah DB. */
export async function applyMembershipUpdate(connection, owner, update, identityRole = "") {
  await ensureMembership(connection, owner, identityRole);
  const [rows] = await connection.execute(
    "SELECT owner_id, plan, role, cohort_code, status, started_at, expires_at, updated_at FROM cs_memberships WHERE owner_id = ? FOR UPDATE",
    [owner],
  );
  const current = rows[0] ?? { plan: "free", cohort_code: null };
  const nextCohort = Object.hasOwn(update, "cohortCode") ? update.cohortCode : current.cohort_code;
  let nextPlan = Object.hasOwn(update, "plan") ? update.plan : current.plan;
  // Meminta plan kelas secara eksplisit tanpa cohort = permintaan invalid.
  if (Object.hasOwn(update, "plan") && update.plan === "kelas" && !nextCohort) {
    throw new GamificationError(400, "Plan Kelas membutuhkan kode kelas (cohort).");
  }
  // Keluar kelas saat plan kelas → kembali ke free (pro tidak terpengaruh).
  if (!nextCohort && nextPlan === "kelas") nextPlan = "free";
  // Bergabung dengan kode kelas tanpa menyebut plan → naik ke plan kelas,
  // kecuali membership pro dari admin (jangan diturunkan diam-diam).
  if (nextCohort && !Object.hasOwn(update, "plan") && nextPlan === "free") nextPlan = "kelas";
  await connection.execute(
    "UPDATE cs_memberships SET plan = ?, cohort_code = ? WHERE owner_id = ?",
    [nextPlan, nextCohort, owner],
  );
  const [after] = await connection.execute(
    "SELECT owner_id, plan, role, cohort_code, status, started_at, expires_at, updated_at FROM cs_memberships WHERE owner_id = ?",
    [owner],
  );
  return after[0];
}
