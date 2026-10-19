/* ==========================================================================
   PYTHON FLASK / DJANGO & MYSQL BACKEND SIMULATOR
   Interactive Localhost Browser, MySQL Console / Django Admin, WSGI Inspector,
   cPanel "Setup Python App" Passenger Deployment Simulator & CLI Terminal
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

interface PyBukuItem {
  id: number;
  kategori_id: number;
  kategori_nama: string;
  judul: string;
  pengarang: string;
  penerbit: string;
  tahun_terbit: number;
  stok: number;
}

export default function PyBackendSimulator({
  meeting,
  terminalLogs,
  onExecuteCmd,
}: Props) {
  // Simulator View Mode: "browser" | "mysql" | "cpanel_python" | "wsgi"
  const [activeSimTab, setActiveSimTab] = useState<"browser" | "mysql" | "cpanel_python" | "wsgi">("browser");

  // In-Memory Database State (PyMySQL DictCursor format)
  const [bukuList, setBukuList] = useState<PyBukuItem[]>([
    {
      id: 1,
      kategori_id: 1,
      kategori_nama: "Teknologi Informasi",
      judul: "Python Web Development with Flask",
      pengarang: "Ahmad Fauzi",
      penerbit: "Tech Media",
      tahun_terbit: 2023,
      stok: 8,
    },
    {
      id: 2,
      kategori_id: 1,
      kategori_nama: "Teknologi Informasi",
      judul: "Django Enterprise Architecture",
      pengarang: "Siti Nurhaliza",
      penerbit: "Komputindo",
      tahun_terbit: 2022,
      stok: 6,
    },
    {
      id: 3,
      kategori_id: 3,
      kategori_nama: "Sastra & Bahasa",
      judul: "Bumi Manusia",
      pengarang: "Pramoedya Ananta Toer",
      penerbit: "Lentera Dipantara",
      tahun_terbit: 2005,
      stok: 3,
    },
  ]);

  // Auth / Role Simulation
  const [currentRole, setCurrentRole] = useState<"guest" | "user" | "admin">(
    meeting.no >= 12 ? "admin" : meeting.no >= 11 ? "user" : "guest"
  );
  const [sessionUserName, setSessionUserName] = useState<string>("Siti Nurhaliza (Admin)");

  // Form Inputs in Browser
  const [browserPath, setBrowserPath] = useState<string>(
    meeting.no >= 13 ? "https://simpus-python.mhs.latihan.my.id/katalog" : "http://127.0.0.1:5000/katalog"
  );
  const [formJudul, setFormJudul] = useState("");
  const [formPengarang, setFormPengarang] = useState("");
  const [formTahun, setFormTahun] = useState("2024");
  const [formStok, setFormStok] = useState("5");
  const [formKategoriId, setFormKategoriId] = useState("1");
  const [showAddForm, setShowAddForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(
    meeting.no >= 9 ? "Flask: Flash message aktif via app.secret_key!" : null
  );

  // Custom SQL Console in MySQL Tab
  const [customSql, setCustomSql] = useState<string>(
    "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id;"
  );
  const [sqlResultNotice, setSqlResultNotice] = useState<string>("Query PyMySQL berhasil dijalankan.");

  // cPanel Setup Python App Simulation State
  const [pyVersion, setPyVersion] = useState("3.11");
  const [pyAppStatus, setPyAppStatus] = useState<"Running" | "Restarting">("Running");
  const [pyRequirementsInstalled, setPyRequirementsInstalled] = useState(meeting.no >= 14);

  // WSGI Request Tracer
  const [wsgiStatus, setWsgiStatus] = useState<number>(200);

  const handleSimulateAddBuku = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.click();

    if (!formJudul.trim()) {
      setFlashMessage("Error: Judul buku tidak boleh kosong (Validasi Python)!");
      setWsgiStatus(422);
      return;
    }

    const kategoriMap: Record<number, string> = {
      1: "Teknologi Informasi",
      2: "Sains & Matematika",
      3: "Sastra & Bahasa",
    };

    const newId = bukuList.length ? Math.max(...bukuList.map((b) => b.id)) + 1 : 1;
    const newItem: PyBukuItem = {
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
    setFlashMessage(`Flask Flash: Buku '${newItem.judul}' berhasil disimpan via cursor.execute()!`);
    setWsgiStatus(302);
    setTimeout(() => setWsgiStatus(200), 1000);
  };

  const handleSimulateDeleteBuku = (id: number) => {
    sfx.click();
    if (currentRole !== "admin") {
      setFlashMessage("Akses Ditolak: Decorator @admin_required menolak akses role User!");
      setWsgiStatus(403);
      return;
    }
    const book = bukuList.find((b) => b.id === id);
    if (confirm(`Yakin ingin menghapus buku '${book?.judul}' dari MySQL?`)) {
      setBukuList(bukuList.filter((b) => b.id !== id));
      setFlashMessage(`Buku #${id} berhasil dihapus via query parameterized.`);
      setWsgiStatus(200);
    }
  };

  const handleRestartPythonApp = () => {
    sfx.win();
    setPyAppStatus("Restarting");
    setFlashMessage("cPanel: Memuat ulang proses worker Phusion Passenger WSGI...");
    setTimeout(() => {
      setPyAppStatus("Running");
      setFlashMessage("cPanel: Aplikasi Python berhasil di-restart dan aktif!");
    }, 1200);
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[780px]">
      {/* Simulator Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-extrabold text-xs">Python 3.11 & MySQL Simulator</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono">
            Flask / WSGI
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
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🌐 Jinja2 Browser
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("mysql");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "mysql"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🗄️ MySQL / PyMySQL
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("cpanel_python");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "cpanel_python"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🚀 cPanel Python App
          </button>
          <button
            onClick={() => {
              sfx.click();
              setActiveSimTab("wsgi");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSimTab === "wsgi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔍 WSGI Trace
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: JINJA2 BROWSER PREVIEW ===================== */}
      {activeSimTab === "browser" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Browser Address Bar */}
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
                setFlashMessage("Halaman Jinja2 dimuat ulang dari WSGI (200 OK)");
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
              <span className="text-slate-400 font-semibold">Simulasi Role (Decorator):</span>
              <button
                onClick={() => {
                  sfx.click();
                  setCurrentRole("admin");
                  setSessionUserName("Siti Nurhaliza (Admin)");
                  setFlashMessage("Sesi Admin aktif. @admin_required mengizinkan aksi penuh.");
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
                  setSessionUserName("Fauzan Hadi (Anggota)");
                  setFlashMessage("Sesi Anggota aktif. @admin_required memblokir aksi hapus.");
                }}
                className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                  currentRole === "user"
                    ? "bg-emerald-600 text-white"
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
                  setFlashMessage("Sesi logout (Guest). @login_required akan mengalihkan ke login.");
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
              User: <span className="text-emerald-300 font-bold">{sessionUserName}</span>
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
                  <span>{flashMessage.startsWith("Error") ? "⚠️" : "🐍"}</span>
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

            {/* Navigation Header of Simulated Python App */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">🐍</span> SIMPUS-Python
                </h3>
                <p className="text-[10px] text-slate-400">Template Jinja2: base.html → katalog.html</p>
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

            {/* Form Tambah Buku (Create Form Flask) */}
            {showAddForm && (
              <form
                onSubmit={handleSimulateAddBuku}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 anim-pop text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-300 text-xs">Form POST @app.route('/buku/tambah')</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                    Method: POST
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Judul Buku *</label>
                    <input
                      type="text"
                      value={formJudul}
                      onChange={(e) => setFormJudul(e.target.value)}
                      placeholder="Contoh: Flask Web Framework"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-0.5">Pengarang *</label>
                    <input
                      type="text"
                      value={formPengarang}
                      onChange={(e) => setFormPengarang(e.target.value)}
                      placeholder="Nama pengarang buku"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-emerald-400 focus:outline-none"
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
                      <option value="3">3 - Sastra & Bahasa</option>
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
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    💾 Simpan (PyMySQL INSERT)
                  </button>
                </div>
              </form>
            )}

            {/* Catalog Table with Jinja2 loop simulation */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="font-extrabold text-xs text-white">
                  Koleksi Buku Jinja2 ({`{{ buku_list|length }}`}: {bukuList.length} judul)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Query: PyMySQL DictCursor</span>
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
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
                                  setFlashMessage(`Buka form edit Flask untuk Buku #${b.id}: '${b.judul}'`);
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

      {/* ===================== TAB 2: MYSQL & PYMYSQL CONSOLE ===================== */}
      {activeSimTab === "mysql" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐍</span>
              <div>
                <h4 className="font-extrabold text-sm text-white">PyMySQL Connector & MySQL Database</h4>
                <p className="text-[10px] text-slate-400 font-mono">Host: localhost:3306 | DB: `simpus_py` | Driver: PyMySQL</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
              ● Connected via db.py
            </span>
          </div>

          {/* Interactive SQL Query Console */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>SQL Query Cursor Execution:</span>
              <button
                onClick={() => {
                  sfx.click();
                  setSqlResultNotice(`Query cursor.execute() sukses. ${bukuList.length} baris di-fetch via DictCursor.`);
                }}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <IconPlay size={12} /> Eksekusi Query
              </button>
            </div>
            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-400"
            />
            {sqlResultNotice && (
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                ✓ {sqlResultNotice}
              </div>
            )}
          </div>

          {/* Table Schema Explorer */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
              <IconDatabase size={14} className="text-emerald-400" />
              <span>Tabel Terdaftar di Database MySQL:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>📄 tabel: `buku`</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{bukuList.length} baris</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Kolom: id (PK), kategori_id (FK), judul, pengarang, stok</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>👤 tabel: `users`</span>
                  <span className="text-[10px] text-emerald-400 font-mono">2 akun</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Kolom: id, nama, email, password (hash), role</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CPANEL "SETUP PYTHON APP" ===================== */}
      {activeSimTab === "cpanel_python" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto text-xs text-slate-200">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <div>
                <h4 className="font-black text-sm text-white">cPanel: Setup Python App (Passenger WSGI)</h4>
                <p className="text-[10px] text-slate-400 font-mono">App Root: /home/user/simpus_py</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  pyAppStatus === "Running"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-950 text-amber-300 border border-amber-500/40"
                }`}
              >
                ● {pyAppStatus}
              </span>
              <button
                onClick={handleRestartPythonApp}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <IconRetry size={12} /> Restart App
              </button>
            </div>
          </div>

          {/* Configuration Form in cPanel */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Python Version</label>
                <select
                  value={pyVersion}
                  onChange={(e) => setPyVersion(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono"
                >
                  <option value="3.11">Python 3.11 (Direkomendasikan)</option>
                  <option value="3.10">Python 3.10</option>
                  <option value="3.9">Python 3.9</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Application Startup File</label>
                <input
                  type="text"
                  readOnly
                  value="passenger_wsgi.py"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400">
              <p className="text-slate-300 font-bold mb-1">Terminal Virtualenv Server Activation:</p>
              <code className="text-emerald-400">
                source /home/user/virtualenv/simpus_py/{pyVersion}/bin/activate
              </code>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Pip Requirements:</span>
                <p className="text-[10px] text-slate-400">Flask, PyMySQL, Werkzeug, Jinja2</p>
              </div>
              <button
                onClick={() => {
                  sfx.win();
                  setPyRequirementsInstalled(true);
                  setFlashMessage("pip install -r requirements.txt selesai di server!");
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  pyRequirementsInstalled
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-sky-600 text-white"
                }`}
              >
                {pyRequirementsInstalled ? "✓ Requirements Installed" : "Install via Pip"}
              </button>
            </div>
          </div>

          {/* Test Live URL Button */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
            <p className="text-xs text-emerald-200 font-bold">Uji Live URL Python Hasil Deployment:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                https://simpus-python.mhs.latihan.my.id/
              </span>
              <button
                onClick={() => {
                  sfx.click();
                  setActiveSimTab("browser");
                  setBrowserPath("https://simpus-python.mhs.latihan.my.id/katalog");
                  setFlashMessage("Membuka aplikasi web Python live di domain publik!");
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Buka di Browser →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: WSGI & SESSION TRACE ===================== */}
      {activeSimTab === "wsgi" && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-4 space-y-3 overflow-y-auto font-mono text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white">WSGI Environ & Flask Cookie Inspector</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px]">
              Status: {wsgiStatus} {wsgiStatus === 200 ? "OK" : wsgiStatus === 302 ? "FOUND" : "RESPONSE"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-emerald-400 font-bold mb-1">▶ WSGI ENVIRON DICTIONARY:</p>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`{
  'REQUEST_METHOD': 'GET',
  'PATH_INFO': '/katalog',
  'SERVER_PROTOCOL': 'HTTP/1.1',
  'wsgi.url_scheme': 'http',
  'HTTP_HOST': '127.0.0.1:5000',
  'HTTP_COOKIE': 'session=.eJyrVkrNTc... (Signed HMAC Cookie)'
}`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-amber-400 font-bold mb-1">📦 FLASK SESSION DICTIONARY:</p>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{JSON.stringify(
  {
    logged_in: currentRole !== "guest",
    user_id: currentRole === "admin" ? 1 : currentRole === "user" ? 2 : null,
    nama: sessionUserName,
    role: currentRole,
    _flashes: flashMessage ? [["info", flashMessage]] : [],
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
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 font-mono text-[10px]">Terminal Python:</span>
          <button
            onClick={() => onExecuteCmd("python app.py")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px] cursor-pointer"
          >
            $ python app.py
          </button>
          <button
            onClick={() => onExecuteCmd("pip list")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px] cursor-pointer"
          >
            $ pip list
          </button>
          <button
            onClick={() => onExecuteCmd("python -m venv venv")}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px] cursor-pointer"
          >
            $ python -m venv venv
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {terminalLogs.length > 0 && (
            <span className="text-[10px] text-emerald-400 font-mono hidden md:inline truncate max-w-[220px]" title={terminalLogs[terminalLogs.length - 1]}>
              {terminalLogs[terminalLogs.length - 1]}
            </span>
          )}
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Port 5000</span>
        </div>
      </div>
    </div>
  );
}
