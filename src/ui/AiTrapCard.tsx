/* Kartu Dashboard untuk AI-Trap Simulator (Tahap 1 – Pemicu).
   Hanya tampil untuk kelompok usia yang relevan (lihat trapVisibleFor). */
import type { SaveData } from "../lib/storage";
import { TRAP_REQUIRED_AGES, getTrapScenario, trapVisibleFor } from "../data/aiTrapScenarios";
import { sfx } from "../lib/audio";
import { IconArrowR, IconEye, IconRetry } from "./icons";

interface Props {
  save: SaveData;
  isTouch: boolean;
  onStart: () => void;
  onHistory: () => void;
}

const OUTCOME = {
  pulih: { label: "PRODUKSI PULIH", color: "var(--teal)" },
  sebagian: { label: "PRODUKSI MASIH DOWN", color: "var(--amber)" },
  gagal: { label: "PRODUKSI TETAP DOWN", color: "var(--coral)" },
} as const;

export default function AiTrapCard({ save, isTouch, onStart, onHistory }: Props) {
  const age = save.profile?.age;
  if (!trapVisibleFor(age)) return null;
  const attempts = save.aiTrap?.attempts ?? [];
  const last = attempts.at(-1);
  const required = !!age && TRAP_REQUIRED_AGES.includes(age);

  return (
    <section className="mt-8 reveal" aria-labelledby="ai-trap-card-title">
      <div className="panel p-5 md:p-6" style={{ borderColor: "rgba(255,107,87,0.4)" }}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="min-w-0 flex-1 basis-72">
            <p className="trap-incident-label"><i /> TAHAP 1 • PEMICU</p>
            <h2 id="ai-trap-card-title" className="font-display font-extrabold text-2xl text-white leading-tight mt-2">
              Simulasi Krisis Produksi
            </h2>
            {last ? (
              <p className="text-sm text-[var(--ink)] mt-2">
                Hasil terakhir:{" "}
                <strong style={{ color: OUTCOME[last.outcome].color }}>{OUTCOME[last.outcome].label}</strong>
                {" "}— {last.fixed.length} dari {last.trapTotal} cacat diperbaiki dalam {Math.round(last.durationMs / 1000)} detik
                {getTrapScenario(last.scenarioId) ? ` (${getTrapScenario(last.scenarioId)!.title})` : ""}.
                {" "}{attempts.length} percobaan tersimpan.
              </p>
            ) : isTouch ? (
              <p className="text-sm text-[var(--ink)] mt-2">
                Kerjakan di laptop. Simulasi ini mengukur mata dan jarimu pada keyboard fisik; keyboard HP tidak menghasilkan
                data yang sahih. Latihan Coding Tower tetap bisa kamu mainkan di sini.
              </p>
            ) : (
              <p className="text-sm text-[var(--ink)] mt-2">
                Sebuah fitur down di produksi. Kode perbaikannya “sudah dibuatkan AI” — tinggal kamu periksa dan perbaiki dalam
                3 menit, tanpa AI, tanpa autocomplete, tanpa tempel.
                {required && !save.aiTrap?.deferred ? " Wajib satu kali sebelum latihan pertama." : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {last && (
              <button type="button" className="btn btn-ghost px-4 py-2.5 text-sm" onClick={() => { sfx.click(); onHistory(); }}>
                <IconEye size={16} /> Diagnosis &amp; riwayat
              </button>
            )}
            {!isTouch && (
              <button type="button" className="btn btn-coral px-5 py-2.5" onClick={() => { sfx.click(); onStart(); }}>
                {last ? <><IconRetry size={16} /> Ulangi simulasi</> : <>Mulai simulasi <IconArrowR size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
