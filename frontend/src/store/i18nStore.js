import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Internationalization Store
 * Manages current language and translations
 */
export const useI18nStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      translations: {},

      setLanguage: (lang) => set({ language: lang }),

      t: (key, defaultValue = key) => {
        const { language, translations } = get();
        return translations?.[language]?.[key] || defaultValue;
      },

      setTranslations: (newTranslations) => set({ translations: newTranslations }),
    }),
    {
      name: 'i18n-store',
    }
  )
);
