// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://get-verso.ai',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwindcss(), react()],
});
