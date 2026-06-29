import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "aos/dist/aos.css";
import "./index.css";
import App from "./App.jsx";

// Disable browser scroll restoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);