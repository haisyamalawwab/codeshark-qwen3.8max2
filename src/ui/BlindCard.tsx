/* Kartu Dashboard "Rapor Kegagapan" untuk Blind Live-Coding Challenge (docs/052).
   Hanya tampil untuk kelompok usia yang relevan (lihat blindVisibleFor). */
import type { SaveData } from "../lib/storage";
import { BLIND_REQUIRED_AGES, blindVisibleFor, getBlindBrief } from "../data/blindChallenges";
import { sfx } from "../lib/audio";
import { BLIND_LEVEL_COLOR, BLIND_LEVEL_LABEL } from "../lib/blindMetrics";
import { IconArrowR, IconEye, IconKeyboard, IconRetry } from "./icons";

interface Props {
  save: SaveData;
  /** tanpa keyboard fisik: tantangan ditunda ("Kerjakan di laptop") */
  noKeyboard: boolean;
  onStart: () => void;
  onHistory: () => void;
}

export default function BlindCard({ save, noKeyboard, onStart, onHistory }: Props) {
  const age = save.profile?.age;
  if (!blindVisibleFor(age)) return null;
  const attempts = save.blind?.attempts ?? [];
  const last = attempts.at(-1);
  const required = !!age && BLIND_REQUIRED_AGES.includes(age);
  const lastErrors = last ? last.syntaxErrors.filter((e) => !e.unfinished).length : 0;

  return (
    <section className="mt-8 reveal" aria-labelledby="blind-card-title">
      <div className="panel p-5 md:p-6" style={{ borderColor: "rgba(69,198,255,0.4)" }}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="min-w-0 flex-1 basis-72">
            <p className="blind-label"><IconKeyboard size={14} /> TAHAP 1 • PEMICU</p>
            <h2 id="blind-card-title" className="font-display font-extrabold text-2xl text-white leading-tight mt-2">
              Rapor Kegagapan Sintaksis
            </h2>
            {last ? (
              <p className="text-sm text-[var(--ink)] mt-2">
                Rapor terakhir:{" "}
                <strong style={{ color: BLIND_LEVEL_COLOR[last.level] }}>{BLIND_LEVEL_LABEL[last.level].toUpperCase()}</strong>
                {" "}— {last.braceHesitations + last.semicolonHesitations} jeda panjang sebelum {"{ }"} dan ;, {lastErrors} syntax error,{" "}
                {last.specPassed} dari {last.specTotal} tuntutan terpenuhi
                {getBlindBrief(last.briefId) ? ` (${getBlindBrief(last.briefId)!.title})` : ""}.
                {" "}{attempts.length} rapor tersimpan.
              </p>
            ) : noKeyboard ? (
              <p className="text-sm text-[var(--ink)] mt-2">
                Kerjakan di laptop. Blind Live-Coding Challenge mengukur jeda jarimu sebelum simbol pada keyboard fisik; keyboard HP
                tidak menghasilkan data yang sahih. Latihan Coding Tower tetap bisa kamu mainkan di sini.
              </p>
            ) : (
              <p className="text-sm text-[var(--ink)] mt-2">
                Blind Live-Coding Challenge: 3 menit menulis HTML, CSS, dan JavaScript dari halaman kosong. Tanpa kode contoh, tanpa
                pewarnaan sintaks, tanpa autocomplete, tanpa tempel.
                {required && !save.blind?.deferred ? " Wajib satu kali sebelum latihan pertama." : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {last && (
              <button type="button" className="btn btn-ghost px-4 py-2.5 text-sm" onClick={() => { sfx.click(); onHistory(); }}>
                <IconEye size={16} /> Lihat rapor
              </button>
            )}
            {!noKeyboard && (
              <button type="button" className="btn btn-primary px-5 py-2.5" onClick={() => { sfx.click(); onStart(); }}>
                {last ? <><IconRetry size={16} /> Ulangi tantangan</> : <>Mulai tantangan <IconArrowR size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
