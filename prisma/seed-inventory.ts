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
  const ingredients = [
    { name: "Whole Milk", unit: "Liters", stock: 50.0, lowStockThreshold: 10.0 },
    { name: "Heavy Cream", unit: "Liters", stock: 20.0, lowStockThreshold: 5.0 },
    { name: "Granulated Sugar", unit: "Grams", stock: 10000.0, lowStockThreshold: 2000.0 },
    { name: "Vanilla Extract", unit: "ml", stock: 500.0, lowStockThreshold: 50.0 },
    { name: "Cocoa Powder", unit: "Grams", stock: 3000.0, lowStockThreshold: 500.0 },
    { name: "Lotus Biscoff Spread", unit: "Grams", stock: 5000.0, lowStockThreshold: 1000.0 },
  ];

  const createdIngredients: Record<string, string> = {};

  for (const item of ingredients) {
    const ing = await prisma.ingredient.create({ data: item });
    createdIngredients[item.name] = ing.id;
  }

  // 4. Create Recipes (Linking Products to Ingredients)
  console.log("🔗 Linking Recipes to Products...");

  // Let's find specific products by name from your previous seed
  const vanillaScoop = products.find(p => p.name.includes("Vanilla"));
  const chocolateScoop = products.find(p => p.name.includes("Chocolate"));
  const biscoffWaffle = products.find(p => p.name.includes("Biscoff"));

  const recipeData = [];

  if (vanillaScoop) {
    recipeData.push(
      { productId: vanillaScoop.id, ingredientId: createdIngredients["Whole Milk"], quantity: 0.1 },
      { productId: vanillaScoop.id, ingredientId: createdIngredients["Heavy Cream"], quantity: 0.05 },
      { productId: vanillaScoop.id, ingredientId: createdIngredients["Vanilla Extract"], quantity: 2.0 }
    );
  }

  if (chocolateScoop) {
    recipeData.push(
      { productId: chocolateScoop.id, ingredientId: createdIngredients["Whole Milk"], quantity: 0.1 },
      { productId: chocolateScoop.id, ingredientId: createdIngredients["Cocoa Powder"], quantity: 15.0 }
    );
  }

  if (biscoffWaffle) {
    recipeData.push(
      { productId: biscoffWaffle.id, ingredientId: createdIngredients["Lotus Biscoff Spread"], quantity: 30.0 }
    );
  }

  if (recipeData.length > 0) {
    await prisma.recipeItem.createMany({ data: recipeData });
    console.log(`✅ Created ${recipeData.length} recipe links.`);
  }

  console.log("-----------------------------------------");
  console.log("🚀 INVENTORY SEEDING COMPLETE");
  console.log("-----------------------------------------");
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