// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.emsifa.com',
  base: '/api-data-wilayah-v2/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
