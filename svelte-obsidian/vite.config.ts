import { sveltekit } from '@sveltejs/kit/vite';
import windiCSS from 'vite-plugin-windicss';
import { defineConfig } from 'vite';

import path from 'path';

export default defineConfig({
  plugins: [windiCSS(), sveltekit()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});