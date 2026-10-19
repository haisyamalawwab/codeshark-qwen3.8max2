/* Sub-Game Visual Artwork (Artwork Ilustrasi Khusus Sub-Game)
   Memberikan grafis identitas visual khas untuk:
   1. "shark" (Coding Shark / Samudra Ketik)
   2. "tower" (Coding Tower / Susun Menara HTML) */

interface Props {
  id: "shark" | "tower" | "crossplatform" | "ci_backend" | "py_backend";
  active?: boolean;
  size?: number;
}

export default function SubGameArtwork({ id, active = false, size = 64 }: Props) {
  if (id === "ci_backend") {
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
              ? "drop-shadow(0 4px 16px rgba(239,68,68,0.6))"
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          <defs>
            <linearGradient id="sgCiFlame" x1="16" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="sgCiDb" x1="20" y1="36" x2="44" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Badge */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="16"
            fill={active ? "rgba(35,14,14,0.95)" : "rgba(10,18,34,0.85)"}
            stroke={active ? "#ef4444" : "rgba(239,68,68,0.35)"}
            strokeWidth={active ? "2" : "1.2"}
          />

          {/* CodeIgniter 4 Flame Icon */}
          <path
            d="M32 10C33.5 17 28.5 22 23 27C17 32 16 38 21 44C23 46.5 26.5 48 30 48C28 44 29 40 33 37C34 40 37 42 37 45C42 41 45 35 43 28C41.5 23 37.5 18 35.5 15C34.5 13.5 33 11.5 32 10Z"
            fill="url(#sgCiFlame)"
          />

          {/* Mini MySQL Database Cylinder in Bottom Center */}
          <ellipse cx="32" cy="46" rx="9" ry="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
          <path d="M23 46v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-6" fill="#0369a1" stroke="#ffffff" strokeWidth="0.8" />

          {/* PHP Tag Text */}
          <rect x="24" y="24" width="16" height="7" rx="3.5" fill="rgba(15,23,42,0.85)" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="32" y="29.5" textAnchor="middle" fill="#38bdf8" fontSize="4.5" fontWeight="900" fontFamily="monospace">CI4</text>
        </svg>
      </div>
    );
  }

  if (id === "py_backend") {
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
              ? "drop-shadow(0 4px 16px rgba(16,185,129,0.6))"
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          <defs>
            <linearGradient id="sgPyBlue" x1="16" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="sgPyGreen" x1="26" y1="28" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Badge */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="16"
            fill={active ? "rgba(6,32,24,0.95)" : "rgba(10,18,34,0.85)"}
            stroke={active ? "#10b981" : "rgba(16,185,129,0.35)"}
            strokeWidth={active ? "2" : "1.2"}
          />

          {/* Python Snake 1 (Top Blue) */}
          <path
            d="M31.5 12C24 12 21 15 21 20V24H32V25.5H18C13 25.5 11 29 11 35C11 41 14 44 20 44H23V39C23 33.5 27 30 33 30H42C46.5 30 50 26.5 50 22C50 17.5 46.5 12 40 12H31.5ZM26 16C27.1 16 28 16.9 28 18C28 19.1 27.1 20 26 20C24.9 20 24 19.1 24 18C24 16.9 24.9 16 26 16Z"
            fill="url(#sgPyBlue)"
          />

          {/* Python Snake 2 (Bottom Emerald) */}
          <path
            d="M32.5 52C40 52 43 49 43 44V40H32V38.5H46C51 38.5 53 35 53 29C53 23 50 20 44 20H41V25C41 30.5 37 34 31 34H22C17.5 34 14 37.5 14 42C14 46.5 17.5 52 24 52H32.5ZM38 48C36.9 48 36 47.1 36 46C36 44.9 36.9 44 38 44C39.1 44 40 44.9 40 46C40 47.1 39.1 48 38 48Z"
            fill="url(#sgPyGreen)"
          />

          {/* Center Flask Badge */}
          <circle cx="32" cy="32" r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
          <text x="32" y="34.5" textAnchor="middle" fill="#34d399" fontSize="6" fontWeight="900">PY</text>
        </svg>
      </div>
    );
  }

  if (id === "crossplatform") {
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
              ? "drop-shadow(0 4px 16px rgba(56,189,248,0.6))"
              : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          <defs>
            <linearGradient id="sgCrossPhone" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="sgReactAtom" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Smartphone Bezel Body */}
          <rect
            x="14"
            y="6"
            width="36"
            height="52"
            rx="10"
            fill={active ? "rgba(15,23,42,0.95)" : "rgba(10,18,34,0.85)"}
            stroke={active ? "#38bdf8" : "rgba(56,189,248,0.3)"}
            strokeWidth={active ? "2" : "1.2"}
          />

          {/* Screen Inner */}
          <rect x="17" y="10" width="30" height="44" rx="6" fill="#030712" />

          {/* Speaker / Notch */}
          <rect x="27" y="8" width="10" height="1.5" rx="0.75" fill="#475569" />

          {/* React Native Atomic Orbit Rings */}
          <ellipse cx="32" cy="30" rx="10" ry="4" stroke="url(#sgReactAtom)" strokeWidth="1.2" transform="rotate(-30 32 30)" opacity="0.85" />
          <ellipse cx="32" cy="30" rx="10" ry="4" stroke="url(#sgReactAtom)" strokeWidth="1.2" transform="rotate(30 32 30)" opacity="0.85" />
          <ellipse cx="32" cy="30" rx="10" ry="4" stroke="url(#sgReactAtom)" strokeWidth="1.2" transform="rotate(90 32 30)" opacity="0.85" />

          {/* Central Core Atom */}
          <circle cx="32" cy="30" r="2.5" fill="#38bdf8" className={active ? "animate-pulse" : ""} />

          {/* Expo 'E' Badge Mini Bottom */}
          <rect x="25" y="44" width="14" height="4" rx="2" fill="#0284c7" />
          <circle cx="32" cy="46" r="1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

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
