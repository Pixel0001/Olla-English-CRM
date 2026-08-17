/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand colors — same as web
        brand: {
          900: '#1e3a8a', // blue-900
          800: '#1e40af',
          700: '#1d4ed8',
          600: '#2563eb',
        },
        accent: {
          400: '#fbbf24', // amber-400
          300: '#fcd34d',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
