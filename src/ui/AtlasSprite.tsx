/* Satu <img> atlas untuk semua potongan — browser mengunduh
   hud-atlas-cs.* sekali lalu memakai ulang dari cache di tiap sel.
   width = lebar tampilan sel (tinggi mengikuti rasio kotak aslinya). */
import type { CSSProperties } from "react";
import atlasPng from "../assets/hud/hud-atlas-cs.png";
import atlasWebp from "../assets/hud/hud-atlas-cs.webp";

export type AtlasName =
  | "dome-gold" | "dome-neon" | "station"
  | "shark-a" | "shark-b" | "shark-c" | "shark-front"
  | "coral-a" | "crystal" | "coral-clu"
  | "rock-a" | "rock-b" | "dev-turret" | "dev-pad" | "bubbles";

interface Props {
  name: AtlasName;
  /** label aksesibilitas (kosongkan bila murni hiasan) */
  label?: string;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}

export default function AtlasSprite({ name, label, width, className, style, eager }: Props) {
  return (
    <span
      className={`atlas atlas-${name}${className ? ` ${className}` : ""}`}
      style={{ width, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <picture>
        <source srcSet={atlasWebp} type="image/webp" />
        <img src={atlasPng} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} />
      </picture>
    </span>
  );
}
