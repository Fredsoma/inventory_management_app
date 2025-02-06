"use client"

import { useCreateSaleMutation, useUpdateProductMutation } from "@/state/api";
import React, { useState } from "react";
import { useGetProductsQuery } from "@/state/api";
import { v4 } from "uuid";

interface Sale {
  saleId: string;
  paymentType: string;
  saleDate: string;
  saleTime: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

const Sales: React.FC = () => {
  const [sale, setSale] = useState<Partial<Sale>>({
    saleId: v4(),
    paymentType: "",
    saleDate: "",
    saleTime: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    total: 0,
  });

  const [createSale] = useCreateSaleMutation();
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery(); // Get refetch method
  const [finalTotal, setFinalTotal] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedSale = {
      ...sale,
      [name]: name === "quantity" || name === "unitPrice" || name === "discount" ? parseFloat(value) : value,
    };

    // Set the unit price based on selected product
    if (name === "productName") {
      const selectedProduct = products?.find(product => product.name === value);
      updatedSale.unitPrice = selectedProduct ? selectedProduct.price : 0; // Set unit price from selected product
      updatedSale.quantity = 1; // Reset quantity if product changes
    }

    setSale(updatedSale);

    // Calculate and set the total
    const subtotal = (updatedSale.quantity || 0) * (updatedSale.unitPrice || 0);
    const discountAmount = (subtotal * (updatedSale.discount || 0)) / 100;
    const total = subtotal - discountAmount;
    setFinalTotal(total);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sale.paymentType || !sale.saleDate || !sale.saleTime || !sale.productName || !sale.quantity || !sale.unitPrice) {
      console.error("All fields are required.");
      return;
    }

    const saleDetails = {
      paymentType: sale.paymentType,
      saleDate: sale.saleDate,
      saleTime: sale.saleTime,
      productName: sale.productName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      discount: sale.discount || 0,
      totalAmount: finalTotal,
    };

    try {
      // Call createSale mutation
      const result = await createSale(saleDetails).unwrap();
      console.log("Sale created:", result);

      // Trigger a refetch for the inventory data to ensure it reflects updated stock
      await refetch();

      // Reset the sale state to its initial values
      setSale({
        saleId: v4(),
        paymentType: "",
        saleDate: "",
        saleTime: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      });
      setFinalTotal(0);

    } catch (error) {
      console.error("Failed to save the sale:", error);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading products...</div>;
  }

  if (isError || !products) {
    return <div className="text-center text-red-500 py-4">Failed to load products</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">New Sale Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 text-gray-600">Payment Type</label>
            <select
              name="paymentType"
              value={sale.paymentType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            >
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Momo">Momo</option>
              <option value="OM">OM</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Sale Date</label>
            <input
              type="date"
              name="saleDate"
              value={sale.saleDate || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Sale Time</label>
            <input
              type="time"
              name="saleTime"
              value={sale.saleTime || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 text-gray-600">Product Name</label>
            <select
              name="productName"
              value={sale.productName || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.productId} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={sale.quantity || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Unit Price ($)</label>
            <input
              type="number"
              name="unitPrice"
              min="0"
              value={sale.unitPrice || ""}
              readOnly // Make it read-only since it’s populated automatically
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Discount (%)</label>
            <input
              type="number"
              name="discount"
              min="0"
              max="100"
              value={sale.discount || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
            />
          </div>
        </div>

        {/* Total and Submit */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-lg font-semibold text-gray-700">
            Total Bill: <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
          </p>
          <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sales;
