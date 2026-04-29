import { Pool, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

// Standard Postgres protocol (5432) is often blocked on shared hosting.
// This tells Neon to use WebSockets over port 443 instead.
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle client', err);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  
  // Helper for single results
  one: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows[0];
  },

  // Helper for multiple results
  many: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows;
  }
};

export { pool };
