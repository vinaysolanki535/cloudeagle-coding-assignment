import React, { useMemo, useRef, useCallback, useEffect } from "react";
import {
  Paper,
  Box,
  TableSortLabel,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  TablePagination,
} from "@mui/material";
import { VariableSizeList as List } from "react-window";
import { useTableContext } from "../context/TableContext";
import { useVirtualTable } from "../hooks/useVirtualTable";
import { TableRow } from "./TableRow";
import { CSVLink } from "react-csv";
import type { DataRecord } from "../utils/interface";
import type { DataTableProps } from "./interface";
import { ActionType, TableViewMode } from "../context/interface";

const DataTable: React.FC<DataTableProps> = ({ columns }) => {
  const { state, dispatch } = useTableContext();
  const { sortedData } = useVirtualTable();
  const { sortConfig, filters, editingRow, viewMode, pagination } = state;

  const listRef = useRef<List>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // export csv logic
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (editingRow) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editingRow]);

  const totalColumnWidth = useMemo(
    () => columns.reduce((sum, col) => sum + col.width, 0),
    [columns]
  );

  const csvHeaders = useMemo(
    () =>
      columns
        .filter((col) => col.dataIndex !== "action")
        .map((col) => ({ label: col.title, key: col.dataIndex })),
    [columns]
  );

  const handleSort = useCallback(
    (key: keyof DataRecord) =>
      dispatch({ type: ActionType.SORT_DATA, payload: { key } }),
    [dispatch]
  );
  const handleFilterChange = useCallback(
    (key: keyof DataRecord, value: string) =>
      dispatch({ type: ActionType.FILTER_DATA, payload: { key, value } }),
    [dispatch]
  );
  const clearFilters = useCallback(
    () => dispatch({ type: ActionType.CLEAR_FILTERS }),
    [dispatch]
  );
  const handleEdit = useCallback(
    (record: DataRecord) =>
      dispatch({ type: ActionType.START_EDIT, payload: record }),
    [dispatch]
  );
  const handleCancel = useCallback(
    () => dispatch({ type: ActionType.CANCEL_EDIT }),
    [dispatch]
  );
  const handleSave = useCallback(
    () => dispatch({ type: ActionType.SAVE_EDIT }),
    [dispatch]
  );
  const handleCellChange = useCallback(
    (key: keyof DataRecord, value: any) =>
      dispatch({
        type: ActionType.UPDATE_EDITING_ROW,
        payload: { [key]: value },
      }),
    [dispatch]
  );

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const itemData = useMemo(
    () => ({
      rows: sortedData,
      columns,
      editingRow,
      handleEdit,
      handleSave,
      handleCancel,
      handleCellChange,
    }),
    [
      sortedData,
      columns,
      editingRow,
      handleEdit,
      handleSave,
      handleCancel,
      handleCellChange,
    ]
  );

  // pagination logic
  const paginatedData = useMemo(() => {
    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  return (
    <Paper
      sx={{
        width: "fit-content",
        maxWidth: "100%",
        overflow: "hidden",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={viewMode === TableViewMode.VIRTUAL}
              onChange={() => dispatch({ type: ActionType.TOGGLE_VIEW_MODE })}
            />
          }
          label="Virtual Scroll"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <CSVLink
            data={sortedData}
            headers={csvHeaders}
            filename={"cloudeagle_data_export.csv"}
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <Button variant="contained">Export to CSV</Button>
          </CSVLink>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>
      <div
        ref={headerRef}
        className="overflow-x-hidden bg-gray-50 border-b-2 border-t-2 border-gray-300"
      >
        <div className="flex" style={{ width: totalColumnWidth }}>
          {columns.map((col) => (
            <div
              key={col.dataIndex}
              style={{ width: col.width, flexShrink: 0 }}
              className="p-2 border-r border-gray-200"
            >
              {col.sorter ? (
                <TableSortLabel
                  active={sortConfig?.key === col.dataIndex}
                  direction={
                    sortConfig?.key === col.dataIndex
                      ? sortConfig?.direction
                      : "asc"
                  }
                  onClick={() => handleSort(col.dataIndex as keyof DataRecord)}
                  sx={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.87)" }}
                >
                  {col.title}
                </TableSortLabel>
              ) : (
                <span
                  style={{
                    fontWeight: 600,
                    color: "rgba(0, 0, 0, 0.87)",
                    padding: "8px",
                  }}
                >
                  {col.title}
                </span>
              )}
              {col.filterable && (
                <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  placeholder={`Filter...`}
                  value={filters[col.dataIndex as keyof DataRecord] || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      col.dataIndex as keyof DataRecord,
                      e.target.value
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className="overflow-auto"
        style={{ height: 530 }}
        onScroll={handleBodyScroll}
      >
        {viewMode === TableViewMode.VIRTUAL ? (
          <List
            ref={listRef}
            height={530}
            itemCount={sortedData.length}
            itemSize={() => 54}
            width={totalColumnWidth}
            itemData={itemData}
          >
            {TableRow}
          </List>
        ) : (
          <div style={{ width: totalColumnWidth }}>
            {paginatedData?.map((record, index) => {
              const paginatedItemData = { ...itemData, rows: paginatedData };
              return (
                <TableRow
                  key={record.key}
                  index={index}
                  style={{}}
                  data={paginatedItemData}
                />
              );
            })}
          </div>
        )}
      </div>
      {viewMode === TableViewMode.PAGINATED && (
        <TablePagination
          rowsPerPageOptions={[50, 100, 200]}
          component="div"
          count={sortedData.length}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={(_, newPage) =>
            dispatch({
              type: ActionType.SET_PAGINATION,
              payload: { ...pagination, page: newPage },
            })
          }
          onRowsPerPageChange={(e) =>
            dispatch({
              type: ActionType.SET_PAGINATION,
              payload: { page: 0, pageSize: parseInt(e.target.value, 10) },
            })
          }
        />
      )}
    </Paper>
  );
};

export default DataTable;
