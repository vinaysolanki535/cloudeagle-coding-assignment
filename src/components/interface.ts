interface MUIEditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: "number" | "text";
}

export interface DataTableProps {
  columns: any[];
}

export type { MUIEditableCellProps };
