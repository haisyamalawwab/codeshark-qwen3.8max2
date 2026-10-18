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
const ROSE = "#f43f5e";
const SLATE_BG = "#0b1528";
const CARD_BG = "rgba(15, 28, 50, 0.85)";

const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

function DefsMarkers() {
  return (
    <defs>
      {[CYAN, INDIGO, EMERALD, AMBER, CORAL, ROSE].map((color) => (
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
   7. DIAGRAM ES6+ & JSX KE VIRTUAL DOM (P02)
   ========================================================================== */
export function FigReactFoundation() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Sintaks ES6 dan Kompilasi JSX ke Virtual DOM"
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
        MODERN ES6+ &amp; PENGOLAHAN JSX KE ELEMEN NATIVE
      </text>

      {/* Column 1: ES6 Modern Primitives */}
      <g transform="translate(35, 60)">
        <rect width="200" height="160" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="200" height="28" rx="12" fill="rgba(56,189,248,0.15)" />
        <text x="100" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. ES6+ SYNTAX
        </text>
        <text x="14" y="52" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Arrow: const get = () =&gt; ...</text>
        <text x="14" y="72" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Destructuring: const &#123; user &#125; = ...</text>
        <text x="14" y="92" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Spread: [...todos, newTodo]</text>
        <text x="14" y="112" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Async/Await: fetch data</text>
        <rect x="15" y="126" width="170" height="22" rx="5" fill="rgba(56,189,248,0.1)" />
        <text x="100" y="141" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Fondasi Logika Komponen
        </text>
      </g>

      {/* Arrow 1 */}
      <path d="M 245 140 L 275 140" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Column 2: JSX Declaration */}
      <g transform="translate(285, 60)">
        <rect width="190" height="160" rx="12" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <rect width="190" height="28" rx="12" fill="rgba(129,140,248,0.15)" />
        <text x="95" y="19" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          2. JSX DECLARATION
        </text>
        <text x="14" y="52" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>&lt;View style=&#123;styles.card&#125;&gt;</text>
        <text x="24" y="70" fill={CYAN} fontSize="8" fontFamily={monoFont}>&lt;Text&gt;&#123;title&#125;&lt;/Text&gt;</text>
        <text x="24" y="88" fill={EMERALD} fontSize="8" fontFamily={monoFont}>&lt;Button onPress=&#123;save&#125; /&gt;</text>
        <text x="14" y="106" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>&lt;/View&gt;</text>
        <rect x="15" y="126" width="160" height="22" rx="5" fill="rgba(129,140,248,0.1)" />
        <text x="95" y="141" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Kompilasi ke React.createElement
        </text>
      </g>

      {/* Arrow 2 */}
      <path d="M 485 140 L 515 140" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Column 3: Native Platform Views */}
      <g transform="translate(525, 60)">
        <rect width="160" height="160" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="160" height="28" rx="12" fill="rgba(52,211,153,0.15)" />
        <text x="80" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          3. NATIVE UI RENDER
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>Android: ViewGroup</text>
        <text x="14" y="75" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>iOS: UIView</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>TextView / UITextView</text>
        <rect x="15" y="126" width="130" height="22" rx="5" fill="rgba(52,211,153,0.1)" />
        <text x="80" y="141" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Widget Asli 60 FPS
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        JSX bukan HTML string — JSX adalah representasi deklaratif yang diterjemahkan langsung ke komponen native asli
      </text>
    </svg>
  );
}

/* ==========================================================================
   8. DIAGRAM HOOKS & USEEFFECT LIFECYCLE (P04)
   ========================================================================== */
export function FigHooksLifecycle() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Siklus Hidup useState dan useEffect"
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
        SIKLUS HIDUP STATE &amp; EFEK SAMPING (USEEFFECT)
      </text>

      {/* Stage 1: Initial Render */}
      <g transform="translate(35, 60)">
        <rect width="190" height="155" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="190" height="28" rx="12" fill="rgba(56,189,248,0.15)" />
        <text x="95" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          FASE MOUNT (PERTAMA)
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>1. Inisialisasi State Awal</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>2. Komponen Merender UI</text>
        <text x="14" y="95" fill={EMERALD} fontSize="9" fontFamily={monoFont}>3. useEffect(&#123;...&#125;, [])</text>
        <rect x="15" y="120" width="160" height="22" rx="5" fill="rgba(56,189,248,0.1)" />
        <text x="95" y="135" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Fetch API / Load Storage
        </text>
      </g>

      {/* Arrow 1 */}
      <path d="M 235 137 L 265 137" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Stage 2: State Update & Re-render */}
      <g transform="translate(275, 60)">
        <rect width="190" height="155" rx="12" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <rect width="190" height="28" rx="12" fill="rgba(129,140,248,0.15)" />
        <text x="95" y="19" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          FASE UPDATE (INTERAKSI)
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>1. Event: onPress / input</text>
        <text x="14" y="75" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>2. setState(newValue)</text>
        <text x="14" y="95" fill={AMBER} fontSize="9" fontFamily={monoFont}>3. useEffect(&#123;...&#125;, [dep])</text>
        <rect x="15" y="120" width="160" height="22" rx="5" fill="rgba(129,140,248,0.1)" />
        <text x="95" y="135" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Re-render Otomatis
        </text>
      </g>

      {/* Arrow 2 */}
      <path d="M 475 137 L 505 137" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Stage 3: Unmount & Cleanup */}
      <g transform="translate(515, 60)">
        <rect width="170" height="155" rx="12" fill={CARD_BG} stroke={ROSE} strokeWidth="1.2" />
        <rect width="170" height="28" rx="12" fill="rgba(244,63,94,0.15)" />
        <text x="85" y="19" textAnchor="middle" fill={ROSE} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          FASE UNMOUNT (LEPAS)
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>1. Layar Ditutup / Back</text>
        <text x="14" y="75" fill={ROSE} fontSize="9" fontFamily={monoFont}>2. Cleanup function jalan</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>return () =&gt; clearInterval</text>
        <rect x="15" y="120" width="140" height="22" rx="5" fill="rgba(244,63,94,0.1)" />
        <text x="85" y="135" textAnchor="middle" fill={ROSE} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Mencegah Memory Leak
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Sediakan return cleanup function di useEffect untuk timer, listener sensor, dan websocket!
      </text>
    </svg>
  );
}

