/* Peta Misi HUD ala konsep Gemini — Codeshark Academy.
   Aset: cutout tunggal via <picture> (webp + png, lazy, anti-CLS) +
   properti kecil via image-matrix sprite isolated 4×3 (hud-map.css: .spr-iso-*,
   kanonik dari buat_white_isolated_background_sprite_20261014205159.png) +
   legacy .spr-* (kini menunjuk sheet isolated 1376×768).
   Data live: stat dari save, node 1–16 dari lib/progress (bukan hard-code). */
import type { SaveData } from "../lib/storage";
import { meetingLevel, meetingUnlocked } from "../lib/progress";
import { CURRICULUM } from "../data/curriculum";
import checkpointPng from "../assets/hud/hud-checkpoint.png";
import checkpointWebp from "../assets/hud/hud-checkpoint.webp";
import stationPng from "../assets/hud/hud-station-uas.png";
import stationWebp from "../assets/hud/hud-station-uas.webp";
import conceptJpg from "../assets/hud/hud-concept.jpg";
import conceptWebp from "../assets/hud/hud-concept.webp";

/* posisi node di kanvas 1000×560 — alur S seperti konsep:
   1 (emas, kiri) → 2..7 → 8 (UTS, kubah neon) → 9..15 → 16 (UAS, stasiun) */
const NODES: { no: number; x: number; y: number; cls?: string; big?: boolean }[] = [
  { no: 1, x: 16, y: 50, big: true },
  { no: 2, x: 27, y: 57 },
  { no: 3, x: 33, y: 63 },
  { no: 4, x: 39, y: 69 },
  { no: 5, x: 47, y: 78 },
  { no: 6, x: 55, y: 82 },
  { no: 7, x: 63, y: 80 },
  { no: 8, x: 71, y: 73, cls: "uts", big: true },
  { no: 9, x: 68, y: 58 },
  { no: 10, x: 62, y: 49 },
  { no: 11, x: 58, y: 40 },
  { no: 12, x: 55, y: 30 },
  { no: 13, x: 61, y: 22 },
  { no: 14, x: 69, y: 21 },
  { no: 15, x: 77, y: 24 },
  { no: 16, x: 86, y: 34, cls: "uas", big: true },
];

interface Props {
  save: SaveData;
  onNode: (no: number) => void;
}

const lessonTitle = (no: number): string =>
  CURRICULUM.find((l) => l.no === no)?.title ?? `Pertemuan ${no}`;

