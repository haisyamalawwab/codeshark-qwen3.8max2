/* Sub-Game Visual Artwork (Artwork Ilustrasi Khusus Sub-Game)
   Memberikan grafis identitas visual khas untuk:
   1. "shark" (Coding Shark / Samudra Ketik)
   2. "tower" (Coding Tower / Susun Menara HTML) */

interface Props {
  id: "shark" | "tower";
  active?: boolean;
  size?: number;
}

export default function SubGameArtwork({ id, active = false, size = 64 }: Props) {
  if (id === "shark") {
    return (
      <div
        className="relative inline-block select-none shrink-0"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
          style={{
            filter: active
              ? "drop-shadow(0 4px 16px rgba(46,230,200,0.5))"
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          <defs>
            <linearGradient id="sgSharkFin" x1="18" y1="12" x2="46" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#45c6ff" />
              <stop offset="45%" stopColor="#2ee6c8" />
              <stop offset="100%" stopColor="#0a3552" />
            </linearGradient>
            <linearGradient id="sgSharkWave" x1="8" y1="40" x2="56" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2ee6c8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Bingkai Dasar Rounded */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="16"
            fill={active ? "rgba(10,38,62,0.92)" : "rgba(8,25,42,0.75)"}
            stroke={active ? "#2ee6c8" : "rgba(126,196,236,0.25)"}
            strokeWidth={active ? "1.8" : "1.2"}
          />

          {/* Garis Grid Radar Sonar */}
          <circle cx="32" cy="32" r="22" stroke="#45c6ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

          {/* Ombak Laut Berkecepatan Tinggi */}
          <path
            d="M8 44 C18 38, 28 48, 38 42 C48 36, 54 44, 58 40"
            stroke="url(#sgSharkWave)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M12 49 C22 45, 30 52, 42 47 C50 43, 54 48, 56 46"
            stroke="#2ee6c8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Sirip Hiu Cyber Membelah Gelombang */}
          <path
            d="M20 42
               C24 30, 31 16, 40 12
               C39 22, 44 32, 48 42 Z"
            fill="url(#sgSharkFin)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />

          {/* Garis Sirkuit Neon di Sirip */}
          <path
            d="M27 38 C30 28, 34 20, 38 17"
            stroke="#ffffff"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />

          {/* Tombol Keyboard Melayang dengan Huruf Kode */}
          <rect x="13" y="24" width="9" height="9" rx="2" fill="#061a29" stroke="#ffc247" strokeWidth="1" />
          <text x="17.5" y="30.5" textAnchor="middle" fill="#ffc247" fontSize="5.5" fontWeight="900" fontFamily="monospace">&lt;&gt;</text>

          <rect x="44" y="22" width="8" height="8" rx="2" fill="#061a29" stroke="#2ee6c8" strokeWidth="1" />
          <text x="48" y="28" textAnchor="middle" fill="#2ee6c8" fontSize="5" fontWeight="900" fontFamily="monospace">JS</text>
        </svg>
      </div>
    );
  }

  // Visual untuk "tower" (Coding Tower / Menara HTML)
  return (
    <div
      className="relative inline-block select-none shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{
          filter: active
            ? "drop-shadow(0 4px 16px rgba(255,194,71,0.5))"
            : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
        }}
      >
        <defs>
          <linearGradient id="sgTowerGrad" x1="20" y1="14" x2="44" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Bingkai Dasar Rounded */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="16"
          fill={active ? "rgba(35,24,10,0.92)" : "rgba(8,25,42,0.75)"}
          stroke={active ? "#ffc247" : "rgba(126,196,236,0.25)"}
          strokeWidth={active ? "1.8" : "1.2"}
        />

        {/* Crane / Derek Konstruksi Laut di Atas */}
        <path d="M22 13 H44 M33 13 V8" stroke="#ffc247" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="42" y1="13" x2="42" y2="19" stroke="#ffffff" strokeWidth="1" strokeDasharray="1.5 1.5" />
        <circle cx="33" cy="8" r="1.8" fill="#ef4444" className="animate-ping" style={{ transformOrigin: "33px 8px" }} />
        <circle cx="33" cy="8" r="1.5" fill="#fef08a" />

        {/* Blok Menara Lantai 1 (Dasar Lebar) */}
        <rect x="18" y="42" width="28" height="10" rx="2" fill="url(#sgTowerGrad)" stroke="#ffffff" strokeWidth="1" />
        <text x="32" y="49" textAnchor="middle" fill="#061a29" fontSize="6" fontWeight="900" fontFamily="monospace">&lt;main&gt;</text>

        {/* Blok Menara Lantai 2 (Sedang) */}
        <rect x="22" y="31" width="20" height="9" rx="2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <text x="32" y="37.5" textAnchor="middle" fill="#041829" fontSize="5.5" fontWeight="900" fontFamily="monospace">&lt;div&gt;</text>

        {/* Blok Menara Lantai 3 (Puncak) */}
        <rect x="25" y="21" width="14" height="8" rx="2" fill="#2ee6c8" stroke="#ffffff" strokeWidth="1" />
        <text x="32" y="27" textAnchor="middle" fill="#041829" fontSize="5" fontWeight="900" fontFamily="monospace">&lt;h1&gt;</text>

        {/* Fondasi Tiang Pancang Laut Bawah */}
        <line x1="22" y1="52" x2="22" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="52" x2="42" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
