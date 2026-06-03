---
title: "Why AI couldn't edit PowerPoint until now"
date: 2026-04-12
description: "Every AI tool generates new slides instead of editing existing ones. Here's the technical reason why, and how we solved it."
lang: en
---

If you've tried any of the AI slide tools on the market, you've noticed something: they all generate new decks. None of them open your existing PowerPoint file and edit it.

That's not an oversight. It's a technical constraint, one that the entire industry quietly worked around rather than solved.

We decided to solve it.

## The problem: PowerPoint is not LLM-friendly

PowerPoint files (.pptx) use a format called OOXML (Office Open XML). It was standardized by Microsoft and adopted as an ISO standard in 2008. It is, by any reasonable measure, one of the most complex document formats ever designed.

A few examples to illustrate:

**Units that make no sense to humans (or models)**

OOXML uses EMU (English Metric Units) as its base unit for measurement. One inch equals 914,400 EMU. A typical slide is 9,144,000 × 6,858,000 EMU. These are the numbers stored in the file. When you tell an LLM "move this shape 2 inches to the right", it needs to understand that means adding 1,828,800 to the `off x` attribute.

**Ten levels of nesting for a text box**

In OOXML, describing a simple text box with two lines of text requires navigating through: the shape element, the shape properties, the text body, the body properties, the list style, the paragraph, the paragraph properties, the run, the run properties, and finally the text content. Change one attribute at the wrong level, and the file silently breaks.

**Thousands of implicit defaults**

OOXML has a concept of "inheritance": if an attribute is not set, it inherits from the slide layout, which inherits from the slide master, which inherits from the theme. Most properties are never explicitly written in the file. An LLM reading the XML for a given text box sees only the overrides, not the full picture.

**No schema validation at edit time**

When you edit a PPTX with raw XML manipulation, there's no real-time validation. The file can look syntactically correct and still fail to open in PowerPoint, or open with corrupted slides, because of subtle semantic violations.

## What happens when you feed OOXML to an LLM

We tried. Extensively.

The failure modes are consistent. LLMs confidently produce XML with valid-looking but semantically wrong element names, then drop required attributes or invent ones that don't exist. They break the inheritance chain by explicitly setting values that should remain inherited. Worst of all, they occasionally produce files that PowerPoint opens but renders incorrectly - which is harder to catch than an outright failure.

The benchmark we built internally, PrezEval, measures successful edits: how often does a model produce a valid, correctly-formatted slide that matches the instruction? With raw OOXML, even the best models scored below 30% on complex edits.

That's not usable. It explains why every other tool gave up on editing and focused on generation instead.

## Our solution: SimpleXML

We spent months building an alternative approach.

Instead of asking LLMs to read and write OOXML directly, we built a two-layer system:

**Layer 1: Simplification (OOXML to SimpleXML)**

We wrote a codec that converts OOXML into a custom format we call SimpleXML. It has several properties that make it dramatically more LLM-friendly:

- *Human-readable units.* Inches, points, degrees, and percentages instead of EMU. "width: 4in" instead of "cx: 3657600".
- *Flat structure.* We collapse the 10-level nesting into a flat, CSS-like representation. A text run looks like a text run, not a Russian doll of XML elements.
- *Explicit over implicit.* We resolve all inheritance at parse time, so the LLM always sees the full picture for every element.
- *Constrained vocabulary.* The LLM only needs to know a small set of elements and attributes. We handle the mapping to OOXML semantics.

**Layer 2: Restoration (SimpleXML to OOXML)**

After the LLM produces its edited SimpleXML, we run it through the reverse codec, which validates, resolves, and converts it back into valid OOXML. This layer handles all the edge cases: re-encoding units, rebuilding nesting, restoring inheritance, and validating against the OOXML spec.

The result is that LLMs never touch OOXML directly. They work in a format that's as natural for them as writing code or editing text.

## The performance difference

On our PrezEval benchmark:

- Raw OOXML editing: ~25% success rate on complex edits
- SimpleXML with our best model: ~85% success rate

That's not a marginal improvement. It's the difference between a tool that occasionally works and one you can rely on.

It also means Folio can do things that other tools simply cannot: edit existing slides while preserving their structure, apply template-aware formatting, modify charts with real data, and handle the full complexity of PowerPoint objects, without generating a new file.

## Why this is a moat

Building this codec took significant engineering time, and it continues to evolve as we encounter edge cases in real-world PowerPoint files. It's not a feature that can be quickly replicated.

More importantly, it only gets more valuable as LLMs improve. Every time a new frontier model releases, Folio's performance improves automatically, because the bottleneck was never the model - it was the interface between the model and the file format.

We solved that interface.
