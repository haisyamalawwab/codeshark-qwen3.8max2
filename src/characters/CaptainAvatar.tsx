import type { ImgHTMLAttributes } from "react";
import sharkCaptain from "./shark-captain.webp";
import sharkCaptainPng from "./shark-captain.png";

/* Avatar Hiu Kapten Samudra (Topi Kapten + Headset Cyber + Seragam Navy)
   WebP utama (31KB vs 111KB PNG) + fallback PNG. width/height eksplisit anti-CLS. */
export default function CaptainAvatar({ className = "", size = 120, ...props }: ImgHTMLAttributes<HTMLImageElement> & { size?: number }) {
  return (
    <picture aria-hidden="true">
      <source srcSet={sharkCaptain} type="image/webp" />
      <img
        src={sharkCaptainPng}
        alt=""
        draggable={false}
        decoding="async"
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        {...props}
      />
    </picture>
  );
}
