import { RouteAlgorithmService } from '../services/routeAlgorithm.js';
import { GeminiAgentService } from '../services/geminiAgent.js';
import { TransportDataService } from '../services/transportData.js';
import { GoogleMapsService } from '../services/googleMapsService.js';

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

  static async getGoogleDirections(req, res, next) {
    try {
      const { origin, destination, transitPreference } = req.body;

      if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
      }

      const originParam = typeof origin === 'object' && origin.placeId
        ? `place_id:${origin.placeId}`
        : typeof origin === 'object' && origin.coordinates
        ? `${origin.coordinates[1]},${origin.coordinates[0]}`
        : origin;

      const destinationParam = typeof destination === 'object' && destination.placeId
        ? `place_id:${destination.placeId}`
        : typeof destination === 'object' && destination.coordinates
        ? `${destination.coordinates[1]},${destination.coordinates[0]}`
        : destination;

      const directions = await GoogleMapsService.getDirections(
        originParam,
        destinationParam,
        transitPreference || 'less_walking'
      );

      const route = directions.routes?.[0];
      if (!route) {
        return res.status(404).json({ error: 'No directions found' });
      }

      const leg = route.legs?.[0] || {};
      const simplifiedSteps = (leg.steps || []).map((step) => ({
        html_instructions: step.html_instructions,
        travel_mode: step.travel_mode,
        distance: step.distance,
        duration: step.duration,
        transit_details: step.transit_details,
        maneuver: step.maneuver,
        start_location: step.start_location,
        end_location: step.end_location,
      }));

      res.json({
        route: {
          provider: 'google',
          summary: route.summary,
          totalDuration: leg.duration?.value,
          totalDistance: leg.distance?.value,
          durationText: leg.duration?.text,
          distanceText: leg.distance?.text,
          fareText: route.fare?.text,
          overviewPolyline: route.overview_polyline?.points,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          steps: simplifiedSteps,
          legs: directions.routes?.[0]?.legs,
        },
        message: 'Directions retrieved successfully',
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
  static async autocompletePlaces(req, res, next) {
    try {
      const { input, sessionToken } = req.query;

      if (!input) {
        return res.status(400).json({ error: 'Autocomplete input is required' });
      }

      const data = await GoogleMapsService.autocomplete(input, sessionToken);
      res.json({ predictions: data.predictions, message: 'Autocomplete predictions fetched' });
    } catch (error) {
      next(error);
    }
  }

  static async getPlaceDetails(req, res, next) {
    try {
      const { placeId } = req.query;

      if (!placeId) {
        return res.status(400).json({ error: 'Place ID is required' });
      }

      const place = await GoogleMapsService.getPlaceDetails(placeId);
      res.json({ place, message: 'Place details fetched' });
    } catch (error) {
      next(error);
    }
  }

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
