import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js.jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: '#E56399',
        purple: '#3F2277', // - brand
        orange: '#ffb24c', // - brand
        // brown: '#e9cc94', // - brand
        // dark: '#605538', // - brand
        dark: '#1a090d',
        lightPink: '#F6C0D0',
        white: '#FBFBFF',
        // * STATUS COLORS
        red: '#FE5F55',
        green: '#84E296'
      },
      fontFamily: {
        catamaran: ['Catamaran', 'sans-serif'],
        cherry: ['Cherry Swash', 'serif']
      }
    }
  },
  plugins: []
} satisfies Config;
