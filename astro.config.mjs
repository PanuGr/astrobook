// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://astroobook.netlify.app",
  prefetch: true,
  vite: {
    plugins: [tailwindcss()]
  }
});