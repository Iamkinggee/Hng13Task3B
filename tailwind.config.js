// tailwind.config.js
module.exports = {
  content: [
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './global.css', // Include CSS if needed
  ],
  darkMode: 'class', // Required for dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};