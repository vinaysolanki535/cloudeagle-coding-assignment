import React, {
  createContext,
  useReducer,
  useContext,
  type ReactNode,
} from "react";
import type { DataRecord } from "../utils/interface";
import { ActionType, TableViewMode, type TableState } from "./interface";
import type { Action } from "./types";

const createInitialState = (initialData: DataRecord[]): TableState => ({
  data: initialData,
  sortConfig: null,
  filters: {},
  editingRow: null,
  viewMode: TableViewMode.VIRTUAL,
  pagination: { page: 0, pageSize: 50 },
});

const tableReducer = (state: TableState, action: Action): TableState => {
  switch (action.type) {
    case ActionType.SET_DATA:
      return { ...state, data: action.payload };
    case ActionType.SORT_DATA: {
      const isSameColumn = state.sortConfig?.key === action.payload.key;
      const isAsc = state.sortConfig?.direction === "asc";
      const newDirection = isSameColumn && isAsc ? "desc" : "asc";
      return {
        ...state,
        sortConfig: { key: action.payload.key, direction: newDirection },
      };
    }
    case ActionType.FILTER_DATA:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case ActionType.CLEAR_FILTERS:
      return { ...state, filters: {} };
    case ActionType.START_EDIT:
      return { ...state, editingRow: action.payload };
    case ActionType.UPDATE_EDITING_ROW:
      if (!state.editingRow) return state;
      return {
        ...state,
        editingRow: { ...state.editingRow, ...action.payload },
      };
    case ActionType.CANCEL_EDIT:
      return { ...state, editingRow: null };
    case ActionType.SAVE_EDIT: {
      if (!state.editingRow) return state;
      const rowToSave: DataRecord = {
        ...state.editingRow,
        salary: parseFloat(String(state.editingRow.salary)) || 0,
        quantity: parseInt(String(state.editingRow.quantity), 10) || 0,
      };
      const newData = [...state.data];
      const index = newData.findIndex(
        (item) => item.key === state.editingRow!.key
      );
      if (index > -1) {
        newData.splice(index, 1, rowToSave);
      }
      return { ...state, data: newData, editingRow: null };
    }
    case "TOGGLE_VIEW_MODE":
      return {
        ...state,
        viewMode:
          state.viewMode === TableViewMode.VIRTUAL
            ? TableViewMode.PAGINATED
            : TableViewMode.VIRTUAL,
      };
    case "SET_PAGINATION":
      return { ...state, pagination: action.payload };
    default:
      return state;
  }
};

const TableContext = createContext<
  { state: TableState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const TableProvider = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: DataRecord[];
}) => {
  const [state, dispatch] = useReducer(
    tableReducer,
    createInitialState(initialData)
  );
  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
