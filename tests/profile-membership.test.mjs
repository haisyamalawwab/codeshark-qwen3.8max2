import test from "node:test";
import assert from "node:assert/strict";
import {
  deriveGamification,
  persistGamification,
  refreshAttentionDays,
  withGamificationSavepoint,
  validateMembershipUpdate,
  applyMembershipUpdate,
  rankNameOf,
  streakTierOf,
} from "../server/gamification.mjs";
import { createProfileHandler, createMembershipHandler } from "../server/profile.mjs";
import { persistTidbSync } from "../server/tidb-sync.mjs";
import { probeBetterAuthSchema } from "../server/better-auth.mjs";

const fullSave = () => ({
  xp: 1300,
  coins: 250,
  modules: {
    html: { materiDone: true, quizXp: 50, completions: 2 },
    css: { materiDone: true, quizXp: 40, completions: 1 },
    js: { materiDone: false, quizXp: 0, completions: 0 },
  },
  stats: { games: 20, wins: 15, bestWpm: 55.5, bestCombo: 60, keystrokes: 9000, correct: 8500, linesTyped: 600 },
  streak: { current: 7, best: 9, lastActiveDate: "2026-10-28" },
  loginStreak: { current: 7, best: 7, lastActiveDate: "2026-10-28" },
  dailyChallenge: { lastCompletedDate: "2026-10-28", totalCompleted: 5, history: [] },
  unlockedStreakMilestones: [0, 1, 2],
  unlockedStreakTiers: { 1: 1700000000000, 2: 1700100000000 },
  claimedAchievements: { "lines-50": 1700000000000, "daily-1": 1700200000000 },
});

test("deriveGamification menurunkan snapshot, achievement, dan badge dari save", () => {
  const { snapshot, achievements, badges } = deriveGamification(fullSave(), 1700300000000);
  assert.equal(snapshot.xp, 1300);
  assert.equal(snapshot.rankName, "Megalodon");
  assert.equal(snapshot.streakTier, 2);
  assert.equal(snapshot.streakMultiplier, 1.25);
  assert.equal(snapshot.modulesCompleted, 2);
  assert.equal(snapshot.achievementsClaimed, 2);
  assert.equal(snapshot.lastActiveDate, "2026-10-28");

  const lines500 = achievements.find((a) => a.achievementId === "lines-500");
  assert.equal(lines500.progress, 600);
  assert.equal(lines500.unlocked, true);
  const lines50 = achievements.find((a) => a.achievementId === "lines-50");
  assert.equal(lines50.claimedAt?.getTime(), 1700000000000);
  const speed70 = achievements.find((a) => a.achievementId === "speed-70");
  assert.equal(speed70.progress, 55);
  assert.equal(speed70.unlocked, false);

  const badgeIds = badges.map((b) => b.badgeId);
  assert(badgeIds.includes("achievement:lines-50"));
  assert(badgeIds.includes("achievement:daily-1"));
  assert(badgeIds.includes("streak:tier-1"));
  assert(badgeIds.includes("streak:tier-2"));
  assert(badgeIds.includes("rank:megalodon"));
  assert.equal(badges.find((b) => b.badgeId === "streak:tier-1").awardedAt.getTime(), 1700000000000);
});

test("deriveGamification aman untuk save kosong/sebagian", () => {
  for (const save of [{}, null, undefined, { stats: {}, modules: {} }]) {
    const { snapshot, achievements, badges } = deriveGamification(save);
    assert.equal(snapshot.xp, 0);
    assert.equal(snapshot.rankName, "Kadet Baru");
    assert.equal(snapshot.streakTier, 0);
    assert.equal(achievements.length, 17);
    assert.equal(badges.length, 0);
  }
  assert.equal(rankNameOf(0), "Kadet Baru");
  assert.equal(rankNameOf(99999), "Legenda Samudra");
  assert.equal(streakTierOf({ streak: { best: 30 } }).multiplier, 2.0);
});

function fakeConnection({ failOn } = {}) {
  const calls = [];
  return {
    calls,
    async execute(sql, args) {
      calls.push({ sql, args });
      if (failOn && sql.includes(failOn)) {
        const error = new Error("private driver error");
        error.code = "ER_NO_SUCH_TABLE";
        throw error;
      }
      return [{}];
    },
  };
}

