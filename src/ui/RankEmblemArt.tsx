/* Rank Emblem Art (Lambang & Lambang Pangkat Samudra)
   Menyediakan seni grafis vektor high-fidelity untuk tiap 7 tingkatan pangkat samudra:
   1. Kadet Baru  2. Ikan Kecil  3. Kuda Laut  4. Lumba-Lumba
   5. Hiu Muda   6. Megalodon    7. Legenda Samudra */

interface Props {
  rank: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function RankEmblemArt({
  rank,
  size = 120,
  className = "",
  animated = true,
}: Props) {
  // Normalisasi nama pangkat
  const cleanRank = rank.trim();

  // Konfigurasi visual tiap pangkat
  const getRankConfig = () => {
    switch (cleanRank) {
      case "Ikan Kecil":
        return {
          themeColor: "#2ee6c8",
          secondaryColor: "#38bdf8",
          glowColor: "rgba(46, 230, 200, 0.5)",
          rimGrad: ["#a7f3d0", "#2ee6c8", "#0f766e"],
          bgGrad: ["#092f3b", "#04161c"],
          title: "Ikan Kecil",
        };
      case "Kuda Laut":
        return {
          themeColor: "#34d399",
          secondaryColor: "#10b981",
          glowColor: "rgba(52, 211, 153, 0.5)",
          rimGrad: ["#6ee7b7", "#34d399", "#065f46"],
          bgGrad: ["#0a3026", "#031510"],
          title: "Kuda Laut",
        };
      case "Lumba-Lumba":
        return {
          themeColor: "#60a5fa",
          secondaryColor: "#38bdf8",
          glowColor: "rgba(96, 165, 250, 0.55)",
          rimGrad: ["#bfdbfe", "#60a5fa", "#1e40af"],
          bgGrad: ["#0b2347", "#030e1f"],
          title: "Lumba-Lumba",
        };
      case "Hiu Muda":
        return {
          themeColor: "#fbbf24",
          secondaryColor: "#f59e0b",
          glowColor: "rgba(251, 191, 36, 0.6)",
          rimGrad: ["#fef08a", "#fbbf24", "#92400e"],
          bgGrad: ["#2d1c07", "#120a02"],
          title: "Hiu Muda",
        };
      case "Megalodon":
        return {
          themeColor: "#f97316",
          secondaryColor: "#ef4444",
          glowColor: "rgba(249, 115, 22, 0.65)",
          rimGrad: ["#fed7aa", "#f97316", "#9a3412"],
          bgGrad: ["#331508", "#140602"],
          title: "Megalodon",
        };
      case "Legenda Samudra":
        return {
          themeColor: "#ffd700",
          secondaryColor: "#a855f7",
          glowColor: "rgba(255, 215, 0, 0.8)",
          rimGrad: ["#ffffff", "#ffd700", "#c084fc", "#b45309"],
          bgGrad: ["#2c153b", "#090412"],
          title: "Legenda Samudra",
        };
      case "Kadet Baru":
      default:
        return {
          themeColor: "#38bdf8",
          secondaryColor: "#0284c7",
          glowColor: "rgba(56, 189, 248, 0.5)",
          rimGrad: ["#bae6fd", "#38bdf8", "#0369a1"],
          bgGrad: ["#0a2742", "#04111d"],
          title: "Kadet Baru",
        };
    }
  };

  const cfg = getRankConfig();

  // Render lambang makhluk spesifik pangkat
  const renderCreature = () => {
    switch (cleanRank) {
      /* ============ 1. KADET BARU: Helm Selam & Sayap Kembar Chevron ============ */
      case "Kadet Baru":
        return (
          <g>
            {/* Sayap Chevron Kembar */}
            <path
              d="M16 48 L22 42 L32 46 L42 42 L48 48 L32 54 Z"
              fill="#0284c7"
              stroke="#bae6fd"
              strokeWidth="1.2"
            />
            {/* Cangkang Helm Kadet */}
            <ellipse cx="32" cy="27" rx="14" ry="13" fill="#0c3556" stroke="#38bdf8" strokeWidth="2" />
            {/* Visor Cyan Bercahaya */}
            <rect x="22" y="21" width="20" height="12" rx="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <ellipse cx="28" cy="24" rx="4" ry="2" fill="#ffffff" fillOpacity="0.7" />
            {/* Lambang Jangkar / Navigasi */}
            <path d="M32 37 L32 44 M28 41 C28 44, 36 44, 36 41" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="32" cy="38" r="1.5" fill="#38bdf8" />
          </g>
        );

      /* ============ 2. IKAN KECIL: Ikan Dart Neon Lincah ============ */
      case "Ikan Kecil":
        return (
          <g>
            {/* Sirip Ombak Dinamis */}
            <path d="M14 36 C22 30, 42 30, 50 36 C42 42, 22 42, 14 36 Z" fill="none" stroke="#2ee6c8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            {/* Tubuh Ikan Lincah */}
            <path
              d="M18 32 C26 22, 38 23, 44 32 C38 41, 26 42, 18 32 Z"
              fill="#2ee6c8"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            {/* Ekor Ikan Gesit */}
            <path d="M18 32 L10 24 L13 32 L10 40 Z" fill="#2ee6c8" stroke="#ffffff" strokeWidth="1.2" />
            {/* Sirip Punggung & Dada */}
            <polygon points="32,24 38,18 41,26" fill="#a7f3d0" />
            <polygon points="30,36 34,42 38,36" fill="#a7f3d0" />
            {/* Mata Ikan Neon */}
            <circle cx="40" cy="30" r="2.8" fill="#042f2e" />
            <circle cx="40" cy="30" r="1.5" fill="#ffffff" />
            {/* Garis Kilat Lincah */}
            <path d="M26 32 L34 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      /* ============ 3. KUDA LAUT: Kuda Laut Heraldik Tangguh ============ */
      case "Kuda Laut":
        return (
          <g>
            {/* Daun Rumput Laut / Karang Pelindung Samping */}
            <path d="M18 46 C16 38, 22 32, 18 24 M46 46 C48 38, 42 32, 46 24" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
            {/* Tubuh Kuda Laut Megah */}
            <path
              d="M34 16
                 C30 16, 27 19, 27 23
                 C27 25, 29 27, 28 29
                 C24 33, 27 40, 31 43
                 C33 45, 34 49, 31 51
                 C28 53, 26 51, 26 49"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Moncong Kuda Laut */}
            <path d="M27 23 L20 25" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
            {/* Mahkota Karang Kepala */}
            <polygon points="34,16 32,11 36,13 39,11 38,16" fill="#6ee7b7" stroke="#065f46" strokeWidth="0.8" />
            {/* Sirip Punggung Kuda Laut */}
            <path d="M34 31 C38 30, 40 36, 35 39" fill="#a7f3d0" stroke="#34d399" strokeWidth="1" />
            {/* Mata & Sisik Emas */}
            <circle cx="30" cy="21" r="2.2" fill="#042f2e" />
            <circle cx="30" cy="21" r="1.2" fill="#ffffff" />
            <circle cx="30" cy="33" r="1.2" fill="#fef08a" />
            <circle cx="32" cy="37" r="1.2" fill="#fef08a" />
          </g>
        );

      /* ============ 4. LUMBA-LUMBA: Lumba-Lumba Akrobatik Sapphire ============ */
      case "Lumba-Lumba":
        return (
          <g>
            {/* Cincin Riak Gelombang Lompatan */}
            <ellipse cx="32" cy="34" rx="20" ry="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            {/* Tubuh Lumba-Lumba Melompat Melengkung */}
            <path
              d="M16 42
                 C18 30, 30 20, 44 22
                 C47 23, 50 25, 48 28
                 C42 30, 34 32, 28 42
                 C24 48, 18 46, 16 42 Z"
              fill="#60a5fa"
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            {/* Perut Bersih Putih Cerah */}
            <path
              d="M26 38 C32 30, 40 28, 46 27 C42 29, 36 33, 28 42 Z"
              fill="#ffffff"
              fillOpacity="0.85"
            />
            {/* Sirip Punggung Dorsal */}
            <polygon points="32,22 36,14 40,23" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
            {/* Ekor Fluke Fluktuatif */}
            <path d="M17 43 L12 40 L14 46 L10 49 L17 46 Z" fill="#60a5fa" stroke="#ffffff" strokeWidth="1" />
            {/* Moncong & Mata Cerdas */}
            <circle cx="45" cy="24" r="1.8" fill="#0f172a" />
            <circle cx="45.5" cy="23.5" r="0.8" fill="#ffffff" />
          </g>
        );

      /* ============ 5. HIU MUDA: Hiu Predator Gigi Tajam Amber ============ */
      case "Hiu Muda":
        return (
          <g>
            {/* Badan Hiu Muda Berotot & Mengancam */}
            <path
              d="M12 36
                 C20 22, 38 18, 52 30
                 C42 36, 36 42, 26 44
                 C18 46, 14 42, 12 36 Z"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Sirip Punggung Predator Gagah */}
            <path d="M30 20 L37 9 C39 12, 41 18, 41 23 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
            {/* Sirip Dada & Ekor Bulan Sabit */}
            <polygon points="26,42 28,52 35,42" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <path d="M14 37 L7 29 L10 37 L6 45 L13 41 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
            {/* 3 Celah Insang Api */}
            <line x1="36" y1="28" x2="35" y2="34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="39" y1="28" x2="38" y2="34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="42" y1="29" x2="41" y2="33" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Gigi Hiu Predator Tajam */}
            <path d="M42 34 l2 -3 l2 3 l2 -3 l2 3" stroke="#ffffff" strokeWidth="1.2" fill="none" />
            {/* Mata Predator Mengintai */}
            <circle cx="47" cy="27" r="2.4" fill="#451a03" />
            <circle cx="47" cy="27" r="1.4" fill="#ff4d4d" />
          </g>
        );

      /* ============ 6. MEGALODON: Raksasa Samudra Purba Lapis Emas ============ */
      case "Megalodon":
        return (
          <g>
            {/* Gigi Fosil Raksasa di Latar Belakang */}
            <path d="M22 17 L32 37 L42 17 Z" fill="#f97316" fillOpacity="0.2" stroke="#ea580c" strokeWidth="1.5" />
            {/* Tubuh Monster Purba Megalodon */}
            <path
              d="M8 34
                 C18 16, 42 14, 56 28
                 C46 38, 38 46, 24 47
                 C14 47, 10 42, 8 34 Z"
              fill="url(#rankMegalodonBody)"
              stroke="#fed7aa"
              strokeWidth="2.2"
            />
            {/* Sirip Punggung Kolosal Bercabang */}
            <path d="M28 17 L36 4 L42 21 Z" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
            {/* Sirip Dada Armor Ganda */}
            <polygon points="24,45 28,58 37,45" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
            {/* Rahang Megalodon Bawah Menghancurkan */}
            <path
              d="M38 35 C44 33, 50 33, 54 29 C52 38, 44 42, 38 35 Z"
              fill="#ffffff"
            />
            {/* Deretan Gigi Monster Raksasa */}
            <path d="M40 35 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4" stroke="#7c2d12" strokeWidth="1.2" fill="#ffffff" />
            {/* Mata Merah Purba Menakutkan */}
            <circle cx="50" cy="25" r="3" fill="#000000" />
            <circle cx="50" cy="25" r="1.8" fill="#ff2222" />
            <circle cx="49.5" cy="24.5" r="0.8" fill="#ffffff" />
          </g>
        );

      /* ============ 7. LEGENDA SAMUDRA: Trisula Kosmik & Mahkota Penguasa Samudra ============ */
      case "Legenda Samudra":
        return (
          <g>
            {/* Mandala Matahari Kosmik 16 Sinar */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="32"
                y1="11"
                x2="32"
                y2="7"
                stroke="#ffd700"
                strokeWidth="1.8"
                strokeLinecap="round"
                transform={`rotate(${i * 22.5} 32 32)`}
                opacity="0.85"
              />
            ))}
            {/* Trisula Emas Kerajaan Neptunus */}
            <path
              d="M32 14 L32 52 M24 22 L24 32 C24 39, 40 39, 40 32 L40 22"
              fill="none"
              stroke="#ffd700"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <polygon points="32,10 29,16 35,16" fill="#ffffff" />
            <polygon points="24,18 21,24 27,24" fill="#ffffff" />
            <polygon points="40,18 37,24 43,24" fill="#ffffff" />
            {/* Mahkota Berlian Kaisar Samudra */}
            <path
              d="M23 45 L25 38 L28 41 L32 35 L36 41 L39 38 L41 45 Z"
              fill="#ffd700"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Permata Inti Kosmik (Amethyst / Sapphire) */}
            <circle cx="32" cy="35" r="4.2" fill="#c084fc" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="32" cy="35" r="2" fill="#ffffff" />
          </g>
        );
    }
  };

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
        className="overflow-visible"
        style={{
          filter: `drop-shadow(0 6px 20px ${cfg.glowColor})`,
        }}
      >
        <defs>
          {/* Gradien Rim Medali */}
          <linearGradient id="rankRimGrad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={cfg.rimGrad[0]} />
            <stop offset="50%" stopColor={cfg.rimGrad[1]} />
            <stop offset="100%" stopColor={cfg.rimGrad[cfg.rimGrad.length - 1]} />
          </linearGradient>

          {/* Gradien Latar Belakang */}
          <radialGradient id="rankBgGrad" cx="32" cy="30" r="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={cfg.bgGrad[0]} />
            <stop offset="100%" stopColor={cfg.bgGrad[1]} />
          </radialGradient>

          {/* Gradien Khusus Megalodon */}
          <linearGradient id="rankMegalodonBody" x1="10" y1="20" x2="56" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>

        {/* Cincin Luar Berotasi Halus (jika animated) */}
        {animated && (
          <circle
            cx="32"
            cy="32"
            r="29.5"
            fill="none"
            stroke={cfg.themeColor}
            strokeWidth="0.8"
            strokeDasharray="4 6"
            className="animate-spin"
            style={{ transformOrigin: "32px 32px", animationDuration: "24s" }}
            opacity="0.75"
          />
        )}

        {/* Bingkai Luar Rim Logam Mewah */}
        <circle
          cx="32"
          cy="32"
          r="27.5"
          fill="url(#rankRimGrad)"
          stroke="#000000"
          strokeWidth="1.2"
        />

        {/* Cincin Gigi Kompas Nautical */}
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke={cfg.rimGrad[0]}
          strokeWidth="0.8"
          strokeDasharray="1.5 2"
          opacity="0.8"
        />

        {/* Latar Belakang Interior Samudra */}
        <circle
          cx="32"
          cy="32"
          r="23.5"
          fill="url(#rankBgGrad)"
          stroke={cfg.themeColor}
          strokeWidth="1"
        />

        {/* Pola Radiasi Cahaya Subtil di Latar */}
        <path
          d="M32 9 L34 24 L48 22 L37 31 L48 40 L34 35 L32 55 L30 35 L16 40 L27 31 L16 22 L30 24 Z"
          fill={cfg.themeColor}
          fillOpacity="0.08"
        />

        {/* Simbol Makhluk Ikonik Spesifik Pangkat */}
        {renderCreature()}

        {/* Pantulan Kilau Lengkung Kaca Atas */}
        <path
          d="M13 28 A 21 21 0 0 1 51 28 A 21 14 0 0 0 13 28 Z"
          fill="#ffffff"
          fillOpacity="0.25"
          pointerEvents="none"
        />

        {/* 4 Titik Rivet Kompas Kerajaan */}
        <circle cx="32" cy="7" r="1.3" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <circle cx="57" cy="32" r="1.3" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <circle cx="32" cy="57" r="1.3" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <circle cx="7" cy="32" r="1.3" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
