import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { defaultSettings, migrateSettings, validateSettings, type SiteSettings } from '../../shared/site-settings.mjs';
import { accessToken } from './auth';
import {
  ADMIN_ENABLED, CONFIGURED_MODE, isLocalMode, setEffectiveDataMode,
  type CloudProvider, type DataModeInfo,
} from './featureFlags';
import { fetchDatabaseStatus, probeDecision } from './databaseStatus';
import BootLoading from '../ui/BootLoading';

/* ============================================================
   TES KONEKSI AWAL (mode otomatis) — alur provider:
   1) VITE_DATA_MODE=local  → langsung lokal (tanpa jaringan).
   2) VITE_DATA_MODE=cloud  → langsung cloud (perilaku lama).
   3) VITE_DATA_MODE=auto   → GET /api/database-status; server
      mengetes TiDB Cloud DAN Aiven.
        • cloudReady=true  → mode CLOUD (provider pemenang tes).
          Konfigurasi website dibaca dari cloud hanya bila
          provider TiDB; selain itu konfigurasi lokal dipakai,
          sinkron tetap cloud.
        • selain itu (gagal/timeout/offline/belum dikonfigurasi)
          → mode LOKAL penuh (SQLite/localStorage).
      Tes diulang tiap 60 detik & saat jendela fokus: mode bisa
      naik/turun mengikuti ketersediaan database cloud.
   Anak-anak provider BARU dirender setelah keputusan diambil,
   jadi getter isCloud*() & hook useEffectiveDataMode() selalu
   konsisten. Selama keputusan belum siap, pengguna melihat splash
   loading aplikasi generik — bukan status teknis pengecekan database
   atau layar “konten belum tersedia”. Detail: docs/036_mode-lokal_26102026_0819.md.
   ============================================================ */

export interface SettingsDocument { settings: SiteSettings; revision: number; updatedAt: string | null; updatedBy?: string | null }

const LOCAL_SETTINGS_KEY = 'codeshark:siteSettings:v1';
const PROBE_TIMEOUT_MS = 7000;
const BOOT_MIN_DISPLAY_MS = 650;

/** Konfigurasi efektif mode lokal: override perangkat bila valid, selain itu default. */
export function loadLocalSettings(): SettingsDocument {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (raw) {
      return { settings: validateSettings(migrateSettings(JSON.parse(raw))), revision: 0, updatedAt: null, updatedBy: null };
    }
  } catch {
    /* override rusak/tidak tersedia → pakai default */
  }
  return { settings: defaultSettings(), revision: 0, updatedAt: null, updatedBy: null };
}

/** Ambil dokumen konfigurasi dari API cloud (hanya masuk akal di mode cloud/TiDB). */
async function fetchCloudSettings(admin = false, update?: SettingsDocument): Promise<SettingsDocument> {
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
  return { ...body, settings: validateSettings(migrateSettings(body.settings)) };
}

export async function settingsRequest(admin = false, update?: SettingsDocument): Promise<SettingsDocument> {
  if (admin || update) {
    if (!ADMIN_ENABLED) throw new Error('Halaman admin nonaktif — konfigurasi cloud tidak dapat diubah dari mode ini.');
    return fetchCloudSettings(admin, update);
  }
  if (isLocalMode()) return loadLocalSettings();
  return fetchCloudSettings(false);
}

const SettingsContext = createContext<SiteSettings | null>(null);
export function useSiteSettings(): SiteSettings {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('SiteSettingsProvider diperlukan.');
  return value;
}

const DataModeContext = createContext<DataModeInfo | null>(null);
/** Mode data efektif hasil tes koneksi awal (cloud/lokal + providernya). */
export function useEffectiveDataMode(): DataModeInfo {
  const value = useContext(DataModeContext);
  if (!value) throw new Error('SiteSettingsProvider diperlukan.');
  return value;
}

export function Unavailable({ message, retry }: { message: string; retry?: () => void }) {
  return <main className="min-h-screen grid place-items-center bg-slate-950 text-slate-100 p-6"><section className="max-w-xl rounded-2xl border border-cyan-700 bg-slate-900 p-8 space-y-4">
    <h1 className="text-2xl font-bold">Website / konten belum tersedia</h1><p role="status">{message}</p>
    <div className="flex flex-wrap gap-4">{retry && <button className="btn-primary" onClick={retry}>Coba lagi</button>}<a href="/">Kembali ke hub</a>{ADMIN_ENABLED && <a href="/admin/">Login admin</a>}</div>
  </section></main>;
}

