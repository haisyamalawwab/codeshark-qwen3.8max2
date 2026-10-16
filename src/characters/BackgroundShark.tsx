import { forwardRef } from "react";

interface Props {
  /** ref ke lingkaran mata merah (opacity dikendalikan loop animasi latar) */
  eyeRef: React.RefObject<SVGCircleElement | null>;
}

/* Hiu Cyber 2D latar belakang: posisi/skala/opacity dikendalikan oleh Ambient
   (graphics/seaEngine) sesuai nilai ancaman.
   Desain ditingkatkan dengan kontur predator laut dalam, sirip tajam, dan insang cyber. */
const BackgroundShark = forwardRef<HTMLDivElement, Props>(function BackgroundShark({ eyeRef }, ref) {
  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 will-change-transform pointer-events-none select-none"
      style={{ width: 440, height: 160, opacity: 0, transformOrigin: "50% 50%" }}
    >
      <svg viewBox="0 0 440 160" width="100%" height="100%">
        <defs>
          <linearGradient id="bgSharkBody" x1="0" y1="0" x2="380" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#082236" />
            <stop offset="60%" stopColor="#0a2a44" />
            <stop offset="100%" stopColor="#051522" />
          </linearGradient>
          <linearGradient id="bgSharkBelly" x1="0" y1="30" x2="280" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f3d61" />
            <stop offset="100%" stopColor="#082033" />
          </linearGradient>
          <linearGradient id="bgSharkGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#45c6ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2ee6c8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <g transform="translate(14 80)">
          <g className="shark-wag">
            {/* Sirip Dada Sisi Jauh (Pectoral Fin Far) */}
            <path
              d="M130 -16 L175 -52 L192 -20 Z"
              fill="#061c2d"
              stroke="#134769"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />

            {/* Badan Hiu Utama Megah */}
            <path
              d="M0 0
                 C50 -38 180 -46 280 -18
                 C330 -4 360 2 400 -36
                 C390 -10 388 12 404 38
                 C360 6 325 12 280 22
                 C190 48 70 42 0 0 Z"
              fill="url(#bgSharkBody)"
              stroke="#256e99"
              strokeOpacity="0.55"
              strokeWidth="2.2"
            />

            {/* Perut Bagian Bawah yang Lebih Terang */}
            <path
              d="M0 0
                 C60 28 170 34 260 16
                 C190 42 70 38 0 0 Z"
              fill="url(#bgSharkBelly)"
              opacity="0.85"
            />

            {/* Sirip Punggung Utama (Dorsal Fin) yang Menjulang Gagah */}
            <path
              d="M165 -28 L210 -84 C218 -80, 222 -70, 224 -36 L230 -24 Z"
              fill="#0a2e4b"
              stroke="#2e84b8"
              strokeOpacity="0.7"
              strokeWidth="2"
            />
            {/* Aksen Energi Neon di Sirip Punggung */}
            <path
              d="M185 -34 L212 -74"
              stroke="#45c6ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.65"
            />

            {/* Sirip Dada Sisi Dekat (Pectoral Fin Near) */}
            <path
              d="M175 22 L160 68 C176 66, 195 56, 218 30 Z"
              fill="#0a2a44"
              stroke="#256e99"
              strokeOpacity="0.6"
              strokeWidth="1.8"
            />

            {/* 5 Celah Insang Cyber yang Berpendar */}
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${118 + i * 8} -6 C${116 + i * 8} 4, ${117 + i * 8} 12, ${120 + i * 8} 18`}
                fill="none"
                stroke="#2ee6c8"
                strokeOpacity={0.4 + i * 0.1}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ))}

            {/* Moncong & Garis Rahang Bawah Menakutkan */}
            <path
              d="M12 5 C38 15 72 15 102 7"
              fill="none"
              stroke="#256e99"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Gigi Hiu Tajam */}
            <path
              d="M28 2 l5 9 l5 -8 l5 9 l5 -8 l5 8 l5 -7 l5 7"
              fill="none"
              stroke="#dff4ff"
              strokeOpacity="0.75"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Garis Sirkuit Cyber Lateral Line */}
            <path
              d="M90 -4 C160 -10, 240 0, 340 -8"
              fill="none"
              stroke="#45c6ff"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.45"
            />

            {/* Mata Predator Laut Dalam */}
            <circle cx="52" cy="-8" r="5.5" fill="#030c14" />
            <circle
              ref={eyeRef}
              cx="52"
              cy="-8"
              r="9"
              fill="#ff4b3e"
              style={{ opacity: 0, filter: "blur(3px)" }}
            />
            <circle cx="52" cy="-8" r="3.2" fill="#ff7a6b" />
            <circle cx="50.8" cy="-9.2" r="1.2" fill="#ffffff" />
          </g>
        </g>
      </svg>
    </div>
  );
});

export default BackgroundShark;
