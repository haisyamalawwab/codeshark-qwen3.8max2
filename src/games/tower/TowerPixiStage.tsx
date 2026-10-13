/* Efek perayaan Coding Tower — PixiJS WebGL, lazy & ringan di HP.
   - Hanya di-mount saat menara butuh kemeriahan (trigger `burst` naik tiap lantai benar).
   - Low-end / reduced-motion → render diam (tanpa partikel) agar 60fps terjaga.
   - Gagal load pixi → fallback transparan (game tetap jalan, logika di TowerPuzzle). */
import { useEffect, useRef } from "react";
import { cappedDPR, isLowEnd, prefersReducedMotion } from "../../lib/perf";

interface Props {
  /** naikkan tiap lantai benar untuk memicu ledakan partikel */
  burst: number;
  height?: number;
}

export default function TowerPixiStage({ burst, height = 132 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef(burst);
  burstRef.current = burst;
  const apiRef = useRef<{ boom: () => void } | null>(null);

  useEffect(() => {
    let disposed = false;
    let app: { destroy: () => void } | null = null;
    let raf = 0;
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return;
      if (isLowEnd() || prefersReducedMotion()) return; // hemat HP kentang
      try {
        const PIXI = await import("pixi.js");
        const dpr = cappedDPR(2);
        const W = Math.max(280, canvas.clientWidth || 600);
        const H = height;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        const appV8 = new PIXI.Application();
        await appV8.init({
          canvas,
          width: Math.round(W),
          height: Math.round(H),
          backgroundAlpha: 0,
          antialias: false,
          resolution: dpr,
          autoDensity: true,
        });
        if (disposed) {
          appV8.destroy(true);
          return;
        }
        app = appV8 as unknown as { destroy: () => void };
        const stage = (appV8 as unknown as { stage: PIXI.Container }).stage;
        const parts: { g: PIXI.Graphics; vx: number; vy: number; life: number }[] = [];

        const boom = () => {
          if (disposed) return;
          const colors = [0x2ee6c8, 0x45c6ff, 0xffc247, 0xfb7185, 0xffffff];
          for (let i = 0; i < 26; i++) {
            const g = new PIXI.Graphics();
            g.fill({ color: colors[i % colors.length], alpha: 0.95 });
            const s = 3 + Math.random() * 5;
            g.rect(-s / 2, -s / 2, s, s);
            g.fill();
            g.x = W / 2 + (Math.random() - 0.5) * 60;
            g.y = H - 14;
            stage.addChild(g);
            parts.push({
              g,
              vx: (Math.random() - 0.5) * 5,
              vy: -(2.5 + Math.random() * 4),
              life: 46 + Math.random() * 22,
            });
          }
        };
        apiRef.current = { boom };

        const ticker = () => {
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.life -= 1;
            p.vy += 0.16;
            p.g.x += p.vx;
            p.g.y += p.vy;
            p.g.rotation += 0.12;
            p.g.alpha = Math.max(0, Math.min(1, p.life / 40));
            if (p.life <= 0 || p.g.y > H + 12) {
              stage.removeChild(p.g);
              p.g.destroy();
              parts.splice(i, 1);
            }
          }
          raf = requestAnimationFrame(ticker);
        };
        raf = requestAnimationFrame(ticker);
      } catch {
        /* pixi gagal — biarkan canvas kosong */
      }
    })();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      apiRef.current = null;
      try {
        app?.destroy();
      } catch {
        /* abaikan */
      }
      app = null;
    };
  }, [height]);

  // tiap burst naik → ledakan
  useEffect(() => {
    if (burst > 0) apiRef.current?.boom();
  }, [burst]);

  if (isLowEnd()) return null;
  return (
    <canvas
      ref={canvasRef}
      className="w-full block pointer-events-none"
      style={{ height, touchAction: "manipulation" }}
      aria-hidden="true"
    />
  );
}
