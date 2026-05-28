import express from 'express';
import { RoutesController } from '../controllers/routesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes (accessible without auth for MVP)
router.get('/stops', RoutesController.getAllStops);
router.get('/search-stops', RoutesController.searchStops);
router.get('/all', RoutesController.getAllRoutes);
router.get('/nearby', RoutesController.getNearbyStops);

// Protected routes
router.post('/search', authMiddleware, RoutesController.searchRoutes);
router.post('/analyze', authMiddleware, RoutesController.analyzeRoutes);

export default router;
