// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://get-folio.ai',
  markdown: {
    // Rename the auto-generated footnotes section to "References" and make it
    // visible (the default label is "Footnotes" and screen-reader-only).
    remarkRehype: {
      footnoteLabel: 'References',
      footnoteLabelProperties: { className: [] },
    },
  },
  integrations: [
    tailwindcss(),
    react(),
    // Keep noindex redirect stubs (wiki -> /support/, localized terms -> /terms/)
    // out of the sitemap so it only lists indexable pages.
    sitemap({
      filter: (page) =>
        !/\/wiki\/$/.test(page) && !/\/(de|fr|es)\/terms\/$/.test(page),
    }),
  ],
});
