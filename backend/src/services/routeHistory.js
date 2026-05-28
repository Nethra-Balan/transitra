import { SavedRoute, TravelHistory } from '../models/index.js';

/**
 * Saved Routes & Travel History Service
 * Manages user's saved routes and trip history
 */

export class RouteHistoryService {
  /**
   * Save a route for quick access
   */
  static async saveRoute(userId, routeData) {
    try {
      const savedRoute = new SavedRoute({
        userId,
        name: routeData.name,
        description: routeData.description,
        sourceStop: routeData.sourceStop,
        destinationStop: routeData.destinationStop,
        selectedRoute: routeData.selectedRoute,
        tags: routeData.tags || [],
      });

      await savedRoute.save();
      return savedRoute;
    } catch (error) {
      console.error('Error saving route:', error);
      throw error;
    }
  }

  /**
   * Get user's saved routes
   */
  static async getSavedRoutes(userId, filters = {}) {
    try {
      let query = { userId };

      if (filters.favorites) {
        query.favorite = true;
      }

      if (filters.tag) {
        query.tags = filters.tag;
      }

      const routes = await SavedRoute.find(query)
        .sort({ lastUsed: -1 })
        .lean();

      return routes;
    } catch (error) {
      console.error('Error fetching saved routes:', error);
      return [];
    }
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(userId, routeId) {
    try {
      const route = await SavedRoute.findOneAndUpdate(
        { _id: routeId, userId },
        [{ $set: { favorite: { $not: '$favorite' } } }],
        { new: true }
      );

      return route;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  /**
   * Delete saved route
   */
  static async deleteSavedRoute(userId, routeId) {
    try {
      await SavedRoute.deleteOne({ _id: routeId, userId });
      return true;
    } catch (error) {
      console.error('Error deleting saved route:', error);
      throw error;
    }
  }

  /**
   * Record completed trip in history
   */
  static async recordTrip(userId, tripData) {
    try {
      const trip = new TravelHistory({
        userId,
        sourceStop: tripData.sourceStop,
        destinationStop: tripData.destinationStop,
        selectedRoute: tripData.selectedRoute,
        fare: tripData.fare,
        duration: tripData.duration,
        date: new Date(),
      });

      await trip.save();

      // Update saved route frequency if it matches
      if (tripData.savedRouteId) {
        await SavedRoute.findByIdAndUpdate(
          tripData.savedRouteId,
          {
            $inc: { frequency: 1 },
            $set: { lastUsed: new Date() },
          }
        );
      }

      return trip;
    } catch (error) {
      console.error('Error recording trip:', error);
      throw error;
    }
  }

  /**
   * Get travel history with stats
   */
  static async getTravelHistory(userId, days = 30) {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const history = await TravelHistory.find({
        userId,
        date: { $gte: fromDate },
      })
        .sort({ date: -1 })
        .lean();

      // Calculate stats
      const stats = {
        totalTrips: history.length,
        totalFare: history.reduce((sum, trip) => sum + (trip.fare || 0), 0),
        averageDuration:
          history.reduce((sum, trip) => sum + (trip.duration || 0), 0) /
          (history.length || 1),
        favoriteRoute: this.getMostFrequentRoute(history),
        cancelledTrips: history.filter((t) => t.cancelled).length,
      };

      return { history, stats };
    } catch (error) {
      console.error('Error fetching travel history:', error);
      return { history: [], stats: {} };
    }
  }

  /**
   * Get most frequently used route
   */
  static getMostFrequentRoute(history) {
    const routeCounts = {};

    history.forEach((trip) => {
      const routeNum = trip.selectedRoute?.routeNumber;
      if (routeNum) {
        routeCounts[routeNum] = (routeCounts[routeNum] || 0) + 1;
      }
    });

    return Object.keys(routeCounts).reduce((a, b) =>
      routeCounts[a] > routeCounts[b] ? a : b
    );
  }

  /**
   * Rate a trip
   */
  static async rateTrip(userId, tripId, rating, notes = '') {
    try {
      const trip = await TravelHistory.findOneAndUpdate(
        { _id: tripId, userId },
        { rating, notes },
        { new: true }
      );

      return trip;
    } catch (error) {
      console.error('Error rating trip:', error);
      throw error;
    }
  }
}
