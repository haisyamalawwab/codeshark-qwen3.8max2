/* Entry mandiri CodeShark — Shark Typer (ketik kode). Dikunci ke arena shark. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App lockedSubGame="shark" hubHref="../" siblingHref="../codingtower/" siblingLabel="🧱 Coba Coding Tower →" />
  </StrictMode>
);
