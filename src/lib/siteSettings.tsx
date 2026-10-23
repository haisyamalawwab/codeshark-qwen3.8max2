import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { validateSettings, type SiteSettings } from '../../shared/site-settings.mjs';
import { accessToken } from './auth';

export interface SettingsDocument { settings: SiteSettings; revision: number; updatedAt: string | null; updatedBy?: string | null }
export async function settingsRequest(admin = false, update?: SettingsDocument): Promise<SettingsDocument> {
  const token = admin ? await accessToken() : null;
  if (admin && !token) throw new Error('Silakan login Google dengan akun admin terlebih dahulu.');
  const response = await fetch(admin ? '/api/admin-settings' : '/api/site-settings', {
    method: update ? 'PUT' : 'GET', cache: 'no-store', signal: AbortSignal.timeout(12000),
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(update ? { 'Content-Type': 'application/json' } : {}) },
    body: update ? JSON.stringify({ settings: update.settings, revision: update.revision }) : undefined,
  });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('API konfigurasi tidak tersedia.');
  const body = await response.json();
  if (!response.ok || body.ok !== true) throw new Error(body.error || 'Gagal memuat konfigurasi.');
  if (!Number.isSafeInteger(body.revision) || body.revision < 0) throw new Error('Revisi konfigurasi tidak valid.');
  return { ...body, settings: validateSettings(body.settings) };
}
const Context = createContext<SiteSettings | null>(null);
export function useSiteSettings(): SiteSettings {
  const value = useContext(Context);
  if (!value) throw new Error('SiteSettingsProvider diperlukan.');
  return value;
}
export function Unavailable({ message, retry }: { message: string; retry?: () => void }) {
  return <main className="min-h-screen grid place-items-center bg-slate-950 text-slate-100 p-6"><section className="max-w-xl rounded-2xl border border-cyan-700 bg-slate-900 p-8 space-y-4">
    <h1 className="text-2xl font-bold">Website / konten belum tersedia</h1><p role="status">{message}</p>
    <div className="flex flex-wrap gap-4">{retry && <button className="btn-primary" onClick={retry}>Coba lagi</button>}<a href="/">Kembali ke hub</a><a href="/admin/">Login admin</a></div>
  </section></main>;
}
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    try { const doc = await settingsRequest(); setSettings(doc.settings); setError(''); }
    catch { setError('Konfigurasi database tidak dapat dimuat. Periksa koneksi dan migrasi settings.'); }
  }, []);
  useEffect(() => {
    let alive = true;
    // Avoid overlapping periodic/focus requests and stale updates after unmount.
    let busy = false;
    const load = async () => {
      if (busy) return;
      busy = true;
      try { const doc = await settingsRequest(); if (alive) { setSettings(doc.settings); setError(''); } }
      catch { if (alive) setError('Konfigurasi database tidak dapat dimuat. Periksa koneksi dan migrasi settings.'); }
      finally { busy = false; }
    };
    void load();
    const interval = window.setInterval(() => void load(), 60000);
    window.addEventListener('focus', load);
    return () => { alive = false; clearInterval(interval); window.removeEventListener('focus', load); };
  }, []);
  useEffect(() => {
    if (!settings) return;
    document.title = settings.siteName;
    document.querySelector('meta[name="description"]')?.setAttribute('content', settings.description);
  }, [settings]);
  if (error) return <Unavailable message={error} retry={() => void reload()} />;
  if (!settings) return <Unavailable message="Memuat konfigurasi website…" />;
  if (settings.maintenance) return <Unavailable message={settings.announcement || 'Website sedang dalam pemeliharaan oleh admin.'} retry={() => void reload()} />;
  return <Context.Provider value={settings}>{settings.announcement && <aside role="status" className="bg-cyan-950 text-cyan-100 text-center p-3">{settings.announcement}</aside>}{children}</Context.Provider>;
}
