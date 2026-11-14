/* ============ BABAK 2 — "THE SIDE-BY-SIDE REALITY MIRROR" ============
   Diagnosis "AI-Dependency & Cognitive Debt" (docs/053 bagian 6):
   putar ulang ketikan → kalkulator pembanding AI → peta panas keyboard →
   angka pendukung → pembongkaran jebakan.

   Aturan isi: setiap angka tentang mahasiswa adalah angka TERUKUR miliknya;
   angka tentang AI berasal dari data/aiBenchmark.ts dan selalu tampil bersama
   asumsinya; kalimat keras hanya muncul bila hasilnya memang gagal. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AiTrapAttempt, TrapEvent } from "../lib/trapMetrics";
import { applyEdit, buildReplay, FREEZE_MS, MIN_HEATMAP_KEYS, MAX_LOGGED_ATTEMPTS } from "../lib/trapMetrics";
import type { TrapScenario } from "../data/aiTrapScenarios";
import { trapLine } from "../data/aiTrapScenarios";
import { AI_BENCHMARK } from "../data/aiBenchmark";
import KeyboardHeatmap from "./KeyboardHeatmap";
import { IconArrowR, IconCheck, IconPlay, IconRetry, IconX } from "./icons";

const sec = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} dtk`;
const whole = (ms: number) => `${Math.round(ms / 1000)} detik`;
const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const LANG_LABEL = { html: "HTML", css: "CSS", js: "JavaScript" } as const;

interface Copy {
  tone: "ok" | "warn" | "bad";
  title: string;
  lead: string;
  punch: string;
  economy: string;
  closing: string;
}

function copyOf(a: AiTrapAttempt, sc: TrapScenario): Copy {
  const t = whole(a.durationMs);
  const n = a.fixed.length;
  const N = a.trapTotal;
  const d = a.metrics.domino;
  const added = d > 0 ? `, dan menambah ${d} kerusakan baru dengan tanganmu sendiri` : "";
  const lines = sc.code.trimEnd().split("\n").length;
  const cheap = `Menulis kode sekarang murah: ${AI_BENCHMARK.timeLabel}, ${AI_BENCHMARK.costLabel} per permintaan.`;

  if (a.outcome === "pulih") {
    return {
      tone: "ok",
      title: "PRODUKSI PULIH",
      lead: `Kamu memulihkan sistem dalam ${t} — tanpa AI, tanpa autocomplete, tanpa tempel.`,
      punch: "Membaca kode buatan pihak lain, menemukan cacatnya, lalu memperbaikinya dengan tangan sendiri: itu yang baru saja kamu lakukan.",
      economy: `${cheap} Yang mahal adalah memeriksanya — dan bagian itu baru saja kamu kerjakan sendiri. Itulah bagian pekerjaan yang tidak ikut menjadi murah.`,
      closing: "Latihan reguler akan menajamkan kecepatanmu: mata yang memindai sintaks per karakter dan jari yang hafal letak simbol.",
    };
  }
  if (a.outcome === "sebagian") {
    return {
      tone: "warn",
      title: "PRODUKSI MASIH DOWN",
      lead: `Kamu memperbaiki ${n} dari ${N} cacat${added}. Saat sesi berakhir di ${t}, sistem tetap tidak berfungsi.`,
      punch: `Di produksi tidak ada nilai “hampir”. Pelanggan tidak bisa menekan tombol yang ${Math.round((n / N) * 100)}% benar.`,
      economy: `${cheap} Yang mahal adalah memeriksanya sampai tuntas. Kamu sudah bisa memeriksa sebagian — tetapi yang dibayar adalah sistem yang hidup, bukan perbaikan setengah jalan.`,
      closing: "Dua hal yang kurang hari ini bisa dilatih: mata yang memindai sintaks per karakter dan jari yang hafal letak simbol. Latihan reguler melatih persis dua hal itu.",
    };
  }
  return {
    tone: "bad",
    title: "PRODUKSI TETAP DOWN",
    lead:
      n === 0
        ? `${t} berlalu dan tidak satu pun dari ${N} cacat berhasil kamu perbaiki${added}.`
        : `${t} berlalu. Kamu hanya memperbaiki ${n} dari ${N} cacat${added}.`,
    punch: `Kode itu sudah hampir seluruhnya jadi. Yang diminta darimu hanya membaca ${lines} baris dan mengetik sekitar ${sc.fixChars} karakter.`,
    economy: `${cheap} Kalau yang kamu bawa ke tim hanya kemampuan meminta lalu menyalin jawaban AI, pekerjaan itu sudah bisa dibeli ${AI_BENCHMARK.costLabel} per permintaan — tanpa kamu. Yang masih mahal adalah orang yang sanggup memeriksa hasilnya. Hari ini, orang itu belum kamu.`,
    closing: "Dua hal yang gagal hari ini bisa dilatih: mata yang memindai sintaks per karakter dan jari yang hafal letak simbol. Latihan reguler melatih persis dua hal itu.",
  };
}

function confidenceLine(a: AiTrapAttempt): string {
  const c = a.confidence;
  const head = `Sebelum mulai, kamu menilai keyakinanmu ${c} dari 5.`;
  if (a.outcome === "pulih") return `${head} ${c >= 4 ? "Keyakinan itu terbukti." : "Hasilmu lebih baik daripada dugaanmu sendiri."}`;
  if (c >= 4) return `${head} Selisih antara angka itu dan hasil di atas punya nama: ilusi kompetensi. Berapa banyak dari rasa bisa itu sebenarnya milikmu, dan berapa yang selama ini dipinjam dari AI?`;
  return `${head} Penilaianmu jujur. Sekarang kamu punya angkanya.`;
}

const TONE = {
  ok: { color: "var(--teal)", border: "rgba(46,230,200,0.5)", glow: "rgba(46,230,200,0.18)" },
  warn: { color: "var(--amber)", border: "rgba(255,194,71,0.55)", glow: "rgba(255,194,71,0.16)" },
  bad: { color: "var(--coral)", border: "rgba(255,107,87,0.6)", glow: "rgba(255,107,87,0.2)" },
} as const;

/* ============ PUTAR ULANG ============ */

