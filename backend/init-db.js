/**
 * Simple database initialization script
 * This script checks if the database is ready and provides instructions
 */

import prisma from './src/db.js';

async function checkDatabase() {
  console.log('\n===============================================');
  console.log('  MORTECH - Database Connection Test');
  console.log('===============================================\n');

  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('✓ Database connection successful!\n');

    // Try to query products table
    try {
      const count = await prisma.product.count();
      console.log(`✓ Products table exists with ${count} products\n`);
      
      if (count === 0) {
        console.log('⚠️  Database is empty. Run seeding:\n');
        console.log('   node scripts/seedAll.js\n');
      } else {
        console.log('✅ Database is ready!\n');
      }
    } catch (error) {
      console.log('❌ Products table does not exist\n');
      console.log('📋 You need to apply the Prisma schema:\n');
      console.log('   Option 1 (Recommended): Open a new CMD terminal and run:');
      console.log('   cd backend');
      console.log('   npx prisma db push\n');
      console.log('   Option 2: Use Prisma Studio:');
      console.log('   npx prisma studio\n');
    }

  } catch (error) {
    console.log('❌ Cannot connect to database\n');
    console.log('Error:', error.message);
    console.log('\n📋 Make sure PostgreSQL is running:\n');
    console.log('   docker-compose up -d db\n');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
