import { useEffect, useState } from "react";
import { sfx } from "../lib/audio";
import { IconSparkles, IconX } from "./icons";
import WebTrioAnalogyArt from "./WebTrioAnalogyArt";
import HtmlStructureDiagram from "./HtmlStructureDiagram";
import CssFlexboxDiagram from "./CssFlexboxDiagram";
import JsDomInteractiveDiagram from "./JsDomInteractiveDiagram";

interface Props {
  initialTab?: "trio" | "html" | "css" | "js";
  onClose: () => void;
}

export default function ConceptVisualizerModal({ initialTab = "trio", onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"trio" | "html" | "css" | "js">(initialTab);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        sfx.click();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[rgba(2,9,17,0.88)] backdrop-blur-md screen-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[rgba(10,32,54,0.98)] to-[rgba(5,17,29,0.99)] border border-[rgba(46,230,200,0.4)] shadow-[0_0_60px_rgba(46,230,200,0.25)] relative anim-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-modal-title"
      >
        {/* Header Modal */}
        <div className="p-5 md:p-6 border-b border-[rgba(126,196,236,0.18)] bg-[rgba(6,22,38,0.75)] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl grid place-items-center bg-[rgba(46,230,200,0.15)] text-[var(--teal)] border border-[rgba(46,230,200,0.4)] shadow-[0_0_16px_rgba(46,230,200,0.2)] text-xl">
              💡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--teal)] flex items-center gap-1">
                  <IconSparkles size={11} /> Visual Learning Lab
                </span>
                <span className="text-[10px] text-[var(--faint)]">•</span>
                <span className="text-[10px] font-bold text-amber-300">Konsep, Analogi & Gambaran Utuh</span>
              </div>
              <h2 id="concept-modal-title" className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight">
                Galeri Konsep & Analogi HTML, CSS, JS
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.14)] text-[var(--dim)] hover:text-white grid place-items-center transition-colors cursor-pointer"
            aria-label="Tutup jendela"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Tab Navigasi Visual */}
        <div className="px-5 md:px-6 py-2.5 bg-[rgba(4,16,28,0.8)] border-b border-[rgba(126,196,236,0.12)] flex items-center gap-2 overflow-x-auto">
          {[
            { id: "trio", label: "Trio Web (Tulang · Baju · Otak)", icon: "🧬" },
            { id: "html", label: "HTML: Hirarki Dokumen DOM", icon: "🏛️" },
            { id: "css", label: "CSS: Simulator Flexbox", icon: "🎨" },
            { id: "js", label: "JS: Sinyal Event & Reaktivitas", icon: "⚡" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                sfx.click();
                setActiveTab(t.id as typeof activeTab);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.id
                  ? "bg-[rgba(46,230,200,0.2)] text-[var(--teal)] border border-[rgba(46,230,200,0.5)] shadow-[0_0_14px_rgba(46,230,200,0.2)]"
                  : "text-[var(--dim)] hover:text-white bg-[rgba(255,255,255,0.04)] border border-transparent"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1">
          {activeTab === "trio" && <WebTrioAnalogyArt />}
          {activeTab === "html" && <HtmlStructureDiagram />}
          {activeTab === "css" && <CssFlexboxDiagram />}
          {activeTab === "js" && <JsDomInteractiveDiagram />}
        </div>
      </div>
    </div>
  );
}