/* ==========================================================================
   9. DIAGRAM MINI PROJECT 1 CHECKLIST (P07)
   ========================================================================== */
export function FigProjectChecklist() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Checklist Mini Project 1 Pra-UTS"
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
        ARSITEKTUR &amp; CHECKLIST MINI PROJECT 1 (PRA-UTS)
      </text>

      {/* Pillar 1: UI & Nav */}
      <g transform="translate(30, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={CYAN} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          📱 1. UI &amp; NAV
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• 3+ Screen Stack</text>
        <text x="12" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Flexbox Responsif</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Touchable / Pressable</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Status Bar styled</text>
        <rect x="12" y="125" width="126" height="20" rx="4" fill="rgba(56,189,248,0.15)" />
        <text x="75" y="139" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Bobot 25%</text>
      </g>

      {/* Pillar 2: State & Logic */}
      <g transform="translate(195, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={INDIGO} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          ⚙️ 2. CRUD STATE
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Create item baru</text>
        <text x="12" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Read via FlatList</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Toggle complete</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Delete with Alert</text>
        <rect x="12" y="125" width="126" height="20" rx="4" fill="rgba(129,140,248,0.15)" />
        <text x="75" y="139" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Bobot 35%</text>
      </g>

      {/* Pillar 3: Persistence */}
      <g transform="translate(360, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={EMERALD} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          💾 3. ASYNCSTORAGE
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• setItem(JSON)</text>
        <text x="12" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• getItem saat boot</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• try/catch error</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Data tidak hilang</text>
        <rect x="12" y="125" width="126" height="20" rx="4" fill="rgba(52,211,153,0.15)" />
        <text x="75" y="139" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Bobot 25%</text>
      </g>

      {/* Pillar 4: QA & Repo */}
      <g transform="translate(525, 60)">
        <rect width="165" height="155" rx="10" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <text x="82" y="28" textAnchor="middle" fill={AMBER} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          📦 4. QA &amp; DEMO
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Bebas error runtime</text>
        <text x="12" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Repo GitHub public</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• README + Screenshot</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Video demo HP 2 mnt</text>
        <rect x="12" y="125" width="141" height="20" rx="4" fill="rgba(251,191,36,0.15)" />
        <text x="82" y="139" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Bobot 15%</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Mini Project 1 merefleksikan 15% dari total nilai akhir semester — pastikan semua 4 pilar terpenuhi!
      </text>
    </svg>
  );
}

/* ==========================================================================
   10. DIAGRAM MATRIKS UTS (P08)
   ========================================================================== */
