import { prisma } from './prisma';

export const logAction = async (userId: string, action: string, entity: string, details: object) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        details: JSON.stringify(details),
      }
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // We don't block the main action if logging fails, but we record it in console
  }
};