import {  memo, useCallback,  useMemo, useState } from "react";
import {
  Box,
  
  Chip,
  
  LinearProgress,

  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import SortIcon from "@mui/icons-material/Sort";
import type { ColDef, ICellRendererParams, ValueFormatterParams, GridApi } from "ag-grid-community";
import type { Employee } from "../types";
import { DataGrid, type HelpItem } from "./DataGrid";
import { ColumnToggle } from "./ColumnToggle";
import { EmployeeDrawer } from "./EmployeeDrawer";


const StatusRenderer = memo(function StatusRenderer({ value }: ICellRendererParams<Employee>) {
  const active = value === "Active";
  return (
    <Chip
      label={active ? "Active" : "Inactive"}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        bgcolor: active ? "success.main" : "grey.500",
        color: "#fff",
      }}
    />
  );
});

const RatingRenderer = memo(function RatingRenderer({ value }: ICellRendererParams<Employee, number>) {
  const theme = useTheme();
  const rating = value as number;
  const pct = (rating / 5) * 100;
  const color = rating >= 4.5 ? "success" : rating >= 4.0 ? "primary" : "warning";
  const trackColor = theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "grey.200";
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, width: "100%", alignItems: "center" }}>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: trackColor }}
      />
      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 28, textAlign: "right" }}>
        {rating.toFixed(1)}
      </Typography>
    </Box>
  );
});

const SkillsRenderer = memo(function SkillsRenderer({ value }: ICellRendererParams<Employee, string[]>) {
  const theme = useTheme();
  const skills = (value ?? []) as string[];
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 0.5, py: 0.5 }}>
      {skills.map((skill) => (
        <Chip
          key={skill}
          label={skill}
          size="small"
          sx={{
            fontSize: "0.7rem",
            height: 22,
            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
            color: isDark ? "grey.300" : "text.primary",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </Box>
  );
});




const currencyFmt = (params: ValueFormatterParams): string =>
  params.value != null ? `$${Number(params.value).toLocaleString()}` : "";

const hireDateFmt = (params: ValueFormatterParams): string =>
  params.value
    ? new Date(params.value as string).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

interface EmployeeGridProps {
  data: Employee[];
}

export function EmployeeGrid({ data }: EmployeeGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const handleRowClicked = useCallback((emp: Employee) => {
    setSelectedEmployee(emp);
    setDrawerOpen(true);
  }, []);

  const handleGridReady = useCallback((api: GridApi) => {
    setGridApi(api);
  }, []);

  const handleSelectionChanged = useCallback((rows: Employee[]) => {
    setHasSelection(rows.length > 0);
  }, []);

  const helpItems = useMemo<HelpItem[]>(
    () => [
      { icon: <SearchIcon />, label: "Quick Search", shortcut: "Ctrl+F" },
      { icon: <FilterListOffIcon />, label: "Clear Filters", shortcut: "Esc" },
      { icon: <EditIcon />, label: "Edit Salary & Rating", shortcut: "Double-click" },
      { icon: <CheckBoxIcon />, label: "Select Rows via Checkbox" },
      { icon: <FileDownloadIcon />, label: "Export CSV (all or selected)" },
      { icon: <ViewColumnIcon />, label: "Show/Hide Columns" },
      { icon: <CalendarMonthIcon />, label: "Date Range Filter on Hire Date" },
      { icon: <TouchAppIcon />, label: "Click Row for Employee Details" },
      { icon: <SortIcon />, label: "Click Column Header to Sort" },
    ],
    []
  );

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: "id", headerName: "ID", width: 80, filter: "agNumberColumnFilter" },
      {
        headerName: "Name",
        valueGetter: (p) => (p.data ? `${p.data.firstName} ${p.data.lastName}` : ""),
        width: 170,
        filter: "agTextColumnFilter",
      },
      { field: "department", headerName: "Department", width: 140, filter: "agTextColumnFilter", },
      { field: "position", headerName: "Position", width: 210, filter: "agTextColumnFilter" },
      { field: "email", headerName: "Email", width: 250, filter: "agTextColumnFilter" },
      {
        field: "salary",
        headerName: "Salary",
        width: 130,
        filter: "agNumberColumnFilter",
        valueFormatter: currencyFmt,
        editable: true,
        valueSetter: (params) => {
          const raw = String(params.newValue).replace(/[$,]/g, "");
          const num = Number(raw);
          if (isNaN(num) || num < 0) return false;
          params.data.salary = num;
          return true;
        },
      },
      {
        field: "performanceRating",
        headerName: "Rating",
        width: 180,
        filter: "agNumberColumnFilter",
        cellRenderer: RatingRenderer,
        editable: true,
        valueSetter: (params) => {
          const num = Number(params.newValue);
          if (isNaN(num) || num < 0 || num > 5) return false;
          params.data.performanceRating = Math.round(num * 10) / 10;
          return true;
        },
      },
      { field: "projectsCompleted", headerName: "Projects", width: 115, filter: "agNumberColumnFilter" },
      { field: "age", headerName: "Age", width: 90, filter: "agNumberColumnFilter" },
      { field: "location", headerName: "Location", width: 140, filter: "agTextColumnFilter" },
      {
        field: "hireDate",
        headerName: "Hire Date",
        width: 140,
        valueFormatter: hireDateFmt,
        filter: "agDateColumnFilter",
        filterParams: {
          comparator: (filterDate: Date, cellValue: string) => {
            if (!cellValue) return -1;
            const cellDate = new Date(cellValue);
            const cell = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            const filter = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
            if (cell < filter) return -1;
            if (cell > filter) return 1;
            return 0;
          },
        },
      },
      {
        headerName: "Status",
        width: 125,
        valueGetter: (p) => (p.data?.isActive ? "Active" : "Inactive"),
        cellRenderer: StatusRenderer,
      filter: "agTextColumnFilter"
      },
      {
        field: "skills",
        headerName: "Skills",
        width: 300,
        cellRenderer: SkillsRenderer,
        filter: "agTextColumnFilter",
        filterValueGetter: (p) => p.data?.skills?.join(", ") ?? "",
        autoHeight: true,
      },
      {
        field: "manager",
        headerName: "Manager",
        width: 170,
        filter: "agTextColumnFilter",
        valueFormatter: (p: ValueFormatterParams) => p.value ?? "— Top Level —",
      },
    ],
    []
  );

  return (
    <>
      <DataGrid<Employee>
        title="Employee Directory"
        helpItems={helpItems}
        rowData={data}
        columnDefs={columnDefs}
        rowIdField="id"
        exportFileName="employees.csv"
        height={550}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        noRowsMessage="No employees found"
        onGridReady={handleGridReady}
        onRowClicked={handleRowClicked}
        onSelectionChanged={handleSelectionChanged}
        rowSelection="multiple"
        exportOnlySelected={hasSelection}
        toolbarExtra={<ColumnToggle gridApi={gridApi} />}
      />
      <EmployeeDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
