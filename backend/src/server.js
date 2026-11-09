import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import tnpRoutes from './routes/tnpRoutes.js';
import companyPortalRoutes from './routes/companyPortalRoutes.js';
import studentPlacementRoutes from './routes/studentPlacementRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

export const app = express();

// Middlewares
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'degraded',
    message: databaseConnected
      ? 'TNP Management System Backend is running smoothly'
      : 'API is running but the database is unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tnp', tnpRoutes);
app.use('/api/company', companyPortalRoutes);
app.use('/api/student', studentPlacementRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export const startServer = async () => {
  const port = Number(process.env.PORT) || 5000;
  await connectDB();

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(port, () => resolve(listener));
    listener.once('error', reject);
  });

  console.log(`🚀 TNP Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  console.log(`🔗 API Base URL: http://localhost:${port}/api`);

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  return server;
};

startServer().catch((error) => {
  console.error(`❌ Server startup failed: ${error.message}`);
  process.exit(1);
});
