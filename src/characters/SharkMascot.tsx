/* ============ MASKOT HIU ============ */
export default function SharkMascot({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 230 150" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="gSharkBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fc3e4" />
          <stop offset="1" stopColor="#2b7ea1" />
        </linearGradient>
      </defs>
      <circle cx="17" cy="42" r="4.5" fill="none" stroke="#9ad7f5" strokeWidth="1.6" opacity="0.6" />
      <circle cx="10" cy="27" r="2.6" fill="none" stroke="#9ad7f5" strokeWidth="1.4" opacity="0.45" />
      {/* ekor */}
      <path d="M196 78 C213 66 220 55 223 43 C211 51 202 57 193 61 C199 67 200 73 196 78 Z" fill="#2b7ea1" />
      <path d="M196 86 C211 94 218 101 221 110 C209 103 200 98 191 95 C196 92 197 89 196 86 Z" fill="#2b7ea1" />
      {/* sirip punggung */}
      <path d="M98 42 C102 20 118 10 131 12 C122 23 119 33 122 44 Z" fill="#2b7ea1" />
      {/* badan */}
      <path
        d="M18 86 C30 52 78 33 128 39 C161 43 187 58 201 81 C187 103 150 117 111 114 C68 111 33 105 18 86 Z"
        fill="url(#gSharkBody)"
      />
      {/* perut */}
      <path d="M26 90 C60 110 148 113 197 84 C185 104 148 116 111 114 C72 111 41 104 26 90 Z" fill="#cfeefb" opacity="0.95" />
      {/* sirip dada */}
      <path d="M93 97 C97 113 107 123 120 127 C114 115 112 105 114 97 Z" fill="#2b7ea1" />
      {/* insang */}
      <path d="M80 64 q7 11 0 24" stroke="#1f6488" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M90 62 q7 13 0 28" stroke="#1f6488" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* mata */}
      <circle cx="52" cy="70" r="10.5" fill="#ffffff" />
      <circle cx="49" cy="71.5" r="5.2" fill="#0a2438" />
      <circle cx="46.8" cy="68.6" r="1.9" fill="#ffffff" />
      {/* pipi & mulut */}
      <circle cx="37" cy="85" r="4" fill="#ff9a76" opacity="0.45" />
      <path d="M27 90 q11 9 24 8" stroke="#1f6488" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
