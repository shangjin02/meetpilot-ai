/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dff0ff',
          500: '#2f8fe8',
          600: '#1f75ca',
          700: '#185ea4'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(31, 117, 202, 0.08)'
      }
    },
  },
  plugins: [],
};
