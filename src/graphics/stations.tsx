/* Art stasiun peta — sprite Gemini transparan (background hitam dihapus via flood-fill,
   lalu WebP q85 + fallback PNG). Dipakai sebagai penanda milestone sesuai rujukan mockup HUD:
   P1–7 markas emas · P8 pos kristal UTS · P9–15 terumbu · P16 stasiun lab UAS. */
import domeGold from "./assets/stations/dome-gold.webp";
import domeGoldPng from "./assets/stations/dome-gold.png";
import domeCrystal from "./assets/stations/dome-crystal.webp";
import domeCrystalPng from "./assets/stations/dome-crystal.png";
import coral from "./assets/stations/coral-cluster.webp";
import coralPng from "./assets/stations/coral-cluster.png";
import lab from "./assets/stations/lab-station.webp";
import labPng from "./assets/stations/lab-station.png";
import sharkSide from "./assets/stations/shark-side.webp";
import sharkSidePng from "./assets/stations/shark-side.png";

interface Station {
  webp: string;
  png: string;
  label: string;
  glow: string;
}

/** Stasiun milestone per nomor pertemuan. */
export function stationFor(no: number): Station {
  if (no >= 16) return { webp: lab, png: labPng, label: "Stasiun UAS", glow: "drop-shadow(0 0 18px rgba(167,139,250,0.45))" };
  if (no === 8) return { webp: domeCrystal, png: domeCrystalPng, label: "Pos kristal UTS", glow: "drop-shadow(0 0 18px rgba(69,198,255,0.45))" };
  if (no >= 9) return { webp: coral, png: coralPng, label: "Terumbu CSS · JS", glow: "drop-shadow(0 0 14px rgba(46,230,200,0.35))" };
  return { webp: domeGold, png: domeGoldPng, label: "Markas HTML", glow: "drop-shadow(0 0 18px rgba(255,194,71,0.4))" };
}

export function StationArt({ no, width = 110 }: { no: number; width?: number }) {
  const s = stationFor(no);
  return (
    <picture aria-hidden="true" style={{ display: "contents" }}>
      <source srcSet={s.webp} type="image/webp" />
      <img
        src={s.png}
        alt=""
        draggable={false}
        decoding="async"
        width={width}
        className="shrink-0"
        style={{ maxWidth: width, filter: s.glow }}
        aria-hidden="true"
      />
    </picture>
  );
}

/** Hiu sprite untuk dekorasi hero/peta — WebP 4KB + fallback PNG. */
export function SharkSprite({ width = 120, className = "" }: { width?: number; className?: string }) {
  return (
    <picture aria-hidden="true" style={{ display: "contents" }}>
      <source srcSet={sharkSide} type="image/webp" />
      <img
        src={sharkSidePng}
        alt=""
        draggable={false}
        decoding="async"
        width={width}
        className={className}
        style={{ maxWidth: width, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.45))" }}
        aria-hidden="true"
      />
    </picture>
  );
}
