import React from 'react';
import { Volume2, Eye, TextCursorInput, Accessibility } from 'lucide-react';

export const AccessibilitySettings = ({ preferences, onUpdate }) => {
  const accessibilityModes = [
    {
      id: 'high_contrast',
      name: 'High Contrast Mode',
      description: 'Improved visibility with high contrast colors',
      icon: Eye,
    },
    {
      id: 'large_text',
      name: 'Large Text',
      description: 'Increase font sizes for easier reading',
      icon: TextCursorInput,
    },
    {
      id: 'focus_mode',
      name: 'Focus Mode',
      description: 'Highlight important elements, reduce distractions',
      icon: Accessibility,
    },
    {
      id: 'audio_cues',
      name: 'Audio Cues',
      description: 'Provide sound feedback for interactions',
      icon: Volume2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Accessibility Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessibilityModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = preferences?.accessibility?.[mode.id];

            return (
              <label
                key={mode.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive || false}
                  onChange={(e) => {
                    onUpdate({
                      accessibility: {
                        ...(preferences?.accessibility || {}),
                        [mode.id]: e.target.checked,
                      },
                    });
                  }}
                  className="mt-1 w-5 h-5 rounded accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'} />
                    <h4 className="font-medium text-slate-900 dark:text-white">{mode.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{mode.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Text Size</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">Small</span>
          <input
            type="range"
            min="1"
            max="5"
            value={preferences?.fontSize || 3}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">Large</span>
        </div>
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p style={{ fontSize: `${0.875 + preferences?.fontSize * 0.25}rem` }} className="text-slate-900 dark:text-white">
            Sample text with current size
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Motor Control</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={preferences?.motorControl?.larger_buttons || false}
              onChange={(e) => {
                onUpdate({
                  motorControl: {
                    ...(preferences?.motorControl || {}),
                    larger_buttons: e.target.checked,
                  },
                });
              }}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <span className="text-slate-900 dark:text-white font-medium">Larger Buttons</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={preferences?.motorControl?.increased_spacing || false}
              onChange={(e) => {
                onUpdate({
                  motorControl: {
                    ...(preferences?.motorControl || {}),
                    increased_spacing: e.target.checked,
                  },
                });
              }}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <span className="text-slate-900 dark:text-white font-medium">Increased Spacing</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Visual</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={preferences?.visual?.reduce_animations || false}
              onChange={(e) => {
                onUpdate({
                  visual: {
                    ...(preferences?.visual || {}),
                    reduce_animations: e.target.checked,
                  },
                });
              }}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <span className="text-slate-900 dark:text-white font-medium">Reduce Animations</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={preferences?.visual?.monochrome || false}
              onChange={(e) => {
                onUpdate({
                  visual: {
                    ...(preferences?.visual || {}),
                    monochrome: e.target.checked,
                  },
                });
              }}
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
            <span className="text-slate-900 dark:text-white font-medium">Monochrome Mode</span>
          </label>
        </div>
      </div>
    </div>
  );
};
