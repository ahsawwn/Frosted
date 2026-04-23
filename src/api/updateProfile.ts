import type { Response } from 'express';
import type { AuthRequest } from '../lib/middleware';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

export const updateProfileHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { name, username, email, currentPassword, newPassword } = req.body;

  try {
    // 1. Fetch current user from DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Prepare the update object
    const updateData: any = {
      name: name || user.name,
      username: username || user.username,
      email: email || user.email,
    };

    // 3. Handle Password Change Logic
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new one" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "The current password you entered is incorrect" });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 4. Execute Update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { 
        id: true, 
        name: true, 
        username: true, 
        email: true, 
        role: true 
      }
    });

    return res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    
    // Check for unique constraint violation (Username/Email already exists)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Username or Email is already in use" });
    }
    
    return res.status(500).json({ message: "An internal server error occurred" });
  }
};