import React from 'react';
import Plot from 'react-plotly.js';

const data = [
  { name: 'Verso Medium', score: 49.6, time: 207.7, color: '#000000' },
  { name: 'Verso Fast', score: 38.9, time: 157.5, color: '#000000' },
  { name: 'Claude for Powerpoint', score: 36.5, time: 176.5, color: '#a0522d' },
];

const verso = data.filter(d => d.name.startsWith('Verso'));
const claude = data.filter(d => !d.name.startsWith('Verso'));

export default function PerformanceSpeedChart() {
  return (
    <Plot
      data={[
        // Pareto frontier (dashed line connecting Verso points)
        {
          x: verso.map(d => d.time),
          y: verso.map(d => d.score),
          mode: 'lines',
          line: { color: '#000000', width: 2, dash: 'dash' },
          showlegend: false,
          hoverinfo: 'skip',
        },
        // Verso markers
        {
          x: verso.map(d => d.time),
          y: verso.map(d => d.score),
          mode: 'markers+text',
          marker: { color: '#000000', size: 14, symbol: 'diamond' },
          text: verso.map(d => d.name),
          textposition: ['top center', 'bottom center'],
          textfont: { size: 13, color: '#000000', family: 'Inter, sans-serif' },
          name: 'Verso',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
        // Claude marker
        {
          x: claude.map(d => d.time),
          y: claude.map(d => d.score),
          mode: 'markers+text',
          marker: { color: '#a0522d', size: 14, symbol: 'circle' },
          text: claude.map(d => d.name),
          textposition: ['bottom center'],
          textfont: { size: 13, color: '#a0522d', family: 'Inter, sans-serif' },
          name: 'Claude',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
      ]}
      layout={{
        width: 700,
        height: 450,
        margin: { l: 70, r: 40, t: 40, b: 70 },
        xaxis: {
          title: { text: 'Time per task (seconds)', font: { size: 14, family: 'Inter, sans-serif' } },
          range: [140, 225],
          gridcolor: '#eee',
          autorange: false,
        },
        yaxis: {
          title: { text: 'Score (%)', font: { size: 14, family: 'Inter, sans-serif' } },
          range: [30, 55],
          gridcolor: '#eee',
          autorange: false,
        },
        plot_bgcolor: '#fafafa',
        paper_bgcolor: 'transparent',
        font: { family: 'Inter, sans-serif' },
        showlegend: false,
        annotations: [
          {
            x: 145,
            y: 54,
            text: '\u2190 faster & better \u2191',
            showarrow: false,
            font: { size: 11, color: '#999', family: 'Inter, sans-serif' },
          },
        ],
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', maxWidth: 700 }}
    />
  );
}
