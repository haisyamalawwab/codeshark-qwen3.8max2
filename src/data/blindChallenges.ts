/* ============ SOAL — BLIND LIVE-CODING CHALLENGE ============
   Rancangan: docs/052 bagian 4. Soal ditulis sebagai daftar tuntutan, bukan kode.
   Tiap tuntutan membawa satu cek spesifikasi (fungsi murni atas kode akhir).
   Cek sengaja longgar terhadap spasi, jenis kutip, dan bentuk fungsi yang setara:
   yang dinilai adalah "tuntutannya terpenuhi", bukan "sama persis dengan acuan".

   `reference` adalah satu jawaban acuan (170–250 karakter) yang dipakai uji unit
   untuk memastikan soal bisa dijawab dan ceknya konsisten. Tidak ditampilkan. */
import type { AgeId, SaveData } from "../lib/storage";
import type { Regions } from "../lib/trapLint";
import { splitRegions } from "../lib/trapLint";
import { maskJs } from "../lib/blindLint";

export interface BlindDemand {
  id: string;
  /** kalimat tuntutan yang dibaca mahasiswa */
  text: string;
  /** ringkasan untuk rapor */
  label: string;
  test: (r: Regions) => boolean;
}

export interface BlindBrief {
  id: string;
  title: string;
  demands: BlindDemand[];
  reference: string;
}

/* ---------- pembantu cek ---------- */

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const textOf = (inner: string) => inner.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

interface ElWant { id?: string; cls?: string; text?: string }

/** daftar isi elemen `tag` yang atributnya cocok */
function elements(html: string, tag: string, want: ElWant = {}): string[] {
  const re = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}\\s*>`, "gi");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (want.id && !new RegExp(`\\bid\\s*=\\s*(?:"${esc(want.id)}"|'${esc(want.id)}'|${esc(want.id)}(?=\\s|$))`, "i").test(attrs)) continue;
    if (want.cls && !new RegExp(`\\bclass\\s*=\\s*(?:"[^"]*\\b${esc(want.cls)}\\b[^"]*"|'[^']*\\b${esc(want.cls)}\\b[^']*'|${esc(want.cls)}(?=\\s|$))`, "i").test(attrs)) continue;
    if (want.text !== undefined && textOf(m[2]) !== want.text.toLowerCase()) continue;
    out.push(m[2]);
  }
  return out;
}

const hasEl = (html: string, tag: string, want: ElWant = {}) => elements(html, tag, want).length > 0;

/** deklarasi gabungan dari semua aturan CSS yang selektornya lolos `sel` */
function cssDecls(css: string, sel: (selector: string) => boolean): Record<string, string> {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const out: Record<string, string> = {};
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (!m[1].split(",").some((s) => sel(s.trim().toLowerCase()))) continue;
    for (const decl of m[2].split(";")) {
      const at = decl.indexOf(":");
      if (at < 0) continue;
      out[decl.slice(0, at).trim().toLowerCase()] = decl.slice(at + 1).trim().toLowerCase().replace(/\s+/g, " ");
    }
  }
  return out;
}

const WHITE = new Set(["white", "#fff", "#ffffff"]);
const BLACK = new Set(["black", "#000", "#000000"]);
const GREEN = new Set(["green", "#008000"]);

const jsOf = (r: Regions) => maskJs(r.js);

/** `let|var|const nama = nilai` */
const declares = (js: string, name: string, value: string) =>
  new RegExp(`\\b(?:let|var|const)\\s+${esc(name)}\\s*=\\s*${value}`).test(js);

/** isi fungsi bernama `name` (deklarasi, ekspresi fungsi, atau fungsi panah); null bila tidak ada */
function fnBody(js: string, name: string): { params: string; body: string } | null {
  const n = esc(name);
  const heads = [
    new RegExp(`\\bfunction\\s+${n}\\s*\\(([^)]*)\\)\\s*`, "g"),
    new RegExp(`\\b(?:let|var|const)\\s+${n}\\s*=\\s*function\\s*\\w*\\s*\\(([^)]*)\\)\\s*`, "g"),
    new RegExp(`\\b(?:let|var|const)\\s+${n}\\s*=\\s*(?:\\(([^)]*)\\)|([A-Za-z_$][\\w$]*))\\s*=>\\s*`, "g"),
  ];
  for (const re of heads) {
    const m = re.exec(js);
    if (!m) continue;
    const params = (m[1] ?? m[2] ?? "").trim();
    const start = m.index + m[0].length;
    if (js[start] === "{") {
      let depth = 0;
      for (let i = start; i < js.length; i++) {
        if (js[i] === "{") depth += 1;
        else if (js[i] === "}") {
          depth -= 1;
          if (depth === 0) return { params, body: js.slice(start + 1, i) };
        }
      }
      return { params, body: js.slice(start + 1) };
    }
    /* fungsi panah tanpa kurung kurawal: isi = sampai akhir pernyataan */
    const end = js.slice(start).search(/[;\n]/);
    return { params, body: end < 0 ? js.slice(start) : js.slice(start, start + end) };
  }
  return null;
}

const changesBy = (body: string, name: string, op: "+" | "-") => {
  const n = esc(name);
  const o = op === "+" ? "\\+" : "-";
  return new RegExp(`\\b${n}\\s*${o}${o}|${o}${o}\\s*${n}\\b|\\b${n}\\s*${o}=\\s*1\\b|\\b${n}\\s*=\\s*${n}\\s*${o}\\s*1\\b`).test(body);
};

/* ---------- soal ---------- */

const PENGHITUNG: BlindBrief = {
  id: "penghitung",
  title: "Tombol Penghitung",
  demands: [
    {
      id: "tombol",
      text: "Buat tombol ber-id btn bertuliskan Klik.",
      label: "Tombol ber-id btn bertuliskan Klik",
      test: (r) => hasEl(r.html, "button", { id: "btn", text: "Klik" }),
    },
    {
      id: "angka",
      text: "Buat paragraf ber-id angka berisi 0.",
      label: "Paragraf ber-id angka berisi 0",
      test: (r) => hasEl(r.html, "p", { id: "angka", text: "0" }),
    },
    {
      id: "gaya",
      text: "Lewat CSS, beri tombol itu padding 8px dan teks berwarna putih.",
      label: "CSS tombol: padding 8px dan teks putih",
      test: (r) => {
        const d = cssDecls(r.css, (s) => /(^|[\s>+~])button\b/.test(s) || s.includes("#btn"));
        return d.padding === "8px" && WHITE.has(d.color ?? "");
      },
    },
    {
      id: "fungsi",
      text: "Lewat JavaScript, buat variabel n bernilai 0 dan fungsi tambah yang menaikkan n sebesar 1.",
      label: "Variabel n = 0 dan fungsi tambah yang menaikkan n",
      test: (r) => {
        const js = jsOf(r);
        const fn = fnBody(js, "tambah");
        return declares(js, "n", "0\\b") && !!fn && changesBy(fn.body, "n", "+");
      },
    },
  ],
  reference: `<button id="btn">Klik</button>
