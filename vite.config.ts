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
        navigateFallbackAllowlist: [/^\/$/, /codingshark/, /codingtower/],
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
  // dev server di belakang preview proxy (host *.e2b.app) harus diizinkan; tidak memengaruhi build
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // jangan inline aset: SVG latar tetap file terpisah (elemen grafis)
    assetsInlineLimit: 0,
    // Chunk lazy arena (pixi/p5 + sql.js on-demand) tidak boleh memblokir first paint,
    // jadi batas warning dinaikkan: yang dijaga ramping adalah initial-load
    // (hub + vendor-react + vendor + App), bukan engine game yang di-load per-arena.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      // Anotasi @__PURE__ di node_modules (mis. zod via p5) posisinya tak terbaca
      // Rollup — jinak dan otomatis dibuang. Disenyapkan agar log build bersih.
      onwarn(warning, handler) {
        if (warning.code === "INVALID_ANNOTATION") return;
        handler(warning);
      },
      // TIGA ENTRY: hub agregat + 2 sub-game mandiri (output dist sub-folder)
      input: {
        hub: path.resolve(__dirname, "index.html"),
        codingshark: path.resolve(__dirname, "codingshark/index.html"),
        codingtower: path.resolve(__dirname, "codingtower/index.html"),
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
        // hub (~kecil), shark (react+dom), tower (matter/pixi/p5/dnd/anime lazy)
        manualChunks: (id) => {
          // helper preload bawaan Vite HARUS di chunk sendiri — bila ikut
          // game-pixi, semua entry (termasuk hub ringan) terpaksa mengunduh pixi.
          if (id.includes("vite/preload")) return "preload";
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("pixi.js") || id.includes("@pixi")) return "game-pixi";
          if (id.includes("p5")) return "game-p5";
          if (id.includes("matter-js")) return "game-matter";
          if (id.includes("@dnd-kit")) return "game-dnd";
          if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
          return "vendor";
        },
      },
    },
  },
});
