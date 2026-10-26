import { isCloudReady } from "../lib/supabaseClient";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchDatabaseStatus } from "../lib/databaseStatus";
import type { DatabaseState, DatabaseStatus } from "../lib/databaseStatus";
import { IconDatabase } from "./icons";

const LABELS: Record<DatabaseState, [string, string]> = {
  disabled: ["Cloud belum diaktifkan", "Set DB_PROVIDER=tidb pada environment server lokal/Vercel. Netlify memakai TiDB secara langsung."],
  env_incomplete: ["Environment belum lengkap", "Lengkapi variabel wajib di Netlify → Environment variables → Functions, kemudian deploy ulang."],
  config_invalid: ["Konfigurasi database tidak valid", "Periksa port, CA PEM/path, dan gunakan database aplikasi, bukan sys/mysql. Pilih hanya satu sumber CA."],
  connection_failed: ["Koneksi database gagal", "Periksa kredensial, TLS, jaringan/IP allowlist, dan izin koneksi pada log server yang aman."],
  schema_missing: ["Database terhubung; skema belum siap", "Periksa skema cs_* dan izin SELECT. Jalankan db:tidb:init secara terpisah dengan akun migrasi."],
  connected: ["Database terhubung", "Koneksi TLS dan pembacaan struktur skema berhasil. Ini bukan bukti sinkronisasi data atau izin tulis."],
  timeout: ["Pemeriksaan melewati batas waktu", "Koneksi belum dapat dipastikan. Periksa jaringan dan coba kembali setelah beberapa saat."],
};
const ENV_LABELS = { set: "Terisi", missing: "Belum diisi", optional: "Opsional", default: "Default server", invalid: "Tidak valid" };

export default function DatabaseConnectionStatus() {
  const [report, setReport] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoading(true);
    setError("");
    setReport(null);
    const timer = window.setTimeout(() => controller.abort("timeout"), 12000);
    try {
      if (!navigator.onLine) throw new Error("offline");
      const result = await fetchDatabaseStatus(controller.signal);
      if (!controller.signal.aborted) setReport(result);
    } catch {
      if (active.current === controller && (!controller.signal.aborted || controller.signal.reason === "timeout")) {
        setError(navigator.onLine ? "Status belum dapat diperiksa. Pastikan API /api/database-status berjalan dan bukan halaman HTML." : "Perangkat offline. Koneksi database belum dapat diverifikasi.");
      }
    } finally {
      window.clearTimeout(timer);
      if (active.current === controller) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    return () => { active.current?.abort(); active.current = null; };
  }, [refresh]);

  const ready = report?.cloudReady ?? report?.state === "connected";
  const aivenActive = report?.effectiveProvider === "aiven";
  const title = loading
    ? "Memeriksa database…"
    : report
      ? aivenActive && report.state !== "connected"
        ? "Database terhubung (Aiven)"
        : LABELS[report.state][0]
      : "Status database belum tersedia";
  const publicLogin = isCloudReady();
  return (
    <section className="my-4 rounded-2xl border border-sky-400/20 bg-slate-900/70 p-4 text-slate-100" aria-label="Koneksi database dan environment">
      <div className="flex flex-wrap items-center gap-3">
        <IconDatabase size={21} />
        <div className="flex-1 min-w-48">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{aivenActive ? "Aiven" : "TiDB Cloud"} · status server{report?.providers ? ` · TiDB: ${report.providers.tidb.state} · Aiven: ${report.providers.aiven.state}` : ""}</p>
          <p className="font-bold flex items-center gap-2" role="status" aria-live="polite">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${loading ? "bg-sky-300" : ready ? "bg-emerald-400" : "bg-amber-400"}`} />
            {title}
          </p>
        </div>
        <button type="button" disabled={loading} onClick={() => void refresh()} className="rounded-lg border border-sky-300/40 px-3 py-2 text-sm font-semibold hover:bg-sky-400/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300">
          {loading ? "Memeriksa…" : "Periksa ulang"}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-300">{error || (report ? (aivenActive && report.state !== "connected" ? "Tes koneksi awal memilih Aiven sebagai database cloud aktif (TiDB tidak terpilih/tidak terjangkau). Sinkronisasi berjalan ke Aiven; konfigurasi website memakai bawaan lokal." : LABELS[report.state][1]) : "Memeriksa konfigurasi dan koneksi secara read-only.")}</p>
      <p className="mt-1 text-xs text-slate-400">Progres tetap tersimpan lokal. Status hijau tidak berarti data sudah tersinkron atau login berhasil.</p>
      {report && (
        <details className="mt-3 border-t border-slate-700 pt-3">
          <summary className="cursor-pointer text-sm font-semibold">Detail verifikasi & environment yang diperlukan</summary>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-400">TLS</dt><dd>{report.tls === "verified" ? "Terverifikasi pada koneksi baca" : "Belum diverifikasi"}</dd></div>
            <div><dt className="text-slate-400">Skema dan izin baca</dt><dd>{report.schema === "ready" ? "Siap" : report.schema === "missing" ? "Belum siap" : "Belum diperiksa"}</dd></div>
            <div><dt className="text-slate-400">Konfigurasi verifier login server</dt><dd>{report.identityConfigured ? "Terisi; token login belum diuji" : "Belum lengkap/tidak valid"}</dd></div>
            <div><dt className="text-slate-400">Konfigurasi login frontend</dt><dd>{publicLogin ? "Terisi; SDK/OAuth belum diuji" : "VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY belum lengkap atau tidak valid"}</dd></div>
          </dl>
          <p className="my-3 text-xs text-slate-400">Variabel di bawah diperiksa pada runtime server, bukan .env browser. Nilai secret tidak ditampilkan. CA opsional: pilih file path ATAU PEM environment; kosongkan keduanya untuk trusted CA store Node.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {report.environment.map((field) => (
              <li key={field.name} className="flex items-center justify-between gap-2 rounded-lg bg-slate-950/60 p-2 text-xs">
                <code>{field.name}</code>
                <span className={field.status === "missing" || field.status === "invalid" ? "text-amber-300" : "text-slate-300"}>{ENV_LABELS[field.status]}{field.required ? " · wajib" : ""}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">Diperiksa: {new Date(report.checkedAt).toLocaleString("id-ID")} · {report.durationMs} ms · hasil server dapat dicache 30 detik. Izin INSERT/UPDATE tidak diuji oleh pemeriksaan ini.</p>
        </details>
      )}
    </section>
  );
}