export default function HudMap({ save, onNode }: Props) {
  const matured = CURRICULUM.filter((l) => meetingLevel(save, l.no) >= 2).length;

  const firstOpen: number = (() => {
    for (let n = 1; n <= 16; n++) {
      if (meetingUnlocked(save, n) && meetingLevel(save, n) < 2) return n;
    }
    return 16;
  })();

  return (
    <section className="hudmap" aria-label="Peta misi gaya konsep">
      {/* satu-satunya indikator progres peta: hindari duplikat stat hero */}
      <div className="hudmap-progress" role="status">
        <span>Pertemuan <strong>{matured}/16</strong></span>
        <span aria-hidden="true">•</span>
        <span className="truncate">Lanjut: {lessonTitle(firstOpen)}</span>
      </div>

      <div className="hudmap-stage">
        <div className="hudmap-scroll">
          <div className="hudmap-canvas">
            {/* backdrop referensi konsep — samar, di bawah elemen main */}
            <picture>
              <source srcSet={conceptWebp} type="image/webp" />
              <img
                src={conceptJpg} alt="" aria-hidden="true"
                className="hudmap-concept" loading="lazy" decoding="async"
                width={1280} height={715}
              />
            </picture>
            <div className="hudmap-shade" aria-hidden="true" />

            {/* kabel jalur antar-node (16 titik → 15 segmen) */}
            <svg className="hudmap-wires" viewBox="0 0 1000 560" aria-hidden="true">
              {NODES.slice(0, -1).map((n, i) => {
                const m = NODES[i + 1];
                const open = meetingUnlocked(save, m.no);
                return (
                  <line
                    key={n.no}
                    x1={n.x * 10} y1={n.y * 5.6} x2={m.x * 10} y2={m.y * 5.6}
                    stroke={open ? "#2ee6c8" : "rgba(126,196,236,0.35)"}
                    strokeWidth={open ? 5 : 3}
                    strokeLinecap="round"
                    strokeDasharray={open ? undefined : "2 9"}
                    style={open ? { filter: "drop-shadow(0 0 6px rgba(46,230,200,0.8))" } : undefined}
                  />
                );
              })}
            </svg>

            {/* bangunan checkpoint — sprite isolated 4×3 (kanonik) */}
            <figure className="hudmap-base hudmap-base-m1">
              {/* sel A1 sheet isolated: kubah emas */}
              <span className="spr-iso spr-iso-dome-gold building" role="img" aria-label="Kubah emas misi 1" />
              <figcaption>
                <span className="t1">MISI 01</span>
                <span className="t2">{lessonTitle(1)}</span>
                <span className="t3">Misi Abjad</span>
                <span className="hudmap-iso-row" style={{ justifyContent: "center", marginTop: 4 }}>
                  <span className="spr-iso spr-iso-badge-1 badge" style={{ width: 46 }} role="img" aria-label="Badge pertemuan 1" />
                  <span className="spr-iso spr-iso-shark" style={{ width: 70, aspectRatio: "4 / 3" }} aria-hidden="true" />
                </span>
              </figcaption>
            </figure>

            <figure className="hudmap-base hudmap-base-m2">
              <picture>
                <source srcSet={checkpointWebp} type="image/webp" />
                <img
                  src={checkpointPng} alt="Gedung checkpoint kubah neon — UTS pertemuan 8"
                  loading="lazy" decoding="async" width={786} height={690}
                />
              </picture>
              <figcaption>
                <span className="t1">MISI 02 · UTS</span>
                <span className="t2">{lessonTitle(8)}</span>
                <span className="t3">Seni Gaya Web</span>
                <span className="hudmap-iso-row" style={{ justifyContent: "center", marginTop: 4 }}>
                  <span className="spr-iso spr-iso-dome-neon building" style={{ width: 96 }} role="img" aria-label="Kubah neon UTS pertemuan 8" />
                  <span className="spr-iso spr-iso-badge-8 badge" style={{ width: 54 }} role="img" aria-label="Badge 8 UTS terkunci" />
                </span>
              </figcaption>
            </figure>

            <figure className="hudmap-base hudmap-base-uas">
              <span className="crop">
                <picture>
                  <source srcSet={stationWebp} type="image/webp" />
                  <img
                    src={stationPng} alt="Stasiun teknologi UAS yang terkunci — pertemuan 16"
                    loading="lazy" decoding="async" width={1108} height={730}
                  />
                </picture>
              </span>
              <figcaption>
                <span className="hudmap-tag hudmap-iso-row" style={{ display: "inline-flex" }}>
                  <span className="spr-iso spr-iso-lock lock-chip" aria-hidden="true" />
                  UAS 03 · JAVASCRIPT
                </span>
                <span className="t3">{lessonTitle(16)}</span>
                <span className="hudmap-iso-row" style={{ justifyContent: "center", marginTop: 4 }}>
                  <span className="spr-iso spr-iso-station building" style={{ width: 112 }} role="img" aria-label="Stasiun teknologi UAS pertemuan 16" />
                  <span className="spr-iso spr-iso-badge-16 badge" style={{ width: 54 }} role="img" aria-label="Badge 16 UAS terkunci" />
                </span>
              </figcaption>
            </figure>

            {/* hiu hiasan dari sprite-sheet (1 request untuk semua) */}
            <span className="spr spr-shark s1" aria-hidden="true" />
            <span className="spr spr-shark s2" aria-hidden="true" />
            <span className="spr spr-reef" aria-hidden="true" />

            {/* node 1–16 */}
            {NODES.map((n) => {
              const open = meetingUnlocked(save, n.no);
              const lvl = meetingLevel(save, n.no);
              const state = !open ? "lock" : lvl >= 2 ? "done" : n.no === firstOpen ? "now" : "open";
              return (
                <button
                  key={n.no}
                  type="button"
                  className={`hudmap-node${n.big ? " big" : ""}${n.cls ? ` ${n.cls}` : ""}${state === "done" ? " done" : ""}${state === "now" ? " now" : ""}`}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  disabled={!open}
                  onClick={() => onNode(n.no)}
                  aria-label={
                    open
                      ? `Pertemuan ${n.no}: ${lessonTitle(n.no)} — level ${lvl}`
                      : `Pertemuan ${n.no} terkunci`
                  }
                  title={open ? `${lessonTitle(n.no)} (${["Belum", "Perunggu", "Perak", "Emas"][lvl]})` : "Selesaikan pertemuan sebelumnya hingga Perak"}
                >
                  {state === "lock" ? <span className="spr spr-lock sm" aria-label="Terkunci" /> : n.no}
                </button>
              );
            })}
          </div>
        </div>
    </div>

    </section>
  );
}
