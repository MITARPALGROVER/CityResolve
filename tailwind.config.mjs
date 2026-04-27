/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F7F6',
        surface: '#FFFFFF',
        primary: {
          green: '#10B981',
          secondary: '#059669',
          light: '#D1FAE5', // cute pastel green
        },
        pastel: {
          green: '#D1FAE5',
          orange: '#FFEDD5',
          blue: '#DBEAFE',
          purple: '#EDE9FE',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
        },
        status: {
          pending: '#F59E0B',
          progress: '#3B82F6',
          resolved: '#10B981',
          rejected: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
