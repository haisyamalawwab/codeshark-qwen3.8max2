/* ============ MATERI RPL BERBASIS DOKUMEN .md PER TAHAP (P1-P6) ============
   Sumber konten: /content/rpl/*.md — dimuat sebagai raw text saat build,
   lalu dirender dengan parser markdown ringan (src/lib/markdown.ts),
   mengikuti pola materiHtml.ts. Gambar pada dokumen memakai placeholder
   "%%IMG:<kunci>%%" yang terdaftar di katalog src/lib/figures.tsx
   (ilustrasi raster src/assets/materi-rpl/ + diagram SVG notasi).
   Loader ini sengaja belum dihubungkan ke kurikulum/UI game; integrasi UI
   menunggu keputusan desain progres per-MK (lihat docs/042 & docs/047). */

import md01 from "../../content/rpl/01-pengantar-rpl-sdlc.md?raw";
import md02 from "../../content/rpl/02-model-proses.md?raw";
import md03 from "../../content/rpl/03-rekayasa-kebutuhan.md?raw";
import md04 from "../../content/rpl/04-uml-usecase-activity.md?raw";
import md05 from "../../content/rpl/05-uml-class-sequence-desain.md?raw";
import md06 from "../../content/rpl/06-pengujian-pemeliharaan-mini-project.md?raw";
import type { MdDoc } from "./materiHtml";

/** judul = baris "# ..." pertama di dokumen */
const firstTitle = (src: string): string =>
  src.match(/^#\s+(.+)$/m)?.[1].trim() ?? "Materi";

const RAW: Omit<MdDoc, "title">[] = [
  { no: 1, file: "01-pengantar-rpl-sdlc.md", source: md01 },
  { no: 2, file: "02-model-proses.md", source: md02 },
  { no: 3, file: "03-rekayasa-kebutuhan.md", source: md03 },
  { no: 4, file: "04-uml-usecase-activity.md", source: md04 },
  { no: 5, file: "05-uml-class-sequence-desain.md", source: md05 },
  { no: 6, file: "06-pengujian-pemeliharaan-mini-project.md", source: md06 },
];

export const RPL_DOCS: MdDoc[] = RAW.map((d) => ({ ...d, title: firstTitle(d.source) }));

export const getRplDoc = (no: number): MdDoc | undefined =>
  RPL_DOCS.find((d) => d.no === no);
