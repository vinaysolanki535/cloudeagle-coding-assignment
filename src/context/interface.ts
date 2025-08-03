import type { DataRecord } from "../utils/interface";
import type { EditingDataRecord } from "./types";

interface TableState {
  data: DataRecord[];
  sortConfig: { key: keyof DataRecord; direction: "asc" | "desc" } | null;
  filters: Partial<Record<keyof DataRecord, string>>;
  editingRow: EditingDataRecord | null;
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
}

export type { TableState };
