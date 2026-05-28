import { BusRoute, BusStop, RouteSchedule } from '../models/index.js';

/**
 * Route Algorithm Service
 * Handles core route finding and filtering logic
 */

export class RouteAlgorithmService {
  /**
   * Find routes between two stops
   * Returns routes sorted by different criteria
   */
  static async findRoutes(sourceStopId, destinationStopId, filters = {}) {
    try {
      // Get all routes from database
      const allRoutes = await BusRoute.find().lean();

      if (allRoutes.length === 0) {
        return [];
      }

      // Filter routes that connect source and destination
      const connectingRoutes = this.filterConnectingRoutes(allRoutes, sourceStopId, destinationStopId);

      // Calculate route metrics
      const routesWithMetrics = connectingRoutes.map((route) =>
        this.calculateRouteMetrics(route, sourceStopId, destinationStopId, filters)
      );

      return routesWithMetrics;
    } catch (error) {
      console.error('Error finding routes:', error);
      return [];
    }
  }

  /**
   * Get 4 route options: fastest, cheapest, accessible, least walking
   */
  static async getRouteOptions(sourceStopId, destinationStopId, filters = {}) {
    try {
      const routes = await this.findRoutes(sourceStopId, destinationStopId, filters);

      if (routes.length === 0) {
        return [];
      }

      const options = [
        this.getRouteByCriteria(routes, 'duration'), // Fastest
        this.getRouteByCriteria(routes, 'fare'), // Cheapest
        this.getRouteByCriteria(routes, 'accessibility'), // Most accessible
        this.getRouteByCriteria(routes, 'walkingDistance'), // Least walking
      ];

      // Remove duplicates while preserving order
      const uniqueOptions = [];
      const seen = new Set();

      for (const route of options) {
        if (!seen.has(route.routeNumber)) {
          uniqueOptions.push(route);
          seen.add(route.routeNumber);
        }
      }

      return uniqueOptions.slice(0, 4);
    } catch (error) {
      console.error('Error getting route options:', error);
      return [];
    }
  }

  /**
   * Filter routes that connect source and destination
   */
  static filterConnectingRoutes(routes, sourceStopId, destinationStopId) {
    return routes.filter((route) => {
      const stopIds = route.stops.map((s) => s.stopId?.toString() || s.stopId);
      const sourceIndex = stopIds.findIndex((id) => id === sourceStopId || id === sourceStopId.toString());
      const destIndex = stopIds.findIndex((id) => id === destinationStopId || id === destinationStopId.toString());

      return sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
    });
  }

  /**
   * Calculate metrics for a route
   */
  static calculateRouteMetrics(route, sourceStopId, destinationStopId, filters = {}) {
    const sourceIndex = route.stops.findIndex(
      (s) => s.stopId?.toString() === sourceStopId || s.stopId === sourceStopId
    );
    const destIndex = route.stops.findIndex(
      (s) => s.stopId?.toString() === destinationStopId || s.stopId === destinationStopId
    );

    const stopsCount = destIndex - sourceIndex + 1;
    const walkingDistance = filters.walkingDistance || 0.5; // km between stops
    const fare = route.baseFare || 10;
    const duration = Math.max(15, (stopsCount - 1) * 5 + 10); // Estimate in minutes

    return {
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      type: route.type || 'ordinary',
      stops: route.stops.slice(sourceIndex, destIndex + 1),
      stopsCount,
      totalDistance: (stopsCount - 1) * 2, // Assume 2km per stop
      totalDuration: duration,
      baseFare: fare,
      walkingDistance,
      accessibility: route.accessibility || {
        wheelchairAccessible: false,
        audio: false,
        ramps: false,
      },
      operatedBy: route.operatedBy,
      criteria: {
        duration,
        fare,
        accessibility: route.accessibility?.wheelchairAccessible ? 0 : 1,
        walkingDistance,
      },
    };
  }

  /**
   * Get best route by a specific criterion
   */
  static getRouteByCriteria(routes, criterion) {
    if (routes.length === 0) return null;

    let best = routes[0];

    switch (criterion) {
      case 'duration':
        best = routes.reduce((min, r) => (r.totalDuration < min.totalDuration ? r : min));
        best.recommendationReason = 'Fastest route';
        break;

      case 'fare':
        best = routes.reduce((min, r) => (r.baseFare < min.baseFare ? r : min));
        best.recommendationReason = 'Most affordable option';
        break;

      case 'accessibility':
        best = routes.reduce((max, r) => {
          const rScore = (r.accessibility?.wheelchairAccessible ? 1 : 0) +
            (r.accessibility?.ramps ? 1 : 0) +
            (r.accessibility?.audio ? 1 : 0);
          const maxScore = (max.accessibility?.wheelchairAccessible ? 1 : 0) +
            (max.accessibility?.ramps ? 1 : 0) +
            (max.accessibility?.audio ? 1 : 0);
          return rScore > maxScore ? r : max;
        });
        best.recommendationReason = 'Most accessible option';
        break;

      case 'walkingDistance':
        best = routes.reduce((min, r) => (r.walkingDistance < min.walkingDistance ? r : min));
        best.recommendationReason = 'Minimal walking required';
        break;

      default:
        best.recommendationReason = 'Available option';
    }

    return best;
  }

  /**
   * Search for nearby stops
   */
  static async getNearbyStops(coordinates, radiusKm = 2) {
    try {
      const stops = await BusStop.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates, // [longitude, latitude]
            },
            $maxDistance: radiusKm * 1000, // Convert to meters
          },
        },
      }).lean();

      return stops;
    } catch (error) {
      console.error('Error finding nearby stops:', error);
      return [];
    }
  }
}
