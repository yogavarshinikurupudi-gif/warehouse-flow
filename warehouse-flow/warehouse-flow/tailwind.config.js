/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0b1020',
          900: '#0f172a',
          800: '#151f38',
          700: '#1c2947',
        },
        brand: {
          500: '#6366f1',
          400: '#818cf8',
          300: '#a5b4fc',
        },
        urgent: {
          500: '#f59e0b',
          400: '#fbbf24',
        },
        ok: {
          500: '#10b981',
          400: '#34d399',
        },
        crit: {
          500: '#f43f5e',
          400: '#fb7185',
        }
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
