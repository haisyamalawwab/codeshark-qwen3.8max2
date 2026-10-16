export default function FishGlyph({
  className = "",
  style,
  flip = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 54 32"
      className={className}
      style={{
        ...style,
        transform: flip ? `${style?.transform ?? ""} scaleX(-1)` : style?.transform,
      }}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fishBodyGrad" x1="4" y1="16" x2="50" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="65%" stopColor="currentColor" stopOpacity="0.75" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="fishFinGrad" x1="38" y1="6" x2="52" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#45c6ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2ee6c8" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Sirip Punggung (Dorsal Fin) */}
      <path
        d="M20 9 C26 3, 34 5, 37 10 C30 9, 24 10, 20 9 Z"
        fill="url(#fishFinGrad)"
      />

      {/* Sirip Bawah (Pelvic Fin) */}
      <path
        d="M22 23 C27 28, 33 27, 34 22 C29 23, 24 23, 22 23 Z"
        fill="url(#fishFinGrad)"
      />

      {/* Sirip Ekor (Caudal Fin) Mengalir */}
      <path
        d="M40 16 C44 11, 51 5, 52 8 C50 13, 47 15, 45 16 C47 17, 50 19, 52 24 C51 27, 44 21, 40 16 Z"
        fill="url(#fishFinGrad)"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.5"
      />

      {/* Badan Ikan Utama Hidrodinamis */}
      <path
        d="M4 16 C12 6, 28 6, 42 16 C28 26, 12 26, 4 16 Z"
        fill="url(#fishBodyGrad)"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />

      {/* Garis Sensorik Bioluminesen (Lateral Line) */}
      <path
        d="M12 16 C20 14, 28 15, 38 16"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.7"
        strokeDasharray="2 2"
      />

      {/* Sirip Dada (Pectoral Fin) */}
      <path
        d="M16 17 C19 19, 23 20, 24 18 C22 17, 18 16, 16 17 Z"
        fill="#ffffff"
        fillOpacity="0.4"
      />

      {/* Mata Ikan Berkilau */}
      <circle cx="11" cy="14" r="2.4" fill="#04121f" />
      <circle cx="11" cy="14" r="1.5" fill="#45c6ff" />
      <circle cx="10.4" cy="13.4" r="0.7" fill="#ffffff" />
    </svg>
  );
}
