import { useEffect, useRef, useState } from 'react';
import { authConfig } from '../../shared/supabase-config.mjs';
import { SETUP_FIELDS, fetchSetupStatus, type SetupReport, type SetupState } from './setupStatus';

const labels: Record<SetupState, string> = { configured: 'Terisi · belum diuji', ready: 'Terverifikasi', missing: 'Belum diisi', invalid: 'Tidak valid', failed: 'Gagal / belum siap', blocked: 'Belum dapat diperiksa', optional: 'Opsional / default', unverified: 'Belum diverifikasi' };
const pending = (status: SetupState) => ['missing', 'invalid', 'failed', 'blocked', 'unverified'].includes(status);
export default function AdminSetupChecklist({ signedIn, authorized, loadingAccess, revision }: { signedIn: boolean; authorized: boolean; loadingAccess: boolean; revision?: number }) {
  const [report, setReport] = useState<SetupReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestNo, setRequestNo] = useState(0);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError(''); setReport(null);
    const timer = window.setTimeout(() => controller.abort(), 12000);
    fetchSetupStatus(controller.signal).then(value => { if (!controller.signal.aborted) setReport(value); })
      .catch(() => { if (request.current === controller) setError('Status setup server belum dapat dimuat. Pastikan dev API berjalan dan route /api/admin-setup tersedia.'); })
      .finally(() => { clearTimeout(timer); if (request.current === controller) setLoading(false); });
    return () => { request.current = null; controller.abort(); clearTimeout(timer); };
  }, [requestNo]);
  let browserAuth: SetupState;
  try { browserAuth = authConfig(import.meta.env, 'VITE_') ? 'configured' : 'missing'; } catch { browserAuth = 'invalid'; }
  const rows: Array<{ id: string; label: string; action: string; status: SetupState }> = [
    { id: 'browser_auth', label: 'Konfigurasi login browser', action: 'Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY (atau fallback anon), lalu restart Vite / build ulang.', status: browserAuth },
    ...(report?.items.map(item => ({ ...item, label: SETUP_FIELDS[item.id][0], action: SETUP_FIELDS[item.id][1] })) || []),
    { id: 'google_oauth', label: 'Google OAuth & redirect URL', action: 'Periksa provider Google dan allowlist redirect origin website serta /admin/ di dashboard Auth. Environment terisi tidak membuktikan OAuth selesai.', status: 'unverified' },
    { id: 'admin_access', label: 'Verifikasi sesi & akses admin', action: signedIn ? (loadingAccess ? 'Sedang memeriksa akses pengaturan di server…' : 'Akses belum terverifikasi. Periksa pesan login/akses, allowlist ID, serta koneksi dan tabel settings.') : 'Login menggunakan akun admin setelah konfigurasi Auth siap.', status: authorized ? 'ready' : 'unverified' },
    ...(revision === 0 ? [{ id: 'initial_save', label: 'Simpan konfigurasi pertama', action: 'Konfigurasi masih bawaan (revisi 0). Ubah pengaturan lalu simpan ke database.', status: 'unverified' as SetupState }] : []),
  ];
  const count = rows.filter(row => pending(row.status)).length;
  return <section aria-label="Checklist setup admin" className="rounded-2xl border border-amber-600/50 bg-slate-900 p-6 space-y-4">
    <div className="flex items-start justify-between gap-4 flex-wrap"><div><h2 className="text-xl font-bold">Setup yang perlu diselesaikan</h2><p className="text-sm text-slate-400 mt-1">{loading ? 'Memeriksa setup server…' : error ? 'Pemeriksaan server belum tersedia; setup belum dapat dipastikan.' : `${count} item memerlukan tindak lanjut / verifikasi.`}</p></div><button type="button" disabled={loading} onClick={() => setRequestNo(n => n + 1)} className="rounded-lg border border-slate-600 px-3 py-2 disabled:opacity-50">Periksa ulang setup</button></div>
    <p className="text-sm text-slate-400">Panel ini tetap terlihat sebelum login dan saat pengaturan gagal dimuat. Hanya nama konfigurasi dan status yang ditampilkan, bukan nilai credential.</p>
    {error && <p role="alert" className="text-amber-300">{error}</p>}
    <ul className="space-y-3">{rows.map(row => <li key={row.id} className="rounded-xl border border-slate-700 p-4"><div className="flex items-center justify-between flex-wrap gap-2"><h3 className="font-bold">{row.label}</h3><span className={`text-xs font-bold ${pending(row.status) ? 'text-amber-300' : row.status === 'ready' ? 'text-emerald-300' : 'text-slate-400'}`}>{labels[row.status]}</span></div>{Object.hasOwn(SETUP_FIELDS, row.id) && <code className="text-xs text-slate-500">{row.id}</code>}<p className="mt-2 text-sm text-slate-300">{row.action}</p></li>)}</ul>
    {report && <p className="text-xs text-slate-500">Diperiksa: {new Date(report.checkedAt).toLocaleString('id-ID')} · cache server {report.cacheSeconds} detik.</p>}
    <p className="text-xs text-slate-400">SUPABASE_SECRET_KEY / service-role tidak wajib untuk login pengguna dan bukan blocker setup. Pemeriksaan tabel bersifat read-only; izin tulis belum dibuktikan sampai penyimpanan berhasil. Jangan masukkan credential melalui panel ini.</p>
  </section>;
}
