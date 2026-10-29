/* Halaman khusus MatchingShark untuk MK Rekayasa Perangkat Lunak
   (Software Engineering).

   Status halaman ini adalah campaign konsep + demo semantic matching:
   - menjelaskan untuk apa MatchingShark dibuat;
   - memperlihatkan loop Scrum dan enam pulau belajar P1-P6;
   - memakai ulang 12 ilustrasi JPG materi RPL yang sudah ada;
   - demo arena kartu versus bersifat lokal di komponen MatchingDemo
     dan TIDAK menulis progres, XP, badge, achievement, membership,
     atau data pemain apa pun.

   Game penuh dirancang sebagai scope terpisah rpl:matching-shark agar
   progres MK RPL tidak tercampur dengan CodeShark/Coding Tower. */

import {
  IconArrowL,
  IconArrowR,
  IconAward,
  IconBolt,
  IconBook,
  IconCalendar,
  IconCheck,
  IconCoin,
  IconDatabase,
  IconEye,
  IconFin,
  IconFlame,
  IconHome,
  IconLock,
  IconMap,
  IconPlay,
  IconRetry,
  IconSparkles,
  IconTarget,
  IconTower,
} from "../ui/icons";
import MatchingDemo from "./MatchingDemo";

import matchingHeroJpg from "../assets/matchingshark/matching-hero.jpg";
import matchingHeroWebp from "../assets/matchingshark/matching-hero.webp";
import matchingCastPng from "../assets/matchingshark/matching-cast.png";
import matchingCastWebp from "../assets/matchingshark/matching-cast.webp";

import rplP1Pabrik from "../assets/materi-rpl/rpl-p1-pabrik-pl.jpg";
import rplP1Siklus from "../assets/materi-rpl/rpl-p1-siklus-hidup.jpg";
import rplP2Sprint from "../assets/materi-rpl/rpl-p2-sprint-agile.jpg";
import rplP2Waterfall from "../assets/materi-rpl/rpl-p2-waterfall.jpg";
import rplP3Elisitasi from "../assets/materi-rpl/rpl-p3-elisitasi.jpg";
import rplP3Srs from "../assets/materi-rpl/rpl-p3-dokumen-srs.jpg";
import rplP4Aktor from "../assets/materi-rpl/rpl-p4-aktor-sistem.jpg";
import rplP4Alur from "../assets/materi-rpl/rpl-p4-alur-aktivitas.jpg";
import rplP5Blok from "../assets/materi-rpl/rpl-p5-blok-kelas.jpg";
import rplP5Sinyal from "../assets/materi-rpl/rpl-p5-sinyal-urutan.jpg";
import rplP6Bug from "../assets/materi-rpl/rpl-p6-inspeksi-bug.jpg";
import rplP6Rawat from "../assets/materi-rpl/rpl-p6-pemeliharaan.jpg";

const VIOLET = "#a78bfa";
const VIOLET_DIM = "#c4b5fd";
const PANEL = "rgba(10, 28, 46, 0.82)";
const PANEL_SOFT = "rgba(10, 28, 46, 0.62)";
const LINE = "rgba(126, 196, 236, 0.18)";
const DIM = "#9db8cb";
const FAINT = "#7393a9";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  desc?: string;
}

