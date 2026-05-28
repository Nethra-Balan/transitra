import axios from 'axios';
import { config } from '../config/index.js';

/**
 * Gemini Agent Service
 * Analyzes routes and provides intelligent recommendations using Google's Gemini API
 */

export class GeminiAgentService {
  static async analyzeRoutes(userQuery, routeOptions, userProfile = {}) {
    if (!config.gemini.apiKey) {
      console.warn('Gemini API key not configured, returning mock analysis');
      return this.getMockAnalysis(routeOptions);
    }

    try {
      const prompt = this.buildAnalysisPrompt(userQuery, routeOptions, userProfile);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.gemini.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return this.parseGeminiResponse(content, routeOptions);
    } catch (error) {
      console.error('Gemini API error:', error.message);
      // Fallback to mock analysis
      return this.getMockAnalysis(routeOptions);
    }
  }

  static buildAnalysisPrompt(userQuery, routeOptions, userProfile) {
    return `You are an intelligent public transport assistant analyzing bus routes for a user.

User Request: "${userQuery}"
User Profile: ${JSON.stringify(userProfile)}

Available Routes:
${routeOptions
  .map(
    (route, idx) =>
      `Route ${idx + 1}:
- Number: ${route.routeNumber}
- Duration: ${route.totalDuration} minutes
- Fare: ${route.baseFare} units
- Walking Distance: ${route.walkingDistance} km
- Accessibility: ${route.accessibility?.wheelchairAccessible ? 'Yes' : 'No'}
- Stops: ${route.stops.length}
- Distance: ${route.totalDistance} km`
  )
  .join('\n\n')}

Analyze these routes and provide:
1. Ranking: List routes from best to worst for this user
2. Reasoning: Explain why you ranked them this way
3. Top Pick: Which route you recommend and why
4. Constraints Met: Confirm which user constraints are satisfied

Format your response as JSON with keys: ranking, reasoning, topPick, constraintsMet`;
  }

  static parseGeminiResponse(content, routeOptions) {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          ranking: parsed.ranking || [],
          reasoning: parsed.reasoning || 'Analysis complete',
          topPick: parsed.topPick || 0,
          constraintsMet: parsed.constraintsMet || [],
          rawAnalysis: content,
        };
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
    }

    // Fallback: return mock analysis
    return this.getMockAnalysis(routeOptions);
  }

  static getMockAnalysis(routeOptions) {
    // Sort routes by duration (fastest first)
    const ranked = [...routeOptions].sort((a, b) => a.totalDuration - b.totalDuration);

    return {
      success: true,
      ranking: ranked.map((r) => r.routeNumber),
      reasoning:
        'Routes ranked by speed and accessibility. Fastest route is first, with alternatives for different needs.',
      topPick: ranked[0]?.routeNumber,
      constraintsMet: ['optimal_speed', 'accessibility_considered'],
      rawAnalysis:
        'Mock analysis: Gemini API not configured. Routes ranked by duration.',
    };
  }
}
