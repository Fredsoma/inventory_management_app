import { Router } from "express";
import { createExpense, getExpenses } from "../controller/expenceController";

const router = Router();

// Define your expense routes
router.get("/", getExpenses); // Retrieve all expenses
router.post("/", createExpense); // Create a new expense

export default router;
