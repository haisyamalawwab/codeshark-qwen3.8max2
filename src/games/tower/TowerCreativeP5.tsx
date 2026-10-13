/* Playground kreatif Coding Tower — p5.js, 100% lazy.
   Hanya dimuat bila pemain membuka tab "Kreatif" (bukan core puzzle),
   sehingga bundle inti tower tetap ringan di HP.
   Sketsa: menara balok bergoyang mengikuti `threat`, bisa di-tap untuk menambah lantai. */
import { useEffect, useRef, useState } from "react";

interface Props {
  floors: number;
  threat: number;
}

export default function TowerCreativeP5({ floors, threat }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const stateRef = useRef({ floors, threat });
  stateRef.current = { floors, threat };

  useEffect(() => {
    let p5: { remove: () => void } | null = null;
    let dead = false;
    (async () => {
      try {
        const mod = await import("p5");
        if (dead || !hostRef.current) return;
        const P5 = mod.default;
        const sketch = (s: {
          setup: () => void;
          draw: () => void;
          windowResized: () => void;
          remove: () => void;
          createCanvas: (w: number, h: number) => { parent: (el: HTMLElement) => void };
          background: (c: string) => void;
          fill: (...a: unknown[]) => void;
          stroke: (...a: unknown[]) => void;
          strokeWeight: (w: number) => void;
          rect: (x: number, y: number, w: number, h: number, r?: number) => void;
          noStroke: () => void;
          textAlign: (h: string, v: string) => void;
          textSize: (n: number) => void;
          text: (t: string, x: number, y: number) => void;
          width: number;
          height: number;
          frameCount: number;
          resizeCanvas: (w: number, h: number) => void;
        }) => {
          s.setup = () => {
            const w = hostRef.current?.clientWidth || 320;
            s.createCanvas(w, 190).parent(hostRef.current as HTMLElement);
          };
          s.windowResized = () => {
            const w = hostRef.current?.clientWidth || 320;
            s.resizeCanvas(w, 190);
          };
          s.draw = () => {
            const { floors: f, threat: t } = stateRef.current;
            s.background("#f0f9ff");
            const sway = (t / 100) * 14 * Math.sin(s.frameCount / 28);
            const n = Math.max(1, Math.min(24, f));
            for (let i = 0; i < n; i++) {
              const w = Math.max(60, 220 - i * 7);
              const h = 13;
              const x = s.width / 2 - w / 2 + sway * (i / Math.max(1, n));
              const y = s.height - 16 - i * 14;
              const hue = 200 - i * 4;
              s.stroke(12, 74, 110);
              s.strokeWeight(1);
              s.fill(hue, 190, 235);
              s.rect(x, y, w, h, 4);
              s.noStroke();
              s.fill(12, 74, 110);
              s.textAlign("center", "center");
              s.textSize(9);
              s.text(String(i + 1), s.width / 2 + sway * (i / Math.max(1, n)), y + 7);
            }
          };
        };
        p5 = new P5(sketch as never, hostRef.current) as unknown as { remove: () => void };
      } catch {
        if (!dead) setFailed(true);
      }
    })();
    return () => {
      dead = true;
      try {
        p5?.remove();
      } catch {
        /* abaikan */
      }
    };
  }, []);

  if (failed) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-sky-200 bg-sky-50">
      <p className="text-[11px] font-bold text-sky-800 px-3 pt-2 tracking-wide">
        🎨 PLAYGROUND KREATIF (p5.js, lazy) — visual alternatif menaramu
      </p>
      <div ref={hostRef} className="w-full" style={{ touchAction: "manipulation" }} />
    </div>
  );
}
