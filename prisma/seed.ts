import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("-----------------------------------------");
  console.log("🌱 STARTING DATABASE SEED");
  console.log("-----------------------------------------");

  // 1. CLEAN UP (Reverse order of relations)
  console.log("🧹 Cleaning existing data...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.recipeItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.session.deleteMany({});
  // Keeping User and StoreSettings for upsert

  // 2. SEED ADMIN USER
  console.log("👤 Seeding SuperAdmin...");
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: hashedPassword },
    create: {
      username: "admin",
      name: "Ahsan Shahid",
      email: "admin@oftsy.com",
      password: hashedPassword,
      role: "SUPERADMIN",
      needsPasswordChange: false,
    },
  });

  // 3. SEED STORE SETTINGS
  console.log("⚙️  Seeding Store Settings...");
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Oftsy Ice Cream & Desserts",
      themeColor: "#2563eb",
      currency: "PKR",
      isTaxEnabled: true,
    },
  });

  // 4. SEED INGREDIENTS (Warehouse)
  console.log("📦 Seeding Ingredients...");
  const ingData = [
    { name: "Premium Ice Cream Base", unit: "Liters", stock: 150, lowStockThreshold: 15 },
    { name: "Belgian Cocoa Powder", unit: "Grams", stock: 5000, lowStockThreshold: 1000 },
    { name: "Lotus Biscoff Spread", unit: "Grams", stock: 2000, lowStockThreshold: 500 },
    { name: "Waffle Batter Mix", unit: "Grams", stock: 10000, lowStockThreshold: 2000 },
    { name: "Fresh Milk", unit: "Liters", stock: 40, lowStockThreshold: 10 },
  ];

  const ingredientMap: Record<string, any> = {};
  for (const item of ingData) {
    const ing = await prisma.ingredient.create({ data: item });
    ingredientMap[item.name] = ing;
  }

  // 5. SEED CATEGORIES
  console.log("📂 Seeding Categories...");
  const categories: Record<string, any> = {};
  const catNames = ["Scoops", "Waffles", "Shakes", "Sundae"];

  for (const name of catNames) {
    const cat = await prisma.category.create({ data: { name } });
    categories[name] = cat;
  }

  // 6. SEED PRODUCTS & LINK RECIPES
  console.log("🛒 Seeding Products and Recipes...");

  // Product: Midnight Chocolate Scoop
  const chocoScoop = await prisma.product.create({
    data: {
      name: "Midnight Chocolate",
      price: 300,
      categoryId: categories["Scoops"].id,
      imageUrl: "https://images.unsplash.com/photo-1563805039227-9362e891d8ef",
      description: "Rich dark chocolate ice cream made with Belgian cocoa."
    }
  });

  await prisma.recipeItem.createMany({
    data: [
      { productId: chocoScoop.id, ingredientId: ingredientMap["Premium Ice Cream Base"].id, quantity: 0.15 },
      { productId: chocoScoop.id, ingredientId: ingredientMap["Belgian Cocoa Powder"].id, quantity: 20 },
    ]
  });

  // Product: Biscoff Waffle
  const biscoffWaffle = await prisma.product.create({
    data: {
      name: "Belgian Biscoff Waffle",
      price: 550,
      categoryId: categories["Waffles"].id,
      imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f238d",
      description: "Crispy waffle topped with melted Lotus spread."
    }
  });

  await prisma.recipeItem.createMany({
    data: [
      { productId: biscoffWaffle.id, ingredientId: ingredientMap["Waffle Batter Mix"].id, quantity: 150 },
      { productId: biscoffWaffle.id, ingredientId: ingredientMap["Lotus Biscoff Spread"].id, quantity: 40 },
    ]
  });

  // Product: Lotus Biscoff Shake
  const lotusShake = await prisma.product.create({
    data: {
      name: "Lotus Biscoff Shake",
      price: 650,
      categoryId: categories["Shakes"].id,
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
      description: "Creamy milkshake blended with Biscoff cookies and spread."
    }
  });

  await prisma.recipeItem.createMany({
    data: [
      { productId: lotusShake.id, ingredientId: ingredientMap["Fresh Milk"].id, quantity: 0.25 },
      { productId: lotusShake.id, ingredientId: ingredientMap["Premium Ice Cream Base"].id, quantity: 0.1 },
      { productId: lotusShake.id, ingredientId: ingredientMap["Lotus Biscoff Spread"].id, quantity: 30 },
    ]
  });

  console.log("-----------------------------------------");
  console.log("✅ SEEDING COMPLETED SUCCESSFULLY");
  console.log("-----------------------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Seeding Failed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });