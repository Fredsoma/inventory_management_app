"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const asyncHandler_1 = require("../utils/asyncHandler"); // Import the async handler
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.asyncHandler)(authController_1.registerUser)); // Wrap with asyncHandler
router.post("/login", (0, asyncHandler_1.asyncHandler)(authController_1.loginUser));
exports.default = router;
