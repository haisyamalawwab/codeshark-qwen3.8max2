/* ==========================================================================
   CI4 & MYSQL BACKEND SIMULATOR
   Interactive Localhost Browser, phpMyAdmin MySQL Console, HTTP Inspector,
   cPanel Shared Hosting Deployment Simulator & Spark CLI Terminal
   ========================================================================== */

import { useState } from "react";
import type { BackendMeeting } from "../../data/ciBackendCurriculum";
import { sfx } from "../../lib/audio";
import {
  IconPlay,
  IconRetry,
  IconDatabase,
} from "../../ui/icons";

interface Props {
  meeting: BackendMeeting;
  terminalLogs: string[];
  onExecuteCmd: (cmd: string) => void;
}

interface BukuItem {
  id: number;
  kategori_id: number;
  kategori_nama: string;
  judul: string;
  pengarang: string;
  penerbit: string;
  tahun_terbit: number;
  stok: number;
}

export default function CiBackendSimulator({
  meeting,
  terminalLogs,
  onExecuteCmd,
}: Props) {
  // Simulator View Mode: "browser" | "mysql" | "cpanel" | "http" | "terminal"
  const [activeSimTab, setActiveSimTab] = useState<"browser" | "mysql" | "cpanel" | "http" | "terminal">("browser");

  // In-Memory Database State
  const [bukuList, setBukuList] = useState<BukuItem[]>([
    {
      id: 1,
      kategori_id: 1,
      kategori_nama: "Teknologi Informasi",
      judul: "Pemrograman Web PHP & CI4",
      pengarang: "Budi Santoso",
      penerbit: "Informatika Press",
      tahun_terbit: 2023,
      stok: 10,
    },
    {
      id: 2,
      kategori_id: 1,
      kategori_nama: "Teknologi Informasi",
      judul: "Mastering MySQL Database",
      pengarang: "Ahmad Fauzi",
      penerbit: "Media Komputindo",
      tahun_terbit: 2022,
      stok: 5,
    },
    {
      id: 3,
      kategori_id: 3,
      kategori_nama: "Sastra & Fiksi",
      judul: "Laskar Pelangi",
      pengarang: "Andrea Hirata",
      penerbit: "Bentang Pustaka",
      tahun_terbit: 2008,
      stok: 4,
    },
  ]);

  // Auth / Role Simulation
  const [currentRole, setCurrentRole] = useState<"guest" | "user" | "admin">(
    meeting.no >= 12 ? "admin" : meeting.no >= 11 ? "user" : "guest"
  );
  const [sessionUserName, setSessionUserName] = useState<string>("Budi Santoso (Admin)");

  // Form Inputs in Browser
  const [browserPath, setBrowserPath] = useState<string>(
    meeting.no >= 13 ? "https://simpus-mini.mhs.latihan.my.id/buku" : "http://localhost:8080/buku"
  );
  const [formJudul, setFormJudul] = useState("");
  const [formPengarang, setFormPengarang] = useState("");
  const [formTahun, setFormTahun] = useState("2024");
  const [formStok, setFormStok] = useState("5");
  const [formKategoriId, setFormKategoriId] = useState("1");
  const [showAddForm, setShowAddForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(
    meeting.no >= 9 ? "Selamat datang di SIMPUS-Mini!" : null
  );

  // Custom SQL Console in phpMyAdmin Tab
  const [customSql, setCustomSql] = useState<string>(
    "SELECT buku.*, kategori.nama_kategori FROM buku LEFT JOIN kategori ON buku.kategori_id = kategori.id;"
  );
  const [sqlResultNotice, setSqlResultNotice] = useState<string>("Menampilkan 3 baris data.");

  // cPanel Deployment Simulation State
  const [cpanelFilesUploaded, setCpanelFilesUploaded] = useState(meeting.no >= 14);
  const [cpanelSqlImported, setCpanelSqlImported] = useState(meeting.no >= 14);
  const [cpanelEnvConfigured, setCpanelEnvConfigured] = useState(meeting.no >= 14);

  // HTTP Request Tracer State
  const [httpMethod, setHttpMethod] = useState<"GET" | "POST">("GET");
  const [httpStatus, setHttpStatus] = useState<number>(200);

  const handleSimulateAddBuku = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.click();

    if (!formJudul.trim()) {
      setFlashMessage("Error: Judul buku wajib diisi!");
      setHttpStatus(422);
      return;
    }

    const kategoriMap: Record<number, string> = {
      1: "Teknologi Informasi",
      2: "Sains & Matematika",
      3: "Sastra & Fiksi",
    };

    const newId = bukuList.length ? Math.max(...bukuList.map((b) => b.id)) + 1 : 1;
    const newItem: BukuItem = {
      id: newId,
      kategori_id: parseInt(formKategoriId, 10),
      kategori_nama: kategoriMap[parseInt(formKategoriId, 10)] || "Umum",
      judul: formJudul,
      pengarang: formPengarang || "Anonim",
      penerbit: "Penerbit Kampus",
      tahun_terbit: parseInt(formTahun, 10) || 2024,
      stok: parseInt(formStok, 10) || 1,
    };

    setBukuList([newItem, ...bukuList]);
    setFormJudul("");
    setFormPengarang("");
    setShowAddForm(false);
    setFlashMessage(`Berhasil: Buku '${newItem.judul}' berhasil disimpan ke MySQL!`);
    setHttpMethod("POST");
    setHttpStatus(302);
    setTimeout(() => {
      setHttpMethod("GET");
      setHttpStatus(200);
    }, 1000);
  };

  const handleSimulateDeleteBuku = (id: number) => {
    sfx.click();
    if (currentRole !== "admin") {
      setFlashMessage("Akses Ditolak: Hanya Admin yang boleh menghapus data buku!");
      setHttpStatus(403);
      return;
    }
    const book = bukuList.find((b) => b.id === id);
    if (confirm(`Yakin ingin menghapus buku '${book?.judul}' dari MySQL?`)) {
      setBukuList(bukuList.filter((b) => b.id !== id));
      setFlashMessage(`Buku #${id} berhasil dihapus dari database.`);
      setHttpStatus(200);
    }
  };

  const handleRunSql = () => {
    sfx.click();
    const clean = customSql.trim().toUpperCase();
    if (clean.startsWith("SELECT")) {
      setSqlResultNotice(`Query berhasil dijalankan: ${bukuList.length} baris data ditemukan.`);
    } else if (clean.startsWith("INSERT")) {
      setSqlResultNotice("1 baris berhasil ditambahkan ke tabel buku.");
    } else if (clean.startsWith("DELETE")) {
      setSqlResultNotice("Query DELETE dieksekusi.");
    } else {
      setSqlResultNotice("Query dieksekusi dengan sukses.");
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[780px]">
      {/* Simulator Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-extrabold text-xs">PHP 8.2 & MySQL Simulator</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-mono">
            CI4 Framework
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("browser");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "browser"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌐 Web Browser
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("mysql");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "mysql"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🗄️ phpMyAdmin
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("cpanel");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "cpanel"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🚀 cPanel Hosting
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("http");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "http"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔍 HTTP Trace
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: BROWSER PREVIEW ===================== */}
      {activeSimTab === "browser" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Browser Omnibar */}
          <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300">
              <span className="text-emerald-400 mr-1.5 font-bold">🔒 {browserPath.startsWith("https") ? "HTTPS" : "HTTP"}</span>
              <span className="truncate">{browserPath}</span>
            </div>
            <button
              onClick={() => {
                sfx.click();
                setFlashMessage("Halaman berhasil dimuat ulang (200 OK)");
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Refresh"
            >
              <IconRetry size={13} />
            </button>
          </div>

          {/* Quick Role & Auth Switcher */}
          <div className="px-3 py-1.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Simulasi Role Session:</span>
              <button
                onClick={() => {
                  sfx.click();
                  setCurrentRole("admin");
                  setSessionUserName("Budi Santoso (Admin)");
                  setFlashMessage("Beralih ke sesi Admin. Hak akses CRUD lengkap aktif.");
                }}
                className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                  currentRole === "admin"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                👑 Admin
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setCurrentRole("user");
                  setSessionUserName("Siti Aisyah (Anggota)");
                  setFlashMessage("Beralih ke sesi User/Anggota biasa. Tombol edit/hapus dikunci.");
                }}
                className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                  currentRole === "user"
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                👤 Anggota
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  setCurrentRole("guest");
                  setSessionUserName("Tamu Anonim");
                  setFlashMessage("Sesi logout (Guest). Halaman admin tidak dapat diakses.");
                }}
                className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                  currentRole === "guest"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🚪 Guest (Logout)
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              User: <span className="text-sky-300 font-bold">{sessionUserName}</span>
            </div>
          </div>

          {/* Rendered HTML Web Content */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950 space-y-3 text-slate-200">
            {/* Flash Message Banner */}
            {flashMessage && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                  flashMessage.startsWith("Error") || flashMessage.startsWith("Akses Ditolak")
                    ? "bg-rose-950/80 border border-rose-500/50 text-rose-300"
                    : "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <span>{flashMessage.startsWith("Error") ? "⚠️" : "✓"}</span>
                  <span>{flashMessage}</span>
                </div>
                <button
                  onClick={() => setFlashMessage(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Navigation Header of Simulated App */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span className="text-sky-400">📚</span> SIMPUS-Mini
                </h3>
                <p className="text-[10px] text-slate-400">Sistem Informasi Perpustakaan Kampus</p>
              </div>
              <div className="flex items-center gap-2">
                {currentRole === "admin" && (
                  <button
                    onClick={() => {
                      sfx.click();
                      setShowAddForm(!showAddForm);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {showAddForm ? "✕ Tutup Form" : "➕ Tambah Buku"}
                  </button>
                )}
              </div>
            </div>

            {/* Form Tambah Buku (Create Form) */}
            {showAddForm && (
              <form
                onSubmit={handleSimulateAddBuku}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-2.5 anim-pop text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sky-300 text-xs">Form Input Tambah Buku (POST /buku/simpan)</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 font-mono">
                    CSRF Token: valid
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Judul Buku *</label>
                    <input
                      type="text"
                      value={formJudul}
                      onChange={(e) => setFormJudul(e.target.value)}
                      placeholder="Contoh: Belajar CI4 & MySQL"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Pengarang *</label>
                    <input
                      type="text"
                      value={formPengarang}
                      onChange={(e) => setFormPengarang(e.target.value)}
                      placeholder="Nama pengarang"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Kategori (Relasi FK)</label>
                    <select
                      value={formKategoriId}
                      onChange={(e) => setFormKategoriId(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                    >
                      <option value="1">1 - Teknologi Informasi</option>
                      <option value="2">2 - Sains & Matematika</option>
                      <option value="3">3 - Sastra & Fiksi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Tahun</label>
                    <input
                      type="number"
                      value={formTahun}
                      onChange={(e) => setFormTahun(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Stok</label>
                    <input
                      type="number"
                      value={formStok}
                      onChange={(e) => setFormStok(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
                  >
                    💾 Simpan ke MySQL
                  </button>
                </div>
              </form>
            )}

            {/* Catalog Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">
                  Katalog Koleksi Buku ({bukuList.length} judul)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Table: `buku` JOIN `kategori`</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/70 text-slate-400 text-[11px] border-b border-slate-800">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Judul Buku</th>
                      <th className="p-2.5">Kategori (JOIN)</th>
                      <th className="p-2.5">Pengarang</th>
                      <th className="p-2.5">Tahun</th>
                      <th className="p-2.5">Stok</th>
                      <th className="p-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bukuList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2.5 font-mono text-slate-400 text-[11px]">#{b.id}</td>
                        <td className="p-2.5 font-bold text-white">{b.judul}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/80 border border-sky-500/40 text-sky-300">
                            {b.kategori_nama}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300">{b.pengarang}</td>
                        <td className="p-2.5 text-slate-400">{b.tahun_terbit}</td>
                        <td className="p-2.5">
                          <span className="font-bold text-emerald-400 font-mono">{b.stok}</span>
                        </td>
                        <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                          {currentRole === "admin" ? (
                            <>
                              <button
                                onClick={() => {
                                  sfx.click();
                                  setFlashMessage(`Buka form edit untuk Buku #${b.id}: '${b.judul}'`);
                                }}
                                className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] hover:bg-amber-800 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleSimulateDeleteBuku(b.id)}
                                className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[10px] hover:bg-rose-800 cursor-pointer"
                              >
                                Hapus
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Lihat Detail</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: PHPMYADMIN & MYSQL CONSOLE ===================== */}
      {activeSimTab === "mysql" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐬</span>
              <div>
                <h4 className="font-extrabold text-sm text-white">phpMyAdmin 5.2 (MySQL Database)</h4>
                <p className="text-[10px] text-slate-400 font-mono">Server: localhost:3306 | Database: `simpus_mini`</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                ● MySQL Running
              </span>
            </div>
          </div>

          {/* Interactive SQL Query Editor */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>SQL Query Console:</span>
              <button
                onClick={handleRunSql}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <IconPlay size={12} /> Jalankan Query (Go)
              </button>
            </div>
            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-400"
            />
            {sqlResultNotice && (
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                ✓ {sqlResultNotice}
              </div>
            )}
          </div>

          {/* Table Schema & Records Explorer */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
              <IconDatabase size={14} className="text-sky-400" />
              <span>Daftar Tabel Database `simpus_mini`:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>📄 tabel: `buku`</span>
                  <span className="text-[10px] text-sky-400 font-mono">{bukuList.length} baris</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Kolom: id (PK, AI), kategori_id (FK), judul, pengarang, stok</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>🏷️ tabel: `kategori`</span>
                  <span className="text-[10px] text-sky-400 font-mono">3 baris</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Kolom: id (PK, AI), nama_kategori (VARCHAR 100)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CPANEL HOSTING & DEPLOYMENT ===================== */}
      {activeSimTab === "cpanel" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto text-xs text-slate-200">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <div>
                <h4 className="font-black text-sm text-white">cPanel Shared Hosting Deployment</h4>
                <p className="text-[10px] text-slate-400 font-mono">Domain: simpus-mini.mhs.latihan.my.id</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
              cPanel v110 Live
            </span>
          </div>

          {/* Deployment Step Checklist */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">1. MySQL Database Wizard</p>
                <p className="text-[11px] text-slate-400">Database `u1234_simpus` & User `u1234_admin`</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                ✓ Selesai
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">2. Export-Import .SQL ke Server</p>
                <p className="text-[11px] text-slate-400">Import struktur tabel dan data kategori awal</p>
              </div>
              <button
                onClick={() => {
                  sfx.win();
                  setCpanelSqlImported(true);
                  setFlashMessage("Database .sql berhasil di-import ke MySQL hosting!");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  cpanelSqlImported
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-sky-600 text-white"
                }`}
              >
                {cpanelSqlImported ? "✓ Ter-import" : "Import .sql"}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">3. Upload File & Ekstrak di File Manager</p>
                <p className="text-[11px] text-slate-400">Folder app/ di luar public, folder public/* di public_html/</p>
              </div>
              <button
                onClick={() => {
                  sfx.win();
                  setCpanelFilesUploaded(true);
                  setFlashMessage("Berkas aplikasi berhasil diunggah dan diekstrak di server!");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  cpanelFilesUploaded
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-sky-600 text-white"
                }`}
              >
                {cpanelFilesUploaded ? "✓ Terunggah" : "Upload File"}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">4. Konfigurasi .env Produksi</p>
                <p className="text-[11px] text-slate-400">Set CI_ENVIRONMENT=production dan kredensial hosting</p>
              </div>
              <button
                onClick={() => {
                  sfx.win();
                  setCpanelEnvConfigured(true);
                  setBrowserPath("https://simpus-mini.mhs.latihan.my.id/buku");
                  setFlashMessage("Aplikasi resmi LIVE di web hosting!");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  cpanelEnvConfigured
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-sky-600 text-white"
                }`}
              >
                {cpanelEnvConfigured ? "✓ Konfigurasi Selesai" : "Simpan .env"}
              </button>
            </div>
          </div>

          {/* Test Live URL Button */}
          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-center space-y-2">
            <p className="text-xs text-sky-200 font-bold">Uji URL Produksi Hasil Deploy:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                https://simpus-mini.mhs.latihan.my.id/
              </span>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveSimTab("browser");
                  setBrowserPath("https://simpus-mini.mhs.latihan.my.id/buku");
                  setFlashMessage("Membuka aplikasi live di domain hosting publik!");
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
              >
                Buka di Browser →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: HTTP REQUEST TRACE ===================== */}
      {activeSimTab === "http" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto font-mono text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white">HTTP Request & Session Inspector</span>
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px]">
              Status: {httpStatus} {httpStatus === 200 ? "OK" : httpStatus === 302 ? "Found (Redirect)" : "Response"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-sky-400 font-bold mb-1">▶ HTTP REQUEST HEADER:</p>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`${httpMethod} /buku HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Cookie: ci_session=8f7e2c91b4a3...`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-emerald-400 font-bold mb-1">◀ HTTP RESPONSE HEADER:</p>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`HTTP/1.1 ${httpStatus} ${httpStatus === 200 ? "OK" : "Found"}
Server: Apache/2.4.58 (Win64) OpenSSL/3.1.3 PHP/8.2.12
X-Powered-By: CodeIgniter 4
Content-Type: text/html; charset=UTF-8`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-amber-400 font-bold mb-1">📦 SESSION STORAGE ($_SESSION):</p>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{JSON.stringify(
  {
    logged_in: currentRole !== "guest",
    user_id: currentRole === "admin" ? 1 : currentRole === "user" ? 2 : null,
    nama: sessionUserName,
    role: currentRole,
    flash_pesan: flashMessage,
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Footer Console */}
      {terminalLogs.length > 0 && (
        <div className="px-3 py-1 bg-slate-950/90 border-t border-slate-900 text-[10px] font-mono text-sky-400 truncate">
          {terminalLogs[terminalLogs.length - 1]}
        </div>
      )}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 font-mono text-[10px]">Terminal Spark:</span>
          <button
            onClick={() => onExecuteCmd("php spark serve")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] cursor-pointer"
          >
            $ php spark serve
          </button>
          <button
            onClick={() => onExecuteCmd("php spark routes")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] cursor-pointer"
          >
            $ php spark routes
          </button>
          <button
            onClick={() => onExecuteCmd("composer show")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] cursor-pointer"
          >
            $ composer show
          </button>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Port 8080</span>
      </div>
    </div>
  );
}
