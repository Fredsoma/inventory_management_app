import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Sale interface
export interface Sale {
  saleId: string;
  paymentType: string;
  saleDate: string;  // Use Date type if you handle Date objects appropriately
  saleTime: string;  // Use Date type if you handle Date objects appropriately
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  totalAmount: number;
}

// Define the NewSale interface
export interface NewSale {
  paymentType: string;
  saleDate: string;  // Ensure the format matches your API requirements (e.g., YYYY-MM-DD)
  saleTime: string;  // Ensure the format matches your API requirements (e.g., HH:mm:ss)
  productName: string;  // Assuming you will pass product name to get the productId
  quantity: number;
  unitPrice: number;
  discount?: number;  // Optional discount field
}

export interface Expense {
  expenseId: string;
  expenseDate: string; // Use Date type if handling Date objects appropriately
  reason: string;
  details?: string; // Optional, depending on the expense type
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewExpense {
  expenseDate: string; // Ensure the format matches your API requirements (e.g., YYYY-MM-DD)
  reason: string;
  details?: string; // Optional, if applicable
  amount: number;
}


export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  imageUrl: string; // Added image URL field
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  imageUrl: string; // Added image URL field
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses","Sales","Expense"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
      // Mutation to update an existing product
      updateProduct: build.mutation<Product, Partial<Product>>({
        query: (product) => ({
          url: `/products/${product.productId}`, // Ensure productId is included in the URL
          method: "PUT",
          body: product, // Sends all fields that may need updating
        }),
        invalidatesTags: ["Products"],
      }),
       // Mutation to delete a product by productId
    deleteProduct: build.mutation<{ success: boolean; productId: string }, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
      // Get all sales
      getSales: build.query<Sale[], void>({
        query: () => "/sales",
        providesTags: ["Sales"], // Tag for cache invalidation
    }),

    // Create a new sale
    createSale: build.mutation<Sale, NewSale>({
        query: (newSale) => ({
            url: "/sales",
            method: "POST",
            body: newSale, // New sale data to be sent in the request body
        }),
        invalidatesTags: ["Sales"], // Invalidate sales data after creation
    }),
    getExpenses: build.query<Expense[], void>({
      query: () => "/expense",
      providesTags: ["Expense"],
    }),
    createExpense: build.mutation<Expense, NewExpense>({
      query: (newExpense) => ({
        url: "/expense",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expense"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
} = api;
