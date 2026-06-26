import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function read(relativePath) {
  return readFile(path.join(rootDir, relativePath), 'utf8');
}

test('layout and tailwind keep a reduced font stack centered on Arizona Flare', async () => {
  const layout = await read('src/layouts/Layout.astro');
  const tailwind = await read('tailwind.config.mjs');

  assert.match(layout, /@fontsource\/inter/);
  assert.match(layout, /arizona-flare\.css/);
  assert.doesNotMatch(layout, /@fontsource\/spectral/);
  assert.doesNotMatch(layout, /fonts\.googleapis\.com/);
  assert.match(tailwind, /'display': \['"ABC Arizona Flare"', 'serif'\]/);
  assert.match(tailwind, /'heading': \['"ABC Arizona Flare"', 'serif'\]/);
});

test('navbar keeps a smaller information architecture with a single get started CTA', async () => {
  const nav = await read('src/components/Nav.astro');
  const translations = await read('src/i18n/translations.ts');
  const supportPage = await read('src/pages/support.astro');

  assert.match(nav, /t\('nav\.home'\)/);
  assert.match(nav, /t\('nav\.features'\)/);
  assert.match(nav, /t\('nav\.pricing'\)/);
  assert.match(nav, /t\('nav\.support'\)/);
  assert.doesNotMatch(nav, /t\('nav\.models'\)/);
  assert.doesNotMatch(nav, /t\('nav\.bookDemo'\)/);
  assert.equal((nav.match(/t\('nav\.getStarted'\)/g) || []).length, 2);
  assert.equal((translations.match(/'nav\.support':/g) || []).length, 4);
  assert.match(supportPage, /<Nav activePage="Support" \/>/);
});

test('performance chart renders a dated Prezeval note', async () => {
  const chart = await read('src/components/PerformanceChart.astro');
  const translations = await read('src/i18n/translations.ts');

  assert.match(chart, /Intl\.DateTimeFormat/);
  assert.match(chart, /t\('models\.evaluation'\)/);
  assert.match(chart, /<time dateTime=\{evaluationDateIso\}>\{evaluationDate\}<\/time>/);
  assert.equal((translations.match(/'models\.evaluation':/g) || []).length, 4);
});

test('performance speed chart keeps Anthropic labels and axes styling aligned with the article spec', async () => {
  const chart = await read('src/components/PerformanceSpeedChart.tsx');

  assert.match(chart, /line: \{ color: '#D4A27F', width: 2, dash: 'dash' \}/);
  assert.match(chart, /textposition: \['bottom center', 'bottom center'\]/);
  assert.match(chart, /xaxis:[\s\S]*showline: true[\s\S]*linecolor: '#000000'/);
  assert.match(chart, /yaxis:[\s\S]*showline: true[\s\S]*linecolor: '#000000'/);
});
