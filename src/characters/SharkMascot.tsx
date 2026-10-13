import sharkCyber from "./shark-cyber.webp";
import sharkCyberPng from "./shark-cyber.png";

/* ============ MASKOT HIU ============
   WebP utama (~69KB) + fallback PNG (~99KB) untuk browser lawas.
   decoding=async; loading diatur pemanggil (eager di above-the-fold). */
export default function SharkMascot({
  className = "",
  style,
  loading = "lazy",
}: {
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) {
  return (
    <picture aria-hidden="true" style={{ display: "contents" }}>
      <source srcSet={sharkCyber} type="image/webp" />
      <img
        src={sharkCyberPng}
        alt=""
        draggable={false}
        decoding="async"
        loading={loading}
        width={779}
        height={406}
        className={className}
        style={style}
        aria-hidden="true"
      />
    </picture>
  );
}
