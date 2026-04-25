import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/', async (req, res) => {
  const { subtotal, taxAmount, totalAmount, paymentMethod, items, customerId, discount } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          subtotal: Number(subtotal),
          taxAmount: Number(taxAmount),
          discountAmount: Number(discount || 0),
          totalAmount: Number(totalAmount),
          paymentMethod,
          customerId: customerId || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: Number(item.quantity),
              price: Number(item.price),
            })),
          },
        },
      });

      // 2. Deduct Inventory based on Recipes
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { ingredients: true }
        });

        if (product && product.ingredients) {
          for (const recipeItem of product.ingredients) {
            const deduction = Number(recipeItem.quantity) * Number(item.quantity);
            await tx.ingredient.update({
              where: { id: recipeItem.ingredientId },
              data: { stock: { decrement: deduction } }
            });
          }
        }
      }

      return order;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET: Active orders for Kitchen (KDS)
router.get('/active', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['PENDING', 'PREPARING', 'READY'] }
      },
      include: { 
        items: { 
          include: { product: true } 
        } 
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active kitchen orders" });
  }
});

// PATCH: Update order status (KDS workflow)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to update order status" });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Start a transaction so both happen or neither happens
    await prisma.$transaction([
      // 2. Delete all items linked to this order first
      prisma.orderItem.deleteMany({
        where: { orderId: id },
      }),
      // 3. Now delete the actual order
      prisma.order.delete({
        where: { id: id },
      }),
    ]);

    res.status(200).json({ message: "Order and items deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;