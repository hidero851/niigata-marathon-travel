/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8eef7',
          100: '#c5d4eb',
          200: '#9fb8dd',
          300: '#789bcf',
          400: '#5a85c4',
          500: '#3b6fb8',
          600: '#2d5a8e',
          700: '#1e3a5f',
          800: '#142840',
          900: '#0a1520',
        }
      },
    },
  },
  plugins: [],
}
