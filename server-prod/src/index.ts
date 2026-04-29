import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from './lib/db.js';

// Import Routes (Extensions are mandatory in ESM)
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simpler shared hosting setup
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// 🔌 API Routes
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

// Customer Display Sync Store
let currentCustomerOrder = {
  items: [],
  totals: { subtotal: 0, tax: 0, discount: 0, total: 0 },
  status: 'IDLE'
};

app.post('/api/customer-display/sync', (req, res) => {
  currentCustomerOrder = { ...req.body, status: req.body.items.length > 0 ? 'ORDERING' : 'IDLE' };
  res.json({ success: true });
});

app.get('/api/customer-display/current', (_req, res) => {
  res.json(currentCustomerOrder);
});

// Health Check (Now with DB Ping)
app.get('/health', async (_req, res) => {
  const dbConfigured = !!process.env.DATABASE_URL;
  
  try {
    if (!dbConfigured) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    // Ping the database
    const start = Date.now();
    await pool.query('SELECT 1');
    const latency = Date.now() - start;

    res.json({ 
      status: 'online', 
      database: 'connected',
      latency: `${latency}ms`,
      system: 'Frosted PROD (No-Prisma)', 
      timestamp: new Date() 
    });
  } catch (error: any) {
    console.error('HEALTH_CHECK_ERROR:', error);
    res.status(500).json({ 
      status: 'online', 
      database: 'DISCONNECTED',
      db_configured: dbConfigured,
      error: error.message || 'Unknown Error',
      error_code: error.code,
      error_detail: error.detail,
      timestamp: new Date() 
    });
  }
});

// 🏭 Production Static Files
if (process.env.NODE_ENV === 'production') {
  // Try to find the client folder in a few likely locations
  const possiblePaths = [
    path.join(__dirname, '../../client/dist'),
    path.join(__dirname, '../../frosted.ahsawwn.com'), // Direct root
    path.join(__dirname, '../../frosted.ahsawwn.com/dist'),
    path.join(__dirname, '../../public_html'),
    path.join(__dirname, '../client/dist')
  ];

  let clientDist = possiblePaths[0];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      clientDist = p;
      break;
    }
  }

  console.log(`📂 SERVING STATIC FILES FROM: ${clientDist}`);
  app.use(express.static(clientDist));

  // ✨ Universal Fallback (Middleware approach is safer in Express 5)
  app.use((req, res, next) => {
    // Skip if it's an API or Health request (those should have been handled or will 404)
    if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
      return next();
    }
    
    // Only handle GET requests for the frontend
    if (req.method !== 'GET') return next();

    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next(new Error(`Frontend build not found at ${indexPath}`));
    }
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('SERVER_ERROR:', err.message, err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message, // Temporarily enabled to help you debug the path
    path: req.url
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FROSTED PRODUCTION ENGINE RUNNING ON PORT ${PORT}`);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
