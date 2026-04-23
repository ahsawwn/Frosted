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

export default router;