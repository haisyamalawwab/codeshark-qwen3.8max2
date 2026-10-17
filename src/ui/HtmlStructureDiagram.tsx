import { useState } from "react";
import { sfx } from "../lib/audio";
import { IconBook, IconCheck, IconCode, IconSparkles } from "./icons";

interface Props {
  className?: string;
}

interface TagNode {
  tag: string;
  category: "root" | "meta" | "content" | "group";
  analogy: string;
  description: string;
  codeSnippet: string;
}

const NODES: Record<string, TagNode> = {
  html: {
    tag: "<html>",
    category: "root",
    analogy: "Kulit Luar / Lambung Utama Kapal",
    description: "Elemen akar yang membungkus seluruh dokumen web dari ujung ke ujung.",
    codeSnippet: '<html lang="id">\n  <!-- Semua isi ada di sini -->\n</html>',
  },
  head: {
    tag: "<head>",
    category: "meta",
    analogy: "Ruang Komando Radar Rahasia",
    description: "Menyimpan informasi metadata, judul tab browser, koneksi stylesheet, font, dan SEO. Tidak terlihat langsung di layar pengguna.",
    codeSnippet: "<head>\n  <title>Codeshark</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>",
  },
  body: {
    tag: "<body>",
    category: "root",
    analogy: "Dek Utama & Seluruh Kabin yang Terlihat",
    description: "Wadah seluruh elemen visual yang dilihat dan disentuh oleh pengguna di layar peramban.",
    codeSnippet: "<body>\n  <header>...</header>\n  <main>...</main>\n  <footer>...</footer>\n</body>",
  },
  header: {
    tag: "<header>",
    category: "group",
    analogy: "Anjungan Navigasi & Logo Kapal",
    description: "Bagian kepala halaman: memuat logo, nama situs, menu navigasi, dan status level kadet.",
    codeSnippet: "<header>\n  <img src=\"logo.svg\" alt=\"Logo\">\n  <nav><a href=\"#\">Home</a></nav>\n</header>",
  },
  main: {
    tag: "<main>",
    category: "group",
    analogy: "Laboratorium Riset & Misi Utama",
    description: "Konten pokok paling penting dari halaman web. Tidak boleh ada lebih dari satu <main> di satu halaman.",
    codeSnippet: "<main>\n  <h1>Misi Penyelaman</h1>\n  <p>Deskripsi tantangan koding...</p>\n</main>",
  },
  h1: {
    tag: "<h1>",
    category: "content",
    analogy: "Papan Nama Utama Dek / Judul Misi Terbesar",
    description: "Tingkat judul tertinggi. Menjadi acuan utama pembaca dan mesin pencari (SEO) untuk mengenali tema halaman.",
    codeSnippet: "<h1>Codeshark Academy: Belajar HTML</h1>",
  },
  p: {
    tag: "<p>",
    category: "content",
    analogy: "Catatan Log Harian & Paragraf Cerita",
    description: "Menyimpan teks kalimat deskripsi atau artikel secara rapi dengan spasi vertikal otomatis.",
    codeSnippet: "<p>Kadet menyelam ke kedalaman 500 meter untuk menemukan kabel serat optik.</p>",
  },
  ul: {
    tag: "<ul> & <li>",
    category: "content",
    analogy: "Daftar Perlengkapan Menyelam (Bullet Points)",
    description: "Menyajikan daftar poin tanpa nomor urut tertentu. Menggunakan tag <li> untuk setiap butir barang.",
    codeSnippet: "<ul>\n  <li>Kacamata Selam Neon</li>\n  <li>Tabung Oksigen Cyber</li>\n</ul>",
  },
};

