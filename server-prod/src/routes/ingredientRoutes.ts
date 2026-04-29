import { Router } from 'express';
import { db, pool } from '../lib/db.js';

const router = Router();

// 1. GET ALL INGREDIENTS
router.get('/', async (_req, res) => {
  try {
    const ingredients = await db.many(`
      SELECT i.*, u.short as "unitShort", u.name as "unitName"
      FROM "Ingredient" i
      LEFT JOIN "Unit" u ON i."unitId" = u.id
      ORDER BY i.name ASC
    `);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// 2. SAVE RECIPE (The missing piece)
router.post('/recipe', async (req, res) => {
  const { productId, ingredients } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM "RecipeItem" WHERE "productId" = $1', [productId]);
    
    for (const item of ingredients) {
      await client.query(`
        INSERT INTO "RecipeItem" (id, "productId", "ingredientId", quantity, "unitId")
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
      `, [productId, item.ingredientId, item.quantity, item.unitId]);
    }

    await client.query('COMMIT');
    res.json({ message: "Recipe saved successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: "Failed to save recipe" });
  } finally {
    client.release();
  }
});

// 3. CREATE INGREDIENT
router.post('/', async (req, res) => {
  const { name, stock, lowStockThreshold, unitId } = req.body;
  try {
    const ing = await db.one(`
      INSERT INTO "Ingredient" (id, name, stock, "lowStockThreshold", "unitId", "updatedAt", "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [name, stock, lowStockThreshold, unitId]);
    res.status(201).json(ing);
  } catch (error) {
    res.status(400).json({ error: 'Create failed' });
  }
});

// 4. UPDATE INGREDIENT
router.patch('/:id', async (req, res) => {
  const { name, stock, lowStockThreshold, unitId } = req.body;
  try {
    const updated = await db.one(`
      UPDATE "Ingredient" 
      SET name = $1, stock = $2, "lowStockThreshold" = $3, "unitId" = $4, "updatedAt" = NOW()
      WHERE id = $5 RETURNING *
    `, [name, stock, lowStockThreshold, unitId, req.params.id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// 5. DELETE INGREDIENT
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM "Ingredient" WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Delete failed (might be linked to recipes)' });
  }
});

export default router;
