import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { prisma, pool } from './lib/prisma.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import searchRoutes from './routes/searchRoute.js';
import unitRoutes from './routes/units.js';
import customerRoutes from './routes/customerRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));
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

// Customer Display Sync Store (In-memory for simplicity)
let currentCustomerOrder = {
  items: [],
  totals: { subtotal: 0, tax: 0, discount: 0, total: 0 },
  status: 'IDLE' // IDLE, ORDERING, THANK_YOU
};

app.post('/api/customer-display/sync', (req, res) => {
  currentCustomerOrder = { ...req.body, status: req.body.items.length > 0 ? 'ORDERING' : 'IDLE' };
  res.json({ success: true });
});

app.get('/api/customer-display/current', (_req, res) => {
  res.json(currentCustomerOrder);
});

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'online', system: 'Frosted POS Service', timestamp: new Date() });
});

// 🏭 Production Static Files
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 FROSTED SYSTEMS BACKEND RUNNING ON PORT ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});
