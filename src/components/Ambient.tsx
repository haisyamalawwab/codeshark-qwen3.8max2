import { useEffect, useMemo, useRef } from "react";
import { scene } from "../lib/scene";
import seaFar from "../assets/sea-far.svg";
import seaMid from "../assets/sea-mid.svg";
import seaNear from "../assets/sea-near.svg";

interface BubbleSpec {
  left: number;
  size: number;
  dur: number;
  delay: number;
  o: number;
  dx: number;
}

/* ---- Canvas 2D: kawanan ikan + plankton ---- */
interface School { cx: number; cy: number; dir: 1 | -1; speed: number; size: number; color: [number, number, number]; alpha: number; fish: { ox: number; oy: number; ph: number }[] }
interface Plankton { x: number; y: number; r: number; vy: number; ph: number }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const CORAL: [number, number, number] = [255, 107, 87];

function makeSchools(w: number, h: number, dense: boolean): School[] {
  const defs: { y: number; dir: 1 | -1; speed: number; size: number; n: number; color: [number, number, number]; alpha: number }[] = [
    { y: 0.28, dir: 1, speed: 0.35, size: 6, n: 16, color: [60, 150, 190], alpha: 0.4 },
    { y: 0.44, dir: -1, speed: 0.5, size: 8, n: 12, color: [46, 230, 200], alpha: 0.35 },
    { y: 0.6, dir: 1, speed: 0.7, size: 10, n: 9, color: [255, 194, 71], alpha: 0.3 },
    { y: 0.72, dir: -1, speed: 0.4, size: 7, n: 14, color: [69, 198, 255], alpha: 0.3 },
  ];
  return defs.slice(0, dense ? 4 : 3).map((d) => ({
    cx: Math.random() * w,
    cy: d.y * h,
    dir: d.dir,
    speed: d.speed,
    size: d.size,
    color: d.color,
    alpha: d.alpha,
    fish: Array.from({ length: d.n }, () => ({
      ox: (Math.random() - 0.5) * 140,
      oy: (Math.random() - 0.5) * 60,
      ph: Math.random() * Math.PI * 2,
    })),
  }));
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

  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const sharkRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<SVGCircleElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const denseRef = useRef(fish);
  denseRef.current = fish;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let schools: School[] = [];
    let plankton: Plankton[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let threat = 0, progress = 0, active = 0;
    let raf = 0, last = performance.now(), running = true;

    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schools = makeSchools(w, h, denseRef.current);
      plankton = Array.from({ length: Math.round(Math.min(90, (w * h) / 16000)) }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.6, vy: 0.08 + Math.random() * 0.25, ph: Math.random() * 6.28,
      }));
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };

    const drawFish = (x: number, y: number, s: number, dir: number, wag: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(dir, 1);
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.42, 0, 0, Math.PI * 2);
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(-s * 1.6, -s * 0.5 + wag);
      ctx.lineTo(-s * 1.6, s * 0.5 + wag);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      const t = scene.threat / 100;

      /* halus-kan nilai */
      threat += (t - threat) * 0.06 * dt;
      progress += (scene.progress - progress) * 0.05 * dt;
      active += ((scene.active ? 1 : 0) - active) * 0.05 * dt;
      mouse.x += (mouse.tx - mouse.x) * 0.05 * dt;
      mouse.y += (mouse.ty - mouse.y) * 0.05 * dt;

      /* ===== parallax 3 lapisan: mouse + progres ketikan ===== */
      if (!reduce) {
        const px = progress - 0.5;
        const set = (el: HTMLDivElement | null, depth: number) => {
          if (!el) return;
          const x = -mouse.x * depth - px * depth * 1.4;
          const y = -mouse.y * depth * 0.5;
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.1)`;
        };
        set(farRef.current, 8);
        set(midRef.current, 20);
        set(nearRef.current, 38);
      }

      /* ===== hiu 2D mendekat sesuai ancaman ===== */
      const shark = sharkRef.current;
      if (shark) {
        const e = threat * threat * (3 - 2 * threat); // smoothstep
        const x = lerp(w * 0.82, w * 0.06, e);
        const y = h * lerp(0.26, 0.44, e) + Math.sin(now / 900) * 8 * (1 - e * 0.4);
        const s = lerp(0.4, 1.7, e);
        shark.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        shark.style.opacity = (active * lerp(0.2, 0.92, e)).toFixed(3);
        shark.style.filter = `blur(${lerp(1.6, 0, e).toFixed(2)}px)`;
        if (eyeRef.current) eyeRef.current.style.opacity = String(Math.max(0, (threat - 0.35) / 0.65));
      }
      /* semburat merah saat ancaman tinggi */
      if (tintRef.current) tintRef.current.style.opacity = (active * Math.max(0, (threat - 0.45) / 0.55) * 0.55).toFixed(3);

      /* ===== canvas: kawanan ikan + plankton ===== */
      ctx.clearRect(0, 0, w, h);
      if (!reduce) {
        const flee = 1 + threat * 2.6; // ikan kabur lebih cepat
        const spread = 1 + threat * 1.4;
        for (const sc of schools) {
          sc.cx += sc.dir * sc.speed * flee * dt;
          if (sc.dir === 1 && sc.cx > w + 200) sc.cx = -200;
          if (sc.dir === -1 && sc.cx < -200) sc.cx = w + 200;
          const k = Math.max(0, (threat - 0.3) / 0.7); // menuju warna bahaya
          const r = Math.round(lerp(sc.color[0], CORAL[0], k * 0.6));
          const g = Math.round(lerp(sc.color[1], CORAL[1], k * 0.6));
          const b = Math.round(lerp(sc.color[2], CORAL[2], k * 0.6));
          ctx.fillStyle = `rgba(${r},${g},${b},${sc.alpha})`;
          const cy = sc.cy + Math.sin(now / 2400 + sc.size) * 22;
          for (const f of sc.fish) {
            const x = sc.cx + f.ox * spread + Math.sin(now / 700 + f.ph) * 6;
            const y = cy + f.oy * spread + Math.cos(now / 900 + f.ph) * 5;
            drawFish(x, y, sc.size, sc.dir, Math.sin(now / (110 / flee) + f.ph) * sc.size * 0.35);
          }
        }
        ctx.fillStyle = "#bfeaff";
        for (const p of plankton) {
          p.y -= p.vy * dt;
          p.x += Math.sin(now / 3000 + p.ph) * 0.12 * dt;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          ctx.globalAlpha = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(now / 1300 + p.ph));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const layer = "absolute inset-0 will-change-transform";
  const img = "w-full h-full object-cover";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* fallback gradasi di bawah SVG */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #072036 0%, #051829 42%, #04121f 100%)" }} />

      {/* ===== lapisan 1: jauh ===== */}
      <div ref={farRef} className={layer} style={{ transform: "scale(1.1)" }}>
        <img src={seaFar} alt="" className={img} draggable={false} />
      </div>

      {/* grid titik sonar */}
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "radial-gradient(rgba(120,190,230,0.06) 1px, transparent 1.4px)", backgroundSize: "30px 30px" }}
      />

      {/* ===== hiu 2D: antara lapisan jauh & tengah ===== */}
      <div ref={sharkRef} className="absolute left-0 top-0 will-change-transform" style={{ width: 380, height: 130, opacity: 0, transformOrigin: "50% 50%" }}>
        <svg viewBox="0 0 380 130" width="100%" height="100%">
          <g transform="translate(8 65)">
            <g className="shark-wag">
              <path d="M0 0 C60 -34 170 -40 250 -16 C290 -6 320 -2 360 -30 C352 -8 350 8 362 30 C320 4 290 8 250 18 C170 42 60 36 0 0 Z" fill="#0a2c46" stroke="#1b5c82" strokeOpacity=".55" strokeWidth="2" />
              <path d="M150 -26 L190 -72 L205 -22 Z" fill="#0a2c46" stroke="#1b5c82" strokeOpacity=".55" strokeWidth="2" />
              <path d="M160 24 L150 56 L196 30 Z" fill="#0a2c46" />
              <path d="M10 6 C40 14 70 14 96 8" fill="none" stroke="#2a7aa6" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
              <path d="M30 2 l5 9 l5 -8 l5 9 l5 -8 l5 8" fill="none" stroke="#cfeaf7" strokeOpacity=".6" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="46" cy="-6" r="4.5" fill="#050f18" />
              <circle ref={eyeRef} cx="46" cy="-6" r="7" fill="#ff6b57" style={{ opacity: 0, filter: "blur(2px)" }} />
              <circle cx="46" cy="-6" r="2.2" fill="#ff9d8f" />
            </g>
          </g>
        </svg>
      </div>

      {/* ===== lapisan 2: tengah ===== */}
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

      {/* ===== lapisan 3: depan ===== */}
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
