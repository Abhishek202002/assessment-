import { useState, useCallback } from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import type { GridApi } from "ag-grid-community";

interface ColumnToggleProps {
  gridApi: GridApi | null;
}

export function ColumnToggle({ gridApi }: ColumnToggleProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const open = Boolean(anchorEl);

  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!gridApi) return;
      const cols = gridApi.getColumns() ?? [];
      const state: Record<string, boolean> = {};
      cols.forEach((col) => {
        state[col.getColId()] = col.isVisible();
      });
      setVisibility(state);
      setAnchorEl(e.currentTarget);
    },
    [gridApi]
  );

  const handleToggle = useCallback(
    (colId: string) => {
      if (!gridApi) return;
      const next = !visibility[colId];
      gridApi.setColumnsVisible([colId], next);
      setVisibility((prev) => ({ ...prev, [colId]: next }));
    },
    [gridApi, visibility]
  );

  const columns = gridApi?.getColumns() ?? [];

  return (
    <>
      <Tooltip title="Toggle columns">
        <IconButton size="small" onClick={handleOpen}>
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { maxHeight: 350, width: 220 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Columns
          </Typography>
        </Box>
        <Divider />
        {columns.map((col) => {
          const colId = col.getColId();
          const name = col.getColDef().headerName || colId;
          return (
            <MenuItem key={colId} dense onClick={() => handleToggle(colId)}>
              <Checkbox size="small" checked={!!visibility[colId]} sx={{ p: 0, mr: 1 }} />
              <ListItemText primary={name} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
