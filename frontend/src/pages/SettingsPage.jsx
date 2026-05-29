import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/store';
import { AccessibilitySettings } from '../components/AccessibilitySettings';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { LoadingSpinner, SkeletonLoader } from '../components/Loading';
import { Save } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [preferences, setPreferences] = useState({});
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setPreferences(data.preferences || {});
      setLanguage(data.preferences?.language || 'en');
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...preferences,
          language,
        }),
      });

      if (response.ok) {
        setMessage('Preferences saved successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your preferences and account</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully')
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
        }`}>
          {message}
        </div>
      )}

      {/* Settings Tabs */}
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Display</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
              <span className="font-medium text-slate-900 dark:text-white">Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Language
              </label>
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Accessibility</h2>
          <AccessibilitySettings
            preferences={preferences}
            onUpdate={(updates) => setPreferences({ ...preferences, ...updates })}
          />
        </div>

        {/* Travel Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Travel Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                What's your priority?
              </label>
              <div className="space-y-2">
                {[
                  { id: 'fastest', label: 'Fastest route', icon: '⚡' },
                  { id: 'cheapest', label: 'Cheapest route', icon: '💰' },
                  { id: 'accessible', label: 'Accessibility', icon: '♿' },
                  { id: 'leastWalking', label: 'Least walking', icon: '🚶' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="routePreference"
                      value={option.id}
                      checked={preferences?.routePreference === option.id}
                      onChange={(e) =>
                        setPreferences({ ...preferences, routePreference: e.target.value })
                      }
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Walking Distance (km)
              </label>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={preferences?.maxWalkingDistance || 1}
                onChange={(e) =>
                  setPreferences({ ...preferences, maxWalkingDistance: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Needs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Accessibility Needs</h2>
          <div className="space-y-3">
            {[
              { id: 'wheelchair', label: 'Wheelchair accessible' },
              { id: 'visual_impairment', label: 'Visual impairment assistance' },
              { id: 'hearing', label: 'Hearing assistance' },
              { id: 'mobility', label: 'Mobility assistance' },
            ].map((need) => (
              <label
                key={need.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={preferences?.accessibility?.[need.id] || false}
                  onChange={(e) => {
                    setPreferences({
                      ...preferences,
                      accessibility: {
                        ...(preferences?.accessibility || {}),
                        [need.id]: e.target.checked,
                      },
                    });
                  }}
                  className="w-5 h-5 rounded accent-primary cursor-pointer"
                />
                <span className="text-slate-900 dark:text-white font-medium">{need.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
