import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

// 1. GET SETTINGS
router.get('/', async (_req, res) => {
  try {
    let settings = await db.one('SELECT * FROM "StoreSettings" WHERE id = 1');
    if (!settings) {
       settings = await db.one(`
        INSERT INTO "StoreSettings" (id, "storeName", "themeColor")
        VALUES (1, 'Frosted', '#db2777')
        RETURNING *
      `);
    }
    res.json(settings);
  } catch (error) {
    // If not found, create it
    try {
        const settings = await db.one(`
          INSERT INTO "StoreSettings" (id, "storeName", "themeColor")
          VALUES (1, 'frosted Frosted', '#db2777')
          RETURNING *
        `);
        res.json(settings);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }
});

// 2. UPDATE SETTINGS (POST)
router.post('/', async (req, res) => {
  const data = req.body;
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');
    
    const query = `UPDATE "StoreSettings" SET ${setClause} WHERE id = 1 RETURNING *`;
    const updated = await db.one(query, values);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

export default router;

