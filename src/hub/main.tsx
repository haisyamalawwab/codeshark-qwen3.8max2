import { SiteSettingsProvider } from "../lib/siteSettings";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import HubApp from "./HubApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode><SiteSettingsProvider>
    <HubApp />
  </SiteSettingsProvider></StrictMode>
);
