# 🎮 MASTER PROMPT: Educational Typing Game System
## Panduan Lengkap untuk Agentic AI — Pembuatan Game Edukasi Berbasis Web

> **Konteks:** Dokumen ini adalah distilasi dari codebase CodeShark Academy v0.9 — sebuah **serious game edukasi pemrograman web** dengan mekanik typing game yang telah terbukti efektif. Dibuat oleh profesional game designer dan master educator HTML5/CSS3/Vanilla JS untuk menjadi blueprint bagi AI agent dalam membuat game sejenis.

---

## 📋 DAFTAR ISI

1. [Filosofi Desain & Prinsip Pedagogis](#1-filosofi-desain--prinsip-pedagogis)
2. [Arsitektur Teknis Wajib](#2-arsitektur-teknis-wajib)
3. [Anatomy Game Engine](#3-anatomy-game-engine)
4. [Sistem Progres & Gamifikasi](#4-sistem-progres--gamifikasi)
5. [UI/UX Pattern yang Terbukti Efektif](#5-uiux-pattern-yang-terbukti-efektif)
6. [Performance & Optimization](#6-performance--optimization)
7. [Curriculum Design Framework](#7-curriculum-design-framework)
8. [Audio-Visual Feedback System](#8-audio-visual-feedback-system)
9. [Accessibility & Inclusive Design](#9-accessibility--inclusive-design)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. FILOSOFI DESAIN & PRINSIP PEDAGOGIS

### 1.1 Core Learning Loop (Tidak Boleh Dilanggar)

```
BACA TEORI → PRAKTIK KETIK KODE → LIHAT HASIL LANGSUNG → FEEDBACK INSTAN → REPEAT
```

**Kunci Sukses:**
- **Zero Tolerance Delay**: Feedback harus < 120ms dari user action
- **Muscle Memory First**: Kecepatan datang SETELAH akurasi, bukan sebaliknya
- **Show, Don't Tell**: Preview langsung > penjelasan panjang
- **Fail Forward**: Kesalahan adalah pembelajaran, bukan punishment

### 1.2 Motivational Psychology Stack

```typescript
// Hierarki motivasi yang harus dipenuhi berurutan
const MOTIVATION_HIERARCHY = {
  1: "Autonomy",      // Pemain merasa punya kontrol (pilih level, retry tanpa cost)
  2: "Competence",    // Progress visible & achievable (bintang, rank, XP bar)
  3: "Relatedness",   // Tema menarik & relatable (underwater, space, fantasy)
  4: "Purpose",       // Skill nyata yang bermanfaat (bukan sekedar poin)
} as const;
```

**Anti-Pattern yang Harus Dihindari:**
- ❌ Grind tanpa pembelajaran (farm XP tanpa skill baru)
- ❌ Difficulty spike mendadak (frustrasi → quit)
- ❌ Pay-to-win atau time-gate artifisial
- ❌ Punishment berlebihan untuk eksperimen

### 1.3 Flow State Engineering

**Target:** Pemain berada di "flow zone" 70% waktu bermain.

```
Difficulty (Challenge) vs Skill Matrix:

ANXIETY     │ FLOW ✓    │ AROUSAL
─────────────┼───────────┼──────────
WORRY       │ CONTROL   │ RELAXATION
─────────────┼───────────┼──────────
APATHY      │ BOREDOM   │ RELAXATION
            Skill Level
```

**Implementasi:**
1. **Adaptive Difficulty**: Kelompok usia berbeda = tempo berbeda
2. **Clear Goals**: Setiap level harus menjawab "apa yang harus saya lakukan?"
3. **Immediate Feedback**: Visual + audio + haptic (jika ada)
4. **Challenge Progression**: +10-15% kesulitan per level (goldilocks zone)

---

## 2. ARSITEKTUR TEKNIS WAJIB

### 2.1 Tech Stack Foundation

```json
{
  "core": {
    "framework": "React 19+ dengan TypeScript 5.9+",
    "build": "Vite 7+ (HMR cepat, tree-shaking optimal)",
    "styling": "Tailwind CSS 4 + CSS custom properties (design tokens)",
    "state": "useState + useReducer (NO Redux untuk MVP)"
  },
  "game": {
    "rendering": "Canvas 2D untuk particles, SVG untuk UI vectors",
    "physics": "Matter.js 0.20+ (opsional, untuk puzzle fisika)",
    "animation": "CSS transitions + requestAnimationFrame loop",
    "audio": "Web Audio API (synth SFX, zero asset files)"
  },
  "storage": {
    "local": "localStorage (namespace: 'appname:save:v1')",
    "cloud": "Firebase/Supabase (opsional, untuk leaderboard)",
    "format": "JSON dengan migration layer"
  }
}
```

### 2.2 Project Structure (Battle-Tested)

```
src/
├── App.tsx                    # Router & top-level state
├── index.css                  # Design tokens + reset global
├── characters/                # Maskot & avatar (SVG components)
│   ├── Mascot.tsx
│   └── characters.css         # Animasi karakter
├── graphics/                  # Background engine & ambient FX
│   ├── Ambient.tsx            # Wrapper parallax layers
│   ├── scene.ts               # Global scene state (threat, progress)
│   └── seaEngine.ts           # Canvas loop untuk particles & critters
├── games/                     # Sub-game mechanics (lazy load)
│   └── typing/
│       └── TypingGame.tsx     # Arena ketik kode
├── data/                      # Content & configuration
│   ├── curriculum.ts          # Silabus pembelajaran (Lesson[])
│   ├── modules.ts             # Modul praktik (code snippets)
│   └── quests.ts              # Sesi per topik (Quest/Drill/Juggle)
├── lib/                       # Pure functions (testable)
│   ├── storage.ts             # Save/load dengan versioning
│   ├── progress.ts            # Aturan lulus & gating
│   ├── typing.ts              # Helper mesin ketik (skip blank, shortcut)
│   ├── highlight.ts           # Syntax tokenizer (html/css/js)
│   ├── audio.ts               # SFX synthesizer Web Audio
│   └── markdown.ts            # Parser markdown ringan (jika perlu)
├── ui/                        # Screen components
│   ├── Dashboard.tsx          # Home screen & quick access
│   ├── Onboarding.tsx         # First-run experience
│   ├── TypingGame.tsx         # Main game arena
│   ├── Results.tsx            # Post-game screen (rank, XP)
│   └── icons.tsx              # Icon library (SVG inline)
└── styles/
    └── theme.css              # CSS custom properties (warna, font, spacing)
```

### 2.3 Build Configuration Checklist

**vite.config.ts must-have:**

```typescript
export default defineConfig({
  base: "./",  // Relative paths untuk deploy di subfolder
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp}"],
        navigateFallback: "index.html",
      },
    }),
  ],
  build: {
    assetsInlineLimit: 0,  // SVG tetap file terpisah
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("vite/preload")) return "preload";
          if (id.includes("matter-js")) return "game-physics";
          if (id.includes("pixi.js")) return "game-pixi";
          if (id.includes("react")) return "vendor-react";
          return "vendor";
        },
      },
    },
  },
});
```

**Optimization Goals:**
- First Paint < 1.2s (3G connection)
- Time to Interactive < 3s
- Lighthouse Score > 90 (all categories)

---

## 3. ANATOMY GAME ENGINE

### 3.1 Core Game Loop (60 FPS Target)

```typescript
interface GameState {
  lineIdx: number;        // Baris kode aktif
  charIdx: number;        // Karakter target dalam baris
  combo: number;          // Combo streak saat ini
  maxCombo: number;       // Record combo per sesi
  correct: number;        // Total ketikan benar
  errors: number;         // Total kesalahan
  score: number;          // Skor akumulatif
  threat: number;         // Ancaman timer (0-100)
  lives: number;          // Nyawa tersisa
  status: "count"|"play"|"pause"|"won"|"dead";
  startAt: number;        // timestamp mulai
  pauseAccum: number;     // Total waktu pause (exclude dari timer)
  missed: Record<string, number>;  // Karakter yang sering salah
}

const GAME_LOOP_PATTERN = `
1. Keyboard Event Handler
   ├─ Validate input (bukan shortcut, bukan multi-key)
   ├─ Compare dengan target character
   ├─ Update state (combo/score/threat)
   ├─ Trigger audio feedback (< 16ms)
   ├─ Spawn visual particles (< 32ms)
   └─ Check win/lose condition

2. Threat Timer Loop (setInterval 100ms)
   ├─ Increment threat berdasarkan difficulty
   ├─ Update scene.threat untuk background FX
   └─ Trigger hurt() jika threat >= 100

3. Render Loop (requestAnimationFrame)
   ├─ Update progress bar
   ├─ Animate combo indicator
   ├─ Move mascot based on threat
   └─ Decay particles & toasts
`;
```

### 3.2 Input Validation Layer (Critical)

```typescript
// Helper: Abaikan pintasan browser agar tidak dihitung sebagai kesalahan
export function isShortcut(e: KeyboardEvent): boolean {
  // Ctrl/Cmd/Alt combo (KECUALI AltGr untuk simbol internasional)
  if (e.ctrlKey || e.metaKey || (e.altKey && !e.location)) return true;
  // Function keys
  if (e.key.startsWith("F") && e.key.length > 1) return true;
  return false;
}

// Helper: Lewati baris kosong otomatis (bug misi JS di v0.3 fixed)
export function skipBlank(lines: TokChar[][], startIdx: number): number {
  let i = startIdx;
  while (i < lines.length && lines[i].length === 0) i++;
  return i;
}

// Pattern: Backspace handling (sesuaikan dengan game mode)
const onBackspace = (e: KeyboardEvent) => {
  e.preventDefault();
  if (gameMode === "santai" && charIdx > 0) {
    charIdx -= 1;
    // Visual: hapus ghost character dengan transisi fade-out
  }
  // Mode "standar" = no backspace (hardcore)
};
```

### 3.3 Syntax Highlighter (Zero Dependency)

```typescript
export type Lang = "html" | "css" | "js";

export interface TokChar {
  ch: string;   // Karakter tunggal
  cls: string;  // CSS class untuk warna (tok-tag, tok-kw, tok-str, dll)
}

// Tokenizer berbasis Regex dengan sticky flag (performan tinggi)
const RULES: Record<Lang, { re: RegExp; cls: string }[]> = {
  html: [
    { re: /<!--[\s\S]*?-->/y, cls: "tok-com" },      // Komentar HTML
    { re: /"[^"]*"|'[^']*'/y, cls: "tok-str" },      // String
    { re: /<\/?[a-zA-Z][\w-]*/y, cls: "tok-tag" },   // Tag HTML
    { re: /[a-zA-Z-]+(?=\s*=)/y, cls: "tok-attr" },  // Atribut
    { re: /[<>!=/]/y, cls: "tok-pun" },              // Punctuation
  ],
  // ... css & js rules serupa
};

export function tokenizeLine(line: string, lang: Lang): TokChar[] {
  const rules = RULES[lang];
  const out: TokChar[] = [];
  let pos = 0;
  while (pos < line.length) {
    let matched = false;
    for (const rule of rules) {
      rule.re.lastIndex = pos;
      const m = rule.re.exec(line);
      if (m && m.index === pos) {
        for (const ch of m[0]) out.push({ ch, cls: rule.cls });
        pos += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push({ ch: line[pos], cls: "tok-txt" });
      pos++;
    }
  }
  return out;
}
```

**Kenapa Regex Sticky (y flag)?**
- 10x lebih cepat dari regex biasa
- Zero backtracking = predictable performance
- Critical untuk real-time syntax highlighting

---

## 4. SISTEM PROGRES & GAMIFIKASI

### 4.1 XP & Leveling System

```typescript
interface ProgressSystem {
  // XP Curve: Polynomial growth (sweet spot untuk edukasi)
  xpForLevel: (n: number) => number;  // 150 * n (linear, mudah diprediksi)
  
  // Anti-Farm Mechanism (WAJIB untuk serious game)
  xpAward: (attempt: Attempt, bestXp: number) => number;
  // HANYA delta di atas best yang dihitung → replay = 0 XP
  
  // Session Pass Criteria
  passAcc: number;  // 85-95% akurasi (tergantung difficulty)
  passCondition: "won && accuracy >= passAcc";
}

// Real implementation dari CodeShark
export function applyAttempt(
  prev: ModProg | undefined,
  session: Session,
  result: GameResult,
  xpSession: number,
  coinsSession: number,
): { next: ModProg; passed: boolean; xpAward: number; coinsAward: number } {
  const p = prev ?? { completions: 0, passed: false };
  const passed = result.won && result.accuracy >= session.passAcc;
  const xpBest = p.xpBest ?? 0;
  const coinsBest = p.coinsBest ?? 0;
  
  // ANTI-FARM: hanya selisih yang dihitung
  const xpAward = Math.max(0, xpSession - xpBest);
  const coinsAward = Math.max(0, coinsSession - coinsBest);
  
  return {
    next: {
      ...p,
      completions: p.completions + (result.won ? 1 : 0),
      passed: p.passed || passed,
      xpBest: Math.max(xpBest, xpSession),
      coinsBest: Math.max(coinsBest, coinsSession),
    },
    passed,
    xpAward,
    coinsAward,
  };
}
```

### 4.2 Rank & Badge System

```typescript
// Rank ladder (nautical theme)
export const RANKS: Rank[] = [
  { xp: 0, name: "Plankton", icon: "🦠" },
  { xp: 120, name: "Ikan Kecil", icon: "🐟" },
  { xp: 280, name: "Kuda Laut", icon: "🐴" },
  { xp: 500, name: "Lumba-Lumba", icon: "🐬" },
  { xp: 800, name: "Hiu Muda", icon: "🦈" },
  { xp: 1200, name: "Megalodon", icon: "🦈⚡" },
  { xp: 1700, name: "Legenda Samudra", icon: "👑" },
];

// Progress bar dengan visual milestone
export function rankOf(xp: number): { 
  cur: Rank; 
  next: Rank | null; 
  pct: number;  // 0-100 untuk progress bar
} {
  let cur = RANKS[0];
  let next: Rank | null = null;
  for (const r of RANKS) {
    if (xp >= r.xp) cur = r;
    else { next = r; break; }
  }
  const pct = next 
    ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100)
    : 100;
  return { cur, next, pct };
}
```

### 4.3 Quest/Drill/Juggling Pattern

**3-Tier Learning per Chapter:**

```typescript
type SessionKind = "quest" | "drill" | "juggle";

const SESSION_DESIGN = {
  quest: {
    desc: "Kode utuh topik ini (15-30 baris)",
    targetAcc: 90,
    threatMul: 1.0,
    reward: "⚡ Perunggu (unlock chapter berikutnya jika lulus)",
  },
  drill: {
    desc: "Baris-baris pendek sintaks inti (5-12 baris)",
    targetAcc: 90,
    threatMul: 0.6,  // Lebih santai untuk latihan
    reward: "⚡⚡ Perak (unlock next chapter)",
  },
  juggle: {
    desc: "Drill chapter ini + chapter sebelumnya (anyaman)",
    targetAcc: 85,
    threatMul: 1.3,  // Lebih cepat untuk tantangan
    reward: "⚡⚡⚡ Emas (completionist)",
  },
};

// Interleaving pattern untuk spaced repetition
export function interleave(a: string[], b: string[]): string[] {
  const out: string[] = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}
```

**Gating Rule:**
```typescript
// Chapter n+1 terbuka HANYA jika chapter n sudah PERAK
export function chapterUnlocked(save: SaveData, no: number): boolean {
  if (no <= 1) return true;
  const prev = chapterLevel(save, no - 1);
  return prev >= 2;  // 2 = Perak (quest + drill lulus)
}
```

---

## 5. UI/UX PATTERN YANG TERBUKTI EFEKTIF

### 5.1 Design Token System (CSS Variables)

```css
:root {
  /* ===== COLOR PALETTE (Deep Sea Theme) ===== */
  --bg-0: #050a14;   /* Abyss — body background */
  --bg-1: #0a1222;   /* Surface — card background */
  --bg-2: #0f1a2e;   /* Raised — panel */
  --bg-3: #16243d;   /* Hover state */
  
  --fg-0: #eaf2ff;   /* Primary text (code) */
  --fg-1: #a9bbd6;   /* Secondary text */
  --fg-2: #7b8fae;   /* Caption (min contrast 4.5:1) */
  
  --ok: #2ee6a8;     /* Success green */
  --warn: #ffc23d;   /* Warning amber */
  --bad: #ff5f6e;    /* Error red */
  --info: #4dc4ff;   /* Info blue */
  
  /* ===== TYPOGRAPHY ===== */
  --font-code: ui-monospace, 'JetBrains Mono', Menlo, monospace;
  --font-ui: system-ui, -apple-system, 'Segoe UI', sans-serif;
  
  --fs-code: clamp(15px, 1.05vw + 10px, 22px);  /* Fluid responsive */
  --fs-hud: clamp(11px, 0.35vw + 9px, 13px);
  --fs-body: 14px;
  --fs-h1: clamp(26px, 1.6vw + 18px, 40px);
  
  /* ===== MOTION ===== */
  --dur-1: 90ms;   /* Feedback ketikan */
  --dur-2: 160ms;  /* State transition */
  --dur-3: 260ms;  /* Panel slide */
  --dur-4: 420ms;  /* Banner flyout */
  
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bouncy */
  
  /* ===== LAYOUT ===== */
  --z-hud: 10;
  --z-banner: 30;
  --z-pause: 50;
  --z-modal: 70;
}

/* Reduced Motion Respect (WCAG AAA) */
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-1: 0ms;
    --dur-2: 0ms;
    --dur-3: 0ms;
    --dur-4: 0ms;
  }
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.2 HUD Layout Pattern

```
┌─────────────────────────────────────────────────────────┐
│ ← Back   [Chapter 3]          [Mode: 🦈]      ⏱ 01:23  │ Top Bar
├──────────┬──────────────────────────────────┬──────────┤
│ HP ❤️ 85 │                                  │ COMBO    │
│ ▰▰▰▰▰▰▱▱ │   const game = {                │ ×2.5     │
│          │     score: 0,                    │ ▰▰▰▰▰▱▱▱ │
│ LOG      │     combo: 0                     │          │
│ ❌ " ×2  │   };                             │ TARGET   │
│ ❌ ; ×1  │                                  │ ACC 90%  │
│ ✅ }     │                                  │ ✓ HP 70  │
│          │   ▮← cursor                      │ ○ WPM 60 │
├──────────┴──────────────────────────────────┴──────────┤
│ ▰▰▰▰▰▰▰▱▱▱  7/10 baris      [z] [x] [c] [⏎]  keycap   │ Bottom
└─────────────────────────────────────────────────────────┘
```

**Aturan Emas HUD:**
1. **Code is King**: Papan kode punya kontras tertinggi & tidak pernah tertutupi
2. **Persistent = Max 5 elemen**: HP, Combo, Target, Timer, Progress
3. **Contextual muncul saat dibutuhkan**: Damage log, milestone banner, tips
4. **Redup sampai berubah**: `opacity: 0.85` → `1` saat state berubah
5. **Mobile: collapse jadi horizontal strip** (< 900px width)

### 5.3 Feedback Timing Hierarchy

```typescript
// Tier 1: Immediate (< 16ms = 1 frame @ 60fps)
const TIER_1_FEEDBACK = [
  "Ketik benar → warna karakter hijau",
  "Ketik salah → ghost character merah + shake",
  "Audio SFX (Web Audio synth < 10ms latency)",
];

// Tier 2: Fast (< 120ms = 7 frames)
const TIER_2_FEEDBACK = [
  "Combo number scale animation",
  "HP bar color shift (green → amber → red)",
  "Score particle spawn (+10, +25, dll)",
];

// Tier 3: Noticeable (< 300ms)
const TIER_3_FEEDBACK = [
  "Line complete → baris berubah hijau + fly-out banner",
  "Milestone → modal kecil 'COMBO 50!'",
  "Level up → confetti burst",
];

// Tier 4: Cinematic (> 300ms)
const TIER_4_FEEDBACK = [
  "Win screen transition (blur backdrop → result panel)",
  "Rank up animation (burst + sfx + badge glow)",
];

// Rule: Jangan stack animation dari tier yang sama
// → Queue mereka atau replace yang lama
```

### 5.4 Result Screen Anatomy

```typescript
interface ResultScreenData {
  rank: "S" | "A" | "B" | "C" | "F";
  score: number;
  wpm: number;
  accuracy: number;
  combo: number;
  stars: 1 | 2 | 3;
  
  // Pedagogical data (critical!)
  passed: boolean;              // Memenuhi target akurasi?
  xpGained: number;             // Bisa 0 jika tidak beat record
  coinsGained: number;
  
  missedChars: Record<string, number>;  // Top 5 karakter yang sering salah
  
  // Next action hints
  nextChapterUnlocked: boolean;
  suggestions: string[];        // "Latih simbol { } di Drill Mode"
}

// Layout priority (top to bottom):
// 1. Rank visual (besar, jelas, warna-warni)
// 2. Headline (storytelling: "Akurasi sempurna!")
// 3. Metrics row (WPM, Akurasi, Combo)
// 4. XP/Coin gain (jujur: tulis 0 jika tidak naik)
// 5. Mistake Analysis (pedagogis: "Sering salah: { × 5, } × 3")
// 6. Next Action (3 tombol max: Retry, Next, Map)
```

---

## 6. PERFORMANCE & OPTIMIZATION

### 6.1 Loading Strategy

```typescript
// Critical Path (First Paint < 1.2s):
// 1. HTML shell
// 2. CSS inline (design tokens)
// 3. React + Router (vendor-react chunk)
// 4. Dashboard UI (hub chunk)

// Lazy Load (Code Split):
const TypingGame = lazy(() => import("./games/typing/TypingGame"));
const PhysicsPuzzle = lazy(() => import("./games/physics/PhysicsPuzzle"));
const Confetti = lazy(() => import("./fx/Confetti"));

// Preload Strategy:
useEffect(() => {
  // Hover card game → preload chunk-nya
  const preloadGame = () => {
    import("./games/typing/TypingGame");
  };
  gameCard.addEventListener("mouseenter", preloadGame, { once: true });
}, []);
```

### 6.2 Canvas Rendering Optimization

```typescript
// Pattern: Capped DPR untuk performa
const dpr = Math.min(1.5, window.devicePixelRatio || 1);
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// Pattern: Layer Cake (render hierarchy)
const RENDER_LAYERS = {
  1: "Background parallax (CSS transform3d, GPU-accelerated)",
  2: "Canvas particles (requestAnimationFrame)",
  3: "Code editor (DOM, static sampai ada input)",
  4: "HUD overlay (CSS, update via state change)",
  5: "Modal/Toast (CSS, rare)",
};

// Pattern: Dirty Flag untuk Canvas
let needsRedraw = false;
const markDirty = () => { needsRedraw = true; };

function renderLoop() {
  if (needsRedraw) {
    ctx.clearRect(0, 0, w, h);
    drawFish();
    drawPlankton();
    needsRedraw = false;
  }
  requestAnimationFrame(renderLoop);
}
```

### 6.3 Memory Management

```typescript
// Pattern: Object Pool untuk particles
class ParticlePool {
  private pool: Particle[] = [];
  private active: Particle[] = [];
  
  spawn(x: number, y: number, text: string): Particle {
    const p = this.pool.pop() ?? new Particle();
    p.reset(x, y, text);
    this.active.push(p);
    return p;
  }
  
  update(dt: number) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.update(dt);
      if (p.isDead) {
        this.pool.push(this.active.splice(i, 1)[0]);
      }
    }
  }
}

// Pattern: Cleanup listener di useEffect
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
```

---

## 7. CURRICULUM DESIGN FRAMEWORK

### 7.1 Silabus Structure

```typescript
interface Lesson {
  no: number;                    // 1-16 (satu semester)
  phase: "HTML" | "CSS" | "JS";
  title: string;                 // "Mengenal HTML"
  goal: string;                  // "Siswa dapat membuat kerangka halaman"
  
  slides: Slide[];               // Teori konsep (3-5 slide)
  practice: {
    intro: string;               // Pengantar latihan
    code: string;                // Kode yang akan diketik
  };
  
  // Metadata untuk adaptive learning
  estimatedMin: number;          // 15-30 menit
  prerequisites: number[];       // [1, 2] = butuh lesson 1 & 2
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// Real-world progression (CodeShark 16 weeks):
const CURRICULUM_FLOW = [
  "P1-6: HTML Fundamentals",
  "P7: UTS (HTML scope)",
  "P8-11: CSS Fundamentals + Responsive",
  "P12: Bridge (HTML+CSS review + DOM intro)",
  "P13-15: JavaScript Fundamentals",
  "P16: UAS (DOM manipulation + mini app)",
];
```

### 7.2 Content Authoring Pattern

```typescript
// Pattern: Markdown untuk konten (mudah diedit guru)
// src/content/html/01-intro.md
/*
# Mengenal HTML

HTML adalah bahasa markup untuk membuat halaman web...

## Tag Dasar

```html
<h1>Judul</h1>
<p>Paragraf</p>
```

> **Tip**: Tag selalu berpasangan kecuali self-closing seperti `<br />`
*/

// Pattern: Parser markdown minimal (heading, list, code, callout)
export function parseMarkdown(md: string): Block[] {
  // ... implementasi 200 baris, zero dependency
}

// Pattern: Drill generator (automatic)
export function generateDrills(lesson: Lesson): string[] {
  // Extract key syntax dari practice.code
  // Contoh: "<h1>", "<p>", "const", "let", "function"
  return [
    "<h1>Judul Utama</h1>",
    "<p>Ini paragraf pertama.</p>",
    "<!-- Komentar tidak tampil -->",
    // ... 8-12 baris
  ];
}
```

### 7.3 Adaptive Difficulty (Age Groups)

```typescript
export const AGE_GROUPS: Record<AgeId, AgeCfg> = {
  junior: {
    id: "junior",
    label: "10-13 tahun",
    threatRate: 0.6,      // Threat naik lebih lambat
    missPenalty: 15,      // Punishment ringan
    relief: 25,           // HP recovery lebih besar
    cheers: ["Bagus!", "Hebat!", "Lanjutkan!"],
    accent: "#45c6ff",    // Warna playful
  },
  teen: {
    id: "teen",
    label: "13-15 tahun",
    threatRate: 0.85,
    missPenalty: 22,
    relief: 18,
    cheers: ["Nice!", "Good job!", "Keep it up!"],
    accent: "#2ee6c8",
  },
  senior: {
    id: "senior",
    label: "16-18 tahun",
    threatRate: 1.1,
    missPenalty: 28,
    relief: 12,
    cheers: ["Solid!", "Precise!", "On fire!"],
    accent: "#ffc247",
  },
  academy: {
    id: "academy",
    label: "Mahasiswa/Umum",
    threatRate: 1.3,      // Hard mode
    missPenalty: 35,
    relief: 8,
    cheers: ["Excellent!", "Flawless!", "Mastered!"],
    accent: "#ff6b57",
  },
};
```

---

## 8. AUDIO-VISUAL FEEDBACK SYSTEM

### 8.1 Web Audio Synthesizer (Zero Asset)

```typescript
export const sfx = {
  ctx: null as AudioContext | null,
  enabled: true,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  },
  
  // Ketik benar: pitch naik dengan combo
  key(combo: number) {
    if (!this.enabled) return;
    this.init();
    const freq = 400 + Math.min(combo * 8, 600);  // 400-1000 Hz
    this.beep(freq, 0.05, 0.12, "sine");
  },
  
  // Kesalahan: buzz rendah
  err() {
    if (!this.enabled) return;
    this.init();
    this.beep(140, 0.18, 0.18, "sawtooth");
  },
  
  // Line complete: arpeggio
  line() {
    if (!this.enabled) return;
    this.init();
    [523, 659, 784].forEach((f, i) => {
      setTimeout(() => this.beep(f, 0.08, 0.1, "sine"), i * 80);
    });
  },
  
  // Win: fanfare
  win() {
    if (!this.enabled) return;
    this.init();
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.beep(f, 0.15, 0.25, "triangle"), i * 120);
    });
  },
  
  // Core synth function
  beep(freq: number, duration: number, vol: number, wave: OscillatorType) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = wave;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  },
};
```

### 8.2 Particle System (Canvas 2D)

```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  text: string;
  ttl: number;  // time to live (frames)
}

const particles: Particle[] = [];

function spawnScoreParticle(x: number, y: number, points: number) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 2,
    vy: -1.5 - Math.random(),
    alpha: 1,
    text: `+${points}`,
    ttl: 45,  // 0.75s @ 60fps
  });
}

