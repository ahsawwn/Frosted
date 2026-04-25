import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET all coupons
router.get('/', async (_req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { expiryDate: 'asc' }
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// POST create coupon
router.post('/', async (req, res) => {
  const { code, discountType, discountValue, expiryDate, minOrderValue } = req.body;
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        expiryDate: new Date(expiryDate),
        minOrderAmount: Number(minOrderValue || 0)
      }
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create coupon' });
  }
});

// DELETE coupon
router.delete('/:id', async (req, res) => {
  try {
    await prisma.coupon.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete coupon' });
  }
});

// POST: Validate coupon
router.post('/validate', async (req, res) => {
  const { code, totalAmount } = req.body;
  console.log('VALIDATING_COUPON:', code, 'FOR_TOTAL:', totalAmount);
  
  if (!code) return res.status(400).json({ error: 'Coupon code is required' });

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ error: 'Coupon is inactive' });
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ error: `Min order Rs. ${coupon.minOrderAmount} required` });
    }

    res.json({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    console.error('COUPON_VALIDATION_ERROR:', error);
    res.status(500).json({ error: 'Validation failed', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
