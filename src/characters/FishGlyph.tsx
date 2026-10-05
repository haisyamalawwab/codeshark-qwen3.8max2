export default function FishGlyph({ className = "", style, flip = false }: { className?: string; style?: React.CSSProperties; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 28"
      className={className}
      style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <path d="M6 14 C14 4 30 4 38 14 C30 24 14 24 6 14 Z" fill="currentColor" opacity="0.8" />
      <path d="M38 14 L46 7 L44 14 L46 21 Z" fill="currentColor" opacity="0.65" />
      <circle cx="13" cy="12" r="1.8" fill="#04121f" />
    </svg>
  );
}
