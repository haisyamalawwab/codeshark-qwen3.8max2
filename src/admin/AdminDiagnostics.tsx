/* ============================================================
   HALAMAN ADMIN — DIAGNOSTIK & TES KONEKSI DATABASE
   Khusus admin; TIDAK memengaruhi jalannya aplikasi pemain.
   Halaman ini hanya MELIHAT status dan MEMICU tes koneksi;
   seluruh pengujian (TiDB Cloud MySQL, Aiven MySQL/PostgreSQL,
   Redis) dijalankan backend serverless (/api/*) karena browser
   tidak boleh memegang kredensial database. Tes bersifat
   read-only terhadap database aplikasi.
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { accessToken, currentUser, onAuthChange, signInWithEmail, signInWithGoogle, signOut, type AuthUser } from "../lib/auth";
import { isCloudReady } from "../lib/supabaseClient";
import { isBetterAuthEnabled, setEffectiveDataMode } from "../lib/featureFlags";
import { fetchDatabaseStatus, probeDecision, type DatabaseStatus } from "../lib/databaseStatus";
import { fetchAdminDiagnostics, DiagnosticsError, type AdminDiagnostics, type ProviderDiagnostics } from "./diagnostics";
import DatabaseConnectionStatus from "../ui/DatabaseConnectionStatus";

const TOKEN_KEY = "codeshark:adminTestToken";
const input = "w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white";
const card = "rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-3";

function StateBadge({ state }: { state: string }) {
  const ok = state === "connected";
  const idle = state === "not_configured" || state === "disabled";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ok ? "text-emerald-300 border-emerald-500/50" : idle ? "text-slate-400 border-slate-600" : "text-amber-300 border-amber-500/50"}`}>
      {ok ? "● Terhubung" : idle ? "○ Tidak terkonfigurasi" : `▲ ${state}`}
    </span>
  );
}

function ProviderCard({ title, data, extra }: { title: string; data: ProviderDiagnostics; extra?: string }) {
  return (
    <section className={card} aria-label={title}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-bold">{title}</h3>
        <StateBadge state={data.state} />
      </div>
      <dl className="text-sm grid gap-1.5">
        <div className="flex justify-between gap-3"><dt className="text-slate-400">Status tes</dt><dd><code>{data.state}</code></dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-400">Skema</dt><dd>{data.schema}</dd></div>
        {data.kind !== undefined && <div className="flex justify-between gap-3"><dt className="text-slate-400">Jenis</dt><dd>{data.kind ?? "—"}</dd></div>}
        {data.host !== undefined && <div className="flex justify-between gap-3"><dt className="text-slate-400">Host</dt><dd className="break-all text-right"><code>{data.host ?? "—"}</code></dd></div>}
        {data.database !== undefined && <div className="flex justify-between gap-3"><dt className="text-slate-400">Database</dt><dd><code>{data.database ?? "—"}</code></dd></div>}
        {data.tls !== undefined && <div className="flex justify-between gap-3"><dt className="text-slate-400">TLS</dt><dd>{data.tls}</dd></div>}
        <div className="flex justify-between gap-3"><dt className="text-slate-400">Latensi tes</dt><dd>{data.latencyMs == null ? "—" : `${data.latencyMs} ms`}</dd></div>
      </dl>
      {extra && <p className="text-xs text-slate-400">{extra}</p>}
    </section>
  );
}

export default function AdminDiagnostics() {
  const [publicReport, setPublicReport] = useState<DatabaseStatus | null>(null);
  const [publicError, setPublicError] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } });
  const [detail, setDetail] = useState<AdminDiagnostics | null>(null);
  const [detailError, setDetailError] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const runPublicProbe = useCallback(async () => {
    try {
      const report = await fetchDatabaseStatus(AbortSignal.timeout(12000));
      setPublicReport(report);
      setPublicError("");
      const decision = probeDecision(report);
      // Samakan mode efektif halaman ini dengan keputusan aplikasi,
      // agar login Google (bila cloud) dapat dipakai dari sini.
      setEffectiveDataMode(decision.cloud ? "cloud" : "local", decision.provider);
    } catch {
      setPublicError("Tes publik tidak dapat dijalankan (endpoint /api/database-status tidak terjangkau). Aplikasi pemain akan memakai mode lokal.");
      setEffectiveDataMode("local", "local");
    }
  }, []);

  useEffect(() => { void runPublicProbe(); }, [runPublicProbe]);

  useEffect(() => {
    let alive = true;
    const off = onAuthChange((next) => { if (alive) setUser(next); });
    currentUser().then((next) => { if (alive) setUser(next); }).catch(() => {});
    return () => { alive = false; off(); };
  }, [publicReport]);

  const runDetailedTest = async () => {
    setBusy(true);
    setDetailError("");
    try {
      const bearer = await accessToken().catch(() => null);
      const result = await fetchAdminDiagnostics({ token: token.trim() || undefined, bearer });
      setDetail(result);
    } catch (error) {
      setDetail(null);
      setDetailError(error instanceof DiagnosticsError ? `HTTP ${error.status} — ${error.message}` : "Tes mendalam gagal dijalankan.");
    } finally {
      setBusy(false);
    }
  };

  const loginWithEmail = async () => {
    setAuthBusy(true);
    setDetailError("");
    try {
      const next = await signInWithEmail({ email: adminEmail, password: adminPassword });
      setUser(next);
      setAdminPassword("");
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "Login email gagal.");
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = async () => {
    await signOut().catch(() => {});
    setUser(null);
    setDetail(null);
  };

  const saveToken = (value: string) => {
    setToken(value);
    try {
      if (value) sessionStorage.setItem(TOKEN_KEY, value); else sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* abaikan */ }
  };

  const decision = publicReport ? probeDecision(publicReport) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-cyan-300 text-xs tracking-widest font-bold">ADMIN · KHUSUS ADMIN</p>
            <h1 className="text-2xl font-bold">Diagnostik &amp; Tes Koneksi Database</h1>
          </div>
          <a href="/" className="underline">← Kembali ke website</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-5 space-y-6">
        <p className="text-slate-400">
          Halaman ini <strong className="text-slate-200">tidak memengaruhi jalannya aplikasi</strong> — hanya untuk
          melihat status dan mengetes koneksi. Seluruh pengujian dijalankan oleh backend serverless
          (<code>/api/database-status</code> &amp; <code>/api/admin-diagnostics</code> di Netlify Functions / Vercel API),
          bukan dari browser. Tes bersifat read-only terhadap database aplikasi.
        </p>

        <section className={card} aria-label="Keputusan mode aplikasi">
          <h2 className="text-lg font-bold">Keputusan aplikasi saat ini (tes awal publik)</h2>
          {publicError ? (
            <p role="alert" className="text-amber-300 text-sm">{publicError}</p>
          ) : decision ? (
            <p role="status" className="text-sm">
              Mode efektif:{" "}
              <strong className={decision.cloud ? "text-emerald-300" : "text-amber-300"}>
                {decision.cloud ? `CLOUD via ${decision.provider === "aiven" ? "Aiven" : "TiDB Cloud"}` : "LOKAL (SQLite/localStorage)"}
              </strong>
              {publicReport && <> · TiDB: <code>{publicReport.providers?.tidb.state ?? publicReport.state}</code> · Aiven: <code>{publicReport.providers?.aiven.state ?? "—"}</code> · diperiksa {new Date(publicReport.checkedAt).toLocaleString("id-ID")} (cache server 30 dtk)</>}
            </p>
          ) : <p role="status">Mengetes koneksi…</p>}
          <button type="button" className="underline text-sm" onClick={() => void runPublicProbe()}>↻ Tes ulang (publik)</button>
        </section>

        <DatabaseConnectionStatus />

        <section className={card} aria-label="Otorisasi admin">
          <h2 className="text-lg font-bold">Otorisasi untuk tes mendalam</h2>
          {user ? (
            <div className="flex flex-wrap gap-4 items-center text-sm">
              <p>Login sebagai {user.email || user.id}{user.provider === "email" ? ` · Better Auth${user.role ? ` (${user.role})` : ""}` : ""}</p>
              <button className="underline" onClick={() => void logout()}>Keluar</button>
            </div>
          ) : (
            <div className="space-y-4">
              {isBetterAuthEnabled() && (
                <form
                  className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
                  onSubmit={(event) => { event.preventDefault(); void loginWithEmail(); }}
                >
                  <label className="sr-only" htmlFor="admin-email">Email admin</label>
                  <input id="admin-email" type="email" className={input} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="email admin (Better Auth)" autoComplete="email" />
                  <label className="sr-only" htmlFor="admin-password">Kata sandi admin</label>
                  <input id="admin-password" type="password" className={input} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="kata sandi" autoComplete="current-password" />
                  <button type="submit" disabled={authBusy} className="btn-primary disabled:opacity-50">{authBusy ? "Masuk…" : "Login Email"}</button>
                </form>
              )}
              {isCloudReady() ? (
                <button className="btn-primary" onClick={() => void signInWithGoogle("/admin/").catch((e) => setDetailError(e.message))}>
                  Login Google sebagai admin
                </button>
              ) : (
                <p className="text-sm text-slate-400">Login Google legacy belum aktif. Login email di atas memakai Better Auth; akun harus ber-role admin atau terdaftar di ADMIN_USER_IDS. Token tes juga tetap tersedia.</p>
              )}
            </div>
          )}
          <label className="block space-y-2 text-sm">
            <span>Atau token tes server (<code>ADMIN_TEST_TOKEN</code>, opsional — disimpan hanya di sesi tab ini)</span>
            <input type="password" className={input} value={token} onChange={(e) => saveToken(e.target.value)} placeholder="tempel token admin…" autoComplete="off" />
          </label>
        </section>

        <section className="space-y-4" aria-label="Tes koneksi mendalam">
          <div className="flex items-center gap-4 flex-wrap">
            <button type="button" disabled={busy} onClick={() => void runDetailedTest()} className="btn-primary disabled:opacity-50">
              {busy ? "Mengetes…" : "🔌 Tes Koneksi Sekarang (fresh, tanpa cache)"}
            </button>
            {detail && <p className="text-sm text-slate-400">Via {detail.via} · {detail.durationMs} ms · {new Date(detail.checkedAt).toLocaleString("id-ID")} · platform {detail.runtime.platform} ({detail.runtime.node})</p>}
          </div>
          {detailError && <p role="alert" className="rounded-xl border border-amber-600 bg-amber-950 p-4 text-sm">{detailError}</p>}
          {detail && (
            <>
              <p role="status" className="text-sm">
                Keputusan tes: <strong className={detail.cloudReady ? "text-emerald-300" : "text-amber-300"}>
                  {detail.cloudReady ? `CLOUD via ${detail.effectiveProvider}` : "LOKAL — belum ada database cloud yang siap"}
                </strong> · DATA_MODE server: <code>{detail.mode}</code> · prasyarat sinkron (DB + Auth): {detail.syncPrerequisitesReady ? "siap" : "belum lengkap"}
              </p>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <ProviderCard title="☁️ TiDB Cloud (MySQL)" data={detail.providers.tidb} extra="Sumber konfigurasi website cloud + sinkron cs_*." />
                <ProviderCard title="☁️ Aiven" data={detail.providers.aiven} extra="MySQL memakai skema cs_*; PostgreSQL memakai skema legacy profiles/saves/attempts." />
                <ProviderCard
                  title="🔐 Better Auth (MariaDB)"
                  data={detail.providers.betterAuth}
                  extra="Database identitas Layerbase yang terpisah dari DB game: user/session/account/verification + role/banned admin plugin."
                />
                <ProviderCard
                  title="⚡ Redis Cache"
                  data={{ configured: detail.providers.redis.configured, state: detail.providers.redis.state, schema: "—", kind: detail.providers.redis.kind as never, latencyMs: detail.providers.redis.latencyMs }}
                  extra="Opsional: berbagi cache status & settings antar-instance serverless. Tanpa Redis aplikasi tetap jalan (cache in-memory)."
                />
              </div>
              <section className={card} aria-label="Checklist environment">
                <h3 className="font-bold">Checklist environment server (nama &amp; status saja)</h3>
                <ul className="grid gap-2 sm:grid-cols-2 text-xs">
                  {detail.environment.map((field) => (
                    <li key={field.name} className="flex items-center justify-between gap-2 rounded-lg bg-slate-950/60 p-2">
                      <code>{field.name}</code><span className="text-slate-300">{field.status}{field.required ? " · wajib" : ""}</span>
                    </li>
                  ))}
                  {Object.entries(detail.presence).map(([name, set]) => (
                    <li key={name} className="flex items-center justify-between gap-2 rounded-lg bg-slate-950/60 p-2">
                      <code>{name}</code><span className="text-slate-300">{set ? "set" : "missing"}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400">Izin TULIS database tidak dibuktikan oleh tes read-only ini (terbukti saat sinkron pertama berhasil). Redis diuji dengan PING + tulis/baca kunci diagnostik ber-TTL 10 detik.</p>
              </section>
            </>
          )}
        </section>

        <p className="text-sm text-slate-500">
          Arsitektur: UI admin ini satu repo dengan aplikasi (entry terpisah <code>/admin/</code>), sedangkan
          pengujian koneksi adalah <strong>backend khusus serverless</strong> — fungsi Netlify
          (<code>netlify/functions/</code>) / Vercel (<code>api/</code>) berbagi logika <code>server/</code>.
          Tidak perlu server backend terpisah. Panduan deploy: <code>docs/035_deploy-netlify-vercel_26102026_0819.md</code>.
        </p>
      </main>
    </div>
  );
}
