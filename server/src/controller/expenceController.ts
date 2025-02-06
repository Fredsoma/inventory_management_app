import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new expense
export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expenseDate, reason, details, amount } = req.body;

    // Parse expenseDate as Date object
    const formattedExpenseDate = new Date(expenseDate);
    if (isNaN(formattedExpenseDate.getTime())) {
      res.status(400).json({ error: "Invalid expenseDate format" });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        expenseDate: formattedExpenseDate,
        reason,
        details,
        amount,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error in createExpense:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all expenses
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};