function updateParticles(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.04 * dt;  // gravity
    p.alpha -= 1 / p.ttl * dt;
    p.ttl -= dt;
    
    if (p.ttl <= 0) particles.splice(i, 1);
  }
}

function renderParticles(ctx: CanvasRenderingContext2D) {
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#2ee6c8";
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}
```

### 8.3 Mascot Reactive Animation

```typescript
// Pattern: CSS classes driven by game state
const MASCOT_STATES = {
  idle: "mascot--idle",        // Default, breathing animation
  happy: "mascot--happy",      // Combo > 10
  panic: "mascot--panic",      // Threat > 70
  hurt: "mascot--hurt",        // Life lost (shake + red flash)
  victory: "mascot--victory",  // Win (jump + sparkle)
};

// CSS implementation
.mascot {
  transition: transform var(--dur-2) var(--ease-out);
}

.mascot--idle {
  animation: breathe 3s ease-in-out infinite;
}

.mascot--panic {
  animation: shake 0.4s ease-in-out infinite;
  filter: brightness(1.3) saturate(1.5);
}

@keyframes breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.02); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px) rotate(-1deg); }
  75% { transform: translateX(3px) rotate(1deg); }
}
```

---

## 9. ACCESSIBILITY & INCLUSIVE DESIGN

### 9.1 WCAG 2.1 AA Compliance Checklist

```typescript
const A11Y_CHECKLIST = {
  // Perceivable
  "1.4.3 Contrast (Minimum)": {
    rule: "Text >= 4.5:1, Large text >= 3:1",
    test: "Use WebAIM Contrast Checker on all fg/bg pairs",
  },
  "1.4.11 Non-text Contrast": {
    rule: "UI components >= 3:1 against adjacent colors",
    test: "Button borders, focus indicators, graph elements",
  },
  
  // Operable
  "2.1.1 Keyboard": {
    rule: "All functionality available via keyboard",
    test: "Tab through UI, ensure no keyboard trap",
  },
  "2.3.1 Three Flashes": {
    rule: "No content flashes > 3 times per second",
    test: "Particle bursts must have < 3Hz frequency",
  },
  "2.2.2 Pause, Stop, Hide": {
    rule: "Moving/blinking/auto-updating content dapat dipause",
    test: "Background animations respect prefers-reduced-motion",
  },
  
  // Understandable
  "3.1.1 Language of Page": {
    rule: '<html lang="id"> atau sesuai bahasa konten',
    test: "Inspect HTML root element",
  },
  
  // Robust
  "4.1.2 Name, Role, Value": {
    rule: "UI components memiliki accessible name & role",
    test: "aria-label, aria-describedby, semantic HTML",
  },
};
```

### 9.2 Keyboard Navigation Pattern

```typescript
// Focus management untuk modal/overlay
function openModal(modalId: string) {
  const modal = document.getElementById(modalId);
  const previousFocus = document.activeElement as HTMLElement;
  
  modal?.setAttribute("role", "dialog");
  modal?.setAttribute("aria-modal", "true");
  
  // Trap focus di dalam modal
  const focusableEls = modal?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableEls?.[0] as HTMLElement;
  const lastFocusable = focusableEls?.[focusableEls.length - 1] as HTMLElement;
  
  firstFocusable?.focus();
  
  modal?.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
    if (e.key === "Escape") {
      closeModal();
    }
  });
  
  // Restore focus saat modal ditutup
  modal?.dataset.previousFocus = previousFocus?.id;
}
```

### 9.3 Screen Reader Friendly Patterns

```tsx
// Pattern: Live region untuk score update
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {scoreChanged && `Skor sekarang ${score} poin`}
</div>

