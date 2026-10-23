import { useSiteSettings, Unavailable } from "../lib/siteSettings";
/* ============ MATERI HTML — dokumen .md per pertemuan, gaya HUD Selam ============
   Menggabung silabus 16x: tahap HTML memakai enam dokumen markdown di
   /content/html/*.md sebagai materi utama. Penampilannya mengikuti tema
   gambar HUD (home_hud.jfif / dashboard_hud.jfif): panel biru dalam dengan
   bracket sudut cyan, aksen teal/amber/koral, font display Baloo & mono. */
import { useMemo, useState } from "react";
import { CURRICULUM, PHASE_COLOR, getLesson } from "../data/curriculum";
import type { Lesson } from "../data/curriculum";
import { HTML_DOCS, getHtmlDoc } from "../data/materiHtml";
import { questId } from "../data/quests";
import type { SessionKind } from "../data/quests";
import type { SaveData } from "../lib/storage";
import { meetingLevel, meetingUnlocked, sessionPassed, LEVEL_NAME } from "../lib/progress";
import { parseMd } from "../lib/markdown";
import type { MdBlock } from "../lib/markdown";
import { getFigure } from "../lib/figures";
import type { Lang } from "../lib/highlight";
import { sfx } from "../lib/audio";
import { CodePanel } from "./Dashboard";
import {
  IconBook, IconCheck, IconKeyboard, IconStar, IconX, IconArrowL, IconArrowR, IconInfo,
} from "./icons";

const C_HTML = PHASE_COLOR.HTML;

interface Props {
  /** pertemuan yang dibuka pertama kali (dari peta); default pertemuan HTML pertama */
  startNo?: number;
  save: SaveData;
  /** id sesi: "q:<no>:<kind>" */
  onPractice: (id: string) => void;
  onExit: () => void;
}

