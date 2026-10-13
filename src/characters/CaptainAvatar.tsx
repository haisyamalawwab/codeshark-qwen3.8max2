import type { ImgHTMLAttributes } from "react";
import sharkCaptain from "./shark-captain.webp";
import sharkCaptainPng from "./shark-captain.png";

/* Avatar Hiu Kapten Samudra (Topi Kapten + Headset Cyber + Seragam Navy)
   WebP utama (~34KB) + fallback PNG (~41KB). width/height eksplisit anti-CLS. */
export default function CaptainAvatar({
  className = "",
  size = 120,
  loading = "lazy",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { size?: number }) {
  return (
    <picture aria-hidden="true">
      <source srcSet={sharkCaptain} type="image/webp" />
      <img
        src={sharkCaptainPng}
        alt=""
        draggable={false}
        decoding="async"
        loading={loading}
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        {...props}
      />
    </picture>
  );
}
