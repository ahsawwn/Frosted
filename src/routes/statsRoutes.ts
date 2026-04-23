import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET: Summary for the 4 dashboard boxes
router.get('/sales-summary', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    res.json({
      totalAmount,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales summary" });
  }
});

// GET: Low stock items count
router.get('/low-stock-count', async (req, res) => {
  try {
    // This assumes your Ingredient model has 'stock' and 'lowStockThreshold'
    const count = await prisma.ingredient.count({
      where: {
        stock: { lte: prisma.ingredient.fields.lowStockThreshold }
      }
    });
    res.json({ count });
  } catch (error) {
    res.json({ count: 0 }); // Fallback so dashboard doesn't crash
  }
});

// GET: Recent activity (last 5 orders)
router.get('/recent-activity', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});


// 1. Sales Summary
router.get('/sales-summary', async (req, res) => {
  const orders = await prisma.order.findMany();
  const total = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  res.json({ totalAmount: total, count: orders.length });
});

// 2. Low Stock (Make sure your model name is 'ingredient')
router.get('/low-stock-count', async (req, res) => {
  const count = await prisma.ingredient.count({
    where: { stock: { lte: 10 } } // Or your custom threshold
  });
  res.json({ count });
});

// 3. Staff Count
router.get('/staff-count', async (req, res) => {
  const count = await prisma.user.count({
    where: { role: 'STAFF' } 
  });
  res.json({ count });
});

// 4. Recent Activity
router.get('/recent-activity', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { 
        items: {
          include: { product: true } // This ensures product names show up
        } 
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;