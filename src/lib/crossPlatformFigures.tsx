/* ==========================================================================
   CROSS-PLATFORM FIGURES & DIAGRAMS (SVG INLINE - RETINA & VECTOR)
   Visual grafis edukasi untuk arsitektur React Native, Expo, Flexbox,
   Navigation, State Management, Hardware API, dan EAS Build APK.
   ========================================================================== */

import type { ReactNode } from "react";

const CYAN = "#38bdf8";
const INDIGO = "#818cf8";
const EMERALD = "#34d399";
const AMBER = "#fbbf24";
const CORAL = "#f87171";
const SLATE_BG = "#0b1528";
const CARD_BG = "rgba(15, 28, 50, 0.85)";

const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

function DefsMarkers() {
  return (
    <defs>
      {[CYAN, INDIGO, EMERALD, AMBER, CORAL].map((color) => (
        <marker
          key={color}
          id={`arrow-${color.slice(1)}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill={color} />
        </marker>
      ))}
      <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0d1b33" />
        <stop offset="100%" stopColor="#071120" />
      </linearGradient>
    </defs>
  );
}

/* ==========================================================================
   1. DIAGRAM ARSITEKTUR REACT NATIVE: JS Thread ⇄ JSI ⇄ Native UI
   ========================================================================== */
export function FigReactNativeArchitecture() {
  return (
    <svg
      viewBox="0 0 720 340"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Arsitektur React Native dan JSI C++ Bridge"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="340" rx="16" fill="url(#bg-grad)" />

      {/* Header Banner */}
      <text
        x="360"
        y="34"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="14"
        fontWeight="800"
        fontFamily={monoFont}
        letterSpacing="0.05em"
      >
        ARSITEKTUR MODERN REACT NATIVE (JSI &amp; FABRIC)
      </text>

      {/* 1. JavaScript Engine (Hermes) */}
      <g transform="translate(30, 60)">
        <rect
          width="200"
          height="220"
          rx="12"
          fill={CARD_BG}
          stroke={CYAN}
          strokeWidth="1.5"
        />
        <rect width="200" height="36" rx="12" fill="rgba(56,189,248,0.15)" />
        <circle cx="20" cy="18" r="4" fill={CORAL} />
        <circle cx="34" cy="18" r="4" fill={AMBER} />
        <circle cx="48" cy="18" r="4" fill={EMERALD} />
        <text
          x="100"
          y="23"
          textAnchor="middle"
          fill={CYAN}
          fontSize="11"
          fontWeight="bold"
          fontFamily={monoFont}
        >
          JS THREAD (HERMES)
        </text>

        <text x="20" y="65" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          • Komponen React (JSX)
        </text>
        <text x="20" y="90" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          • State &amp; Hooks (useState)
        </text>
        <text x="20" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          • Logika Bisnis &amp; Navigasi
        </text>
        <text x="20" y="140" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          • Network (fetch REST API)
        </text>

        {/* Chip Bottom */}
        <rect x="20" y="170" width="160" height="30" rx="8" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" />
        <text x="100" y="190" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Tulis Sekali (JS/TS)
        </text>
      </g>

      {/* 2. JSI & TurboModules (Center Bridge) */}
      <g transform="translate(260, 80)">
        <rect
          width="200"
          height="180"
          rx="12"
          fill="rgba(129,140,248,0.08)"
          stroke={INDIGO}
          strokeWidth="1.8"
          strokeDasharray="6 4"
        />
        <text
          x="100"
          y="32"
          textAnchor="middle"
          fill={INDIGO}
          fontSize="12"
          fontWeight="800"
          fontFamily={monoFont}
        >
          JSI (JavaScript Interface)
        </text>
        <text x="100" y="52" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          C++ Direct Memory Access
        </text>

        <rect x="20" y="70" width="160" height="36" rx="8" fill="rgba(129,140,248,0.15)" />
        <text x="100" y="92" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          TurboModules (Native API)
        </text>

        <rect x="20" y="118" width="160" height="36" rx="8" fill="rgba(129,140,248,0.15)" />
        <text x="100" y="140" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Fabric Renderer (UI)
        </text>
      </g>

      {/* 3. Native Platform Thread (Android & iOS) */}
      <g transform="translate(490, 60)">
        <rect
          width="200"
          height="220"
          rx="12"
          fill={CARD_BG}
          stroke={EMERALD}
          strokeWidth="1.5"
        />
        <rect width="200" height="36" rx="12" fill="rgba(52,211,153,0.15)" />
        <text
          x="100"
          y="23"
          textAnchor="middle"
          fill={EMERALD}
          fontSize="11"
          fontWeight="bold"
          fontFamily={monoFont}
        >
          NATIVE THREAD (UI)
        </text>

        <text x="20" y="65" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          • Android: ViewGroup / View
        </text>
        <text x="20" y="90" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          • iOS: UIView / UIKit
        </text>
        <text x="20" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          • Hardware: Kamera, GPS
        </text>
        <text x="20" y="140" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
          • 60 FPS / 120 FPS Native
        </text>

        <rect x="20" y="170" width="160" height="30" rx="8" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.3)" />
        <text x="100" y="190" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Performa Native Murni
        </text>
      </g>

      {/* Arrows Interconnect */}
      <path
        d="M 230 150 L 260 150"
        stroke={CYAN}
        strokeWidth="2"
        markerEnd="url(#arrow-38bdf8)"
      />
      <path
        d="M 260 180 L 230 180"
        stroke={INDIGO}
        strokeWidth="2"
        markerEnd="url(#arrow-818cf8)"
      />
      <path
        d="M 460 150 L 490 150"
        stroke={INDIGO}
        strokeWidth="2"
        markerEnd="url(#arrow-818cf8)"
      />
      <path
        d="M 490 180 L 460 180"
        stroke={EMERALD}
        strokeWidth="2"
        markerEnd="url(#arrow-34d399)"
      />

      {/* Footer Info */}
      <text
        x="360"
        y="315"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        fontFamily={monoFont}
      >
        Arsitektur JSI memungkinkan pemanggilan fungsi native langsung tanpa overhead serialisasi JSON lama
      </text>
    </svg>
  );
}

/* ==========================================================================
   2. DIAGRAM EKOSISTEM EXPO: Managed Workflow & EAS Build
   ========================================================================== */
export function FigExpoEcosystem() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Alur Ekosistem Expo Managed Workflow dan EAS Build"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="300" rx="16" fill="url(#bg-grad)" />

      <text
        x="360"
        y="30"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="800"
        fontFamily={monoFont}
      >
        ALUR PENGEMBANGAN: EXPO MANAGED WORKFLOW → EAS BUILD
      </text>

      {/* Step 1: Create & Code */}
      <g transform="translate(30, 60)">
        <rect width="140" height="180" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="140" height="28" rx="10" fill="rgba(56,189,248,0.15)" />
        <text x="70" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. CODING (PC)
        </text>
        <text x="14" y="55" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• VS Code</text>
        <text x="14" y="75" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• create-expo-app</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• App.js / Expo SDK</text>
        <text x="14" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Fast Refresh (HMR)</text>
        <rect x="10" y="140" width="120" height="26" rx="6" fill="rgba(56,189,248,0.1)" />
        <text x="70" y="157" textAnchor="middle" fill={CYAN} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          npx expo start
        </text>
      </g>

      {/* Arrow 1 */}
      <path d="M 175 150 L 200 150" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Step 2: Live Test Expo Go */}
      <g transform="translate(205, 60)">
        <rect width="140" height="180" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <rect width="140" height="28" rx="10" fill="rgba(129,140,248,0.15)" />
        <text x="70" y="19" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          2. EXPO GO (HP)
        </text>
        <text x="14" y="55" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• Scan QR Code</text>
        <text x="14" y="75" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• WiFi / Tunnel</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Preview Instan HP</text>
        <text x="14" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Log &amp; Shake Menu</text>
        <rect x="10" y="140" width="120" height="26" rx="6" fill="rgba(129,140,248,0.1)" />
        <text x="70" y="157" textAnchor="middle" fill={INDIGO} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          Tanpa Kabel USB
        </text>
      </g>

      {/* Arrow 2 */}
      <path d="M 350 150 L 375 150" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Step 3: EAS Build Cloud */}
      <g transform="translate(380, 60)">
        <rect width="140" height="180" rx="10" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <rect width="140" height="28" rx="10" fill="rgba(251,191,36,0.15)" />
        <text x="70" y="19" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          3. EAS CLOUD
        </text>
        <text x="14" y="55" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• eas.json config</text>
        <text x="14" y="75" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• Cloud Linux Runner</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Gradle &amp; Keystore</text>
        <text x="14" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Tanpa Android Studio</text>
        <rect x="10" y="140" width="120" height="26" rx="6" fill="rgba(251,191,36,0.1)" />
        <text x="70" y="157" textAnchor="middle" fill={AMBER} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          eas build -p android
        </text>
      </g>

      {/* Arrow 3 */}
      <path d="M 525 150 L 550 150" stroke={AMBER} strokeWidth="2" markerEnd="url(#arrow-fbbf24)" />

      {/* Step 4: Output APK / Store */}
      <g transform="translate(555, 60)">
        <rect width="135" height="180" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="135" height="28" rx="10" fill="rgba(52,211,153,0.15)" />
        <text x="67" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          4. ARTEFAK APK
        </text>
        <text x="14" y="55" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• file .APK mandiri</text>
        <text x="14" y="75" fill="#e2e8f0" fontSize="10" fontFamily={monoFont}>• Siap Install HP</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Format .AAB (Store)</text>
        <text x="14" y="115" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Google Play &amp; UAS</text>
        <rect x="10" y="140" width="115" height="26" rx="6" fill="rgba(52,211,153,0.1)" />
        <text x="67" y="157" textAnchor="middle" fill={EMERALD} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          Aplikasi Jadi 🚀
        </text>
      </g>

      {/* Bottom Footer */}
      <text x="360" y="275" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Siklus utuh: dari koding pertama hingga APK berdiri sendiri tanpa butuh PC berspesifikasi tinggi
      </text>
    </svg>
  );
}

/* ==========================================================================
   3. DIAGRAM FLEXBOX MOBILE (COLUMN DEFAULT VS ROW)
   ========================================================================== */
export function FigFlexboxMobile() {
  return (
    <svg
      viewBox="0 0 720 320"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Tata Letak Flexbox React Native"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="320" rx="16" fill="url(#bg-grad)" />

      <text
        x="360"
        y="30"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="800"
        fontFamily={monoFont}
      >
        TATA LETAK FLEXBOX REACT NATIVE (DEFAULT: flexDirection: &apos;column&apos;)
      </text>

      {/* KIRI: flexDirection: 'column' */}
      <g transform="translate(40, 60)">
        <rect width="300" height="210" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="150" y="26" textAnchor="middle" fill={CYAN} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          flexDirection: &apos;column&apos; (Default HP)
        </text>
        <text x="150" y="44" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>
          Elemen tersusun vertikal dari atas ke bawah
        </text>

        {/* 3 Box Items */}
        <rect x="25" y="60" width="250" height="36" rx="8" fill="rgba(56,189,248,0.2)" stroke={CYAN} strokeWidth="1" />
        <text x="150" y="82" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Box 1 (Header Card)
        </text>

        <rect x="25" y="105" width="250" height="36" rx="8" fill="rgba(56,189,248,0.2)" stroke={CYAN} strokeWidth="1" />
        <text x="150" y="127" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Box 2 (Content Body)
        </text>

        <rect x="25" y="150" width="250" height="36" rx="8" fill="rgba(56,189,248,0.2)" stroke={CYAN} strokeWidth="1" />
        <text x="150" y="172" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Box 3 (Action Button)
        </text>

        <path d="M 285 65 L 285 180" stroke={AMBER} strokeWidth="1.5" markerEnd="url(#arrow-fbbf24)" />
        <text x="270" y="125" textAnchor="middle" fill={AMBER} fontSize="8" fontFamily={monoFont} transform="rotate(90 270 125)">
          Main Axis ↓
        </text>
      </g>

      {/* KANAN: flexDirection: 'row' */}
      <g transform="translate(380, 60)">
        <rect width="300" height="210" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="150" y="26" textAnchor="middle" fill={EMERALD} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          flexDirection: &apos;row&apos; (Horizontal)
        </text>
        <text x="150" y="44" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>
          Cocok untuk Navbar, Baris Ikon, atau Grid Kolom
        </text>

        {/* 3 Box Items Horizontal */}
        <rect x="20" y="65" width="75" height="110" rx="8" fill="rgba(52,211,153,0.2)" stroke={EMERALD} strokeWidth="1" />
        <text x="57" y="125" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Kolom 1
        </text>

        <rect x="110" y="65" width="75" height="110" rx="8" fill="rgba(52,211,153,0.2)" stroke={EMERALD} strokeWidth="1" />
        <text x="147" y="125" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Kolom 2
        </text>

        <rect x="200" y="65" width="75" height="110" rx="8" fill="rgba(52,211,153,0.2)" stroke={EMERALD} strokeWidth="1" />
        <text x="237" y="125" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Kolom 3
        </text>

        <path d="M 25 190 L 270 190" stroke={AMBER} strokeWidth="1.5" markerEnd="url(#arrow-fbbf24)" />
        <text x="150" y="202" textAnchor="middle" fill={AMBER} fontSize="8" fontFamily={monoFont}>
          Main Axis → (Horizontal)
        </text>
      </g>

      <text x="360" y="295" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Ingat: Di Web CSS default adalah &apos;row&apos;, tetapi di React Native default adalah &apos;column&apos; sesuai layar HP memanjang!
      </text>
    </svg>
  );
}

/* ==========================================================================
   4. DIAGRAM REACT NAVIGATION: Stack & Tab Hierarchy
   ========================================================================== */
export function FigNavigationHierarchy() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Arsitektur Navigasi Stack dan Tab"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="300" rx="16" fill="url(#bg-grad)" />

      <text
        x="360"
        y="30"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="800"
        fontFamily={monoFont}
      >
        HIERARKI REACT NAVIGATION (STACK NAVIGATOR ⇄ BOTTOM TABS)
      </text>

      {/* Navigation Container Root */}
      <rect x="180" y="55" width="360" height="40" rx="8" fill="rgba(56,189,248,0.15)" stroke={CYAN} strokeWidth="1.5" />
      <text x="360" y="80" textAnchor="middle" fill={CYAN} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
        &lt;NavigationContainer&gt; (Root App Provider)
      </text>

      {/* Connector line */}
      <path d="M 360 95 L 360 120" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Stack Navigator */}
      <g transform="translate(140, 120)">
        <rect width="440" height="130" rx="12" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <text x="220" y="22" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          Stack.Navigator (Transisi Slide &amp; History Back)
        </text>

        {/* Screens */}
        <g transform="translate(20, 35)">
          <rect width="115" height="75" rx="8" fill="rgba(52,211,153,0.15)" stroke={EMERALD} strokeWidth="1" />
          <text x="57" y="25" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
            TabMain
          </text>
          <text x="57" y="45" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            • Home Screen
          </text>
          <text x="57" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            • Profile Screen
          </text>
        </g>

        {/* Transition arrow */}
        <path d="M 145 72 L 165 72" stroke={INDIGO} strokeWidth="1.5" markerEnd="url(#arrow-818cf8)" />

        <g transform="translate(175, 35)">
          <rect width="115" height="75" rx="8" fill="rgba(56,189,248,0.15)" stroke={CYAN} strokeWidth="1" />
          <text x="57" y="25" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
            DetailScreen
          </text>
          <text x="57" y="45" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            navigation.navigate
          </text>
          <text x="57" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            ({"{ id: item.id }"})
          </text>
        </g>

        {/* Transition arrow */}
        <path d="M 300 72 L 320 72" stroke={INDIGO} strokeWidth="1.5" markerEnd="url(#arrow-818cf8)" />

        <g transform="translate(330, 35)">
          <rect width="90" height="75" rx="8" fill="rgba(251,191,36,0.15)" stroke={AMBER} strokeWidth="1" />
          <text x="45" y="25" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
            ModalScreen
          </text>
          <text x="45" y="45" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            presentation:
          </text>
          <text x="45" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>
            &apos;modal&apos;
          </text>
        </g>
      </g>

      <text x="360" y="278" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Pengguna berpindah halaman dengan animasi asli Android/iOS dan penanganan tombol Back perangkat
      </text>
    </svg>
  );
}

/* ==========================================================================
   5. DIAGRAM DATA FLOW: State -> API -> AsyncStorage/SQLite
   ========================================================================== */
export function FigDataPersistenceFlow() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Alur Data State, REST API, dan Penyimpanan Lokal"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="280" rx="16" fill="url(#bg-grad)" />

      <text
        x="360"
        y="30"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="800"
        fontFamily={monoFont}
      >
        SIKLUS DATA MOBILE: STATE, REMOTE API, DAN OFFLINE STORAGE
      </text>

      {/* Box 1: UI / React State */}
      <g transform="translate(35, 65)">
        <rect width="180" height="150" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="180" height="28" rx="10" fill="rgba(56,189,248,0.15)" />
        <text x="90" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. UI &amp; STATE
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="10" fontFamily={monoFont}>• useState / useReducer</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Context API Global</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Instant Re-render</text>
        <text x="14" y="125" fill={AMBER} fontSize="9" fontFamily={monoFont}>⚠️ Hilang jika app di-close</text>
      </g>

      {/* Arrow 1 to Cloud */}
      <path d="M 225 110 L 265 110" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />
      <path d="M 265 130 L 225 130" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Box 2: Cloud / Remote API */}
      <g transform="translate(270, 65)">
        <rect width="180" height="150" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <rect width="180" height="28" rx="10" fill="rgba(129,140,248,0.15)" />
        <text x="90" y="19" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          2. REST API / FIREBASE
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="10" fontFamily={monoFont}>• fetch / Axios CRUD</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Cloud Firestore</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Auth Token / JWT</text>
        <text x="14" y="125" fill={CYAN} fontSize="9" fontFamily={monoFont}>☁️ Sinkronisasi multi-device</text>
      </g>

      {/* Arrow 2 to Local Storage */}
      <path d="M 460 110 L 500 110" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />
      <path d="M 500 130 L 460 130" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrow-34d399)" />

      {/* Box 3: AsyncStorage & SQLite */}
      <g transform="translate(505, 65)">
        <rect width="180" height="150" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="180" height="28" rx="10" fill="rgba(52,211,153,0.15)" />
        <text x="90" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          3. OFFLINE STORAGE
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="10" fontFamily={monoFont}>• @react-native-async-storage</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• expo-sqlite DB</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>• Cache Data Offline</text>
        <text x="14" y="125" fill={EMERALD} fontSize="9" fontFamily={monoFont}>💾 Data tetap utuh saat offline</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Arsitektur offline-first: Baca dari cache lokal dulu, lalu lakukan sync ke backend saat ada koneksi internet
      </text>
    </svg>
  );
}

/* ==========================================================================
   6. DIAGRAM NATIVE HARDWARE APIS (Kamera, GPS, Notifikasi)
   ========================================================================== */
export function FigNativeHardwareApis() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Akses Fitur Native Device"
    >
      <DefsMarkers />
      <rect x="0" y="0" width="720" height="280" rx="16" fill="url(#bg-grad)" />

      <text
        x="360"
        y="30"
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="800"
        fontFamily={monoFont}
      >
        AKSES FITUR NATIVE PERANGKAT DENGAN EXPO SDK
      </text>

      {/* Feature 1: Camera */}
      <g transform="translate(40, 60)">
        <rect width="190" height="160" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="95" y="30" textAnchor="middle" fill={CYAN} fontSize="18">📷</text>
        <text x="95" y="54" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          expo-camera &amp; ImagePicker
        </text>
        <text x="16" y="80" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Izin: requestCameraPermissionsAsync</text>
        <text x="16" y="100" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Shutter capture &amp; Flash mode</text>
        <text x="16" y="120" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Galeri &amp; Upload gambar</text>
        <rect x="15" y="130" width="160" height="20" rx="4" fill="rgba(56,189,248,0.1)" />
        <text x="95" y="144" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Kamera Live Viewfinder
        </text>
      </g>

      {/* Feature 2: Location & GPS */}
      <g transform="translate(265, 60)">
        <rect width="190" height="160" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="95" y="30" textAnchor="middle" fill={EMERALD} fontSize="18">📍</text>
        <text x="95" y="54" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          expo-location &amp; Maps
        </text>
        <text x="16" y="80" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• requestForegroundPermissionsAsync</text>
        <text x="16" y="100" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• getCurrentPositionAsync (GPS)</text>
        <text x="16" y="120" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Geocoding alamat ⇄ koordinat</text>
        <rect x="15" y="130" width="160" height="20" rx="4" fill="rgba(52,211,153,0.1)" />
        <text x="95" y="144" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Latitude &amp; Longitude Real-time
        </text>
      </g>

      {/* Feature 3: Notifications */}
      <g transform="translate(490, 60)">
        <rect width="190" height="160" rx="12" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <text x="95" y="30" textAnchor="middle" fill={AMBER} fontSize="18">🔔</text>
        <text x="95" y="54" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          expo-notifications
        </text>
        <text x="16" y="80" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Push token registrasi</text>
        <text x="16" y="100" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Local scheduled reminders</text>
        <text x="16" y="120" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Background notification handler</text>
        <rect x="15" y="130" width="160" height="20" rx="4" fill="rgba(251,191,36,0.1)" />
        <text x="95" y="144" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Notifikasi Banner &amp; Suara
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Semua modul native terpasang secara modular dan aman dengan sistem perizinan runtime iOS dan Android
      </text>
    </svg>
  );
}

/* ==========================================================================
   7. KATALOG REGISTRY GAMBAR CROSS-PLATFORM
   ========================================================================== */
export const CROSS_PLATFORM_FIGURES: Record<
  string,
  { node: ReactNode; caption: string }
> = {
  "rn-architecture": {
    node: <FigReactNativeArchitecture />,
    caption: "Gambar A.1 — Arsitektur React Native Modern: JS Thread berkomunikasi langsung ke Native Thread via JSI C++ Interface.",
  },
  "expo-workflow": {
    node: <FigExpoEcosystem />,
    caption: "Gambar A.2 — Siklus Lengkap Ekosistem Expo: Managed Workflow, pengujian live di Expo Go, hingga build APK mandiri via EAS Build.",
  },
  "rn-flexbox": {
    node: <FigFlexboxMobile />,
    caption: "Gambar A.3 — Tata Letak Flexbox Mobile: default flexDirection adalah 'column' memanjang ke bawah sesuai rasio layar HP.",
  },
  "rn-navigation": {
    node: <FigNavigationHierarchy />,
    caption: "Gambar A.4 — Struktur Navigasi React Navigation: Stack Navigator untuk detail alur, dan Bottom Tabs untuk menu utama.",
  },
  "rn-data-flow": {
    node: <FigDataPersistenceFlow />,
    caption: "Gambar A.5 — Siklus Data Mobile: UI State di-sinkronkan dengan REST API / Firestore dan disimpan permanen di AsyncStorage / SQLite.",
  },
  "rn-native-hardware": {
    node: <FigNativeHardwareApis />,
    caption: "Gambar A.6 — Integrasi Perangkat Keras Native: Kamera, GPS Lokasi, dan Push Notification menggunakan modul Expo SDK.",
  },
};

export const getCrossPlatformFigure = (key: string) =>
  CROSS_PLATFORM_FIGURES[key.trim()];
