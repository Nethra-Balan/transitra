import { useState, useEffect } from 'react';
import { routesAPI } from '../services/api.js';
import { RouteCard } from '../components/RouteCard.jsx';
import { LoadingSpinner, SkeletonLoader } from '../components/Loading.jsx';
import VoiceAssistant from '../components/VoiceAssistant.jsx';
import { Search, MapPin, Mic, Heart } from 'lucide-react';

export const RoutePlanner = () => {
  const [stops, setStops] = useState([]);
  const [sourceStop, setSourceStop] = useState('');
  const [destinationStop, setDestinationStop] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load stops on mount
  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getAllStops();
      setStops(response.data.stops);
    } catch (error) {
      console.error('Error loading stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!sourceStop || !destinationStop) {
      alert('Please select both source and destination');
      return;
    }

    try {
      setSearching(true);
      const response = await routesAPI.searchRoutes({
        sourceStopId: sourceStop,
        destinationStopId: destinationStop,
        userQuery: userQuery || undefined,
      });

      setRoutes(response.data.routes);
      setAnalysis(response.data.analysis);
      setSelectedRoute(null);
    } catch (error) {
      console.error('Error searching routes:', error);
      alert('Error searching routes');
    } finally {
      setSearching(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    // Try to find matching stop
    const matchingStop = stops.find((stop) =>
      stop.name.toLowerCase().includes(transcript.toLowerCase())
    );

    if (matchingStop) {
      setDestinationStop(matchingStop._id);
    } else {
      // Set as query if no exact match
      setUserQuery(transcript);
    }
  };

  const saveRoute = async () => {
    if (!routeName || !selectedRoute) return;

    try {
      const sourceStopObj = stops.find((s) => s._id === sourceStop);
      const destStopObj = stops.find((s) => s._id === destinationStop);

      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: routeName,
          sourceStop: {
            stopId: sourceStop,
            stopName: sourceStopObj?.name,
            coordinates: sourceStopObj?.location?.coordinates || [],
          },
          destinationStop: {
            stopId: destinationStop,
            stopName: destStopObj?.name,
            coordinates: destStopObj?.location?.coordinates || [],
          },
          selectedRoute: {
            routeNumber: selectedRoute.routeNumber,
            routeName: selectedRoute.routeName,
            totalDuration: selectedRoute.totalDuration,
            baseFare: selectedRoute.baseFare,
          },
        }),
      });

      if (response.ok) {
        alert('Route saved successfully!');
        setShowSaveDialog(false);
        setRouteName('');
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error saving route');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Plan Your Route
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the best transit option for your journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Search Routes
              </h2>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <select
                      value={sourceStop}
                      onChange={(e) => setSourceStop(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select source...</option>
                      {stops.map((stop) => (
                        <option key={stop._id} value={stop._id}>
                          {stop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <select
                      value={destinationStop}
                      onChange={(e) => setDestinationStop(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select destination...</option>
                      {stops.map((stop) => (
                        <option key={stop._id} value={stop._id}>
                          {stop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* User Query */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What matters to you? (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="e.g., cheapest, less walking"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setVoiceOpen(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {searching ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Search Routes
                    </>
                  )}
                </button>
              </form>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="/saved-routes"
                  className="text-sm text-primary hover:underline font-medium flex items-center gap-2"
                >
                  <Heart size={16} />
                  View Saved Routes
                </a>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {routes.length === 0 && !searching ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Search to find available routes
                </p>
              </div>
            ) : searching ? (
              <SkeletonLoader />
            ) : (
              <>
                {/* Analysis Summary */}
                {analysis && (
                  <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {analysis.analysis || 'Top routes recommended based on your preferences'}
                    </p>
                  </div>
                )}

                {/* Save Route Dialog */}
                {showSaveDialog && selectedRoute && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Save Route
                      </h3>
                      <input
                        type="text"
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                        placeholder="e.g., Work Commute"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowSaveDialog(false)}
                          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveRoute}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Route Cards */}
                <div className="space-y-4">
                  {routes.map((route, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedRoute(route)}
                      className={`cursor-pointer transition-all ${
                        selectedRoute?._id === route._id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                    >
                      <RouteCard route={route} />
                      {selectedRoute?._id === route._id && (
                        <button
                          onClick={() => setShowSaveDialog(true)}
                          className="w-full mt-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                        >
                          <Heart size={16} />
                          Save Route
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistant
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
};

export default RoutePlanner;
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Find Routes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Routes Display */}
          <div className="lg:col-span-2">
            {routes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  {searching ? 'Loading routes...' : 'Search to see available routes'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Found {routes.length} Route{routes.length !== 1 ? 's' : ''}
                  </h2>
                  {analysis && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        💡 AI Analysis
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {analysis.reasoning || 'Routes analyzed'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Route Cards */}
                {routes.map((route) => (
                  <RouteCard
                    key={route.routeNumber}
                    route={route}
                    isSelected={selectedRoute?.routeNumber === route.routeNumber}
                    onClick={() => setSelectedRoute(route)}
                    recommendationReason={route.recommendationReason}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
