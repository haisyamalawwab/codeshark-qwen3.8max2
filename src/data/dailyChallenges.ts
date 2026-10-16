/* ============ SISTEM TANTANGAN HARIAN (DAILY CHALLENGE) ============
   Setiap hari kalender memiliki satu tantangan koding unik berbasis waktu.
   Menyelesaikan tantangan harian memberikan bonus XP & Koin ekstra serta
   menjaga keaktifan Daily Streak pemain. */

import type { Lang } from "../lib/highlight";
import type { Session } from "./quests";

export interface DailyChallenge {
  id: string; // misal "daily:2026-10-15"
  date?: string;
  dayIndex: number;
  title: string;
  tagline: string;
  topic: string;
  lang: Lang;
  difficulty: "Mudah" | "Sedang" | "Tantangan" | "Master";
  bonusXp: number;
  bonusCoins: number;
  passAcc: number;
  code: string;
  intro: string;
  tip: string;
}

const CONSOLE_SHIM = `(function(){function s(t,a){try{parent.postMessage({__cs:true,type:t,text:a.map(function(x){try{return typeof x==="object"?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" ")},"*")}catch(e){}}["log","info","warn","error"].forEach(function(m){console[m]=function(){s(m,[].slice.call(arguments))}});window.onerror=function(m){s("error",[m])};})();`;

