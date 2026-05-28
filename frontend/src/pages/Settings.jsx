export const Settings = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                <span className="text-gray-700 dark:text-gray-300">Prefer cheapest routes</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Less walking preferred</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Accessibility important</span>
              </label>
            </div>
          </div>

          <hr className="dark:border-gray-700" />

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accessibility</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Wheelchair accessible</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700 dark:text-gray-300">Visually impaired mode</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
