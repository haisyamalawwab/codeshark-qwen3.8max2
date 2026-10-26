import CaptainAvatar from "../characters/CaptainAvatar";

/**
 * Splash loading awal aplikasi.
 *
 * Dipakai SiteSettingsProvider selama keputusan mode data dan konfigurasi
 * awal belum selesai. Detail teknis pengecekan koneksi sengaja tidak
 * ditampilkan di sini agar pengalaman pemain terasa seperti loading
 * aplikasi pada umumnya; detail koneksi tetap tersedia setelah aplikasi
 * siap dan di halaman diagnostik admin.
 */
export default function BootLoading() {
  return (
    <main className="boot-loading" role="status" aria-live="polite" aria-busy="true" aria-label="Memuat aplikasi">
      <div className="boot-loading__content">
        <div className="boot-loading__badge" aria-hidden="true">
          <span className="boot-loading__ring" />
          <span className="boot-loading__captain">
            <CaptainAvatar size={144} loading="eager" className="boot-loading__image" />
          </span>
        </div>

        <p className="boot-loading__eyebrow">CODESHARK ACADEMY</p>
        <h1 className="boot-loading__title">
          Memuat aplikasi<span className="boot-loading__dots" aria-hidden="true">…</span>
        </h1>
        <p className="boot-loading__subtitle">Menyiapkan pengalaman belajarmu.</p>

        <div className="boot-loading__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </main>
  );
}
