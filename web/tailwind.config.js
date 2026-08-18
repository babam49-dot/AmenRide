/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // zinc-950
        card: '#18181b',       // zinc-900
        'card-hover': '#27272a', // zinc-800
        border: '#27272a',
        primary: {
          DEFAULT: '#f59e0b', // warm amber / gold
          hover: '#d97706',
          light: '#fef3c7',
        },
        emerald: {
          accent: '#10b981',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
        amen: {
          dark: '#09090b',
          card: '#18181b',
          amber: '#f59e0b',
          emerald: '#10b981',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Ethiopic', 'sans-serif'],
      },
      boxShadow: {
        'amber-glow': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'card-shadow': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
