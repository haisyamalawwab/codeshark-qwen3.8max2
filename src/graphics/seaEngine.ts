import { scene } from "./scene";

/* ============ ENGINE LATAR LAUT (JS grafis) ============
   Satu loop requestAnimationFrame untuk: parallax 3 lapisan (mouse + progres
   ketikan), hiu 2D yang mendekat sesuai ancaman, semburat bahaya, serta
   canvas 2D kawanan ikan + plankton. Murni DOM/Canvas — tanpa library. */

interface Fish {
  ox: number; oy: number;   // posisi rumah di dalam kawanan
  wob: number;              // fase goyangan individu
  w1: number; w2: number;   // variasi frekuensi goyangan
  a1: number; a2: number;   // amplitudo goyangan (px)
  sizeMul: number;          // variasi ukuran antar ikan
  wagMul: number;           // variasi laju kibasan ekor
  wagPh: number;            // fase kibasan ekor
  dartT: number;            // hitung mundur lompatan kecepatan (detik)
  dartV: number;            // boost kecepatan yang meluruh
  fx: number; fy: number;   // simpangan kabur (pegas kembali ke 0)
  eyeT: number;             // jeda antar lirikan pupil (detik)
  ex: number; ey: number;   // arah pupil saat ini
  tex: number; tey: number; // target arah pupil
  px: number; py: number;   // posisi bingkai lalu (untuk pitch badan)
  pitch: number;            // kemiringan badan (rad)
}
interface School {
  cx: number; cy: number; dir: 1 | -1; speed: number; size: number;
  color: [number, number, number]; alpha: number;
  grad: CanvasGradient | null; gradK: number; // gradien badan + threat saat dibuat
  speedPh: number;          // fase pulse kruis–burst kawanan
  bobPh: number;            // fase naik-turun kawanan
  vy0: number;              // drift vertikal pelan
  fish: Fish[];
}
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
const FLEE_R = 110; // radius ikan menghindar dari kursor (px)

