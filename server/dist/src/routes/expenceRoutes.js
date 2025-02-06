"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenceController_1 = require("../controller/expenceController");
const router = (0, express_1.Router)();
// Define your expense routes
router.get("/", expenceController_1.getExpenses); // Retrieve all expenses
router.post("/", expenceController_1.createExpense); // Create a new expense
exports.default = router;
