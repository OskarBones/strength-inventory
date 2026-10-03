import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },

  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }), react(), tailwindcss(), sentryVitePlugin({
      org: 'strength-inventory',
      project: 'strory-frontend'
    })
  ],

  build: {
    sourcemap: true
  }
});
