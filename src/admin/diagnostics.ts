/* Klien diagnostik admin — memanggil backend serverless
   GET /api/admin-diagnostics (wajib otorisasi admin).
   Tes koneksi TIDAK PERNAH dijalankan dari browser; halaman ini
   hanya menampilkan hasil tes yang dilakukan server. */
import type { DatabaseStatus } from "../lib/databaseStatus";

export interface ProviderDiagnostics {
  configured: boolean;
  state: string;
  schema: string;
  kind?: "postgres" | "mysql" | null;
  host?: string | null;
  database?: string | null;
  latencyMs?: number | null;
  tls?: string;
  databaseUrlSource?: string | null;
}

export interface AdminDiagnostics {
  ok: true;
  via: "token" | "supabase" | "better-auth";
  checkedAt: string;
  durationMs: number;
  mode: "auto" | "local" | "cloud";
  decision: "cloud" | "local";
  cloudReady: boolean;
  effectiveProvider: "tidb" | "aiven" | null;
  providers: {
    tidb: ProviderDiagnostics;
    aiven: ProviderDiagnostics;
    redis: { configured: boolean; kind: string | null; state: string; latencyMs: number | null };
    betterAuth: ProviderDiagnostics;
  };
  identityConfigured: boolean;
  syncPrerequisitesReady: boolean;
  environment: DatabaseStatus["environment"];
  presence: Record<string, boolean>;
  cache: { redisKind: string | null; statusTtlSeconds: number; fresh: boolean };
  runtime: { platform: string; node: string; region: string | null };
}

export class DiagnosticsError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function fetchAdminDiagnostics(opts: { token?: string; bearer?: string | null } = {}): Promise<AdminDiagnostics> {
  const response = await fetch("/api/admin-diagnostics", {
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: {
      Accept: "application/json",
      ...(opts.bearer ? { Authorization: `Bearer ${opts.bearer}` } : {}),
      ...(opts.token ? { "x-admin-token": opts.token } : {}),
    },
  });
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new DiagnosticsError(response.status, "Endpoint diagnostik tidak tersedia (pastikan fungsi /api/admin-diagnostics ter-deploy).");
  }
  const body = await response.json();
  if (!response.ok || body.ok !== true) {
    throw new DiagnosticsError(response.status, body.error || "Diagnostik ditolak server.");
  }
  return body as AdminDiagnostics;
}
