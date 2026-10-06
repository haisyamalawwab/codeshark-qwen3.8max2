/* Tachometer mini speedometer SVG untuk HUD WPM Card
   Sesuai referensi visual di dashboard_hud.jfif */
export default function MiniSpeedometer({ val = 20, max = 80 }: { val?: number; max?: number }) {
  const pct = Math.min(1, Math.max(0, val / max));
  // Rotasi jarum dari -110 derajat sampai +110 derajat
  const deg = -110 + pct * 220;

  return (
    <svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true" className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2ee6c8" />
          <stop offset="55%" stopColor="#ffc247" />
          <stop offset="100%" stopColor="#ff6b57" />
        </linearGradient>
      </defs>

      {/* Busur Gauge Latar Belakang */}
      <path
        d="M 4 24 A 18 18 0 0 1 40 24"
        fill="none"
        stroke="rgba(126, 196, 236, 0.2)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Busur Berwarna (Hijau -> Kuning -> Merah) */}
      <path
        d="M 4 24 A 18 18 0 0 1 40 24"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="56.5"
        strokeDashoffset={56.5 * (1 - pct)}
      />

      {/* Jarum Pointer */}
      <g transform="translate(22, 24)">
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-15"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${deg})`}
          style={{ transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)" }}
        />
        <circle cx="0" cy="0" r="2.8" fill="#45c6ff" />
      </g>
    </svg>
  );
}
