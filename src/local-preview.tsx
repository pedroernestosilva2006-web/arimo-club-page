import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ArimoNetworkMap } from "./components/ui/arimo-network-map";
import { Index } from "./routes/index";

const section = new URLSearchParams(window.location.search).get("section");

createRoot(document.getElementById("root")!).render(
  <StrictMode>{section === "network" ? <ArimoNetworkMap /> : <Index />}</StrictMode>,
);