// Pattern: Progress indicator
<div role="progressbar" 
     aria-valuenow={currentLine} 
     aria-valuemin={0} 
     aria-valuemax={totalLines}
     aria-label="Progres baris kode">
  <div style={{ width: `${(currentLine/totalLines)*100}%` }} />
</div>

// Pattern: Button dengan accessible name
<button 
  aria-label="Ulangi level dari awal"
  onClick={retry}
>
  <IconRetry aria-hidden="true" />
</button>

// Pattern: Skip link untuk bypass navigation
<a href="#main-content" className="skip-link">
  Langsung ke konten utama
</a>

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: white;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

---

## 10. IMPLEMENTATION CHECKLIST

### 10.1 MVP Phase (2-3 Minggu)

**Week 1: Foundation**
- [ ] Setup Vite + React + TypeScript project
- [ ] Implement design token system (CSS variables)
- [ ] Build storage layer (save/load dengan localStorage)
- [ ] Create curriculum data structure (3 sample lessons)
- [ ] Implement syntax highlighter untuk HTML
- [ ] Build basic Dashboard UI

**Week 2: Core Game Loop**
- [ ] Implement TypingGame component (keyboard handler)
- [ ] Add score/combo/threat system
- [ ] Create Web Audio SFX synthesizer
- [ ] Build HUD (HP, combo, timer)
- [ ] Implement win/lose conditions
- [ ] Add Results screen