export function FigUtsMatrix() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Matriks Ujian Tengah Semester"
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
        MATRIKS EVALUASI UJIAN TENGAH SEMESTER (BOBOT TOTAL: 20%)
      </text>

      {/* Bagian 1: Ujian Teori (10%) */}
      <g transform="translate(45, 60)">
        <rect width="300" height="160" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="300" height="30" rx="12" fill="rgba(56,189,248,0.15)" />
        <text x="150" y="20" textAnchor="middle" fill={CYAN} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          1. EVALUASI TEORI &amp; KONSEP (10%)
        </text>
        <text x="16" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Perbandingan Native vs Cross-Platform (RN)</text>
        <text x="16" y="75" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Arsitektur JSI C++ &amp; JS Engine Hermes</text>
        <text x="16" y="95" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Prinsip Flexbox: Column vs Row</text>
        <text x="16" y="115" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Lifecycle useEffect, dependencies &amp; cleanup</text>
        <rect x="16" y="128" width="268" height="20" rx="4" fill="rgba(56,189,248,0.1)" />
        <text x="150" y="142" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Mencakup CPMK 1 &amp; CPMK 2
        </text>
      </g>

      {/* Bagian 2: Praktik Live Coding (10%) */}
      <g transform="translate(375, 60)">
        <rect width="300" height="160" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="300" height="30" rx="12" fill="rgba(52,211,153,0.15)" />
        <text x="150" y="20" textAnchor="middle" fill={EMERALD} fontSize="11" fontWeight="bold" fontFamily={monoFont}>
          2. LIVE CODING STUDI KASUS (10%)
        </text>
        <text x="16" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Form Input Uang &amp; Kategori Pengeluaran</text>
        <text x="16" y="75" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• FlatList dengan Formatting Kurs Rupiah</text>
        <text x="16" y="95" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Filter Search Dinamis &amp; Kalkulasi Saldo</text>
        <text x="16" y="115" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Persistensi Data Transaksi ke AsyncStorage</text>
        <rect x="16" y="128" width="268" height="20" rx="4" fill="rgba(52,211,153,0.1)" />
        <text x="150" y="142" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Mencakup CPMK 2 &amp; CPMK 3
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Durasi pengerjaan: 100 menit terpadu di laboratorium komputer / laptop mandiri
      </text>
    </svg>
  );
}

/* ==========================================================================
   11. DIAGRAM PROP DRILLING VS CONTEXT API (P09)
   ========================================================================== */
export function FigContextGlobal() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Prop Drilling vs Context API Global State"
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
        MASALAH PROP DRILLING VS SOLUSI CONTEXT API GLOBAL
      </text>

      {/* Sisi Kiri: Masalah Prop Drilling */}
      <g transform="translate(45, 60)">
        <rect width="290" height="160" rx="12" fill={CARD_BG} stroke={ROSE} strokeWidth="1.2" />
        <rect width="290" height="28" rx="12" fill="rgba(244,63,94,0.15)" />
        <text x="145" y="19" textAnchor="middle" fill={ROSE} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ❌ PROP DRILLING (RUMIT)
        </text>
        <text x="145" y="55" textAnchor="middle" fill={CYAN} fontSize="9" fontFamily={monoFont}>&lt;App /&gt; (Root State)</text>
        <path d="M 145 62 L 145 78" stroke={ROSE} strokeWidth="1.5" markerEnd="url(#arrow-f43f5e)" />
        <text x="145" y="90" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>&lt;Navigator&gt; (props hanya lewat)</text>
        <path d="M 145 96 L 145 112" stroke={ROSE} strokeWidth="1.5" markerEnd="url(#arrow-f43f5e)" />
        <text x="145" y="124" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>&lt;HomeScreen&gt; (props hanya lewat)</text>
        <path d="M 145 130 L 145 144" stroke={ROSE} strokeWidth="1.5" markerEnd="url(#arrow-f43f5e)" />
        <text x="145" y="156" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>&lt;CartBadge /&gt; (Konsumen Asli)</text>
      </g>

      {/* Sisi Kanan: Solusi Context API */}
      <g transform="translate(385, 60)">
        <rect width="290" height="160" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="290" height="28" rx="12" fill="rgba(52,211,153,0.15)" />
        <text x="145" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ✅ CONTEXT API (AKSES LANGSUNG)
        </text>
        <rect x="25" y="42" width="240" height="32" rx="6" fill="rgba(52,211,153,0.1)" stroke={EMERALD} strokeWidth="1" />
        <text x="145" y="62" textAnchor="middle" fill={EMERALD} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          &lt;CartContext.Provider value=&#123;cart&#125;&gt;
        </text>
        
        {/* Direct access curved line */}
        <path d="M 145 74 L 145 125" stroke={CYAN} strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow-38bdf8)" />
        
        <rect x="35" y="128" width="220" height="30" rx="6" fill="rgba(56,189,248,0.15)" stroke={CYAN} strokeWidth="1" />
        <text x="145" y="147" textAnchor="middle" fill={CYAN} fontSize="9" fontWeight="bold" fontFamily={monoFont}>
          const &#123; cart &#125; = useCart();
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Gunakan Context API untuk state lintas layar seperti: Sesi Login User, Tema Dark/Light, dan Keranjang Belanja
      </text>
    </svg>
  );
}

