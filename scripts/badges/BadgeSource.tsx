// Build-time artwork source only. Never import this component into src/.
import type { AchievementDef, AchievementTier } from "../../src/lib/achievements";

interface Props {
  def: AchievementDef;
  tier?: AchievementTier;
  size?: number;
  isUnlocked?: boolean;
  className?: string;
  showRays?: boolean;
}

export default function AchievementBadgeArt({
  def,
  tier = def.tier,
  size = 56,
  isUnlocked = true,
  className = "",
  showRays = false,
}: Props) {
  const badgeId = def.id;

  // Palet Warna & Gradien per Tier
  const tierColors = {
    bronze: {
      rimLight: "#f59e0b",
      rimDark: "#78350f",
      rimMid: "#b45309",
      glow: "rgba(245, 158, 11, 0.4)",
      accent: "#fed7aa",
      bgCenter: "#1e130b",
      bgEdge: "#0d0905",
    },
    silver: {
      rimLight: "#e2e8f0",
      rimDark: "#334155",
      rimMid: "#94a3b8",
      glow: "rgba(148, 163, 184, 0.45)",
      accent: "#38bdf8",
      bgCenter: "#0f2334",
      bgEdge: "#06131e",
    },
    gold: {
      rimLight: "#fef08a",
      rimDark: "#854d0e",
      rimMid: "#f59e0b",
      glow: "rgba(251, 191, 36, 0.55)",
      accent: "#fef08a",
      bgCenter: "#291b07",
      bgEdge: "#0f0b03",
    },
    diamond: {
      rimLight: "#bae6fd",
      rimDark: "#0369a1",
      rimMid: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.65)",
      accent: "#e0e7ff",
      bgCenter: "#082845",
      bgEdge: "#041424",
    },
  }[tier];

  // Render lambang inti custom berdasarkan badge id
  const renderBadgeGlyph = () => {
    switch (badgeId) {
      /* ============ 1000 TOTAL LINES TYPED (SPECIAL PROMPT REQUIREMENT) ============ */
      case "lines-1000":
        return (
          <g>
            {/* Obelisk Monolit Emas Crystalline */}
            <path
              d="M32 16 L43 28 L39 46 L25 46 L21 28 Z"
              fill="url(#badgeGradGold)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Facet Kaca Berlian */}
            <path d="M32 16 L32 46 M21 28 L43 28" stroke="#ffffff" strokeWidth="0.9" opacity="0.8" />
            <path d="M21 28 L32 36 L43 28" fill="#ffffff" fillOpacity="0.25" />
            {/* Mahkota Berlian di Atas */}
            <path
              d="M26 15 L28 10 L32 13 L36 10 L38 15 Z"
              fill="#fef08a"
              stroke="#b45309"
              strokeWidth="0.8"
            />
            {/* Angka '1K' Terukir */}
            <text
              x="32"
              y="42"
              textAnchor="middle"
              fill="#061928"
              fontSize="7.5"
              fontWeight="900"
              fontFamily="monospace"
            >
              1000
            </text>
          </g>
        );

      /* ============ COMPLETED 5 DAILY CHALLENGES (SPECIAL PROMPT REQUIREMENT) ============ */
      case "daily-5":
        return (
          <g>
            {/* Roda Gigi Kompas Samudra Emas */}
            <circle cx="32" cy="32" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
            {/* Bintang Kembar 5 Sudut */}
            <path
              d="M32 17 L35.5 26 L45 26 L37.5 32 L40.5 41 L32 35.5 L23.5 41 L26.5 32 L19 26 L28.5 26 Z"
              fill="url(#badgeGradGold)"
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Kalender / Hari Badge */}
            <circle cx="32" cy="31" r="5" fill="#0c2336" stroke="#fef08a" strokeWidth="1" />
            <text
              x="32"
              y="33.8"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="7"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              5★
            </text>
          </g>
        );

      case "lines-50":
        return (
          <g>
            {/* Kertas Kode / Gulungan dengan Tinta */}
            <rect x="23" y="19" width="18" height="25" rx="3" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="27" y1="25" x2="37" y2="25" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="27" y1="30" x2="35" y2="30" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="27" y1="35" x2="33" y2="35" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pena Stylus / Tinta */}
            <path d="M38 16 L44 22 L37 29 L31 23 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          </g>
        );

      case "lines-250":
        return (
          <g>
            {/* Terminal Kode Cyber */}
            <rect x="20" y="20" width="24" height="24" rx="4" fill="#0f2942" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M24 28 L28 32 L24 36" fill="none" stroke="#2ee6c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="31" y1="36" x2="38" y2="36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Kilatan Petir */}
            <path d="M38 16 L31 27 L37 27 L30 38" fill="none" stroke="#ffc247" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case "lines-500":
        return (
          <g>
            {/* Konstruksi Menara Kode Bertingkat */}
            <rect x="25" y="36" width="14" height="8" rx="1.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <rect x="27" y="27" width="10" height="8" rx="1.5" fill="#fef08a" stroke="#ffffff" strokeWidth="1" />
            <rect x="29" y="19" width="6" height="7" rx="1.5" fill="#2ee6c8" stroke="#ffffff" strokeWidth="1" />
            <polygon points="32,13 30,19 34,19" fill="#ffffff" />
            {/* Simbol Kurung Kode < / > */}
            <path d="M19 28 L15 32 L19 36 M45 28 L49 32 L45 36" fill="none" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case "lines-2500":
        return (
          <g>
            {/* Trisula Neptunus Legendaris Berlian */}
            <path
              d="M32 15 L32 47 M26 21 L26 31 C26 36, 38 36, 38 31 L38 21"
              fill="none"
              stroke="url(#badgeGradDiamond)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="32,12 30,17 34,17" fill="#ffffff" />
            <polygon points="26,18 24,23 28,23" fill="#ffffff" />
            <polygon points="38,18 36,23 40,23" fill="#ffffff" />
            <circle cx="32" cy="35" r="3.5" fill="#2ee6c8" stroke="#ffffff" strokeWidth="1" />
          </g>
        );

      case "daily-1":
        return (
          <g>
            {/* Matahari Samudra Terbit */}
            <circle cx="32" cy="32" r="10" fill="#f59e0b" stroke="#fed7aa" strokeWidth="1.5" />
            <path d="M32 14 L32 18 M32 46 L32 50 M14 32 L18 32 M46 32 L50 32" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 19 L22 22 M42 42 L45 45 M19 45 L22 42 M42 22 L45 19" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
            <text x="32" y="35" textAnchor="middle" fill="#451a03" fontSize="8" fontWeight="900">1</text>
          </g>
        );

      case "daily-3":
        return (
          <g>
            {/* Kalender Tameng Trio Api */}
            <rect x="22" y="20" width="20" height="24" rx="4" fill="#0f2942" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="22" y="20" width="20" height="7" rx="2" fill="#38bdf8" />
            {/* 3 Nyala Api / 3 Checklist */}
            <circle cx="27" cy="35" r="2.2" fill="#2ee6c8" />
            <circle cx="32" cy="35" r="2.2" fill="#2ee6c8" />
            <circle cx="37" cy="35" r="2.2" fill="#2ee6c8" />
            <path d="M26 35 l1 1 l2 -2 M31 35 l1 1 l2 -2 M36 35 l1 1 l2 -2" stroke="#ffffff" strokeWidth="0.8" fill="none" />
          </g>
        );

      case "daily-10":
        return (
          <g>
            {/* Mahkota Chronometer Berlian */}
            <circle cx="32" cy="32" r="13" fill="#052033" stroke="url(#badgeGradDiamond)" strokeWidth="2" />
            <polygon points="32,20 35,26 42,26 36,31 38,38 32,33 26,38 28,31 22,26 29,26" fill="url(#badgeGradDiamond)" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="32" cy="30" r="4.5" fill="#061826" stroke="#ffffff" strokeWidth="1" />
            <text x="32" y="32.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="900">10</text>
          </g>
        );

      case "speed-30":
        return (
          <g>
            {/* Gelombang Ombak Kecepatan */}
            <path d="M19 36 C24 30, 28 38, 33 32 C38 26, 42 34, 46 28" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M17 30 C22 24, 26 32, 31 26 C36 20, 40 28, 44 22" fill="none" stroke="#2ee6c8" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
            <circle cx="43" cy="23" r="3" fill="#ffc247" />
          </g>
        );

      case "speed-50":
        return (
          <g>
            {/* Speedometer Jet Samudra 50 WPM */}
            <path d="M20 37 A14 14 0 1 1 44 37" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
            <line x1="32" y1="32" x2="41" y2="23" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="32" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="41,20 44,24 39,24" fill="#ff4d4d" />
          </g>
        );

      case "speed-70":
        return (
          <g>
            {/* Badai Pusaran Tornado Petir */}
            <path d="M18 20 Q32 18 46 20 Q32 26 22 29 Q32 32 42 34 Q32 38 27 41 Q32 44 32 46" fill="none" stroke="url(#badgeGradGold)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M35 15 L28 26 L34 26 L27 38" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case "combo-50":
        return (
          <g>
            {/* Nyala Api Kombo Berkobar */}
            <path
              d="M32 17 C36 24, 44 26, 44 34 C44 41, 38 46, 32 46 C26 46, 20 41, 20 34 C20 27, 26 25, 29 20 C30 24, 34 25, 32 17 Z"
              fill="url(#badgeGradGold)"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <path
              d="M32 28 C34 31, 38 33, 38 37 C38 40, 35 43, 32 43 C29 43, 26 40, 26 37 C26 34, 29 33, 31 30 Z"
              fill="#ffffff"
            />
          </g>
        );

      case "streak-3":
        return (
          <g>
            {/* Obor Api Samudra 3 Hari */}
            <path d="M30 35 L34 35 L33 46 L31 46 Z" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
            <ellipse cx="32" cy="35" rx="6" ry="2.5" fill="#f59e0b" />
            <path d="M32 18 C36 23, 40 26, 40 31 C40 35, 36 38, 32 38 C28 38, 24 35, 24 31 C24 26, 28 23, 32 18 Z" fill="#f97316" stroke="#fed7aa" strokeWidth="1" />
            <circle cx="32" cy="31" r="2.5" fill="#fef08a" />
          </g>
        );

      case "streak-7":
        return (
          <g>
            {/* Mahkota Surya 7 Sinar */}
            <circle cx="32" cy="32" r="11" fill="url(#badgeGradGold)" stroke="#ffffff" strokeWidth="1.2" />
            {Array.from({ length: 7 }).map((_, i) => {
              const ang = (i * (360 / 7) - 90) * (Math.PI / 180);
              const x1 = 32 + Math.cos(ang) * 12;
              const y1 = 32 + Math.sin(ang) * 12;
              const x2 = 32 + Math.cos(ang) * 17;
              const y2 = 32 + Math.sin(ang) * 17;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />;
            })}
            <text x="32" y="35" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="900">7</text>
          </g>
        );

      case "missions-done":
        return (
          <g>
            {/* 3 Piagam Gulungan Samudra (HTML, CSS, JS) */}
            <rect x="20" y="24" width="16" height="20" rx="2" fill="#e2e8f0" stroke="#334155" strokeWidth="1" transform="rotate(-12 28 34)" />
            <rect x="28" y="24" width="16" height="20" rx="2" fill="#fef08a" stroke="#854d0e" strokeWidth="1" transform="rotate(12 36 34)" />
            <rect x="24" y="21" width="16" height="22" rx="2.5" fill="url(#badgeGradGold)" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="27" y1="26" x2="37" y2="26" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="27" y1="30" x2="37" y2="30" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="32" cy="36" r="3.2" fill="#ff4d4d" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        );

      case "rank-megalodon":
        return (
          <g>
            {/* Rahang Megalodon Purba Berlian & Sirip Gagah */}
            <path
              d="M18 36 C18 20, 46 20, 46 36 C42 42, 22 42, 18 36 Z"
              fill="url(#badgeGradDiamond)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Sirip Atas Predator */}
            <polygon points="32,15 28,26 36,26" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            {/* Deretan Gigi Megalodon Mengkilap */}
            <path
              d="M22 36 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Mata Berkilau */}
            <circle cx="32" cy="27" r="2.2" fill="#ff4b3e" />
          </g>
        );

      default:
        return (
          <g>
            {/* Default Trofi Samudra Megah */}
            <path
              d="M24 20 H40 V30 C40 35, 36 39, 32 39 C28 39, 24 35, 24 30 Z"
              fill="url(#badgeGradGold)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            <path d="M24 23 C19 23, 19 30, 24 30 M40 23 C45 23, 45 30, 40 30" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
            <path d="M30 39 H34 V43 H30 Z M26 43 H38 V46 H26 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="32" cy="28" r="3" fill="#ffffff" />
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
          filter: isUnlocked
            ? `drop-shadow(0 4px 14px ${tierColors.glow})`
            : "grayscale(100%) opacity(0.65)",
        }}
      >
        <defs>
          {/* Gradien Rim Medali per Tier */}
          <linearGradient id="badgeRimGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={tierColors.rimLight} />
            <stop offset="35%" stopColor={tierColors.rimMid} />
            <stop offset="70%" stopColor={tierColors.rimDark} />
            <stop offset="100%" stopColor={tierColors.rimLight} />
          </linearGradient>

          {/* Gradien Emas Universal */}
          <linearGradient id="badgeGradGold" x1="20" y1="16" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Gradien Berlian Universal */}
          <linearGradient id="badgeGradDiamond" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Gradien Latar Belakang Medali */}
          <radialGradient id="badgeBgRadial" cx="32" cy="30" r="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={tierColors.bgCenter} />
            <stop offset="85%" stopColor={tierColors.bgEdge} />
          </radialGradient>

          {/* Kilau Kaca Muka Medali */}
          <linearGradient id="badgeGlassSheen" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sinar Radiant Berputar (Opsional saat modal atau hover) */}
        {showRays && (
          <g className="animate-spin" style={{ transformOrigin: "32px 32px", animationDuration: "16s" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="32"
                y1="4"
                x2="32"
                y2="10"
                stroke={tierColors.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
                transform={`rotate(${i * 30} 32 32)`}
              />
            ))}
          </g>
        )}

        {/* 1. Lingkaran Terluar Bevel Medali */}
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="url(#badgeRimGrad)"
          stroke={tierColors.rimDark}
          strokeWidth="1.2"
        />

        {/* 2. Cincin Gigi Kompas Nautical Rim */}
        <circle
          cx="32"
          cy="32"
          r="24.5"
          fill="none"
          stroke={tierColors.rimLight}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.85"
        />

        {/* 3. Latar Belakang Interior Medali */}
        <circle
          cx="32"
          cy="32"
          r="22.5"
          fill="url(#badgeBgRadial)"
          stroke={tierColors.rimMid}
          strokeWidth="1"
        />

        {/* 4. Sinar Caustic Halus di Latar Medali */}
        <path
          d="M32 10 L34 26 L48 22 L36 31 L47 41 L33 35 L28 47 L28 34 L16 38 L25 29 L14 20 L28 25 Z"
          fill={tierColors.accent}
          fillOpacity="0.06"
        />

        {/* 5. Simbol / Lambang Inti Vektor Custom */}
        {renderBadgeGlyph()}

        {/* 6. Pantulan Kilau Kaca Busur Atas */}
        <path
          d="M13 28 A 21 21 0 0 1 51 28 A 21 15 0 0 0 13 28 Z"
          fill="url(#badgeGlassSheen)"
          pointerEvents="none"
        />

        {/* 7. Rivet Titik Logam Mewah pada Rim (4 Penjuru Mata Angin) */}
        <circle cx="32" cy="7" r="1.3" fill={tierColors.rimLight} stroke="#000000" strokeWidth="0.5" />
        <circle cx="57" cy="32" r="1.3" fill={tierColors.rimLight} stroke="#000000" strokeWidth="0.5" />
        <circle cx="32" cy="57" r="1.3" fill={tierColors.rimLight} stroke="#000000" strokeWidth="0.5" />
        <circle cx="7" cy="32" r="1.3" fill={tierColors.rimLight} stroke="#000000" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