<p id="angka">0</p>
<style>
button { padding: 8px; color: white; }
</style>
<script>
let n = 0;
function tambah() {
  n = n + 1;
}
</script>
`,
};

const SAPAAN: BlindBrief = {
  id: "sapaan",
  title: "Kartu Sapaan",
  demands: [
    {
      id: "kartu",
      text: "Buat div ber-class kartu yang berisi judul h2 bertuliskan Halo.",
      label: "div ber-class kartu berisi h2 bertuliskan Halo",
      test: (r) => elements(r.html, "div", { cls: "kartu" }).some((inner) => hasEl(inner, "h2", { text: "Halo" })),
    },
    {
      id: "nama",
      text: "Buat paragraf ber-id nama berisi Tamu.",
      label: "Paragraf ber-id nama berisi Tamu",
      test: (r) => hasEl(r.html, "p", { id: "nama", text: "Tamu" }),
    },
    {
      id: "gaya",
      text: "Lewat CSS, beri .kartu padding 12px dan latar (background) hitam.",
      label: "CSS .kartu: padding 12px dan latar hitam",
      test: (r) => {
        const d = cssDecls(r.css, (s) => s.includes(".kartu"));
        return d.padding === "12px" && BLACK.has(d.background ?? d["background-color"] ?? "");
      },
    },
    {
      id: "fungsi",
      text: 'Lewat JavaScript, buat variabel salam berisi teks "Hai" dan fungsi sapa dengan satu parameter yang mengembalikan salam + parameter itu.',
      label: 'Variabel salam = "Hai" dan fungsi sapa yang mengembalikan salam + parameter',
      test: (r) => {
        /* isi string disamarkan oleh maskJs, jadi nilai "Hai" diperiksa pada teks asli */
        const fn = fnBody(jsOf(r), "sapa");
        if (!/\b(?:let|var|const)\s+salam\s*=\s*(["'`])Hai\1/.test(r.js) || !fn) return false;
        const param = fn.params.split(",")[0]?.trim();
        if (!param || fn.params.includes(",")) return false;
        const p = esc(param);
        return new RegExp(`\\bsalam\\s*\\+\\s*${p}\\b|\\b${p}\\s*\\+\\s*salam\\b`).test(fn.body);
      },
    },
  ],
  reference: `<div class="kartu">
  <h2>Halo</h2>
</div>
<p id="nama">Tamu</p>
<style>
.kartu { padding: 12px; background: black; }
</style>
<script>
const salam = "Hai";
function sapa(nama) {
  return salam + nama;
}
</script>
`,
};

