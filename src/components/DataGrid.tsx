import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useTheme,
  Snackbar,
  Alert,
  Collapse,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
  colorSchemeDark,
  colorSchemeLight,
  type ColDef,
  type GridReadyEvent,
  type GridApi,
  type RowClassParams,
  type GetRowIdParams,
  type CellClickedEvent,
  type CellValueChangedEvent,
  type SelectionChangedEvent,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataGridAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

export interface HelpItem {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

export interface DataGridProps<TRow> {
  rowData: TRow[];
  columnDefs: ColDef<TRow>[];
  title?: string;
  helpItems?: HelpItem[];
  height?: number;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showQuickFilter?: boolean;
  showExport?: boolean;
  showClearFilters?: boolean;
  exportFileName?: string;
  actions?: DataGridAction[];
  rowIdField?: keyof TRow & string;
  getRowClass?: (params: RowClassParams<TRow>) => string | undefined;
  defaultColDef?: ColDef<TRow>;
  onGridReady?: (api: GridApi<TRow>) => void;
  onRowClicked?: (data: TRow) => void;
  onCellValueChanged?: (event: CellValueChangedEvent<TRow>) => void;
  onSelectionChanged?: (selectedRows: TRow[]) => void;
  rowSelection?: "single" | "multiple";
  exportOnlySelected?: boolean;
  noRowsMessage?: string;
  loading?: boolean;
  toolbarExtra?: React.ReactNode;
}

const gridThemeLight = themeAlpine.withPart(colorSchemeLight);
const gridThemeDark = themeAlpine.withPart(colorSchemeDark);

export function DataGrid<TRow>({
  rowData,
  columnDefs,
  title,
  helpItems,
  height = 540,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showQuickFilter = true,
  showExport = true,
  showClearFilters = true,
  exportFileName = "export.csv",
  actions,
  rowIdField,
  getRowClass,
  defaultColDef: defaultColDefOverride,
  onGridReady: onGridReadyCallback,
  onRowClicked,
  onCellValueChanged,
  onSelectionChanged,
  rowSelection,
  exportOnlySelected = false,
  noRowsMessage = "No rows to display",
  loading = false,
  toolbarExtra,
}: DataGridProps<TRow>) {
  const muiTheme = useTheme();
  const gridApiRef = useRef<GridApi<TRow> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [quickFilter, setQuickFilter] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
  const [showHelp, setShowHelp] = useState(false);

  const agTheme = muiTheme.palette.mode === "dark" ? gridThemeDark : gridThemeLight;

  const mergedDefaultColDef = useMemo<ColDef<TRow>>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: 70,
      ...defaultColDefOverride,
    }),
    [defaultColDefOverride]
  );

  const getRowId = useMemo(() => {
    if (!rowIdField) return undefined;
    return (params: GetRowIdParams<TRow>) => String(params.data[rowIdField]);
  }, [rowIdField]);

  const handleGridReady = useCallback(
    (event: GridReadyEvent<TRow>) => {
      gridApiRef.current = event.api;
      onGridReadyCallback?.(event.api);
    },
    [onGridReadyCallback]
  );

  const handleCellClicked = useCallback(
    (event: CellClickedEvent<TRow>) => {
      if (event.colDef.editable) return;
      if (event.data && onRowClicked) onRowClicked(event.data);
    },
    [onRowClicked]
  );

  const handleExport = useCallback(() => {
    gridApiRef.current?.exportDataAsCsv({
      fileName: exportFileName,
      onlySelected: exportOnlySelected,
    });
  }, [exportFileName, exportOnlySelected]);

  const handleClearFilters = useCallback(() => {
    gridApiRef.current?.setFilterModel(null);
    setQuickFilter("");
    gridApiRef.current?.setGridOption("quickFilterText", "");
  }, []);

  const handleQuickFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuickFilter(val);
      gridApiRef.current?.setGridOption("quickFilterText", val);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setQuickFilter("");
    gridApiRef.current?.setGridOption("quickFilterText", "");
  }, []);

  const handleCellValueChanged = useCallback(
    (event: CellValueChangedEvent<TRow>) => {
      onCellValueChanged?.(event);
      const field = event.colDef.headerName ?? event.colDef.field ?? "field";
      setSnackbar({ open: true, message: `${field} updated successfully` });
    },
    [onCellValueChanged]
  );

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<TRow>) => {
      if (!onSelectionChanged) return;
      const selected = event.api.getSelectedRows();
      onSelectionChanged(selected);
    },
    [onSelectionChanged]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        if (showQuickFilter && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
        }
      }
      if (e.key === "Escape") {
        handleClearFilters();
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClearFilters, showQuickFilter]);

  return (
    <Card sx={{ overflow: "visible" }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 3 }, "&:last-child": { pb: { xs: 1.5, sm: 3 } } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1,
            mb: 2,
          }}
        >
          {title && (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, lineHeight: 1.2 }}>
                {title}
              </Typography>
              {helpItems && helpItems.length > 0 && (
                <Tooltip title={showHelp ? "Hide help" : "Show help"}>
                  <IconButton
                    onClick={() => setShowHelp((prev) => !prev)}
                    sx={{
                      color: showHelp ? "primary.main" : "text.secondary",
                      transition: "color 0.2s",
                      p: 0,
                      width: 24,
                      height: 24,
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.5,
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: 1,
            }}
          >
            {showQuickFilter && (
              <TextField
                size="small"
                placeholder="Search… (Ctrl+F)"
                value={quickFilter}
                onChange={handleQuickFilterChange}
                inputRef={searchInputRef}
                sx={{ width: { xs: "100%", sm: 200 }, minWidth: 140 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: quickFilter ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch} edge="end">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
              />
            )}

            {toolbarExtra}

            {showClearFilters && (
              <Tooltip title="Clear all filters">
                <IconButton size="small" onClick={handleClearFilters}>
                  <FilterListOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {showExport && (
              <Tooltip title={exportOnlySelected ? "Export selected rows as CSV" : "Export all as CSV"}>
                <IconButton size="small" onClick={handleExport}>
                  <FileDownloadIcon fontSize="small" color={exportOnlySelected ? "primary" : "inherit"} />
                </IconButton>
              </Tooltip>
            )}

            {actions?.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? "outlined"}
                color={action.color ?? "primary"}
                size="small"
                startIcon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>

        {helpItems && helpItems.length > 0 && (
          <Collapse in={showHelp}>
            <Box
              sx={{
                mb: 2,
                px: { xs: 1.5, sm: 2.5 },
                py: { xs: 1.5, sm: 2 },
                bgcolor: (t) => t.palette.mode === "dark" ? "rgba(144,202,249,0.04)" : "rgba(25,118,210,0.03)",
                borderRadius: 2,
                border: "1px solid",
                borderColor: (t) => t.palette.mode === "dark" ? "rgba(144,202,249,0.15)" : "rgba(25,118,210,0.12)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                {helpItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 0.75,
                      px: 1,
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: "primary.main",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.2 }}>
                      {item.label}
                    </Typography>
                    {item.shortcut && (
                      <Box
                        component="kbd"
                        sx={{
                          ml: "auto",
                          px: 0.75,
                          py: 0.25,
                          fontSize: "0.65rem",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: "text.secondary",
                          bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          whiteSpace: "nowrap",
                          lineHeight: 1,
                        }}
                      >
                        {item.shortcut}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>
        )}

        <Box sx={{ height, width: "100%" }}>
          <AgGridReact<TRow>
            theme={agTheme}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={mergedDefaultColDef}
            onGridReady={handleGridReady}
            onCellClicked={handleCellClicked}
            onCellValueChanged={onCellValueChanged ? handleCellValueChanged : undefined}
            onSelectionChanged={onSelectionChanged ? handleSelectionChanged : undefined}
            getRowId={getRowId}
            rowSelection={rowSelection ? { mode: rowSelection === "multiple" ? "multiRow" : "singleRow", checkboxes: true, headerCheckbox: rowSelection === "multiple" } : undefined}
            pagination={pagination}
            paginationPageSize={pageSize}
            paginationPageSizeSelector={pageSizeOptions}
            enableCellTextSelection={!rowSelection}
            tooltipShowDelay={300}
            getRowClass={getRowClass}
            loading={loading}
            overlayNoRowsTemplate={`<span style="padding:24px">${noRowsMessage}</span>`}
            suppressDragLeaveHidesColumns={true}
            popupParent={document.body}
          />
        </Box>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
