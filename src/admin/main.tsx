import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import AdminDiagnostics from "./AdminDiagnostics";

/* Halaman admin = DIAGNOSTIK & TES KONEKSI (khusus admin).
   Entry terpisah ini tidak memengaruhi aplikasi pemain: tidak
   dibungkus SiteSettingsProvider dan tidak mengubah konfigurasi.
   Pengujian koneksi dijalankan backend serverless (/api/*).
   Editor pengaturan lama (AdminSettings) sengaja tidak dipakai
   di sini agar halaman admin murni untuk melihat & mengetes. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminDiagnostics />
  </StrictMode>,
);
