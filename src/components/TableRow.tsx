import React from "react";
import { Box, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { MUIEditableCell } from "./EditableCell";

export const TableRow = React.memo(
  ({
    index,
    style,
    data: itemData,
  }: {
    index: number;
    style: React.CSSProperties;
    data: any;
  }) => {
    const {
      rows,
      columns,
      editingRow,
      handleEdit,
      handleSave,
      handleCancel,
      handleCellChange,
    } = itemData;

    const record = rows[index];
    const isEditing = editingRow?.key === record.key;

    return (
      <div
        style={style}
        className="flex border-b border-gray-200 hover:bg-gray-50"
      >
        {columns.map((col: any) => {
          if (col.dataIndex === "action") {
            return (
              <div
                key={col.dataIndex}
                style={{ width: col.width, flexShrink: 0 }}
                className="flex items-center p-4 border-r border-gray-200"
              >
                {isEditing ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleSave(record.key)}
                      color="primary"
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleCancel}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(record)}
                    disabled={!!editingRow}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </div>
            );
          }

          const cellValue = record[col.dataIndex];
          const editingValue = editingRow ? editingRow[col.dataIndex] : null;
          const renderedValue = col.render
            ? col.render(cellValue, record, index)
            : cellValue;

          return (
            <div
              key={col.dataIndex}
              style={{ width: col.width, flexShrink: 0 }}
              className="flex items-center p-4 border-r border-gray-200"
            >
              <MUIEditableCell
                value={isEditing && col.editable ? editingValue : renderedValue}
                isEditing={isEditing && col.editable}
                inputType={
                  ["salary", "quantity"].includes(col.dataIndex)
                    ? "number"
                    : "text"
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCellChange(col.dataIndex, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    );
  }
);
