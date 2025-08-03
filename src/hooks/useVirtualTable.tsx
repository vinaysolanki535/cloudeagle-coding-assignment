import { useMemo } from "react";
import { useTableContext } from "../context/TableContext";

export const useVirtualTable = () => {
  const { state } = useTableContext();
  const { data, sortConfig, filters } = state;

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // filters logic
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        processedData = processedData.filter((item) =>
          String(item[key as keyof typeof item])
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    // sorting logic
    if (sortConfig) {
      processedData.sort((a, b) => {
        if (
          typeof a[sortConfig.key] === "string" &&
          typeof b[sortConfig.key] === "string"
        ) {
          return sortConfig.direction === "asc"
            ? (a[sortConfig.key] as string).localeCompare(
                b[sortConfig.key] as string
              )
            : (b[sortConfig.key] as string).localeCompare(
                a[sortConfig.key] as string
              );
        }
        if (
          typeof a[sortConfig.key] === "number" &&
          typeof b[sortConfig.key] === "number"
        ) {
          return sortConfig.direction === "asc"
            ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
            : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
        }
        return 0;
      });
    }

    return processedData;
  }, [data, sortConfig, filters]);

  return {
    sortedData: filteredAndSortedData,
  };
};
