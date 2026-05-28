import { RouteHistoryService } from '../services/routeHistory.js';

/**
 * Route History Controller
 * Handles saved routes and travel history
 */

export class RouteHistoryController {
  /**
   * Save a route
   */
  static async saveRoute(req, res, next) {
    try {
      const { name, description, sourceStop, destinationStop, selectedRoute, tags } = req.body;

      if (!name || !sourceStop || !destinationStop || !selectedRoute) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const savedRoute = await RouteHistoryService.saveRoute(req.userId, {
        name,
        description,
        sourceStop,
        destinationStop,
        selectedRoute,
        tags,
      });

      res.status(201).json({
        message: 'Route saved successfully',
        route: savedRoute,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get saved routes
   */
  static async getSavedRoutes(req, res, next) {
    try {
      const { favorites, tag } = req.query;

      const routes = await RouteHistoryService.getSavedRoutes(req.userId, {
        favorites: favorites === 'true',
        tag,
      });

      res.json({
        routes,
        message: `Found ${routes.length} saved routes`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle favorite
   */
  static async toggleFavorite(req, res, next) {
    try {
      const { routeId } = req.params;

      const route = await RouteHistoryService.toggleFavorite(req.userId, routeId);

      res.json({
        message: route.favorite ? 'Added to favorites' : 'Removed from favorites',
        route,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete saved route
   */
  static async deleteSavedRoute(req, res, next) {
    try {
      const { routeId } = req.params;

      await RouteHistoryService.deleteSavedRoute(req.userId, routeId);

      res.json({
        message: 'Route deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get travel history
   */
  static async getTravelHistory(req, res, next) {
    try {
      const { days } = req.query;
      const daysValue = parseInt(days) || 30;

      const { history, stats } = await RouteHistoryService.getTravelHistory(
        req.userId,
        daysValue
      );

      res.json({
        history,
        stats,
        message: `Found ${history.length} trips in last ${daysValue} days`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record a trip
   */
  static async recordTrip(req, res, next) {
    try {
      const { sourceStop, destinationStop, selectedRoute, fare, duration, savedRouteId } = req.body;

      const trip = await RouteHistoryService.recordTrip(req.userId, {
        sourceStop,
        destinationStop,
        selectedRoute,
        fare,
        duration,
        savedRouteId,
      });

      res.status(201).json({
        message: 'Trip recorded successfully',
        trip,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rate a trip
   */
  static async rateTrip(req, res, next) {
    try {
      const { tripId } = req.params;
      const { rating, notes } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const trip = await RouteHistoryService.rateTrip(req.userId, tripId, rating, notes);

      res.json({
        message: 'Trip rated successfully',
        trip,
      });
    } catch (error) {
      next(error);
    }
  }
}
