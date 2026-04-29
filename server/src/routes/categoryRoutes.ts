import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET: Fetch all categories with product counts
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { 
        _count: { 
          select: { products: true } 
        } 
      },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST: Create a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ 
      data: { name } 
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: "Category already exists or invalid data" });
  }
});

// DELETE: Remove a category (only if no products are linked)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({ 
      where: { id: req.params.id } 
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Cannot delete category; it contains products." });
  }
});

export default router;
