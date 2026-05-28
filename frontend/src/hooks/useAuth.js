import { useAuthStore } from '../store/store.js';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout, updateUser } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    updateUser,
  };
};
