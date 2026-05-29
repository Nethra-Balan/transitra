import axios from 'axios';
import { config } from '../config/index.js';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const BASE_URL = 'https://maps.googleapis.com/maps/api';

export class GoogleMapsService {
  static ensureApiKey() {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key is not configured. Set GOOGLE_MAPS_API_KEY in your backend .env.local');
    }
  }

  static async autocomplete(input, sessionToken) {
    this.ensureApiKey();

    const url = `${BASE_URL}/place/autocomplete/json`;
    const params = {
      input,
      key: GOOGLE_MAPS_API_KEY,
      types: 'geocode|establishment',
      language: 'en',
      sessiontoken: sessionToken,
    };

    const response = await axios.get(url, { params });
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places autocomplete error: ${response.data.status}`);
    }

    return response.data;
  }

  static async getPlaceDetails(placeId) {
    this.ensureApiKey();

    const url = `${BASE_URL}/place/details/json`;
    const params = {
      place_id: placeId,
      key: GOOGLE_MAPS_API_KEY,
      fields: 'place_id,name,formatted_address,geometry',
      language: 'en',
    };

    const response = await axios.get(url, { params });
    if (response.data.status !== 'OK') {
      throw new Error(`Google Place details error: ${response.data.status}`);
    }

    return response.data.result;
  }

  static async getDirections(origin, destination, transitPreference = 'less_walking', departureTime = 'now') {
    this.ensureApiKey();

    const url = `${BASE_URL}/directions/json`;
    const params = {
      origin,
      destination,
      key: GOOGLE_MAPS_API_KEY,
      mode: 'transit',
      language: 'en',
      departure_time: departureTime,
      transit_routing_preference: transitPreference,
    };

    const response = await axios.get(url, { params });
    if (response.data.status !== 'OK') {
      throw new Error(`Google Directions error: ${response.data.status}`);
    }

    return response.data;
  }
}
