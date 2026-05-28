import { RouteAlgorithmService } from './routeAlgorithm.js';
import { ReplanEvent } from '../models/index.js';

/**
 * Dynamic Replanning Service
 * Simulates real-time incidents and suggests alternative routes
 */

export class ReplanningService {
  /**
   * Simulate a transit incident
   */
  static async simulateIncident(userId, incidentData) {
    try {
      const event = new ReplanEvent({
        userId,
        eventType: incidentData.eventType, // delay, missed_stop, crowded, breakdown, accident
        description: incidentData.description,
        originalRoute: incidentData.originalRoute,
        timestamp: new Date(),
      });

      // Get alternative routes
      const alternatives = await this.getAlternatives(
        incidentData.sourceStopId,
        incidentData.destinationStopId,
        incidentData.currentStopIndex
      );

      event.alternativeRoutes = alternatives;
      await event.save();

      return event;
    } catch (error) {
      console.error('Error simulating incident:', error);
      throw error;
    }
  }

  /**
   * Get alternative routes when incident occurs
   */
  static async getAlternatives(sourceStopId, destinationStopId, currentStopIndex = 0) {
    try {
      // Get normal route options
      const alternatives = await RouteAlgorithmService.getRouteOptions(
        sourceStopId,
        destinationStopId
      );

      // Sort by different criteria to provide variety
      return alternatives.map((route) => ({
        routeNumber: route.routeNumber,
        totalDuration: route.totalDuration,
        baseFare: route.baseFare,
        walkingDistance: route.walkingDistance,
        reason: `Alternative to ${currentStopIndex} - ${this.getRecommendationReason(route)}`,
      }));
    } catch (error) {
      console.error('Error getting alternatives:', error);
      return [];
    }
  }

  static getRecommendationReason(route) {
    if (route.totalDuration < 30) return 'Fast alternative';
    if (route.baseFare < 15) return 'Budget-friendly';
    if (route.walkingDistance < 1) return 'Minimal walking';
    return 'Available option';
  }

  /**
   * Simulate real-time delays
   */
  static simulateDelay() {
    // Simulate random delays between 0-20 minutes
    return Math.floor(Math.random() * 20);
  }

  /**
   * Get incident history
   */
  static async getIncidentHistory(userId, limit = 10) {
    try {
      const events = await ReplanEvent.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();

      return events;
    } catch (error) {
      console.error('Error fetching incident history:', error);
      return [];
    }
  }

  /**
   * Get replan suggestions based on patterns
   */
  static async getReplanSuggestions(userId) {
    try {
      const incidents = await ReplanEvent.find({ userId })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean();

      // Analyze patterns
      const patterns = {
        mostCommonIncident: this.getMostCommon(incidents.map((e) => e.eventType)),
        averageDelayTime: 12, // Simulated
        recommendedBuffer: 15, // minutes
      };

      return patterns;
    } catch (error) {
      console.error('Error getting replan suggestions:', error);
      return {};
    }
  }

  static getMostCommon(arr) {
    const counts = {};
    arr.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }
}
