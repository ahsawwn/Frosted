import { Router } from 'express';
import { db, pool } from '../lib/db.js';

const router = Router();

// 1. GET ALL ORDERS
router.get('/', async (_req, res) => {
  try {
    const orders = await db.many(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id, 
               'productId', oi."productId", 
               'quantity', oi.quantity, 
               'price', oi.price,
               'product', p.*
             )) as items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      GROUP BY o.id
      ORDER BY o."createdAt" DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 2. GET ACTIVE KITCHEN ORDERS
router.get('/active', async (_req, res) => {
  try {
    const orders = await db.many(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id, 
               'productId', oi."productId", 
               'quantity', oi.quantity, 
               'price', oi.price,
               'product', p.*
             )) as items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      WHERE o.status IN ('PENDING', 'PREPARING', 'READY')
      GROUP BY o.id
      ORDER BY o."createdAt" ASC
    `);
    res.json(orders || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active kitchen orders" });
  }
});

// 3. CHECKOUT (POST /)
router.post('/', async (req, res) => {
  const { 
    items, subtotal, taxAmount, discountAmount, totalAmount, 
    paymentMethod, customerId, couponCode, estimatedTime 
  } = req.body;

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Create Order
    const orderResult = await client.query(`
      INSERT INTO "Order" (
        id, "orderNumber", subtotal, "taxAmount", "discountAmount", "totalAmount", 
        "paymentMethod", status, "customerId", "couponCode", "estimatedTime", "updatedAt", "createdAt"
      ) VALUES (
        gen_random_uuid(), SUBSTRING(gen_random_uuid()::text, 1, 8), $1, $2, $3, $4, $5, 'PENDING', $6, $7, $8, NOW(), NOW()
      ) RETURNING *
    `, [
      Number(subtotal), 
      Number(taxAmount), 
      Number(discountAmount || 0), 
      Number(totalAmount), 
      paymentMethod, 
      customerId || null, 
      couponCode || null, 
      estimatedTime || null
    ]);

    const order = orderResult.rows[0];

    // 2. Create Order Items & Update Inventory
    for (const item of items) {
      const pId = item.productId || item.id;
      await client.query(`
        INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
      `, [order.id, pId, Number(item.quantity), Number(item.price)]);

      // 🧤 DEDUCT INVENTORY based on recipes
      const recipes = await client.query('SELECT * FROM "RecipeItem" WHERE "productId" = $1', [pId]);
      for (const recipe of recipes.rows) {
        const totalDeduction = Number(recipe.quantity) * Number(item.quantity);
        await client.query(
          'UPDATE "Ingredient" SET stock = stock - $1, "updatedAt" = NOW() WHERE id = $2',
          [totalDeduction, recipe.ingredientId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('CHECKOUT_ERROR:', error);
    res.status(500).json({ 
      error: 'Transaction failed', 
      message: error.message,
      detail: error.detail 
    });
  } finally {
    client.release();
  }
});

// 4. UPDATE STATUS
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await db.one(
      'UPDATE "Order" SET status = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// 5. DELETE ORDER
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM "OrderItem" WHERE "orderId" = $1', [req.params.id]);
    await client.query('DELETE FROM "Order" WHERE id = $1', [req.params.id]);
    await client.query('COMMIT');
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: "Delete failed" });
  } finally {
    client.release();
  }
});

export default router;
