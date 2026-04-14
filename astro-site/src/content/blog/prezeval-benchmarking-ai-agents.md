---
title: "PrezEval: Benchmarking AI Agents on Professional Slides"
date: 2026-04-06
description: "How well can an AI agent reproduce a professional consulting slide from just a screenshot? We built a benchmark to find out."
lang: en
---

## Goal

How well can an AI agent reproduce professional consulting slides from visual guidance?

After building Verso, we've come to the belief that our aproach produces far superior results to others.

But let's put numbers on that.

PrezEval is a benchmark that measures exactly this. Given a target slide image and the original source presentation (with the correct layout pre-selected), an agent must edit the slide to match the target as closely as possible. A vision-language model then scores the result by comparing structure, content, hierarchy, and styling.

This task is deceptively hard. Real consulting slides are dense, precise artifacts: a misaligned chart legend, a missing axis label, or a wrong color in a heatmap cell all count as failures. The benchmark tests not just whether an agent can write text to a slide, but whether it can handle charts, tables, custom shapes, multi-column layouts, and brand-specific styling, all at once.

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

- **Diversity of styles.** Each source firm has its own visual identity: color palettes, font choices, layout conventions. The agent can't rely on a single template: it must adapt to 10 different design systems across 21 different slide layouts.
- **Charts dominate.** Over half the slides contain at least one chart: stacked bars, combo charts with dual axes, heatmap matrices, area charts. Reproducing a chart means getting the data values, axis labels, legends, colors, and positioning all correct.
- **Layouts are intricate.** 39% of slides use multi-column layouts where content must be precisely placed. A McKinsey slide might have a bar chart on the left, a bullet list on the right, and a footnote bar at the bottom: all within a branded template.
- **Custom shapes push the limits.** A few slides contain shapes built from geometric primitives: a funnel narrowing from 43K to 13K candidates, a cone-shaped process flow, a seesaw/lever comparing price points. These require the agent to compose multiple base shapes into a coherent visual.

### Task setup

For each of the 61 tasks, the agent receives:
- The source `.pptx` file with the correct slide layout pre-selected (this reproduces the real setting where the user starts by loading their company's pptx template)
- A screenshot of the target slide to reproduce
- The instruction: *"Recreate the slide shown in the attached image: reproduce it exactly."*

The agent then edits the slide through tool calls, and the final result is rendered as a PNG and scored by a vision-language model evaluator. The evaluator rates each result on an integer scale of 1 to 5, since [research shows](https://arxiv.org/abs/2601.03444) that a compact integer scale maximizes human-LLM alignment for LLM-as-a-judge setups. We then convert ratings to a 0-100% score for readability.

## Results

We compared five configurations:

| Config                          | Score | Time   | Steps | Tasks |
|---------------------------------|-------|--------|-------|-------|
| **Verso Max**                   | 70.8% | 293.4s | 6.3   | 60/61 |
| **Verso Medium**                | 49.6% | 207.7s | 8.8   | 61/61 |
| **Verso Fast**                  | 38.9% | 157.5s | 9.5   | 61/61 |
| Claude for Powerpoint (Opus)    | 36.5% | 176.5s | 11.6  | 61/61 |
| Claude for Powerpoint (Sonnet)  | 32.4% | 154.4s | 9.2   | 61/61 |

**Verso Max** leads by a wide margin at 70.8%, nearly doubling the score of the next-best non-Verso agent. It achieves this with the fewest steps on average (6.3), suggesting a more efficient approach to slide reproduction, though it takes longer per task (293.4s) due to deeper reasoning.

**Verso Medium** scores 49.6%: most reproductions capture the right structure and content but have noticeable differences in styling or positioning.

**Verso Fast** trades accuracy for speed, completing tasks 24% faster than Verso Medium while scoring 38.9%. Interestingly, it uses more steps on average (9.5 vs 8.8), suggesting the smaller model takes more exploratory actions.

**Claude for Powerpoint (Opus)** scores 36.5% despite using the most steps (11.6) and significantly more compute. **Claude for Powerpoint (Sonnet)** scores 32.4%, the lowest of all configurations, while being the fastest at 154.4s per task.

<div id="prezeval-chart"></div>

### Score breakdown by content type

Breaking down scores by what the slide contains reveals clear patterns:

| Content type       | Verso Medium | Claude for PPT |
|--------------------|--------------|----------------|
| Dense text         | 66.8%        | 48.3%          |
| Non-chart slides   | 63.5%        | 44.8%          |
| Tables             | 48.3%        | 38.3%          |
| Diagrams           | 47.3%        | 25.0%          |
| Charts             | 38.0%        | 29.5%          |
| Maps               | 12.5%        | 12.5%          |
| **Overall**        | **49.5%**    | **36.5%**      |

Text-heavy slides are the easiest category, while maps are the hardest (equally bad for both agents). Charts, which make up 54% of the benchmark, pull the overall score down significantly.

### Where Verso excels

Verso consistently scores well on structured text slides: formatted legal text, multi-section layouts with colored boxes, table-of-contents style pages, and multi-column icon layouts. On these, Verso Max routinely achieves near-perfect scores, and even Verso Medium and Verso Fast reach 75-100%, while both Claude for Powerpoint variants typically lag significantly behind.

### What remains hard

About 20% of the benchmark is essentially unsolved: all five agents score 25% or below on the hardest tasks. The common failure modes:

- **Geographic maps.** Agents struggle to produce accurate map visualizations. They may substitute the map with an unrelated shape, render it at the wrong scale, or lose state-level color coding. Verso does attempt maps but the results are consistently poor: a US map might appear shrunken with missing detail, or a world map might be replaced by a circular diagram.
- **Complex charts with dense data.** Combo charts (bars + lines on dual axes), multi-panel dashboards, and heatmap matrices consistently break all agents. Common failures include entire charts missing, axis labels dropped, and data values absent.
- **Custom composite shapes.** Funnels built from trapezoids, quadrant charts with curved dividers, and similar constructions require precise layering and alignment that agents can't yet achieve reliably.

### Where Verso still has room to grow

Even Verso Max, despite its 70.8% average, still struggles on some tasks (scoring 25% or below). These tend to be slides with large structured grids, brand logos embedded in charts, or decorative elements. This suggests specific opportunities to improve Verso's handling of these patterns.

All results, including per-task generated vs. reference images and evaluator critiques, are available in [the PrezEval repository](https://github.com/VersoLabs/PrezEvalPublic).
