/* ============ RAPOR KEGAGAPAN SINTAKSIS ============
   Blind Live-Coding Challenge — rancangan: docs/052 bagian 7.

   Aturan isi: setiap angka adalah hasil ukur sesi itu; aturan tingkat ditampilkan
   apa adanya; kalimat keras hanya muncul bila angkanya memang buruk (D4); setiap
   penutup memberi arah tindakan. */
import type { BlindAttempt, BlindLevel } from "../lib/blindMetrics";
import {
  BLIND_FREEZE_MS, BLIND_LEVEL_COLOR, BLIND_LEVEL_LABEL, HESITATION_FACTOR, HESITATION_MIN_MS, LEVEL_RULES, TIMELINE_BUCKET_MS,
} from "../lib/blindMetrics";
import type { BlindBrief } from "../data/blindChallenges";
import { IconArrowR, IconCheck, IconX } from "./icons";

const sec1 = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} dtk`;
const whole = (s: number) => {
  const r = Math.round(s);
  return r >= 60 ? `${Math.floor(r / 60)} menit${r % 60 ? ` ${r % 60} detik` : ""}` : `${r} detik`;
};
const pct = (x: number) => `${Math.round(x * 100)}%`;
const dateLabel = (at: number) =>
  new Date(at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const REGION_LABEL = { html: "HTML", css: "CSS", js: "JavaScript" } as const;
const CONFIDENCE = ["", "tidak yakin", "kurang yakin", "cukup yakin", "yakin", "sangat yakin"];

const LEVEL: Record<BlindLevel, { title: string; color: string; border: string; glow: string }> = {
  lancar: { title: "LANCAR", color: "var(--teal)", border: "rgba(46,230,200,0.5)", glow: "rgba(46,230,200,0.18)" },
  tersendat: { title: "TERSENDAT", color: "var(--amber)", border: "rgba(255,194,71,0.55)", glow: "rgba(255,194,71,0.16)" },
  "gagap-berat": { title: "GAGAP BERAT", color: "var(--coral)", border: "rgba(255,107,87,0.6)", glow: "rgba(255,107,87,0.2)" },
};

interface Numbers {
  finished: number;
  unfinished: number;
  hesitations: number;
  frozenShare: number;
}

const numbersOf = (a: BlindAttempt): Numbers => {
  const unfinished = a.syntaxErrors.filter((e) => e.unfinished).length;
  return {
    finished: a.syntaxErrors.length - unfinished,
    unfinished,
    hesitations: a.braceHesitations + a.semicolonHesitations + a.otherSymbolHesitations,
    frozenShare: a.durationSec > 0 ? Math.min(1, a.frozenMs / (a.durationSec * 1000)) : 0,
  };
};

function leadOf(a: BlindAttempt, n: Numbers): string {
  const dur = whole(a.durationSec);
  if (a.chars === 0) return `${dur} berlalu dan tidak ada satu karakter pun yang tertulis.`;
  if (a.chars < LEVEL_RULES.minChars) return `Dalam ${dur} hanya ${a.chars} karakter yang tertulis.`;
  const parts = [
    n.finished === 0 ? "tanpa syntax error" : `${n.finished} syntax error`,
    `${n.hesitations} jeda panjang sebelum simbol`,
    `${pct(n.frozenShare)} waktu tanpa ketikan`,
  ];
  return `Dalam ${dur}: ${parts[0]}, ${parts[1]}, dan ${parts[2]}.`;
}

function closingOf(a: BlindAttempt, n: Numbers): string {
  if (a.level === "lancar") {
    const spec = a.specPassed === a.specTotal
      ? "Semua tuntutan soal juga terpenuhi."
      : `Tetapi tuntutan soal yang terpenuhi baru ${a.specPassed} dari ${a.specTotal}: sintaksnya benar, isinya belum sesuai soal.`;
    return `Sintaksmu bersih dan jarimu tidak tersendat di simbol. ${spec} Pakai latihan reguler untuk mengejar kecepatan, lalu ulangi tantangan ini dengan soal lain.`;
  }
  if (a.level === "tersendat") {
    const what = [
      n.finished > 0 ? `${n.finished} syntax error` : "",
      n.hesitations > 0 ? `${n.hesitations} jeda panjang sebelum simbol` : "",
      n.frozenShare >= LEVEL_RULES.fluentFrozenShare ? `${pct(n.frozenShare)} waktu tanpa ketikan` : "",
    ].filter(Boolean).join(", ");
    return `Kamu bisa menulisnya, tetapi belum mulus: masih ada ${what || "bagian yang tersendat"}. Drill tiap pertemuan melatih simbol-simbol itu satu per satu. Ulangi tantangan ini setelah beberapa pertemuan dan bandingkan rapornya.`;
  }
  if (a.chars < LEVEL_RULES.minChars) {
    return "Tanpa kode contoh di layar, sintaks dasarnya belum keluar dari tanganmu sendiri. Itu bisa dilatih. Mulai dari Drill pertemuan 1: ketik tiap baris sampai kamu bisa menuliskannya tanpa melihat, lalu ulangi tantangan ini dari Dashboard.";
  }
  return "Angka di atas menunjukkan hal yang sama dari beberapa sisi: tanpa contoh dan tanpa bantuan, sintaks dasar belum bisa kamu tulis dengan lancar. Itu bisa dilatih. Kerjakan Drill dan Quest tiap pertemuan, lalu ulangi tantangan ini dari Dashboard dan bandingkan rapornya.";
}

/* ---------- bagian kecil ---------- */

/** pesan pemeriksa menandai simbol dengan backtick: tampilkan sebagai <code> */
function Message({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) => (i % 2 ? <code key={i} className="blind-sym">{part}</code> : part))}
    </>
  );
}

function Tile({ label, value, sub, alert }: { label: string; value: string; sub: string; alert: boolean }) {
  return (
    <div className="panel-flat p-3.5">
      <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[var(--faint)]">{label}</p>
      <p className="font-display font-extrabold text-3xl leading-tight mt-1" style={{ color: alert ? "var(--coral)" : "#fff" }}>{value}</p>
      <p className="text-[11px] font-semibold text-[var(--dim)] mt-0.5">{sub}</p>
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

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5 md:p-6">
      <header className="mb-4">
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-white leading-tight">{title}</h3>
        {sub && <p className="text-sm text-[var(--dim)] mt-1">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

/* ---------- garis waktu (SVG polos) ---------- */

function Timeline({ a }: { a: BlindAttempt }) {
  const W = 720;
  const H = 84;
  const top = 18;
  const base = 76;
  const total = Math.max(a.limitSec, a.durationSec, 1);
  const x = (s: number) => (Math.max(0, Math.min(total, s)) / total) * W;
  const bucketSec = TIMELINE_BUCKET_MS / 1000;
  const peak = Math.max(1, ...a.timeline);
  const bw = (bucketSec / total) * W;
  const ticks = Array.from({ length: Math.floor(total / 60) + 1 }, (_, i) => i * 60);
  const summary =
    `Garis waktu ${whole(total)}: ${a.freezeSpans.length} rentang beku dan ${a.pauseMarks.length} jeda panjang sebelum simbol.`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="blind-timeline" role="img" aria-label={summary} preserveAspectRatio="none">
        <rect x={0} y={top} width={W} height={base - top} fill="rgba(4,16,28,0.9)" />
        {/* beku */}
        {a.freezeSpans.map(([from, to], i) => (
          <rect key={`f${i}`} x={x(from)} y={top} width={Math.max(1, x(to) - x(from))} height={base - top} fill="rgba(255,107,87,0.3)" />
        ))}
        {/* mengetik: tinggi batang = jumlah karakter per 5 detik */}
        {a.timeline.map((n, i) => {
          if (!n) return null;
          const h = Math.max(2, (n / peak) * (base - top - 4));
          return <rect key={`b${i}`} x={i * bw + 1} y={base - h} width={Math.max(1, bw - 2)} height={h} fill="#45c6ff" opacity={0.85} />;
        })}
        {/* jeda panjang sebelum simbol */}
        {a.pauseMarks.map(([t], i) => (
          <g key={`p${i}`}>
            <line x1={x(t)} x2={x(t)} y1={top - 4} y2={base} stroke="#ffc247" strokeWidth={2} />
            <circle cx={x(t)} cy={top - 6} r={4} fill="#ffc247" />
          </g>
        ))}
        {/* sesi berakhir lebih awal */}
        {a.durationSec < total - 0.5 && (
          <line x1={x(a.durationSec)} x2={x(a.durationSec)} y1={top} y2={base} stroke="#fff" strokeWidth={1.5} strokeDasharray="3 3" />
        )}
        {ticks.map((s) => (
          <line key={`t${s}`} x1={x(s)} x2={x(s)} y1={base} y2={base + 5} stroke="#4f7088" strokeWidth={1} />
        ))}
      </svg>
      {/* label sumbu di luar SVG: SVG diregangkan mengikuti lebar, teks tidak boleh ikut meregang */}
      <div className="blind-axis" aria-hidden="true">
        {ticks.map((s) => {
          const at = (s / total) * 100;
          return (
            <span key={s} style={{ left: `${at}%`, transform: `translateX(${at <= 0 ? "0" : at >= 99.5 ? "-100%" : "-50%"})` }}>
              {Math.floor(s / 60)}:00
            </span>
          );
        })}
      </div>
      <ul className="blind-legend">
        <li><i style={{ background: "#45c6ff" }} /> mengetik (tinggi = karakter per 5 detik)</li>
        <li><i style={{ background: "rgba(255,107,87,0.55)" }} /> beku ≥ {BLIND_FREEZE_MS / 1000} detik</li>
        <li><i style={{ background: "#ffc247" }} /> jeda panjang sebelum simbol</li>
        {a.durationSec < total - 0.5 && <li><i style={{ background: "#fff" }} /> sesi berakhir</li>}
      </ul>
      {a.pauseMarks.length > 0 && (
        <p className="text-[12.5px] text-[var(--dim)] mt-3 leading-relaxed">
          Jeda panjang:{" "}
          {a.pauseMarks.map(([t, ms, ch], i) => (
            <span key={i}>
              {i > 0 && ", "}
              <code className="blind-sym">{ch}</code> pada detik ke-{Math.round(t)} ({sec1(ms)})
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}

/* ---------- rapor ---------- */

interface Props {
  attempt: BlindAttempt;
  /** soal percobaan ini; undefined bila soalnya sudah tidak ada di aplikasi */
  brief?: BlindBrief;
  /** kecepatan terbaik di arena salin (stats.bestWpm); 0 = belum ada */
  bestCopyWpm: number;
  /** rapor pertama, untuk pembanding pada percobaan ulang */
  baseline?: BlindAttempt;
  onContinue?: () => void;
  continueLabel?: string;
}

export default function BlindReportCard({ attempt: a, brief, bestCopyWpm, baseline, onContinue, continueLabel }: Props) {
  const n = numbersOf(a);
  const lv = LEVEL[a.level];
  const threshold = Math.max(HESITATION_MIN_MS, (a.baselineMs ?? 0) * HESITATION_FACTOR);
  const integrity: string[] = [];
  if (a.pasteAttempts > 0) integrity.push(`${a.pasteAttempts} upaya tempel ditolak`);
  if (a.rejectedInserts > 0) integrity.push(`${a.rejectedInserts} sisipan otomatis ditolak`);
  if (a.blurCount > 0) integrity.push(`${a.blurCount} kali keluar jendela (total ${sec1(a.blurMs)})`);
  const isRetake = !!baseline && baseline.id !== a.id;
  const b = isRetake && baseline ? numbersOf(baseline) : null;
  const codeLines = a.code.split("\n");

  const rules: { level: BlindLevel; text: string; hit: boolean }[] = [
    {
      level: "gagap-berat",
      text: `Syntax error ≥ ${LEVEL_RULES.heavyErrors}, atau jeda panjang sebelum simbol ≥ ${LEVEL_RULES.heavyHesitations}, atau beku ≥ ${pct(LEVEL_RULES.heavyFrozenShare)} waktu, atau kode akhir di bawah ${LEVEL_RULES.minChars} karakter`,
      hit: a.level === "gagap-berat",
    },
    { level: "tersendat", text: "Ada syntax error, jeda panjang, atau beku, tetapi di bawah ambang di atas", hit: a.level === "tersendat" },
    {
      level: "lancar",
      text: `Tanpa syntax error, jeda panjang sebelum simbol ≤ ${LEVEL_RULES.fluentHesitations}, beku < ${pct(LEVEL_RULES.fluentFrozenShare)} waktu`,
      hit: a.level === "lancar",
    },
  ];

  return (
    <div className="space-y-5" data-blind-report={a.level}>
      {/* ---------- 1. tiga angka utama ---------- */}
      <section className="panel p-5 md:p-7 screen-in" style={{ borderColor: lv.border, boxShadow: `0 0 0 1px ${lv.border}, 0 24px 60px ${lv.glow}` }}>
        <p className="text-[10px] uppercase tracking-[0.24em] font-extrabold text-[var(--dim)]">
          Rapor Kegagapan Sintaksis • {brief?.title ?? a.briefId} • {dateLabel(a.at)}
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-none mt-2" style={{ color: lv.color }}>{lv.title}</h2>
        <p className="text-base md:text-lg text-white font-bold mt-3">{leadOf(a, n)}</p>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Tile
            label="Jeda panjang sebelum { }"
            value={String(a.braceHesitations)}
            sub={a.braceHesitations > 0 ? `terlama ${sec1(a.longestBracePauseMs)}` : "tidak ada"}
            alert={a.braceHesitations > 0}
          />
          <Tile
            label="Jeda panjang sebelum ;"
            value={String(a.semicolonHesitations)}
            sub={a.semicolonHesitations > 0 ? `terlama ${sec1(a.longestSemicolonPauseMs)}` : "tidak ada"}
            alert={a.semicolonHesitations > 0}
          />
          <Tile
            label="Syntax error"
            value={String(n.finished)}
            sub={n.unfinished > 0 ? `+ ${n.unfinished} belum ditutup saat waktu habis` : a.chars === 0 ? "tidak ada kode untuk diperiksa" : "pada kode akhir"}
            alert={n.finished > 0}
          />
        </div>
        <p className="text-[12px] text-[var(--faint)] mt-3 leading-relaxed">
          Jeda panjang = selang sebelum sebuah simbol yang mencapai {sec1(threshold)}
          {a.baselineMs !== null
            ? ` (sedikitnya ${sec1(HESITATION_MIN_MS)} dan ${HESITATION_FACTOR}× jeda dasarmu sendiri, ${a.baselineMs} ms)`
            : ` (ketikan huruf dan angkamu terlalu sedikit untuk menghitung jeda dasar pribadi, jadi dipakai batas tetap)`}
          . Jeda sebelum simbol adalah petunjuk, bukan diagnosis: bisa saja kamu sedang memikirkan logikanya, bukan mencari tombolnya.
        </p>
      </section>

      {b && baseline && (
        <section className="panel p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--cyan)]">Dibanding rapor pertamamu ({dateLabel(baseline.at)})</p>
          <dl className="grid sm:grid-cols-2 gap-x-8 mt-2">
            <Fact label="Jeda panjang sebelum { }" value={`${baseline.braceHesitations} → ${a.braceHesitations}`} />
            <Fact label="Jeda panjang sebelum ;" value={`${baseline.semicolonHesitations} → ${a.semicolonHesitations}`} />
            <Fact label="Syntax error" value={`${b.finished} → ${n.finished}`} />
            <Fact label="Waktu tanpa ketikan" value={`${pct(b.frozenShare)} → ${pct(n.frozenShare)}`} />
            <Fact label="Tuntutan terpenuhi" value={`${baseline.specPassed}/${baseline.specTotal} → ${a.specPassed}/${a.specTotal}`} />
            <Fact label="Tingkat" value={`${BLIND_LEVEL_LABEL[baseline.level]} → ${BLIND_LEVEL_LABEL[a.level]}`} />
          </dl>
          {baseline.briefId !== a.briefId && (
            <p className="text-[12px] text-[var(--faint)] mt-2">Soalnya berbeda, jadi angkanya pembanding kasar, bukan ukuran yang persis sama.</p>
          )}
        </section>
      )}

      {/* ---------- 2. garis waktu ---------- */}
      <Section title={`Garis waktu ${whole(Math.max(a.limitSec, a.durationSec))}`} sub="Kapan kamu mengetik, kapan berhenti, dan di simbol mana jarimu tertahan.">
        <Timeline a={a} />
      </Section>

      {/* ---------- 3. daftar syntax error ---------- */}
      <Section
        title="Syntax error pada kode akhir"
        sub="Diperiksa setelah sesi selesai. Selama mengetik, kode selalu berisi blok yang belum ditutup, jadi tidak dihitung saat itu."
      >
        {a.syntaxErrors.length === 0 ? (
          <p className="text-sm text-[var(--ink)]">
            {a.chars === 0 ? "Tidak ada kode untuk diperiksa." : "Tidak ada syntax error yang ditemukan pemeriksa."}
          </p>
        ) : (
          <ol className="space-y-2">
            {a.syntaxErrors.map((e, i) => (
              <li key={i} className="blind-error" data-unfinished={e.unfinished ? "true" : "false"}>
                <span className="chip font-code">baris {e.line}</span>
                <span className="chip">{REGION_LABEL[e.region]}</span>
                <span className="text-sm text-[var(--ink)] min-w-0 flex-1 basis-60"><Message text={e.message} /></span>
                {e.unfinished && <span className="chip" style={{ color: "var(--amber)" }}>belum ditutup saat waktu habis</span>}
              </li>
            ))}
          </ol>
        )}
        {a.missingJsSemicolons > 0 && (
          <p className="text-[13px] text-[var(--dim)] mt-3 leading-relaxed">
            <strong className="text-[var(--ink)]">Titik koma terlewat di JavaScript: {a.missingJsSemicolons} baris.</strong>{" "}
            Ini bukan syntax error: JavaScript menyisipkan titik koma sendiri, jadi tidak ikut dihitung di atas. Di CSS, titik koma yang
            hilang di antara dua deklarasi memang error.
          </p>
        )}
        {a.code.trim() !== "" && (
          <details className="mt-4">
            <summary className="cursor-pointer text-[13px] font-bold text-[var(--ink)]">Lihat kode akhirmu ({codeLines.length} baris)</summary>
            <pre className="blind-code font-code" aria-label="Kode akhir">
              {codeLines.map((line, i) => (
                <span key={i} className="blind-code-line"><i>{i + 1}</i>{line || " "}{"\n"}</span>
              ))}
            </pre>
          </details>
        )}
      </Section>

      {/* ---------- 4. angka pendukung ---------- */}
      <Section title="Angka pendukung">
        <div className="grid md:grid-cols-2 gap-x-8">
          <dl>
            <Fact
              label="Waktu tanpa ketikan (beku)"
              value={`${sec1(a.frozenMs)} • ${pct(n.frozenShare)} • ${a.freezes}×`}
              alert={n.frozenShare >= LEVEL_RULES.heavyFrozenShare}
            />
            <Fact label="Latensi awal (mulai → karakter pertama)" value={a.firstKeyMs === null ? "tidak pernah mengetik" : sec1(a.firstKeyMs)} />
            <Fact label="Koreksi (Backspace/Delete)" value={`${a.corrections}×`} />
            <Fact label="Salah tombol simbol" value={`${a.symbolFumbles}×`} alert={a.symbolFumbles > 0} />
            <Fact label="Jeda panjang sebelum simbol lain" value={`${a.otherSymbolHesitations}×`} alert={a.otherSymbolHesitations > 0} />
          </dl>
          <dl>
            <Fact label="Lama sesi" value={`${whole(a.durationSec)} • ${a.endedBy === "timeout" ? "waktu habis" : "diakhiri sendiri"}`} />
            <Fact label="Panjang kode akhir" value={`${a.chars} karakter`} />
            <Fact label="Kecepatan menulis dari ingatan" value={`${a.wpm} kata/menit`} />
            <Fact label="Kecepatan menyalin terbaikmu" value={bestCopyWpm > 0 ? `${Math.round(bestCopyWpm)} kata/menit` : "belum ada data"} />
            <Fact label="Tuntutan soal terpenuhi" value={`${a.specPassed} dari ${a.specTotal}`} alert={a.specPassed < a.specTotal} />
          </dl>
        </div>
        <p className="text-[12px] text-[var(--faint)] mt-3 leading-relaxed">
          Salah tombol simbol = simbol diketik, dihapus, lalu diganti simbol lain dalam dua ketukan. Kecepatan menulis dihitung dari
          panjang kode akhir (5 karakter = 1 kata), dengan cara yang sama seperti arena salin.
        </p>
        {brief && (
          <ul className="mt-4 space-y-1.5" aria-label="Cek spesifikasi">
            {brief.demands.map((d) => {
              const ok = a.specMet.includes(d.id);
              return (
                <li key={d.id} className="flex gap-2.5 text-sm">
                  <span
                    className="w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5"
                    style={{ background: ok ? "rgba(46,230,200,0.16)" : "rgba(255,107,87,0.18)", color: ok ? "var(--teal)" : "var(--coral)" }}
                  >
                    {ok ? <IconCheck size={12} /> : <IconX size={11} />}
                  </span>
                  <span className={ok ? "text-[var(--mint)]" : "text-white"}>{d.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ---------- 5. keyakinan berbanding hasil ---------- */}
      {a.confidence && (
        <section className="panel p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--cyan)]">Keyakinan berbanding hasil</p>
          <p className="text-base text-white font-bold mt-2">
            Sebelum mulai kamu menilai dirimu {a.confidence} dari 5 ({CONFIDENCE[a.confidence]}).{" "}
            {a.chars === 0
              ? `Tidak ada kode yang tertulis: 0 dari ${a.specTotal} tuntutan terpenuhi.`
              : `Kodemu memenuhi ${a.specPassed} dari ${a.specTotal} tuntutan${n.finished > 0 ? ` dan memuat ${n.finished} syntax error` : " tanpa syntax error"}.`}
          </p>
        </section>
      )}

      {/* ---------- 6. catatan integritas ---------- */}
      {integrity.length > 0 && (
        <section className="panel p-5" style={{ borderColor: "rgba(255,194,71,0.45)" }}>
          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--amber)]">Catatan integritas</p>
          <p className="text-sm text-[var(--ink)] mt-2">{integrity.join(" • ")}. Waktu tetap berjalan selama kamu berada di luar jendela.</p>
        </section>
      )}

      {/* ---------- 7. tingkat + penutup ---------- */}
      <section className="panel p-5 md:p-6">
        <h3 className="font-display font-extrabold text-xl text-white leading-tight">Bagaimana tingkat ini ditentukan</h3>
        <ul className="mt-3 space-y-1.5">
          {rules.map((r) => (
            <li key={r.level} className="blind-rule" data-on={r.hit ? "true" : "false"} aria-current={r.hit ? "true" : undefined}>
              <strong style={{ color: BLIND_LEVEL_COLOR[r.level] }}>{BLIND_LEVEL_LABEL[r.level]}</strong>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-[var(--faint)] mt-2 leading-relaxed">
          Syntax error yang bertanda “belum ditutup saat waktu habis” tidak ikut dihitung dalam aturan ini. Ambang-ambang ini masih
          sementara dan akan dikalibrasi setelah uji coba kelas.
        </p>

        <p className="text-base text-[var(--ink)] leading-relaxed mt-5 pt-5 border-t border-[var(--line-soft)]">{closingOf(a, n)}</p>
        <p className="text-[12px] text-[var(--faint)] mt-2">Hasil tantangan ini tidak memengaruhi nilai, rank, maupun koin.</p>
        {onContinue && (
          <button type="button" className="btn btn-primary px-7 py-3.5 text-base mt-5" onClick={onContinue}>
            {continueLabel ?? "Mulai latihan reguler"} <IconArrowR size={18} />
          </button>
        )}
      </section>
    </div>
  );
}
