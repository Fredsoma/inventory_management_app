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
exports.getSales = exports.createSale = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentType, saleDate, saleTime, productName, quantity, unitPrice, discount } = req.body;
        // Validate quantity
        if (quantity <= 0) {
            res.status(400).json({ error: 'Quantity must be greater than zero' });
            return;
        }
        const formattedSaleTime = new Date(`${saleDate}T${saleTime}:00Z`);
        if (isNaN(formattedSaleTime.getTime())) {
            res.status(400).json({ error: "Invalid saleTime format" });
            return;
        }
        const product = yield prisma.products.findFirst({
            where: { name: productName },
        });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        if (product.stockQuantity < quantity) {
            res.status(400).json({ error: 'Insufficient stock available' });
            return;
        }
        const subtotal = quantity * unitPrice;
        const discountAmount = (subtotal * (discount || 0)) / 100;
        const total = subtotal - discountAmount;
        const sale = yield prisma.sale.create({
            data: {
                paymentType,
                saleDate: new Date(saleDate),
                saleTime: formattedSaleTime,
                productId: product.productId,
                quantity,
                unitPrice,
                discount,
                totalAmount: total,
            },
        });
        yield prisma.products.update({
            where: { productId: product.productId },
            data: { stockQuantity: product.stockQuantity - quantity },
        });
        // Send the updated stock quantity to inventory if necessary
        // You can call another API endpoint here if required
        // Example: await axios.post('inventory/update', { productId: product.productId, newStock: product.stockQuantity - quantity });
        console.log(`Stock quantity for ${product.productId} updated to ${product.stockQuantity - quantity}`);
        res.status(201).json(sale);
    }
    catch (error) {
        console.error("Error in createSale:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
});
exports.createSale = createSale;
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield prisma.sale.findMany({
            include: {
                product: true, // Optionally include related product info
            },
        });
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving sales" });
    }
});
exports.getSales = getSales;
