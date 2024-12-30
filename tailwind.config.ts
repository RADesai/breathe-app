import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js.jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: '#E56399',
        orange: '#ffb24c',
        dark: '#605538'
      },
      fontFamily: {
        catamaran: ['Catamaran', 'sans-serif'],
        cherry: ['Cherry Swash', 'serif']
      }
    }
  },
  plugins: []
} satisfies Config;
