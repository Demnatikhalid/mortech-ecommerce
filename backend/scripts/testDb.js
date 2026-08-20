import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const products = await prisma.product.findMany({ take: 1 });
  console.log('DB OK - Connection réussie. Produits en DB:', products.length > 0 ? 'oui' : '0 (table vide)');
} catch (e) {
  console.error('DB ERREUR:', e.message);
} finally {
  await prisma.$disconnect();
}
