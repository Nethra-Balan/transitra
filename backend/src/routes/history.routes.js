import express from 'express';
import { RouteHistoryController } from '../controllers/routeHistoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Saved routes
router.post('/', RouteHistoryController.saveRoute);
router.get('/', RouteHistoryController.getSavedRoutes);
router.put('/:routeId/favorite', RouteHistoryController.toggleFavorite);
router.delete('/:routeId', RouteHistoryController.deleteSavedRoute);

// Travel history
router.post('/trip/record', RouteHistoryController.recordTrip);
router.get('/history/all', RouteHistoryController.getTravelHistory);
router.put('/trip/:tripId/rate', RouteHistoryController.rateTrip);

export default router;
