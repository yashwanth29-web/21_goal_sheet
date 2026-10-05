import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { connectDB } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

const app = express();

// Middleware: robust CORS allowing any origin dynamically
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or any origin
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'daily-goal-tracker-api',
  });
});

// Root welcome endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Daily Goal Tracker API is running.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      goals: '/api/goals',
      leaderboard: '/api/leaderboard',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
});

// Connect to DB immediately
connectDB().catch((err) => {
  console.error('Initial DB connection attempt failed:', err.message);
});

// Start listening if not running inside Vercel serverless runtime
if (!process.env.VERCEL) {
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Daily Goal Tracker API Server running on port ${ENV.PORT}`);
    console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`🔐 Auth Endpoints: http://localhost:${ENV.PORT}/api/auth`);
    console.log(`🎯 Goals Endpoints: http://localhost:${ENV.PORT}/api/goals`);
  });
}

export default app;