test("persistGamification menulis snapshot + 17 achievement + badge terparameterisasi", async () => {
  const connection = fakeConnection();
  await persistGamification(connection, "user:u1", fullSave(), 1700300000000);
  const sqls = connection.calls.map((c) => c.sql);
  assert(sqls.some((s) => s.startsWith("INSERT INTO cs_gamification")));
  assert.equal(sqls.filter((s) => s.startsWith("INSERT INTO cs_achievements")).length, 17);
  assert(sqls.filter((s) => s.startsWith("INSERT INTO cs_badges")).length >= 4);
  // Nilai tidak pernah diinterpolasi ke teks SQL.
  assert(!sqls.some((s) => s.includes("user:u1") || s.includes("1300")));
  // Klaim & awarded pertama dipertahankan (COALESCE / no-op update).
  assert(sqls.find((s) => s.startsWith("INSERT INTO cs_achievements")).includes("claimed_at=COALESCE(claimed_at"));
  assert(sqls.find((s) => s.startsWith("INSERT INTO cs_badges")).includes("ON DUPLICATE KEY UPDATE badge_id=VALUES(badge_id)"));
});

test("savepoint gamifikasi menelan HANYA error tabel belum dimigrasi", async () => {
  const missing = fakeConnection();
  const result = await withGamificationSavepoint(missing, "sp_test", async () => {
    const error = new Error("no table");
    error.code = "ER_NO_SUCH_TABLE";
    throw error;
  });
  assert.equal(result, null);
  assert(missing.calls.some((c) => c.sql.includes("ROLLBACK TO SAVEPOINT sp_test")));

  const broken = fakeConnection();
  await assert.rejects(
    withGamificationSavepoint(broken, "sp_test", async () => { throw new Error("data error"); }),
    /data error/,
  );
});

test("refreshAttentionDays menghitung ulang agregat per tanggal unik dari cs_attempts", async () => {
  const connection = fakeConnection();
  const dates = await refreshAttentionDays(connection, "user:u1", [
    { at: Date.UTC(2026, 9, 27, 10) },
    { at: Date.UTC(2026, 9, 27, 12) },
    { at: Date.UTC(2026, 9, 28, 9) },
  ]);
  assert.deepEqual(dates.sort(), ["2026-10-27", "2026-10-28"]);
  assert.equal(connection.calls.length, 2);
  assert(connection.calls[0].sql.includes("INSERT INTO cs_attention_days"));
  assert(connection.calls[0].sql.includes("FROM cs_attempts"));
  assert(connection.calls[0].sql.includes("COUNT(DISTINCT session_id)"));
});

test("validateMembershipUpdate menegakkan aturan plan & kode cohort", () => {
  assert.deepEqual(validateMembershipUpdate({ cohortCode: " rpl-2026-a " }), { cohortCode: "RPL-2026-A" });
  assert.deepEqual(validateMembershipUpdate({ plan: "free" }), { plan: "free" });
  assert.throws(() => validateMembershipUpdate({ plan: "pro" }), { status: 403 });
  assert.throws(() => validateMembershipUpdate({ plan: "vip" }), { status: 400 });
  assert.throws(() => validateMembershipUpdate({ cohortCode: "ab" }), { status: 400 });
  assert.throws(() => validateMembershipUpdate({ cohortCode: "Kelas RPL!" }), { status: 400 });
  assert.throws(() => validateMembershipUpdate({}), { status: 400 });
  assert.throws(() => validateMembershipUpdate(null), { status: 400 });
});

function fakeMembershipConnection() {
  let row = null;
  const connection = {
    async execute(sql, args) {
      if (sql.startsWith("INSERT INTO cs_memberships")) {
        row ??= { owner_id: args[0], plan: "free", role: args[1], cohort_code: null, status: "active", started_at: new Date(1700000000000), expires_at: null, updated_at: new Date(1700000000000) };
        return [{}];
      }
      if (sql.startsWith("SELECT") && sql.includes("cs_memberships")) return [row ? [{ ...row }] : []];
      if (sql.startsWith("UPDATE cs_memberships")) {
        row = { ...row, plan: args[0], cohort_code: args[1] };
        return [{}];
      }
      return [{}];
    },
    async beginTransaction() {},
    async commit() {},
    async rollback() {},
    release() {},
  };
  return { connection, get row() { return row; } };
}

test("applyMembershipUpdate: gabung cohort menaikkan plan kelas; keluar mengembalikan free", async () => {
  const fake = fakeMembershipConnection();
  const joined = await applyMembershipUpdate(fake.connection, "user:u1", { cohortCode: "RPL-2026-A" }, "user");
  assert.equal(joined.plan, "kelas");
  assert.equal(joined.cohort_code, "RPL-2026-A");
  const left = await applyMembershipUpdate(fake.connection, "user:u1", { cohortCode: null }, "user");
  assert.equal(left.plan, "free");
  assert.equal(left.cohort_code, null);
  await assert.rejects(
    applyMembershipUpdate(fake.connection, "user:u1", { plan: "kelas" }, "user"),
    { status: 400 },
  );
});

