import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useRoutesStore = create((set) => ({
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,

  setRoutes: (routes) => set({ routes }),
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export const useUIStore = create(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: false,
      fontSize: 'normal', // 'small', 'normal', 'large', 'xlarge'

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setFontSize: (size) => set({ fontSize: size }),
    }),
    {
      name: 'ui-store',
    }
  )
);

export const usePreferencesStore = create((set) => ({
  preferences: null,
  loading: false,

  setPreferences: (preferences) => set({ preferences }),
  setLoading: (loading) => set({ loading }),
}));
