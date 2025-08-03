import { generateMockData } from "../utils/mockData";

export const columnsConfig = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    sorter: true,
    filterable: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 220,
    editable: true,
    sorter: true,
    filterable: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 280,
    editable: true,
    sorter: true,
    filterable: true,
  },
  {
    title: "Salary",
    dataIndex: "salary",
    width: 150,
    editable: true,
    sorter: true,
    filterable: true,
    render: (salary: number) =>
      `$${salary.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 120,
    editable: true,
    sorter: true,
    filterable: true,
  },
  { title: "Action", dataIndex: "action", width: 150 },
];

export const initialData = generateMockData(10000);