/** Koleksi 14 tantangan koding samudra yang berotasi otomatis setiap hari */
export const DAILY_CHALLENGES: Omit<DailyChallenge, "id" | "dayIndex">[] = [
  {
    title: "Navigasi Kedalaman Samudra",
    tagline: "Navigasi Semantik HTML5",
    topic: "HTML5 Navigasi & Zona Laut",
    lang: "html",
    difficulty: "Mudah",
    bonusXp: 140,
    bonusCoins: 30,
    passAcc: 85,
    intro: "Susun baris navigasi semantik untuk kapal selam ekspedisi. Pastikan penulisan atribut aria-label dan kelas navigasi presisi.",
    tip: "Gunakan tag <nav> semantik dan tautan berpasangan dengan id target.",
    code: `<nav class="sonar-nav" aria-label="Zona Kedalaman">\n  <a href="#surface" class="nav-item">0m Permukaan</a>\n  <a href="#twilight" class="nav-item">200m Mesopelagik</a>\n  <a href="#abyss" class="nav-item active">4000m Palung Abisal</a>\n</nav>`,
  },
  {
    title: "Kartu Terumbu Bioluminesensi",
    tagline: "Tata Letak Grid & Neon Glow",
    topic: "CSS Grid & Box Shadow",
    lang: "css",
    difficulty: "Sedang",
    bonusXp: 160,
    bonusCoins: 35,
    passAcc: 90,
    intro: "Dandani kartu informasi terumbu karang dengan efek cahaya bioluminesensi bawah laut menggunakan gradien dan bayangan neon.",
    tip: "Perhatikan nilai hex warna dan sintaks rgba pada properti box-shadow.",
    code: `.coral-card {\n  display: grid;\n  grid-template-columns: 80px 1fr;\n  gap: 1.25rem;\n  padding: 1.25rem;\n  border-radius: 1rem;\n  background: linear-gradient(135deg, #07223b, #0c3859);\n  box-shadow: 0 0 20px rgba(46, 230, 200, 0.35);\n}`,
  },
  {
    title: "Radar Pemindai Sonar",
    tagline: "Filter Array Sensor Kapal Selam",
    topic: "JavaScript Array Filter & Map",
    lang: "js",
    difficulty: "Tantangan",
    bonusXp: 180,
    bonusCoins: 40,
    passAcc: 90,
    intro: "Ketik algoritma pemindaian sinyal sonar untuk memisahkan anomali laut dalam dari kebisingan arus air.",
    tip: "Perhatikan arrow function di dalam method filter dan template literals.",
    code: `function scanSonar(signals, threshold) {\n  const detected = signals.filter(s => s.depth > threshold);\n  console.log("Objek terdeteksi: " + detected.length);\n  return detected.map(obj => obj.coordinates);\n}`,
  },
  {
    title: "Formulir Telemetri Spesimen",
    tagline: "Formulir & Fieldset Aksesibel",
    topic: "HTML5 Form Semantik",
    lang: "html",
    difficulty: "Mudah",
    bonusXp: 140,
    bonusCoins: 30,
    passAcc: 85,
    intro: "Rakit formulir pendataan sensor kualitas terumbu karang dengan pasangan label dan input yang terstandarisasi.",
    tip: "Setiap label wajib memiliki for yang merujuk tepat ke id input terkait.",
    code: `<form class="telemetry-form">\n  <fieldset>\n    <legend>Sensor Oksigen Terumbu</legend>\n    <label for="o2-level">Kadar O2 (mg/L):</label>\n    <input id="o2-level" type="range" min="0" max="15" value="8" />\n  </fieldset>\n</form>`,
  },
  {
    title: "Denyut Suar Mercusuar",
    tagline: "Animasi Gelombang CSS",
    topic: "CSS @keyframes & Transform",
    lang: "css",
    difficulty: "Sedang",
    bonusXp: 150,
    bonusCoins: 35,
    passAcc: 90,
    intro: "Buat animasi denyut cahaya pemandu bawah air yang membesar dan memudar berirama lembut.",
    tip: "Perhatikan persentase keyframes 0%, 50%, dan 100% serta properti transform.",
    code: `@keyframes oceanPulse {\n  0% { transform: scale(1); opacity: 0.8; }\n  50% { transform: scale(1.08); opacity: 1; }\n  100% { transform: scale(1); opacity: 0.8; }\n}\n.pulse-beacon {\n  animation: oceanPulse 2.4s ease-in-out infinite;\n}`,
  },
  {
    title: "Kalkulator Tekanan Hidrostatis",
    tagline: "Fungsi Matematika Samudra",
    topic: "JavaScript Arrow Function & Math",
    lang: "js",
    difficulty: "Sedang",
    bonusXp: 160,
    bonusCoins: 35,
    passAcc: 90,
    intro: "Tulis modul perhitungan tekanan air dalam satuan atmosfer (ATM) berdasarkan meter kedalaman selam.",
    tip: "Gunakan toFixed(2) untuk membatasi dua angka desimal di belakang koma.",
    code: `const getPressure = (depthMeters) => {\n  const surfaceAtm = 1.0;\n  const waterAtm = depthMeters / 10;\n  const total = surfaceAtm + waterAtm;\n  return "Tekanan " + depthMeters + "m: " + total.toFixed(2) + " ATM";\n};`,
  },
  {
    title: "Log Penyelaman Palung Mariana",
    tagline: "Struktur Dokumen Artikel",
    topic: "HTML5 Article & Time Semantik",
    lang: "html",
    difficulty: "Mudah",
    bonusXp: 140,
    bonusCoins: 30,
    passAcc: 85,
    intro: "Rangkai catatan ekspedisi laut menggunakan elemen semantik article, header, dan tag time standar ISO.",
    tip: "Tag <time> memakai atribut datetime format YYYY-MM-DD.",
    code: `<article class="dive-log">\n  <header>\n    <h3>Ekspedisi Palung Atlantis</h3>\n    <time datetime="2026-10-15">15 Oktober 2026</time>\n  </header>\n  <p>Kapten shark mendeteksi terumbu purba di kedalaman 3.200 meter.</p>\n</article>`,
  },
  {
    title: "Panel Kontrol Kaca Kokpit",
    tagline: "Glassmorphism & Backdrop Blur",
    topic: "CSS Glassmorphism & Flexbox",
    lang: "css",
    difficulty: "Sedang",
    bonusXp: 160,
    bonusCoins: 35,
    passAcc: 90,
    intro: "Ciptakan gaya panel kaca transparan tembus pandang dengan batas berkilau untuk kokpit kapal selam.",
    tip: "Gunakan kombinasi rgba transparan dan backdrop-filter blur.",
    code: `.cockpit-panel {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.85rem 1.5rem;\n  background: rgba(6, 24, 42, 0.75);\n  border: 1px solid rgba(69, 198, 255, 0.28);\n  backdrop-filter: blur(10px);\n}`,
  },
  {
    title: "Analisis Biomassa Terumbu",
    tagline: "Kalkulasi Statistik Array",
    topic: "JavaScript Array Reduce & Logika",
    lang: "js",
    difficulty: "Tantangan",
    bonusXp: 180,
    bonusCoins: 40,
    passAcc: 90,
    intro: "Ketik algoritma penghitung rata-rata biomassa terumbu karang dan penentuan status konservasinya.",
    tip: "Fungsi reduce menerima callback penjumlah dan nilai awal 0.",
    code: `const samples = [140, 290, 420, 380, 510];\nconst total = samples.reduce((acc, val) => acc + val, 0);\nconst avg = Math.round(total / samples.length);\nconsole.log("Rata-rata biomassa: " + avg + " kg/m²");`,
  },
  {
    title: "Tabel Data Sensor Akustik",
    tagline: "Tabel Data Terstruktur",
    topic: "HTML5 Tabel Semantik",
    lang: "html",
    difficulty: "Sedang",
    bonusXp: 150,
    bonusCoins: 35,
    passAcc: 85,
    intro: "Susun tabel data sektor sonar lengkap dengan thead, tbody, baris, dan sel penjelas.",
    tip: "Pastikan th berada di dalam thead dan td berada di dalam tbody.",
    code: `<table class="sensor-table">\n  <thead>\n    <tr><th>Sektor</th><th>Kedalaman</th><th>Status</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Alpha-1</td><td>1.450m</td><td>Aman</td></tr>\n  </tbody>\n</table>`,
  },
  {
    title: "Dial Reaktor Daya Bawah Air",
    tagline: "Gradien Konikal Cyber",
    topic: "CSS Conic-Gradient & Lingkaran",
    lang: "css",
    difficulty: "Master",
    bonusXp: 190,
    bonusCoins: 45,
    passAcc: 90,
    intro: "Ciptakan meteran lingkaran daya reaktor nuklir kapal selam menggunakan teknik conic-gradient.",
    tip: "Conic-gradient menentukan transisi warna berdasarkan derajat rotasi 0deg hingga 360deg.",
    code: `.reactor-gauge {\n  width: 110px;\n  height: 110px;\n  border-radius: 50%;\n  background: conic-gradient(#2ee6c8 0deg 250deg, #0e2a42 250deg 360deg);\n  box-shadow: 0 0 16px rgba(46, 230, 200, 0.4);\n}`,
  },
  {
    title: "Enkripsi Transmisi Kapal Selam",
    tagline: "Manipulasi String Sandi",
    topic: "JavaScript String & Math",
    lang: "js",
    difficulty: "Sedang",
    bonusXp: 160,
    bonusCoins: 35,
    passAcc: 90,
    intro: "Rancang pemformat paket transmisi radio terenkripsi dengan membalik karakter string dan membubuhkan kode tiket.",
    tip: "Pembalikan string dapat dilakukan via .split('').reverse().join('').",
    code: `function packMessage(secretText, id) {\n  const reversed = secretText.split("").reverse().join("");\n  return "[PKT-" + id + "]::" + reversed.toUpperCase() + "::ACK";\n}\nconsole.log(packMessage("atlantis", 402));`,
  },
  {
    title: "Pemutar Audio Hidrofon Paus",
    tagline: "Media Audio Kontrol Semantik",
    topic: "HTML5 Media & Figure",
    lang: "html",
    difficulty: "Mudah",
    bonusXp: 140,
    bonusCoins: 30,
    passAcc: 85,
    intro: "Pasang pemutar audio hidrofon bawah air dengan teks keterangan pelengkap dan elemen cadangan fallback.",
    tip: "Gunakan tag <figure> membungkus <audio> dan <figcaption> keterangan.",
    code: `<figure class="hydrophone-player">\n  <figcaption>Rekaman Akustik Suara Paus</figcaption>\n  <audio controls>\n    <source src="audio/paus.mp3" type="audio/mpeg" />\n  </audio>\n</figure>`,
  },
  {
    title: "Tombol Peluncur Torpedo Darurat",
    tagline: "Gaya Tombol Aksi Cepat",
    topic: "CSS Tombol & Transisi Interaktif",
    lang: "css",
    difficulty: "Mudah",
    bonusXp: 140,
    bonusCoins: 30,
    passAcc: 85,
    intro: "Rancang tombol pelontar darurat dengan gaya peringatan merah oranye dan efek klik taktil berkecepatan 150ms.",
    tip: "Terapkan transisi halus pada transform dan background.",
    code: `.launch-btn {\n  background: linear-gradient(135deg, #ff6b57, #f97316);\n  color: #ffffff;\n  font-weight: 800;\n  padding: 0.75rem 1.5rem;\n  border-radius: 0.75rem;\n  border: none;\n  box-shadow: 0 4px 14px rgba(255, 107, 87, 0.4);\n}`,
  },
];

