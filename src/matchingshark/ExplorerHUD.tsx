import { useEffect, useRef, useState } from "react";
import "./explorerHUD.css";
// Static URLs are rewritten by Vite for nested entry points and production builds.
const images = import.meta.glob("../assets/matching-hud/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const asset = (name: string) => images[`../assets/matching-hud/${name}.webp`];
const islands = [
  {
    name: "Pelabuhan Kebutuhan",
    skill: "Requirement Engineering",
    image: "crystal",
    icon: "01",
    description: "Temukan masalah yang tepat sebelum membangun solusi.",
  },
  {
    name: "Terumbu Desain",
    skill: "System Design",
    image: "purple",
    icon: "02",
    description: "Jelajahi komponen dan kompromi di balik sebuah sistem.",
  },
  {
    name: "Palung Pengujian",
    skill: "Software Testing",
    image: "coral",
    icon: "03",
    description: "Selidiki batas sistem dan temukan bug yang tersembunyi.",
  },
];
const questions = [
  {
    title: "Mulai dari pertanyaan yang tepat.",
    brief:
      "Alarm pelabuhan berbunyi setiap kali ikan lewat. Penjaga hanya ingin tahu saat kapal mendekat.",
    question: "Apa yang perlu kamu klarifikasi lebih dahulu?",
    answers: [
      "Warna lampu alarm yang disukai penjaga",
      "Kejadian apa yang seharusnya memicu alarm",
      "Framework terbaru untuk membuat alarm",
    ],
    correct: 1,
    feedback:
      "Kebutuhan yang jelas membantu kita memilih solusi yang tepat. Tentukan pemicu alarm sebelum membahas tampilannya atau teknologinya.",
  },
  {
    title: "Ubah kebutuhan menjadi kriteria.",
    brief:
      "Sensor menyediakan kategori objek dan posisi. Penjaga hanya membutuhkan alarm untuk kapal yang masuk zona pelabuhan.",
    question: "Kriteria mana yang paling bisa diuji?",
    answers: [
      "Alarm harus modern dan sangat bagus",
      "Semua objek laut harus memicu alarm",
      "Kapal di dalam zona memicu alarm; ikan tidak",
    ],
    correct: 2,
    feedback:
      "Kriteria yang spesifik dapat diuji. Pada sistem nyata, klasifikasi yang tidak pasti juga membutuhkan penanganan tersendiri.",
  },
  {
    title: "Uji batas keputusanmu.",
    brief:
      "Seekor ikan masuk zona. Sebuah kapal berada di luar zona. Kapal kedua masuk ke dalam zona.",
    question: "Objek mana yang seharusnya memicu alarm?",
    answers: [
      "Hanya kapal kedua yang berada di dalam zona",
      "Kedua kapal, di mana pun posisinya",
      "Semua objek di dalam zona",
    ],
    correct: 0,
    feedback:
      "Tepat: kategori objek dan posisi sama-sama menentukan hasil. Kamu baru mempraktikkan klarifikasi kebutuhan dan pengujian kondisi.",
  },
];
function readProgress() {
  try {
    return localStorage.getItem("matching-hud-v1") === "complete";
  } catch {
    return false;
  }
}
export default function ExplorerHUD() {
  const [tab, setTab] = useState("Beranda");
  const [complete, setComplete] = useState(readProgress);
  const [modal, setModal] = useState<
    "mission" | "help" | "progress" | number | null
  >(null);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [still, setStill] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (modal !== null) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      opener.current?.focus();
    }
  }, [modal]);
  function start() {
    setStep(0);
    setAnswer(null);
    setChecked(false);
    setModal("mission");
  }
  useEffect(() => {
    if (modal === "mission" || modal === "progress")
      document.getElementById("hud-dialog-title")?.focus();
  }, [step, modal]);
  function next() {
    if (step === 2) {
      setComplete(true);
      try {
        localStorage.setItem("matching-hud-v1", "complete");
      } catch {
        setStorageError(true);
      }
      setModal("progress");
    } else {
      setStep(step + 1);
      setAnswer(null);
      setChecked(false);
    }
  }
  const q = questions[step];
  return (
    <div className={`ocean-hud ${still ? "motion-paused" : ""}`}>
      <a className="hud-skip" href="#hud-content">
        Langsung ke konten
      </a>
      <aside className="hud-sidebar">
        <a className="hud-brand" href="./" aria-label="MatchingShark beranda">
          <span className="brand-fin">◈</span>
          <span>
            Matching<span>Shark</span>
            <small>THE ENGINEERING ADVENTURE</small>
          </span>
        </a>
        <div className="nav-caption">RUANG EKSPLORASI</div>
        <nav aria-label="Navigasi utama">
          {[
            ["Beranda", "⌂"],
            ["Peta Eksplorasi", "◎"],
            ["Progres Belajar", "▥"],
            ["Panduan", "?"],
          ].map(([name, icon]) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                if (name === "Progres Belajar") setModal("progress");
                else if (name === "Panduan") setModal("help");
                else
                  document
                    .getElementById(
                      name === "Peta Eksplorasi" ? "islands" : "hud-content",
                    )
                    ?.scrollIntoView({
                      behavior:
                        still ||
                        window.matchMedia("(prefers-reduced-motion: reduce)")
                          .matches
                          ? "instant"
                          : "smooth",
                    });
              }}
            >
              <span>{icon}</span>
              {name}
              {tab === name && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-expedition">
          <span className="tiny-label">EKSPEDISI PERTAMAMU</span>
          <img src={asset("shark")} alt="" />
          <h3>
            Petualangan besar.
            <br />
            Mulai dari rasa ingin tahu.
          </h3>
          <p>Tidak perlu jago coding untuk mulai menjelajah.</p>
          <button onClick={() => setModal("help")}>
            Kenali cara bermain <span>↗</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <span className="connection-dot" /> Mode eksplorasi lokal
          <button
            onClick={() => setStill(!still)}
            aria-pressed={still}
            aria-label="Kurangi animasi"
          >
            {still ? "◷" : "≈"}
          </button>
        </div>
      </aside>
      <div className="hud-body">
        <header className="hud-topbar">
          <div>
            <span className="breadcrumb">Ruang eksplorasi</span>
            <span className="crumb-slash">/</span>
            <strong>{tab}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-chip">
              <span className="connection-dot" />
              Tanpa akun
            </span>
            <button
              className="player-chip"
              onClick={() => setModal("progress")}
            >
              <span className="avatar">E</span>
              <span>
                Explorer<small>Engineer pemula</small>
              </span>
              <span>⌄</span>
            </button>
          </div>
        </header>
        <main id="hud-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">SIAP MENYELAM LEBIH DALAM?</p>
              <h1>
                Halo, Explorer <span className="wave">✦</span>
              </h1>
              <p>
                Samudra ide menantimu. Satu keputusan bisa mengubah segalanya.
              </p>
            </div>
            <span className="chapter-pill">
              ◈ &nbsp; CHAPTER 01 · THE BEGINNING
            </span>
          </div>
          <section
            className="expedition-hero"
            aria-label="Ekspedisi MatchingShark"
          >
            <img
              className="hero-scene"
              src={asset("expedition")}
              alt="Hiu penjelajah futuristik di reruntuhan laut dengan kristal oranye dan ungu"
            />
            <div className="hero-shade" />
            <span className="live-badge">
              <span /> EKSPEDISI TERBUKA
            </span>
            <div className="hero-copy">
              <p className="hero-kicker">
                BUKAN SEKADAR MAIN. BELAJAR MENGAMBIL KEPUTUSAN.
              </p>
              <h2>
                Selami dunia.
                <br />
                Bangun cara berpikirmu.
              </h2>
              <p>
                Jadilah engineer di dunia bawah laut. Pecahkan masalah nyata,
                satu misi dalam satu waktu.
              </p>
              <div className="hero-actions">
                <button className="primary-cta" onClick={start}>
                  Mulai petualangan <span>→</span>
                </button>
                <button className="glass-cta" onClick={() => setModal("help")}>
                  ▷ &nbsp; Cara bermain
                </button>
              </div>
              <div className="hero-meta">
                <span>◷ ±3 menit per misi</span>
                <span>◉ Ramah pemula</span>
                <span>✓ Tanpa instalasi</span>
              </div>
            </div>
            <div className="hero-location">
              <span>◎</span>
              <div>
                ABYSSAL EXPEDITION
                <small>Pelabuhan awal · Kedalaman 120 m</small>
              </div>
            </div>
          </section>
          <section className="status-strip" aria-label="Status petualangan">
            <div>
              <span className="stat-icon purple">⚑</span>
              <div>
                <small>PERJALANANMU</small>
                <strong>
                  {complete ? "1" : "0"} <span>/ 1 misi demo</span>
                </strong>
              </div>
            </div>
            <div>
              <span className="stat-icon amber">◇</span>
              <div>
                <small>BUKTI KOMPETENSI</small>
                <strong>
                  {complete ? "2" : "0"} <span>skill dipraktikkan</span>
                </strong>
              </div>
            </div>
            <div>
              <span className="stat-icon cyan">◎</span>
              <div>
                <small>WILAYAH AKTIF</small>
                <strong>
                  Pelabuhan <span>Kebutuhan</span>
                </strong>
              </div>
            </div>
            <button onClick={() => setModal("progress")}>
              Lihat progres <span>↗</span>
            </button>
          </section>
          <div className="lower-grid">
            <section id="islands" className="islands-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PETA PETUALANGAN</p>
                  <h2>
                    Pilih tujuan eksplorasimu<span>.</span>
                  </h2>
                </div>
                <span className="map-caption">01 / 03 WILAYAH AKTIF</span>
              </div>
              <div className="island-cards">
                {islands.map((island, i) => (
                  <button
                    className={`island-card island-${i}`}
                    key={island.name}
                    onClick={() => (i === 0 ? start() : setModal(i))}
                  >
                    <div className="island-art">
                      <span className="island-number">{island.icon}</span>
                      <span
                        className={`island-state ${i === 0 ? "available" : ""}`}
                      >
                        {i === 0
                          ? complete
                            ? "✓ Selesai"
                            : "● Mulai di sini"
                          : "◈ Pratinjau"}
                      </span>
                      <img src={asset(island.image)} alt="" />
                    </div>
                    <div className="island-text">
                      <small>{island.skill}</small>
                      <h3>{island.name}</h3>
                      <p>{island.description}</p>
                      <div className="island-footer">
                        <span>
                          {i === 0
                            ? "1 misi demo · ±3 menit"
                            : "Intip wilayah berikutnya"}
                        </span>
                        <span>↗</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
            <aside className="mission-panel">
              <p className="eyebrow">MISI REKOMENDASI</p>
              <span className="mission-symbol">⌁</span>
              <span className="difficulty">PEMULA · REQUIREMENT</span>
              <h2>
                Alarm yang
                <br />
                salah.
              </h2>
              <p>
                Alarm pelabuhan terus berbunyi. Bisakah kamu menemukan kebutuhan
                yang sebenarnya?
              </p>
              <div className="mission-tags">
                <span>◷ ±3 menit</span>
                <span>3 keputusan</span>
              </div>
              <button onClick={start}>
                Terima misi <span>→</span>
              </button>
              <small>Kesalahan adalah bagian dari eksplorasi.</small>
            </aside>
          </div>
          <footer className="hud-footer">
            <span>
              ◈ &nbsp; Belajar bukan tentang selalu benar. Tapi berani mencari
              tahu.
            </span>
            <a href="?view=landing">Tentang MatchingShark ↗</a>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        className="hud-dialog"
        onCancel={() => setModal(null)}
        aria-labelledby="hud-dialog-title"
      >
        <button
          className="close-dialog"
          onClick={() => setModal(null)}
          aria-label="Tutup dialog"
        >
          ×
        </button>
        {modal === "mission" ? (
          <>
            <p className="eyebrow">MISI 01 · TAHAP {step + 1} / 3</p>
            <h2 id="hud-dialog-title" tabIndex={-1}>
              {q.title}
            </h2>
            <div className="mission-progress">
              <span style={{ width: `${((step + 1) / 3) * 100}%` }} />
            </div>
            <p className="dialog-brief">{q.brief}</p>
            <fieldset key={step}>
              <legend>{q.question}</legend>
              {q.answers.map((text, i) => (
                <label className={answer === i ? "chosen" : ""} key={text}>
                  <input
                    type="radio"
                    name="decision"
                    checked={answer === i}
                    onChange={() => {
                      setAnswer(i);
                      setChecked(false);
                    }}
                  />
                  {text}
                </label>
              ))}
            </fieldset>
            <div aria-live="polite">
              {checked && (
                <p
                  className={`answer-feedback ${answer === q.correct ? "correct" : ""}`}
                >
                  {answer === q.correct
                    ? "✓ Tepat. "
                    : "↻ Coba pertimbangkan lagi. "}
                  {q.feedback}
                </p>
              )}
            </div>
            {checked && answer === q.correct ? (
              <button className="primary-cta" onClick={next}>
                {step === 2
                  ? "Lihat hasil eksplorasi"
                  : "Lanjutkan investigasi"}{" "}
                →
              </button>
            ) : (
              <button
                className="primary-cta"
                disabled={answer === null}
                onClick={() => setChecked(true)}
              >
                Uji keputusan →
              </button>
            )}
          </>
        ) : modal === "progress" ? (
          <>
            <p className="eyebrow">CATATAN EXPLORER</p>
            <h2 id="hud-dialog-title" tabIndex={-1}>
              {complete
                ? "Langkah kecil. Pemahaman baru."
                : "Petualanganmu baru dimulai."}
            </h2>
            <p>
              {complete
                ? "Kamu menyelesaikan demo Alarm yang Salah. Dua kemampuan mulai dipraktikkan:"
                : "Selesaikan misi pertama untuk mencatat bukti belajarmu."}
            </p>
            {complete && (
              <ul>
                <li>Mengklarifikasi kebutuhan sebelum memilih teknologi.</li>
                <li>
                  Menggunakan kriteria yang dapat diuji untuk memeriksa
                  keputusan.
                </li>
              </ul>
            )}
            <p className="storage-note">
              Progres demo disimpan di browser ini, bukan lintas perangkat. Satu
              misi belum membuktikan penguasaan kompetensi.
            </p>
            {storageError && (
              <p role="alert">
                Penyimpanan tidak tersedia. Progres hanya tersimpan selama
                halaman terbuka.
              </p>
            )}
            <button className="primary-cta" onClick={start}>
              {complete ? "Mainkan ulang" : "Mulai misi pertama"} →
            </button>
          </>
        ) : typeof modal === "number" ? (
          <>
            <p className="eyebrow">PRATINJAU WILAYAH</p>
            <h2 id="hud-dialog-title" tabIndex={-1}>
              {islands[modal].name}
            </h2>
            <img
              className="preview-crystal"
              src={asset(islands[modal].image)}
              alt=""
            />
            <p>{islands[modal].description}</p>
            <p>
              Wilayah ini masih berupa pratinjau, belum memiliki misi playable.
              Jelajahi demo Pelabuhan Kebutuhan terlebih dahulu.
            </p>
            <button className="primary-cta" onClick={start}>
              Ke misi yang tersedia →
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">PANDUAN EKSPEDISI</p>
            <h2 id="hud-dialog-title" tabIndex={-1}>
              Rasa ingin tahu adalah bekalmu.
            </h2>
            <ol className="help-steps">
              <li>
                <strong>Selidiki masalah.</strong>
                <p>Baca situasi dan temukan kebutuhan pengguna.</p>
              </li>
              <li>
                <strong>Ambil keputusan.</strong>
                <p>
                  Pilih jawaban, lalu uji alasanmu. Tidak ada timer atau
                  penalti.
                </p>
              </li>
              <li>
                <strong>Pelajari dampaknya.</strong>
                <p>
                  Baca feedback, perbaiki pilihan, dan lanjutkan eksplorasi.
                </p>
              </li>
            </ol>
            <button className="primary-cta" onClick={start}>
              Siap, mulai menyelam →
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