/** Satu kali resolusi: (tes koneksi bila auto) → mode efektif + konfigurasi. */
async function resolveModeAndSettings(): Promise<{ info: DataModeInfo; settings: SiteSettings }> {
  if (CONFIGURED_MODE === 'local') {
    setEffectiveDataMode('local', 'local');
    return {
      info: { mode: 'local', provider: 'local', configured: CONFIGURED_MODE, source: 'forced' },
      settings: loadLocalSettings().settings,
    };
  }
  if (CONFIGURED_MODE === 'cloud') {
    setEffectiveDataMode('cloud', 'tidb');
    const doc = await fetchCloudSettings(false); // gagal = error (tanpa fallback, sesuai paksa-cloud)
    return {
      info: { mode: 'cloud', provider: 'tidb', configured: CONFIGURED_MODE, source: 'forced' },
      settings: doc.settings,
    };
  }

  /* --- auto: tes koneksi awal --- */
  const fallback = (reason: string): { info: DataModeInfo; settings: SiteSettings } => {
    setEffectiveDataMode('local', 'local');
    return {
      info: { mode: 'local', provider: 'local', configured: CONFIGURED_MODE, source: 'fallback', reason },
      settings: loadLocalSettings().settings,
    };
  };
  if (typeof navigator !== 'undefined' && !navigator.onLine) return fallback('offline');

  let report;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    report = await fetchDatabaseStatus(controller.signal);
  } catch {
    return fallback(controller.signal.aborted ? 'timeout' : 'probe_failed');
  } finally {
    window.clearTimeout(timer);
  }

  const decision = probeDecision(report);
  if (!decision.cloud) {
    const detail = report.providers
      ? `TiDB: ${report.providers.tidb.state} · Aiven: ${report.providers.aiven.state}`
      : report.state;
    return fallback(detail);
  }

  const provider = decision.provider as Exclude<CloudProvider, 'local'>;
  setEffectiveDataMode('cloud', provider);
  let settings = loadLocalSettings().settings;
  if (provider === 'tidb') {
    // Konfigurasi website cloud tersimpan di TiDB; bila gagal dibaca,
    // konfigurasi lokal dipakai tetapi mode TETAP cloud untuk sinkron.
    try { settings = (await fetchCloudSettings(false)).settings; }
    catch { /* pakai konfigurasi lokal */ }
  }
  return {
    info: { mode: 'cloud', provider, configured: CONFIGURED_MODE, source: 'probe' },
    settings,
  };
}

const FORCED_LOCAL_INFO: DataModeInfo = { mode: 'local', provider: 'local', configured: 'local', source: 'forced' };

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(() =>
    CONFIGURED_MODE === 'local' ? loadLocalSettings().settings : null);
  const [modeInfo, setModeInfo] = useState<DataModeInfo | null>(() =>
    CONFIGURED_MODE === 'local' ? FORCED_LOCAL_INFO : null);
  const [error, setError] = useState('');
  const [bootReady, setBootReady] = useState(CONFIGURED_MODE === 'local');

  useEffect(() => {
    if (CONFIGURED_MODE === 'local') return;
    const timer = window.setTimeout(() => setBootReady(true), BOOT_MIN_DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const resolve = useCallback(async () => {
    try {
      const { info, settings: next } = await resolveModeAndSettings();
      setModeInfo(info);
      setSettings(next);
      setError('');
    } catch {
      // Hanya tercapai pada paksa-cloud (auto selalu punya fallback lokal).
      setError('Konfigurasi database tidak dapat dimuat. Periksa koneksi dan migrasi settings.');
    }
  }, []);

  const retryInitialLoad = useCallback(() => {
    setError('');
    setSettings(null);
    setModeInfo(null);
    void resolve();
  }, [resolve]);

  useEffect(() => {
    if (CONFIGURED_MODE === 'local') return; // sudah final sejak render pertama
    let alive = true;
    let busy = false;
    const run = async () => {
      if (busy) return;
      busy = true;
      try { if (alive) await resolve(); }
      finally { busy = false; }
    };
    void run();
    // Re-tes berkala: mode otomatis mengikuti ketersediaan cloud DB;
    // pada paksa-cloud ini menyegarkan konfigurasi seperti sebelumnya.
    const interval = window.setInterval(() => void run(), 60000);
    window.addEventListener('focus', run);
    return () => { alive = false; clearInterval(interval); window.removeEventListener('focus', run); };
  }, [resolve]);

  useEffect(() => {
    if (!settings) return;
    document.title = settings.siteName;
    document.querySelector('meta[name="description"]')?.setAttribute('content', settings.description);
  }, [settings]);

  if (error) return <Unavailable message={error} retry={retryInitialLoad} />;
  if (!settings || !modeInfo || !bootReady) return <BootLoading />;
  if (settings.maintenance) return <Unavailable message={settings.announcement || 'Website sedang dalam pemeliharaan.'} retry={retryInitialLoad} />;
  return (
    <DataModeContext.Provider value={modeInfo}>
      <SettingsContext.Provider value={settings}>
        {settings.announcement && <aside role="status" className="bg-cyan-950 text-cyan-100 text-center p-3">{settings.announcement}</aside>}
        {children}
      </SettingsContext.Provider>
    </DataModeContext.Provider>
  );
}
