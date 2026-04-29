import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all customers
router.get('/', async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    console.error("CUSTOMER_FETCH_ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch customers', details: error instanceof Error ? error.message : String(error) });
  }
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  const { name, phone, email, address, loyaltyPoints } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        address,
        loyaltyPoints: loyaltyPoints || 0
      }
    });
    res.status(201).json(customer);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    res.status(400).json({ error: 'Failed to create customer' });
  }
});

// PATCH update customer
router.patch('/:id', async (req, res) => {
  const { name, phone, email, address, loyaltyPoints } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { name, phone, email, address, loyaltyPoints }
    });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete customer' });
  }
});

export default router;
