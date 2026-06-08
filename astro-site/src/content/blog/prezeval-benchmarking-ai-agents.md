---
title: "PrezEval: Benchmarking AI agents on professional slides"
date: 2026-04-06
description: "How well can an AI agent reproduce a professional consulting slide from just a screenshot? We built a benchmark to find out."
lang: en
---

## Goal

How well can an AI agent reproduce professional consulting slides from visual guidance?

After building Folio, we've come to the belief that our aproach produces far superior results to others.

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

We compared four configurations:

| Config                          | Score | Time  | Steps |
|---------------------------------|-------|-------|-------|
| **Folio Max**                   | 70.0% | 2:19  | 5.5   |
| **Folio Medium**                | 66.8% | 2:44  | 5.2   |
| **Folio Fast**                  | 43.0% | 1:32  | 13.7  |
| Claude for PowerPoint (Sonnet 4.6) | 46.9% | 16:03 | 25.5  |

**Folio Max** leads at 70.0%, outscoring the next-best non-Folio agent by 23 points (a 49% relative lead). It reaches that score in 138.9s per task, roughly 7x faster than Claude for PowerPoint (962.8s, nearly 16 minutes), and in far fewer steps (5.5 vs 25.5). Folio Max and Folio Fast together trace the Pareto frontier - one anchors the high-accuracy end, the other the low-latency end - while Claude for PowerPoint is dominated, landing both slower and less accurate than Folio Max.

**Folio Medium** scores 66.8%, within striking distance of Max, at a slightly lower cost. It reasons less but lands almost as many reproductions cleanly.

**Folio Fast** is the budget, low-latency tier: at $0.21 per task it costs roughly 5x less than Folio Max and 9x less than Claude for PowerPoint, and at about 1.5 minutes per slide it is the fastest config in the field. The trade-off is fidelity (43.0%) and more exploratory actions (13.7 steps), since it runs on a smaller, cheaper model.

**Claude for PowerPoint (Sonnet 4.6)** scores 46.9%, but pays heavily for it: 962.8s per task (roughly 7x slower than Folio Max), 25.5 steps, $1.80, and 5 of 61 tasks left incomplete. It edits raw OOXML directly, which is both slow and error-prone compared to Folio's structured approach.

<div id="prezeval-chart"></div>

### Score breakdown by content type

Breaking down scores by what the slide contains reveals clear patterns:

| Content type       | Folio Medium | Claude for PPT |
|--------------------|--------------|----------------|
| Charts             | 68.5%        | 42.3%          |
| Dense text         | 66.7%        | 50.0%          |
| Diagrams           | 66.1%        | 43.8%          |
| Tables             | 65.9%        | 47.7%          |
| Maps               | 43.8%        | 41.7%          |
| **Overall**        | **66.8%**    | **46.9%**      |

The striking thing is how consistent Folio Medium has become: it sits in a tight 65-69% band across charts, dense text, diagrams, and tables. Charts, which make up over half the benchmark and used to be the category that dragged scores down, are now Folio's strongest category. Maps are the one remaining weak spot, and they are hard for everyone (equally bad for both agents). Claude for PowerPoint trails in every single category, with the widest gaps on charts (+26 points) and diagrams (+22 points).

### Where Folio excels

Folio handles the full range of consulting-slide elements: formatted legal text, multi-section layouts with colored boxes, table-of-contents pages, multi-column icon layouts, data charts, and tables. Folio Max scores 75% or higher on 47 of the 61 slides (and a perfect 100% on a couple), while Claude for PowerPoint typically lags well behind. The gap is most visible on chart-heavy and diagram-heavy slides, exactly the dense, structured content that fills real decks.

### Where Folio still has room to grow

Maps remain the clearest opportunity: closing that gap alone would lift the overall score meaningfully. Beyond that, the residual 50%-scoring tasks are mostly near-misses on dense charts and composite shapes, where the structure is right but styling or alignment is slightly off.

Speed, which used to be a concern, is now a strength: Folio Max completes a slide in about 2.3 minutes and Folio Fast in 1.5, against nearly 16 minutes for Claude for PowerPoint. We will keep pushing latency down so that working with Folio feels like a streaming continuation of your work rather than a tennis game where you wait for the ball to come back.

All results, including per-task generated vs. reference images and evaluator critiques, are available in [the PrezEval repository](https://github.com/FolioLabs/PrezEvalPublic).
