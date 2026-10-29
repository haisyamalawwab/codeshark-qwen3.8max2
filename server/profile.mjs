// Endpoint Profil & Membership (provider MySQL cs_*: TiDB Cloud /
// Aiven for MySQL). Identitas diverifikasi server (sesi Better Auth di
// Layerbase, atau JWT Supabase legacy) — TIDAK pernah dari body klien.
// Bila skema 002 belum dimigrasi handler menjawab 503 schema_missing
// agar klien jatuh ke profil lokal (Env-Gated Graceful Fallback).

import { resolveAuthenticatedUser, SyncError } from "./tidb-sync.mjs";
import { getTidbPool } from "./tidb.mjs";
import { isLocalMode, sendCloudDisabled } from "./local-mode.mjs";
import { pickCloudProvider, aivenKind, aivenUrl, getAivenMysqlPool } from "./aiven.mjs";
import {
  GamificationError,
  defaultMembership,
  validateMembershipUpdate,
  applyMembershipUpdate,
} from "./gamification.mjs";

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const iso = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const dateOnly = (value) => {
  const text = iso(value);
  return text ? text.slice(0, 10) : null;
};
const isNoSuchTable = (error) => error?.code === "ER_NO_SUCH_TABLE" || error?.errno === 1146;

export function shapeMembership(row, owner) {
  if (!row) return defaultMembership(owner);
  return {
    plan: row.plan || "free",
    role: row.role || "peserta",
    cohortCode: row.cohort_code ?? null,
    status: row.status || "active",
    startedAt: iso(row.started_at),
    expiresAt: iso(row.expires_at),
    updatedAt: iso(row.updated_at),
  };
}

function shapeProfile(row, identity) {
  return {
    name: row?.name ?? null,
    ageGroup: row?.age_group ?? null,
    email: identity.email || null,
    role: identity.role || null,
    provider: identity.provider,
    createdAt: iso(row?.created_at),
    updatedAt: iso(row?.updated_at),
  };
}

function shapeGamification(row) {
  if (!row) return null;
  return {
    xp: num(row.xp),
    coins: num(row.coins),
    rankName: row.rank_name || "Kadet Baru",
    games: num(row.games),
    wins: num(row.wins),
    bestWpm: num(row.best_wpm),
    bestCombo: num(row.best_combo),
    keystrokes: num(row.keystrokes),
    correctKeys: num(row.correct_keys),
    linesTyped: num(row.lines_typed),
    streakCurrent: num(row.streak_current),
    streakBest: num(row.streak_best),
    loginStreakCurrent: num(row.login_streak_current),
    loginStreakBest: num(row.login_streak_best),
    streakTier: num(row.streak_tier),
    streakMultiplier: num(row.streak_multiplier),
    dailyCompleted: num(row.daily_completed),
    achievementsClaimed: num(row.achievements_claimed),
    modulesCompleted: num(row.modules_completed),
    lastActiveDate: dateOnly(row.last_active_date),
    updatedAt: iso(row.updated_at),
  };
}

function fail(res, error) {
  if (error instanceof SyncError || error instanceof GamificationError) {
    return res.status(error.status).json({ ok: false, error: error.message });
  }
  if (isNoSuchTable(error)) {
    return res.status(503).json({ ok: false, code: "schema_missing", error: "Skema gamifikasi 002 belum diterapkan di database." });
  }
  // Jangan bocorkan error driver/SQL/kredensial ke browser.
  return res.status(503).json({ ok: false, error: "Layanan profil belum tersedia." });
}

/** GET /api/profile — profil + membership + gamifikasi + achievement +
 *  badge + atensi 30 hari terakhir milik pengguna yang terautentikasi. */
