import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'oftsy-super-secret-key-2026';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/staff', async (_req, res) => {
  try {
    const staff = await prisma.user.findMany({
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true }
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// POST: Register new staff
router.post('/register', async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: role || 'USER'
      }
    });
    res.status(201).json({ message: 'Staff registered', id: user.id });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Username or Email already exists' });
    }
    res.status(400).json({ error: 'Registration failed' });
  }
});

// DELETE: Terminate staff access
router.delete('/staff/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete staff member' });
  }
});

export default router;