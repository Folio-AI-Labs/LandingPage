import React from 'react';
import Plot from 'react-plotly.js';

const folio = [
  { name: 'Folio Max', score: 70.0, time: 138.9 },
  { name: 'Folio Fast', score: 43.0, time: 92.0 },
];

const claude = [
  { name: 'Claude for PowerPoint', score: 46.9, time: 962.8 },
];

// Pareto frontier (top-left envelope): Folio Fast is the fastest config and Folio
// Max the most accurate, so the two Folio points trace the frontier. Claude for
// PowerPoint is dominated (slower and less accurate than Folio Max).
const frontier = [
  { score: 43.0, time: 92.0 },
  { score: 70.0, time: 138.9 },
];

export default function PerformanceSpeedChart() {
  return (
    <Plot
      data={[
        // Pareto frontier dashed line
        {
          x: frontier.map(d => d.time),
          y: frontier.map(d => d.score),
          mode: 'lines',
          line: { color: '#000000', width: 2, dash: 'dash' },
          showlegend: false,
          hoverinfo: 'skip',
        },
        // Folio markers
        {
          x: folio.map(d => d.time),
          y: folio.map(d => d.score),
          mode: 'markers+text',
          marker: { color: '#000000', size: 16, symbol: 'diamond' },
          text: folio.map(d => d.name),
          textposition: ['top center', 'bottom center'],
          textfont: { size: 13, color: '#000000', family: 'Inter, sans-serif', weight: 600 },
          name: 'Folio',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
        // Claude marker
        {
          x: claude.map(d => d.time),
          y: claude.map(d => d.score),
          mode: 'markers+text',
          marker: { color: '#D4A27F', size: 16, symbol: 'circle' },
          text: claude.map(d => d.name),
          textposition: ['top center'],
          textfont: { size: 13, color: '#D4A27F', family: 'Inter, sans-serif', weight: 600 },
          name: 'Claude',
          hovertemplate: '%{text}<br>Score: %{y:.1f}%<br>Time: %{x:.0f}s<extra></extra>',
        },
      ]}
      layout={{
        width: 700,
        height: 460,
        margin: { l: 60, r: 40, t: 30, b: 60 },
        xaxis: {
          title: { text: 'Time per task (s, log scale)', font: { size: 13, family: 'Inter, sans-serif', color: '#000000' }, standoff: 12 },
          type: 'log',
          range: [Math.log10(75), Math.log10(1200)],
          tickvals: [100, 150, 200, 300, 500, 1000],
          ticktext: ['100', '150', '200', '300', '500', '1000'],
          gridcolor: '#f0f0f0',
          zeroline: false,
          autorange: false,
          showline: true,
          tickfont: { size: 11, color: '#000000', family: 'Inter, sans-serif' },
          linecolor: '#000000',
          tickcolor: '#000000',
        },
        yaxis: {
          title: { text: 'Score (%)', font: { size: 13, family: 'Inter, sans-serif', color: '#000000' }, standoff: 8 },
          range: [38, 76],
          gridcolor: '#f0f0f0',
          zeroline: false,
          autorange: false,
          showline: true,
          tickfont: { size: 11, color: '#000000', family: 'Inter, sans-serif' },
          linecolor: '#000000',
          tickcolor: '#000000',
        },
        plot_bgcolor: '#fafafa',
        paper_bgcolor: 'transparent',
        font: { family: 'Inter, sans-serif' },
        showlegend: false,
        annotations: [
          {
            xref: 'paper',
            yref: 'paper',
            x: 0.02,
            y: 0.98,
            text: '<b>↑ Better</b>',
            showarrow: false,
            font: { size: 20, color: '#ccc', family: 'Inter, sans-serif' },
            xanchor: 'left',
            yanchor: 'top',
          },
          {
            xref: 'paper',
            yref: 'paper',
            x: 0.02,
            y: 0.88,
            text: '<b>← Faster</b>',
            showarrow: false,
            font: { size: 20, color: '#ccc', family: 'Inter, sans-serif' },
            xanchor: 'left',
            yanchor: 'top',
          },
        ],
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', maxWidth: 700 }}
    />
  );
}
