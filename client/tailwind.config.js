/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // for React
    "./public/index.html",          // if you use CRA
  ],
  theme: {
    extend: {},  // place custom colors, fonts, spacing here
  },
  plugins: [],
};
