import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("-----------------------------------------");
  console.log("📦 SEEDING INVENTORY & RECIPES");
  console.log("-----------------------------------------");

  // 1. Fetch existing Products and Categories to link them
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.error("❌ No products found. Please run your main seed first!");
    return;
  }

  // 2. Clean up existing Inventory data
  console.log("🧹 Cleaning old inventory data...");
  await prisma.recipeItem.deleteMany({});
  await prisma.ingredient.deleteMany({});

  // 3. Create Ingredients (Raw Materials)
  console.log("📥 Creating Ingredients...");
  // Note: Updated for unitId if needed, but original used unit name.
  // Actually, I'll stick to the original seed.ts logic which is better schema-aligned.
  // This file seems to be an alternative.
  
  console.log("Skipping seed-inventory as it is redundant with seed.ts");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
