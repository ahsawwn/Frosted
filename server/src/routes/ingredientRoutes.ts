import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// 1. GET ALL INGREDIENTS
router.get('/', async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({ 
      include: { unit: true },
      orderBy: { name: 'asc' } 
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// 2. SAVE RECIPE (POST)
router.post('/recipe', async (req, res) => {
  const { productId, ingredients } = req.body;

  if (!productId || !ingredients) {
    return res.status(400).json({ error: "Missing Product ID or Ingredients" });
  }

  try {
    await prisma.$transaction([
      prisma.recipeItem.deleteMany({
        where: { productId }
      }),
      prisma.recipeItem.createMany({
        data: ingredients.map((item: any) => ({
          productId: productId,
          ingredientId: item.ingredientId,
          quantity: parseFloat(item.quantity),
          unitId: item.unitId,
        })),
      })
    ]);

    res.json({ message: "Recipe deployed successfully" });
  } catch (error) {
    console.error("Recipe Save Error:", error);
    res.status(500).json({ error: "Failed to save recipe structure" });
  }
});

// 3. CREATE NEW INGREDIENT
router.post('/', async (req, res) => {
  const { name, stock, lowStockThreshold, unitId } = req.body;
  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        stock: parseFloat(stock) || 0,
        lowStockThreshold: parseFloat(lowStockThreshold) || 0,
        unitId: unitId
      }
    });
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ingredient" });
  }
});

// 4. UPDATE INGREDIENT
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stock, lowStockThreshold, unitId } = req.body;
  try {
    const updated = await prisma.ingredient.update({
      where: { id },
      data: { 
        name, 
        unitId,
        stock: stock !== undefined ? parseFloat(stock) : undefined, 
        lowStockThreshold: lowStockThreshold !== undefined ? parseFloat(lowStockThreshold) : undefined 
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

// 5. DELETE INGREDIENT
router.delete('/:id', async (req, res) => {
  try {
    await prisma.ingredient.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Linked to a recipe or inventory error" });
  }
});

export default router;
