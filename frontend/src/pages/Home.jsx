import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { MapPin, Zap, Award, Users } from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Smart Route Planning',
      description: 'Get multiple route options optimized for speed, cost, or accessibility',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Intelligent recommendations powered by Gemini AI for personalized travel',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Accessibility First',
      description: 'Special features for users with mobility, visual, or hearing challenges',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Personalized',
      description: 'Your preferences are remembered and used to improve suggestions',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Travel Smart with <span className="text-primary-500">Transitra</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your AI-powered public transport companion. Get intelligent route recommendations,
            navigate with confidence, and travel accessible.
          </p>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-soft text-lg"
            >
              Get Started
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/routes"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-soft text-lg"
            >
              Plan Your Route
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-soft transition-shadow"
            >
              <div className="text-primary-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-primary-500 text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to explore?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users making their commute smarter and easier.
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-primary-500 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
