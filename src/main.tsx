import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initNativePlatform } from "./lib/nativePlatform";

createRoot(document.getElementById("root")!).render(<App />);

// Fire-and-forget native init (no-op on web).
initNativePlatform();
