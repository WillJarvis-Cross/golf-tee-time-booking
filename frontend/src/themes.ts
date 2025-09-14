// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2e7d32" },   // subtle golf-y green
    secondary: { main: "#00695c" },
  },
  shape: { borderRadius: 12 },
});
