import type { SVGProps } from "react";

/* Avatar Hiu Kapten Samudra (Topi Kapten + Headset Cyber + Seragam Navy)
   Didesain sesuai referensi HUD dashboard_hud.jfif */
export default function CaptainAvatar({ className = "", size = 120, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Glow neon cyan */}
        <radialGradient id="capGlow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#2ee6c8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2ee6c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="capRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ee6c8" />
          <stop offset="50%" stopColor="#45c6ff" />
          <stop offset="100%" stopColor="#14507a" />
        </linearGradient>
        <linearGradient id="sharkSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7ad6f6" />
          <stop offset="50%" stopColor="#3b96c0" />
          <stop offset="100%" stopColor="#1b5a80" />
        </linearGradient>
        <linearGradient id="sharkBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c5e6f5" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1b3f60" />
          <stop offset="100%" stopColor="#0a2238" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe699" />
          <stop offset="60%" stopColor="#ffc247" />
          <stop offset="100%" stopColor="#c98d17" />
        </linearGradient>
      </defs>

      {/* Outer Glow & Background */}
      <circle cx="80" cy="80" r="76" fill="url(#capGlow)" />
      <circle cx="80" cy="80" r="70" fill="#061a2e" stroke="url(#capRing)" strokeWidth="3" />
      <circle cx="80" cy="80" r="66" fill="#09243d" stroke="rgba(46, 230, 200, 0.25)" strokeWidth="1" strokeDasharray="4 3" />

      {/* Clip path inside circle */}
      <clipPath id="circleClip">
        <circle cx="80" cy="80" r="65" />
      </clipPath>

      <g clipPath="url(#circleClip)">
        {/* Latar dalam avatar */}
        <rect x="10" y="10" width="140" height="140" fill="#082038" />
        <path d="M20 120 Q80 100 140 120 L140 160 L20 160 Z" fill="#051424" />

        {/* Seragam Kapten / Navy Suit */}
        <path d="M42 160 L46 128 L80 142 L114 128 L118 160 Z" fill="url(#suitGrad)" />
        {/* Kemeja putih & dasi */}
        <path d="M68 138 L80 142 L92 138 L80 160 Z" fill="#ffffff" />
        <path d="M78 142 L82 142 L83 155 L80 158 L77 155 Z" fill="#0a2238" />
        {/* Kerah & Kancing emas */}
        <path d="M46 128 L64 140 L58 160 L42 160 Z" fill="#153654" />
        <path d="M114 128 L96 140 L102 160 L118 160 Z" fill="#153654" />
        <circle cx="80" cy="154" r="2.5" fill="url(#goldGrad)" />
        <circle cx="80" cy="148" r="2" fill="url(#goldGrad)" />

        {/* Kepala & Moncong Hiu */}
        <path
          d="M48 95 C45 68 62 55 86 54 C112 55 125 72 120 98 C116 116 100 126 80 126 C58 126 50 114 48 95 Z"
          fill="url(#sharkSkin)"
        />
        {/* Rahang / Perut Hiu putih */}
        <path
          d="M60 92 C62 82 72 82 82 82 C94 82 108 85 106 98 C104 114 94 124 80 124 C68 124 58 112 60 92 Z"
          fill="url(#sharkBelly)"
        />

        {/* Senyum Hiu & Gigi Tajam */}
        <path d="M62 96 Q80 108 104 96" fill="none" stroke="#103652" strokeWidth="2.5" strokeLinecap="round" />
        {/* Gigi atas */}
        <polygon points="68,97 72,103 76,98" fill="#ffffff" stroke="#103652" strokeWidth="0.8" />
        <polygon points="76,98 80,105 84,99" fill="#ffffff" stroke="#103652" strokeWidth="0.8" />
        <polygon points="84,99 88,105 92,98" fill="#ffffff" stroke="#103652" strokeWidth="0.8" />
        <polygon points="92,98 96,103 100,97" fill="#ffffff" stroke="#103652" strokeWidth="0.8" />

        {/* Mata Hiu - Cyber Glow */}
        <circle cx="94" cy="74" r="7.5" fill="#081e30" />
        <circle cx="95" cy="73.5" r="5" fill="#2ee6c8" />
        <circle cx="95" cy="73.5" r="2.5" fill="#051422" />
        <circle cx="93" cy="72" r="1.5" fill="#ffffff" />

        {/* Insang */}
        <path d="M54 84 Q57 91 55 98" fill="none" stroke="#256288" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 86 Q53 92 51 98" fill="none" stroke="#256288" strokeWidth="2" strokeLinecap="round" />

        {/* Headset Sci-Fi Cyber */}
        <path d="M42 75 C42 60 52 50 68 48" fill="none" stroke="#45c6ff" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="36" y="70" width="12" height="22" rx="5" fill="#0f3454" stroke="#45c6ff" strokeWidth="2" />
        <circle cx="42" cy="81" r="3" fill="#2ee6c8" />
        <path d="M44 88 Q50 96 60 96" fill="none" stroke="#45c6ff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="61" cy="96" r="2.5" fill="#2ee6c8" />

        {/* Topi Kapten Laut (Naval Captain Cap) */}
        {/* Visor / Pet hitam mengkilap */}
        <path d="M54 58 Q82 66 112 55 Q95 50 68 52 Z" fill="#091826" stroke="#2a4e6e" strokeWidth="1" />
        <path d="M60 56 Q82 62 106 54" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />

        {/* Pita Emas / Gold Rope */}
        <path d="M56 54 Q82 60 110 50" fill="none" stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="56" cy="54" r="3" fill="url(#goldGrad)" />
        <circle cx="110" cy="50" r="3" fill="url(#goldGrad)" />

        {/* Mahkota Topi Putih (White Crown) */}
        <path
          d="M52 50 C50 36 62 26 82 25 C104 26 118 34 116 47 C100 45 68 47 52 50 Z"
          fill="#f4faff"
          stroke="#b8d8ec"
          strokeWidth="1.5"
        />
        {/* Bayangan lipatan topi */}
        <path d="M66 34 Q82 30 102 33" fill="none" stroke="#d5e8f5" strokeWidth="2.5" strokeLinecap="round" />

        {/* Lencana Jangkar Emas di Depan Topi */}
        <g transform="translate(80, 42) scale(0.75)">
          <circle cx="0" cy="0" r="7" fill="#0f2b45" stroke="url(#goldGrad)" strokeWidth="1.5" />
          {/* Jangkar */}
          <circle cx="0" cy="-3" r="1.5" fill="none" stroke="url(#goldGrad)" strokeWidth="1" />
          <line x1="0" y1="-2" x2="0" y2="4" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <line x1="-3" y1="-0.5" x2="3" y2="-0.5" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <path d="M-4 2 Q0 6 4 2" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" />
        </g>
      </g>

      {/* Lingkaran HUD Status Dot */}
      <circle cx="132" cy="128" r="8" fill="#051625" stroke="#2ee6c8" strokeWidth="2" />
      <circle cx="132" cy="128" r="4.5" fill="#2ee6c8" />
      <circle cx="132" cy="128" r="2" fill="#ffffff" />
    </svg>
  );
}
