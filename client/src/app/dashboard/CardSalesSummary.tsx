import { useGetSalesQuery } from "@/state/api"; // Import the sales query
import { TrendingUp, TrendingDown } from "lucide-react"; // Import both icons
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  const { data: salesData, isLoading, isError } = useGetSalesQuery();

  // If sales data is not an array, default to empty
  const sales = Array.isArray(salesData) ? salesData : [];

  const [timeframe, setTimeframe] = useState("weekly");

  // Calculate total value sum for current period divided by 200,000
  const totalValueSum = sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0) || 0;

  // Get today's date and yesterday's date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Calculate today's sales
  const currentDaySales = sales.reduce((acc, curr) => {
    const saleDate = new Date(curr.saleDate);
    if (saleDate.toDateString() === today.toDateString()) {
      return acc + (curr.totalAmount || 0);
    }
    return acc;
  }, 0);

  // Calculate yesterday's sales
  const previousDaySales = sales.reduce((acc, curr) => {
    const saleDate = new Date(curr.saleDate);
    if (saleDate.toDateString() === yesterday.toDateString()) {
      return acc + (curr.totalAmount || 0);
    }
    return acc;
  }, 0);

  // Calculate the sales change percentage
  const totalSalesChangePercentage = previousDaySales > 0 
    ? ((currentDaySales - previousDaySales) / previousDaySales) * 100 
    : 0;

  // Average change percentage from discounts
  const averageChangePercentage = sales.length > 0
    ? sales.reduce((acc, curr) => acc + (curr.discount ? (curr.discount / curr.unitPrice) * 100 : 0), 0) / sales.length
    : 0;

  // Find the highest sale value and its date
  const highestValueData = sales.reduce((acc, curr) => {
    return acc.totalAmount > curr.totalAmount ? acc : curr;
  }, sales[0] || {});

  const highestValueDate = highestValueData.saleDate
    ? new Date(highestValueData.saleDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  // Prepare sales data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i); // Create an array of last 7 days
    return {
      date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      totalAmount: 0,
    };
  }).reverse(); // Reverse to have the latest date first

  // Aggregate sales amounts by day
  sales.forEach((sale) => {
    const saleDate = new Date(sale.saleDate).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    const dayData = last7Days.find((day) => day.date === saleDate);
    if (dayData) {
      dayData.totalAmount += sale.totalAmount || 0; // Sum the total amount for the day
    }
  });

  const salesChartData = last7Days.map((day) => ({
    date: day.date,
    totalAmount: day.totalAmount,
  }));

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between overflow-y-auto max-h-[85vh]">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <div className="flex justify-between items-center px-7 pt-5">
              <h2 className="text-lg font-semibold mb-2">
                Sales Summary
              </h2>
              <p className="text-xs text-gray-400">
                m = 200,000
              </p>
            </div>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Value</p>
                <span className="text-2xl font-extrabold">
                  $ {(totalValueSum / 200000).toLocaleString("en", {
                    maximumFractionDigits: 2,
                  })} m
                </span>
                <span className={`text-sm ml-2 ${totalSalesChangePercentage < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {totalSalesChangePercentage < 0 ? (
                    <TrendingDown className="inline w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                  )}
                  {totalSalesChangePercentage.toFixed(2)}% {/* Display the sales change percentage */}
                </span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={250} className="px-7">
              <BarChart
                data={salesChartData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="date" // Update to use formatted date
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    return `$${(value / 8000).toFixed(0)}m`; // Format Y-axis ticks
                  }}
                  tick={{ fontSize: 10, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString("en")}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalAmount" // Use totalAmount from sales
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{sales.length || 0} sales</p>
              <p className="text-sm">
                Highest Sales Date:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
