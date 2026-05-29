import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Star, TrendingDown } from 'lucide-react';
import { LoadingSpinner, SkeletonLoader } from '../components/Loading';

export const TravelHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history/all?days=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setHistory(data.history || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching history:', error);
    }
    setLoading(false);
  };

  const rateTrip = async (tripId, rating) => {
    try {
      const response = await fetch(`/api/history/trip/${tripId}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rating }),
      });
      const data = await response.json();
      setHistory(history.map((h) => (h._id === tripId ? data.trip : h)));
    } catch (error) {
      console.error('Error rating trip:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Travel History</h1>
        <p className="text-slate-600 dark:text-slate-400">Your past journeys and statistics</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? 'bg-primary text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Trips</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTrips || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
            <DollarSign size={16} />
            Total Spent
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{stats.totalFare || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
            <Clock size={16} />
            Avg Duration
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {Math.round(stats.averageDuration || 0)} min
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
            <TrendingDown size={16} />
            Favourite Route
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.favoriteRoute || 'N/A'}</div>
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Trips</h2>

        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            No trips recorded in this period
          </div>
        ) : (
          history.map((trip) => (
            <div
              key={trip._id}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Trip Info */}
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Route {trip.selectedRoute?.routeNumber}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {trip.sourceStop.stopName} → {trip.destinationStop.stopName}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-700 dark:text-slate-300">
                      ₹{trip.fare || 0}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {new Date(trip.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => rateTrip(trip._id, star)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <Star
                          size={18}
                          fill={trip.rating >= star ? '#FFB800' : 'none'}
                          stroke={trip.rating >= star ? '#FFB800' : '#CBD5E1'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TravelHistoryPage;
