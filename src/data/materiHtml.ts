/* ============ MATERI HTML BERBASIS DOKUMEN .md PER TAHAP (P1-P6) ============
   Sumber konten: /content/html/*.md — dimuat sebagai raw text saat build,
   lalu dirender dengan parser markdown ringan (src/lib/markdown.ts).
   Setiap dokumen dipetakan ke pertemuan di curriculum.ts agar latihan ketik
   per pertemuan tetap menjadi ajang praktik 16x. */

import md01 from "../../content/html/01-mengenal-html.md?raw";
import md02 from "../../content/html/02-anatomi-dokumen.md?raw";
import md03 from "../../content/html/03-teks-dan-daftar.md?raw";
import md04 from "../../content/html/04-media-navigasi.md?raw";
import md05 from "../../content/html/05-formulir-semantik.md?raw";
import md06 from "../../content/html/06-mini-project-gladi-uts.md?raw";

export interface MdDoc {
  /** nomor pertemuan (1-6 untuk tahap HTML) */
  no: number;
  file: string;
  title: string;
  source: string;
}

/** judul = baris "# ..." pertama di dokumen */
const firstTitle = (src: string): string =>
  src.match(/^#\s+(.+)$/m)?.[1].trim() ?? "Materi";

const RAW: Omit<MdDoc, "title">[] = [
  { no: 1, file: "01-mengenal-html.md", source: md01 },
  { no: 2, file: "02-anatomi-dokumen.md", source: md02 },
  { no: 3, file: "03-teks-dan-daftar.md", source: md03 },
  { no: 4, file: "04-media-navigasi.md", source: md04 },
  { no: 5, file: "05-formulir-semantik.md", source: md05 },
  { no: 6, file: "06-mini-project-gladi-uts.md", source: md06 },
];

export const HTML_DOCS: MdDoc[] = RAW.map((d) => ({ ...d, title: firstTitle(d.source) }));

export const getHtmlDoc = (no: number): MdDoc | undefined =>
  HTML_DOCS.find((d) => d.no === no);
