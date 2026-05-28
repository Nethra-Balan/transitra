import { Clock, MapPin, DollarSign, Footprints, Accessibility } from 'lucide-react';

export const RouteCard = ({ route, isSelected, onClick, recommendationReason }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Route {route.routeNumber}</h3>
          {recommendationReason && (
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              ⭐ {recommendationReason}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          route.type === 'express'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {route.type === 'express' ? 'Express' : 'Ordinary'}
        </span>
      </div>

      {/* Route info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
            <p className="font-semibold text-gray-900 dark:text-white">{route.totalDuration} min</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-accent-terracotta" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fare</p>
            <p className="font-semibold text-gray-900 dark:text-white">₹{route.baseFare}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Footprints size={18} className="text-accent-purple" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Walking</p>
            <p className="font-semibold text-gray-900 dark:text-white">{route.walkingDistance} km</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stops</p>
            <p className="font-semibold text-gray-900 dark:text-white">{route.stopsCount}</p>
          </div>
        </div>
      </div>

      {/* Stops list */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Route Path</p>
        <div className="space-y-1">
          {route.stops.slice(0, 3).map((stop, idx) => (
            <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
              {idx > 0 && '→ '}
              {stop.stopName}
            </p>
          ))}
          {route.stops.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-500 italic">
              ... and {route.stops.length - 3} more stops
            </p>
          )}
        </div>
      </div>

      {/* Accessibility badge */}
      {route.accessibility?.wheelchairAccessible && (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900 rounded-lg">
          <Accessibility size={16} className="text-green-600 dark:text-green-400" />
          <p className="text-xs font-medium text-green-700 dark:text-green-300">Wheelchair Accessible</p>
        </div>
      )}
    </div>
  );
};
