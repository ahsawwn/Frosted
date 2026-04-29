import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all units
router.get('/', async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

// POST a new unit
router.post('/', async (req, res) => {
  const { name, short } = req.body;
  
  if (!name || !short) {
    return res.status(400).json({ error: "Name and Short code are required" });
  }

  try {
    const newUnit = await prisma.unit.create({
      data: { 
        name, 
        short: short.toLowerCase() 
      }
    });
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(400).json({ error: "Unit already exists or invalid data" });
  }
});

// DELETE a unit
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.unit.delete({
      where: { id }
    });
    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Cannot delete unit. It might be in use by an ingredient." });
  }
});

export default router;
