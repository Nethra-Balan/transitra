import { ReplanningService } from '../services/replanning.js';

/**
 * Replanning Controller
 * Handles dynamic route replanning on incidents
 */

export class ReplanningController {
  /**
   * Simulate an incident and get alternatives
   */
  static async simulateIncident(req, res, next) {
    try {
      const { eventType, description, sourceStopId, destinationStopId, originalRoute, currentStopIndex } =
        req.body;

      if (!eventType || !sourceStopId || !destinationStopId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const incident = await ReplanningService.simulateIncident(req.userId, {
        eventType,
        description,
        sourceStopId,
        destinationStopId,
        originalRoute,
        currentStopIndex,
      });

      res.json({
        message: 'Incident recorded and alternatives provided',
        incident,
        alternatives: incident.alternativeRoutes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get incident history
   */
  static async getIncidentHistory(req, res, next) {
    try {
      const { limit } = req.query;
      const limitValue = parseInt(limit) || 10;

      const incidents = await ReplanningService.getIncidentHistory(req.userId, limitValue);

      res.json({
        incidents,
        message: `Found ${incidents.length} incidents`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get replanning suggestions based on user patterns
   */
  static async getReplanSuggestions(req, res, next) {
    try {
      const suggestions = await ReplanningService.getReplanSuggestions(req.userId);

      res.json({
        suggestions,
        message: 'Replanning suggestions generated',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get alternatives for current route
   */
  static async getAlternatives(req, res, next) {
    try {
      const { sourceStopId, destinationStopId, currentStopIndex } = req.query;

      if (!sourceStopId || !destinationStopId) {
        return res.status(400).json({ error: 'Source and destination stop IDs required' });
      }

      const alternatives = await ReplanningService.getAlternatives(
        sourceStopId,
        destinationStopId,
        parseInt(currentStopIndex) || 0
      );

      res.json({
        alternatives,
        message: `Found ${alternatives.length} alternative routes`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Simulate a random delay
   */
  static async getDelaySimulation(req, res, next) {
    try {
      const delay = ReplanningService.simulateDelay();

      res.json({
        delay,
        message: `Simulated delay: ${delay} minutes`,
      });
    } catch (error) {
      next(error);
    }
  }
}
