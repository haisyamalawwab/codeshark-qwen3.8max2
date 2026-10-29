export const DATABASE_STATES = ["disabled", "env_incomplete", "config_invalid", "connection_failed", "schema_missing", "connected", "timeout"] as const;
export type DatabaseState = typeof DATABASE_STATES[number];
export const ENV_NAMES = ["DB_PROVIDER", "TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE", "TIDB_PORT", "TIDB_CA_PATH", "TIDB_CA_CERT", "SUPABASE_URL", "SUPABASE_JWKS_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY", "LAYERBASE_DATABASE_URL", "LAYERBASE_HOST", "LAYERBASE_USERNAME", "LAYERBASE_DATABASE", "LAYERBASE_PORT", "LAYERBASE_PASSWORD", "AUTH_DATABASE_URL", "DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"] as const;
export type ProviderState = DatabaseState | "not_configured";
export interface ProviderStatus {
  configured: boolean;
  state: ProviderState;
  schema: "not_checked" | "ready" | "missing";
  kind?: "postgres" | "mysql" | null;
}
export interface DatabaseStatus {
  state: DatabaseState;
  checkedAt: string;
  durationMs: number;
  identityConfigured: boolean;
  auth?: {
    provider: "better-auth" | "supabase" | null;
    configured: boolean;
    betterAuthConfigured: boolean;
    supabaseConfigured: boolean;
  };
  syncPrerequisitesReady: boolean;
  database: "not_checked" | "connected";
  schema: "not_checked" | "ready" | "missing";
  tls: "not_checked" | "verified";
  environment: Array<{ name: typeof ENV_NAMES[number]; required: boolean; status: "set" | "missing" | "optional" | "default" | "invalid" }>;
  /* Keputusan tes koneksi awal (server versi mode otomatis). Opsional demi
     kompatibilitas respons lama; bila absen diturunkan dari state TiDB. */
  mode?: "auto" | "local" | "cloud";
  cloudReady?: boolean;
  effectiveProvider?: "tidb" | "aiven" | null;
  decision?: "cloud" | "local";
  providers?: { tidb: ProviderStatus; aiven: ProviderStatus };
  /* Kesiapan per-fitur (server 002+). Opsional demi kompatibilitas. */
  features?: {
    gamificationSchema: "not_checked" | "ready" | "missing";
    authSchema: "not_configured" | "ready" | "missing" | "connection_failed" | "timeout";
    profile: boolean;
    membership: boolean;
  };
}

/** Provider cloud yang menang tes awal; mendukung respons server lama. */
export function probeDecision(report: DatabaseStatus): { cloud: boolean; provider: "tidb" | "aiven" | "local" } {
  if (typeof report.cloudReady === "boolean") {
    return report.cloudReady && report.effectiveProvider
      ? { cloud: true, provider: report.effectiveProvider }
      : { cloud: false, provider: "local" };
  }
  return report.state === "connected"
    ? { cloud: true, provider: "tidb" }
    : { cloud: false, provider: "local" };
}

export async function fetchDatabaseStatus(signal: AbortSignal): Promise<DatabaseStatus> {
  const response = await fetch("/api/database-status", { signal, cache: "no-store", headers: { Accept: "application/json" } });
  // 503 carries a valid not-ready report; an HTML SPA fallback is not health.
  if (![200, 503].includes(response.status) || !response.headers.get("content-type")?.includes("application/json")) throw new Error("Status API unavailable");
  const value = await response.json();
  const providerOk = (p: { configured?: unknown; state?: unknown; schema?: unknown } | undefined) =>
    p === undefined || (!!p && typeof p.configured === "boolean" &&
      [...DATABASE_STATES, "not_configured"].includes(p.state as ProviderState) &&
      ["not_checked", "ready", "missing"].includes(p.schema as string));
  if (!value || !DATABASE_STATES.includes(value.state) ||
      (value.cloudReady !== undefined && typeof value.cloudReady !== "boolean") ||
      (value.effectiveProvider !== undefined && value.effectiveProvider !== null && !["tidb", "aiven"].includes(value.effectiveProvider)) ||
      (value.decision !== undefined && !["cloud", "local"].includes(value.decision)) ||
      (value.providers !== undefined && (!providerOk(value.providers?.tidb) || !providerOk(value.providers?.aiven))) ||
      typeof value.checkedAt !== "string" || !Number.isFinite(Date.parse(value.checkedAt)) ||
      typeof value.durationMs !== "number" || !Number.isFinite(value.durationMs) || value.durationMs < 0 ||
      typeof value.identityConfigured !== "boolean" || typeof value.syncPrerequisitesReady !== "boolean" ||
      (value.auth !== undefined && (!value.auth || typeof value.auth.configured !== "boolean" ||
        typeof value.auth.betterAuthConfigured !== "boolean" || typeof value.auth.supabaseConfigured !== "boolean" ||
        ![null, "better-auth", "supabase"].includes(value.auth.provider))) ||
      !["not_checked", "connected"].includes(value.database) || !["not_checked", "ready", "missing"].includes(value.schema) ||
      !["not_checked", "verified"].includes(value.tls) || !Array.isArray(value.environment) ||
      !value.environment.every((f: { name?: unknown; required?: unknown; status?: unknown } | null) => f &&
        ENV_NAMES.includes(f.name as typeof ENV_NAMES[number]) && typeof f.required === "boolean" &&
        ["set", "missing", "optional", "default", "invalid"].includes(f.status as string))) {
    throw new Error("Invalid status response");
  }
  return value as DatabaseStatus;
}
