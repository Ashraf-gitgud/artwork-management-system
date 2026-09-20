/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#e0e8f0',
          200: '#b8c9dc',
          300: '#8ba3c0',
          400: '#5c7a9e',
          500: '#3d5a80',
          600: '#2f4a6f',
          700: '#243b5e',
          800: '#1a2f4d',
          900: '#0f1f3a',
          950: '#0a1628',
        },
      },
    },
  },
  plugins: [],
};