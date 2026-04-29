import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

// 1. SALES SUMMARY
router.get('/sales-summary', async (_req, res) => {
  try {
    const result = await db.one('SELECT SUM("totalAmount") as total, COUNT(*) as count FROM "Order"');
    res.json({
      totalAmount: parseFloat(result.total || 0),
      count: parseInt(result.count || 0)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales summary" });
  }
});

// 2. LOW STOCK COUNT
router.get('/low-stock-count', async (_req, res) => {
  try {
    const result = await db.one('SELECT COUNT(*) as count FROM "Ingredient" WHERE stock <= "lowStockThreshold"');
    res.json({ count: parseInt(result.count || 0) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock count" });
  }
});

// 3. STAFF COUNT
router.get('/staff-count', async (_req, res) => {
  try {
    const result = await db.one('SELECT COUNT(*) as count FROM "User" WHERE role IN (\'USER\', \'ADMIN\', \'SUPERADMIN\')');
    res.json({ count: parseInt(result.count || 0) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff count" });
  }
});

// 4. RECENT ACTIVITY
router.get('/recent-activity', async (_req, res) => {
  try {
    const orders = await db.many(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id, 
               'product', p.name
             )) as items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      GROUP BY o.id
      ORDER BY o."createdAt" DESC
      LIMIT 10
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

// Legacy: Keep the consolidated dashboard route just in case
router.get('/dashboard', async (_req, res) => {
  try {
    const revenueRes = await db.one('SELECT SUM("totalAmount") as total FROM "Order"');
    const orderCountRes = await db.one('SELECT COUNT(*) as count FROM "Order"');
    const customerCountRes = await db.one('SELECT COUNT(*) as count FROM "Customer"');
    const lowStockRes = await db.one('SELECT COUNT(*) as count FROM "Ingredient" WHERE stock <= "lowStockThreshold"');

    res.json({
      totalRevenue: parseFloat(revenueRes.total || 0),
      totalOrders: parseInt(orderCountRes.count),
      totalCustomers: parseInt(customerCountRes.count),
      lowStockAlerts: parseInt(lowStockRes.count)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
