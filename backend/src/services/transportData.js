import { BusRoute, BusStop, RouteSchedule } from '../models/index.js';

/**
 * Transport Data Service
 * Manages mock transport data and database operations
 */

export class TransportDataService {
  /**
   * Get all bus stops
   */
  static async getAllStops() {
    try {
      const stops = await BusStop.find().lean();
      return stops;
    } catch (error) {
      console.error('Error fetching stops:', error);
      return [];
    }
  }

  /**
   * Get stop by ID
   */
  static async getStopById(stopId) {
    try {
      const stop = await BusStop.findById(stopId).lean();
      return stop;
    } catch (error) {
      console.error('Error fetching stop:', error);
      return null;
    }
  }

  /**
   * Get stop by name (search)
   */
  static async searchStops(query) {
    try {
      const stops = await BusStop.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { stopId: { $regex: query, $options: 'i' } },
        ],
      }).lean();
      return stops;
    } catch (error) {
      console.error('Error searching stops:', error);
      return [];
    }
  }

  /**
   * Get all bus routes
   */
  static async getAllRoutes() {
    try {
      const routes = await BusRoute.find().lean();
      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  }

  /**
   * Get route by number
   */
  static async getRouteByNumber(routeNumber) {
    try {
      const route = await BusRoute.findOne({ routeNumber }).lean();
      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  }

  /**
   * Get route schedule
   */
  static async getRouteSchedule(routeId) {
    try {
      const schedule = await RouteSchedule.findOne({ routeId }).lean();
      return schedule;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return null;
    }
  }

  /**
   * Check if database has data
   */
  static async hasData() {
    try {
      const stopCount = await BusStop.countDocuments();
      const routeCount = await BusRoute.countDocuments();
      return stopCount > 0 && routeCount > 0;
    } catch (error) {
      return false;
    }
  }
}
