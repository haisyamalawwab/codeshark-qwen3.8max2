/* ==========================================================================
   CROSS-PLATFORM PHONE SIMULATOR (VIRTUAL MOBILE DEVICE)
   Simulates Expo Go & React Native Native Apps for all 16 Meetings
   ========================================================================== */

import { useState, useEffect } from "react";
import type { CrossPlatformMeeting } from "../../data/crossPlatformCurriculum";
import { sfx } from "../../lib/audio";

interface Props {
  meeting: CrossPlatformMeeting;
  onActionComplete?: () => void;
}

export default function CrossPlatformPhoneSimulator({ meeting, onActionComplete }: Props) {
  const [deviceTime, setDeviceTime] = useState("09:41");
  const [activeTab, setActiveTab] = useState<"home" | "catalog" | "cart" | "profile">("home");
  const [detailItem, setDetailItem] = useState<{ id: string; name: string; price: string; desc: string } | null>(null);

  // States per simId
  const [helloText, setHelloText] = useState("Halo, Sistem Aplikasi Lintas Platform! 🚀");
  const [counter, setCounter] = useState(0);

  // BMI State
  const [bmiWeight, setBmiWeight] = useState("68");
  const [bmiHeight, setBmiHeight] = useState("172");
  const [bmiResult, setBmiResult] = useState<{ score: string; cat: string; color: string } | null>({
    score: "23.0",
    cat: "Normal (Ideal)",
    color: "#22c55e",
  });

  // Flexbox interactive controls
  const [flexDirection, setFlexDirection] = useState<"column" | "row">("column");

  // Todo / Mini Project State
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: "Install Node.js LTS & VS Code", done: true },
    { id: 2, text: "Buat project npx create-expo-app", done: true },
    { id: 3, text: "Uji coba di Expo Go HP", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [todoFilter, setTodoFilter] = useState<"all" | "active" | "done">("all");

  // Search UTS State
  const [searchQuery, setSearchQuery] = useState("");

  // Context Theme & Cart
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number }[]>([
    { id: "1", name: "Buku React Native Pro", price: 95000 },
  ]);

  // Auth Flow
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState("mahasiswa@kampus.ac.id");
  const [authPass, setAuthPass] = useState("password123");
  const [authError, setAuthError] = useState("");

  // Native Features (Camera & Location)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: string; lon: string; addr: string } | null>(null);

  // Animated API Box
  const [animatedScale, setAnimatedScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // EAS Build State
  const [buildStep, setBuildStep] = useState<"idle" | "building" | "success">("idle");
  const [buildProgress, setBuildProgress] = useState(0);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeviceTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reset simulator state when meeting changes
  useEffect(() => {
    setActiveTab("home");
    setDetailItem(null);
    setBuildStep("idle");
    setBuildProgress(0);
  }, [meeting.no]);

  const handleCalculateBmi = () => {
    sfx.click();
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight) / 100;
    if (w > 0 && h > 0) {
      const numScore = w / (h * h);
      const score = numScore.toFixed(1);
      let cat = "Normal (Ideal)";
      let color = "#22c55e";
      if (numScore < 18.5) {
        cat = "Kekurangan Berat";
        color = "#eab308";
      } else if (numScore >= 25 && numScore < 30) {
        cat = "Kelebihan Berat";
        color = "#f97316";
      } else if (numScore >= 30) {
        cat = "Obesitas";
        color = "#ef4444";
      }
      setBmiResult({ score, cat, color });
      onActionComplete?.();
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    sfx.click();
    setTodos((prev) => [...prev, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo("");
    onActionComplete?.();
  };

  const handleToggleTodo = (id: number) => {
    sfx.click();
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDeleteTodo = (id: number) => {
    sfx.click();
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.click();
    if (!authEmail.includes("@") || authPass.length < 6) {
      setAuthError("Email harus valid dan password minimal 6 karakter!");
      return;
    }
    setAuthError("");
    setIsLoggedIn(true);
    onActionComplete?.();
  };

  const handleTriggerAnimation = () => {
    sfx.click();
    setIsAnimating(true);
    setAnimatedScale(1.25);
    setTimeout(() => {
      setAnimatedScale(0.9);
      setTimeout(() => {
        setAnimatedScale(1);
        setIsAnimating(false);
        onActionComplete?.();
      }, 250);
    }, 300);
  };

  const handleRunEasBuild = () => {
    sfx.click();
    setBuildStep("building");
    setBuildProgress(10);
    const p1 = setTimeout(() => setBuildProgress(45), 600);
    const p2 = setTimeout(() => setBuildProgress(80), 1200);
    const p3 = setTimeout(() => {
      setBuildProgress(100);
      setBuildStep("success");
      sfx.win();
      onActionComplete?.();
    }, 1800);
    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
    };
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Device Frame (Mockup iPhone / Android Bezels) */}
      <div
        className="relative w-[310px] sm:w-[330px] h-[640px] rounded-[44px] bg-[#090d16] border-[10px] border-[#1e293b] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.2)] overflow-hidden flex flex-col transition-all"
        style={{
          boxShadow: isDarkMode
            ? "0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(56,189,248,0.25)"
            : "0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(2,132,199,0.25)",
        }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#000] rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" title="Expo Go Active" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-300 shrink-0 z-40 bg-transparent">
          <span>{deviceTime}</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>100% 🔋</span>
          </div>
        </div>

        {/* Screen Content Container */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto screen-scroll text-xs relative ${
            isDarkMode ? "bg-[#0b1329] text-slate-100" : "bg-[#f8fafc] text-slate-900"
          }`}
        >
          {/* Header Bar Simulasi */}
          <div
            className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${
              isDarkMode
                ? "bg-[#111c38] border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md grid place-items-center bg-[#0284c7] text-[10px] font-black text-white">
                RN
              </span>
              <span className="font-extrabold text-[12px] truncate max-w-[170px]">
                {meeting.title}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">
              P{meeting.no}
            </span>
          </div>

          {/* Body Interactive Simulator by Meeting ID */}
          <div className="flex-1 p-3.5 space-y-3">
            {/* P1: Hello World */}
            {meeting.simId === "hello-world" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 grid place-items-center text-2xl shadow-lg">
                  ⚛️
                </div>
                <h3 className="font-extrabold text-base text-sky-400">
                  Expo SDK 52 • Hello World
                </h3>
                <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
                  {helloText}
                </p>
                <div className="w-full pt-4">
                  <input
                    type="text"
                    value={helloText}
                    onChange={(e) => setHelloText(e.target.value)}
                    placeholder="Ubah teks App.js..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-700 bg-slate-900/80 text-white text-center focus:border-sky-400 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Ketik teks baru untuk melihat live hot reload Metro bundler.
                  </p>
                </div>
              </div>
            )}

            {/* P2: Components & Props */}
            {meeting.simId === "components-props" && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  Props & Reusable Cards
                </p>
                {[
                  { nama: "Raka Samudra", nim: "23010101", jurusan: "Teknik Informatika", ipk: "3.92" },
                  { nama: "Siti Alawiyah", nim: "23010102", jurusan: "Sistem Informasi", ipk: "3.88" },
                  { nama: "Budi Santoso", nim: "23010103", jurusan: "Teknik Komputer", ipk: "3.75" },
                ].map((s) => (
                  <div
                    key={s.nim}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-600 grid place-items-center font-bold text-white text-sm">
                      {s.nama.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{s.nama}</p>
                      <p className="text-[10px] text-slate-400">NIM: {s.nim}</p>
                      <p className="text-[10px] text-sky-400">{s.jurusan}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      IPK {s.ipk}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* P3: Core Components & Flexbox Styling */}
            {meeting.simId === "profile-flexbox" && (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-400">flexDirection:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setFlexDirection("column")}
                      className={`px-2 py-0.5 rounded font-bold ${
                        flexDirection === "column" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      column (default)
                    </button>
                    <button
                      onClick={() => setFlexDirection("row")}
                      className={`px-2 py-0.5 rounded font-bold ${
                        flexDirection === "row" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      row
                    </button>
                  </div>
                </div>

                <div
                  className="p-3 rounded-2xl bg-slate-800 border border-slate-700 transition-all flex"
                  style={{
                    flexDirection: flexDirection,
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-sky-400 bg-sky-700/80 grid place-items-center font-extrabold text-white text-lg shrink-0">
                    RS
                  </div>
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="font-extrabold text-sm text-white">Raka Samudra</p>
                    <p className="text-[11px] text-sky-400">Cross-Platform Dev</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <p className="font-extrabold text-white">16</p>
                    <p className="text-[10px] text-slate-400">Pertemuan</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <p className="font-extrabold text-sky-400">3 SKS</p>
                    <p className="text-[10px] text-slate-400">Semester 5</p>
                  </div>
                </div>
              </div>
            )}

            {/* P4: State & BMI Calculator */}
            {meeting.simId === "bmi-calculator" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <p className="font-bold text-white text-xs">Kalkulator BMI Mobile</p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400">Berat (kg)</label>
                      <input
                        type="number"
                        value={bmiWeight}
                        onChange={(e) => setBmiWeight(e.target.value)}
                        className="w-full p-2 mt-0.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400">Tinggi (cm)</label>
                      <input
                        type="number"
                        value={bmiHeight}
                        onChange={(e) => setBmiHeight(e.target.value)}
                        className="w-full p-2 mt-0.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCalculateBmi}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Hitung BMI
                  </button>
                </div>

                {bmiResult && (
                  <div
                    className="p-3 rounded-xl bg-slate-800/80 border-2 text-center"
                    style={{ borderColor: bmiResult.color }}
                  >
                    <p className="text-2xl font-black text-white">{bmiResult.score}</p>
                    <p className="font-bold text-xs mt-0.5" style={{ color: bmiResult.color }}>
                      {bmiResult.cat}
                    </p>
                  </div>
                )}

                {/* Counter Demo */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Counter: {counter}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCounter((c) => c - 1)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setCounter((c) => c + 1)}
                      className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* P5: React Navigation (Stack & Tab) */}
            {meeting.simId === "navigation-stack-tab" && (
              <div className="space-y-3">
                {detailItem ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setDetailItem(null)}
                      className="text-xs text-sky-400 flex items-center gap-1 font-bold"
                    >
                      ← Kembali ke Katalog
                    </button>
                    <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">
                        Detail Screen (params: ID {detailItem.id})
                      </span>
                      <h4 className="font-extrabold text-base text-white">{detailItem.name}</h4>
                      <p className="text-sm font-bold text-emerald-400">{detailItem.price}</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{detailItem.desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400">
                      Katalog Produk (Klik untuk push screen Detail):
                    </p>
                    {[
                      { id: "101", name: "Laptop Developer Pro", price: "Rp 14.500.000", desc: "M2 Chip, 16GB RAM, Cocok untuk Expo & React Native." },
                      { id: "102", name: "Smartphone Android Test Device", price: "Rp 3.200.000", desc: "AMOLED 120Hz, Pas untuk install APK EAS." },
                      { id: "103", name: "Keyboard Mechanical 60%", price: "Rp 850.000", desc: "Linear switch presisi tinggi untuk koding berjam-jam." },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          sfx.click();
                          setDetailItem(item);
                        }}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-400 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-white text-xs">{item.name}</p>
                          <p className="text-[11px] text-emerald-400 font-semibold">{item.price}</p>
                        </div>
                        <span className="text-xs text-sky-400 font-bold">Detail →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* P6: API Fetch & AsyncStorage */}
            {meeting.simId === "api-asyncstorage" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-sky-400">REST API + AsyncStorage</span>
                  <span className="text-emerald-400 font-bold">Online ✓</span>
                </div>
                {[
                  { id: 1, title: "Apa itu React Native JSI?", source: "JSONPlaceholder" },
                  { id: 2, title: "Cara setup Expo Go di Android", source: "docs.expo.dev" },
                  { id: 3, title: "Optimasi State dengan AsyncStorage", source: "React Native Docs" },
                ].map((post) => (
                  <div key={post.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="font-bold text-white text-xs">{post.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">{post.source}</span>
                      <button
                        onClick={() => {
                          sfx.click();
                          onActionComplete?.();
                        }}
                        className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 font-bold text-[10px]"
                      >
                        ⭐ Simpan Lokal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* P7: Mini Project 1 (Todo List & AsyncStorage) */}
            {meeting.simId === "mini-project-1" && (
              <div className="space-y-2.5">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    placeholder="Tambah tugas baru..."
                    className="flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-400"
                  />
                  <button
                    onClick={handleAddTodo}
                    className="px-3 py-2 bg-sky-600 font-bold text-white rounded-lg text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-1">
                  {(["all", "active", "done"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTodoFilter(f)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold capitalize ${
                        todoFilter === f ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                  {todos
                    .filter((t) =>
                      todoFilter === "all" ? true : todoFilter === "active" ? !t.done : t.done
                    )
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-2"
                      >
                        <span
                          onClick={() => handleToggleTodo(t.id)}
                          className={`flex-1 cursor-pointer truncate ${
                            t.done ? "line-through text-slate-500" : "text-white font-medium"
                          }`}
                        >
                          {t.done ? "✓ " : "○ "}
                          {t.text}
                        </span>
                        <button
                          onClick={() => handleDeleteTodo(t.id)}
                          className="text-rose-400 hover:text-rose-300 font-bold text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* P8: UTS Exam Live Simulator */}
            {meeting.simId === "uts-exam" && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-medium">
                  📝 Studi Kasus UTS: Pencarian & Filter Real-time
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci pencarian..."
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                />
                <div className="space-y-1.5">
                  {[
                    "Arsitektur React Native & JSI",
                    "State vs Props & Hooks",
                    "Flexbox responsive design",
                    "Stack & Tab Navigation",
                    "AsyncStorage data persistence",
                  ]
                    .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white font-semibold flex items-center justify-between"
                      >
                        <span>{item}</span>
                        <span className="text-[10px] text-amber-400">Cocok ✓</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* P9: Context API (Theme & Shopping Cart) */}
            {meeting.simId === "context-theme-cart" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-xs">Global ThemeContext</p>
                    <p className="text-[10px] text-slate-400">
                      Mode: {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sfx.click();
                      setIsDarkMode((d) => !d);
                      onActionComplete?.();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs"
                  >
                    Ganti Tema
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-xs">Keranjang Belanja Global</p>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px]">
                      {cartItems.length} item
                    </span>
                  </div>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[11px] p-1.5 bg-slate-900 rounded"
                    >
                      <span className="text-slate-200">{item.name}</span>
                      <span className="text-emerald-400 font-bold">
                        Rp {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      sfx.click();
                      setCartItems((prev) => [
                        ...prev,
                        { id: String(Date.now()), name: "Aksesori Expo USB-C", price: 45000 },
                      ]);
                      onActionComplete?.();
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded text-xs"
                  >
                    + Tambah Item ke Cart
                  </button>
                </div>
              </div>
            )}

            {/* P10: Authentication Flow */}
            {meeting.simId === "auth-flow" && (
              <div>
                {isLoggedIn ? (
                  <div className="p-4 rounded-2xl bg-slate-800 border border-emerald-500/40 text-center space-y-3">
                    <span className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center text-xl mx-auto">
                      ✓
                    </span>
                    <h4 className="font-extrabold text-white text-sm">Selamat Datang di AppStack!</h4>
                    <p className="text-xs text-slate-300">Login sebagai: {authEmail}</p>
                    <button
                      onClick={() => {
                        sfx.click();
                        setIsLoggedIn(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                    >
                      Logout Sesi
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-2.5">
                    <p className="font-bold text-sky-400 text-xs">AuthStack (Protected Navigation)</p>
                    {authError && (
                      <p className="text-[10px] text-rose-400 font-bold p-1 bg-rose-500/10 rounded">
                        {authError}
                      </p>
                    )}
                    <div>
                      <label className="text-[10px] text-slate-400">Email Kampus</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Password</label>
                      <input
                        type="password"
                        value={authPass}
                        onChange={(e) => setAuthPass(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-lg text-xs"
                    >
                      Masuk ke Sistem
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* P11: Backend CRUD */}
            {meeting.simId === "backend-crud" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Cloud Database CRUD</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Firestore Connected</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Operasi Create, Read, Update, Delete langsung tersinkronisasi dua arah.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        sfx.click();
                        onActionComplete?.();
                      }}
                      className="p-2 rounded bg-sky-600 font-bold text-white text-[11px] text-center"
                    >
                      + Create Document
                    </button>
                    <button
                      onClick={() => {
                        sfx.click();
                        onActionComplete?.();
                      }}
                      className="p-2 rounded bg-emerald-600 font-bold text-white text-[11px] text-center"
                    >
                      ↻ Sync Live Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* P12: Native Features (Camera & Location) */}
            {meeting.simId === "native-camera-gps" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                  <p className="font-bold text-white text-xs">expo-image-picker (Kamera)</p>
                  {capturedPhoto ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-sky-600/40 border border-sky-400 grid place-items-center text-xl">
                        📸
                      </div>
                      <div className="text-[11px]">
                        <p className="font-bold text-white">Foto Profil Berhasil!</p>
                        <p className="text-slate-400">Ukuran: 1080x1080 px</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sfx.click();
                        setCapturedPhoto("mock-photo-uri");
                        onActionComplete?.();
                      }}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded text-xs"
                    >
                      Ambil Foto Profil (Kamera)
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                  <p className="font-bold text-white text-xs">expo-location (GPS Sensor)</p>
                  {gpsLocation ? (
                    <div className="p-2 rounded bg-slate-900 border border-slate-700 text-[11px] space-y-1">
                      <p className="text-emerald-400 font-bold">📍 Koordinat Terdeteksi:</p>
                      <p className="text-slate-300">Lat: {gpsLocation.lat}, Lon: {gpsLocation.lon}</p>
                      <p className="text-slate-400 text-[10px]">{gpsLocation.addr}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sfx.click();
                        setGpsLocation({
                          lat: "-6.2088",
                          lon: "106.8456",
                          addr: "Lab Sistem Aplikasi Lintas Platform, Kampus",
                        });
                        onActionComplete?.();
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded text-xs"
                    >
                      Deteksi Posisi GPS Sekarang
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* P13: Animation & Performance */}
            {meeting.simId === "animated-performance" && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-8">
                <div
                  className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 grid place-items-center text-white font-black text-xs shadow-xl transition-transform duration-300"
                  style={{ transform: `scale(${animatedScale})` }}
                >
                  60 FPS Native
                </div>
                <button
                  onClick={handleTriggerAnimation}
                  disabled={isAnimating}
                  className="px-4 py-2 bg-sky-600 font-bold text-white rounded-xl text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  {isAnimating ? "Animasi Berjalan..." : "Picu Animated.timing()"}
                </button>
                <p className="text-[10px] text-slate-400 text-center max-w-[220px]">
                  useNativeDriver: true mengirim instruksi langsung ke UI Thread native.
                </p>
              </div>
            )}

            {/* P14: EAS Build APK */}
            {meeting.simId === "eas-build-apk" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                  <p className="font-bold text-white text-xs">EAS Cloud Build Generator</p>
                  <p className="text-[11px] text-slate-300">
                    Kompilasi APK Android langsung dari cloud tanpa membebani laptop.
                  </p>

                  {buildStep === "idle" && (
                    <button
                      onClick={handleRunEasBuild}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-lg text-xs"
                    >
                      Jalankan: eas build -p android --profile preview
                    </button>
                  )}

                  {buildStep === "building" && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] font-bold text-sky-400">
                        <span>Compiling Gradle in Cloud...</span>
                        <span>{buildProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 transition-all duration-300"
                          style={{ width: `${buildProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {buildStep === "success" && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-center space-y-2">
                      <p className="font-bold text-emerald-400 text-xs">✓ APK Berhasil Dibuat!</p>
                      <p className="text-[10px] text-slate-300">
                        File: <code>myfirstapp-preview.apk</code> (42 MB)
                      </p>
                      <button
                        onClick={() => sfx.click()}
                        className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded text-xs"
                      >
                        📥 Unduh APK ke HP Android
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* P15: Final Project Lab Hub */}
            {meeting.simId === "final-project-lab" && (
              <div className="space-y-2.5">
                <p className="font-bold text-sky-400 text-xs">Checklist Kesiapan Final Project:</p>
                {[
                  "Autentikasi (Login/Register)",
                  "Nested Navigation (Tab + Stack)",
                  "Global State (Context API)",
                  "REST / Cloud Backend CRUD",
                  "Fitur Hardware Native (Kamera/GPS)",
                  "EAS Build APK Android Selesai",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2 text-[11px]"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* P16: UAS Showcase */}
            {meeting.simId === "uas-showcase" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 grid place-items-center text-2xl">
                  🎓
                </div>
                <h3 className="font-black text-white text-base">UAS Live Demo & Sidang</h3>
                <p className="text-xs text-slate-300 max-w-[240px] leading-relaxed">
                  Aplikasi cross-platform React Native telah berhasil dibangun lengkap 16 pertemuan!
                </p>
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 w-full text-left text-[11px] space-y-1">
                  <p className="text-sky-400 font-bold">Nilai Capaian:</p>
                  <p className="text-slate-200">• Fungsionalitas & Build APK: 100/100</p>
                  <p className="text-slate-200">• Arsitektur Kode: Bersih & Modular</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar Simulasi */}
          <div
            className={`px-4 py-2 flex items-center justify-around border-t shrink-0 ${
              isDarkMode ? "bg-[#0d162e] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <button
              onClick={() => {
                sfx.click();
                setActiveTab("home");
                setDetailItem(null);
              }}
              className={`flex flex-col items-center text-[10px] font-bold ${
                activeTab === "home" ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <span className="text-sm">🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                sfx.click();
                setActiveTab("catalog");
              }}
              className={`flex flex-col items-center text-[10px] font-bold ${
                activeTab === "catalog" ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <span className="text-sm">📦</span>
              <span>Katalog</span>
            </button>
            <button
              onClick={() => {
                sfx.click();
                setActiveTab("cart");
              }}
              className={`flex flex-col items-center text-[10px] font-bold relative ${
                activeTab === "cart" ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <span className="text-sm">🛒</span>
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black grid place-items-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                sfx.click();
                setActiveTab("profile");
              }}
              className={`flex flex-col items-center text-[10px] font-bold ${
                activeTab === "profile" ? "text-sky-400" : "text-slate-400"
              }`}
            >
              <span className="text-sm">👤</span>
              <span>Profil</span>
            </button>
          </div>

          {/* Home Bar Indicator (iPhone Home Swipe Line) */}
          <div className="py-1.5 grid place-items-center shrink-0">
            <div className="w-24 h-1 rounded-full bg-slate-600/70" />
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 font-semibold mt-3 text-center">
        📱 Simulasi Interaktif • Expo Go & Android Native Preview
      </p>
    </div>
  );
}
