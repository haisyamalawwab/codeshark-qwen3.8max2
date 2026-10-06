import { useEffect, useMemo, useRef } from "react";
import { BackgroundShark } from "../characters";
import { startSeaEngine } from "./seaEngine";
import seaFar from "./assets/sea-far.svg";
import seaMid from "./assets/sea-mid.svg";
import seaNear from "./assets/sea-near.svg";
import "./graphics.css";

interface BubbleSpec {
  left: number;
  size: number;
  dur: number;
  delay: number;
  o: number;
  dx: number;
}

/* Komponen presentasional latar laut. Logika animasi ada di ./seaEngine. */
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

  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const sharkRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<SVGCircleElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const denseRef = useRef(fish);
  denseRef.current = fish;

  useEffect(
    () =>
      startSeaEngine({
        canvas: canvasRef.current!,
        far: farRef.current,
        mid: midRef.current,
        near: nearRef.current,
        shark: sharkRef.current,
        eye: eyeRef.current,
        tint: tintRef.current,
        isDense: () => denseRef.current,
      }),
    []
  );

  const layer = "absolute inset-0 will-change-transform";
  const img = "w-full h-full object-cover";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* fallback gradasi di bawah SVG */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #072036 0%, #051829 42%, #04121f 100%)" }} />

      {/* lapisan 1: jauh */}
      <div ref={farRef} className={layer} style={{ transform: "scale(1.1)" }}>
        <img src={seaFar} alt="" className={img} draggable={false} />
      </div>

      {/* berkas cahaya dari permukaan */}
      {[
        { left: "10%", w: 130, delay: "0s", dur: "11s" },
        { left: "32%", w: 90, delay: "-4s", dur: "13s" },
        { left: "56%", w: 190, delay: "-8s", dur: "10s" },
        { left: "79%", w: 110, delay: "-2s", dur: "14s" },
      ].map((r, i) => (
        <span
          key={i}
          className="ray"
          style={{ left: r.left, width: r.w, animationDelay: r.delay, animationDuration: r.dur }}
        />
      ))}

      {/* grid titik sonar */}
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "radial-gradient(rgba(120,190,230,0.06) 1px, transparent 1.4px)", backgroundSize: "30px 30px" }}
      />

      {/* hiu 2D: antara lapisan jauh & tengah */}
      <BackgroundShark ref={sharkRef} eyeRef={eyeRef} />

      {/* lapisan 2: tengah */}
      <div ref={midRef} className={layer} style={{ transform: "scale(1.1)" }}>
        <img src={seaMid} alt="" className={img} draggable={false} />
      </div>

      {/* canvas 2D: kawanan ikan + plankton */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

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

      {/* lapisan 3: depan */}
      <div ref={nearRef} className={layer} style={{ transform: "scale(1.1)" }}>
        <img src={seaNear} alt="" className={img} draggable={false} />
      </div>

      {/* semburat merah saat hiu hampir menyerang */}
      <div
        ref={tintRef}
        className="absolute inset-0"
        style={{ opacity: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(255,107,87,0.28), transparent 60%)" }}
      />

      {/* vignette bawah */}
      <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(180deg, transparent, rgba(2,9,17,0.55))" }} />
    </div>
  );
}
