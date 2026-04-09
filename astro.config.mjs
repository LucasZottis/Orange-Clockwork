import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// astro.config.mjs
export default defineConfig({
  site: 'https://lucaszottis.github.io',
  base: process.env.GITHUB_ACTIONS ? '/Orange-Clockwork/' : '',
  vite: {
    plugins: [tailwindcss()],
  },
});
