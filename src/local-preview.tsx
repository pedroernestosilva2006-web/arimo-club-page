import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ExecutorsSection } from "./components/ARIMO/ExecutorsSection";
import { ArimoNetworkMap } from "./components/ui/arimo-network-map";
import { Index } from "./routes/index";

const section = new URLSearchParams(window.location.search).get("section");
const preview =
  section === "network" ? (
    <ArimoNetworkMap />
  ) : section === "executors" ? (
    <ExecutorsSection />
  ) : (
    <Index />
  );

createRoot(document.getElementById("root")!).render(<StrictMode>{preview}</StrictMode>);
