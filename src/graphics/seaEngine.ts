import { scene } from "./scene";

/* ============ ENGINE LATAR LAUT (JS grafis) ============
   Satu loop requestAnimationFrame untuk: parallax 3 lapisan (mouse + progres
   ketikan), hiu 2D yang mendekat sesuai ancaman, semburat bahaya, serta
   canvas 2D kawanan ikan + plankton. Murni DOM/Canvas — tanpa library. */

interface School { cx: number; cy: number; dir: 1 | -1; speed: number; size: number; color: [number, number, number]; alpha: number; fish: { ox: number; oy: number; ph: number }[] }
interface Plankton { x: number; y: number; r: number; vy: number; ph: number }

export interface SeaTargets {
  canvas: HTMLCanvasElement;
  far: HTMLElement | null;
  mid: HTMLElement | null;
  near: HTMLElement | null;
  shark: HTMLElement | null;
  eye: SVGCircleElement | null;
  tint: HTMLElement | null;
  /** true = lebih banyak kawanan ikan (dashboard) */
  isDense: () => boolean;
}

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

/** Mulai engine; mengembalikan fungsi dispose. */
export function startSeaEngine(t: SeaTargets): () => void {
  const canvas = t.canvas;
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
    schools = makeSchools(w, h, t.isDense());
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
    const tt = scene.threat / 100;

    /* haluskan nilai */
    threat += (tt - threat) * 0.06 * dt;
    progress += (scene.progress - progress) * 0.05 * dt;
    active += ((scene.active ? 1 : 0) - active) * 0.05 * dt;
    mouse.x += (mouse.tx - mouse.x) * 0.05 * dt;
    mouse.y += (mouse.ty - mouse.y) * 0.05 * dt;

    /* parallax 3 lapisan: mouse + progres ketikan */
    if (!reduce) {
      const px = progress - 0.5;
      const set = (el: HTMLElement | null, depth: number) => {
        if (!el) return;
        const x = -mouse.x * depth - px * depth * 1.4;
        const y = -mouse.y * depth * 0.5;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.1)`;
      };
      set(t.far, 8);
      set(t.mid, 20);
      set(t.near, 38);
    }

    /* hiu 2D mendekat sesuai ancaman */
    const shark = t.shark;
    if (shark) {
      const e = threat * threat * (3 - 2 * threat); // smoothstep
      const x = lerp(w * 0.82, w * 0.06, e);
      const y = h * lerp(0.26, 0.44, e) + Math.sin(now / 900) * 8 * (1 - e * 0.4);
      const s = lerp(0.4, 1.7, e);
      shark.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      shark.style.opacity = (active * lerp(0.2, 0.92, e)).toFixed(3);
      shark.style.filter = `blur(${lerp(1.6, 0, e).toFixed(2)}px)`;
      if (t.eye) t.eye.style.opacity = String(Math.max(0, (threat - 0.35) / 0.65));
    }
    /* semburat merah saat ancaman tinggi */
    if (t.tint) t.tint.style.opacity = (active * Math.max(0, (threat - 0.45) / 0.55) * 0.55).toFixed(3);

    /* canvas: kawanan ikan + plankton */
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
}
