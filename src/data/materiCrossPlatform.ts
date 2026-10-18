/* ==========================================================================
   MATERI CROSS-PLATFORM (REACT NATIVE & EXPO) DARI FILE MARKDOWN .md (P1-P16)
   Sumber konten: /content/crossplatform/*.md — dimuat sebagai raw text saat build,
   kemudian diparsing oleh parser markdown (src/lib/markdown.ts).
   Memudahkan dosen, mahasiswa, dan kontributor untuk mengedit dan menambah materi.
   ========================================================================== */

import md01 from "../../content/crossplatform/01-pengantar-environment-setup.md?raw";
import md02 from "../../content/crossplatform/02-javascript-es6-react.md?raw";
import md03 from "../../content/crossplatform/03-core-components-styling-flexbox.md?raw";
import md04 from "../../content/crossplatform/04-state-hooks-events.md?raw";
import md05 from "../../content/crossplatform/05-react-navigation.md?raw";
import md06 from "../../content/crossplatform/06-api-asyncstorage.md?raw";
import md07 from "../../content/crossplatform/07-mini-project-todolist-weather.md?raw";
import md08 from "../../content/crossplatform/08-uts-ujian-teori-praktik.md?raw";
import md09 from "../../content/crossplatform/09-context-api-global-state.md?raw";
import md10 from "../../content/crossplatform/10-authentication-flow.md?raw";
import md11 from "../../content/crossplatform/11-backend-firebase-rest-crud.md?raw";
import md12 from "../../content/crossplatform/12-native-features-camera-location.md?raw";
import md13 from "../../content/crossplatform/13-animasi-performance.md?raw";
import md14 from "../../content/crossplatform/14-testing-debugging-eas-build.md?raw";
import md15 from "../../content/crossplatform/15-mini-project-2-final-lab.md?raw";
import md16 from "../../content/crossplatform/16-uas-showcase-demo.md?raw";

export interface CrossPlatformMdDoc {
  no: number;
  fileName: string;
  title: string;
  source: string;
}

const firstTitle = (src: string): string =>
  src.match(/^#\s+(.+)$/m)?.[1].trim() ?? "Materi Pertemuan";

const RAW_DOCS: Omit<CrossPlatformMdDoc, "title">[] = [
  { no: 1, fileName: "01-pengantar-environment-setup.md", source: md01 },
  { no: 2, fileName: "02-javascript-es6-react.md", source: md02 },
  { no: 3, fileName: "03-core-components-styling-flexbox.md", source: md03 },
  { no: 4, fileName: "04-state-hooks-events.md", source: md04 },
  { no: 5, fileName: "05-react-navigation.md", source: md05 },
  { no: 6, fileName: "06-api-asyncstorage.md", source: md06 },
  { no: 7, fileName: "07-mini-project-todolist-weather.md", source: md07 },
  { no: 8, fileName: "08-uts-ujian-teori-praktik.md", source: md08 },
  { no: 9, fileName: "09-context-api-global-state.md", source: md09 },
  { no: 10, fileName: "10-authentication-flow.md", source: md10 },
  { no: 11, fileName: "11-backend-firebase-rest-crud.md", source: md11 },
  { no: 12, fileName: "12-native-features-camera-location.md", source: md12 },
  { no: 13, fileName: "13-animasi-performance.md", source: md13 },
  { no: 14, fileName: "14-testing-debugging-eas-build.md", source: md14 },
  { no: 15, fileName: "15-mini-project-2-final-lab.md", source: md15 },
  { no: 16, fileName: "16-uas-showcase-demo.md", source: md16 },
];

export const CROSS_PLATFORM_MD_DOCS: CrossPlatformMdDoc[] = RAW_DOCS.map((doc) => ({
  ...doc,
  title: firstTitle(doc.source),
}));

export const getCrossPlatformMdDoc = (no: number): CrossPlatformMdDoc | undefined =>
  CROSS_PLATFORM_MD_DOCS.find((d) => d.no === no);