/** Hitung indeks tantangan hari ini berdasarkan tanggal kalender YYYY-MM-DD */
export function getDayOfYear(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const startOfYear = new Date(y, 0, 1);
  const diffMs = date.getTime() - startOfYear.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Ambil tantangan harian deterministik untuk tanggal tertentu (default hari ini) */
export function getDailyChallenge(dateStr?: string): DailyChallenge {
  const today = dateStr || getTodayDateString();
  const dayIndex = Math.abs(getDayOfYear(today)) % DAILY_CHALLENGES.length;
  const item = DAILY_CHALLENGES[dayIndex];
  return {
    ...item,
    id: `daily:${today}`,
    date: today,
    dayIndex,
  };
}

/** Ambil tantangan berdasarkan ID (misal 'daily:2026-10-15') */
export function getDailyChallengeById(id: string): DailyChallenge | null {
  if (!id.startsWith("daily:")) return null;
  const datePart = id.slice(6);
  return getDailyChallenge(datePart);
}

/** Format tanggal lokal YYYY-MM-DD */
export function getTodayDateString(now: number = Date.now()): string {
  const d = new Date(now);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Hitung sisa waktu hingga reset tengah malam (24:00:00) */
export function getTimeUntilMidnight(now: number = Date.now()): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const d = new Date(now);
  const midnight = new Date(d);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - d.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return { hours, minutes, seconds, formatted };
}

/** Fungsi pratinjau live runner untuk masing-masing bahasa tantangan */
function getPreviewRunner(lang: Lang): (typed: string) => string {
  if (lang === "html") {
    return (typed: string) =>
      `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;background:#061426;color:#eaf6ff;padding:24px;display:flex;justify-content:center;align-items:center;min-height:80vh;margin:0}.sonar-nav,.dive-log,.telemetry-form,.sensor-table,.hydrophone-player{max-width:440px;width:100%}a{color:#2ee6c8}input{accent-color:#2ee6c8}table{border-collapse:collapse;width:100%}th,td{border:1px solid #1c3b57;padding:8px;text-align:left}</style></head><body>${typed}</body></html>`;
  }
  if (lang === "css") {
    return (typed: string) =>
      `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;background:#061426;color:#eaf6ff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:85vh;margin:0;gap:16px}\n${typed}</style></head><body><div class="coral-card pulse-beacon cockpit-panel reactor-gauge deep-glass"><button class="launch-btn">Uji Tantangan Harian</button><p style="margin:0;font-size:13px;color:#9ad7f5">Pratinjau Langsung Komponen CSS</p></div></body></html>`;
  }
  return (typed: string) =>
    `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;background:#071c30;color:#eaf6ff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:85vh;margin:0;gap:12px}button{background:#2ee6c8;color:#04222b;border:none;border-radius:10px;padding:10px 20px;font-weight:bold;cursor:pointer}#output{font-family:monospace;background:#041220;border:1px solid #1a3c5a;padding:12px;border-radius:8px;width:85%;max-width:380px;min-height:48px;font-size:13px;color:#7ee4ff}</style></head><body><h3>Konsol Tantangan JavaScript</h3><div id="output">Menunggu eksekusi skrip...</div><script>${CONSOLE_SHIM}\nwindow.addEventListener('message',function(e){if(e.data&&e.data.__cs){var el=document.getElementById('output');el.textContent=e.data.text}});\ntry{\n${typed}\n}catch(err){console.error(err.message);}\n<\/script></body></html>`;
}

/** Konversi tantangan harian menjadi objek Session untuk TypingGame & TowerPuzzle */
export function dailyChallengeToSession(challenge: DailyChallenge): Session {
  return {
    id: challenge.id,
    kind: "quest",
    num: 99,
    tag: `Tantangan Harian • ${challenge.topic}`,
    practiceTitle: challenge.title,
    color: "#f59e0b", // Emas / Amber untuk Daily Challenge
    lang: challenge.lang,
    code: challenge.code,
    preview: getPreviewRunner(challenge.lang),
    passAcc: challenge.passAcc,
    threatMul: 1.05,
    intro: challenge.intro,
  };
}
