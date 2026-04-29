import { db } from './db.js';

export const logAction = async (userId: string, action: string, entity: string, details: object) => {
  try {
    await db.query(
      'INSERT INTO "AuditLog" (id, "userId", action, entity, details, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
      [userId, action, entity, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('FAILED_TO_LOG:', error);
  }
};
