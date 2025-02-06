import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wipeDatabase() {
  try {
    // Delete all data from each table
    
   
    await prisma.expense.deleteMany();
    // Repeat for other tables as necessary
    
    console.log("All data wiped successfully.");
  } catch (error) {
    console.error("Error wiping data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

wipeDatabase();
