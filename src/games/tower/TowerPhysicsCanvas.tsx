/* Visual fisika menara — Matter.js + Canvas 2D native (custom draw).
   Bukan pengganti logika puzzle di TowerPuzzle, hanya cermin visual:
   floors = placed.length. Ancaman hiu (threat 0-100) menggoyang menara. */
import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface Props {
  floors: number;
  threat: number;
  height?: number;
}

export default function TowerPhysicsCanvas({ floors, threat, height = 132 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const boxesRef = useRef<Matter.Body[]>([]);
  const threatRef = useRef(threat);
  threatRef.current = threat;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = canvas.clientWidth * devicePixelRatio || 600);
    const H = (canvas.height = height * devicePixelRatio || 132);
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1 } });
    engineRef.current = engine;

    const ground = Matter.Bodies.rectangle(W / 2, H - 8 * devicePixelRatio, W, 16 * devicePixelRatio, {
      isStatic: true,
      friction: 1,
    });
    const wallL = Matter.Bodies.rectangle(-20, H / 2, 40, H * 2, { isStatic: true });
    const wallR = Matter.Bodies.rectangle(W + 20, H / 2, 40, H * 2, { isStatic: true });
    Matter.Composite.add(engine.world, [ground, wallL, wallR]);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 1 / 60;
      // goyangan hiu: gravitasi x berosilasi sebanding threat
      const sway = (threatRef.current / 100) * 0.55 * Math.sin(t * 2.2);
      engine.gravity.x = sway;
      Matter.Engine.update(engine, 1000 / 60);

      ctx.clearRect(0, 0, W, H);
      // laut fondo
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#e0f2fe");
      g.addColorStop(1, "#fef3c7");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < boxesRef.current.length; i++) {
        const b = boxesRef.current[i];
        const w = (b as unknown as { w: number }).w ?? 80;
        const h = (b as unknown as { h: number }).h ?? 16;
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);
        const shade = 190 - Math.min(70, i * 6);
        ctx.fillStyle = `rgb(45,${shade},191)`;
        ctx.strokeStyle = "rgba(12,74,110,0.6)";
        ctx.lineWidth = 2;
        const x = -w / 2;
        const y = -h / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4 * devicePixelRatio);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `${10 * devicePixelRatio}px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), 0, 1);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      if (canvas.clientWidth) canvas.width = canvas.clientWidth * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      boxesRef.current = [];
    };
  }, [height]);

  // sinkron jumlah kotak dengan floors (tambah / buang dari atas)
  useEffect(() => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const W = canvas.width || 600;
    const H = canvas.height || 132;
    const dpr = devicePixelRatio || 1;

    while (boxesRef.current.length < floors) {
      const i = boxesRef.current.length;
      const wBase = W * 0.62;
      const w = Math.max(50 * dpr, wBase - i * 6 * dpr);
      const h = 15 * dpr;
      const x = W / 2 + (Math.random() - 0.5) * 8 * dpr;
      const y = H - 20 * dpr - i * 16 * dpr;
      const box = Matter.Bodies.rectangle(x, y, w, h, {
        friction: 0.9,
        frictionStatic: 1,
        restitution: 0.02,
        density: 0.0012,
      });
      (box as unknown as { w: number }).w = w;
      (box as unknown as { h: number }).h = h;
      boxesRef.current.push(box);
      Matter.Composite.add(engine.world, box);
    }
    while (boxesRef.current.length > floors) {
      const top = boxesRef.current.pop();
      if (top) Matter.Composite.remove(engine.world, top);
    }
  }, [floors]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block rounded-xl border border-[var(--line-soft)]"
      style={{ height }}
      aria-label={`Visual fisika menara: ${floors} lantai`}
    />
  );
}
