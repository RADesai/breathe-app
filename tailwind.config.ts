import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js.jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: '#E56399',
        orange: '#ffb24c',
        dark: '#2d3142'
      }
    }
  },
  plugins: []
} satisfies Config;
