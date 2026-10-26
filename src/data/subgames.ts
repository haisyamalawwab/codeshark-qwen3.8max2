/* Katalog sub-game CodeShark Academy.
   Halaman utama (Dashboard) adalah HUB: pemain memilih arena dulu,
   baru masuk ke Peta Pertemuan / Misi dengan arena tersebut.
   Pilihan terakhir disimpan di localStorage agar konsisten antar sesi.
   Catatan: MK Sistem Aplikasi Web — Backend Dasar (ci_backend/py_backend)
   dan modul Cross Platform (crossplatform) telah diarsipkan & dilepas
   dari aplikasi pada 26-10-2026 — lihat folder arsip/ serta
   docs/040 dan docs/041. */

export type SubGameId = "tower" | "shark";

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
  /** "ketik" = TypingGame, "susun" = TowerPuzzle */
  mode: "ketik" | "susun";
}

export const SUBGAMES: Record<SubGameId, SubGame> = {
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
  "tower",
  "shark",
];

const KEY = "codeshark:subgame:v1";

export function loadSubGame(fallback: SubGameId): SubGameId {
  try {
    const raw = localStorage.getItem(KEY);
    if (
      raw === "tower" ||
      raw === "shark"
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
