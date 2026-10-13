import { tokenize } from "../lib/highlight";

/* Panel kode dengan penomoran baris — dipakai juga oleh layar hasil. */
export function CodePanel({ code, lang, caption }: { code: string; lang: "html" | "css" | "js"; caption?: string }) {
  const lines = tokenize(code, lang);
  return (
    <figure className="my-4 rounded-xl overflow-hidden border border-[var(--line)] bg-[rgba(4,17,30,0.85)]">
      <figcaption className="flex items-center gap-2 px-4 py-2 border-b border-[var(--line-soft)] bg-[rgba(10,38,62,0.5)]">
        <span className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#ff6b57] inline-block" />
          <i className="w-2.5 h-2.5 rounded-full bg-[#ffc247] inline-block" />
          <i className="w-2.5 h-2.5 rounded-full bg-[#2ee6c8] inline-block" />
        </span>
        <span className="font-code text-[11px] uppercase tracking-widest text-[var(--faint)]">{lang}</span>
        {caption && <span className="text-xs text-[var(--dim)] ml-auto hidden sm:block">{caption}</span>}
      </figcaption>
      <div className="overflow-x-auto code-scroll py-3">
        <pre className="font-code text-sm leading-[1.75] min-w-max">
          {lines.map((toks, i) => (
            <div key={i} className="flex px-4 hover:bg-[rgba(69,198,255,0.05)]">
              <span className="w-7 shrink-0 text-right mr-4 text-[var(--faint)] select-none">{i + 1}</span>
              <code>
                {toks.length === 0 ? "\u00A0" : toks.map((t, j) => (
                  <span key={j} className={t.cls}>{t.ch}</span>
                ))}
              </code>
            </div>
          ))}
        </pre>
      </div>
      {caption && <p className="px-4 pb-3 text-xs text-[var(--dim)] sm:hidden">{caption}</p>}
    </figure>
  );
}
