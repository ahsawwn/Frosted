import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

// 1. GET ALL PRODUCTS
router.get('/', async (_req, res) => {
  try {
    const products = await db.many(`
      SELECT p.*, c.name as "categoryName" 
      FROM "Product" p 
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p.name ASC
    `);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. GET SINGLE PRODUCT (with recipes)
router.get('/:id', async (req, res) => {
  try {
    const product = await db.one('SELECT * FROM "Product" WHERE id = $1', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Not found' });
    
    const recipeRows = await db.many(`
      SELECT ri.*, i.name as "ingName", i.stock as "ingStock", u.short as "unitShort", u.name as "unitName"
      FROM "RecipeItem" ri
      JOIN "Ingredient" i ON ri."ingredientId" = i.id
      JOIN "Unit" u ON ri."unitId" = u.id
      WHERE ri."productId" = $1
    `, [req.params.id]);

    // Format to match Prisma's nested structure: ri.ingredient.name
    const ingredients = (recipeRows || []).map(ri => ({
      id: ri.id,
      productId: ri.productId,
      ingredientId: ri.ingredientId,
      quantity: ri.quantity,
      unitId: ri.unitId,
      ingredient: {
        id: ri.ingredientId,
        name: ri.ingName,
        stock: ri.ingStock,
        unit: {
          id: ri.unitId,
          short: ri.unitShort,
          name: ri.unitName
        }
      }
    }));
    
    res.json({ ...product, ingredients });
  } catch (error) {
    console.error('FETCH_PRODUCT_ERROR:', error);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// 3. CREATE PRODUCT
router.post('/', async (req, res) => {
  const { name, price, description, categoryId, imageUrl, prepTime } = req.body;
  try {
    const prod = await db.one(`
      INSERT INTO "Product" (id, name, price, description, "categoryId", "imageUrl", "prepTime", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [name, parseFloat(price), description, categoryId, imageUrl, parseInt(prepTime) || 5]);
    res.status(201).json(prod);
  } catch (error) {
    res.status(400).json({ error: 'Create failed' });
  }
});

// 4. DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM "Product" WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Delete failed (might be linked to orders)' });
  }
});

export default router;
