import AdminSetupChecklist from "./AdminSetupChecklist";
import { useEffect, useState } from 'react';
import { currentUser, onAuthChange, signInWithGoogle, signOut, type AuthUser } from '../lib/auth';
import { settingsRequest, type SettingsDocument } from '../lib/siteSettings';
import { GAME_IDS, MODULE_IDS, validateSettings, type SiteSettings } from '../../shared/site-settings.mjs';
import DatabaseConnectionStatus from '../ui/DatabaseConnectionStatus';

const names = { ci_backend: 'Backend PHP / CodeIgniter', py_backend: 'Backend Python', crossplatform: 'CrossPlatform Studio', tower: 'Coding Tower', shark: 'CodeShark', html: 'HTML', css: 'CSS', js: 'JavaScript' };
const input = 'w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white';
export default function AdminSettings() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [doc, setDoc] = useState<SettingsDocument | null>(null);
  const [saved, setSaved] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    const off = onAuthChange(next => { if (alive) { setUser(previous => { if (previous?.id === next?.id) return previous; return next; }); } });
    currentUser().then(next => { if (alive) setUser(next); }).catch(() => { if (alive) setMessage('Login belum tersedia. Periksa konfigurasi autentikasi.'); }).finally(() => { if (alive) setAuthLoading(false); });
    return () => { alive = false; off(); };
  }, []);
  useEffect(() => {
    setDoc(null);
    setMessage('');
    if (!user) { setBusy(false); return; }
    let alive = true;
    setBusy(true);
    settingsRequest(true).then(value => { if (alive) { setDoc(value); setSaved(JSON.stringify(value.settings)); setMessage(''); } })
      .catch(error => { if (alive) setMessage(error.message); }).finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [user]);
  const dirty = !!doc && JSON.stringify(doc.settings) !== saved;
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const edit = (patch: Partial<SiteSettings>) => { setDoc(value => value ? { ...value, settings: { ...value.settings, ...patch } } : value); setMessage(''); };
  const reload = async () => {
    if (dirty && !window.confirm('Buang perubahan yang belum disimpan?')) return;
    setBusy(true);
    try { const value = await settingsRequest(true); setDoc(value); setSaved(JSON.stringify(value.settings)); setMessage('Konfigurasi dimuat dari database.'); }
    catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800"><div className="max-w-5xl mx-auto p-5 flex items-center justify-between gap-4 flex-wrap"><div><p className="text-cyan-300 text-xs tracking-widest font-bold">ADMIN CONSOLE</p><h1 className="text-2xl font-bold">Pengaturan website</h1></div><a href="/" className="underline">← Kembali ke website</a></div></header>
    <main className="max-w-5xl mx-auto p-5 space-y-6">
      <p className="text-slate-400">Konfigurasi global tersimpan di TiDB. Hanya ID pengguna dalam allowlist server yang dapat membaca panel dan menyimpan perubahan.</p>
      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4">
        <h2 className="text-lg font-bold">Identitas administrator</h2>
        {authLoading ? <p>Memeriksa sesi…</p> : user ? <div className="flex flex-wrap gap-4 items-center"><p>{user.email || user.id}</p><button disabled={busy} onClick={() => void signOut().catch(() => setMessage('Gagal keluar.'))} className="underline">Keluar</button><button disabled={busy} onClick={() => void reload()} className="underline">Muat ulang konfigurasi</button></div> : <button className="btn-primary" onClick={() => void signInWithGoogle("/admin/").catch(error => setMessage(error.message))}>Login Google sebagai admin</button>}
      </section>
      <AdminSetupChecklist signedIn={!!user} authorized={!!doc && !!user} loadingAccess={busy || authLoading} revision={doc?.revision} />
      <DatabaseConnectionStatus />
      {message && <p role="status" className="rounded-xl border border-amber-600 bg-amber-950 p-4">{message}</p>}
      {busy && <p role="status">Memproses…</p>}
      {doc && user && <form className="space-y-6" onSubmit={async event => {
        event.preventDefault(); setBusy(true); setMessage('');
        try {
          validateSettings(doc.settings);
          if (doc.settings.maintenance && !window.confirm('Aktifkan maintenance? Halaman pemain akan ditutup sementara.')) return;
          const result = await settingsRequest(true, doc); setDoc(result); setSaved(JSON.stringify(result.settings)); setMessage('Berhasil disimpan di database.');
        } catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
      }}>
        <fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4"><h2 className="text-xl font-bold">Identitas & setup website</h2>
            <label className="block space-y-2"><span>Nama website</span><input className={input} required maxLength={80} value={doc.settings.siteName} onChange={e => edit({ siteName: e.target.value })} /></label>
            <label className="block space-y-2"><span>Deskripsi website</span><textarea className={input} maxLength={500} value={doc.settings.description} onChange={e => edit({ description: e.target.value })} /></label>
            <label className="block space-y-2"><span>Pengumuman publik / pesan maintenance</span><textarea className={input} maxLength={1000} value={doc.settings.announcement} onChange={e => edit({ announcement: e.target.value })} /></label>
            <label className="flex gap-3 items-center"><input type="checkbox" checked={doc.settings.maintenance} onChange={e => edit({ maintenance: e.target.checked })} />Mode maintenance (panel admin tetap dapat diakses)</label>
          </section>
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4"><h2 className="text-xl font-bold">Aktivasi sub-game</h2><p className="text-slate-400">Berlaku di hub dan URL langsung. Menonaktifkan game tidak menghapus progres.</p><div className="grid sm:grid-cols-2 gap-3">{GAME_IDS.map(id => <label key={id} className="flex justify-between gap-3 rounded-xl border border-slate-700 p-4"><span>{names[id]}</span><input type="checkbox" checked={doc.settings.games[id]} onChange={e => edit({ games: { ...doc.settings.games, [id]: e.target.checked } })} /></label>)}</div></section>
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4"><h2 className="text-xl font-bold">Aktivasi modul dasar</h2><p className="text-slate-400">HTML, CSS, dan JavaScript untuk CodeShark / Coding Tower. Track backend dan mobile mengikuti aktivasi sub-game masing-masing.</p><div className="flex flex-wrap gap-6">{MODULE_IDS.map(id => <label key={id} className="flex items-center gap-3"><input type="checkbox" checked={doc.settings.modules[id]} onChange={e => edit({ modules: { ...doc.settings.modules, [id]: e.target.checked } })} />{names[id]}</label>)}</div></section>
          <div className="flex gap-4 items-center flex-wrap"><button className="btn-primary" type="submit" disabled={!dirty}>Simpan ke database</button><button type="button" className="underline" onClick={() => void reload()}>Muat ulang</button><span className="text-slate-400 text-sm">Revisi {doc.revision} • {dirty ? 'Perubahan belum disimpan' : 'Sesuai database'}</span></div>
          {doc.updatedAt && <p className="text-sm text-slate-400">Terakhir disimpan: {new Date(doc.updatedAt).toLocaleString('id-ID')}</p>}
        </fieldset>
      </form>}
      <p className="text-sm text-slate-500">Password database, kunci autentikasi, dan allowlist admin tetap di environment server — tidak disimpan dalam konfigurasi publik.</p>
    </main>
  </div>;
}
