import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

// Using a consistent fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'oftsy_premium_secret_2026';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
  if (err) return res.status(403).json({ message: "Invalid token" });

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  
  // If decoded.tokenVersion is undefined (because login didn't include it),
  // this check will fail even if user.tokenVersion is 1.
  if (!user || user.tokenVersion !== decoded.tokenVersion) {
    return res.status(401).json({ message: "Session revoked. Please log in again." });
  }

  req.user = decoded;
  next();
});
};