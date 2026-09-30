/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode via class — toggle by adding/removing 'dark' on <html>
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // ── Brand accent ──────────────────────────────────────────────
        // Cyan — primary CTAs, active states, key highlights
        brand: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#3BB3E5',  // ← primary brand cyan (matches live app)
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },

        // ── Surface / background ──────────────────────────────────────
        // Dark theme surfaces — layered depth, no pure black
        surface: {
          // Dark mode
          'dark-base':  '#071318',  // deepest bg (body)
          'dark-raised': '#0D1E27', // cards, panels on base
          'dark-overlay': '#112633',// modals, dropdowns on raised
          'dark-border': '#1E3A4A', // subtle borders in dark mode
          // Light mode
          'light-base':   '#F9FAFB',
          'light-raised':  '#FFFFFF',
          'light-overlay': '#F3F4F6',
          'light-border':  '#E5E7EB',
        },

        // ── Semantic status colors ─────────────────────────────────────
        // Keep these strict — each color means ONE thing
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        danger: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },

        // ── Gamification (yellow/gold) — use ONLY for points/rewards ──
        reward: {
          light: '#FEF9C3',
          DEFAULT: '#EAB308',
          dark: '#854D0E',
        },
      },

      // ── Typography ────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
      },

      // ── Spacing extras ────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      // ── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },

      // ── Backdrop blur ─────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Box shadow ────────────────────────────────────────────────────
      boxShadow: {
        'card-dark': '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
        'card-light': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'glow-brand': '0 0 20px rgba(59,179,229,0.25)',
      },

      // ── Transition ────────────────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
      },

      // ── Animation ────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },

  plugins: [],
}
