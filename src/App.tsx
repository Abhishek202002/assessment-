import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeProvider, useThemeMode } from "./context/ThemeContext";
import { employees } from "./data/employees";
import { generateEmployees } from "./data/generateEmployees";
import { useEmployeeStats } from "./hooks/useEmployeeStats";
import { SummaryBar } from "./components/SummaryBar";
import { EmployeeGrid } from "./components/EmployeeGrid";

const DATASET_SIZES = [20, 500, 5000, 10000] as const;

function Dashboard() {
  const { isDark, toggle } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [datasetSize, setDatasetSize] = useState<number>(20);

  const data = useMemo(() => {
    if (datasetSize === 20) return employees;
    return generateEmployees(datasetSize);
  }, [datasetSize]);

  const stats = useEmployeeStats(data);

  const handleSizeChange = useCallback((_: React.MouseEvent, val: number | null) => {
    if (val !== null) setDatasetSize(val);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            flexWrap: "wrap",
            gap: 1,
            py: { xs: 1, sm: 0 },
            minHeight: { xs: "auto", sm: 64 },
          }}
        >
          <DashboardIcon sx={{ mr: 0.5, display: { xs: "none", sm: "block" } }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1.25rem" }, flexGrow: 1 }}
          >
            FactWise HR Dashboard
          </Typography>

          <ToggleButtonGroup
            value={datasetSize}
            exclusive
            onChange={handleSizeChange}
            size="small"
            sx={{
              order: { xs: 3, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              "& .MuiToggleButton-root": {
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.3)",
                px: { xs: 1, sm: 1.5 },
                py: 0.25,
                fontSize: "0.75rem",
                flex: { xs: 1, sm: "none" },
                "&.Mui-selected": {
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.15)",
                },
              },
            }}
          >
            {DATASET_SIZES.map((size) => (
              <ToggleButton key={size} value={size}>
                {size >= 1000 ? `${size / 1000}K` : size}{isMobile ? "" : " rows"}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <IconButton color="inherit" onClick={toggle} sx={{ ml: { xs: 0, sm: 1 } }}>
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1.5, sm: 3 } }}>
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <SummaryBar stats={stats} />
        </Box>
        <EmployeeGrid data={data} />
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
