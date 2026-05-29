import express from 'express';
import { RoutesController } from '../controllers/routesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stops', RoutesController.getAllStops);
router.get('/search-stops', RoutesController.searchStops);
router.get('/all', RoutesController.getAllRoutes);
router.get('/nearby', RoutesController.getNearbyStops);
router.get('/autocomplete', RoutesController.autocompletePlaces);
router.get('/place-details', RoutesController.getPlaceDetails);

// Protected routes
router.post('/search', RoutesController.searchRoutes);
router.post('/directions', RoutesController.getGoogleDirections);
router.post('/analyze', authMiddleware, RoutesController.analyzeRoutes);

export default router;
