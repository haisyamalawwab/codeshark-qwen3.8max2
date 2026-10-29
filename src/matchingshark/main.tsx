/* Entry mandiri MatchingShark — halaman khusus MK Rekayasa Perangkat Lunak.
   Saat ini berisi campaign konsep + demo semantic matching. Entry yang sama
   disiapkan sebagai rumah game penuh MatchingShark pada tahap berikutnya. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import MatchingSharkPage from "./MatchingSharkPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MatchingSharkPage />
  </StrictMode>,
);
