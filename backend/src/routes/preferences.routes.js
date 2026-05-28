import express from 'express';
import { PreferencesController } from '../controllers/preferencesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All preference routes require authentication
router.get('/', authMiddleware, PreferencesController.getPreferences);
router.put('/', authMiddleware, PreferencesController.updatePreferences);
router.post('/reset', authMiddleware, PreferencesController.resetPreferences);

export default router;
