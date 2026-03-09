/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand': '#1a1a1a',
        'brand-bg': '#f8f8f8',
        'brand-muted': '#666666',
        'brand-light': '#999999',
        'brand-border': '#e0e0e0',
        'brand-dark': '#2a2a2a',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'heading': ['"Spectral"', 'serif'],
        'body': ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        'pill': '50px',
      },
      maxWidth: {
        'narrow': '800px',
      },
      screens: {
        'nav': '900px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
