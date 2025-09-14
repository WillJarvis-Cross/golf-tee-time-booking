// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

let outputs;
try {
  outputs = await import("../amplify_outputs.json");
} catch {
  outputs = {}; // Fallback during build
}
import { Amplify } from "aws-amplify";
if (outputs.default) {
  Amplify.configure(outputs.default);
}

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