export default function HtmlStructureDiagram({ className = "" }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("html");

  const active = NODES[selectedTag] || NODES.html;

  const handleSelect = (key: string) => {
    sfx.click();
    setSelectedTag(key);
  };

  return (
    <div className={`p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[rgba(6,22,38,0.95)] to-[rgba(3,14,24,0.98)] border border-[rgba(46,230,200,0.35)] shadow-[0_0_35px_rgba(46,230,200,0.15)] select-none ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(126,196,236,0.15)]">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--teal)] flex items-center gap-1">
            <IconSparkles size={11} /> Diagram Arsitektur Semantik HTML
          </span>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight mt-0.5">
            Pohon Struktur Hirarki DOM (Document Object Model)
          </h3>
          <p className="text-xs text-[var(--dim)] mt-1">
            Klik setiap nodus di kapal selam untuk melihat analogi dan fungsi semantiknya:
          </p>
        </div>
        <span className="chip !text-[var(--teal)] !border-[rgba(46,230,200,0.4)] shrink-0 self-start sm:self-auto">
          🏷️ 8 Tag Wajib Mahasiswa
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Sisi Kiri: Diagram Pohon Visual Interaktif */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[rgba(3,11,20,0.85)] border border-[rgba(126,196,236,0.2)]">
          <div className="space-y-2 font-mono text-xs">
            {/* Root: HTML */}
            <button
              type="button"
              onClick={() => handleSelect("html")}
              className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedTag === "html"
                  ? "bg-[rgba(46,230,200,0.2)] border-[#2ee6c8] text-white shadow-[0_0_15px_rgba(46,230,200,0.3)] font-bold"
                  : "bg-[rgba(6,22,38,0.7)] border-[rgba(126,196,236,0.2)] text-[var(--dim)] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2ee6c8]" />
                <span>&lt;html&gt; (Root Document)</span>
              </span>
              <span className="text-[10px] font-sans font-bold text-[var(--teal)]">Akar Dokumen</span>
            </button>

            {/* Cabang 1: HEAD */}
            <div className="pl-5 border-l-2 border-[rgba(46,230,200,0.3)] ml-3 space-y-2">
              <button
                type="button"
                onClick={() => handleSelect("head")}
                className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedTag === "head"
                    ? "bg-[rgba(255,194,71,0.2)] border-[#ffc247] text-white shadow-[0_0_15px_rgba(255,194,71,0.3)] font-bold"
                    : "bg-[rgba(6,22,38,0.7)] border-[rgba(126,196,236,0.18)] text-[var(--dim)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffc247]" />
                  <span>&lt;head&gt; (Meta & Title)</span>
                </span>
                <span className="text-[10px] font-sans font-bold text-amber-300">Data Tersembunyi</span>
              </button>

              {/* Cabang 2: BODY */}
              <button
                type="button"
                onClick={() => handleSelect("body")}
                className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedTag === "body"
                    ? "bg-[rgba(46,230,200,0.2)] border-[#2ee6c8] text-white shadow-[0_0_15px_rgba(46,230,200,0.3)] font-bold"
                    : "bg-[rgba(6,22,38,0.7)] border-[rgba(126,196,236,0.2)] text-[var(--dim)] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#45c6ff]" />
                  <span>&lt;body&gt; (Visual Dek Utama)</span>
                </span>
                <span className="text-[10px] font-sans font-bold text-[var(--cyan)]">Area Tampilan</span>
              </button>

              {/* Cabang Anak di dalam BODY */}
              <div className="pl-5 border-l-2 border-[rgba(69,198,255,0.3)] ml-3 space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleSelect("header")}
                  className={`w-full p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedTag === "header"
                      ? "bg-[rgba(56,189,248,0.25)] border-sky-400 text-white font-bold"
                      : "bg-[rgba(4,16,28,0.6)] border-[rgba(126,196,236,0.15)] text-[var(--dim)] hover:text-white"
                  }`}
                >
                  <span>&lt;header&gt; Logo & Navigasi</span>
                  <span className="text-[10px] text-sky-300">Kepala</span>
                </button>

                <div className="p-2 rounded-lg bg-[rgba(6,24,42,0.6)] border border-[rgba(126,196,236,0.15)] space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelect("main")}
                    className={`w-full p-1.5 rounded-md border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedTag === "main"
                        ? "bg-[rgba(46,230,200,0.25)] border-[#2ee6c8] text-white font-bold"
                        : "bg-[rgba(3,12,20,0.6)] border-[rgba(126,196,236,0.15)] text-[var(--dim)] hover:text-white"
                    }`}
                  >
                    <span>&lt;main&gt; Inti Konten</span>
                    <span className="text-[10px] text-[var(--teal)]">Utama</span>
                  </button>

                  <div className="pl-3 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleSelect("h1")}
                      className={`w-full p-1 rounded border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedTag === "h1"
                          ? "bg-[rgba(255,194,71,0.25)] border-[#ffc247] text-white font-bold"
                          : "bg-transparent border-transparent text-[var(--dim)] hover:text-white"
                      }`}
                    >
                      <span>├── &lt;h1&gt; Judul Utama</span>
                      <span className="text-[10px] text-amber-300">Heading 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect("p")}
                      className={`w-full p-1 rounded border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedTag === "p"
                          ? "bg-[rgba(46,230,200,0.25)] border-[#2ee6c8] text-white font-bold"
                          : "bg-transparent border-transparent text-[var(--dim)] hover:text-white"
                      }`}
                    >
                      <span>├── &lt;p&gt; Paragraf Konten</span>
                      <span className="text-[10px] text-[var(--teal)]">Teks</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect("ul")}
                      className={`w-full p-1 rounded border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedTag === "ul"
                          ? "bg-[rgba(192,132,252,0.25)] border-[#c084fc] text-white font-bold"
                          : "bg-transparent border-transparent text-[var(--dim)] hover:text-white"
                      }`}
                    >
                      <span>└── &lt;ul&gt; &lt;li&gt; Daftar Butir</span>
                      <span className="text-[10px] text-purple-300">List</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Kartu Rincian Analogi & Sintaks */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-[rgba(6,24,42,0.85)] border border-[rgba(46,230,200,0.3)] shadow-[0_0_20px_rgba(46,230,200,0.1)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-lg text-[var(--teal)]">
                {active.tag}
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[rgba(46,230,200,0.15)] text-[var(--teal)] border border-[rgba(46,230,200,0.3)]">
                {active.category.toUpperCase()}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-[rgba(255,194,71,0.1)] border border-[rgba(255,194,71,0.3)]">
              <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                <IconBook size={11} /> Analogi Kapal Selam:
              </span>
              <p className="font-display font-extrabold text-sm text-white mt-0.5">
                {active.analogy}
              </p>
            </div>

            <p className="text-xs text-[var(--dim)] mt-3 leading-relaxed">
              {active.description}
            </p>

            <div className="mt-3.5">
              <span className="text-[10px] uppercase font-mono font-bold text-[var(--faint)] flex items-center gap-1 mb-1">
                <IconCode size={11} /> Contoh Kode Praktis:
              </span>
              <pre className="p-2.5 rounded-lg bg-[rgba(2,8,15,0.95)] border border-[rgba(126,196,236,0.15)] font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                {active.codeSnippet}
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(126,196,236,0.15)] flex items-center gap-2 text-xs text-slate-300">
            <IconCheck size={14} className="text-[var(--teal)] shrink-0" />
            <span className="text-[11px]">Tag semantik membantu peramban merender halaman secara teratur & aksesibel.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
