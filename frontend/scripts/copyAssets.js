import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src/assets/products');
const destDir = path.resolve('public/assets/products');

async function ensureDir(dir) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error('Error creating dir', dir, err);
    process.exit(1);
  }
}

async function copyFiles() {
  await ensureDir(destDir);
  const files = await fs.promises.readdir(srcDir);
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    try {
      await fs.promises.copyFile(src, dest);
      console.log('Copied', file);
    } catch (err) {
      console.error('Failed to copy', file, err.message || err);
    }
  }
  console.log('Copy complete:', files.length, 'files');
}

copyFiles().catch((e) => {
  console.error(e);
  process.exit(1);
});