function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
}

const authDeps = {
  hasBetterAuthSessionCookie: () => true,
  getBetterAuthUser: async () => ({ id: "u1", email: "kapten@example.id", role: "user" }),
  isBetterAuthUserBanned: () => false,
};

function fakeProfilePool({ failTable = false } = {}) {
  const membership = fakeMembershipConnection();
  return () => ({
    async query(sql) {
      if (failTable) { const e = new Error("private"); e.code = "ER_NO_SUCH_TABLE"; throw e; }
      if (sql.includes("cs_profiles")) return [[{ name: "Nara", age_group: "academy", created_at: new Date(1700000000000), updated_at: new Date(1700100000000) }]];
      if (sql.includes("cs_memberships")) return [[{ plan: "kelas", role: "peserta", cohort_code: "RPL-2026-A", status: "active", started_at: new Date(1700000000000), expires_at: null, updated_at: new Date(1700100000000) }]];
      if (sql.includes("cs_gamification")) return [[{ xp: "1300", coins: "250", rank_name: "Megalodon", games: 20, wins: 15, best_wpm: "55.50", best_combo: 60, keystrokes: 9000, correct_keys: 8500, lines_typed: 600, streak_current: 7, streak_best: 9, login_streak_current: 7, login_streak_best: 7, streak_tier: 2, streak_multiplier: "1.25", daily_completed: 5, achievements_claimed: 2, modules_completed: 2, last_active_date: new Date(Date.UTC(2026, 9, 28)), updated_at: new Date(1700200000000) }]];
      if (sql.includes("cs_achievements")) return [[{ achievement_id: "lines-50", progress: 600, target: 50, unlocked_at: new Date(1700000000000), claimed_at: new Date(1700000000000), reward_xp: 50, reward_coins: 15 }]];
      if (sql.includes("cs_badges")) return [[{ badge_id: "achievement:lines-50", source: "achievement", tier: "bronze", awarded_at: new Date(1700000000000) }]];
      if (sql.includes("cs_attention_days")) return [[
        { activity_date: new Date(Date.UTC(2026, 9, 28)), attempts_count: 3, sessions_count: 2, xp_earned: 120, coins_earned: 30, first_at: new Date(1700200000000), last_at: new Date(1700203600000) },
        { activity_date: new Date(Date.UTC(2026, 9, 27)), attempts_count: 1, sessions_count: 1, xp_earned: 40, coins_earned: 10, first_at: new Date(1700100000000), last_at: new Date(1700100000000) },
      ]];
      return [[]];
    },
    async getConnection() { return membership.connection; },
  });
}

test("GET /api/profile: wajib auth, membentuk respons camelCase, atensi menaik", async () => {
  const handler = createProfileHandler({ pool: fakeProfilePool(), env: { NODE_ENV: "production" }, authDeps });
  let res = response();
  await handler({ method: "POST", headers: {} }, res);
  assert.equal(res.code, 405);

  res = response();
  await handler({ method: "GET", headers: {} }, res);
  assert.equal(res.code, 200);
  assert.equal(res.data.ok, true);
  assert.equal(res.data.profile.name, "Nara");
  assert.equal(res.data.profile.email, "kapten@example.id");
  assert.equal(res.data.membership.plan, "kelas");
  assert.equal(res.data.membership.cohortCode, "RPL-2026-A");
  assert.equal(res.data.gamification.xp, 1300);
  assert.equal(res.data.gamification.bestWpm, 55.5);
  assert.equal(res.data.gamification.lastActiveDate, "2026-10-28");
  assert.deepEqual(res.data.attention.map((d) => d.date), ["2026-10-27", "2026-10-28"]);
  assert.equal(res.data.badges[0].id, "achievement:lines-50");
});

test("GET /api/profile: tanpa sesi → 401; skema 002 hilang → 503 schema_missing tanpa bocor", async () => {
  const guest = createProfileHandler({ pool: fakeProfilePool(), env: { NODE_ENV: "production" } });
  let res = response();
  await guest({ method: "GET", headers: {} }, res);
  assert.equal(res.code, 401);

  const noSchema = createProfileHandler({ pool: fakeProfilePool({ failTable: true }), env: { NODE_ENV: "production" }, authDeps });
  res = response();
  await noSchema({ method: "GET", headers: {} }, res);
  assert.equal(res.code, 503);
  assert.equal(res.data.code, "schema_missing");
  assert(!JSON.stringify(res.data).includes("private"));
});