/* ==========================================================================
   12. DIAGRAM ALUR AUTENTIKASI & PROTECTED STACK (P10)
   ========================================================================== */
export function FigAuthProtected() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Alur Otentikasi dan Proteksi Rute Mobile"
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
        ALUR OTENTIKASI &amp; PROTEKSI TUMPUKAN NAVIGASI (CONDITIONAL STACK)
      </text>

      {/* Step 1: Splash / Check Token */}
      <g transform="translate(30, 60)">
        <rect width="180" height="155" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="180" height="28" rx="12" fill="rgba(56,189,248,0.15)" />
        <text x="90" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. APP LAUNCH
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Tampilkan Splash Screen</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Cek Token di Storage:</text>
        <text x="14" y="95" fill={CYAN} fontSize="8" fontFamily={monoFont}>AsyncStorage.getItem(&apos;TOKEN&apos;)</text>
        <rect x="14" y="118" width="152" height="24" rx="5" fill="rgba(56,189,248,0.1)" />
        <text x="90" y="134" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Apakah Token Ada?
        </text>
      </g>

      {/* Decision Branch */}
      <path d="M 210 110 L 255 85" stroke={ROSE} strokeWidth="1.5" markerEnd="url(#arrow-f43f5e)" />
      <path d="M 210 160 L 255 185" stroke={EMERALD} strokeWidth="1.5" markerEnd="url(#arrow-34d399)" />

      {/* Branch A: No Token -> Public Stack */}
      <g transform="translate(265, 45)">
        <rect width="210" height="85" rx="10" fill={CARD_BG} stroke={ROSE} strokeWidth="1.2" />
        <text x="14" y="24" fill={ROSE} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ❌ TOKEN NULL: PUBLIC STACK
        </text>
        <text x="14" y="45" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• &lt;Stack.Screen name=&apos;Login&apos; /&gt;</text>
        <text x="14" y="65" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• &lt;Stack.Screen name=&apos;Register&apos; /&gt;</text>
      </g>

      {/* Branch B: Token Valid -> Protected Stack */}
      <g transform="translate(265, 145)">
        <rect width="210" height="85" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="14" y="24" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ✅ TOKEN ADA: PROTECTED STACK
        </text>
        <text x="14" y="45" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• &lt;Stack.Screen name=&apos;HomeTab&apos; /&gt;</text>
        <text x="14" y="65" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• &lt;Stack.Screen name=&apos;Profile&apos; /&gt;</text>
      </g>

      {/* Logout transition */}
      <g transform="translate(500, 60)">
        <rect width="190" height="155" rx="12" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <rect width="190" height="28" rx="12" fill="rgba(251,191,36,0.15)" />
        <text x="95" y="19" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          AKSI LOGOUT
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>1. Hapus token di storage</text>
        <text x="14" y="75" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>2. setUserToken(null)</text>
        <text x="14" y="95" fill={AMBER} fontSize="8" fontFamily={monoFont}>3. Navigator otomatis switch</text>
        <rect x="14" y="118" width="162" height="24" rx="5" fill="rgba(251,191,36,0.1)" />
        <text x="95" y="134" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Tidak Bisa Dibajak Back Button!
        </text>
      </g>

      <text x="360" y="255" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Pola Conditional Screen Rendering menjamin pengguna yang belum login tidak dapat mengakses halaman privat
      </text>
    </svg>
  );
}

/* ==========================================================================
   13. DIAGRAM CRUD FULLSTACK & BACKEND CLOUD (P11)
   ========================================================================== */