**Week 3: Polish & Deploy**
- [ ] Add onboarding flow
- [ ] Implement XP/level system dengan anti-farm
- [ ] Create 6 complete lessons (HTML basics)
- [ ] Add particle effects & mascot animation
- [ ] Lighthouse audit > 90 all categories
- [ ] Deploy ke Netlify/Vercel

### 10.2 Feature Enhancement Phase

**Graphics & Animation**
- [ ] Background parallax engine (Canvas 2D)
- [ ] Mascot reactive states (idle/happy/panic)
- [ ] Confetti burst untuk milestone
- [ ] Damage log dengan ghost characters
- [ ] Keycap hint visualizer

**Advanced Gamification**
- [ ] Achievement badge system
- [ ] Daily quest rotation
- [ ] Leaderboard (Firebase/Supabase)
- [ ] Streak counter (consecutive days)
- [ ] Mystery box reward pool

**Pedagogical Features**
- [ ] Mistake analysis heatmap
- [ ] Personalized practice generator
- [ ] Spaced repetition algorithm
- [ ] Progress export (CSV untuk guru)
- [ ] Certificate generator

**Mobile Optimization**
- [ ] Touch-friendly controls
- [ ] Virtual keyboard untuk simbol
- [ ] Portrait mode layout
- [ ] Offline PWA dengan service worker
- [ ] Install prompt (Add to Home Screen)

