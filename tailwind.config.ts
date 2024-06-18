import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js.jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'purple': '#412677',
        'orange': '#ffb24c',
      }
    },
  },
  plugins: [],
} satisfies Config;
