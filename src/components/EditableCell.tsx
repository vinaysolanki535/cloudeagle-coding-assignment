import React from "react";
import { TextField } from "@mui/material";
import type { MUIEditableCellProps } from "./interface";

export const MUIEditableCell: React.FC<MUIEditableCellProps> = ({
  value,
  isEditing,
  onChange,
  inputType,
}) => {
  if (isEditing) {
    return (
      <TextField
        variant="standard"
        size="small"
        type={inputType}
        value={value}
        onChange={onChange}
        autoFocus
        fullWidth
        InputProps={{ sx: { fontSize: "inherit", padding: 0 } }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }
  return <div className="truncate">{value}</div>;
};