function GhostReplay({ initial, events, durationMs }: { initial: string; events: TrapEvent[]; durationMs: number }) {
  const replay = useMemo(() => buildReplay(events, durationMs), [events, durationMs]);
  const totals = useMemo(() => {
    let dels = 0;
    let freezes = 0;
    for (const f of replay.frames) {
      if (f.kind === "edit" && f.del > 0 && f.ins === "") dels += 1;
      if (f.freezeMs > 0) freezes += 1;
    }
    if (replay.tailFreezeMs > 0) freezes += 1;
    return { dels, freezes };
  }, [replay]);

  const [view, setView] = useState({ text: initial, caret: -1, dels: 0, freezes: 0, freezeNow: 0, deleting: false, realT: 0, progress: 0, playing: false, done: false });
  const raf = useRef(0);
  const boxRef = useRef<HTMLPreElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const play = () => {
    cancelAnimationFrame(raf.current);
    let text = initial;
    let caret = -1;
    let idx = 0;
    let dels = 0;
    let freezes = 0;
    let deleting = false;
    let realT = 0;
    const started = performance.now();
    const tick = () => {
      const elapsed = performance.now() - started;
      while (idx < replay.frames.length && replay.frames[idx].at <= elapsed) {
        const f = replay.frames[idx];
        if (f.kind === "edit") {
          text = applyEdit(text, f.pos, f.del, f.ins);
          caret = f.pos + f.ins.length;
          deleting = f.del > 0 && f.ins === "";
          if (deleting) dels += 1;
        }
        if (f.freezeMs > 0) freezes += 1;
        realT = f.realT;
        idx += 1;
      }
      const next = replay.frames[idx];
      const done = elapsed >= replay.totalMs;
      setView({
        text, caret, dels, deleting,
        freezes: freezes + (done && replay.tailFreezeMs > 0 ? 1 : 0),
        freezeNow: done ? 0 : next ? next.freezeMs : replay.tailFreezeMs,
        realT: done ? durationMs : realT,
        progress: Math.min(1, elapsed / Math.max(1, replay.totalMs)),
        playing: !done, done,
      });
      if (!done) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && replay.frames.length) play();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replay]);

  /* ikuti kursor tanpa menggulir halaman */
  useLayoutEffect(() => {
    const box = boxRef.current;
    const caret = caretRef.current;
    if (!box || !caret) return;
    const top = caret.offsetTop - box.clientHeight / 2;
    box.scrollTop = Math.max(0, top);
  }, [view.caret, view.text]);

  if (!replay.frames.some((f) => f.kind === "edit")) {
    return (
      <p className="text-sm text-[var(--ink)]">
        Tidak ada ketikan yang terekam. Selama {whole(durationMs)} kamu tidak mengubah satu karakter pun pada kode itu.
      </p>
    );
  }

  const caret = view.caret < 0 ? 0 : view.caret;
  const frozen = view.freezeNow > 0;

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <button type="button" className="btn btn-ghost !px-3 !py-1.5 text-sm" onClick={play}>
          {view.done || !view.playing ? <IconPlay size={15} /> : <IconRetry size={15} />} {view.playing ? "Ulang dari awal" : "Putar ulang"}
        </button>
        <span className="chip font-code">{clock(view.realT)} / {clock(durationMs)}</span>
        <span className="chip" style={{ color: view.deleting && view.playing ? "var(--coral)" : undefined }}>
          ⌫ hapus {view.dels}/{totals.dels}
        </span>
        <span className="chip" style={{ color: frozen ? "var(--coral)" : undefined }}>
          ❄ beku {view.freezes}/{totals.freezes}
        </span>
        {frozen && (
          <span className="trap-freeze-badge" aria-live="off">MEMBEKU {sec(view.freezeNow)}</span>
        )}
      </div>
      <pre ref={boxRef} className={`trap-replay font-code ${frozen ? "is-frozen" : ""}`} aria-label="Putar ulang ketikan">
        {view.text.slice(0, caret)}
        <span ref={caretRef} className={`trap-replay-caret ${frozen ? "frozen" : view.deleting ? "deleting" : ""}`} />
        {view.text.slice(caret)}
      </pre>
      <div className="h-1.5 rounded-full bg-[rgba(4,16,28,0.9)] overflow-hidden mt-2" aria-hidden="true">
        <div className="h-full bg-[var(--cyan)]" style={{ width: `${view.progress * 100}%` }} />
      </div>
      <p className="text-[11px] text-[var(--faint)] font-semibold mt-1.5">
        {whole(durationMs)} dipadatkan menjadi ±{Math.round(replay.totalMs / 1000)} detik. Setiap diam {FREEZE_MS / 1000} detik atau lebih ditahan sejenak dan diberi label durasi aslinya.
      </p>
    </div>
  );
}