function SectionHeading({ eyebrow, title, desc }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-extrabold tracking-[0.28em] uppercase" style={{ color: VIOLET }}>
        {eyebrow}
      </p>
      <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white mt-2">
        {title}
      </h2>
      {desc ? (
        <p className="text-sm md:text-base leading-relaxed mt-3" style={{ color: DIM }}>
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function Chip({ children, violet = false }: { children: string; violet?: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-extrabold"
      style={{
        color: violet ? VIOLET_DIM : "#c9dcec",
        borderColor: violet ? "rgba(167,139,250,0.45)" : "rgba(126,196,236,0.24)",
        background: violet ? "rgba(167,139,250,0.1)" : "rgba(7,24,42,0.55)",
      }}
    >
      {children}
    </span>
  );
}

const ISLANDS = [
  {
    code: "P1",
    name: "Pabrik Perangkat Lunak",
    topic: "Pengantar RPL & SDLC",
    image: rplP1Pabrik,
    alt: "Ilustrasi pabrik perangkat lunak bawah laut untuk pengantar RPL dan SDLC",
    missions: ["Pasangkan fase SDLC", "Kenali peran tim", "Bedakan produk & proses"],
    output: "Peta siklus hidup proyek",
    phase: "Fokus MVP",
  },
  {
    code: "P2",
    name: "Arus Proses & Sprint",
    topic: "Waterfall, Agile, dan Scrum",
    image: rplP2Sprint,
    alt: "Ilustrasi tim hiu mengelilingi arus sprint Agile",
    missions: ["Pilih model proses", "Susun event Scrum", "Atur kapasitas Sprint"],
    output: "Sprint Goal + Sprint Backlog",
    phase: "Fokus MVP",
  },
  {
    code: "P3",
    name: "Teluk Kebutuhan",
    topic: "Elisitasi, user story, dan SRS",
    image: rplP3Elisitasi,
    alt: "Ilustrasi elisitasi kebutuhan bersama para pemangku kepentingan bawah laut",
    missions: ["Ubah keluhan jadi user story", "Pilah fungsional/nonfungsional", "Tulis acceptance criteria"],
    output: "Kebutuhan terukur siap diuji",
    phase: "Fokus MVP",
  },
  {
    code: "P4",
    name: "Pelabuhan Use Case",
    topic: "Use case & activity diagram",
    image: rplP4Aktor,
    alt: "Ilustrasi aktor berinteraksi dengan batas sistem pada use case diagram",
    missions: ["Hubungkan aktor–use case", "Susun alur utama & alternatif", "Temukan langkah yang hilang"],
    output: "Skenario use case yang utuh",
    phase: "Fase berikutnya",
  },
  {
    code: "P5",
    name: "Menara Kelas & Sinyal",
    topic: "Class, sequence, dan dasar desain",
    image: rplP5Blok,
    alt: "Ilustrasi blok kelas dan relasi objek pada class diagram",
    missions: ["Pasangkan kelas & relasi", "Urutkan pesan antarobjek", "Nilai kohesi/kopel desain"],
    output: "Model desain yang konsisten",
    phase: "Fase berikutnya",
  },
  {
    code: "P6",
    name: "Laboratorium Kualitas",
    topic: "Pengujian, pemeliharaan & mini project",
    image: rplP6Bug,
    alt: "Ilustrasi inspeksi bug dan pengujian perangkat lunak bawah laut",
    missions: ["Pilih level pengujian", "Rancang boundary value", "Triage bug & perubahan"],
    output: "Increment siap review",
    phase: "Fase berikutnya",
  },
];

const CODEX_SHOTS = [
  { image: rplP1Siklus, title: "Siklus hidup perangkat lunak", code: "P1" },
  { image: rplP2Waterfall, title: "Waterfall dan model proses", code: "P2" },
  { image: rplP3Srs, title: "Dokumen SRS", code: "P3" },
  { image: rplP4Alur, title: "Alur aktivitas", code: "P4" },
  { image: rplP5Sinyal, title: "Sinyal sequence diagram", code: "P5" },
  { image: rplP6Rawat, title: "Pemeliharaan setelah rilis", code: "P6" },
];

const SPRINT_STEPS = [
  {
    no: "01",
    title: "Sprint Planning",
    desc: "Baca Product Backlog, tetapkan Sprint Goal, lalu pilih pekerjaan sesuai kapasitas — bukan sesuai ambisi semata.",
    icon: IconTarget,
    color: VIOLET,
  },
  {
    no: "02",
    title: "Daily Scrum",
    desc: "Kartu event datang: blocker, perubahan kebutuhan, atau temuan baru. Pilih respons yang menjaga fokus Sprint.",
    icon: IconCalendar,
    color: "#7ee4ff",
  },
  {
    no: "03",
    title: "Build · Model · Test",
    desc: "Pasangkan user story, model UML, keputusan desain, dan kasus uji. Setiap pasangan membuka alasan engineering-nya.",
    icon: IconSparkles,
    color: "var(--teal)",
  },
  {
    no: "04",
    title: "Sprint Review",
    desc: "Tunjukkan increment ke stakeholder. Acceptance criteria menentukan pekerjaan diterima, direvisi, atau kembali ke backlog.",
    icon: IconEye,
    color: "var(--amber)",
  },
  {
    no: "05",
    title: "Retrospective",
    desc: "Evaluasi Trust, Quality, Tech Debt, dan Capacity; pilih satu perbaikan proses untuk Sprint berikutnya.",
    icon: IconRetry,
    color: "#ff9d8a",
  },
];

const FAQS = [
  {
    q: "Apakah MatchingShark sudah bisa dimainkan penuh?",
    a: "Belum. Halaman ini adalah campaign konsep dan demo mini. Nantinya URL /matchingshark/ menjadi rumah game penuh; saat ini yang bisa dicoba adalah empat pasangan demo di halaman ini.",
  },
  {
    q: "Apa bedanya dengan CodeShark dan Coding Tower?",
    a: "CodeShark melatih ketepatan mengetik kode, Coding Tower melatih susunan blok, sedangkan MatchingShark melatih keputusan Rekayasa Perangkat Lunak: kebutuhan, pemodelan, proses Scrum, desain, pengujian, dan pemeliharaan.",
  },
  {
    q: "Apakah progres demo ini tersimpan?",
    a: "Tidak. XP demo hanya status visual komponen. Demo tidak menulis localStorage, database, badge, achievement, membership, atau progres global pemain.",
  },
  {
    q: "Materi RPL-nya berasal dari mana?",
    a: "Enam dokumen pertemuan di content/rpl disiapkan sebagai Codex atau micro-briefing: dibaca singkat saat dibutuhkan, lalu dipraktikkan lewat misi matching. Materi panjang bukan pengganti gameplay.",
  },
  {
    q: "Mengapa progresnya harus terpisah per MK?",
    a: "Agar fokus pada MK RPL tidak menggelembungkan atau mengganggu achievement MK lain. Rancangan game penuh memakai scope rpl:matching-shark untuk XP, badge, rank, dan token RPL.",
  },
  {
    q: "Apa fokus versi pertama nanti?",
    a: "Roadmap yang ditampilkan di halaman ini memfokuskan MVP pada P1–P3: SDLC, model proses/Scrum, dan rekayasa kebutuhan. P4–P6 menyusul setelah loop inti terbukti nyaman dimainkan.",
  },
];

export default function MatchingSharkPage() {
  return (
    <div
      className="min-h-screen overflow-x-clip"
      style={{
        color: "var(--ink)",
        background:
          "radial-gradient(circle at 12% 2%, rgba(88,28,135,0.34), transparent 28rem), radial-gradient(circle at 88% 12%, rgba(14,116,144,0.28), transparent 30rem), linear-gradient(180deg, #090d24 0%, #04121f 42%, #03101d 100%)",
      }}
    >
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(5,10,26,0.86)", borderBottom: "1px solid rgba(167,139,250,0.2)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="#atas" className="flex items-center gap-3 min-w-0" aria-label="Kembali ke atas MatchingShark">
            <span
              className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
              style={{ background: "rgba(167,139,250,0.14)", border: "1px solid rgba(167,139,250,0.5)", color: VIOLET_DIM }}
            >
              <IconFin size={23} />
            </span>
            <span className="leading-tight min-w-0">
              <span className="block font-display font-extrabold text-lg text-white truncate">MatchingShark</span>
              <span className="block text-[10px] font-extrabold tracking-[0.18em] uppercase" style={{ color: VIOLET_DIM }}>
                MK RPL · Software Engineering
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-5 mx-auto text-xs font-extrabold" aria-label="Navigasi halaman MatchingShark" style={{ color: DIM }}>
            <a className="hover:text-white" href="#konsep">Konsep</a>
            <a className="hover:text-white" href="#demo">Demo</a>
            <a className="hover:text-white" href="#sprint">Loop Sprint</a>
            <a className="hover:text-white" href="#pulau">6 Pulau</a>
            <a className="hover:text-white" href="#faq">FAQ</a>
          </nav>

          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <a
              href="../"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-2 rounded-xl border"
              style={{ borderColor: LINE, color: "#c9dcec" }}
            >
              <IconHome size={14} /> Hub
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl"
              style={{ background: VIOLET, color: "#160b2e" }}
            >
              <IconPlay size={14} /> Coba Demo
            </a>
          </div>
        </div>
      </header>

      <main id="atas">
        {/* HERO */}
        <section className="relative max-w-7xl mx-auto px-4 pt-10 md:pt-16 pb-14 md:pb-20">
          <div className="absolute -left-24 top-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22), transparent 68%)" }} aria-hidden="true" />
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-9 lg:gap-12 items-center relative">
            <div className="anim-pop">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.18em] uppercase"
                style={{ color: VIOLET_DIM, borderColor: "rgba(167,139,250,0.45)", background: "rgba(167,139,250,0.1)" }}
              >
                <IconSparkles size={14} /> Segera hadir · Game khusus MK RPL
              </span>
              <h1 className="font-display font-extrabold tracking-tight text-white mt-5" style={{ fontSize: "clamp(3rem, 8vw, 6.3rem)", lineHeight: 0.92 }}>
                Matching<span style={{ color: VIOLET }}>Shark</span>
              </h1>
              <p className="font-display font-extrabold text-2xl md:text-4xl leading-tight mt-4" style={{ color: "#d9f5ff" }}>
                Belajar Software Engineering dengan <span style={{ color: "var(--teal)" }}>mencocokkan artefak</span>, bukan sekadar menghafal definisi.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-4 max-w-2xl" style={{ color: DIM }}>
                Pasangkan kebutuhan pengguna, user story, diagram UML, keputusan desain, Sprint Backlog, dan kasus uji.
                Setiap keputusan membuka alasan engineering di baliknya—lalu Sprint berjalan seperti proyek sungguhan.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                <Chip violet>Semantic matching</Chip>
                <Chip>Simulasi Agile Scrum</Chip>
                <Chip>Umpan balik beralasan</Chip>
                <Chip>Progres khusus MK RPL</Chip>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition hover:-translate-y-0.5"
                  style={{ background: VIOLET, color: "#160b2e", boxShadow: "0 18px 42px rgba(167,139,250,0.25)" }}
                >
                  Coba demo matching <IconArrowR size={16} />
                </a>
                <a
                  href="#pulau"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold border transition hover:-translate-y-0.5"
                  style={{ borderColor: "rgba(69,198,255,0.42)", color: "#7ee4ff", background: "rgba(69,198,255,0.06)" }}
                >
                  <IconMap size={16} /> Lihat 6 pulau belajar
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-9 max-w-2xl">
                {[
                  ["6", "Pulau P1–P6"],
                  ["5", "Tahap Sprint"],
                  ["18", "Visual materi RPL"],
                  ["0", "Progres dari demo"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl px-4 py-3" style={{ background: PANEL_SOFT, border: `1px solid ${LINE}` }}>
                    <div className="font-display font-extrabold text-2xl text-white tabular-nums">{value}</div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: FAINT }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <figure className="relative anim-pop" style={{ animationDelay: "90ms" }}>
              <div className="absolute -inset-4 rounded-[2rem] pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(167,139,250,0.22), transparent 68%)" }} aria-hidden="true" />
              <picture>
                <source srcSet={matchingHeroWebp} type="image/webp" />
                <img
                  src={matchingHeroJpg}
                  alt="Kapten hiu mempresentasikan papan Scrum holografik berisi kartu artefak perangkat lunak yang saling terhubung"
                  className="relative w-full aspect-[4/3] lg:aspect-[1.05/1] object-cover rounded-[1.8rem]"
                  style={{ border: "1px solid rgba(167,139,250,0.42)", boxShadow: "0 28px 80px rgba(0,0,0,0.42)" }}
                  fetchPriority="high"
                />
              </picture>
              <figcaption
                className="relative md:absolute md:left-5 md:right-5 md:bottom-5 mt-3 md:mt-0 rounded-2xl p-4 backdrop-blur-xl"
                style={{ background: "rgba(4,16,29,0.82)", border: "1px solid rgba(126,196,236,0.22)" }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: VIOLET_DIM }}>Inti permainannya</p>
                <p className="text-sm font-bold leading-relaxed text-white mt-1">
                  Baca situasi → pilih artefak/keputusan → terima akibatnya ke Sprint → pahami alasannya.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* KONSEP */}
        <section id="konsep" className="max-w-7xl mx-auto px-4 py-14 md:py-20 scroll-mt-24">
          <SectionHeading
            eyebrow="MatchingShark untuk apa?"
            title="RPL adalah seni menghubungkan keputusan."
            desc="Dalam proyek nyata, kebutuhan memengaruhi model, model memengaruhi desain, desain memengaruhi pengujian, dan semuanya dibatasi waktu serta kapasitas tim. MatchingShark mengubah hubungan itu menjadi misi yang bisa disentuh, dipilih, diseret, dan dievaluasi."
          />

          <div className="grid md:grid-cols-3 gap-4 mt-9">
            {[
              {
                icon: IconBook,
                title: "1 · Terjemahkan kebutuhan",
                desc: "Ubah kata-kata stakeholder menjadi user story, kebutuhan fungsional/nonfungsional, prioritas, dan acceptance criteria yang terukur.",
                color: "#7ee4ff",
              },
              {
                icon: IconMap,
                title: "2 · Modelkan sistem",
                desc: "Hubungkan aktor dengan use case, susun activity flow, pasangkan relasi kelas, dan urutkan pesan pada sequence diagram.",
                color: VIOLET,
              },
              {
                icon: IconFlame,
                title: "3 · Jalankan Sprint",
                desc: "Pilih backlog sesuai kapasitas, tanggapi blocker, uji increment, hadapi review stakeholder, lalu perbaiki proses di retrospective.",
                color: "var(--amber)",
              },
            ].map((card) => (
              <article key={card.title} className="rounded-[1.4rem] p-6 anim-pop" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <span className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: "rgba(7,24,42,0.72)", border: `1px solid ${LINE}`, color: card.color }}>
                  <card.icon size={22} />
                </span>
                <h3 className="font-display font-extrabold text-xl text-white mt-4">{card.title}</h3>
                <p className="text-sm leading-relaxed mt-2" style={{ color: DIM }}>{card.desc}</p>
              </article>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-5 mt-5 items-stretch">
            <figure className="rounded-[1.6rem] overflow-hidden relative min-h-80" style={{ border: `1px solid ${LINE}` }}>
              <picture>
                <source srcSet={matchingCastWebp} type="image/webp" />
                <img
                  src={matchingCastPng}
                  alt="Tiga hiu berperan sebagai kapten Sprint, analis kebutuhan, dan penguji kualitas di studio bawah laut"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(180deg, transparent, rgba(3,10,22,0.92))" }}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: VIOLET_DIM }}>Tim di balik Sprint</p>
                <p className="font-display font-extrabold text-white text-xl mt-1">Kapten Sprint · Analis Kebutuhan · Penguji Kualitas</p>
              </div>
            </figure>

            <div className="grid gap-4">
              {[
                {
                  title: "Untuk mahasiswa",
                  desc: "Latihan mengambil keputusan RPL lewat kasus pendek dan feedback langsung sebelum masuk tugas proyek atau gladi UTS.",
                },
                {
                  title: "Untuk dosen & asisten",
                  desc: "Misi per pertemuan membantu memetakan miskonsepsi: kebutuhan kabur, aktor tertukar, relasi kelas keliru, atau kasus uji yang lemah.",
                },
                {
                  title: "Untuk pembelajar mandiri",
                  desc: "Codex micro-briefing memberi konteks seperlunya, kemudian pemain langsung membuktikan pemahaman dengan memanipulasi artefak.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-[1.4rem] p-5" style={{ background: PANEL_SOFT, border: `1px solid ${LINE}` }}>
                  <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
                    <IconCheck size={18} /> {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed mt-1.5" style={{ color: DIM }}>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section id="demo" className="max-w-7xl mx-auto px-4 py-14 md:py-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <SectionHeading
              eyebrow="Demo card versus"
              title="Masukkan kartu ke arena, lalu kunci panahnya."
              desc="Empat duel dari kebutuhan, UML, pengujian, dan Scrum. Kartu situasi dan keputusan saling berhadapan di Sonar Link Arena; setiap link yang dikunci selalu disertai alasan engineering."
            />
            <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold shrink-0" style={{ color: "#ffd98a", borderColor: "rgba(255,194,71,0.4)", background: "rgba(255,194,71,0.08)" }}>
              <IconLock size={14} /> Demo tanpa penyimpanan progres
            </span>
          </div>
          <MatchingDemo />
        </section>

        {/* SPRINT */}
        <section id="sprint" className="max-w-7xl mx-auto px-4 py-14 md:py-20 scroll-mt-24">
          <SectionHeading
            eyebrow="Loop permainan"
            title="Satu Sprint, lima keputusan besar."
            desc="MatchingShark memakai Scrum sebagai rangka misi. Pemain tidak hanya menjawab pertanyaan lepas: pilihan di awal Sprint memengaruhi ruang gerak, kualitas, dan penerimaan increment di akhir."
          />
          <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-5 mt-9 items-stretch">
            <figure className="rounded-[1.6rem] overflow-hidden relative min-h-96" style={{ border: `1px solid ${LINE}` }}>
              <img
                src={rplP2Sprint}
                alt="Ilustrasi arus Sprint Agile bawah laut dengan papan backlog dan tim hiu"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-x-0 bottom-0 p-6" style={{ background: "linear-gradient(180deg, transparent, rgba(3,10,22,0.94))" }}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: "#7ee4ff" }}>Bukan kuis satu arah</p>
                <p className="font-display font-extrabold text-2xl leading-tight text-white mt-1">Keputusan kecil mengubah arus Sprint berikutnya.</p>
              </div>
            </figure>

            <div className="space-y-3">
              {SPRINT_STEPS.map((step) => (
                <article key={step.no} className="rounded-[1.35rem] p-5 flex gap-4" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                  <span className="w-12 h-12 rounded-2xl shrink-0 grid place-items-center" style={{ background: "rgba(7,24,42,0.72)", border: `1px solid ${LINE}`, color: step.color }}>
                    <step.icon size={22} />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.22em]" style={{ color: step.color }}>TAHAP {step.no}</p>
                    <h3 className="font-display font-extrabold text-xl text-white mt-0.5">{step.title}</h3>
                    <p className="text-sm leading-relaxed mt-1" style={{ color: DIM }}>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-5">
            {[
              { label: "Trust", value: 82, note: "Kepercayaan stakeholder pada increment dan transparansi tim.", color: "var(--teal)" },
              { label: "Quality", value: 74, note: "Kecukupan model, pengujian, dan acceptance criteria.", color: "#7ee4ff" },
              { label: "Capacity", value: 64, note: "Sisa ruang kerja Sprint setelah backlog dan blocker ditangani.", color: "var(--amber)" },
              { label: "Tech Debt", value: 28, note: "Beban jalan pintas yang harus dibayar pada Sprint berikutnya.", color: "#ff9d8a" },
            ].map((meter) => (
              <article key={meter.label} className="rounded-[1.35rem] p-5" style={{ background: PANEL_SOFT, border: `1px solid ${LINE}` }}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display font-extrabold text-white">{meter.label}</h3>
                  <span className="font-display font-extrabold tabular-nums" style={{ color: meter.color }}>{meter.value}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden mt-3" style={{ background: "rgba(126,196,236,0.12)" }}>
                  <div className="h-full rounded-full" style={{ width: `${meter.value}%`, background: meter.color }} />
                </div>
                <p className="text-xs leading-relaxed mt-3" style={{ color: DIM }}>{meter.note}</p>
              </article>
            ))}
          </div>
          <p className="text-[11px] font-semibold mt-3" style={{ color: FAINT }}>
            Meter di atas adalah ilustrasi konsep game penuh, bukan data pemain dan belum terhubung ke database.
          </p>
        </section>

        {/* PULAU */}
        <section id="pulau" className="max-w-7xl mx-auto px-4 py-14 md:py-20 scroll-mt-24">
          <SectionHeading
            eyebrow="Kurikulum MK RPL"
            title="Enam pulau, satu alur Software Engineering."
            desc="Peta ini mengikuti enam pertemuan RPL yang sudah tersedia sebagai materi Codex. Setiap pulau menghasilkan artefak yang dipakai kembali pada misi berikutnya, sehingga proyek terasa berkembang—bukan sekadar berganti bab."
          />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-9">
            {ISLANDS.map((island) => (
              <article key={island.code} className="rounded-[1.5rem] overflow-hidden flex flex-col anim-pop" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <figure className="relative h-52 shrink-0 overflow-hidden">
                  <img src={island.image} alt={island.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  <span className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-extrabold" style={{ background: "rgba(4,16,29,0.85)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                    {island.code}
                  </span>
                  <span
                    className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide"
                    style={{
                      background: island.phase === "Fokus MVP" ? VIOLET : "rgba(4,16,29,0.85)",
                      color: island.phase === "Fokus MVP" ? "#160b2e" : "#c9dcec",
                      border: "1px solid rgba(255,255,255,0.16)",
                    }}
                  >
                    {island.phase}
                  </span>
                </figure>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: VIOLET_DIM }}>{island.topic}</p>
                  <h3 className="font-display font-extrabold text-2xl text-white mt-1">{island.name}</h3>
                  <ul className="flex flex-wrap gap-1.5 mt-4">
                    {island.missions.map((mission) => (
                      <li key={mission} className="text-[11px] font-bold rounded-full border px-2.5 py-1" style={{ color: "#c9dcec", borderColor: "rgba(126,196,236,0.22)" }}>
                        {mission}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs font-semibold mt-auto pt-5" style={{ color: FAINT }}>
                    Artefak keluar: <span style={{ color: "#d5e9f5" }}>{island.output}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CODEX + GAMIFIKASI */}
        <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <SectionHeading
                eyebrow="Codex RPL"
                title="Materi menjadi bekal misi, bukan tembok teks."
                desc="Enam dokumen pertemuan diposisikan sebagai micro-briefing: konsep inti dibaca singkat, diagram dibuka saat relevan, lalu pemain langsung menerapkan hubungan antar-artefak."
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
                {CODEX_SHOTS.map((shot) => (
                  <figure key={shot.title} className="rounded-2xl overflow-hidden relative h-32" style={{ border: `1px solid ${LINE}` }}>
                    <img src={shot.image} alt={`Ilustrasi Codex RPL: ${shot.title}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-2.5" style={{ background: "linear-gradient(180deg, transparent, rgba(3,10,22,0.92))" }}>
                      <span className="block text-[9px] font-extrabold tracking-[0.18em]" style={{ color: VIOLET_DIM }}>{shot.code}</span>
                      <span className="block text-[11px] font-extrabold leading-tight text-white">{shot.title}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Gamifikasi scope RPL"
                title="Pencapaian RPL berdiri sendiri."
                desc="Rancangan game penuh memisahkan progres MatchingShark dari CodeShark dan Coding Tower. Fokus di MK RPL tidak boleh menggelembungkan atau mengganggu achievement MK lain."
              />
              <div className="space-y-3 mt-8">
                {[
                  {
                    icon: IconBolt,
                    title: "XP delta-above-best",
                    desc: "Mengulang misi hanya memberi selisih di atas capaian terbaik, sehingga farming jawaban yang sama tidak menguntungkan.",
                  },
                  {
                    icon: IconAward,
                    title: "Badge khusus artefak",
                    desc: "Badge dirancang mengikuti kompetensi RPL: penajam kebutuhan, pemodel use case, penjaga kualitas, dan penata Sprint.",
                  },
                  {
                    icon: IconCoin,
                    title: "Token khusus RPL",
                    desc: "Ekonomi MatchingShark terpisah dari koin global. Nama token final masih keputusan desain berikutnya dan belum ditampilkan sebagai fitur aktif.",
                  },
                  {
                    icon: IconDatabase,
                    title: "Siap dihubungkan bertahap",
                    desc: "Profil dan membership platform sudah tersedia, tetapi slice progres khusus rpl:matching-shark baru akan ditulis saat game penuh dibangun—bukan oleh demo ini.",
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-[1.35rem] p-5 flex gap-4" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                    <span className="w-11 h-11 rounded-2xl shrink-0 grid place-items-center" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.32)", color: VIOLET_DIM }}>
                      <item.icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white">{item.title}</h3>
                      <p className="text-sm leading-relaxed mt-1" style={{ color: DIM }}>{item.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-5xl mx-auto px-4 py-14 md:py-20 scroll-mt-24">
          <SectionHeading eyebrow="FAQ" title="Yang perlu jelas sejak awal." />
          <div className="space-y-3 mt-8">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-[1.3rem] px-5 py-4" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <summary className="cursor-pointer font-display font-extrabold text-base md:text-lg text-white list-none flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-xl leading-none shrink-0" style={{ color: VIOLET_DIM }} aria-hidden="true">+</span>
                </summary>
                <p className="text-sm leading-relaxed mt-3" style={{ color: DIM }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-24">
          <div
            className="rounded-[1.8rem] overflow-hidden relative px-6 py-9 md:px-10 md:py-12"
            style={{
              background: "linear-gradient(120deg, rgba(88,28,135,0.48), rgba(8,47,73,0.72) 58%, rgba(4,18,31,0.95))",
              border: "1px solid rgba(167,139,250,0.42)",
            }}
          >
            <div className="relative max-w-3xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.26em]" style={{ color: VIOLET_DIM }}>Sprint pertama sedang disiapkan</p>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white mt-2">
                Sambil menunggu, tetap asah insting engineering-mu.
              </h2>
              <p className="text-sm md:text-base leading-relaxed mt-3" style={{ color: "#c7ddec" }}>
                Coba lagi demo empat pasangan di halaman ini, atau lanjutkan latihan di dua arena yang sudah live.
                MatchingShark akan kembali ke URL ini sebagai game RPL penuh pada tahap berikutnya.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href="#demo" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold" style={{ background: VIOLET, color: "#160b2e" }}>
                  <IconRetry size={16} /> Mainkan demo lagi
                </a>
                <a href="../codingtower/" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold text-white" style={{ background: "#f97316" }}>
                  <IconTower size={16} /> Coding Tower
                </a>
                <a href="../codingshark/" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold" style={{ background: "var(--teal)", color: "#04222b" }}>
                  <IconFin size={16} /> CodeShark
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid rgba(126,196,236,0.14)", background: "rgba(3,10,22,0.72)" }}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: "rgba(167,139,250,0.12)", color: VIOLET_DIM }}>
              <IconFin size={18} />
            </span>
            <div>
              <p className="font-display font-extrabold text-white">MatchingShark</p>
              <p className="text-[11px] font-semibold" style={{ color: FAINT }}>Halaman khusus MK Rekayasa Perangkat Lunak · latihan.my.id</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 text-xs font-extrabold md:ml-auto" style={{ color: DIM }} aria-label="Navigasi footer MatchingShark">
            <a className="hover:text-white inline-flex items-center gap-1.5" href="../"><IconArrowL size={13} /> Hub</a>
            <a className="hover:text-white" href="#demo">Demo</a>
            <a className="hover:text-white" href="#pulau">6 Pulau RPL</a>
            <a className="hover:text-white" href="../codingtower/">Coding Tower</a>
            <a className="hover:text-white" href="../codingshark/">CodeShark</a>
          </nav>
        </div>
        <p className="max-w-7xl mx-auto px-4 pb-7 text-[11px] leading-relaxed" style={{ color: "#58768d" }}>
          Status: campaign konsep + demo. Demo tidak menyimpan XP, badge, achievement, membership, atau progres pemain.
        </p>
      </footer>
    </div>
  );
}
