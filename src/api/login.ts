import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Configuration for security lockout and JWT
const MAX_ATTEMPTS = 5;
const COOLDOWN_MINUTES = 15;
const JWT_SECRET = process.env.JWT_SECRET || 'oftsy_premium_secret_2026';

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // 1. Find user in database
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Check if account is currently locked out
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockoutUntil.getTime() - new Date().getTime()) / 60000
      );
      return res.status(403).json({ 
        message: `Account locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.` 
      });
    }

    // 3. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const newAttempts = user.failedAttempts + 1;
      let lockoutUntil = null;

      // Trigger lockout if threshold is reached
      if (newAttempts >= MAX_ATTEMPTS) {
        lockoutUntil = new Date(Date.now() + COOLDOWN_MINUTES * 60000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          failedAttempts: newAttempts,
          lockoutUntil: lockoutUntil
        }
      });

      const remaining = MAX_ATTEMPTS - newAttempts;
      return res.status(401).json({ 
        message: remaining > 0 
          ? `Invalid password. ${remaining} attempts remaining.` 
          : `Too many failed attempts. Account locked for ${COOLDOWN_MINUTES} minutes.`
      });
    }

    // 4. Success: Reset security stats and generate token
    // We update the DB to clear attempts on a successful login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockoutUntil: null }
    });

    /**
     * CRITICAL FIX: 
     * We must include tokenVersion in the JWT payload so the 
     * middleware can verify it against the database.
     */
    const token = jwt.sign(
      { 
        userId: updatedUser.id, 
        role: updatedUser.role,
        tokenVersion: updatedUser.tokenVersion 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // 5. Send response to frontend
    return res.json({
      accessToken: token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
        needsPasswordChange: updatedUser.needsPasswordChange // Used for frontend redirection
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};