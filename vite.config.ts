import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // path relatif agar dist/ bisa ditaruh di sub-folder (mis. Laragon: /CODESHARK/qwen3.8max2/dist/)
  // + tiap sub-game punya folder sendiri: / /codingshark/ /codingtower/
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // registrasi manual via public/pwa-register.js (path relatif per entry:
      // hub → ./sw.js, sub-game → ../sw.js). Auto-inject dimatikan agar tidak
      // menunjuk ./registerSW.js yang tidak ada di sub-folder.
      injectRegister: false,
      // satu SW di root melayani hub + kedua sub-folder (scope ./)
      manifestFilename: "manifest.webmanifest",
      manifest: false, // manifest dikelola manual di public/manifest.webmanifest
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"],
        // navigasi offline: hub + dua sub-game tetap bisa dibuka
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [/^\/$/, /codingshark/, /codingtower/, /crossplatform/],
        runtimeCaching: [
          {
            // font Google — cache-first agar HUD tetap cantik offline
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  // dev server di belakang preview proxy harus diizinkan dan berjalan di port 3000
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    proxy: { "/api": { target: "http://127.0.0.1:3001", changeOrigin: true } },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // jangan inline aset: SVG latar tetap file terpisah (elemen grafis)
    assetsInlineLimit: 0,
    // Engine arena (p5 ~1MB, pixi ~0.9MB min) memang tak bisa <500 kB dan
    // semuanya lazy per-arena — tak memblokir first paint (gzip ±230 kB).
    // Yang dijaga ramping adalah initial-load: hub + vendor-react + vendor + App.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // Anotasi @__PURE__ di node_modules (mis. zod via p5) posisinya tak terbaca
      // Rollup — jinak dan otomatis dibuang. Disenyapkan agar log build bersih.
      onwarn(warning, handler) {
        if (warning.code === "INVALID_ANNOTATION") return;
        handler(warning);
      },
      // EMPAT ENTRY: hub agregat + 3 sub-game mandiri (output dist sub-folder)
      input: {
        hub: path.resolve(__dirname, "index.html"),
        codingshark: path.resolve(__dirname, "codingshark/index.html"),
        codingtower: path.resolve(__dirname, "codingtower/index.html"),
        crossplatform: path.resolve(__dirname, "crossplatform/index.html"),
      },
      output: {
        // JS, CSS, dan grafis dipisah ke folder masing-masing
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (info) => {
          const n = info.names?.[0] ?? "";
          if (n.endsWith(".css")) return "assets/css/[name]-[hash][extname]";
          if (/\.(svg|png|jpe?g|webp|gif|ico)$/i.test(n)) return "assets/img/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
        // split agresif per pustaka game agar HP hanya unduh yang dipakai:
        // hub (~kecil), shark (react+dom), tower (matter/pixi/p5/dnd lazy).
        // Kolektor "vendor" HARUS ramping (initial-load) — dependensi transitif
        // engine (zod/acorn/i18next milik p5, earcut/eventemitter milik pixi,
        // sql.js milik initSqlite) dilarang bocor ke sana karena path-nya tak
        // mengandung nama engine-nya.
        manualChunks: (id) => {
          // helper preload bawaan Vite HARUS di chunk sendiri — bila ikut
          // game-pixi, semua entry (termasuk hub ringan) terpaksa mengunduh pixi.
          if (id.includes("vite/preload")) return "preload";
          if (!id.includes("node_modules")) return undefined;

          // Recharts & ekosistem charting / redux (lazy-loaded di Dashboard)
          if (
            id.includes("recharts") ||
            id.includes("react-redux") ||
            id.includes("react-smooth") ||
            id.includes("redux") ||
            id.includes("use-sync-external-store") ||
            id.includes("victory-vendor") ||
            id.includes("d3-") ||
            id.includes("decimal.js-light")
          ) {
            return "charts";
          }

          if (
            id.includes("pixi.js") || id.includes("@pixi") || id.includes("earcut") ||
            id.includes("gifuct") || id.includes("ismobilejs") ||
            id.includes("parse-svg") || id.includes("xmldom") || id.includes("tiny-lru") ||
            id.includes("colord")
          ) return "game-pixi";
          if (
            id.includes("p5") || id.includes("zod") || id.includes("bezier-path") ||
            id.includes("unicode-range") || id.includes("acorn") || id.includes("escodegen") ||
            id.includes("colorjs") || id.includes("gifenc") || id.includes("i18next") ||
            id.includes("libtess") || id.includes("omggif") || id.includes("/pako/")
          ) return "game-p5";
          if (id.includes("matter-js")) return "game-matter";
          if (id.includes("sql.js")) return "game-sql";
          if (id.includes("@dnd-kit")) return "game-dnd";

          // Core React runtime
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/") ||
            id.includes("/node_modules/react-is/") ||
            id.includes("\\node_modules\\react\\") ||
            id.includes("\\node_modules\\react-dom\\") ||
            id.includes("\\node_modules\\scheduler\\") ||
            id.includes("\\node_modules\\react-is\\")
          ) return "vendor-react";

          return "vendor";
        },
      },
    },
  },
});
