/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937'
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
