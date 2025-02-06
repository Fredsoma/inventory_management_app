/*
  Warnings:

  - You are about to drop the column `discount` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the column `saleDate` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the column `saleTime` on the `Sales` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "discount",
DROP COLUMN "paymentType",
DROP COLUMN "saleDate",
DROP COLUMN "saleTime",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Sale" (
    "saleId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "saleTime" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("saleId")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
