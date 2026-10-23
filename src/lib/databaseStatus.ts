export const DATABASE_STATES = ["disabled", "env_incomplete", "config_invalid", "connection_failed", "schema_missing", "connected", "timeout"] as const;
export type DatabaseState = typeof DATABASE_STATES[number];
export const ENV_NAMES = ["DB_PROVIDER", "TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE", "TIDB_PORT", "TIDB_CA_PATH", "TIDB_CA_CERT", "SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;
export interface DatabaseStatus {
  state: DatabaseState;
  checkedAt: string;
  durationMs: number;
  identityConfigured: boolean;
  syncPrerequisitesReady: boolean;
  database: "not_checked" | "connected";
  schema: "not_checked" | "ready" | "missing";
  tls: "not_checked" | "verified";
  environment: Array<{ name: typeof ENV_NAMES[number]; required: boolean; status: "set" | "missing" | "optional" | "default" | "invalid" }>;
}

export async function fetchDatabaseStatus(signal: AbortSignal): Promise<DatabaseStatus> {
  const response = await fetch("/api/database-status", { signal, cache: "no-store", headers: { Accept: "application/json" } });
  // 503 carries a valid not-ready report; an HTML SPA fallback is not health.
  if (![200, 503].includes(response.status) || !response.headers.get("content-type")?.includes("application/json")) throw new Error("Status API unavailable");
  const value = await response.json();
  if (!value || !DATABASE_STATES.includes(value.state) ||
      typeof value.checkedAt !== "string" || !Number.isFinite(Date.parse(value.checkedAt)) ||
      typeof value.durationMs !== "number" || !Number.isFinite(value.durationMs) || value.durationMs < 0 ||
      typeof value.identityConfigured !== "boolean" || typeof value.syncPrerequisitesReady !== "boolean" ||
      !["not_checked", "connected"].includes(value.database) || !["not_checked", "ready", "missing"].includes(value.schema) ||
      !["not_checked", "verified"].includes(value.tls) || !Array.isArray(value.environment) ||
      !value.environment.every((f: { name?: unknown; required?: unknown; status?: unknown } | null) => f &&
        ENV_NAMES.includes(f.name as typeof ENV_NAMES[number]) && typeof f.required === "boolean" &&
        ["set", "missing", "optional", "default", "invalid"].includes(f.status as string))) {
    throw new Error("Invalid status response");
  }
  return value as DatabaseStatus;
}
