import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { routesAPI } from '../services/api.js';

export const PlaceSearchInput = ({
  label,
  value,
  onChange,
  selectedValue,
  onSelect,
  placeholder,
  localStops = [],
  googleEnabled = false,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      setSearching(true);
      const localMatches = localStops
        .filter((stop) => stop.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map((stop) => ({
          id: stop._id,
          label: stop.name,
          type: 'stop',
          stop,
        }));

      let googlePredictions = [];
      if (googleEnabled) {
        try {
          const response = await routesAPI.autocompletePlaces(value);
          googlePredictions = response.data.predictions
            .slice(0, 5)
            .map((prediction) => ({
              id: prediction.place_id,
              label: prediction.description,
              type: 'place',
              placeId: prediction.place_id,
            }));
        } catch (error) {
          console.warn('Google autocomplete failed', error);
          googlePredictions = [];
        }
      }

      setSuggestions([...localMatches, ...googlePredictions]);
      setSearching(false);
    };

    const timer = setTimeout(loadSuggestions, 250);
    return () => clearTimeout(timer);
  }, [value, localStops, googleEnabled]);

  const handleSelect = (item) => {
    if (item.type === 'stop') {
      onSelect({ type: 'stop', stop: item.stop });
      onChange(item.stop.name);
    } else {
      onSelect({ type: 'place', placeId: item.placeId, description: item.label });
      onChange(item.label);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    onSelect(null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onSelect(null);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {item.type === 'stop' ? 'Local stop' : 'Google place'}
              </div>
            </button>
          ))}
        </div>
      )}

      {googleEnabled && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Shows real-world places when Google Maps is configured.</p>
      )}
    </div>
  );
};
