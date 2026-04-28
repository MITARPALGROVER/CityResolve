/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium light green theme
        primary: {
          emerald: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          teal: {
            50: '#F0FDFA',
            100: '#CCFBF1',
            200: '#99F6E4',
            300: '#5EEAD4',
            400: '#2DD4BF',
            500: '#14B8A6',
            600: '#0D9488',
            700: '#0F766E',
            800: '#115E59',
            900: '#134E4A',
          },
          lime: {
            50: '#F7FEE7',
            100: '#ECFCCB',
            200: '#D9F99D',
            300: '#BEF264',
            400: '#A3E635',
            500: '#84CC16',
            600: '#65A30D',
            700: '#4D7C0F',
            800: '#3F6212',
            900: '#365314',
          },
          // Legacy support
          green: '#10B981',
          secondary: '#059669',
          light: '#D1FAE5',
        },
        // Professional neutral palette
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Semantic colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        status: {
          pending: '#F59E0B',
          progress: '#3B82F6',
          resolved: '#10B981',
          rejected: '#EF4444',
        },
        // Glassmorphism colors
        glass: {
          surface: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(255, 255, 255, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // Premium shadows
      boxShadow: {
        'glass-sm': '0 4px 12px rgba(0, 0, 0, 0.03)',
        'glass-md': '0 8px 24px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 12px 32px rgba(0, 0, 0, 0.08)',
        'brand-soft': '0 4px 14px rgba(16, 185, 129, 0.15)',
        'brand-medium': '0 6px 20px rgba(16, 185, 129, 0.2)',
        'brand-strong': '0 8px 30px rgba(16, 185, 129, 0.25)',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
        '3xl': '16px',
      },
      // Premium border radius
      borderRadius: {
        '4xl': '2rem',
      },
      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}