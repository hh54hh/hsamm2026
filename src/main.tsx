import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import console filter to suppress third-party library warnings
import "./utils/consoleFilter";

// Register service worker for PWA
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to user to refresh the page
    if (confirm("New content available, reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // App is ready to work offline
  },
});

createRoot(document.getElementById("root")!).render(<App />);