export function FigCrudBackend() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Arsitektur Mobile CRUD dengan Cloud Backend"
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
        ARSITEKTUR CLIENT-SERVER CRUD: MOBILE APP &amp; CLOUD DATABASE
      </text>

      {/* Client Mobile */}
      <g transform="translate(35, 60)">
        <rect width="190" height="155" rx="12" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <rect width="190" height="28" rx="12" fill="rgba(56,189,248,0.15)" />
        <text x="95" y="19" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          📱 CLIENT REACT NATIVE
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Form Input (State Lokal)</text>
        <text x="14" y="75" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Axios / Fetch API Service</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• ActivityIndicator Loading</text>
        <rect x="14" y="118" width="162" height="24" rx="5" fill="rgba(56,189,248,0.1)" />
        <text x="95" y="134" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Optimistic UI Updates
        </text>
      </g>

      {/* HTTP Protocol Bridge */}
      <g transform="translate(245, 75)">
        <path d="M 0 20 L 70 20" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />
        <text x="35" y="12" textAnchor="middle" fill={CYAN} fontSize="8" fontFamily={monoFont}>POST / PUT / DELETE</text>
        <path d="M 70 60 L 0 60" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrow-34d399)" />
        <text x="35" y="75" textAnchor="middle" fill={EMERALD} fontSize="8" fontFamily={monoFont}>200 OK + JSON Payload</text>
        <path d="M 0 100 L 70 100" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />
        <text x="35" y="115" textAnchor="middle" fill={INDIGO} fontSize="8" fontFamily={monoFont}>GET /items?limit=20</text>
      </g>

      {/* Cloud Backend / DB */}
      <g transform="translate(335, 60)">
        <rect width="180" height="155" rx="12" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <rect width="180" height="28" rx="12" fill="rgba(129,140,248,0.15)" />
        <text x="90" y="19" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ☁️ BACKEND / REST API
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>• Express.js / NestJS</text>
        <text x="14" y="75" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• Firebase Cloud Firestore</text>
        <text x="14" y="95" fill="#94a3b8" fontSize="9" fontFamily={monoFont}>• JWT Bearer Validation</text>
        <rect x="14" y="118" width="152" height="24" rx="5" fill="rgba(129,140,248,0.1)" />
        <text x="90" y="134" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Aturan Keamanan Database
        </text>
      </g>

      {/* Offline Cache Box */}
      <g transform="translate(535, 60)">
        <rect width="155" height="155" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="155" height="28" rx="12" fill="rgba(52,211,153,0.15)" />
        <text x="77" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          💾 OFFLINE SYNC
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Cache di AsyncStorage</text>
        <text x="12" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• NetInfo cek koneksi</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Antrian sync saat online</text>
        <rect x="12" y="118" width="131" height="24" rx="5" fill="rgba(52,211,153,0.1)" />
        <text x="77" y="134" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>
          Tanpa Layar Blank!
        </text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Terapkan indikator loading, dialog konfirmasi saat hapus, dan pesan feedback toast sukses/gagal
      </text>
    </svg>
  );
}

/* ==========================================================================
   14. DIAGRAM OPTIMASI PERFORMA & ANIMATED API (P13)
   ========================================================================== */
export function FigPerformance() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Animated API useNativeDriver dan Optimasi FlatList"
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
        OPTIMASI ANIMASI: USENATIVEDRIVER TRUE &amp; VIRTUALISASI LIST
      </text>

      {/* Sisi Kiri: Tanpa Native Driver */}
      <g transform="translate(45, 60)">
        <rect width="290" height="155" rx="12" fill={CARD_BG} stroke={ROSE} strokeWidth="1.2" />
        <rect width="290" height="28" rx="12" fill="rgba(244,63,94,0.15)" />
        <text x="145" y="19" textAnchor="middle" fill={ROSE} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ❌ useNativeDriver: false (LAMBAT)
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>JS Thread menghitung setiap frame (16ms)</text>
        <path d="M 40 75 L 250 75" stroke={ROSE} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-f43f5e)" />
        <text x="145" y="95" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>Tiap frame dikirim lewat JSI Bridge</text>
        <text x="14" y="120" fill={ROSE} fontSize="9" fontFamily={monoFont}>⚠️ Jika JS sibuk fetch data, animasi patah (lag)</text>
      </g>

      {/* Sisi Kanan: Dengan Native Driver */}
      <g transform="translate(385, 60)">
        <rect width="290" height="155" rx="12" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <rect width="290" height="28" rx="12" fill="rgba(52,211,153,0.15)" />
        <text x="145" y="19" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ✅ useNativeDriver: true (MULUS 60/120 FPS)
        </text>
        <text x="14" y="55" fill="#f8fafc" fontSize="9" fontFamily={monoFont}>Konfigurasi animasi dikirim HANYA SEKALI</text>
        <path d="M 40 75 L 250 75" stroke={EMERALD} strokeWidth="2.5" markerEnd="url(#arrow-34d399)" />
        <text x="145" y="95" textAnchor="middle" fill={CYAN} fontSize="8" fontFamily={monoFont}>UI Thread asli mengeksekusi langsung di GPU</text>
        <text x="14" y="120" fill={EMERALD} fontSize="9" fontFamily={monoFont}>🚀 Mulus tanpa terpengaruh beban JavaScript</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Gunakan properti transform dan opacity bersama useNativeDriver: true untuk animasi tombol dan transisi kartu
      </text>
    </svg>
  );
}

/* ==========================================================================
   15. DIAGRAM ARSITEKTUR FINAL PROJECT (P15)
   ========================================================================== */
