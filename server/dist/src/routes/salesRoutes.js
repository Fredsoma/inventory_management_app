"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/salesRoutes.ts
const express_1 = require("express");
const salesController_1 = require("../controller/salesController");
const router = (0, express_1.Router)();
// Define your sales routes
router.get("/", salesController_1.getSales); // To retrieve all sales
router.post("/", salesController_1.createSale); // To create a new sale
exports.default = router;
