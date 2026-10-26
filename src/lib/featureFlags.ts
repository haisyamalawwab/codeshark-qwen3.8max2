/* ============================================================
   MODE DATA — TES KONEKSI AWAL MENENTUKAN CLOUD ATAU LOKAL
   ------------------------------------------------------------
   VITE_DATA_MODE:
   - "auto"  (DEFAULT): saat aplikasi dibuka, sistem mengetes
     koneksi cloud DB lewat GET /api/database-status (server
     mengetes TiDB Cloud DAN Aiven).
       • Tes menyatakan TERHUBUNG → mode CLOUD (sinkron + login
         cloud aktif; localStorage tetap cermin lokal/local-first).
       • Tes GAGAL / timeout / belum terkonfigurasi → mode LOKAL
         (SQLite/localStorage, tanpa jaringan sama sekali).
     Tes diulang berkala (60 dtk / fokus jendela) sehingga mode
     bisa naik ke cloud bila database kembali terjangkau.
   - "local" : paksa lokal, tanpa tes.
   - "cloud" : paksa cloud, tanpa fallback.

   Mode EFEKTIF ditetapkan SiteSettingsProvider (siteSettings.tsx)
   sebelum anak-anaknya dirender; modul non-React membacanya lewat
   getter isCloud*() di file ini. Halaman admin tetap nonaktif
   kecuali mode terkonfigurasi "cloud" (entry admin tidak dibangun
   pada mode auto/local). Detail: docs/MODE-LOKAL.md.
   ============================================================ */

export type ConfiguredMode = "auto" | "local" | "cloud";
export type EffectiveMode = "local" | "cloud";
export type CloudProvider = "tidb" | "aiven" | "local";

const rawMode = String(import.meta.env.VITE_DATA_MODE ?? "auto").trim().toLowerCase();

/** Mode yang diminta konfigurasi build (belum tentu hasil tes awal). */
export const CONFIGURED_MODE: ConfiguredMode =
  rawMode === "local" || rawMode === "cloud" ? rawMode : "auto";

/* Mode efektif MUTABLE — ditulis provider setelah tes koneksi awal.
   Default aman sebelum tes: cloud hanya bila dipaksa "cloud". */
let effectiveMode: EffectiveMode = CONFIGURED_MODE === "cloud" ? "cloud" : "local";
let effectiveProvider: CloudProvider = CONFIGURED_MODE === "cloud" ? "tidb" : "local";

export interface DataModeInfo {
  /** Hasil akhir yang berlaku saat ini. */
  mode: EffectiveMode;
  provider: CloudProvider;
  configured: ConfiguredMode;
  /** forced = dari konfigurasi; probe = dari tes koneksi awal; fallback = tes gagal → lokal. */
  source: "forced" | "probe" | "fallback";
  /** Alasan fallback (state probe: connection_failed, timeout, offline, …) bila ada. */
  reason?: string;
}

/** Dipanggil SiteSettingsProvider setiap kali tes koneksi selesai. */
export function setEffectiveDataMode(mode: EffectiveMode, provider: CloudProvider) {
  effectiveMode = mode;
  effectiveProvider = provider;
}

export function getEffectiveDataMode(): EffectiveMode {
  return effectiveMode;
}

export function getEffectiveProvider(): CloudProvider {
  return effectiveProvider;
}

export function isCloudEnabled(): boolean {
  return effectiveMode === "cloud";
}

export function isLocalMode(): boolean {
  return effectiveMode === "local";
}

/** Sinkronisasi progres ke server (api/sync-progress). */
export function isCloudSyncEnabled(): boolean {
  return isCloudEnabled();
}

/** Login Supabase/Google + token untuk API (jalur legacy). */
export function isCloudAuthEnabled(): boolean {
  return isCloudEnabled();
}

/**
 * Better Auth adalah layanan identitas TERPISAH dari database game:
 * login email boleh dicoba pada mode auto/cloud meskipun tes awal
 * TiDB/Aiven jatuh ke lokal. Hanya paksa-lokal (VITE_DATA_MODE=local)
 * yang mematikannya demi nol koneksi cloud.
 */
export function isBetterAuthEnabled(): boolean {
  return CONFIGURED_MODE !== "local";
}

/**
 * Halaman admin: tetap NONAKTIF pada mode auto/local (entry tidak
 * dibangun). Hanya hidup bila build dipaksa cloud dan tidak
 * dimatikan eksplisit via VITE_ADMIN_ENABLED=false.
 */
export const ADMIN_ENABLED =
  CONFIGURED_MODE === "cloud" &&
  String(import.meta.env.VITE_ADMIN_ENABLED ?? "").trim().toLowerCase() !== "false";
