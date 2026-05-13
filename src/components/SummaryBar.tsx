import { Box, Typography, Divider, useMediaQuery, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import FolderIcon from "@mui/icons-material/Folder";
import BusinessIcon from "@mui/icons-material/Business";
import type { EmployeeStats } from "../hooks/useEmployeeStats";

interface SummaryBarProps {
  stats: EmployeeStats;
}

const items = [
  { key: "total", label: "Total", icon: <PeopleIcon sx={{ fontSize: 16 }} /> },
  { key: "active", label: "Active", icon: <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} /> },
  { key: "departments", label: "Depts", icon: <BusinessIcon sx={{ fontSize: 16 }} /> },
  { key: "avgSalary", label: "Avg Salary", icon: <AttachMoneyIcon sx={{ fontSize: 16 }} /> },
  { key: "avgRating", label: "Avg Rating", icon: <StarIcon sx={{ fontSize: 16, color: "warning.main" }} /> },
  { key: "totalProjects", label: "Projects", icon: <FolderIcon sx={{ fontSize: 16 }} /> },
] as const;

function formatValue(key: string, value: number): string {
  if (key === "avgSalary") return `$${value.toLocaleString()}`;
  return value.toString();
}

export function SummaryBar({ stats }: SummaryBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1, sm: 1.5 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        justifyContent: { xs: "center", sm: "flex-start" },
        overflowX: "auto",
      }}
    >
      {items.map((item, i) => (
        <Box key={item.key} sx={{ display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap" }}>
          {i > 0 && !isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />}
          {item.icon}
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
            {item.label}:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            {formatValue(item.key, stats[item.key])}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
