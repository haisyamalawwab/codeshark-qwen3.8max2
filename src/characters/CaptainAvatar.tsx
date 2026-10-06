import type { ImgHTMLAttributes } from "react";
import sharkCaptain from "./shark-captain.png";

/* Avatar Hiu Kapten Samudra (Topi Kapten + Headset Cyber + Seragam Navy)
   Menggunakan aset PNG captainshark (latar hijau sudah dipotong transparan),
   didesain sesuai referensi HUD dashboard_hud.jfif */
export default function CaptainAvatar({ className = "", size = 120, ...props }: ImgHTMLAttributes<HTMLImageElement> & { size?: number }) {
  return (
    <img
      src={sharkCaptain}
      alt=""
      draggable={false}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}
