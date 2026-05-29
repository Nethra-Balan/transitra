import { useState, useEffect } from 'react';
import { routesAPI } from '../services/api.js';
import { RouteCard } from '../components/RouteCard.jsx';
import { LoadingSpinner, SkeletonLoader } from '../components/Loading.jsx';
import VoiceAssistant from '../components/VoiceAssistant.jsx';
import { PlaceSearchInput } from '../components/PlaceSearchInput.jsx';
import { Search, MapPin, Mic, Heart } from 'lucide-react';

export const RoutePlanner = () => {
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const [stops, setStops] = useState([]);
  const [sourceInput, setSourceInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [sourceSelection, setSourceSelection] = useState(null);
  const [destinationSelection, setDestinationSelection] = useState(null);
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

    const canUseGoogleSearch = googleEnabled && sourceInput && destinationInput;
    const canUseLocalStops = sourceSelection?.type === 'stop' && destinationSelection?.type === 'stop';

    if (!canUseGoogleSearch && !canUseLocalStops) {
      alert('Please select both source and destination from the suggestions or type them with Google Maps enabled');
      return;
    }

    try {
      setSearching(true);
      let response;

      if (canUseGoogleSearch) {
        response = await routesAPI.getGoogleDirections({
          origin: sourceSelection?.type === 'stop' ? sourceSelection.stop.name : sourceInput,
          destination: destinationSelection?.type === 'stop' ? destinationSelection.stop.name : destinationInput,
          transitPreference: 'less_walking',
          userQuery: userQuery || undefined,
        });

        setRoutes([response.data.route]);
        setAnalysis(null);
      } else {
        response = await routesAPI.searchRoutes({
          sourceStopId: sourceSelection.stop._id,
          destinationStopId: destinationSelection.stop._id,
          userQuery: userQuery || undefined,
        });

        setRoutes(response.data.routes);
        setAnalysis(response.data.analysis);
      }

      setSelectedRoute(null);
    } catch (error) {
      console.error('Error searching routes:', error);
      alert('Error searching routes');
    } finally {
      setSearching(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    const matchingStop = stops.find((stop) =>
      stop.name.toLowerCase().includes(transcript.toLowerCase())
    );

    if (!sourceSelection && !sourceInput) {
      if (matchingStop) {
        setSourceSelection({ type: 'stop', stop: matchingStop });
        setSourceInput(matchingStop.name);
      } else {
        setSourceInput(transcript);
      }
      return;
    }

    if (!destinationSelection && !destinationInput) {
      if (matchingStop) {
        setDestinationSelection({ type: 'stop', stop: matchingStop });
        setDestinationInput(matchingStop.name);
      } else {
        setDestinationInput(transcript);
      }
      return;
    }

    setUserQuery(transcript);
  };

  const saveRoute = async () => {
    if (!routeName || !selectedRoute) return;

    try {
      const sourceName = sourceSelection?.type === 'stop'
        ? sourceSelection.stop.name
        : sourceSelection?.description || sourceInput;
      const destinationName = destinationSelection?.type === 'stop'
        ? destinationSelection.stop.name
        : destinationSelection?.description || destinationInput;

      const sourceCoordinates = selectedRoute?.legs?.[0]?.start_location
        ? [selectedRoute.legs[0].start_location.lng, selectedRoute.legs[0].start_location.lat]
        : sourceSelection?.type === 'stop'
        ? sourceSelection.stop.location.coordinates
        : [];
      const destinationCoordinates = selectedRoute?.legs?.[0]?.end_location
        ? [selectedRoute.legs[0].end_location.lng, selectedRoute.legs[0].end_location.lat]
        : destinationSelection?.type === 'stop'
        ? destinationSelection.stop.location.coordinates
        : [];

      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: routeName,
          sourceStop: {
            stopId: sourceSelection?.type === 'stop' ? sourceSelection.stop._id : null,
            stopName: sourceName,
            coordinates: sourceCoordinates,
          },
          destinationStop: {
            stopId: destinationSelection?.type === 'stop' ? destinationSelection.stop._id : null,
            stopName: destinationName,
            coordinates: destinationCoordinates,
          },
          selectedRoute: {
            routeName: selectedRoute.summary || selectedRoute.routeName,
            totalDuration: selectedRoute.totalDuration,
            baseFare: selectedRoute.fareText || selectedRoute.baseFare,
            provider: selectedRoute.provider || 'local',
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
                  <PlaceSearchInput
                    label="From"
                    value={sourceInput}
                    onChange={setSourceInput}
                    selectedValue={sourceSelection}
                    onSelect={setSourceSelection}
                    placeholder="Start typing an address or stop"
                    localStops={stops}
                    googleEnabled={googleEnabled}
                  />
                </div>

                {/* Destination */}
                <div>
                  <PlaceSearchInput
                    label="To"
                    value={destinationInput}
                    onChange={setDestinationInput}
                    selectedValue={destinationSelection}
                    onSelect={setDestinationSelection}
                    placeholder="Start typing a destination"
                    localStops={stops}
                    googleEnabled={googleEnabled}
                  />
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
                  {routes.map((route, index) => {
                    const isSelected = selectedRoute === route;
                    return (
                      <div key={index}>
                        <RouteCard
                          route={route}
                          isSelected={isSelected}
                          onClick={() => setSelectedRoute(route)}
                        />
                        {isSelected && (
                          <button
                            onClick={() => setShowSaveDialog(true)}
                            className="w-full mt-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                          >
                            <Heart size={16} />
                            Save Route
                          </button>
                        )}
                      </div>
                    );
                  })}
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