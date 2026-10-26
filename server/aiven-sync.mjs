// Sync progres ke Aiven for PostgreSQL (skema legacy db/schema.sql:
// profiles/saves/attempts berbasis device_id).
// Validasi payload + autentikasi pemilik memakai aturan yang sama
// persis dengan jalur TiDB (server/tidb-sync.mjs) — tidak ada jalur
// anonim di produksi. Kesalahan driver tidak pernah ditampilkan.
import pg from "pg";
import { validatePayload, resolveOwner, SyncError } from "./tidb-sync.mjs";
import { aivenUrl, aivenSsl } from "./aiven.mjs";

let pool;
async function defaultGetPool(env) {
  pool ??= new pg.Pool({
    connectionString: aivenUrl(env),
    ssl: aivenSsl(env, aivenUrl(env)),
    max: 3,
    connectionTimeoutMillis: 10000,
  });
  return pool;
}

export async function persistAivenSync(client, payload) {
  const s = payload.save;
  await client.query("BEGIN");
  try {
    await client.query(
      `INSERT INTO profiles (device_id, name, age) VALUES ($1, $2, $3)
       ON CONFLICT (device_id) DO UPDATE SET name = EXCLUDED.name, updated_at = now()`,
      [payload.deviceId, payload.profileName || "anon", s.profile?.age || "teen"],
    );
    await client.query(
      `INSERT INTO saves (device_id, xp, coins, modules, stats) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (device_id) DO UPDATE SET
         xp = GREATEST(saves.xp, EXCLUDED.xp),
         coins = GREATEST(saves.coins, EXCLUDED.coins),
         modules = EXCLUDED.modules, stats = EXCLUDED.stats, updated_at = now()`,
      [payload.deviceId, s.xp, s.coins, JSON.stringify(s.modules), JSON.stringify(s.stats)],
    );
    for (const a of payload.attempts) {
      await client.query(
        `INSERT INTO attempts (id, device_id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, to_timestamp($13))
         ON CONFLICT (id) DO NOTHING`,
        [a.id, payload.deviceId, a.sessionId, a.won, a.stars, a.score, a.accuracy, a.wpm, a.maxCombo, a.xpAward, a.coinsAward, a.passed, Math.floor(a.at / 1000)],
      );
    }
    await client.query("COMMIT");
    return payload.attempts.map((a) => a.id);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  }
}

export function createAivenSyncHandler({ env = process.env, request = fetch, getPool = defaultGetPool, authDeps = {} } = {}) {
  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader?.("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    let client;
    try {
      const body = validatePayload(req.body);
      await resolveOwner(req, body, env, request, authDeps); // auth wajib; baris legacy tetap berbasis device_id
      client = await (await getPool(env)).connect();
      const acceptedIds = await persistAivenSync(client, body);
      return res.status(200).json({ ok: true, synced: acceptedIds.length, acceptedIds });
    } catch (error) {
      const status = error instanceof SyncError ? error.status : 503;
      return res.status(status).json({
        ok: false,
        error: error instanceof SyncError ? error.message : "Database sync unavailable; retry later",
      });
    } finally {
      client?.release?.();
    }
  };
}
