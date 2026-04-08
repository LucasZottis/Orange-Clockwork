import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lucaszottis.github.io',
  base: '/Timer',
  vite: {
    plugins: [tailwindcss()],
  },
});
