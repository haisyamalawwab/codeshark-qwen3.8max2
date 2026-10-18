/* Entry mandiri CrossPlatform Studio — React Native & Expo SDK (MK Sistem Aplikasi Lintas Platform).
   Dikunci ke arena crossplatform. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App
      lockedSubGame="crossplatform"
      hubHref="../"
      siblingHref="../codingtower/"
      siblingLabel="🧱 Coba Coding Tower →"
    />
  </StrictMode>
);