test("POST /api/membership: gabung kelas tersimpan; plan pro ditolak 403", async () => {
  const handler = createMembershipHandler({ pool: fakeProfilePool(), env: { NODE_ENV: "production" }, authDeps });
  let res = response();
  await handler({ method: "POST", headers: {}, body: { cohortCode: "rpl-2026-a" } }, res);
  assert.equal(res.code, 200);
  assert.equal(res.data.membership.plan, "kelas");
  assert.equal(res.data.membership.cohortCode, "RPL-2026-A");

  res = response();
  await handler({ method: "POST", headers: {}, body: { plan: "pro" } }, res);
  assert.equal(res.code, 403);

  res = response();
  await handler({ method: "DELETE", headers: {} }, res);
  assert.equal(res.code, 405);
});

const syncPayload = () => ({
  deviceId: "device-test", profileName: "Nara", sentAt: 1800000000000,
  save: { ...fullSave(), profile: { age: "academy" } },
  attempts: [{ id: "a1", sessionId: "q:1", won: true, passed: true, stars: 3, score: 900, accuracy: 98, wpm: 50, maxCombo: 20, xpAward: 80, coinsAward: 20, at: Date.UTC(2026, 9, 28, 8) }],
});

function fakeSyncPool({ previousTime, failGamification = false } = {}) {
  const calls = [];
  const connection = {
    async beginTransaction() { calls.push("begin"); },
    async execute(sql, args) {
      calls.push({ sql, args });
      if (failGamification && (sql.startsWith("INSERT INTO cs_gamification") || sql.startsWith("INSERT INTO cs_memberships"))) {
        const e = new Error("private"); e.code = "ER_NO_SUCH_TABLE"; throw e;
      }
      return [sql.startsWith("SELECT") ? (previousTime === undefined ? [] : [{ client_sent_at: previousTime }]) : {}];
    },
    async commit() { calls.push("commit"); },
    async rollback() { calls.push("rollback"); },
    release() { calls.push("release"); },
  };
  return { calls, async getConnection() { return connection; } };
}

test("sync menulis tabel 002 pada snapshot segar, dan hanya atensi pada snapshot basi", async () => {
  const fresh = fakeSyncPool();
  const ids = await persistTidbSync(fresh, "user:u1", syncPayload());
  assert.deepEqual(ids, ["a1"]);
  const sqls = fresh.calls.filter((c) => c.sql).map((c) => c.sql);
  assert(sqls.some((s) => s.startsWith("INSERT INTO cs_memberships")));
  assert(sqls.some((s) => s.startsWith("INSERT INTO cs_gamification")));
  assert(sqls.some((s) => s.startsWith("INSERT INTO cs_attention_days")));

  const stale = fakeSyncPool({ previousTime: 1900000000000 });
  await persistTidbSync(stale, "user:u1", syncPayload());
  const staleSqls = stale.calls.filter((c) => c.sql).map((c) => c.sql);
  assert(!staleSqls.some((s) => s.startsWith("INSERT INTO cs_gamification")));
  assert(staleSqls.some((s) => s.startsWith("INSERT INTO cs_attention_days")));
});

test("sync inti tetap berhasil bila skema 002 belum dimigrasi (savepoint)", async () => {
  const pool = fakeSyncPool({ failGamification: true });
  const ids = await persistTidbSync(pool, "user:u1", syncPayload());
  assert.deepEqual(ids, ["a1"]);
  assert(pool.calls.includes("commit"));
});

test("probeBetterAuthSchema: not_configured / ready / missing tanpa melempar", async () => {
  assert.equal(await probeBetterAuthSchema({}), "not_configured");
  const env = {
    DATABASE_URL: "mysql://user:pass@db.example.invalid:3306/auth",
    BETTER_AUTH_SECRET: "secret-for-test",
  };
  const via = (result) => ({ probeBetterAuthDatabase: async () => result });
  assert.equal(await probeBetterAuthSchema(env, via({ state: "connected", schema: "ready" })), "ready");
  assert.equal(await probeBetterAuthSchema(env, via({ state: "schema_missing", schema: "missing" })), "missing");
  assert.equal(await probeBetterAuthSchema(env, via({ state: "timeout" })), "timeout");
  assert.equal(await probeBetterAuthSchema(env, via({ state: "connection_failed" })), "connection_failed");
  assert.equal(
    await probeBetterAuthSchema(env, { probeBetterAuthDatabase: async () => { throw new Error("boom"); } }),
    "connection_failed",
  );
});
