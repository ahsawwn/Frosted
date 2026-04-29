import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const units = await db.many('SELECT * FROM "Unit" ORDER BY name ASC');
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/', async (req, res) => {
  const { name, short } = req.body;
  try {
    const unit = await db.one('INSERT INTO "Unit" (id, name, short) VALUES (gen_random_uuid(), $1, $2) RETURNING *', [name, short]);
    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ error: 'Failed' });
  }
});

export default router;
