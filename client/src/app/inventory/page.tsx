"use client";

import React, { useEffect, useState } from "react";
import { useGetProductsQuery, useDeleteProductMutation } from "@/state/api"; // Removed useUpdateProductMutation
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid"; // Removed GridCellEditStopParams
import { Trash2 } from "lucide-react";
import IconButton from "@mui/material/IconButton";

// Define the Product type
type Product = {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
};

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation(); // Keep only deleteProduct mutation
  const [productsList, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products) {
      setProducts(products);
    }
  }, [products]);

  const handleDelete = async (productId: string) => {
    const previousProducts = [...productsList];
    try {
      // Optimistically update the local state
      setProducts(productsList.filter((product) => product.productId !== productId));
      await deleteProduct(productId).unwrap();
    } catch {
      // Revert if there's an error
      setProducts(previousProducts);
    }
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      valueGetter: (value, row) => `$${row.price}`,
    },
    { field: "rating", headerName: "Rating", width: 110 },
    { field: "stockQuantity", headerName: "Stock Quantity", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton aria-label="delete" onClick={() => handleDelete(params.row.productId)} color="secondary">
            <Trash2 size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return <div className="text-center text-red-500 py-4">Failed to fetch products</div>;
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        rows={productsList}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;
