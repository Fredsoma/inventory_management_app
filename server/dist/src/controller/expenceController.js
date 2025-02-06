"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenses = exports.createExpense = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new expense
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expenseDate, reason, details, amount } = req.body;
        // Parse expenseDate as Date object
        const formattedExpenseDate = new Date(expenseDate);
        if (isNaN(formattedExpenseDate.getTime())) {
            res.status(400).json({ error: "Invalid expenseDate format" });
            return;
        }
        const expense = yield prisma.expense.create({
            data: {
                expenseDate: formattedExpenseDate,
                reason,
                details,
                amount,
            },
        });
        res.status(201).json(expense);
    }
    catch (error) {
        console.error("Error in createExpense:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createExpense = createExpense;
// Get all expenses
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield prisma.expense.findMany();
        res.json(expenses);
    }
    catch (error) {
        console.error("Error retrieving expenses:", error);
        res.status(500).json({ message: "Error retrieving expenses" });
    }
});
exports.getExpenses = getExpenses;
