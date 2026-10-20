/* Katalog sub-game CodeShark Academy.
   Halaman utama (Dashboard) adalah HUB: pemain memilih arena dulu,
   baru masuk ke Peta Pertemuan / Misi dengan arena tersebut.
   Pilihan terakhir disimpan di localStorage agar konsisten antar sesi. */

export type SubGameId = "tower" | "shark" | "crossplatform" | "ci_backend" | "py_backend";

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
  /** "ketik" = TypingGame, "susun" = TowerPuzzle, "simulator" = CrossPlatformLab, "backend_ci" = CiBackendLab, "backend_py" = PyBackendLab */
  mode: "ketik" | "susun" | "simulator" | "backend_ci" | "backend_py";
}

export const SUBGAMES: Record<SubGameId, SubGame> = {
  ci_backend: {
    id: "ci_backend",
    name: "Backend PHP Studio",
    short: "PHP 8 & MySQL",
    tagline: "PHP 8 Native • MySQL Database • phpMyAdmin • cPanel Hosting",
    desc: "MK Sistem Aplikasi Web - Backend Dasar (Jalur A): Arsitektur Client-Server, PHP 8 Native, CRUD MySQL, Form Validation & Sanitasi XSS/SQLi, Relasi 1:N JOIN, Session Auth & Role Admin, sampai Live Deployment ke cPanel Web Hosting!",
    points: ["16 Pertemuan OBE", "PHP 8 Native & MySQL", "cPanel Deployment"],
    cta: "Buka PHP Backend Lab",
    mode: "backend_ci",
  },
  py_backend: {
    id: "py_backend",
    name: "Backend Python Studio",
    short: "Python Django/Flask",
    tagline: "Python 3 & Flask / Django • MySQL Database • WSGI Hosting",
    desc: "MK Sistem Aplikasi Web - Backend Dasar (Jalur B): WSGI & Routing Jinja2, CRUD MySQL, Validasi Form, Relasi 1-to-N JOIN, Session Login & Role Decorator, sampai Deployment cPanel Python App!",
    points: ["16 Pertemuan OBE", "Flask & Django", "cPanel Python WSGI"],
    cta: "Buka Python Backend Lab",
    mode: "backend_py",
  },
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
  "ci_backend",
  "py_backend",
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
      raw === "crossplatform" ||
      raw === "ci_backend" ||
      raw === "py_backend"
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
