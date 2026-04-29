import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

// 1. GET ALL CATEGORIES (with product counts)
router.get('/', async (_req, res) => {
  try {
    const categories = await db.many(`
      SELECT c.*, 
             (SELECT COUNT(*)::int FROM "Product" p WHERE p."categoryId" = c.id) as "productCount"
      FROM "Category" c
      ORDER BY c.name ASC
    `);
    
    // Format to match Prisma's output structure if needed by frontend
    const formatted = categories.map(cat => ({
      ...cat,
      _count: { products: cat.productCount }
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 2. CREATE CATEGORY
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const cat = await db.one('INSERT INTO "Category" (id, name) VALUES (gen_random_uuid(), $1) RETURNING *', [name]);
    res.status(201).json(cat);
  } catch (error) {
    res.status(400).json({ error: 'Category already exists or invalid data' });
  }
});

// 3. DELETE CATEGORY
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM "Category" WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Cannot delete category; it contains products.' });
  }
});

export default router;