export function createProfileHandler({ pool = getTidbPool, env = process.env, request = fetch, authDeps = {} } = {}) {
  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader?.("Allow", "GET");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    try {
      const identity = await resolveAuthenticatedUser(req, env, request, authDeps);
      const owner = identity.owner;
      const db = pool();
      const [profiles] = await db.query(
        "SELECT name, age_group, created_at, updated_at FROM cs_profiles WHERE owner_id = ?", [owner]);
      const [memberships] = await db.query(
        "SELECT plan, role, cohort_code, status, started_at, expires_at, updated_at FROM cs_memberships WHERE owner_id = ?", [owner]);
      const [gamification] = await db.query(
        "SELECT xp, coins, rank_name, games, wins, best_wpm, best_combo, keystrokes, correct_keys, lines_typed, streak_current, streak_best, login_streak_current, login_streak_best, streak_tier, streak_multiplier, daily_completed, achievements_claimed, modules_completed, last_active_date, updated_at FROM cs_gamification WHERE owner_id = ?", [owner]);
      const [achievements] = await db.query(
        "SELECT achievement_id, progress, target, unlocked_at, claimed_at, reward_xp, reward_coins FROM cs_achievements WHERE owner_id = ? ORDER BY achievement_id", [owner]);
      const [badges] = await db.query(
        "SELECT badge_id, source, tier, awarded_at FROM cs_badges WHERE owner_id = ? ORDER BY awarded_at DESC LIMIT 100", [owner]);
      const [attention] = await db.query(
        "SELECT activity_date, attempts_count, sessions_count, xp_earned, coins_earned, first_at, last_at FROM cs_attention_days WHERE owner_id = ? ORDER BY activity_date DESC LIMIT 30", [owner]);

      return res.status(200).json({
        ok: true,
        profile: shapeProfile(profiles[0], identity),
        membership: shapeMembership(memberships[0], owner),
        gamification: shapeGamification(gamification[0]),
        achievements: achievements.map((row) => ({
          id: row.achievement_id,
          progress: num(row.progress),
          target: num(row.target),
          unlockedAt: iso(row.unlocked_at),
          claimedAt: iso(row.claimed_at),
          rewardXp: num(row.reward_xp),
          rewardCoins: num(row.reward_coins),
        })),
        badges: badges.map((row) => ({
          id: row.badge_id,
          source: row.source,
          tier: row.tier,
          awardedAt: iso(row.awarded_at),
        })),
        attention: attention.map((row) => ({
          date: dateOnly(row.activity_date),
          attempts: num(row.attempts_count),
          sessions: num(row.sessions_count),
          xpEarned: num(row.xp_earned),
          coinsEarned: num(row.coins_earned),
          firstAt: iso(row.first_at),
          lastAt: iso(row.last_at),
        })).reverse(),
      });
    } catch (error) {
      return fail(res, error);
    }
  };
}

/** GET/POST /api/membership — baca membership sendiri; POST untuk
 *  bergabung/keluar kelas (cohort) dan memilih plan free/kelas.
 *  Plan pro & role hanya dapat diubah admin (di luar endpoint ini). */
export function createMembershipHandler({ pool = getTidbPool, env = process.env, request = fetch, authDeps = {} } = {}) {
  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader?.("Allow", "GET, POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    let connection;
    try {
      const identity = await resolveAuthenticatedUser(req, env, request, authDeps);
      const owner = identity.owner;
      if (req.method === "GET") {
        const [rows] = await pool().query(
          "SELECT plan, role, cohort_code, status, started_at, expires_at, updated_at FROM cs_memberships WHERE owner_id = ?", [owner]);
        return res.status(200).json({ ok: true, membership: shapeMembership(rows[0], owner) });
      }
      const update = validateMembershipUpdate(req.body);
      connection = await pool().getConnection();
      await connection.beginTransaction();
      const row = await applyMembershipUpdate(connection, owner, update, identity.role);
      await connection.commit();
      return res.status(200).json({ ok: true, membership: shapeMembership(row, owner) });
    } catch (error) {
      if (connection) await connection.rollback().catch(() => {});
      return fail(res, error);
    } finally {
      connection?.release();
    }
  };
}

/* Dispatcher provider seperti /api/sync-progress: TiDB Cloud atau Aiven
 * for MySQL (skema cs_* yang sama). Aiven PostgreSQL (skema legacy
 * device-based) belum mendukung tabel 002 → 503 provider_unsupported
 * agar klien memakai profil lokal. DATA_MODE=local → 503 mode-lokal. */
function dispatched(createHandler) {
  return (deps = {}) => {
    const env = deps.env ?? process.env;
    let handler;
    const build = () => {
      if (deps.pool) return createHandler(deps);
      const provider = pickCloudProvider(env);
      if (provider === "tidb") return createHandler({ ...deps, env });
      if (provider === "aiven" && aivenKind(aivenUrl(env)) === "mysql") {
        return createHandler({ ...deps, pool: () => getAivenMysqlPool(env), env });
      }
      return null;
    };
    return async (req, res) => {
      if (isLocalMode(env)) return sendCloudDisabled(req, res);
      handler ??= build();
      if (!handler) {
        res.setHeader?.("Cache-Control", "no-store");
        return res.status(503).json({
          ok: false,
          code: "provider_unsupported",
          error: "Profil cloud membutuhkan TiDB Cloud atau Aiven for MySQL.",
        });
      }
      return handler(req, res);
    };
  };
}

export const createDispatchedProfileHandler = dispatched(createProfileHandler);
export const createDispatchedMembershipHandler = dispatched(createMembershipHandler);
