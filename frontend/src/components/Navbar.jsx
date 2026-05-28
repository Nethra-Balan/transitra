import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useUIStore } from '../store/store.js';
import { Menu, LogOut, Settings, Moon, Sun } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Transitra</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/routes" className="text-gray-700 dark:text-gray-300 hover:text-primary-500">
                  Routes
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400">{user?.name}</span>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to="/settings"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings size={20} className="text-gray-600 dark:text-gray-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} className="text-red-600" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button onClick={onMenuClick} className="md:hidden p-2">
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
