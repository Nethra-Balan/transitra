import { RouteAlgorithmService } from '../services/routeAlgorithm.js';
import { GeminiAgentService } from '../services/geminiAgent.js';
import { TransportDataService } from '../services/transportData.js';

/**
 * Routes Controller
 * Handles route planning and analysis requests
 */

export class RoutesController {
  /**
   * Search routes between two stops
   */
  static async searchRoutes(req, res, next) {
    try {
      const { sourceStopId, destinationStopId, userQuery } = req.body;

      if (!sourceStopId || !destinationStopId) {
        return res.status(400).json({ error: 'Source and destination stop IDs are required' });
      }

      // Get route options
      const routeOptions = await RouteAlgorithmService.getRouteOptions(
        sourceStopId,
        destinationStopId
      );

      if (routeOptions.length === 0) {
        return res.json({
          routes: [],
          message: 'No routes found between these stops',
        });
      }

      // If user provided a query, get AI analysis
      let analysis = null;
      if (userQuery) {
        analysis = await GeminiAgentService.analyzeRoutes(userQuery, routeOptions, {
          userId: req.userId,
        });
      }

      res.json({
        routes: routeOptions,
        analysis,
        message: 'Routes found successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyze routes with AI
   */
  static async analyzeRoutes(req, res, next) {
    try {
      const { routes, userQuery } = req.body;

      if (!routes || !Array.isArray(routes)) {
        return res.status(400).json({ error: 'Routes array is required' });
      }

      const analysis = await GeminiAgentService.analyzeRoutes(
        userQuery || 'Find the best route',
        routes,
        { userId: req.userId }
      );

      res.json({
        analysis,
        message: 'Routes analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get nearby stops
   */
  static async getNearbyStops(req, res, next) {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const radiusKm = parseFloat(radius) || 2;
      const stops = await RouteAlgorithmService.getNearbyStops([parseFloat(longitude), parseFloat(latitude)], radiusKm);

      res.json({
        stops,
        message: 'Nearby stops found',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search stops by name
   */
  static async searchStops(req, res, next) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const stops = await TransportDataService.searchStops(query);

      res.json({
        stops,
        message: `Found ${stops.length} stops`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all stops
   */
  static async getAllStops(req, res, next) {
    try {
      const stops = await TransportDataService.getAllStops();

      res.json({
        stops,
        message: `Found ${stops.length} stops`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all routes
   */
  static async getAllRoutes(req, res, next) {
    try {
      const routes = await TransportDataService.getAllRoutes();

      res.json({
        routes,
        message: `Found ${routes.length} routes`,
      });
    } catch (error) {
      next(error);
    }
  }
}
