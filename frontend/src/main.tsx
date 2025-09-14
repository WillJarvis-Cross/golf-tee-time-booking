// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import outputs from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
Amplify.configure(outputs);

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
