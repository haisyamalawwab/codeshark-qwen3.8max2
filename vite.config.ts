import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // path relatif agar dist/ bisa ditaruh di sub-folder (mis. Laragon: /CODESHARK/qwen3.8max2/dist/)
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // jangan inline aset: SVG latar tetap file terpisah (elemen grafis)
    assetsInlineLimit: 0,
    rollupOptions: {
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
        // vendor (React) dipisah dari kode aplikasi
        manualChunks: (id) => (id.includes("node_modules") ? "vendor" : undefined),
      },
    },
  },
});
