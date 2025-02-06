// routes/salesRoutes.ts
import { Router } from "express";
import { createSale, getSales } from "../controller/salesController";


const router = Router();

// Define your sales routes
router.get("/", getSales); // To retrieve all sales
router.post("/", createSale); // To create a new sale

export default router;
