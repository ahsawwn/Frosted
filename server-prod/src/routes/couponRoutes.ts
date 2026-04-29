import { Router } from 'express';
import { db } from '../lib/db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const coupons = await db.many('SELECT * FROM "Coupon" WHERE "isActive" = true ORDER BY code ASC');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/validate', async (req, res) => {
  const { code, amount } = req.body;
  try {
    const coupon = await db.one('SELECT * FROM "Coupon" WHERE code = $1 AND "isActive" = true', [code]);
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
    
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon expired' });
    }
    
    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Min order amount is ${coupon.minOrderAmount}` });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Validation error' });
  }
});

export default router;
