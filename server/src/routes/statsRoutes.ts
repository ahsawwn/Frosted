import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET: Summary for the dashboard
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
    const ingredients = await prisma.ingredient.findMany();
    const lowStockItems = ingredients.filter(ing => ing.stock <= ing.lowStockThreshold);
    res.json({ count: lowStockItems.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock count" });
  }
});

// GET: Staff count
router.get('/staff-count', async (req, res) => {
  try {
    const count = await prisma.user.count({
      where: { 
        role: { in: ['USER', 'ADMIN', 'SUPERADMIN'] }
      } 
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff count" });
  }
});

// GET: Recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { 
        items: {
          include: { product: true } 
        } 
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
