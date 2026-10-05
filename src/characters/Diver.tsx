/* Penyelam di "Pangkalan" (panel laut TypingGame). */
export default function Diver({ size = 46, className = "anim-bob" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="24" cy="22" r="15" fill="#16456d" stroke="#45c6ff" strokeWidth="2.5" />
      <circle cx="24" cy="22" r="8" fill="#0b2a44" stroke="#9ad7f5" strokeWidth="2" />
      <circle cx="21" cy="20" r="2" fill="#9ad7f5" />
      <path d="M14 40 C18 34 30 34 34 40 Z" fill="#16456d" stroke="#45c6ff" strokeWidth="2" />
    </svg>
  );
}
