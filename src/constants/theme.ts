import { createTheme } from "@mui/material";

const shared = {
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', sans-serif",
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 as const },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    secondary: { main: "#7c4dff" },
    background: { default: "#f5f7fa", paper: "#ffffff" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#42a5f5" },
    secondary: { main: "#b388ff" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
  },
});
