import { getTidbPool } from "./tidb.mjs";

export class SyncError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value, limit, field) => {
  if (typeof value !== "string" || !value.trim() || value.length > limit) throw new SyncError(400, `Invalid ${field}`);
  return value;
};
const number = (value, max, field) => {
  if (!Number.isFinite(value) || value < 0 || value > max) throw new SyncError(400, `Invalid ${field}`);
  return value;
};
const integer = (value, max, field) => {
  number(value, max, field);
  if (!Number.isSafeInteger(value)) throw new SyncError(400, `Invalid ${field}`);
  return value;
};

export function validatePayload(body) {
  if (!object(body)) throw new SyncError(400, "JSON object required");
  if (Buffer.byteLength(JSON.stringify(body)) > 1024 * 1024) throw new SyncError(413, "Payload too large");
  text(body.deviceId, 191, "deviceId");
  integer(body.sentAt, 8640000000000000, "sentAt");
  if (!object(body.save) || !object(body.save.modules) || !object(body.save.stats)) throw new SyncError(400, "Invalid save");
  integer(body.save.xp, Number.MAX_SAFE_INTEGER, "xp");
  integer(body.save.coins, Number.MAX_SAFE_INTEGER, "coins");
  if (body.profileName != null) text(body.profileName, 120, "profileName");
  if (body.save.profile?.age != null && !["junior", "teen", "senior", "academy"].includes(body.save.profile.age)) throw new SyncError(400, "Invalid age group");
  if (!Array.isArray(body.attempts) || body.attempts.length > 200) throw new SyncError(400, "Maximum 200 attempts");
  const ids = new Set();
  for (const a of body.attempts) {
    if (!object(a)) throw new SyncError(400, "Invalid attempt");
    text(a.id, 191, "attempt id");
    text(a.sessionId, 191, "sessionId");
    if (ids.has(a.id)) throw new SyncError(400, "Duplicate attempt id in request");
    ids.add(a.id);
    if (typeof a.won !== "boolean" || typeof a.passed !== "boolean") throw new SyncError(400, "Invalid result flags");
    integer(a.stars, 3, "stars");
    number(a.accuracy, 100, "accuracy");
    number(a.wpm, 1000000, "wpm");
    for (const key of ["score", "maxCombo", "xpAward", "coinsAward"]) integer(a[key], Number.MAX_SAFE_INTEGER, key);
    integer(a.at, 253402300799999, "attempt timestamp");
  }
  return body;
}

// Authentication is enforced independently of client-supplied userId/deviceId.
// Guest development sync is explicitly opt-in and NEVER permitted in production.
export async function resolveOwner(req, body, env = process.env, request = fetch) {
  if (env.TIDB_ALLOW_GUEST_SYNC === "true" && env.NODE_ENV !== "production" && !req.headers?.authorization) {
    return `guest:${text(body.deviceId, 180, "guest deviceId")}`;
  }
  const authorization = req.headers?.authorization;
  if (typeof authorization !== "string" || !/^Bearer \S+$/.test(authorization)) throw new SyncError(401, "Sign in required for cloud sync");
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) throw new SyncError(503, "Server identity verification is not configured");
  const url = new URL(env.SUPABASE_URL);
  if (url.protocol !== "https:") throw new SyncError(503, "Identity service requires HTTPS");
  const response = await request(new URL("/auth/v1/user", url), {
    headers: { authorization, apikey: env.SUPABASE_ANON_KEY },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401 || response.status === 403) throw new SyncError(401, "Invalid session");
  if (!response.ok) throw new SyncError(503, "Identity verification unavailable");
  const user = await response.json();
  return `user:${text(user.id, 180, "verified user id")}`;
}

export async function persistTidbSync(pool, owner, payload) {
  const connection = await pool.getConnection();
  try {
    await connection.execute("SET time_zone = '+00:00'");
    await connection.beginTransaction();
    // A single profile row serializes concurrent writes for this owner.
    await connection.execute(
      `INSERT INTO cs_profiles (owner_id, device_id, name, age_group) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE device_id=VALUES(device_id), name=VALUES(name), age_group=VALUES(age_group)`,
      [owner, payload.deviceId, payload.profileName || "anon", payload.save.profile?.age || "teen"],
    );
    const [rows] = await connection.execute("SELECT client_sent_at FROM cs_saves WHERE owner_id=? FOR UPDATE", [owner]);
    if (!rows.length || Number(rows[0].client_sent_at) <= payload.sentAt) {
      await connection.execute(
        `INSERT INTO cs_saves (owner_id, xp, coins, modules, stats, save_data, client_sent_at) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE xp=VALUES(xp), coins=VALUES(coins), modules=VALUES(modules), stats=VALUES(stats), save_data=VALUES(save_data), client_sent_at=VALUES(client_sent_at)`,
        [owner, payload.save.xp, payload.save.coins, JSON.stringify(payload.save.modules), JSON.stringify(payload.save.stats), JSON.stringify(payload.save), payload.sentAt],
      );
    }
    for (const a of payload.attempts) {
      await connection.execute(
        `INSERT INTO cs_attempts (owner_id, id, device_id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id=VALUES(id)`,
        [owner, a.id, payload.deviceId, a.sessionId, a.won, a.stars, a.score, a.accuracy, a.wpm, a.maxCombo, a.xpAward, a.coinsAward, a.passed, new Date(a.at)],
      );
    }
    await connection.commit();
    return payload.attempts.map((a) => a.id);
  } catch (error) {
    await connection.rollback().catch(() => {});
    throw error;
  } finally {
    connection.release();
  }
}

export function createTidbSyncHandler({ pool = getTidbPool, env = process.env, request = fetch } = {}) {
  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader?.("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    try {
      const body = validatePayload(req.body);
      const owner = await resolveOwner(req, body, env, request);
      const acceptedIds = await persistTidbSync(pool(), owner, body);
      return res.status(200).json({ ok: true, synced: acceptedIds.length, acceptedIds });
    } catch (error) {
      const status = error instanceof SyncError ? error.status : 503;
      // Never expose driver errors/SQL/credentials to the browser.
      return res.status(status).json({ ok: false, error: error instanceof SyncError ? error.message : "Database sync unavailable; retry later" });
    }
  };
}

export const handleTidbSync = createTidbSyncHandler();
