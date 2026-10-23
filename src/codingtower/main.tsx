import { SiteSettingsProvider } from "../lib/siteSettings";
/* Entry mandiri Coding Tower — puzzle susun blok (Matter.js + Pixi lazy + p5 lazy). Dikunci ke arena tower. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App";

createRoot(document.getElementById("root")!).render(
  <StrictMode><SiteSettingsProvider>
    <App lockedSubGame="tower" hubHref="../" siblingHref="../codingshark/" siblingLabel="🦈 Coba CodeShark →" />
  </SiteSettingsProvider></StrictMode>
);
