/* Cybernetic Deep-Sea Diver (Penyelam Samudra Cyber)
   Digunakan di Pangkalan Samudra (TypingGame) dan Fondasi Menara (TowerPuzzle).
   Ilustrasi vektor high-fidelity dengan visor hologram, rebreather tank, dan reactor dada. */

export default function Diver({
  size = 56,
  className = "anim-bob",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[0_4px_12px_rgba(46,230,200,0.35)]"
      >
        <defs>
          {/* Gradien Helm Logam Samudra */}
          <linearGradient id="diverHelmetGrad" x1="16" y1="8" x2="48" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#225b82" />
            <stop offset="50%" stopColor="#113654" />
            <stop offset="100%" stopColor="#081e30" />
          </linearGradient>

          {/* Gradien Visor Cyan Bioluminesen */}
          <linearGradient id="diverVisorGrad" x1="20" y1="16" x2="44" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#45c6ff" />
            <stop offset="45%" stopColor="#2ee6c8" />
            <stop offset="100%" stopColor="#0a4660" />
          </linearGradient>

          {/* Kilau Kaca Visor */}
          <linearGradient id="diverGlassShine" x1="22" y1="18" x2="38" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Gradien Baju Selam Torso */}
          <linearGradient id="diverSuitGrad" x1="18" y1="38" x2="46" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a4666" />
            <stop offset="100%" stopColor="#092133" />
          </linearGradient>

          {/* Gradien Tangki Oksigen / Titanium */}
          <linearGradient id="diverTankGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0e314a" />
            <stop offset="50%" stopColor="#2b6b96" />
            <stop offset="100%" stopColor="#092233" />
          </linearGradient>

          {/* Filter Glow Visor */}
          <filter id="diverVisorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tangki Oksigen Kiri & Kanan (Latar Belakang) */}
        <rect x="11" y="22" width="7" height="24" rx="3.5" fill="url(#diverTankGrad)" stroke="#1a557a" strokeWidth="1" />
        <rect x="46" y="22" width="7" height="24" rx="3.5" fill="url(#diverTankGrad)" stroke="#1a557a" strokeWidth="1" />
        {/* Tutup Katup Tangki Oksigen Kuningan */}
        <path d="M12.5 20h4v2h-4z M47.5 20h4v2h-4z" fill="#ffc247" />

        {/* Antena Komunikasi Cyber Helm Kanan Atas */}
        <line x1="43" y1="13" x2="51" y2="4" stroke="#45c6ff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="51" cy="4" r="2" fill="#2ee6c8" className="animate-ping" style={{ transformOrigin: "51px 4px" }} />
        <circle cx="51" cy="4" r="1.5" fill="#ffffff" />

        {/* Baju Selam Torso & Bahu */}
        <path
          d="M16 46 C16 38, 22 36, 32 36 C42 36, 48 38, 48 46 L49 60 C49 62, 15 62, 15 60 Z"
          fill="url(#diverSuitGrad)"
          stroke="#276c96"
          strokeWidth="1.5"
        />

        {/* Pelindung Dada & Sabuk Harness */}
        <path d="M22 41 L25 58 M42 41 L39 58" stroke="#163952" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 52 H47" stroke="#102c42" strokeWidth="2.5" />

        {/* Inti Reaktor Dada (Arc Reactor Neon Teal) */}
        <circle cx="32" cy="48" r="4.5" fill="#041b26" stroke="#2ee6c8" strokeWidth="1.5" />
        <circle cx="32" cy="48" r="2.5" fill="#2ee6c8" filter="url(#diverVisorGlow)" />
        <circle cx="32" cy="48" r="1" fill="#ffffff" />

        {/* Pipa Selang Oksigen dari Tangki ke Helm */}
        <path
          d="M14 26 C14 36, 22 36, 26 36"
          fill="none"
          stroke="#45c6ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
          opacity="0.85"
        />
        <path
          d="M50 26 C50 36, 42 36, 38 36"
          fill="none"
          stroke="#45c6ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
          opacity="0.85"
        />

        {/* Cangkang Luar Helm Selam */}
        <ellipse cx="32" cy="23" rx="17" ry="16" fill="url(#diverHelmetGrad)" stroke="#45c6ff" strokeWidth="1.8" />

        {/* Bevel Kerangka Visor Depan (Bentuk Khas Helm Selam Antik Cyber) */}
        <rect
          x="19"
          y="13"
          width="26"
          height="19"
          rx="9"
          fill="#061928"
          stroke="#ffc247"
          strokeWidth="1.6"
        />

        {/* Lensa Kaca Visor Hologram */}
        <rect
          x="21"
          y="15"
          width="22"
          height="15"
          rx="7"
          fill="url(#diverVisorGrad)"
        />

        {/* Retikel Bidik HUD Hologram di dalam Visor */}
        <circle cx="32" cy="22.5" r="3.2" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 1" opacity="0.6" />
        <line x1="32" y1="18.5" x2="32" y2="20" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        <line x1="32" y1="25" x2="32" y2="26.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        <line x1="28" y1="22.5" x2="29.5" y2="22.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        <line x1="34.5" y1="22.5" x2="36" y2="22.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        <circle cx="32" cy="22.5" r="1" fill="#ffc247" />

        {/* Pantulan Kilau Lengkung Kaca Visor */}
        <path
          d="M23 18 C27 16, 36 16, 40 19 C37 21, 28 21, 23 18 Z"
          fill="url(#diverGlassShine)"
        />

        {/* Baut Rivet Pelindung Helm Logam */}
        <circle cx="17" cy="23" r="1.1" fill="#ffc247" />
        <circle cx="47" cy="23" r="1.1" fill="#ffc247" />
        <circle cx="32" cy="9" r="1.1" fill="#ffc247" />
        <circle cx="32" cy="34" r="1.1" fill="#ffc247" />

        {/* Micro-gelembung udara yang keluar perlahan dari katup */}
        <circle cx="14" cy="18" r="1.8" fill="rgba(255,255,255,0.7)" className="animate-bounce" style={{ animationDuration: "2.8s" }} />
        <circle cx="13" cy="12" r="1.2" fill="rgba(69,198,255,0.5)" />
        <circle cx="15" cy="7" r="0.9" fill="rgba(69,198,255,0.4)" />
      </svg>
    </div>
  );
}