export function FigFinalArchitecture() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Arsitektur Produksi Final Project Mobile"
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
        ARSITEKTUR PRODUKSI APLIKASI CAPSTONE FINAL LAB
      </text>

      {/* Layer 1: Presentation (Screens & UI) */}
      <g transform="translate(30, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. PRESENTATION
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• screens/AuthScreen</text>
        <text x="12" y="75" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• screens/HomeScreen</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• components/Card</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• components/Button</text>
        <rect x="12" y="126" width="126" height="20" rx="4" fill="rgba(56,189,248,0.15)" />
        <text x="75" y="140" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>UI Bersih &amp; Terpisah</text>
      </g>

      {/* Layer 2: Navigation & Routes */}
      <g transform="translate(195, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          2. NAVIGATION
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• NavigationContainer</text>
        <text x="12" y="75" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• RootNavigator</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• BottomTabNavigator</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• NativeStackNavigator</text>
        <rect x="12" y="126" width="126" height="20" rx="4" fill="rgba(129,140,248,0.15)" />
        <text x="75" y="140" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Deep Linking Ready</text>
      </g>

      {/* Layer 3: Context & Hardware */}
      <g transform="translate(360, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          3. LOGIC &amp; NATIVE
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• AuthContext</text>
        <text x="12" y="75" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• CartContext / Theme</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• expo-camera / GPS</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• expo-notifications</text>
        <rect x="12" y="126" width="126" height="20" rx="4" fill="rgba(52,211,153,0.15)" />
        <text x="75" y="140" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Modular Services</text>
      </g>

      {/* Layer 4: Cloud & Build */}
      <g transform="translate(525, 60)">
        <rect width="165" height="155" rx="10" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <text x="82" y="28" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          4. CLOUD &amp; BUILD
        </text>
        <text x="12" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• REST API / Firestore</text>
        <text x="12" y="75" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• AsyncStorage cache</text>
        <text x="12" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• eas.json config</text>
        <text x="12" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Standalone APK / AAB</text>
        <rect x="12" y="126" width="141" height="20" rx="4" fill="rgba(251,191,36,0.15)" />
        <text x="82" y="140" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Production Ready</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Arsitektur modular memudahkan pembagian tugas tim, pengujian unit test, dan pemeliharaan jangka panjang
      </text>
    </svg>
  );
}

/* ==========================================================================
   16. DIAGRAM DISTRIBUSI PUBLISHING KE STORE & UAS SHOWCASE (P16)
   ========================================================================== */
export function FigUasShowcase() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Pipeline Publishing Google Play dan App Store"
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
        PIPELINE PUBLISHING KE GOOGLE PLAY STORE &amp; APPLE APP STORE
      </text>

      {/* Step 1: Assets & Config */}
      <g transform="translate(30, 60)">
        <rect width="145" height="155" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="72" y="28" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          1. ASSETS &amp; JSON
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• app.json version</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Icon 1024x1024</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Adaptive Icon Android</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Package: com.name.app</text>
        <rect x="10" y="126" width="125" height="20" rx="4" fill="rgba(56,189,248,0.15)" />
        <text x="72" y="140" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Metadata Beres</text>
      </g>

      {/* Arrow 1 */}
      <path d="M 180 137 L 200 137" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Step 2: EAS Cloud Build */}
      <g transform="translate(205, 60)">
        <rect width="145" height="155" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <text x="72" y="28" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          2. EAS CLOUD BUILD
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• eas build -p android</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Serverless Gradle</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Signing Keystore</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Profil: production</text>
        <rect x="10" y="126" width="125" height="20" rx="4" fill="rgba(129,140,248,0.15)" />
        <text x="72" y="140" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Cloud Worker</text>
      </g>

      {/* Arrow 2 */}
      <path d="M 355 137 L 375 137" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Step 3: Binary Artifacts */}
      <g transform="translate(380, 60)">
        <rect width="145" height="155" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="72" y="28" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          3. ARTIFACTS
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• .aab (Play Bundle)</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• .apk (Demo langsung)</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• .ipa (TestFlight iOS)</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Hermetic binaries</text>
        <rect x="10" y="126" width="125" height="20" rx="4" fill="rgba(52,211,153,0.15)" />
        <text x="72" y="140" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>Siap Install di HP</text>
      </g>

      {/* Arrow 3 */}
      <path d="M 530 137 L 550 137" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrow-34d399)" />

      {/* Step 4: App Stores */}
      <g transform="translate(555, 60)">
        <rect width="135" height="155" rx="10" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <text x="67" y="28" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          4. STORE LIVE
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Google Play Console</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• App Store Connect</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Internal Testing</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Rilis Publik Dunia</text>
        <rect x="10" y="126" width="115" height="20" rx="4" fill="rgba(251,191,36,0.15)" />
        <text x="67" y="140" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>🎓 Lulus Sidang UAS</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        Selamat! Kamu berhasil menuntaskan seluruh 16 modul Sistem Aplikasi Lintas Platform dengan portofolio kelas industri!
      </text>
    </svg>
  );
}

/* ==========================================================================
   17. DIAGRAM EAS CLOUD BUILD & STANDALONE APK (P14)
   ========================================================================== */
