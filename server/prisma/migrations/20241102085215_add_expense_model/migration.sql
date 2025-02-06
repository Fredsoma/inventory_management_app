-- CreateTable
CREATE TABLE "Expense" (
    "expenseId" TEXT NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenseId")
);
