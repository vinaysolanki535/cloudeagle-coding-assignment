import React from "react";
import DataTable from "./components/DataTable";
import { TableProvider } from "./context/TableContext";
import { columnsConfig, initialData } from "./config/tableConfig";

const App: React.FC = () => {
  return (
    <TableProvider initialData={initialData}>
      <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
        <div className="container mx-auto">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Advanced Editable Data Table
            </h1>
          </header>
          <DataTable columns={columnsConfig} />
        </div>
      </div>
    </TableProvider>
  );
};

export default App;
