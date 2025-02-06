"use client";

import { useGetExpensesQuery } from "@/state/api"; // Ensure this points to the correct API hook
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Expense } from "@/state/api"; // Import your Expense type

// Define the columns for the DataGrid, explicitly using Expense type
const columns: GridColDef<Expense>[] = [
  { field: "expenseDate", headerName: "Expense Date", width: 150 },
  { field: "reason", headerName: "Reason", width: 200 },
  { field: "details", headerName: "Details", width: 250 },
  {
    field: "amount",
    headerName: "Amount ($)",
    width: 150,
    type: "number",
  },
];

const ExpenseList = () => {
  const { data: expenses, isError, isLoading } = useGetExpensesQuery();

  // Debugging: log the expenses data to check its structure
  console.log(expenses);

  if (isLoading) {
    return <div className="py-4">Loading expenses...</div>;
  }

  if (isError || !expenses) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
      </div>
    );
  }

  // Ensure expenses is an array and each expense has the required properties
  const formattedExpenses = expenses.map((expense: Expense) => ({
    ...expense,
    amount: expense.amount ?? 0,  // Handle potentially missing properties
  }));

  return (
    <div className="flex flex-col">
      <Header name="Expenses" />
      <DataGrid
        rows={formattedExpenses}
        columns={columns}
        getRowId={(row) => row.expenseDate + row.reason} // Generate a unique ID based on date and reason
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default ExpenseList;
