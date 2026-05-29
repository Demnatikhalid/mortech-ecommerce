import prisma from '../src/db.js';
import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve('../frontend/src/assets/products');
const publicPrefix = '/assets/products/';

function normalize(s) {
  return (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function main() {
  const files = await fs.promises.readdir(assetsDir);
  const fileMap = files.map((f) => ({
    name: f,
    base: path.parse(f).name,
    norm: normalize(path.parse(f).name),
  }));

  const products = await prisma.product.findMany();
  let updated = 0;

  for (const p of products) {
    const pnorm = normalize(p.name);
    // Skip if already absolute http or already points to /assets/
    if (!p.imageUrl || p.imageUrl.includes('placeholder') || p.imageUrl.startsWith('http')) {
      // try to find best match
      const match = fileMap.find((f) => pnorm.includes(f.norm) || f.norm.includes(pnorm));
      if (match) {
        try {
          await prisma.product.update({ where: { id: p.id }, data: { imageUrl: publicPrefix + match.name } });
          console.log(`Updated product ${p.id} -> ${match.name}`);
          updated++;
        } catch (err) {
          console.error('DB update error for', p.id, err.message || err);
        }
      } else {
        // try partial token matching
        for (const f of fileMap) {
          if (pnorm.includes(f.norm.slice(0, 6)) || f.norm.includes(pnorm.slice(0,6))) {
            try {
              await prisma.product.update({ where: { id: p.id }, data: { imageUrl: publicPrefix + f.name } });
              console.log(`Fuzzy updated product ${p.id} -> ${f.name}`);
              updated++;
              break;
            } catch (err) {
              console.error('DB update error fuzzy for', p.id, err.message || err);
            }
          }
        }
      }
    }
  }

  console.log('Update complete. Total updated:', updated);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
