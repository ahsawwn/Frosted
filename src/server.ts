import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma, pool } from './lib/prisma';

// Import Routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import statsRoutes from './routes/statsRoutes';
import categoryRoutes from './routes/categoryRoutes';
import searchRoutes from './routes/searchRoute';
import unitRoutes from './routes/units';
import customerRoutes from './routes/customerRoutes';
import couponRoutes from './routes/couponRoutes';
import settingRoutes from './routes/settingRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// 🔌 Plugin Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'online', system: 'Oftsy POS Service', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 OFTSY SYSTEMS BACKEND RUNNING ON PORT ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});