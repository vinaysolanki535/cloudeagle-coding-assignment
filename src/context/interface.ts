import type { DataRecord } from "../utils/interface";
import type { EditingDataRecord } from "./types";

export enum TableViewMode {
  VIRTUAL = "virtual",
  PAGINATED = "paginated",
}

interface TableState {
  data: DataRecord[];
  sortConfig: { key: keyof DataRecord; direction: "asc" | "desc" } | null;
  filters: Partial<Record<keyof DataRecord, string>>;
  editingRow: EditingDataRecord | null;
  viewMode: TableViewMode.VIRTUAL | TableViewMode.PAGINATED;
  pagination: { page: number; pageSize: number };
}

export enum ActionType {
  SET_DATA = "SET_DATA",
  SORT_DATA = "SORT_DATA",
  FILTER_DATA = "FILTER_DATA",
  CLEAR_FILTERS = "CLEAR_FILTERS",
  START_EDIT = "START_EDIT",
  UPDATE_EDITING_ROW = "UPDATE_EDITING_ROW",
  CANCEL_EDIT = "CANCEL_EDIT",
  SAVE_EDIT = "SAVE_EDIT",
  TOGGLE_VIEW_MODE = "TOGGLE_VIEW_MODE",
  SET_PAGINATION = "SET_PAGINATION",
}

export type { TableState };