/** Gradien badan ikan: punggung gelap → perut terang, mengikuti warna bahaya. */
function schoolGradient(ctx: CanvasRenderingContext2D, sc: School, k: number): CanvasGradient {
  const mix = (a: number, b: number) => Math.round(lerp(a, b, k * 0.6));
  const r = mix(sc.color[0], CORAL[0]), g = mix(sc.color[1], CORAL[1]), b = mix(sc.color[2], CORAL[2]);
  const grad = ctx.createLinearGradient(0, -sc.size, 0, sc.size);
  grad.addColorStop(0, `rgba(${Math.round(r * 0.5)},${Math.round(g * 0.55)},${Math.round(b * 0.6)},${sc.alpha})`);
  grad.addColorStop(0.55, `rgba(${r},${g},${b},${sc.alpha})`);
  grad.addColorStop(1, `rgba(${Math.min(255, r + 70)},${Math.min(255, g + 70)},${Math.min(255, b + 70)},${Math.min(1, sc.alpha * 1.15)})`);
  return grad;
}

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
    grad: null,
    gradK: -1,
    speedPh: Math.random() * 6.28,
    bobPh: Math.random() * 6.28,
    vy0: (Math.random() < 0.5 ? -1 : 1) * (0.02 + Math.random() * 0.05),
    fish: Array.from({ length: d.n }, () => ({
      ox: (Math.random() - 0.5) * 140,
      oy: (Math.random() - 0.5) * 60,
      wob: Math.random() * Math.PI * 2,
      w1: 0.6 + Math.random() * 0.9,
      w2: 0.6 + Math.random() * 0.9,
      a1: 7 + Math.random() * 9,
      a2: 4 + Math.random() * 6,
      sizeMul: 0.85 + Math.random() * 0.35,
      wagMul: 0.85 + Math.random() * 0.35,
      wagPh: Math.random() * Math.PI * 2,
      dartT: 2 + Math.random() * 8,
      dartV: 0,
      fx: 0, fy: 0,
      eyeT: Math.random() * 3,
      ex: 0.4, ey: 0, tex: 0.4, tey: 0,
      px: NaN, py: NaN,
      pitch: 0,
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
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0, touched: false };
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
    if (!mouse.touched) { mouse.px = w / 2; mouse.py = h / 2; }
    plankton = Array.from({ length: Math.round(Math.min(90, (w * h) / 16000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.6, vy: 0.08 + Math.random() * 0.25, ph: Math.random() * 6.28,
    }));
  };
  const onMove = (e: PointerEvent) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.px = e.clientX;
    mouse.py = e.clientY;
    mouse.touched = true;
  };
  const onVis = () => {
    running = !document.hidden;
    if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
  };

  /* Ikan 2D: ekor bercabang berayun dari pangkalnya, sirip punggung & dada
     yang mengepak, garis insang, dan mata berpupil yang melirik. */
  const drawFish = (
    x: number, y: number, s: number, dir: number,
    tail: number, pitch: number, body: CanvasGradient,
    ex: number, ey: number, finT: number,
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(pitch);
    ctx.scale(dir, 1);
    ctx.fillStyle = body;

    /* ekor: dua helai bercabang yang berayun mengikuti badan */
    ctx.save();
    ctx.translate(-s * 0.68, 0);
    ctx.rotate(tail * 0.9);
    ctx.beginPath();
    ctx.moveTo(s * 0.12, 0);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.08, -s * 0.66, -s * 0.52 + tail * s * 0.25);
    ctx.quadraticCurveTo(-s * 0.32, -s * 0.03, -s * 0.48, 0);
    ctx.quadraticCurveTo(-s * 0.32, s * 0.03, -s * 0.66, s * 0.52 + tail * s * 0.25);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.08, s * 0.12, 0);
    ctx.fill();
    ctx.restore();

    /* sirip punggung */
    ctx.beginPath();
    ctx.moveTo(-s * 0.24, -s * 0.34);
    ctx.quadraticCurveTo(-s * 0.02, -s * 0.78, s * 0.36, -s * 0.26);
    ctx.closePath();
    ctx.fill();

    /* badan: bergoyang sedikit berlawanan dengan ekor */
    ctx.beginPath();
    ctx.ellipse(-tail * s * 0.05, 0, s, s * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    /* garis insang */
    ctx.strokeStyle = "rgba(5,18,30,0.3)";
    ctx.lineWidth = Math.max(0.7, s * 0.07);
    ctx.beginPath();
    ctx.arc(s * 0.65, 0, s * 0.4, Math.PI - 0.95, Math.PI + 0.95);
    ctx.stroke();

    /* sirip dada mengepak */
    ctx.save();
    ctx.translate(s * 0.1, s * 0.12);
    ctx.rotate(0.5 + Math.sin(finT) * 0.38);
    ctx.globalAlpha *= 0.75;
    ctx.beginPath();
    ctx.ellipse(s * 0.06, s * 0.14, s * 0.28, s * 0.1, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* mata: pupil melirik + kilau */
    const ecx = s * 0.52, ecy = -s * 0.1;
    const er = Math.max(1.2, s * 0.15);
    ctx.fillStyle = "#eaf6ff";
    ctx.beginPath();
    ctx.arc(ecx, ecy, er, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#08131e";
    ctx.beginPath();
    ctx.arc(ecx + ex * er * 0.38, ecy + ey * er * 0.38, er * 0.55, 0, Math.PI * 2);
    ctx.fill();
    if (s > 8) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(ecx + (ex * 0.38 - 0.28) * er, ecy + (ey * 0.38 - 0.3) * er, er * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
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
      const panic = Math.min(1, threat * 1.4);
      for (const sc of schools) {
        /* gradien badan mengikuti warna bahaya */
        if (sc.gradK < 0 || Math.abs(threat - sc.gradK) > 0.04) {
          sc.grad = schoolGradient(ctx, sc, threat);
          sc.gradK = threat;
        }
        /* kawanan: pulse kruis–burst + drift vertikal pelan */
        const pulse = 0.78 + 0.3 * (0.5 + 0.5 * Math.sin(now / 5300 + sc.speedPh));
        const spd = sc.speed * pulse * flee;
        sc.cx += sc.dir * spd * dt;
        if (sc.dir === 1 && sc.cx > w + 220) sc.cx = -220;
        if (sc.dir === -1 && sc.cx < -220) sc.cx = w + 220;
        sc.cy += sc.vy0 * dt;
        if (sc.cy < h * 0.12) { sc.cy = h * 0.12; sc.vy0 = Math.abs(sc.vy0); }
        if (sc.cy > h * 0.84) { sc.cy = h * 0.84; sc.vy0 = -Math.abs(sc.vy0); }
        const cy = sc.cy + Math.sin(now / 2400 + sc.bobPh) * 18;
        ctx.fillStyle = sc.grad!;

        for (const f of sc.fish) {
          /* sesekali melesat mendadak (lebih sering saat panik) */
          f.dartT -= dt / 60;
          if (f.dartT <= 0) {
            f.dartV = 0.3 + Math.random() * 0.5;
            f.fx += sc.dir * (2 + Math.random() * 5);
            f.fy += (Math.random() - 0.5) * 8 * (0.4 + panic);
            f.dartT = 3 + Math.random() * 8 - panic * 2;
          }
          f.dartV *= Math.pow(0.4, dt / 50);

          /* goyangan individu di dalam kawanan */
          const wobX = Math.sin(now / (1600 / f.w1) + f.wob) * f.a1;
          const wobY = Math.cos(now / (2100 / f.w2) + f.wob) * f.a2;
          const bobY = Math.sin(now / 430 + f.wob * 2) * 2.2;

          /* menjauh dari kursor */
          const wx0 = sc.cx + f.ox * spread + wobX + f.fx;
          const wy0 = cy + f.oy * spread + wobY + bobY + f.fy;
          const dxm = wx0 - mouse.px, dym = wy0 - mouse.py;
          const dm2 = dxm * dxm + dym * dym;
          if (dm2 < FLEE_R * FLEE_R && dm2 > 0.01) {
            const d = Math.sqrt(dm2);
            const push = 1 - d / FLEE_R;
            f.fx += (dxm / d) * push * 2.1 * dt;
            f.fy += (dym / d) * push * 2.1 * dt;
          }
          /* pegas kembali + batas simpangan */
          f.fx += -f.fx * 0.028 * dt;
          f.fy += -f.fy * 0.028 * dt;
          const fm = Math.hypot(f.fx, f.fy);
          if (fm > 60) { f.fx *= 60 / fm; f.fy *= 60 / fm; }

          const x = sc.cx + f.ox * spread + wobX + f.fx;
          const y = cy + f.oy * spread + wobY + bobY + f.fy;

          /* badan miring mengikuti arah gerak sesungguhnya antar-bingkai */
          const vxw = x - f.px, vyw = y - f.py;
          if (Number.isFinite(f.px)) {
            if (Math.abs(vxw) < 45 && Math.abs(vyw) < 45) {
              const target = Math.max(-0.55, Math.min(0.55, Math.atan2(vyw * sc.dir, Math.abs(vxw) + 2)));
              f.pitch += (target - f.pitch) * Math.min(1, 0.18 * dt);
            } else {
              f.pitch *= Math.pow(0.9, dt); // lompatan wrap → luruskan
            }
          }
          f.px = x; f.py = y;

          /* ekor: makin cepat berenang, makin cepat & lebar kibasannya */
          const speedNorm = Math.min(2.4, (spd * (1 + f.dartV)) / (sc.speed + 0.25));
          f.wagPh += dt * (0.16 + 0.13 * speedNorm) * f.wagMul;
          const tail = Math.sin(f.wagPh) * (0.2 + 0.14 * Math.min(1.6, speedNorm));

          /* pupil melirik ke arah acak sesekali (condong ke depan) */
          f.eyeT -= dt / 60;
          if (f.eyeT <= 0) {
            f.tex = 0.35 + (Math.random() - 0.5) * 1.3;
            f.tey = (Math.random() - 0.5) * 1.1;
            f.eyeT = 0.9 + Math.random() * 2.8;
          }
          f.ex += (f.tex - f.ex) * Math.min(1, 0.14 * dt);
          f.ey += (f.tey - f.ey) * Math.min(1, 0.14 * dt);

          drawFish(x, y, sc.size * f.sizeMul, sc.dir, tail, f.pitch, sc.grad!, f.ex, f.ey, f.wagPh * 0.55 + f.wob);
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
