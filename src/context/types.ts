import type { DataRecord } from "../utils/interface";
import type { ActionType } from "./interface";

type EditingDataRecord = Omit<DataRecord, "salary" | "quantity"> & {
  salary: number | string;
  quantity: number | string;
};

export type Action =
  | { type: ActionType.SET_DATA; payload: DataRecord[] }
  | { type: ActionType.SORT_DATA; payload: { key: keyof DataRecord } }
  | {
      type: ActionType.FILTER_DATA;
      payload: { key: keyof DataRecord; value: string };
    }
  | { type: ActionType.CLEAR_FILTERS }
  | { type: ActionType.START_EDIT; payload: DataRecord }
  | { type: ActionType.UPDATE_EDITING_ROW; payload: Partial<EditingDataRecord> }
  | { type: ActionType.CANCEL_EDIT }
  | { type: ActionType.SAVE_EDIT }
  | { type: ActionType.TOGGLE_VIEW_MODE }
  | {
      type: ActionType.SET_PAGINATION;
      payload: { page: number; pageSize: number };
    };

export type { EditingDataRecord };