const TUGAS: BlindBrief = {
  id: "tugas",
  title: "Daftar Tugas Mini",
  demands: [
    {
      id: "daftar",
      text: "Buat daftar ul ber-id daftar dengan dua butir li: Belajar dan Latihan.",
      label: "ul ber-id daftar dengan butir Belajar dan Latihan",
      test: (r) =>
        elements(r.html, "ul", { id: "daftar" }).some(
          (inner) => hasEl(inner, "li", { text: "Belajar" }) && hasEl(inner, "li", { text: "Latihan" }),
        ),
    },
    {
      id: "tombol",
      text: "Buat tombol ber-id selesai bertuliskan Selesai.",
      label: "Tombol ber-id selesai bertuliskan Selesai",
      test: (r) => hasEl(r.html, "button", { id: "selesai", text: "Selesai" }),
    },
    {
      id: "gaya",
      text: "Lewat CSS, beri li margin 4px dan teks berwarna hijau (green).",
      label: "CSS li: margin 4px dan teks hijau",
      test: (r) => {
        const d = cssDecls(r.css, (s) => /(^|[\s>+~])li\b/.test(s));
        return d.margin === "4px" && GREEN.has(d.color ?? "");
      },
    },
    {
      id: "fungsi",
      text: "Lewat JavaScript, buat variabel sisa bernilai 2 dan fungsi kurangi yang mengurangi sisa sebesar 1.",
      label: "Variabel sisa = 2 dan fungsi kurangi yang mengurangi sisa",
      test: (r) => {
        const js = jsOf(r);
        const fn = fnBody(js, "kurangi");
        return declares(js, "sisa", "2\\b") && !!fn && changesBy(fn.body, "sisa", "-");
      },
    },
  ],
  reference: `<ul id="daftar">
  <li>Belajar</li>
  <li>Latihan</li>
</ul>
<button id="selesai">Selesai</button>
<style>
li { margin: 4px; color: green; }
</style>
<script>
let sisa = 2;
function kurangi() {
  sisa -= 1;
}
</script>
`,
};

export const BLIND_BRIEFS: BlindBrief[] = [PENGHITUNG, SAPAAN, TUGAS];

export function getBlindBrief(id: string): BlindBrief | undefined {
  return BLIND_BRIEFS.find((b) => b.id === id);
}

/** Pilih soal acak; tidak memakai varian yang sama dengan sesi sebelumnya. */
export function pickBlindBrief(lastId?: string | null, rand: () => number = Math.random): BlindBrief {
  const pool = BLIND_BRIEFS.filter((b) => b.id !== lastId);
  const list = pool.length ? pool : BLIND_BRIEFS;
  return list[Math.min(list.length - 1, Math.floor(rand() * list.length))];
}

/** id tuntutan yang terpenuhi oleh kode akhir */
export function checkBlindSpec(brief: BlindBrief, code: string): string[] {
  const r = splitRegions(code);
  return brief.demands.filter((d) => {
    try {
      return d.test(r);
    } catch {
      return false;
    }
  }).map((d) => d.id);
}

/* ============ GERBANG ============
   D1 (docs/052): wajib untuk Mahasiswa/Umum, opsional (kartu Dashboard) untuk
   16–19 tahun, tidak ditampilkan untuk 10–15 tahun.
   D3: wajib satu kali sebelum latihan pertama; pengguna lama juga terkena satu
   kali; di perangkat tanpa keyboard fisik ditunda. */

/** Sakelar gerbang. false = tantangan hanya tersedia lewat kartu Dashboard. */
export const BLIND_GATE_ENABLED = true;
export const BLIND_REQUIRED_AGES: AgeId[] = ["academy"];
export const BLIND_OPTIONAL_AGES: AgeId[] = ["senior"];
/** XP partisipasi — sekali, berapa pun hasilnya */
export const BLIND_PARTICIPATION_XP = 30;

export function blindVisibleFor(age: AgeId | undefined): boolean {
  return !!age && (BLIND_REQUIRED_AGES.includes(age) || BLIND_OPTIONAL_AGES.includes(age));
}

export function needsBlindGate(save: Pick<SaveData, "profile" | "blind">, noKeyboard: boolean): boolean {
  if (!BLIND_GATE_ENABLED) return false;
  const age = save.profile?.age;
  if (!age || !BLIND_REQUIRED_AGES.includes(age)) return false;
  if (noKeyboard) return false;
  if (save.blind?.deferred) return false;
  return (save.blind?.attempts.length ?? 0) === 0;
}
