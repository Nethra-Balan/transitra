import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Star, Clock, DollarSign } from 'lucide-react';
import { routesAPI } from '../services/api';
import { LoadingSpinner, SkeletonLoader } from '../components/Loading';

export const SavedRoutesPage = () => {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, favorites

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  const fetchSavedRoutes = async () => {
    setLoading(true);
    try {
      // Note: Endpoint to be added to backend
      const response = await fetch('/api/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSavedRoutes(data.routes || []);
    } catch (error) {
      console.error('Error fetching saved routes:', error);
    }
    setLoading(false);
  };

  const toggleFavorite = async (routeId) => {
    try {
      const response = await fetch(`/api/history/${routeId}/favorite`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSavedRoutes(savedRoutes.map((r) => (r._id === routeId ? data.route : r)));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Delete this saved route?')) return;

    try {
      await fetch(`/api/history/${routeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSavedRoutes(savedRoutes.filter((r) => r._id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const filteredRoutes = savedRoutes.filter((route) => {
    if (filter === 'favorites') return route.favorite;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Saved Routes</h1>
        <p className="text-slate-600 dark:text-slate-400">Quick access to your frequently used routes</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
          }`}
        >
          All Routes ({savedRoutes.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === 'favorites'
              ? 'bg-primary text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
          }`}
        >
          <Star size={16} />
          Favorites ({savedRoutes.filter((r) => r.favorite).length})
        </button>
      </div>

      {/* Routes Grid */}
      {filteredRoutes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No saved routes yet</p>
          <a href="/routes" className="text-primary hover:underline">
            Plan a route now
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{route.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{route.description}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(route._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    route.favorite
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Heart size={18} fill={route.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Route Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Route {route.selectedRoute?.routeNumber}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{route.selectedRoute?.totalDuration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>₹{route.selectedRoute?.baseFare}</span>
                  </div>
                </div>
              </div>

              {/* Route Path */}
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-4 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <div>{route.sourceStop.stopName}</div>
                <div className="text-center my-1">↓</div>
                <div>{route.destinationStop.stopName}</div>
              </div>

              {/* Stats */}
              {route.frequency && (
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Used {route.frequency} times
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`/routes?route=${route._id}`}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors text-center"
                >
                  Use Route
                </a>
                <button
                  onClick={() => deleteRoute(route._id)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRoutesPage;
