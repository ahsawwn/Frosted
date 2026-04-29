import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await db.many(
      'SELECT id, name, price, "imageUrl" FROM "Product" WHERE name ILIKE $1 LIMIT 5',
      [`%${q}%`]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
