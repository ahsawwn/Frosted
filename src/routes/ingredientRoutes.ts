import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

router.post('/', async (req, res) => {
  const { name, unit, stock, lowStockThreshold } = req.body;
  try {
    const ingredient = await prisma.ingredient.create({
      data: { 
        name, 
        unit, 
        stock: parseFloat(stock), 
        lowStockThreshold: parseFloat(lowStockThreshold) 
      }
    });
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json({ error: "Ingredient already exists or invalid data" });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, stock, lowStockThreshold, unit } = req.body;
  try {
    const updated = await prisma.ingredient.update({
      where: { id },
      data: { 
        name, 
        unit,
        stock: stock !== undefined ? parseFloat(stock) : undefined, 
        lowStockThreshold: lowStockThreshold !== undefined ? parseFloat(lowStockThreshold) : undefined 
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.ingredient.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Linked to a recipe" });
  }
});

export default router;