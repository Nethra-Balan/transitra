import express from 'express';
import { ReplanningController } from '../controllers/replanningController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Replanning endpoints
router.post('/simulate-incident', ReplanningController.simulateIncident);
router.get('/history', ReplanningController.getIncidentHistory);
router.get('/suggestions', ReplanningController.getReplanSuggestions);
router.get('/alternatives', ReplanningController.getAlternatives);
router.get('/delay-simulation', ReplanningController.getDelaySimulation);

export default router;
