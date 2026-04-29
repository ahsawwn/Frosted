import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'frosted-super-secret-key-2026';

// 🔐 LOGIN PROTOCOL
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.one('SELECT * FROM "User" WHERE username = $1', [username]);
    
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
    console.error('SQL_AUTH_FAIL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 👥 STAFF QUERY
router.get('/staff', async (_req, res) => {
  try {
    const staff = await db.many('SELECT id, name, username, email, role, "createdAt" FROM "User"');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// ➕ REGISTER STAFF
router.post('/register', async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.one(
      'INSERT INTO "User" (id, name, username, email, password, role, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id',
      [name, username, email, hashedPassword, role || 'USER']
    );
    res.status(201).json({ message: 'Staff registered', id: result.id });
  } catch (err: any) {
    if (err.code === '23505') { // Unique constraint violation in Postgres
      return res.status(400).json({ error: 'Username or Email already exists' });
    }
    res.status(400).json({ error: 'Registration failed' });
  }
});

// ❌ DELETE STAFF
router.delete('/staff/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM "User" WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete staff member' });
  }
});

export default router;

