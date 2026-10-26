/* Kartu status MODE LOKAL — ditampilkan bila tes koneksi awal ke
   TiDB Cloud/Aiven gagal (atau mode dipaksa lokal). Tanpa fetch:
   membaca localStorage perangkat ini dan menawarkan backup JSON +
   SQLite (.sqlite via sql.js, lazy). */
import { useMemo, useState } from "react";
import { downloadSnapshot, exportSqliteBackup, getProvider, localStorageUsage } from "../lib/gameDb";
import { loadSave } from "../lib/storage";
import { loadHistory } from "../lib/history";
import { useEffectiveDataMode } from "../lib/siteSettings";
import { IconDatabase } from "./icons";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function LocalStorageStatus() {
  const dataMode = useEffectiveDataMode();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const info = useMemo(() => {
    const save = loadSave();
    const usage = localStorageUsage();
    return {
      save,
      provider: getProvider(),
      attempts: loadHistory().length,
      usageKb: formatBytes(usage.bytes),
      keyCount: usage.keys,
      hasProfile: !!save.profile,
      updatedAt: save.updatedAt ? new Date(save.updatedAt).toLocaleString("id-ID") : null,
    };
  }, []);

  const backupSqlite = async () => {
    setBusy(true);
    setMessage("");
    try {
      await exportSqliteBackup(loadSave());
      setMessage("Backup SQLite (.sqlite) diunduh — bisa dibuka di DB Browser for SQLite.");
    } catch {
      setMessage("SQLite gagal disiapkan di perangkat ini. Gunakan backup JSON sebagai gantinya.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="my-4 rounded-2xl border border-emerald-400/25 bg-slate-900/70 p-4 text-slate-100" aria-label="Penyimpanan lokal">
      <div className="flex flex-wrap items-center gap-3">
        <IconDatabase size={21} />
        <div className="flex-1 min-w-48">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Penyimpanan lokal · SQLite/localStorage</p>
          <p className="font-bold flex items-center gap-2" role="status" aria-live="polite">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Mode lokal aktif — data aman di perangkat ini
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        Progres (XP, koin, misi, streak) tersimpan di <code>localStorage</code> browser
        {info.provider === "sqlite" ? " dan backup SQLite sudah pernah dibuat" : ""}.
        {dataMode.source === "fallback" ? (
          <> Tes koneksi awal ke <strong>TiDB Cloud/Aiven belum berhasil</strong>
          {dataMode.reason ? <> (<code>{dataMode.reason}</code>)</> : null} — aplikasi otomatis memakai
          mode lokal dan akan mengetes ulang berkala; bila cloud terjangkau, mode naik sendiri.</>
        ) : (
          <> Mode data dipaksa <strong>lokal</strong> oleh konfigurasi — tidak ada data yang dikirim keluar perangkat.</>
        )}
      </p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div><dt className="text-slate-400">Data tersimpan</dt><dd>{info.usageKb} · {info.keyCount} kunci lokal</dd></div>
        <div><dt className="text-slate-400">Riwayat misi</dt><dd>{info.attempts} sesi tercatat</dd></div>
        <div><dt className="text-slate-400">Terakhir disimpan</dt><dd>{info.updatedAt ?? "Belum ada progres"}</dd></div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void backupSqlite()}
          className="rounded-lg border border-emerald-300/40 px-3 py-2 text-sm font-semibold hover:bg-emerald-400/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          {busy ? "Menyiapkan SQLite…" : "💾 Backup SQLite (.sqlite)"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => { downloadSnapshot(loadSave()); setMessage("Backup JSON diunduh."); }}
          className="rounded-lg border border-sky-300/40 px-3 py-2 text-sm font-semibold hover:bg-sky-400/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
        >
          Backup JSON
        </button>
      </div>
      {message && <p role="status" className="mt-2 text-xs text-slate-300">{message}</p>}
      <p className="mt-2 text-xs text-slate-400">
        Catatan: membersihkan data situs/browser akan menghapus progres lokal — unduh backup secara berkala.
      </p>
    </section>
  );
}
