import { prisma, pool } from './prisma';

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
    await pool.end();
  }
}

main();
