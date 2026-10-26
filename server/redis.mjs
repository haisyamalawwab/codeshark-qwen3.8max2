// ============================================================
// REDIS CACHE (OPSIONAL) — lapisan akselerasi, BUKAN database utama.
// Dipakai untuk berbagi cache antar-instance serverless:
//   - hasil tes koneksi /api/database-status (TTL 30 dtk)
//   - dokumen site-settings publik (TTL 30 dtk, diinvalidasi saat PUT)
// Tanpa konfigurasi Redis, pemanggil jatuh ke cache in-memory
// per-instance seperti sebelumnya — aplikasi tetap jalan penuh.
//
// Konfigurasi (pilih satu):
//   Upstash REST (disarankan untuk Netlify/Vercel serverless):
//     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//   TCP (Aiven for Valkey/Redis, Redis Cloud, dll):
//     REDIS_URL=rediss://user:pass@host:port  (driver ioredis)
// Kredensial tidak pernah masuk laporan/log respons.
// ============================================================

const trimmed = (value) => (typeof value === "string" ? value.trim() : "");

/** Konfigurasi Redis efektif, atau null bila tidak dikonfigurasi. */
export function redisConfig(env = process.env) {
  const restUrl = trimmed(env.UPSTASH_REDIS_REST_URL);
  const restToken = trimmed(env.UPSTASH_REDIS_REST_TOKEN);
  if (restUrl && restToken) return { kind: "upstash-rest", url: restUrl, token: restToken };
  const tcpUrl = trimmed(env.REDIS_URL) || trimmed(env.AIVEN_REDIS_URL) || trimmed(env.VALKEY_URL);
  if (tcpUrl) return { kind: "tcp", url: tcpUrl };
  return null;
}

export function redisConfigured(env = process.env) {
  return redisConfig(env) !== null;
}

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error(`${label} timeout`), { code: "ETIMEDOUT" })), ms)),
  ]);

async function defaultCreateTcpClient(url) {
  const { default: Redis } = await import("ioredis");
  const client = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
    enableOfflineQueue: false,
  });
  client.on("error", () => { /* cegah unhandled 'error' event menjatuhkan fungsi */ });
  await client.connect();
  return client;
}

/**
 * Cache string sederhana di atas Redis.
 * Mengembalikan null bila Redis tidak dikonfigurasi (pemanggil
 * memakai fallback in-memory-nya sendiri).
 */
export function createRedisCache(env = process.env, { fetchImpl = fetch, createTcpClient = defaultCreateTcpClient, timeoutMs = 3000 } = {}) {
  const config = redisConfig(env);
  if (!config) return null;

  if (config.kind === "upstash-rest") {
    const command = async (args) => {
      const response = await withTimeout(fetchImpl(config.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(args),
      }), timeoutMs, "redis rest");
      const body = await response.json();
      if (!response.ok || body.error) throw new Error("Redis REST command failed");
      return body.result;
    };
    return {
      kind: config.kind,
      get: (key) => command(["GET", key]),
      set: (key, value, ttlSeconds) => command(["SET", key, value, "EX", ttlSeconds]),
      del: (key) => command(["DEL", key]),
      ping: () => command(["PING"]),
    };
  }

  // TCP (ioredis) — klien dibuat malas dan dipakai ulang selama instance hangat.
  let clientPromise;
  const client = () => (clientPromise ??= createTcpClient(config.url));
  const call = async (fn) => withTimeout(fn(await client()), timeoutMs, "redis tcp");
  return {
    kind: config.kind,
    get: (key) => call((c) => c.get(key)),
    set: (key, value, ttlSeconds) => call((c) => c.set(key, value, "EX", ttlSeconds)),
    del: (key) => call((c) => c.del(key)),
    ping: () => call((c) => c.ping()),
  };
}

let sharedCache;
let sharedCacheKind;
/** Cache bersama satu proses (null bila Redis tidak dikonfigurasi). */
export function getSharedCache(env = process.env, deps) {
  const config = redisConfig(env);
  if (!config) return null;
  if (!sharedCache || sharedCacheKind !== config.kind) {
    sharedCache = createRedisCache(env, deps);
    sharedCacheKind = config.kind;
  }
  return sharedCache;
}

/**
 * Tes koneksi Redis untuk halaman admin: PING + tulis/baca kunci
 * diagnostik ber-TTL pendek (membuktikan izin tulis cache).
 * State: not_configured | connected | connection_failed | timeout
 */
export async function probeRedis(env = process.env, { cache, now = Date.now, ...deps } = {}) {
  const config = redisConfig(env);
  if (!config) return { configured: false, kind: null, state: "not_configured", latencyMs: null };
  const started = now();
  try {
    const client = cache ?? createRedisCache(env, deps);
    const pong = await client.ping();
    if (String(pong).toUpperCase() !== "PONG") throw new Error("unexpected ping reply");
    const marker = `diag-${started}`;
    await client.set("codeshark:diag:ping", marker, 10);
    const readBack = await client.get("codeshark:diag:ping");
    if (readBack !== marker) throw new Error("read-back mismatch");
    return { configured: true, kind: config.kind, state: "connected", latencyMs: Math.max(0, now() - started) };
  } catch (error) {
    const timeout = error?.code === "ETIMEDOUT" || /timeout/i.test(error?.message || "");
    return { configured: true, kind: config.kind, state: timeout ? "timeout" : "connection_failed", latencyMs: null };
  }
}
