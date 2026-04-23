import type { Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { logAction } from '../lib/logger'; // We'll create this helper below

const isSuperAdmin = (req: any) => req.user?.role === 'SUPERADMIN';

export const getAllUsers = async (req: any, res: Response) => {
  if (!isSuperAdmin(req)) return res.status(403).json({ message: "Forbidden" });

  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        username: true, 
        email: true, 
        role: true, 
        needsPasswordChange: true,
        lockoutUntil: true,
        createdAt: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const createUser = async (req: any, res: Response) => {
  if (!isSuperAdmin(req)) return res.status(403).json({ message: "Forbidden" });

  const { name, username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        username, 
        email, 
        password: hashedPassword, 
        role,
        needsPasswordChange: true // New users MUST change password on first login
      }
    });

    await logAction(req.user.userId, "CREATE_USER", "User", { target: username });
    res.json({ message: "User created successfully", userId: user.id });
  } catch (err) {
    res.status(400).json({ message: "Username or Email already exists" });
  }
};

// --- THE "KILL SWITCH" (Revoke Session) ---
export const revokeUserSession = async (req: any, res: Response) => {
  if (!isSuperAdmin(req)) return res.status(403).json({ message: "Forbidden" });

  const { id } = req.params;
  try {
    await prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } } // This invalidates their current JWT
    });

    await logAction(req.user.userId, "REVOKE_SESSION", "User", { targetId: id });
    res.json({ message: "User session revoked. They will be logged out immediately." });
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  if (!isSuperAdmin(req)) return res.status(403).json({ message: "Forbidden" });

  const { id } = req.params;
  try {
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    await prisma.user.delete({ where: { id } });

    await logAction(req.user.userId, "DELETE_USER", "User", { target: userToDelete?.username });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
};