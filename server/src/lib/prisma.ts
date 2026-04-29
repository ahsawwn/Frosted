import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// 1. Create the connection pool
const pool = new Pool({ connectionString });

// 2. Setup the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Export the Prisma instance with the adapter
export const prisma = new PrismaClient({ adapter });
export { pool };
