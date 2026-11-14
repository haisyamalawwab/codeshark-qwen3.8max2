/* Peta panas "titik lumpuh motorik" — Babak 2 AI-Trap Simulator.
   Tombol menyala merah bila jeda motorik sebelum tombol itu > 2 detik
   (definisi di lib/trapMetrics.ts). Tata letak US; simbol ber-Shift
   ditampilkan sebagai separuh atas tombolnya. */
import type { KeyStat } from "../lib/trapMetrics";
import { MIN_HEATMAP_KEYS, SLOW_MS } from "../lib/trapMetrics";

interface KeyDef {
  /** karakter tanpa Shift, atau nama tombol khusus */
  base: string;
  shift?: string;
  label?: string;
  /** lebar relatif (1 = satu tombol huruf) */
  w?: number;
  /** tombol hiasan tanpa data (Tab, Shift, Caps) */
  inert?: boolean;
}

const k = (base: string, shift?: string): KeyDef => ({ base, shift });
const letters = (s: string): KeyDef[] => s.split("").map((c) => ({ base: c, shift: c.toUpperCase(), label: c.toUpperCase() }));

const ROWS: KeyDef[][] = [
  [k("`", "~"), k("1", "!"), k("2", "@"), k("3", "#"), k("4", "$"), k("5", "%"), k("6", "^"), k("7", "&"), k("8", "*"), k("9", "("), k("0", ")"), k("-", "_"), k("=", "+"), { base: "Backspace", label: "⌫", w: 1.8 }],
  [{ base: "Tab", label: "Tab", w: 1.4, inert: true }, ...letters("qwertyuiop"), k("[", "{"), k("]", "}"), k("\\", "|")],
  [{ base: "Caps", label: "Caps", w: 1.7, inert: true }, ...letters("asdfghjkl"), k(";", ":"), k("'", '"'), { base: "Enter", label: "Enter", w: 1.9 }],
  [{ base: "ShiftL", label: "Shift", w: 2.2, inert: true }, ...letters("zxcvbnm"), k(",", "<"), k(".", ">"), k("/", "?"), { base: "ShiftR", label: "Shift", w: 2.4, inert: true }],
  [{ base: "Space", label: "spasi", w: 7 }],
];

const sec = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} dtk`;

const SHOWN: Record<string, string> = { Backspace: "⌫ Backspace", Enter: "Enter", Space: "spasi" };
export const keyLabel = (key: string) => SHOWN[key] ?? key;

function heat(st: KeyStat | undefined): { bg: string; fg: string; border: string } {
  if (!st) return { bg: "rgba(10, 30, 50, 0.55)", fg: "#4f7088", border: "rgba(126, 196, 236, 0.1)" };
  if (st.maxMs <= SLOW_MS) return { bg: "rgba(46, 230, 200, 0.1)", fg: "#9ff0dd", border: "rgba(46, 230, 200, 0.4)" };
  const a = 0.5 + 0.5 * Math.min(1, (st.maxMs - SLOW_MS) / 4000);
  return { bg: `rgba(255, 64, 48, ${a.toFixed(2)})`, fg: "#fff", border: "rgba(255, 150, 135, 0.95)" };
}

function merge(a?: KeyStat, b?: KeyStat): KeyStat | undefined {
  if (!a) return b;
  if (!b) return a;
  return { n: a.n + b.n, maxMs: Math.max(a.maxMs, b.maxMs), slow: a.slow + b.slow };
}

const tip = (name: string, st?: KeyStat) =>
  st ? `${name}: diketik ${st.n}× di tengah mengetik, jeda terlama ${sec(st.maxMs)}` : `${name}: tidak terekam`;

interface Props {
  keys: Record<string, KeyStat>;
  contiguousKeys: number;
  slowKeys: string[];
}

export default function KeyboardHeatmap({ keys, contiguousKeys, slowKeys }: Props) {
  const enough = contiguousKeys >= MIN_HEATMAP_KEYS;

  return (
    <div>
      <div className="trap-kbd" role="img" aria-label={
        slowKeys.length
          ? `Peta panas keyboard. Tombol dengan jeda lebih dari 2 detik: ${slowKeys.map(keyLabel).join(", ")}.`
          : "Peta panas keyboard. Tidak ada tombol dengan jeda lebih dari 2 detik."
      }>
        {ROWS.map((row, ri) => (
          <div key={ri} className="trap-kbd-row">
            {row.map((def) => {
              const isLetter = !!def.label && def.shift !== undefined;
              const dual = def.shift !== undefined && !isLetter;
              if (dual) {
                const top = heat(keys[def.shift!]);
                const bot = heat(keys[def.base]);
                return (
                  <span key={def.base} className="trap-key trap-key-dual" style={{ flexGrow: def.w ?? 1 }}>
                    <span title={tip(def.shift!, keys[def.shift!])} style={{ background: top.bg, color: top.fg, borderColor: top.border }}>{def.shift}</span>
                    <span title={tip(def.base, keys[def.base])} style={{ background: bot.bg, color: bot.fg, borderColor: bot.border }}>{def.base}</span>
                  </span>
                );
              }
              const st = def.inert ? undefined : isLetter ? merge(keys[def.base], keys[def.shift!]) : keys[def.base];
              const h = heat(st);
              return (
                <span
                  key={def.base}
                  className="trap-key"
                  title={def.inert ? undefined : tip(def.label ?? def.base, st)}
                  style={{ flexGrow: def.w ?? 1, background: h.bg, color: h.fg, borderColor: h.border, opacity: def.inert ? 0.55 : 1 }}
                >
                  {def.label ?? def.base}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap mt-3 text-[11px] font-bold text-[var(--dim)]">
        <span className="inline-flex items-center gap-1.5"><i className="trap-legend" style={{ background: "rgba(255,64,48,0.9)" }} /> jeda &gt; 2 detik</span>
        <span className="inline-flex items-center gap-1.5"><i className="trap-legend" style={{ background: "rgba(46,230,200,0.25)", borderColor: "rgba(46,230,200,0.5)" }} /> diketik tanpa jeda panjang</span>
        <span className="inline-flex items-center gap-1.5"><i className="trap-legend" /> tidak terekam</span>
      </div>

      {!enough ? (
        <p className="mt-3 text-sm text-[var(--amber)] font-bold">
          Data tidak cukup: hanya {contiguousKeys} ketukan bersambung yang terekam. Peta ini belum bisa dibaca sebagai gambaran jarimu.
        </p>
      ) : slowKeys.length ? (
        <p className="mt-3 text-sm text-[var(--ink)]">
          <strong className="text-[var(--coral)]">Titik lumpuh:</strong>{" "}
          {slowKeys.map((key, i) => (
            <span key={key}>
              {i > 0 && " · "}
              <span className="keycap !h-6 !min-w-6 !text-[11px] !text-white" style={{ background: "#b3261e" }}>{keyLabel(key)}</span>{" "}
              <span className="font-code text-[12px] text-[var(--dim)]">{sec(keys[key].maxMs)}</span>
            </span>
          ))}
        </p>
      ) : (
        <p className="mt-3 text-sm text-[var(--mint)] font-bold">Tidak ada tombol dengan jeda di atas 2 detik.</p>
      )}
    </div>
  );
}
