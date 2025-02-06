/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "timestamp",
ADD COLUMN     "discount" DOUBLE PRECISION,
ALTER COLUMN "paymentType" SET DATA TYPE TEXT,
ALTER COLUMN "saleDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "saleTime" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "Sale";
