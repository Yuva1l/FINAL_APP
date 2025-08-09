import type { Config } from 'tailwindcss'
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { brand: {50:'#eef8ff',100:'#d6edff',200:'#b0dcff',300:'#7ac5ff',400:'#3da8ff',500:'#108cff',600:'#006fe0',700:'#0059b4',800:'#004a94',900:'#003b76'} },
      boxShadow: { glow: '0 0 30px rgba(16,140,255,0.35)' }
    }
  },
  plugins: []
} satisfies Config