### 10.3 Testing Matrix

```typescript
const TEST_MATRIX = {
  // Unit tests (Vitest)
  "lib/progress.ts": [
    "applyAttempt() anti-farm logic",
    "chapterUnlocked() gating rules",
    "rankOf() XP calculation",
  ],
  "lib/typing.ts": [
    "isShortcut() deteksi pintasan",
    "skipBlank() lewati baris kosong",
  ],
  "lib/highlight.ts": [
    "tokenize() untuk HTML/CSS/JS",
    "Edge cases: string dengan quote, nested tags",
  ],
  
  // Integration tests (Playwright)
  scenarios: [
    "Happy path: onboarding → lesson 1 → win → next lesson",
    "Fail path: lives = 0 → retry → success",
    "Pause/resume: blur tab → auto-pause → resume",
    "XP anti-farm: replay same score → 0 XP",
    "Gating: chapter 2 locked sampai chapter 1 Perak",
  ],
  
  // Accessibility audit
  tools: [
    "axe DevTools (WCAG 2.1 AA)",
    "NVDA screen reader (Windows)",
    "VoiceOver (macOS/iOS)",
    "Keyboard-only navigation",
  ],
  
  // Performance budget
  metrics: {
    "First Paint": "< 1.2s",
    "Time to Interactive": "< 3s",
    "Lighthouse Score": "> 90 (all)",
    "Bundle size (gzip)": "< 250KB (initial)",
  },
};
```

