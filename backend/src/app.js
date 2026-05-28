import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import routesRoutes from './routes/routes.routes.js';
import preferencesRoutes from './routes/preferences.routes.js';
import historyRoutes from './routes/history.routes.js';
import replanningRoutes from './routes/replanning.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Transitra backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/replanning', replanningRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

export default app;
