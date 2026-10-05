import { useMemo } from "react";
import { FishGlyph } from "./icons";
import seaBg from "../assets/sea-habitat-bg.svg";

interface BubbleSpec {
  left: number;
  size: number;
  dur: number;
  delay: number;
  o: number;
  dx: number;
}

export default function Ambient({ fish = false }: { fish?: boolean }) {
  const bubbles = useMemo<BubbleSpec[]>(
    () =>
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        size: 5 + Math.random() * 22,
        dur: 10 + Math.random() * 16,
        delay: Math.random() * 14,
        o: 0.18 + Math.random() * 0.4,
        dx: -30 + Math.random() * 60,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* gradasi kedalaman laut (fallback di bawah SVG) */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #072036 0%, #051829 42%, #04121f 100%)" }}
      />
      {/* latar habitat laut 2D (SVG) */}
      <img src={seaBg} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {/* grid titik sonar */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(120,190,230,0.06) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* gelembung */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              "--o": b.o,
              "--dx": `${b.dx}px`,
            } as React.CSSProperties
          }
        />
      ))}
      {/* ikan berenang */}
      {fish && (
        <>
          <FishGlyph className="fish text-[#2ee6c8]" style={{ top: "22%", width: 44, animationDuration: "26s" }} />
          <FishGlyph className="fish text-[#45c6ff]" style={{ top: "58%", width: 30, animationDuration: "34s", animationDelay: "-12s" }} />
          <FishGlyph className="fish text-[#ffc247]" style={{ top: "78%", width: 22, animationDuration: "42s", animationDelay: "-24s", opacity: 0.35 }} />
        </>
      )}
      {/* vignette bawah */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: "linear-gradient(180deg, transparent, rgba(2,9,17,0.55))" }}
      />
    </div>
  );
}
