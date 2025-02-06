"use client";

import { useGetSalesQuery } from "@/state/api"; // Ensure this points to the correct API hook
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Sale } from "@/state/api"; // Import your Sale type

// Define the columns for the DataGrid, explicitly using Sale type
const columns: GridColDef<Sale>[] = [
  { field: "saleId", headerName: "Sale ID", width: 150 },
  { field: "paymentType", headerName: "Payment Type", width: 150 },
  { field: "saleDate", headerName: "Sale Date", width: 150 },
  { field: "saleTime", headerName: "Sale Time", width: 150 },
  { field: "productId", headerName: "Product ID", width: 150 },
  { field: "quantity", headerName: "Quantity", width: 150 },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    width: 150,
    type: "number",
  },
  { field: "discount", headerName: "Discount", width: 150, type: "number" },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 150,
    type: "number",
   
  },
];

const Sales = () => {
  const { data: sales, isError, isLoading } = useGetSalesQuery();

  // Debugging: log the sales data to check its structure
  console.log(sales);

  if (isLoading) {
    return <div className="py-4">Loading sales...</div>;
  }

  if (isError || !sales) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch sales
      </div>
    );
  }

  // Ensure sales is an array and each sale has the required properties
  const formattedSales = sales.map((sale: Sale) => ({
    ...sale,
    unitPrice: sale.unitPrice ?? 0,  // Handle potentially missing properties
    totalAmount: sale.totalAmount ?? 0,
  }));

  return (
    <div className="flex flex-col">
      <Header name="Sales" />
      <DataGrid
        rows={formattedSales}
        columns={columns}
        getRowId={(row) => row.saleId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Sales;
