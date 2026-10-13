import sharkCyber from "./shark-cyber.webp";
import sharkCyberPng from "./shark-cyber.png";

/* ============ MASKOT HIU ============
   WebP utama (65KB vs 272KB PNG) + fallback PNG untuk browser lawas.
   decoding async + eager hanya bila di atas lipatan (diatur via className pemanggil). */
export default function SharkMascot({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <picture aria-hidden="true" style={{ display: "contents" }}>
      <source srcSet={sharkCyber} type="image/webp" />
      <img
        src={sharkCyberPng}
        alt=""
        draggable={false}
        decoding="async"
        className={className}
        style={style}
        aria-hidden="true"
      />
    </picture>
  );
}
