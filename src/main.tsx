import { SiteSettingsProvider } from "./lib/siteSettings";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode><SiteSettingsProvider>
    <App />
  </SiteSettingsProvider></StrictMode>
);
