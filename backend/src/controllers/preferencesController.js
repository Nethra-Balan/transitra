import { Preferences } from '../models/index.js';

/**
 * Preferences Controller
 * Handles user preference management
 */

export class PreferencesController {
  /**
   * Get user preferences
   */
  static async getPreferences(req, res, next) {
    try {
      const preferences = await Preferences.findOne({ userId: req.userId });

      if (!preferences) {
        return res.status(404).json({ error: 'Preferences not found' });
      }

      res.json(preferences);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(req, res, next) {
    try {
      const {
        routePreference,
        avoidTransportTypes,
        preferredTransportTypes,
        maxWalkingDistance,
        avoidCrowded,
        preferNightSafety,
        darkMode,
        highContrast,
        fontSize,
        language,
      } = req.body;

      const preferences = await Preferences.findOneAndUpdate(
        { userId: req.userId },
        {
          routePreference,
          avoidTransportTypes,
          preferredTransportTypes,
          maxWalkingDistance,
          avoidCrowded,
          preferNightSafety,
          darkMode,
          highContrast,
          fontSize,
          language,
        },
        { new: true }
      );

      res.json({
        message: 'Preferences updated successfully',
        preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset preferences to default
   */
  static async resetPreferences(req, res, next) {
    try {
      const preferences = await Preferences.findOneAndUpdate(
        { userId: req.userId },
        {
          routePreference: 'fastest',
          avoidTransportTypes: [],
          preferredTransportTypes: [],
          maxWalkingDistance: 2,
          avoidCrowded: false,
          preferNightSafety: false,
          darkMode: false,
          highContrast: false,
          fontSize: 'normal',
        },
        { new: true }
      );

      res.json({
        message: 'Preferences reset to default',
        preferences,
      });
    } catch (error) {
      next(error);
    }
  }
}
