"use client"; // Ensure this component is recognized as a client component

import React, { useEffect, useState } from "react";
import { CheckCircle, Package, Tag, TrendingDown, TrendingUp } from "lucide-react";
import { useGetSalesQuery, useGetExpensesQuery } from "@/state/api"; // Adjust according to your API hooks
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  // Fetch all sales and expenses initially
  const { data: expenses = [], isLoading: loadingExpenses, isError: errorExpenses } = useGetExpensesQuery();
  const { data: sales = [], isLoading: loadingSales, isError: errorSales } = useGetSalesQuery();

  // Once both sales and expenses have been fetched, calculate date range
  useEffect(() => {
    if (sales.length > 0 || expenses.length > 0) {
      const allDates = [
        ...sales.map(sale => new Date(sale.saleDate).getTime()),
        ...expenses.map(expense => new Date(expense.expenseDate).getTime()),
      ];

      // Calculate the earliest and latest dates
      const startDate = new Date(Math.min(...allDates)).toISOString().split('T')[0];
      const endDate = new Date(Math.max(...allDates)).toISOString().split('T')[0];

      // Update the state with the new date range
      setDateRange({ startDate, endDate });
    }
  }, [sales, expenses]);

  // Filter sales and expenses based on the computed date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate);
    return saleDate >= new Date(dateRange.startDate) && saleDate <= new Date(dateRange.endDate);
  });

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.expenseDate);
    return expenseDate >= new Date(dateRange.startDate) && expenseDate <= new Date(dateRange.endDate);
  });

  // Handle loading and error states
  if (loadingExpenses || loadingSales) {
    return <div>Loading...</div>;
  }

  if (errorExpenses || errorSales) {
    return <div className="text-red-500">Failed to fetch data</div>;
  }

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const formattedTotalExpenses = totalExpenses.toFixed(2);
  
  // Calculate total sales and total discounts
  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const formattedTotalSales = totalSales.toFixed(2);

  // Calculate total discounts from sales
  const totalDiscounts = filteredSales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
  const formattedTotalDiscounts = totalDiscounts.toFixed(2);

  // Calculate percentage changes and ensure they are numbers
  const expenseChangePercentage = totalExpenses > 0 ? 
    parseFloat(((totalExpenses / (totalExpenses + 10)) * 100 - 100).toFixed(0)) : 0; // Example logic
  const salesChangePercentage = totalSales > 0 ? 
    parseFloat(((totalSales / (totalSales + 100)) * 100 - 100).toFixed(0)) : 0; // Example logic

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      
      <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange={`${dateRange.startDate} - ${dateRange.endDate}`} // Use dynamic date range
        details={[
          {
            title: "Customer Growth",
            amount: "175.00", // Placeholder; replace with actual growth calculation if available
            changePercentage: 131, // Replace with actual calculation
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: `$${formattedTotalExpenses}`,
            changePercentage: expenseChangePercentage,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange={`${dateRange.startDate} - ${dateRange.endDate}`} // Use dynamic date range
        details={[
          {
            title: "Dues",
            amount: "250.00", // Example; replace with actual due calculation
            changePercentage: 131, // Replace with actual calculation
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147", // Example; replace with actual pending orders count
            changePercentage: -56, // Replace with actual calculation
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange={`${dateRange.startDate} - ${dateRange.endDate}`} // Use dynamic date range
        details={[
          {
            title: "Sales",
            amount: `$${formattedTotalSales}`,
            changePercentage: salesChangePercentage,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: `$${formattedTotalDiscounts}`, // Use the calculated total discounts
            changePercentage: -10, // Replace with actual calculation if needed
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