/* ============ DIAGNOSIS ============ */

function Tile({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="panel-flat p-3.5">
      <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)]">{label}</p>
      <p className="font-display font-extrabold text-3xl leading-tight mt-1" style={{ color: color ?? "#fff" }}>{value}</p>
      {sub && <p className="text-[11px] font-semibold text-[var(--dim)] mt-0.5">{sub}</p>}
    </div>
  );
}

function Fact({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-[var(--line-soft)]">
      <dt className="text-[13px] text-[var(--dim)]">{label}</dt>
      <dd className="font-code text-[13px] font-bold text-right" style={{ color: alert ? "var(--coral)" : "var(--ink)" }}>{value}</dd>
    </div>
  );
}

function Section({ no, title, sub, children }: { no: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5 md:p-6">
      <header className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-[var(--cyan)]">Cermin {no}</p>
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-white leading-tight">{title}</h3>
        {sub && <p className="text-sm text-[var(--dim)] mt-1">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

interface Props {
  attempt: AiTrapAttempt;
  scenario: TrapScenario;
  onContinue?: () => void;
  continueLabel?: string;
}

export default function AiTrapDiagnostic({ attempt: a, scenario: sc, onContinue, continueLabel }: Props) {
  const copy = copyOf(a, sc);
  const tone = TONE[copy.tone];
  const m = a.metrics;
  const enoughKeys = m.contiguousKeys >= MIN_HEATMAP_KEYS;
  const endLabel = a.endedBy === "timeout" ? "waktu habis" : a.endedBy === "recovered" ? "sistem pulih" : "diakhiri sendiri";
  const integrity: string[] = [];
  if (m.pasteAttempts > 0) integrity.push(`${m.pasteAttempts} upaya tempel ditolak`);
  if (m.rejectedInserts > 0) integrity.push(`${m.rejectedInserts} sisipan otomatis ditolak`);
  if (m.blurCount > 0) integrity.push(`${m.blurCount} kali keluar jendela (total ${sec(m.blurMs)})`);

  return (
    <div className="space-y-5">
      {/* ---------- vonis ---------- */}
      <section className="panel p-5 md:p-7 screen-in" style={{ borderColor: tone.border, boxShadow: `0 0 0 1px ${tone.border}, 0 24px 60px ${tone.glow}` }}>
        <p className="text-[10px] uppercase tracking-[0.24em] font-extrabold text-[var(--dim)]">
          Diagnosis utang kognitif • {sc.title}
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-none mt-2" style={{ color: tone.color }}>
          {copy.title}
        </h2>
        <p className="text-base md:text-lg text-white font-bold mt-3">{copy.lead}</p>
        <p className="text-sm md:text-base text-[var(--ink)] mt-2">{copy.punch}</p>
        <p className="text-sm text-[var(--dim)] mt-3 pt-3 border-t border-[var(--line-soft)]">{confidenceLine(a)}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <Tile label="Cacat diperbaiki" value={`${a.fixed.length}/${a.trapTotal}`} sub={`pemeriksaan lulus ${a.checksOk}/${a.checksTotal}`} color={tone.color} />
          <Tile label="Waktu" value={`${Math.round(a.durationMs / 1000)} dtk`} sub={endLabel} />
          <Tile label="Kerusakan baru" value={String(m.domino)} sub="efek domino dari suntinganmu" color={m.domino > 0 ? "var(--coral)" : undefined} />
          <Tile
            label="Tombol lumpuh"
            value={enoughKeys ? String(m.slowKeys.length) : "—"}
            sub={enoughKeys ? "jeda > 2 detik di tengah mengetik" : "ketikan terlalu sedikit"}
            color={enoughKeys && m.slowKeys.length > 0 ? "var(--coral)" : undefined}
          />
        </div>
        {a.lastError && (
          <p className="font-code text-[12px] text-[var(--coral)] mt-4 break-words">
            Error terakhir di konsol: {a.lastError}
          </p>
        )}
      </section>

      {/* ---------- 1 putar ulang ---------- */}
      <Section no={1} title="Putar ulang ketikanmu" sub="Lihat sendiri di mana kursormu membeku dan berapa kali kamu menghapus.">
        {a.log && a.log.length ? (
          <GhostReplay initial={sc.code} events={a.log} durationMs={a.durationMs} />
        ) : a.log ? (
          <p className="text-sm text-[var(--ink)]">
            Tidak ada ketikan yang terekam. Selama {whole(a.durationMs)} kamu tidak mengubah satu karakter pun pada kode itu.
          </p>
        ) : (
          <p className="text-sm text-[var(--dim)]">
            Rekaman ketikan percobaan ini sudah tidak disimpan. Putar ulang hanya tersedia untuk {MAX_LOGGED_ATTEMPTS} percobaan terbaru.
          </p>
        )}
      </Section>

      {/* ---------- 2 kalkulator ---------- */}
      <Section no={2} title="Kamu dan AI, berdampingan" sub="Kiri: yang dikerjakan mesin. Kanan: yang tadi diminta darimu.">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="panel-flat p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[var(--cyan)]">Asisten AI — menulis kodenya</p>
            <dl className="mt-2">
              <Fact label="Waktu" value={AI_BENCHMARK.timeLabel} />
              <Fact label="Biaya per permintaan" value={AI_BENCHMARK.costLabel} />
              <Fact label="Memeriksa hasilnya sendiri" value="tidak" />
            </dl>
            <p className="text-[11px] text-[var(--faint)] mt-2.5 leading-relaxed">{AI_BENCHMARK.basis}</p>
          </div>
          <div className="panel-flat p-4" style={{ borderColor: tone.border }}>
            <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold" style={{ color: tone.color }}>Kamu — memeriksa dan memperbaikinya</p>
            <dl className="mt-2">
              <Fact label="Waktu" value={`${Math.round(a.durationMs / 1000)} detik (${endLabel})`} />
              <Fact label="Cacat diperbaiki" value={`${a.fixed.length} dari ${a.trapTotal}`} alert={a.fixed.length < a.trapTotal} />
              <Fact label="Kerusakan baru" value={String(m.domino)} alert={m.domino > 0} />
              <Fact label="Status produksi" value={a.recovered ? "PULIH" : "DOWN"} alert={!a.recovered} />
            </dl>
          </div>
        </div>
        <p className="text-sm md:text-base text-[var(--ink)] mt-4 leading-relaxed">{copy.economy}</p>
      </Section>

      {/* ---------- 3 peta panas ---------- */}
      <Section no={3} title="Titik lumpuh motorik" sub="Tombol tempat jarimu berhenti lebih dari 2 detik di tengah mengetik.">
        <KeyboardHeatmap keys={m.keys} contiguousKeys={m.contiguousKeys} slowKeys={m.slowKeys} />
        {enoughKeys && m.slowKeys.length > 0 && (
          <p className="text-sm text-[var(--dim)] mt-3 leading-relaxed">
            Jeda seperti ini konsisten dengan perhatian yang tersedot untuk mencari tombol. Perhatian yang sedang mencari tombol
            tidak sedang memikirkan logika.
          </p>
        )}
        <p className="text-[11px] text-[var(--faint)] mt-2">
          Hanya jeda di tengah rangkaian mengetik yang dihitung. Jeda setelah memindahkan kursor, menjalankan kode, atau keluar
          jendela tidak masuk peta ini, karena saat itu kamu sedang membaca, bukan mencari tombol.
        </p>
      </Section>

      {/* ---------- 4 angka pendukung ---------- */}
      <Section no={4} title="Angka di balik layar">
        <dl className="grid md:grid-cols-2 gap-x-8">
          <Fact label="Membaca sebelum aksi pertama" value={m.firstActionMs === null ? "tidak ada aksi" : sec(m.firstActionMs)} />
          <Fact label="Jeda setelah pesan error (median)" value={m.scanAfterRunMs === null ? "—" : sec(m.scanAfterRunMs)} />
          <Fact label="Membeku ≥ 5 detik" value={`${m.freezes} kali (total ${sec(m.frozenMs)})`} alert={m.frozenMs > a.durationMs * 0.4} />
          <Fact label="Beku terlama" value={m.longestFreezeMs ? sec(m.longestFreezeMs) : "—"} />
          <Fact label="Menghapus" value={`${m.corrections} kali (rentetan terpanjang ${m.longestDeleteStreak})`} />
          <Fact label="Karakter diketik" value={String(m.charsTyped)} />
          <Fact label="Menjalankan kode" value={`${m.runs} kali`} />
          <Fact label="Suntingan di baris yang tidak rusak" value={`${m.offTargetBursts} dari ${m.editBursts}`} alert={m.offTargetBursts > 0} />
        </dl>
        {integrity.length > 0 && (
          <p className="text-[13px] text-[var(--amber)] font-bold mt-3">Catatan integritas: {integrity.join("; ")}.</p>
        )}
      </Section>

      {/* ---------- 5 pembongkaran ---------- */}
      <Section no={5} title="Pembongkaran jebakan">
        <p className="text-sm text-[var(--ink)] leading-relaxed mb-4">
          Kode tadi <strong>bukan</strong> keluaran AI sungguhan. Keempat cacat di bawah ini sengaja ditanam tim CodeShark, meniru
          kesalahan yang benar-benar terjadi ketika kode — dari AI maupun dari mana pun — disalin dan dirilis tanpa dibaca.
        </p>
        <ol className="space-y-3">
          {sc.traps.map((t, i) => {
            const ok = a.fixed.includes(t.id);
            return (
              <li key={t.id} className="panel-flat p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center shrink-0"
                    style={{ background: ok ? "rgba(46,230,200,0.15)" : "rgba(255,107,87,0.16)", color: ok ? "var(--teal)" : "var(--coral)" }}
                  >
                    {ok ? <IconCheck size={15} /> : <IconX size={14} />}
                  </span>
                  <p className="font-display font-extrabold text-white mr-auto">{i + 1}. {t.title}</p>
                  <span className="chip">{LANG_LABEL[t.lang]} • baris {trapLine(sc, t)}</span>
                  <span className="chip" style={{ color: ok ? "var(--teal)" : "var(--coral)" }}>{ok ? "kamu perbaiki" : "lolos dari matamu"}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-2 mt-3">
                  <pre className="trap-diff trap-diff-bad font-code">{t.before}</pre>
                  <pre className="trap-diff trap-diff-good font-code">{t.after}</pre>
                </div>
                <p className="text-[13px] text-[var(--dim)] mt-2.5 leading-relaxed">{t.reveal}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* ---------- penutup ---------- */}
      <section className="panel p-5 md:p-6 text-center">
        <p className="text-base text-[var(--ink)] max-w-2xl mx-auto leading-relaxed">{copy.closing}</p>
        <p className="text-[12px] text-[var(--faint)] mt-2">Hasil simulasi ini tidak memengaruhi nilai, rank, maupun koin.</p>
        {onContinue && (
          <button type="button" className="btn btn-primary px-7 py-3.5 text-base mt-5" onClick={onContinue}>
            {continueLabel ?? "Mulai latihan reguler"} <IconArrowR size={18} />
          </button>
        )}
      </section>
    </div>
  );
}
