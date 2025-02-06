import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs"; // Import fs for file system operations

import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import salesRoutes from "./routes/salesRoutes";
import expenceRoutes from "./routes/expenceRoutes";

/* Load environment variables */
dotenv.config();

/* Create Express app */
const app = express();

/* Ensure uploads directory exists */
const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

/* Middleware */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* Static File Serving */
app.use("/uploads", express.static(uploadsPath));

/* Routes */
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes);    // http://localhost:8000/products
app.use("/users", userRoutes);          // http://localhost:8000/users
app.use("/expenses", expenseRoutes);    // http://localhost:8000/expenses 
app.use("/sales", salesRoutes);         // http://localhost:8000/sales
app.use("/expense", expenceRoutes);     // http://localhost:8000/expense

/* Start Server */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
