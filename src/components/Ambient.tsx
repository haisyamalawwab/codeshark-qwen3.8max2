import { useMemo } from "react";
import { FishGlyph } from "./icons";

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
      {/* gradasi kedalaman laut */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 700px at 12% -8%, rgba(38,120,168,0.38), transparent 60%)," +
            "radial-gradient(900px 600px at 95% 108%, rgba(14,74,110,0.5), transparent 62%)," +
            "linear-gradient(180deg, #072036 0%, #051829 42%, #04121f 100%)",
        }}
      />
      {/* grid titik sonar */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(120,190,230,0.06) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* berkas cahaya */}
      <div className="ray" style={{ left: "6%", animationDelay: "0s" }} />
      <div className="ray" style={{ left: "26%", animationDelay: "-3s", opacity: 0.7 }} />
      <div className="ray" style={{ left: "58%", animationDelay: "-6s", opacity: 0.5 }} />
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
