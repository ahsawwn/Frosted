import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, ingredients: true },
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post('/', async (req, res) => {
  const { name, price, categoryId, imageUrl } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), categoryId, imageUrl }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        category: true, 
        ingredients: {
          include: {
            ingredient: {
              include: { unit: true }
            }
          }
        }
      }
    });
    
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;