export function FigEasCloudBuild() {
  return (
    <svg
      viewBox="0 0 720 280"
      className="w-full h-auto max-w-full rounded-2xl border border-sky-500/20 shadow-xl"
      style={{ background: SLATE_BG }}
      role="img"
      aria-label="Diagram Pipeline EAS Cloud Build Android APK"
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
        PIPELINE BUILD APK MANDIRI — EXPO APPLICATION SERVICES (EAS BUILD)
      </text>

      {/* Step 1: Local Laptop */}
      <g transform="translate(15, 60)">
        <rect width="160" height="155" rx="10" fill={CARD_BG} stroke={CYAN} strokeWidth="1.2" />
        <text x="80" y="28" textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          💻 1. KLIEN LOKAL
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• eas.json (buildType: apk)</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• app.json package unik</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• eas build -p android</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Kirim tarball kode JS</text>
        <rect x="10" y="126" width="140" height="20" rx="4" fill="rgba(56,189,248,0.15)" />
        <text x="80" y="140" textAnchor="middle" fill={CYAN} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Tanpa Android Studio!</text>
      </g>

      {/* Arrow 1 -> 2 */}
      <line x1="178" y1="135" x2="192" y2="135" stroke={CYAN} strokeWidth="2" markerEnd="url(#arrow-38bdf8)" />

      {/* Step 2: EAS Cloud Worker */}
      <g transform="translate(195, 60)">
        <rect width="160" height="155" rx="10" fill={CARD_BG} stroke={INDIGO} strokeWidth="1.2" />
        <text x="80" y="28" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          ☁️ 2. EAS WORKER
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Container Linux Ubuntu</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Java 17 + Android SDK</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Gradle assembleRelease</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Hermes Bytecode compile</text>
        <rect x="10" y="126" width="140" height="20" rx="4" fill="rgba(129,140,248,0.15)" />
        <text x="80" y="140" textAnchor="middle" fill={INDIGO} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Server Cloud Expo</text>
      </g>

      {/* Arrow 2 -> 3 */}
      <line x1="358" y1="135" x2="372" y2="135" stroke={INDIGO} strokeWidth="2" markerEnd="url(#arrow-818cf8)" />

      {/* Step 3: Android Keystore */}
      <g transform="translate(375, 60)">
        <rect width="160" height="155" rx="10" fill={CARD_BG} stroke={EMERALD} strokeWidth="1.2" />
        <text x="80" y="28" textAnchor="middle" fill={EMERALD} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          🔐 3. KEYSTORE & SIGN
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Keystore Android aman</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Tanda tangan digital</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Generate file .APK</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Link unduh permanen</text>
        <rect x="10" y="126" width="140" height="20" rx="4" fill="rgba(52,211,153,0.15)" />
        <text x="80" y="140" textAnchor="middle" fill={EMERALD} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Standalone Installer</text>
      </g>

      {/* Arrow 3 -> 4 */}
      <line x1="538" y1="135" x2="552" y2="135" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrow-34d399)" />

      {/* Step 4: HP Device Installation */}
      <g transform="translate(555, 60)">
        <rect width="150" height="155" rx="10" fill={CARD_BG} stroke={AMBER} strokeWidth="1.2" />
        <text x="75" y="28" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="bold" fontFamily={monoFont}>
          📲 4. INSTALL DI HP
        </text>
        <text x="10" y="55" fill="#f8fafc" fontSize="8" fontFamily={monoFont}>• Scan QR Code build</text>
        <text x="10" y="75" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Unduh file .apk</text>
        <text x="10" y="95" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Install di HP siapa pun</text>
        <text x="10" y="115" fill="#94a3b8" fontSize="8" fontFamily={monoFont}>• Buka tanpa Expo Go!</text>
        <rect x="10" y="126" width="130" height="20" rx="4" fill="rgba(251,191,36,0.15)" />
        <text x="75" y="140" textAnchor="middle" fill={AMBER} fontSize="8" fontWeight="bold" fontFamily={monoFont}>✓ Siap Didistribusikan</text>
      </g>

      <text x="360" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={monoFont}>
        EAS Build mengompilasi APK mandiri di server cloud super-cepat, membebaskan laptop dari beban 20GB Android Studio!
      </text>
    </svg>
  );
}

/* ==========================================================================
   18. KATALOG REGISTRY GAMBAR CROSS-PLATFORM (16 PERTEMUAN LENGKAP)
   ========================================================================== */
export const CROSS_PLATFORM_FIGURES: Record<
  string,
  { node: ReactNode; caption: string }
