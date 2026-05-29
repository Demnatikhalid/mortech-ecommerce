import prisma from '../src/db.js';
import { seedProducts } from '../src/seedData.js';

async function main() {
  console.log('Seeding products:', seedProducts.length);
  let created = 0;
  for (const p of seedProducts) {
    try {
      const exists = await prisma.product.findFirst({ where: { name: p.name } });
      if (!exists) {
        await prisma.product.create({ data: p });
        console.log('Created:', p.name);
        created++;
      } else {
        console.log('Exists:', p.name);
      }
    } catch (err) {
      console.error('Error creating', p.name, err.message || err);
    }
  }
  console.log(`Seeding complete. ${created} products created.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
