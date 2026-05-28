import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { X } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();

  const links = [
    { label: 'Home', href: '/', private: false },
    { label: 'Route Planner', href: '/routes', private: true },
    { label: 'Saved Routes', href: '/saved-routes', private: true },
    { label: 'Settings', href: '/settings', private: true },
  ];

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-bold mb-8 mt-4">Menu</h2>

          <nav className="space-y-4">
            {links.map((link) => {
              if (link.private && !isAuthenticated) return null;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={onClose}
                  className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
