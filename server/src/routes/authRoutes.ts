// src/routes/authRoutes.ts
import { Router } from "express";
import { registerUser, loginUser } from "../controller/authController";
import { asyncHandler } from "../utils/asyncHandler"; // Import the async handler

const router = Router();

router.post("/register", asyncHandler(registerUser)); // Wrap with asyncHandler
router.post("/login", asyncHandler(loginUser));

export default router;
