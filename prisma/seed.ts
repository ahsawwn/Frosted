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
  console.log("🌱 STARTING DATABASE SEED (OFTY SYSTEMS)");
  console.log("-----------------------------------------");

  // 1. CLEAN UP (Reverse order of relations)
  console.log("🧹 Cleaning existing data...");
  await prisma.recipeItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.session.deleteMany({});

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
  console.log("⚙️ Seeding Store Settings...");
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

  // 4. SEED UNITS (Required for Ingredients and Recipes)
  console.log("📏 Seeding Units...");
  const unitData = [
    { name: "Kilogram", short: "kg" },
    { name: "Gram", short: "gm" },
    { name: "Liter", short: "ltr" },
    { name: "Milliliter", short: "ml" },
    { name: "Piece", short: "pc" },
  ];

  const unitMap: Record<string, string> = {};
  for (const u of unitData) {
    const unit = await prisma.unit.create({ data: u });
    unitMap[u.short] = unit.id; // Map "ltr" -> UUID
  }

  // 5. SEED CUSTOMERS
  console.log("👥 Seeding Premium Customers...");
  const customerData = [
    { name: "Ahsan Shahid", phone: "03001234567", email: "ahsan@example.com", loyaltyPoints: 500 },
    { name: "John Doe", phone: "03117654321", email: "john@example.com", loyaltyPoints: 50 },
  ];
  for (const c of customerData) {
    await prisma.customer.create({ data: c });
  }

  // 6. SEED COUPONS
  console.log("🎟️ Seeding Coupons...");
  const couponData = [
    { 
      code: "WELCOME10", 
      discountType: "PERCENTAGE", 
      discountValue: 10, 
      minOrderAmount: 500, 
      expiryDate: new Date("2027-01-01"),
      isActive: true 
    },
    { 
      code: "OFTYOFF50", 
      discountType: "FIXED", 
      discountValue: 50, 
      minOrderAmount: 200, 
      expiryDate: new Date("2027-01-01"),
      isActive: true 
    },
  ];
  for (const coup of couponData) {
    await prisma.coupon.create({ data: coup });
  }

  // 7. SEED INGREDIENTS (Using Unit IDs)
  console.log("📦 Seeding Ingredients...");
  const ingData = [
    { name: "Premium Ice Cream Base", unitShort: "ltr", stock: 150, lowStockThreshold: 15 },
    { name: "Belgian Cocoa Powder", unitShort: "gm", stock: 5000, lowStockThreshold: 1000 },
    { name: "Lotus Biscoff Spread", unitShort: "gm", stock: 2000, lowStockThreshold: 500 },
    { name: "Waffle Batter Mix", unitShort: "gm", stock: 10000, lowStockThreshold: 2000 },
    { name: "Fresh Milk", unitShort: "ltr", stock: 40, lowStockThreshold: 10 },
  ];

  const ingredientMap: Record<string, any> = {};
  for (const item of ingData) {
    const ing = await prisma.ingredient.create({ 
      data: {
        name: item.name,
        stock: item.stock,
        lowStockThreshold: item.lowStockThreshold,
        unitId: unitMap[item.unitShort] // Link the Unit UUID
      } 
    });
    ingredientMap[item.name] = ing;
  }

  // 8. SEED CATEGORIES
  console.log("📂 Seeding Categories...");
  const categories: Record<string, any> = {};
  const catNames = ["Scoops", "Waffles", "Shakes", "Sundae"];
  for (const name of catNames) {
    const cat = await prisma.category.create({ data: { name } });
    categories[name] = cat;
  }

  // 9. SEED PRODUCTS & RECIPES
  console.log("🛒 Seeding Products and Recipes...");
  const products = [
    {
      name: "Midnight Chocolate",
      price: 300,
      cat: "Scoops",
      img: "https://images.unsplash.com/photo-1563805039227-9362e891d8ef",
      recipe: [
        { name: "Premium Ice Cream Base", qty: 0.15, unit: "ltr" },
        { name: "Belgian Cocoa Powder", qty: 20, unit: "gm" },
      ]
    },
    {
      name: "Belgian Biscoff Waffle",
      price: 550,
      cat: "Waffles",
      img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d",
      recipe: [
        { name: "Waffle Batter Mix", qty: 150, unit: "gm" },
        { name: "Lotus Biscoff Spread", qty: 40, unit: "gm" },
      ]
    }
  ];

  for (const p of products) {
    const prod = await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        categoryId: categories[p.cat].id,
        imageUrl: p.img,
        description: `Premium ${p.name} from Oftsy.`
      }
    });

    // Create Recipe Items with specific Unit IDs
    for (const r of p.recipe) {
        await prisma.recipeItem.create({
            data: {
                productId: prod.id,
                ingredientId: ingredientMap[r.name].id,
                quantity: r.qty,
                unitId: unitMap[r.unit] // Injecting the unit relation
            }
        });
    }
  }

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