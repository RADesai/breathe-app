import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite";

import netlifyPlugin from '@netlify/vite-plugin-react-router';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    netlifyPlugin()
  ]
});