/* ---------- renderer blok markdown ---------- */
function MdView({ blocks }: { blocks: MdBlock[] }) {
  return (
    <div className="md-body">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h": {
            const Tag = (`h${Math.min(b.level + 2, 6)}`) as "h3" | "h4" | "h5" | "h6";
            return (
              <Tag key={i} className={`md-h md-h${b.level}`}>
                {b.text}
              </Tag>
            );
          }
          case "p":
            return <p key={i} className="md-p anim-fadeUp" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "ul":
            return (
              <ul key={i} className="md-list space-y-2 anim-fadeUp">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <span className="md-bullet" aria-hidden="true" />
                    <span dangerouslySetInnerHTML={{ __html: it }} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="md-olist space-y-2 anim-fadeUp">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 items-start">
                    <span className="md-num">{j + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: it }} />
                  </li>
                ))}
              </ol>
            );
          case "code": {
            const lang: Lang = b.lang === "css" || b.lang === "js" ? b.lang : "html";
            return (
              <div key={i} className="anim-fadeUp">
                <CodePanel code={b.code} lang={lang} />
              </div>
            );
          }
          case "quote": {
            /* konvensi emoji callout selaras blok callout Ruang Materi:
               💡/✅ = tip (teal) · ⚠️/🚫 = warn (koral) · lainnya = fun (amber) */
            const tone = /💡|✅/.test(b.html) ? "tip" : /⚠️|🚫/.test(b.html) ? "warn" : "fun";
            const ic = tone === "tip" ? <IconInfo size={17} /> : tone === "warn" ? <IconX size={17} /> : <IconStar size={17} />;
            return (
              <blockquote key={i} className={`md-quote md-quote-${tone} anim-fadeUp`}>
                <span className="md-quote-ic">{ic}</span>
                <span dangerouslySetInnerHTML={{ __html: b.html.replace(/^[💡⚠️🚫✅🦈]\s*/, "") }} />
              </blockquote>
            );
          }
          case "hr":
            return <hr key={i} className="md-hr" />;
          case "img": {
            const fig = getFigure(b.key);
            if (fig) {
              return (
                <figure key={i} className="md-figure anim-fadeUp my-3">
                  <div className="md-figure-frame">{fig.node}</div>
                  <figcaption className="md-figure-cap">{b.alt || fig.caption}</figcaption>
                </figure>
              );
            }
            const src = b.src || b.key;
            if (src && (src.startsWith("/") || src.startsWith("http") || src.startsWith("./"))) {
              return (
                <figure key={i} className="md-figure anim-fadeUp my-3">
                  <div className="rounded-2xl overflow-hidden border border-sky-500/20 bg-slate-900/60 p-2 shadow-lg">
                    <img
                      src={src}
                      alt={b.alt || "Ilustrasi Materi"}
                      className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {b.alt && <figcaption className="md-figure-cap">{b.alt}</figcaption>}
                </figure>
              );
            }
            return null;
          }
          case "table":
            return (
              <div key={i} className="md-table-wrap anim-fadeUp">
                <table className="md-table">
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k} dangerouslySetInnerHTML={{ __html: c }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ---------- latihan ketik pertemuan: Quest · Drill · Juggling (lib/progress = satu sumber status) ---------- */
const KIND_LABEL: { kind: Exclude<SessionKind, "misi">; label: string }[] = [
  { kind: "quest", label: "Quest" },
  { kind: "drill", label: "Drill" },
  { kind: "juggle", label: "Juggling" },
];

function PracticeCard({ l, no, save, onPractice }: { l: Lesson; no: number; save: SaveData; onPractice: (id: string) => void }) {
  if (!l.practice) return null;
  const locked = !meetingUnlocked(save, no);
  const lv = meetingLevel(save, no);
  return (
    <section className="md-practice hud-panel p-5 sm:p-6 anim-fadeUp">
      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
        <span className="w-8 h-8 rounded-xl grid place-items-center shrink-0 bg-[rgba(255,194,71,0.14)] text-[var(--amber)] border border-[rgba(255,194,71,0.35)]">
          <IconKeyboard size={17} />
        </span>
        <h3 className="font-display font-extrabold text-lg text-[var(--amber)] m-0">
          Ajang Latihan — Pertemuan {no}
        </h3>
        <span className="chip ml-auto !text-[var(--amber)]">Level: {LEVEL_NAME[lv]}</span>
      </div>
      <p className="text-sm text-[var(--dim)] leading-relaxed mb-4">{l.practice.intro}</p>
      <div className="grid sm:grid-cols-3 gap-2.5">
        {KIND_LABEL.map((k) => {
          const id = questId(no, k.kind);
          const done = sessionPassed(save, id);
          return (
            <button
              key={k.kind}
              disabled={locked}
              onClick={() => { sfx.click(); onPractice(id); }}
              className="btn btn-amber justify-center !py-2.5 text-sm disabled:opacity-40"
            >
              <IconKeyboard size={15} /> {k.label} {done ? "✓" : ""}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[var(--faint)] mt-2.5">
        Quest = kode pertemuan ini (akurasi ≥ 90%). Drill = baris sintaks inti (≥ 90%). Juggling = drill dianyam dengan pertemuan sebelumnya (≥ 85%).
        {locked && " Selesaikan Perak di pertemuan sebelumnya untuk membuka."}
      </p>
    </section>
  );
}

/* ---------- layar utama ---------- */
export default function MateriHtml({ startNo, save, onPractice, onExit }: Props) {
  const htmlNos = CURRICULUM.filter((l) => l.phase === "HTML").map((l) => l.no);
  const settings = useSiteSettings();
  const [no, setNo] = useState(startNo && htmlNos.includes(startNo) ? startNo : htmlNos[0]);
  const doc = getHtmlDoc(no)!;
  const lesson = getLesson(no);
  const blocks = useMemo(
    () => parseMd(doc.source).filter((b) => !(b.t === "h" && b.level === 1)), // judul # sudah tampil di kepala panel
    [doc],
  );

  const idxInPhase = htmlNos.indexOf(no);
  const go = (n: number) => {
    sfx.click();
    setNo(Math.min(htmlNos[htmlNos.length - 1], Math.max(htmlNos[0], n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!settings.modules.html) return <Unavailable message="Modul HTML dinonaktifkan admin." retry={onExit} />;
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* topbar ala Ruang Materi */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(4,15,26,0.82)] border-b border-[var(--line-soft)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button className="btn btn-ghost !px-3 !py-2" onClick={onExit} aria-label="Kembali">
            <IconX size={17} />
          </button>
          <div className="leading-tight mr-auto">
            <p className="text-[10px] font-extrabold tracking-[0.22em] uppercase" style={{ color: C_HTML }}>
              Tahap HTML • Dokumen Materi
            </p>
            <p className="font-display font-bold">Materi HTML (.md)</p>
          </div>
          <div className="flex items-center gap-1.5">
            {HTML_DOCS.map((d) => (
              <span
                key={d.no}
                className={`h-2 rounded-full transition-all duration-300 ${d.no === no ? "w-7" : d.no < no ? "w-2 bg-[var(--teal)]" : "w-2 bg-[rgba(126,196,236,0.25)]"}`}
                style={d.no === no ? { background: C_HTML } : undefined}
              />
            ))}
          </div>
          <span className="chip">P{no}/6</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* pemilih dokumen per pertemuan */}
        <nav className="flex flex-wrap gap-1.5 mb-6" aria-label="Pilih dokumen materi">
          {HTML_DOCS.map((d) => {
            const active = d.no === no;
            return (
              <button
                key={d.no}
                onClick={() => go(d.no)}
                title={d.title}
                className={`px-3 py-2 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-2 ${active ? "scale-[1.03]" : "opacity-70 hover:opacity-100"}`}
                style={{
                  background: active ? `${C_HTML}22` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${active ? C_HTML : "rgba(126,196,236,0.14)"}`,
                  color: active ? C_HTML : "var(--dim)",
                }}
              >
                P{d.no}
                <span className="hidden sm:inline normal-case font-bold">{d.title.split("—")[1]?.trim().slice(0, 22) ?? d.title}</span>
              </button>
            );
          })}
        </nav>

        <article key={doc.no} className="screen-in space-y-6">
          {/* kepala dokumen — bingkai HUD sesuai tema gambar */}
          <div className="hud-panel px-5 sm:px-7 py-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip shrink-0" style={{ background: `${C_HTML}1d`, color: C_HTML, border: `1px solid ${C_HTML}4d` }}>
                <IconBook size={13} /> Pertemuan {doc.no} dari 6
              </span>
              <span className="chip shrink-0 !text-[var(--faint)]">{doc.file}</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl mt-3 mb-2 leading-tight">{doc.title}</h1>
            <p className="text-sm text-[var(--dim)]">{lesson.goal}</p>
          </div>

          {/* isi markdown */}
          <MdView blocks={blocks} />

          {/* latihan ketik pertemuan ini */}
          <PracticeCard l={lesson} no={no} save={save} onPractice={onPractice} />

          {/* navigasi antar dokumen */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              className="btn btn-ghost px-5 py-2.5"
              onClick={() => (idxInPhase === 0 ? onExit() : go(no - 1))}
            >
              <IconArrowL size={17} /> {idxInPhase === 0 ? "Keluar" : `P${no - 1}`}
            </button>
            <span className="chip !text-[var(--teal)]">
              <IconCheck size={13} /> Baca → pahami → gladi ketik
            </span>
            {idxInPhase < htmlNos.length - 1 ? (
              <button className="btn btn-primary px-6 py-2.5" onClick={() => go(no + 1)}>
                P{no + 1} <IconArrowR size={17} />
              </button>
            ) : (
              <button className="btn btn-primary px-5 py-2.5" onClick={onExit}>
                <IconCheck size={16} /> Siap UTS!
              </button>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
