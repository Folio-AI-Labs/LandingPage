import React from 'react';
import Plot from 'react-plotly.js';

const verso = [
  { name: 'Verso Medium', score: 49.6, time: 207.7 },
  { name: 'Verso Fast', score: 38.9, time: 157.5 },
];

const claude = [
  { name: 'Claude for Powerpoint', score: 36.5, time: 176.5 },
];

export default function PerformanceSpeedChart() {
  return (
    <Plot
      data={[
        // Pareto frontier dashed line
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
          marker: { color: '#000000', size: 16, symbol: 'diamond' },
          text: verso.map(d => d.name),
          textposition: ['top center', 'bottom center'],
          textfont: { size: 13, color: '#000000', family: 'Inter, sans-serif', weight: 600 },
          name: 'Verso',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
        // Claude marker
        {
          x: claude.map(d => d.time),
          y: claude.map(d => d.score),
          mode: 'markers+text',
          marker: { color: '#D4A27F', size: 16, symbol: 'circle' },
          text: claude.map(d => d.name),
          textposition: ['bottom center'],
          textfont: { size: 13, color: '#D4A27F', family: 'Inter, sans-serif', weight: 600 },
          name: 'Claude',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
      ]}
      layout={{
        width: 700,
        height: 460,
        margin: { l: 60, r: 30, t: 30, b: 60 },
        xaxis: {
          title: { text: 'Time per task (s)', font: { size: 13, family: 'Inter, sans-serif', color: '#999' }, standoff: 12 },
          range: [140, 225],
          gridcolor: '#f0f0f0',
          zeroline: false,
          autorange: false,
          tickfont: { size: 11, color: '#aaa', family: 'Inter, sans-serif' },
        },
        yaxis: {
          title: { text: 'Score (%)', font: { size: 13, family: 'Inter, sans-serif', color: '#999' }, standoff: 8 },
          range: [30, 55],
          gridcolor: '#f0f0f0',
          zeroline: false,
          autorange: false,
          tickfont: { size: 11, color: '#aaa', family: 'Inter, sans-serif' },
        },
        plot_bgcolor: '#fafafa',
        paper_bgcolor: 'transparent',
        font: { family: 'Inter, sans-serif' },
        showlegend: false,
        shapes: [
          {
            type: 'path',
            path: 'M 140,55 L 200,55 L 140,38 Z',
            fillcolor: 'rgba(34, 197, 94, 0.07)',
            line: { width: 0 },
          },
        ],
        annotations: [
          {
            x: 143,
            y: 53,
            text: '<b>\u2191 Better</b>',
            showarrow: false,
            font: { size: 22, color: '#ccc', family: 'Inter, sans-serif' },
            xanchor: 'left',
          },
          {
            x: 143,
            y: 51,
            text: '<b>\u2190 Faster</b>',
            showarrow: false,
            font: { size: 22, color: '#ccc', family: 'Inter, sans-serif' },
            xanchor: 'left',
          },
        ],
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', maxWidth: 700 }}
    />
  );
}