> = {
  // P01
  "rn-architecture": {
    node: <FigReactNativeArchitecture />,
    caption: "Gambar A.1 — Arsitektur React Native Modern: JS Thread berkomunikasi langsung ke Native Thread via JSI C++ Interface.",
  },
  "expo-workflow": {
    node: <FigExpoEcosystem />,
    caption: "Gambar A.2 — Siklus Lengkap Ekosistem Expo: Managed Workflow, pengujian live di Expo Go, hingga build APK mandiri via EAS Build.",
  },
  // P02
  "rn-react-foundation": {
    node: <FigReactFoundation />,
    caption: "Gambar A.3 — Pondasi ES6+ Modern dan Mekanisme Kompilasi JSX Menjadi Komponen Native Asli (Android ViewGroup & iOS UIView).",
  },
  // P03
  "rn-flexbox": {
    node: <FigFlexboxMobile />,
    caption: "Gambar A.4 — Tata Letak Flexbox Mobile: default flexDirection adalah 'column' memanjang ke bawah sesuai orientasi smartphone.",
  },
  // P04
  "rn-hooks-lifecycle": {
    node: <FigHooksLifecycle />,
    caption: "Gambar A.5 — Siklus Hidup Komponen Modern: State update memicu re-render otomatis, dan useEffect mengelola side-effects serta pembersihan memory leak.",
  },
  // P05
  "rn-navigation": {
    node: <FigNavigationHierarchy />,
    caption: "Gambar A.6 — Struktur Navigasi React Navigation: Stack Navigator untuk alur halaman bertingkat, dan Bottom Tabs untuk menu navigasi utama.",
  },
  // P06
  "rn-data-flow": {
    node: <FigDataPersistenceFlow />,
    caption: "Gambar A.7 — Siklus Data Mobile: UI State disinkronkan dengan REST API / Cloud Firestore dan disimpan permanen di AsyncStorage / SQLite.",
  },
  // P07
  "rn-project-checklist": {
    node: <FigProjectChecklist />,
    caption: "Gambar A.8 — Arsitektur & Empat Pilar Checklist Mini Project 1 (Pra-UTS): UI, Logika CRUD State, Persistensi AsyncStorage, dan Standar QA.",
  },
  // P08
  "rn-uts-matrix": {
    node: <FigUtsMatrix />,
    caption: "Gambar A.9 — Matriks Penilaian UTS (Bobot 20%): Evaluasi Teori Konseptual (10%) & Live Coding Kasus Nyata Transaksi Mobile (10%).",
  },
  // P09
  "rn-context-global": {
    node: <FigContextGlobal />,
    caption: "Gambar A.10 — Perbandingan Masalah Prop Drilling yang Berbelit vs Kemudahan Context API untuk State Global (Sesi Auth, Keranjang, Tema).",
  },
  // P10
  "rn-auth-protected": {
    node: <FigAuthProtected />,
    caption: "Gambar A.11 — Alur Autentikasi Rute Terproteksi: Verifikasi token saat splash launch dan pemisahan tumpukan Public Stack vs Protected Stack.",
  },
  // P11
  "rn-crud-backend": {
    node: <FigCrudBackend />,
    caption: "Gambar A.12 — Arsitektur Client-Server CRUD: Komunikasi aman HTTPS ke REST API / Cloud Firestore dengan cache sinkronisasi offline.",
  },
  // P12
  "rn-native-hardware": {
    node: <FigNativeHardwareApis />,
    caption: "Gambar A.13 — Integrasi Perangkat Keras Native: Kamera Viewfinder, GPS Lokasi Koordinat, dan Local Scheduled Notifications.",
  },
  // P13
  "rn-performance": {
    node: <FigPerformance />,
    caption: "Gambar A.14 — Optimasi Performa & Animated API: Mengaktifkan useNativeDriver: true untuk animasi lancar di GPU 60/120 FPS tanpa lag JS.",
  },
  // P14
  "rn-eas-cloud-build": {
    node: <FigEasCloudBuild />,
    caption: "Gambar A.15 — Pipeline EAS Cloud Build: Kompilasi APK mandiri Android di server cloud Expo tanpa ketergantungan instalasi Android Studio lokal.",
  },
  // P15
  "rn-final-architecture": {
    node: <FigFinalArchitecture />,
    caption: "Gambar A.16 — Arsitektur Produksi Capstone Final Lab: Pembagian modular Presentation, Navigation, Context State, Native APIs, dan EAS Cloud.",
  },
  // P16
  "rn-uas-showcase": {
    node: <FigUasShowcase />,
    caption: "Gambar A.17 — Pipeline Publikasi ke Google Play Store & Apple App Store serta Demonstrasi Live Sidang Ujian Akhir Semester (UAS).",
  },
};

export const getCrossPlatformFigure = (key: string) =>
  CROSS_PLATFORM_FIGURES[key.trim()];
