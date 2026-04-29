import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'frosted-super-secret-key-2026';

export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await db.one('SELECT id, name, role FROM "User" WHERE id = $1', [decoded.id]);
    
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

