import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.deleteMany();
  console.log(`Deleted ${result.count} user(s) from the User table.`);
}

main()
  .catch((error) => {
    console.error('Error deleting users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
