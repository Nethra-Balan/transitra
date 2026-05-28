import React from 'react';
import { Globe } from 'lucide-react';
import { useUIStore } from '../store/store';

export const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe size={20} className="text-slate-600 dark:text-slate-400" />
      <select
        value={currentLanguage || 'en'}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
