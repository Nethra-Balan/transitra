/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7f5',
          100: '#e6f0eb',
          200: '#cce1d7',
          300: '#b3d1c2',
          400: '#9ac2ad',
          500: '#87a393', // Sage Green
          600: '#6b8375',
          700: '#4f6257',
          800: '#33423a',
          900: '#17211d',
        },
        accent: {
          purple: '#9B6B9B', // Plum
          terracotta: '#CD7B7B', // Terracotta
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
