import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

// 1. GET ALL CUSTOMERS
router.get('/', async (_req, res) => {
  try {
    const customers = await db.many('SELECT * FROM "Customer" ORDER BY "createdAt" DESC');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// 2. GET SINGLE CUSTOMER
router.get('/:id', async (req, res) => {
  try {
    const customer = await db.one('SELECT * FROM "Customer" WHERE id = $1', [req.params.id]);
    res.json(customer);
  } catch (error) {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// 3. POST CREATE CUSTOMER
router.post('/', async (req, res) => {
  const { name, phone, email, address, loyaltyPoints } = req.body;
  try {
    const cust = await db.one(`
      INSERT INTO "Customer" (id, name, phone, email, address, "loyaltyPoints", "createdAt") 
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *
    `, [name, phone, email, address, loyaltyPoints || 0]);
    res.status(201).json(cust);
  } catch (err: any) {
    if (err.code === '23505') { // Postgres Unique Constraint
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

// 4. PATCH UPDATE CUSTOMER
router.patch('/:id', async (req, res) => {
  const { name, phone, email, address, loyaltyPoints } = req.body;
  try {
    const updated = await db.one(`
      UPDATE "Customer" 
      SET name = $1, phone = $2, email = $3, address = $4, "loyaltyPoints" = $5
      WHERE id = $6 RETURNING *
    `, [name, phone, email, address, loyaltyPoints, req.params.id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update customer' });
  }
});

// 5. DELETE CUSTOMER
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM "Customer" WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete customer' });
  }
});

export default router;
