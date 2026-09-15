export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c2d6b',
        },
        secondary: {
          500: '#ec4899',
          600: '#db2777',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: {
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        glow: '0 0 15px rgba(14, 165, 233, 0.5)',
      },
    },
  },
  plugins: [],
}
