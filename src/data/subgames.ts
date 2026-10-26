/* Katalog sub-game CodeShark Academy.
   Halaman utama (Dashboard) adalah HUB: pemain memilih arena dulu,
   baru masuk ke Peta Pertemuan / Misi dengan arena tersebut.
   Pilihan terakhir disimpan di localStorage agar konsisten antar sesi.
   Catatan: MK Sistem Aplikasi Web — Backend Dasar (ci_backend/py_backend)
   diarsipkan & dilepas dari aplikasi pada 26-10-2026 — lihat
   arsip/sistem-aplikasi-web-backend-dasar_26102026_1915.zip dan
   docs/040_pengarsipan-dan-pelepasan-mk-sistem-aplikasi-web_26102026_1915.md. */

export type SubGameId = "tower" | "shark" | "crossplatform";

export interface SubGame {
  id: SubGameId;
  /** nama lengkap di kartu hub */
  name: string;
  /** label singkat untuk chip/header */
  short: string;
  tagline: string;
  desc: string;
  points: string[];
  cta: string;
  /** "ketik" = TypingGame, "susun" = TowerPuzzle, "simulator" = CrossPlatformLab */
  mode: "ketik" | "susun" | "simulator";
}

export const SUBGAMES: Record<SubGameId, SubGame> = {
  crossplatform: {
    id: "crossplatform",
    name: "CrossPlatform Lab",
    short: "React Native",
    tagline: "React Native & Expo • Simulator Mobile HP",
    desc: "MK Sistem Aplikasi Lintas Platform (16 Pertemuan): Setup Expo, Core Components, Flexbox, State Hooks, React Navigation, AsyncStorage, Context, Auth, Firestore CRUD, Native Camera/GPS, sampai EAS Build APK!",
    points: ["16 Pertemuan RPS", "Simulator HP Live", "EAS Build APK"],
    cta: "Buka CrossPlatform Lab",
    mode: "simulator",
  },
  tower: {
    id: "tower",
    name: "Coding Tower",
    short: "Tower",
    tagline: "Susun Balok • Tanpa Keyboard",
    desc: "Susun balok jadi menara. Ketuk saja.",
    points: ["Ketuk saja", "Tombol besar"],
    cta: "Pilih Tower",
    mode: "susun",
  },
  shark: {
    id: "shark",
    name: "CodeShark",
    short: "Shark Typer",
    tagline: "Ketik Kode • Usir Hiu",
    desc: "Ketik kode, usir hiu.",
    points: ["Butuh keyboard fisik"],
    cta: "Pilih Shark",
    mode: "ketik",
  },
};

export const SUBGAME_ORDER: SubGameId[] = [
  "crossplatform",
  "tower",
  "shark",
];

const KEY = "codeshark:subgame:v1";

export function loadSubGame(fallback: SubGameId): SubGameId {
  try {
    const raw = localStorage.getItem(KEY);
    if (
      raw === "tower" ||
      raw === "shark" ||
      raw === "crossplatform"
    ) {
      return raw;
    }
  } catch {
    /* abaikan */
  }
  return fallback;
}

export function saveSubGame(id: SubGameId) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* abaikan */
  }
}
