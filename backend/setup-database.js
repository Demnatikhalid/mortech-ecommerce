/**
 * Database setup script
 * Runs Prisma migrations and seeds the database
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('===============================================');
console.log('  MORTECH - Database Setup Script');
console.log('===============================================\n');

try {
  // Step 1: Push Prisma schema
  console.log('[1/3] Pushing Prisma schema to database...');
  execSync('npx prisma db push --skip-generate', { 
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  console.log('✓ Schema pushed successfully\n');

  // Step 2: Generate Prisma Client
  console.log('[2/3] Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  console.log('✓ Prisma Client generated\n');

  // Step 3: Seed database
  console.log('[3/3] Seeding database with initial data...');
  execSync('node scripts/seedAll.js', { 
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  console.log('✓ Database seeded successfully\n');

  console.log('===============================================');
  console.log('  ✅ Database setup completed!');
  console.log('===============================================\n');
  console.log('You can now start the backend server with:');
  console.log('  npm run dev\n');

} catch (error) {
  console.error('\n❌ Error during database setup:', error.message);
  process.exit(1);
}
