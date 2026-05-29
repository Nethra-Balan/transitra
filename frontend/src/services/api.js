import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const routesAPI = {
  searchRoutes: (data) => apiClient.post('/routes/search', data),
  getGoogleDirections: (data) => apiClient.post('/routes/directions', data),
  analyzeRoutes: (data) => apiClient.post('/routes/analyze', data),
  getAllStops: () => apiClient.get('/routes/stops'),
  searchStops: (query) => apiClient.get('/routes/search-stops', { params: { query } }),
  autocompletePlaces: (input) => apiClient.get('/routes/autocomplete', { params: { input } }),
  getPlaceDetails: (placeId) => apiClient.get('/routes/place-details', { params: { placeId } }),
  getNearbyStops: (lat, lng, radius) =>
    apiClient.get('/routes/nearby', { params: { latitude: lat, longitude: lng, radius } }),
  getAllRoutes: () => apiClient.get('/routes/all'),
};

export const preferencesAPI = {
  getPreferences: () => apiClient.get('/preferences'),
  updatePreferences: (data) => apiClient.put('/preferences', data),
  resetPreferences: () => apiClient.post('/preferences/reset'),
};

export default apiClient;
