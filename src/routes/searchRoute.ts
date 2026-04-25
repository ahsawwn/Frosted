import { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @route   GET /api/search?q=...
 * @desc    Global search for products, categories, and orders
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    console.log("Search Query Received:", q);

    // Return empty arrays if query is too short to save DB resources
    if (!q || q.length < 2) {
      return res.json({ products: [], categories: [], orders: [] });
    }

    // Execute all searches in parallel for maximum performance
    const [products, categories, orders] = await Promise.all([
      
      // 1. Search Products (including nested relations)
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { imageUrl: { contains: q, mode: 'insensitive' } } // Optional: search by image meta if helpful
          ]
        },
        include: { category: true },
        take: 5
      }),

      // 2. Search Categories
      prisma.category.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' }
        },
        take: 3
      }),

      // 3. Search Orders (POS Transactions)
      // Searching by Order ID or date string since customer module is absent
      prisma.order.findMany({
        where: {
          id: { contains: q, mode: 'insensitive' }
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    console.log("Found Products:", products.length);
    res.json({
      products,
      categories,
      orders,
      success: true
    });

  } catch (error) {
    console.error("Search Engine Error:", error);
    res.status(500).json({ 
      error: "Global search failed",
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
});

export default router;