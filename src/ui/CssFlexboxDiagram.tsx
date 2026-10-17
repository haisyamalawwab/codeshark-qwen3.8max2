import { useState } from "react";
import { sfx } from "../lib/audio";
import { IconBolt, IconSparkles } from "./icons";

interface Props {
  className?: string;
}

type JustifyContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
type AlignItems = "stretch" | "center" | "flex-start" | "flex-end";
type FlexDirection = "row" | "column";

export default function CssFlexboxDiagram({ className = "" }: Props) {
  const [direction, setDirection] = useState<FlexDirection>("row");
  const [justify, setJustify] = useState<JustifyContent>("center");
  const [align, setAlign] = useState<AlignItems>("center");
  const [itemCount, setItemCount] = useState<number>(3);

  const boxColors = [
    { label: "Modul 01", bg: "bg-teal-500/20", border: "border-teal-400", text: "text-teal-300" },
    { label: "Modul 02", bg: "bg-amber-500/20", border: "border-amber-400", text: "text-amber-300" },
    { label: "Modul 03", bg: "bg-cyan-500/20", border: "border-cyan-400", text: "text-cyan-300" },
    { label: "Modul 04", bg: "bg-rose-500/20", border: "border-rose-400", text: "text-rose-300" },
  ];

  return (
    <div className={`p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[rgba(6,22,38,0.95)] to-[rgba(3,14,24,0.98)] border border-[rgba(255,194,71,0.35)] shadow-[0_0_35px_rgba(255,194,71,0.15)] select-none ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(126,196,236,0.15)]">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--amber)] flex items-center gap-1">
            <IconSparkles size={11} /> Konsep Visual CSS: Tata Letak Fleksibel
          </span>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight mt-0.5">
            Simulator Interaktif: CSS Flexbox
          </h3>
          <p className="text-xs text-[var(--dim)] mt-1">
            Ganti properti di bawah untuk melihat bagaimana item bergerak di sepanjang sumbu utama & sumbu silang:
          </p>
        </div>
        <span className="chip !text-[var(--amber)] !border-[rgba(255,194,71,0.4)] shrink-0 self-start sm:self-auto">
          🌊 Main Axis & Cross Axis
        </span>
      </div>

      {/* Kontrol Interaktif Flexbox */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 p-3.5 rounded-xl bg-[rgba(3,10,18,0.85)] border border-[rgba(126,196,236,0.2)] text-xs">
        {/* Kontrol 1: flex-direction */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)] block mb-1.5">
            1. flex-direction ({direction === "row" ? "Horizontal" : "Vertikal"})
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(["row", "column"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => {
                  sfx.click();
                  setDirection(dir);
                }}
                className={`py-1.5 px-2 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  direction === dir
                    ? "bg-[rgba(255,194,71,0.25)] text-amber-300 border border-amber-400 shadow-sm"
                    : "bg-[rgba(6,22,38,0.7)] text-[var(--dim)] border border-[rgba(126,196,236,0.15)] hover:text-white"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        {/* Kontrol 2: justify-content */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)] block mb-1.5">
            2. justify-content (Sumbu Utama)
          </label>
          <select
            value={justify}
            onChange={(e) => {
              sfx.click();
              setJustify(e.target.value as JustifyContent);
            }}
            className="w-full py-1.5 px-2.5 rounded-lg font-mono font-bold bg-[rgba(6,22,38,0.9)] text-white border border-[rgba(126,196,236,0.3)] focus:outline-none focus:border-[var(--amber)] cursor-pointer"
          >
            <option value="flex-start">flex-start (Kiri/Awal)</option>
            <option value="center">center (Tengah Sumbu Utama)</option>
            <option value="flex-end">flex-end (Kanan/Akhir)</option>
            <option value="space-between">space-between (Menempel Ujung)</option>
            <option value="space-around">space-around (Jarak Rata)</option>
          </select>
        </div>

        {/* Kontrol 3: align-items */}
        <div>
          <label className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--faint)] block mb-1.5">
            3. align-items (Sumbu Silang)
          </label>
          <select
            value={align}
            onChange={(e) => {
              sfx.click();
              setAlign(e.target.value as AlignItems);
            }}
            className="w-full py-1.5 px-2.5 rounded-lg font-mono font-bold bg-[rgba(6,22,38,0.9)] text-white border border-[rgba(126,196,236,0.3)] focus:outline-none focus:border-[var(--amber)] cursor-pointer"
          >
            <option value="stretch">stretch (Rentang Penuh)</option>
            <option value="center">center (Tengah Sumbu Silang)</option>
            <option value="flex-start">flex-start (Atas)</option>
            <option value="flex-end">flex-end (Bawah)</option>
          </select>
        </div>
      </div>

      {/* Live Stage Flex Container */}
      <div className="mt-5 relative">
        {/* Indikator Sumbu Utama (Main Axis) */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300/80 mb-1.5">
          <span>&rarr; MAIN AXIS ({direction === "row" ? "Horizontal Sumbu-X" : "Vertikal Sumbu-Y"})</span>
          <div className="flex items-center gap-1">
            <span className="text-[var(--dim)]">Jumlah Box:</span>
            {[2, 3, 4].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => {
                  sfx.click();
                  setItemCount(cnt);
                }}
                className={`w-5 h-5 rounded text-[10px] font-bold cursor-pointer ${
                  itemCount === cnt
                    ? "bg-amber-400 text-black font-extrabold"
                    : "bg-white/5 text-[var(--dim)] hover:text-white"
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Kotak Kontainer Flexbox dengan CSS yang diaplikasikan langsung */}
        <div
          className="w-full min-h-[190px] p-4 rounded-xl border-2 border-dashed border-amber-400/50 bg-[rgba(2,8,15,0.95)] relative overflow-hidden transition-all duration-500 shadow-inner"
          style={{
            display: "flex",
            flexDirection: direction,
            justifyContent: justify,
            alignItems: align,
            gap: "12px",
          }}
        >
          {Array.from({ length: itemCount }).map((_, i) => {
            const col = boxColors[i % boxColors.length];
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border ${col.border} ${col.bg} transition-all duration-500 flex flex-col justify-center items-center shadow-md min-w-[90px] min-h-[60px]`}
                style={{
                  height: align === "stretch" && direction === "row" ? "auto" : undefined,
                  width: align === "stretch" && direction === "column" ? "100%" : undefined,
                }}
              >
                <span className="text-[10px] font-mono font-extrabold text-[var(--faint)]">
                  Item #{i + 1}
                </span>
                <span className={`font-display font-extrabold text-sm ${col.text}`}>
                  {col.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Kode CSS Nyata */}
      <div className="mt-4 p-3 rounded-lg bg-[rgba(4,16,28,0.9)] border border-[rgba(126,196,236,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="text-[var(--teal)] truncate">
          <span className="text-[var(--faint)]">.flex-container {`{`}</span> display: flex; flex-direction: {direction}; justify-content: {justify}; align-items: {align}; <span className="text-[var(--faint)]">{`}`}</span>
        </div>
        <span className="text-[10px] font-sans font-bold text-amber-300 shrink-0 flex items-center gap-1">
          <IconBolt size={12} /> Responsive Layout
        </span>
      </div>
    </div>
  );
}
