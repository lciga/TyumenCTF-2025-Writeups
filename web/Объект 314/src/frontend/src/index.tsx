import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import { App } from "./App";

let container = document.getElementById("app")!;
let root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
