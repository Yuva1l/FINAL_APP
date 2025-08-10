import type { Config } from 'tailwindcss'
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Playful neon palette used across the app
      colors: {
        vibe: {
          pink: '#ff8ae2',
          orange: '#ffc27c',
          green: '#a8ffb0',
          purple: '#d2b3ff',
          blue: '#a5e4ff'
        }
      },
      // Soft glowing shadow for buttons/cards
      boxShadow: {
        glow: '0 0 20px rgba(255,138,226,0.45)'
      },
      // Custom fonts defined via CSS variables in layout.tsx
      fontFamily: {
        heading: ['var(--font-heading)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif']
      },
      // Gentle motion utilities
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        gradient: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        gradient: 'gradient 30s ease infinite'
      }
    }
  },
  plugins: []
} satisfies Config
