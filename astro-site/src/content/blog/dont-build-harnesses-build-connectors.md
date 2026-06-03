---
title: "Don't Build Harnesses, Build Connectors"
date: 2026-06-03
description: "A good harness gets out of the way. What is paramount is the connectors: the tools that let the model act on its environment."
lang: en
---

Harnesses are useless. Yet here is the curve of progress of our AI agent through time:

![Folio's score on the PrezEval benchmark over time, annotated with what drove each step up.](/blog/prezeval-hillclimb.png)

## A good harness should get out of the way

Ours has only:

- planning
- proper tool calling
- proper image handling
- good caching (the KV cache is king for cost reductions)

And that's it!

## What is paramount is the connectors

How will the harness be enabled to take action effectively on its environment? That's where you need good tools.

A good tool is a good API (given the basic assumption that it works), so it needs:

1. **Clear inputs and outputs.**
   - clear inputs: the input arguments
   - clear outputs: the text returned to our model, for instance clear error logs (and in our case, images too: slide screenshots)
2. **A good mental model of what happens:** the documentation.

That's why for most agents, MCP has fallen out of favor, replaced by CLI + skills: a good CLI already ticks (1), and a clear skill ticks (2).

In our case, we reduced the harness to a minimum as said above, and what we needed was good connectors to modify slides. That's our secret recipe: we have perfected over time a proprietary representation of slides in a simpler language. That means we have a SOTA CLI for slides, and our system-prompt additions do the rest.