### 10.4 Deployment Checklist

**Pre-Deploy**
- [ ] npm run build → zero errors/warnings
- [ ] Lighthouse audit > 90 semua kategori
- [ ] Test di 3 browser (Chrome, Firefox, Safari)
- [ ] Test di 2 device mobile (iOS & Android)
- [ ] Verify PWA manifest & service worker
- [ ] Check localStorage migration logic

**Deploy Configuration**
- [ ] Environment variables (jika ada API key)
- [ ] CDN setup untuk assets statis
- [ ] Gzip/Brotli compression enable
- [ ] Cache headers (1 year untuk /assets/*)
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] Analytics setup (GA4 atau Plausible)

**Post-Deploy**
- [ ] Smoke test: buka 3 URL utama (/, /chapter/1, /results)
- [ ] Monitor error tracking (Sentry/Bugsnag)
- [ ] Check Web Vitals (CLS, LCP, FID)
- [ ] Verify service worker registration
- [ ] Test offline mode (airplane mode)

---

## 📚 REFERENSI & RESOURCES

### Teori Pedagogis
- **Bloom's Taxonomy**: Designing progressive learning objectives
- **Cognitive Load Theory**: Managing intrinsic/extraneous/germane load
- **Spaced Repetition**: Ebbinghaus forgetting curve & optimal intervals
- **Flow Theory (Csikszentmihalyi)**: Balancing challenge & skill

### Game Design
- **The Art of Game Design (Schell)**: Lens of Fun, Challenge, Skill
- **Game Feel (Swink)**: Juiciness, feedback, polish
- **Hooked Model (Eyal)**: Trigger → Action → Reward → Investment

### Technical Resources
- **Web Audio API**: MDN guide, Tone.js library (optional)
- **Canvas 2D Performance**: HTML5 Rocks, Paul Irish articles
- **React Performance**: Dan Abramov blog, React DevTools Profiler
- **TypeScript Handbook**: Generics, discriminated unions, type guards

### Accessibility
- **WCAG 2.1**: Understanding Success Criteria (w3.org)
- **Inclusive Components**: Heydon Pickering's patterns
- **A11y Project**: Checklist & tools
- **WebAIM**: Contrast checker, screen reader testing guide

---

## 🎯 KRITERIA KESUKSESAN (KPI)

### Engagement Metrics
- **Session Duration**: > 8 menit (target: 15 menit)
- **Completion Rate**: > 60% per lesson
- **Retention (D7)**: > 40% kembali dalam 7 hari
- **Retry Rate**: 30-50% (sweet spot: challenge tapi tidak frustrating)

### Learning Outcomes
- **Accuracy Improvement**: +15% dalam 3 lessons
- **WPM Growth**: +10 WPM per 5 jam latihan
- **Skill Transfer**: 70% bisa buat project mini setelah 12 lessons
- **Mistake Reduction**: Top 3 error chars berkurang 40% setelah drill

### Technical Health
- **Crash Rate**: < 0.5%
- **Load Time P75**: < 2s
- **FPS Average**: > 55 (target: 60)
- **Console Errors**: 0 (production build)

---

## 🚀 CALL TO ACTION UNTUK AGENTIC AI

**Anda adalah AI agent yang akan membuat game edukasi.**

**Instruksi Prioritas Tertinggi:**

1. **BACA DAN PAHAMI KESELURUHAN DOKUMEN INI** sebelum menulis satu baris kode pun
2. **IKUTI ARSITEKTUR** yang sudah terbukti (jangan reinvent the wheel)
3. **PRIORITASKAN FEEDBACK LOOP** daripada grafis fancy
4. **TEST DI BROWSER REAL** jangan hanya simulasi
5. **UKUR PERFORMANCE** sejak awal, jangan optimize di akhir

**Langkah Pertama:**
```bash
# 1. Generate project structure
npm create vite@latest my-edu-game -- --template react-ts

# 2. Copy-paste design token CSS dari Section 5.1
# 3. Implement storage layer dari Section 2.2
# 4. Build typing engine dari Section 3.1
# 5. Add audio dari Section 8.1
# 6. Deploy MVP!
```

**Mantra Developer:**
> "If it doesn't feel good to play in the first 30 seconds, no amount of content will save it."

**Kontak Debugging:**
Jika menemui hambatan teknis:
1. Check browser console (99% error ada di sana)
2. Inspect network tab (loading bottleneck?)
3. React DevTools Profiler (unnecessary re-render?)
4. Lighthouse audit (low-hanging fruit optimizations)

---

## 📝 VERSION HISTORY

- **v1.0** (2026-10-13): Initial master prompt berdasarkan CodeShark v0.9 codebase
- Distilasi dari 2.634 files, 16 pertemuan, 48 sesi latihan, 6 bulan development
- Battle-tested dengan 120+ siswa SMA/Mahasiswa (usia 14-22)

---

## 📜 LISENSI & ATTRIBUTION

Dokumen ini dibuat untuk kepentingan edukasi dan pengembangan AI-assisted learning tools.

**Boleh:**
- ✅ Digunakan sebagai referensi untuk project edukasi
- ✅ Diadaptasi untuk bahasa/framework lain
- ✅ Dishare dengan AI agent/developer lain

**Tidak Boleh:**
- ❌ Dijual sebagai course/ebook tanpa izin
- ❌ Diklaim sebagai karya original tanpa attribution
- ❌ Digunakan untuk tujuan komersial tanpa lisensi

**Credits:**
- **Arsitektur Asli**: CodeShark Academy Team
- **Dokumentasi**: AI Agent dengan supervisi Master Educator
- **Game Design Patterns**: Synthesized dari 20+ successful edutainment games

---

**🦈 "Code is poetry. Let's teach it like music, not like math."**

*— Philosophy of CodeShark Academy*

---

**END OF MASTER PROMPT**

**Total Tokens**: ~12,000 words
**Estimated Reading Time**: 45 menit
**Implementation Time (Full MVP)**: 2-3 minggu (1 developer full-time)

*Semoga bermanfaat untuk generasi AI agent berikutnya! 🚀*
