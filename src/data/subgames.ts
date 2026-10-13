/* Katalog sub-game CodeShark Academy.
   Halaman utama (Dashboard) adalah HUB: pemain memilih arena dulu,
   baru masuk ke Peta Pertemuan / Misi dengan arena tersebut.
   Pilihan terakhir disimpan di localStorage agar konsisten antar sesi. */

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
    tagline: "Puzzle Susun Blok • Ramah HP",
    desc: "Susun blok HTML/CSS/JS sesuai urutan menjadi menara. Ketuk saja — tanpa keyboard fisik.",
    points: ["Tanpa mengetik simbol", "Tombol besar sentuh", "Ada petunjuk & undo"],
    cta: "Main Tower",
    mode: "susun",
  },
  shark: {
    id: "shark",
    name: "CodeShark",
    short: "Shark Typer",
    tagline: "Shark Typer • Ketik Kode",
    desc: "Ketik ulang kode persis seperti aslinya sambil mengusir hiu. Butuh keyboard fisik.",
    points: ["Keyboard fisik", "Combo & WPM", "Akurasi presisi"],
    cta: "Main Typer",
    mode: "ketik",
  },
};

export const SUBGAME_ORDER: SubGameId[] = ["tower", "shark"];

const KEY = "codeshark:subgame:v1";

export function loadSubGame(fallback: SubGameId): SubGameId {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === "tower" || raw === "shark") return raw;
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
