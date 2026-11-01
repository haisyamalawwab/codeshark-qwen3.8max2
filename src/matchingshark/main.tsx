/* MatchingShark entry: expedition HUD by default; original campaign at ?view=landing. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import MatchingSharkPage from "./MatchingSharkPage";
import ExplorerHUD from "./ExplorerHUD";

const showLanding =
  new URLSearchParams(window.location.search).get("view") === "landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {showLanding ? <MatchingSharkPage /> : <ExplorerHUD />}
  </StrictMode>,
);
