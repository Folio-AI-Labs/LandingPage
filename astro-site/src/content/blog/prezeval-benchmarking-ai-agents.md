---
title: "PrezEval: Benchmarking AI Agents on Professional Slide Reproduction"
date: 2026-04-06
description: "How well can an AI agent reproduce a professional consulting slide from just a screenshot? We built a benchmark to find out."
---

## Goal

How well can an AI agent reproduce a professional consulting slide from just a screenshot?

PrezEval is a benchmark that measures exactly this. Given a target slide image and the original source presentation (with the correct layout pre-selected), an agent must edit the slide to match the target as closely as possible. A vision-language model then scores the result on a 1 to 5 scale by comparing structure, content, hierarchy, and styling.

This task is deceptively hard. Real consulting slides are dense, precise artifacts: a misaligned chart legend, a missing axis label, or a wrong color in a heatmap cell all count as failures. The benchmark tests not just whether an agent can write text to a slide, but whether it can handle charts, tables, custom shapes, multi-column layouts, and brand-specific styling: all at once.

## Benchmark Building

### Source material

We curated 61 slides from 10 professional presentation decks spanning major consulting and advisory firms: McKinsey, Bain, BCG, PwC, EY, and Deloitte, as well as law firms Cleary Gottlieb and Mattos Filho. These are real-world decks covering topics from healthcare economics to energy transitions to consumer privacy regulation.

The slides were selected to maximize visual complexity and diversity of elements. Here is what the benchmark contains:

| Element                           | Slides | Share |
|-----------------------------------|--------|-------|
| Charts (bar, line, pie, combo...) | 33     | 54%   |
| Multi-column layouts              | 24     | 39%   |
| Logos and icons                   | 17*    | 28%   |
| Tables                            | 14     | 23%   |
| Dense text layouts                | 13     | 21%   |
| Complex diagrams / timelines      | 8      | 13%   |
| Maps                              | 5      | 8%    |
| Custom composite shapes           | 3      | 5%    |

*\*Counting only substantive illustrative icons, not company logos (which appear on ~45 slides).*

### What makes it hard

**Charts dominate.** Over half the slides contain at least one chart: stacked bars, combo charts with dual axes, heatmap matrices, area charts. Reproducing a chart means getting the data values, axis labels, legends, colors, and positioning all correct.

**Layouts are intricate.** 39% of slides use multi-column layouts where content must be precisely placed. A McKinsey slide might have a bar chart on the left, a bullet list on the right, and a footnote bar at the bottom: all within a branded template.

**Custom shapes push the limits.** A few slides contain shapes built from geometric primitives: a funnel narrowing from 43K to 13K candidates, a cone-shaped process flow, a seesaw/lever comparing price points. These require the agent to compose multiple base shapes into a coherent visual.

**Dense legal text tests precision.** 13 slides from law firm decks contain long regulatory text with specific formatting: colored highlight boxes, hierarchical numbering, inline citations. Getting the structure right without losing content is a real challenge.

**Diversity of styles.** Each source firm has its own visual identity: color palettes, font choices, layout conventions. The agent can't rely on a single template: it must adapt to 10 different design systems across 21 different slide layouts.

### Task setup

For each of the 61 tasks, the agent receives:
- The source `.pptx` file with the correct slide layout pre-selected
- A screenshot of the target slide to reproduce
- The instruction: *"Recreate the slide shown in the attached image: reproduce it exactly."*

The agent then edits the slide through tool calls, and the final result is rendered as a PNG and scored by a vision-language model evaluator.

## Results

We compared three configurations:

| Config                | Score | Time   | Steps | Tasks |
|-----------------------|-------|--------|-------|-------|
| **Verso Medium**      | 49.6% | 207.7s | 8.8   | 61/61 |
| **Verso Fast**        | 38.9% | 157.5s | 9.5   | 61/61 |
| Claude for Powerpoint | 36.5% | 176.5s | 11.6  | 61/61 |

**Verso Medium** achieves the highest score at 49.6%, corresponding to an average rating of ~3/5: meaning most reproductions capture the right structure and content but have noticeable differences in styling or positioning.

**Verso Fast** trades accuracy for speed, completing tasks 24% faster while scoring 38.9%. Interestingly, it uses more steps on average (9.5 vs 8.8), suggesting the smaller model takes more exploratory actions.

**Claude for Powerpoint** (a baseline using Claude Opus) scores 36.5% despite using the most steps (11.6) and significantly more compute.

### Score breakdown by content type

Breaking down average ratings by what the slide contains reveals clear patterns:

| Content type       | Verso Medium | Claude for PPT |
|--------------------|--------------|----------------|
| Dense text         | 3.67         | 2.93           |
| Non-chart slides   | 3.54         | 2.79           |
| Tables             | 2.93         | 2.53           |
| Diagrams           | 2.89         | 2.00           |
| Charts             | 2.52         | 2.18           |
| Maps               | 1.50         | 1.50           |
| **Overall**        | **2.98**     | **2.46**       |

Text-heavy slides are the easiest category, while maps are the hardest (equally bad for both agents). Charts, which make up 54% of the benchmark, pull the overall score down significantly.

### Where Verso excels

Verso consistently scores well on structured text slides: formatted legal text, multi-section layouts with colored boxes, table-of-contents style pages, and multi-column icon layouts. On these, both Verso Medium and Verso Fast achieve near-perfect scores (4-5/5), while Claude for Powerpoint typically lags a full point behind.

### What remains hard for everyone

About 20% of the benchmark is essentially unsolved: all three agents score 2 or below. The common failure modes:

- **Geographic maps.** Agents struggle to produce accurate map visualizations. They may substitute the map with an unrelated shape, render it at the wrong scale, or lose state-level color coding. Verso does attempt maps but the results are consistently poor: a US map might appear shrunken with missing detail, or a world map might be replaced by a circular diagram.
- **Complex charts with dense data.** Combo charts (bars + lines on dual axes), multi-panel dashboards, and heatmap matrices consistently break all agents. Common failures include entire charts missing, axis labels dropped, and data values absent.
- **Custom composite shapes.** Funnels built from trapezoids, quadrant charts with curved dividers, and similar constructions require precise layering and alignment that agents can't yet achieve reliably.

### Where Verso still has room to grow

On about 15 tasks, both Verso variants struggle (scoring 2 or below) while Claude for Powerpoint sometimes does better. These tend to be slides with large structured grids, brand logos embedded in charts, or decorative elements. This suggests specific opportunities to improve Verso's handling of these patterns.

All results, including per-task generated vs. reference images and evaluator critiques, are available in [the PrezEval repository](https://github.com/VersoLabs/PrezEvalPublic).
