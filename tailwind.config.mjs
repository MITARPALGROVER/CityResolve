/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F0A',
        surface: '#0D1F0D',
        primary: {
          green: '#22C55E',
          secondary: '#16A34A',
        },
        accent: {
          teal: '#2DD4BF',
          lime: '#A3E635',
        },
        text: {
          primary: '#F0FDF4',
          secondary: '#86EFAC',
          muted: 'rgba(74, 222, 128, 0.5)',
        },
        status: {
          pending: '#F59E0B',
          progress: '#3B82F6',
          resolved: '#22C55E',
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
