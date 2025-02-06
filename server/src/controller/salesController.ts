import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSale = async (req: Request, res: Response): Promise<void> => {
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

    const product = await prisma.products.findFirst({
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

    const sale = await prisma.sale.create({
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

    await prisma.products.update({
      where: { productId: product.productId },
      data: { stockQuantity: product.stockQuantity - quantity },
    });

    // Send the updated stock quantity to inventory if necessary
    // You can call another API endpoint here if required
    // Example: await axios.post('inventory/update', { productId: product.productId, newStock: product.stockQuantity - quantity });

    console.log(`Stock quantity for ${product.productId} updated to ${product.stockQuantity - quantity}`);

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error in createSale:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};



export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: true, // Optionally include related product info
      },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales" });
  }
};
