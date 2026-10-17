import { useState } from "react";
import { sfx } from "../lib/audio";
import { IconBolt, IconCheck, IconEye, IconSparkles } from "./icons";

interface Props {
  interactive?: boolean;
  className?: string;
}

export default function WebTrioAnalogyArt({ interactive = true, className = "" }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "html" | "css" | "js">("all");
  const [demoState, setDemoState] = useState<{ clicked: boolean; count: number; theme: "neon" | "coral" }>({
    clicked: false,
    count: 0,
    theme: "neon",
  });

  const handleSimulateClick = () => {
    sfx.click();
    setDemoState((prev) => ({
      clicked: true,
      count: prev.count + 1,
      theme: prev.theme === "neon" ? "coral" : "neon",
    }));
  };

  return (
    <div className={`p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[rgba(6,22,38,0.95)] to-[rgba(3,14,24,0.98)] border border-[rgba(46,230,200,0.35)] shadow-[0_0_35px_rgba(46,230,200,0.15)] select-none ${className}`}>
      {/* Header Visualizer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(126,196,236,0.15)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--teal)] flex items-center gap-1">
              <IconSparkles size={11} /> Konsep & Analogi Inti Web
            </span>
            <span className="text-[10px] text-[var(--faint)]">•</span>
            <span className="text-[10px] font-bold text-amber-300">Trio Pondasi Modern</span>
          </div>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight mt-0.5">
            Analogi Tubuh Cyber: HTML, CSS & JavaScript
          </h3>
        </div>

        {/* Filter Tab Interaktif */}
        {interactive && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(4,16,28,0.85)] border border-[rgba(126,196,236,0.2)] text-xs font-bold">
            {(
              [
                { id: "all", label: "Semua (Trio)" },
                { id: "html", label: "HTML (Tulang)" },
                { id: "css", label: "CSS (Estetika)" },
                { id: "js", label: "JS (Otak)" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  sfx.click();
                  setActiveTab(t.id);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === t.id
                    ? "bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.45)] shadow-sm"
                    : "text-[var(--dim)] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid 3 Pilar Analogi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Pilar 1: HTML */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            activeTab === "all" || activeTab === "html"
              ? "bg-[rgba(8,30,50,0.7)] border-[#2ee6c8] shadow-[0_0_20px_rgba(46,230,200,0.2)] scale-[1.01]"
              : "opacity-40 bg-[rgba(5,17,30,0.5)] border-[rgba(126,196,236,0.15)]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl grid place-items-center bg-[rgba(46,230,200,0.15)] text-[#2ee6c8] border border-[rgba(46,230,200,0.4)] font-mono font-extrabold text-xs">
                &lt;/&gt;
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[rgba(46,230,200,0.2)] text-[#2ee6c8] border border-[rgba(46,230,200,0.4)]">
                Struktur Tulang
              </span>
            </div>

            <h4 className="font-display font-extrabold text-lg text-white mt-3">
              HTML (HyperText Markup)
            </h4>
            <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
              <strong>Analogi:</strong> Kerangka tulang robot / rangka baja kapal selam. Menentukan <em>apa saja</em> elemen yang ada di halaman web.
            </p>

            {/* Visualisasi Tulang Wireframe */}
            <div className="mt-3.5 p-2.5 rounded-lg bg-[rgba(3,12,22,0.9)] border border-[rgba(46,230,200,0.3)] font-mono text-[11px] space-y-1">
              <div className="text-[var(--teal)] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ee6c8] animate-ping" />
                <span>&lt;header&gt; Ruang Kokpit &lt;/header&gt;</span>
              </div>
              <div className="text-slate-300 pl-3 border-l border-[rgba(46,230,200,0.25)]">
                &lt;main&gt; Lambung Utama
                <div className="pl-3 text-[var(--cyan)]">&lt;h1&gt;Judul Samudra&lt;/h1&gt;</div>
                <div className="pl-3 text-[var(--cyan)]">&lt;button&gt;Tombol Torpedo&lt;/button&gt;</div>
                &lt;/main&gt;
              </div>
              <div className="text-[var(--teal)] font-bold">&lt;footer&gt; Baling-Baling &lt;/footer&gt;</div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[rgba(46,230,200,0.2)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--dim)]">Fungsi Utama:</span>
            <span className="text-white font-semibold">Semantik & Hirarki DOM</span>
          </div>
        </div>

        {/* Pilar 2: CSS */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            activeTab === "all" || activeTab === "css"
              ? "bg-[rgba(8,30,50,0.7)] border-[#ffc247] shadow-[0_0_20px_rgba(255,194,71,0.2)] scale-[1.01]"
              : "opacity-40 bg-[rgba(5,17,30,0.5)] border-[rgba(126,196,236,0.15)]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl grid place-items-center bg-[rgba(255,194,71,0.15)] text-[#ffc247] border border-[rgba(255,194,71,0.4)] font-mono font-extrabold text-xs">
                {`{ }`}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[rgba(255,194,71,0.2)] text-[#ffc247] border border-[rgba(255,194,71,0.4)]">
                Pakaian & Estetika
              </span>
            </div>

            <h4 className="font-display font-extrabold text-lg text-white mt-3">
              CSS (Cascading Style Sheets)
            </h4>
            <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
              <strong>Analogi:</strong> Kulit armor hologram, cat gradien neon, dan tata letak interior kapal. Menentukan <em>bagaimana rupa dan gaya</em> web.
            </p>

            {/* Visualisasi Style Rule */}
            <div className="mt-3.5 p-2.5 rounded-lg bg-[rgba(3,12,22,0.9)] border border-[rgba(255,194,71,0.3)] font-mono text-[11px] space-y-1">
              <div className="text-[var(--amber)] font-bold">.submarine-cockpit {`{`}</div>
              <div className="text-slate-300 pl-3">
                background: <span className="text-emerald-400">#041a2f</span>;
              </div>
              <div className="text-slate-300 pl-3">
                display: <span className="text-cyan-300">flex</span>;
              </div>
              <div className="text-slate-300 pl-3">
                box-shadow: <span className="text-amber-300">0 0 25px neon</span>;
              </div>
              <div className="text-[var(--amber)] font-bold">{`}`}</div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[rgba(255,194,71,0.2)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--dim)]">Fungsi Utama:</span>
            <span className="text-white font-semibold">Warna, Flexbox, & Animasi</span>
          </div>
        </div>

        {/* Pilar 3: JavaScript */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            activeTab === "all" || activeTab === "js"
              ? "bg-[rgba(8,30,50,0.7)] border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.2)] scale-[1.01]"
              : "opacity-40 bg-[rgba(5,17,30,0.5)] border-[rgba(126,196,236,0.15)]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl grid place-items-center bg-[rgba(244,63,94,0.15)] text-[#f43f5e] border border-[rgba(244,63,94,0.4)] font-mono font-extrabold text-xs">
                JS
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[rgba(244,63,94,0.2)] text-[#f43f5e] border border-[rgba(244,63,94,0.4)]">
                Otak & Gerakan
              </span>
            </div>

            <h4 className="font-display font-extrabold text-lg text-white mt-3">
              JavaScript (Mesin Logika)
            </h4>
            <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">
              <strong>Analogi:</strong> Otak sensorik dan sistem saraf kinetik kapal selam. Menentukan <em>bagaimana perilaku dan reaksi</em> saat berinteraksi.
            </p>

            {/* Visualisasi Kode Logika */}
            <div className="mt-3.5 p-2.5 rounded-lg bg-[rgba(3,12,22,0.9)] border border-[rgba(244,63,94,0.3)] font-mono text-[11px] space-y-1">
              <div className="text-rose-400 font-bold">torpedoBtn.addEventListener(</div>
              <div className="text-slate-300 pl-3">
                &apos;click&apos;, () =&gt; {`{`}
              </div>
              <div className="text-cyan-300 pl-5">
                sonarSound.play();
              </div>
              <div className="text-amber-300 pl-5">
                statusEl.textContent = &apos;DILUNCURKAN!&apos;;
              </div>
              <div className="text-rose-400 font-bold pl-3">{`}`});</div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[rgba(244,63,94,0.2)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--dim)]">Fungsi Utama:</span>
            <span className="text-white font-semibold">Event, DOM & Reaktivitas</span>
          </div>
        </div>
      </div>

      {/* Simulator Interaktif Live: Bukti Sinergi Trio Web */}
      <div className="mt-6 p-4 rounded-xl bg-[rgba(3,10,18,0.85)] border border-[rgba(126,196,236,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg grid place-items-center bg-[rgba(46,230,200,0.15)] text-[var(--teal)] border border-[rgba(46,230,200,0.35)]">
              <IconEye size={16} />
            </span>
            <div>
              <p className="text-xs font-extrabold text-white">
                Simulasi Sinergi Nyata (Hands-on Mini Lab)
              </p>
              <p className="text-[11px] text-[var(--dim)]">
                Klik tombol di samping untuk membuktikan HTML (elemen), CSS (gaya), dan JS (reaksi logika) bekerja serentak:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateClick}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              demoState.theme === "neon"
                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 shadow-[0_0_18px_rgba(46,230,200,0.4)]"
                : "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.4)]"
            }`}
          >
            <IconBolt size={14} />
            <span>Picu Interaksi JS ({demoState.count})</span>
          </button>
        </div>

        {demoState.clicked && (
          <div className="mt-3 p-2.5 rounded-lg bg-[rgba(46,230,200,0.08)] border border-[rgba(46,230,200,0.3)] text-xs text-emerald-300 flex items-center gap-2 anim-fadeUp">
            <IconCheck size={14} className="shrink-0 text-[var(--teal)]" />
            <span>
              <strong>Reaksi Berhasil:</strong> JavaScript mendeteksi event &apos;click&apos; &rarr; merubah state angka menjadi {demoState.count} &rarr; CSS merender transisi gradien warna baru pada tombol!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
