import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Tema basado en variables CSS: los colores del resaltado se definen
      // en global.css y acompañan la paleta del sitio en modo claro y oscuro.
      theme: 'css-variables',
    },
  },
});
