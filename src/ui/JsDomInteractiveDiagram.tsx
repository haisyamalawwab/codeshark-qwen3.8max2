import { useState } from "react";
import { sfx } from "../lib/audio";
import { IconBolt, IconKeyboard, IconSparkles } from "./icons";

interface Props {
  className?: string;
}

export default function JsDomInteractiveDiagram({ className = "" }: Props) {
  const [stage, setStage] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    "[Sistem]: Siap mendengarkan event pengguna...",
  ]);

  const triggerEvent = () => {
    sfx.click();
    const nextClicks = clicks + 1;
    setClicks(nextClicks);
    setStage(1);

    // Animasi bertahap alur sinyal JS
    window.setTimeout(() => {
      setStage(2);
      window.setTimeout(() => {
        setStage(3);
        setLogs((prev) => [
          `[Event #${nextClicks}]: click terdeteksi -> DOM diupdate (${nextClicks} torpedo meluncur!)`,
          ...prev.slice(0, 3),
        ]);
      }, 350);
    }, 300);
  };

  return (
    <div className={`p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[rgba(6,22,38,0.95)] to-[rgba(3,14,24,0.98)] border border-[rgba(244,63,94,0.35)] shadow-[0_0_35px_rgba(244,63,94,0.15)] select-none ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(126,196,236,0.15)]">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-rose-400 flex items-center gap-1">
            <IconSparkles size={11} /> Konsep Visual JavaScript & DOM
          </span>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight mt-0.5">
            Alur Sinyal Event-Driven & Manipulasi DOM
          </h3>
          <p className="text-xs text-[var(--dim)] mt-1">
            Tekan tombol picu di Langkah 1 untuk melihat bagaimana sinyal merambat dari input user ke otak JS hingga mengubah elemen HTML:
          </p>
        </div>
        <span className="chip !text-rose-300 !border-rose-400/40 shrink-0 self-start sm:self-auto">
          ⚡ 3 Tahap Reaktivitas
        </span>
      </div>

      {/* Diagram Alur Sinyal 3 Langkah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Tahap 1: User Action / Event */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            stage === 1
              ? "bg-[rgba(244,63,94,0.25)] border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]"
              : "bg-[rgba(6,20,34,0.7)] border-[rgba(126,196,236,0.2)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg grid place-items-center bg-rose-500/20 text-rose-400 border border-rose-400/40 font-bold text-xs">
              1
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              User Event
            </span>
          </div>

          <h4 className="font-display font-extrabold text-base text-white mt-2.5">
            Aksi Pengguna (Click / Keypress)
          </h4>
          <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
            Pengguna mengklik tombol di layar atau mengetik keyboard. Browser membangkitkan sinyal event.
          </p>

          <button
            type="button"
            onClick={triggerEvent}
            className="w-full mt-3.5 py-2 px-3 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <IconBolt size={14} />
            <span>Klik di Sini (Picu Event)</span>
          </button>
        </div>

        {/* Tahap 2: Event Listener & Logic Callback */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            stage === 2
              ? "bg-[rgba(46,230,200,0.25)] border-[#2ee6c8] shadow-[0_0_20px_rgba(46,230,200,0.3)] scale-[1.02]"
              : "bg-[rgba(6,20,34,0.7)] border-[rgba(126,196,236,0.2)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg grid place-items-center bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.4)] font-bold text-xs">
              2
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[rgba(46,230,200,0.2)] text-[var(--teal)]">
              Otak JS
            </span>
          </div>

          <h4 className="font-display font-extrabold text-base text-white mt-2.5">
            addEventListener(&apos;click&apos;)
          </h4>
          <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
            Fungsi JavaScript menangkap event, menjalankan perhitungan, menambah skor, atau memproses logika bisnis.
          </p>

          <div className="mt-3.5 p-2 rounded-lg bg-[rgba(2,8,15,0.9)] font-mono text-[11px] text-teal-300 border border-[rgba(46,230,200,0.25)]">
            <code>count = count + 1;</code>
            <br />
            <code className="text-amber-300">updateUI(count);</code>
          </div>
        </div>

        {/* Tahap 3: DOM Mutasi & Re-render */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            stage === 3
              ? "bg-[rgba(56,189,248,0.25)] border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-[1.02]"
              : "bg-[rgba(6,20,34,0.7)] border-[rgba(126,196,236,0.2)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg grid place-items-center bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold text-xs">
              3
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
              DOM Reaktif
            </span>
          </div>

          <h4 className="font-display font-extrabold text-base text-white mt-2.5">
            Manipulasi DOM
          </h4>
          <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
            JavaScript mengubah teks, kelas CSS, atau membuat elemen baru di halaman secara instan tanpa memuat ulang web.
          </p>

          <div className="mt-3.5 p-2.5 rounded-lg bg-[rgba(2,8,15,0.9)] border border-sky-400/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--dim)]">Status Layar:</span>
            <span className="font-display font-extrabold text-base text-sky-300">
              {clicks} Torpedo Aktif!
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Mini Log */}
      <div className="mt-4 p-3 rounded-lg bg-[rgba(2,6,12,0.9)] border border-[rgba(126,196,236,0.18)] font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] text-[var(--faint)]">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <IconKeyboard size={12} /> Konsol Sinyal JavaScript
          </span>
          <span>Status: {stage === 3 ? "Reaktivitas Sukses ✓" : "Menunggu Event"}</span>
        </div>
        <div className="mt-1.5 space-y-1 text-slate-300 text-[11px]">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-emerald-400">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
