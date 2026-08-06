/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060911',
          900: '#080c14',
          850: '#0b0f19',
          800: '#0e1422',
          700: '#151d30',
        },
        brand: {
          orange: '#f97316',
          'orange-hover': '#ea580c',
          teal: '#14b8a6',
          'teal-hover': '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
