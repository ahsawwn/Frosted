// src/lib/test-db.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Setup the connection pool using the standard 'pg' library
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Testing Prisma 7 connection...");
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Success! User count: ${userCount}`);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Don't forget to close the pool!
  }
}

main();