---
title: "Don't build good harnesses: Build good connectors"
date: 2026-06-03
description: "A good harness gets out of the way. What is paramount is the connectors: the tools that let the model act on its environment."
lang: en
---

Harnesses are overrated. Or at least, they're not the ones who should provide intelligence: anything they do on top of allowing the model to properly use tools in a loop is overkill, any extra scaffolding will be a hindrance when the models become smarter[^scaffold].

Yet here is the curve of progress of our AI agent on the PrezEval benchmark[^prezeval] through time:

![Folio's score on the PrezEval benchmark over time, annotated with what drove each step up.](/blog/prezeval-hillclimb.png)

## A good harness should get out of the way

Ours has only:

- planning
- proper tool calling
- proper image handling
- good caching (the KV cache is king for cost reductions[^kvcache])

And that's it!

## What is paramount is the connectors

How will the harness be enabled to take action effectively on its environment? That's where you need good tools.

A good tool is a good API (given the basic assumption that it works), so it needs:

1. **Clear inputs and outputs.**
   - clear inputs: the input arguments
   - clear outputs: the text returned to our model, for instance clear error logs (and in our case, images too: slide screenshots)
2. **A good mental model of what happens:** the documentation.

That's why for most agents, MCP has fallen out of favor, replaced by CLI + skills[^skills]: a good CLI already ticks (1), and a clear skill ticks (2).

In our case, we reduced the harness to a minimum as said above, and what we needed was good connectors to modify slides. That's our secret recipe: we have perfected over time a proprietary representation of slides in a simpler language. That means we have a SOTA CLI for slides, and our system-prompt additions do the rest.

[^scaffold]: Noam Brown, ["Your fancy AI scaffolds will be washed away by scale"](https://x.com/latentspacepod/status/1944507223574544619).

[^prezeval]: We released PrezEval earlier this year: [github.com/Folio-AI-Labs/PrezEvalPublic](https://github.com/Folio-AI-Labs/PrezEvalPublic).

[^kvcache]: ["Context Engineering for AI Agents: Lessons from Building Manus"](https://manus.im/fr/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus), Manus.

[^skills]: Simon Willison, ["Claude Skills are awesome, maybe a bigger deal than MCP"](https://simonwillison.net/2025/Oct/16/claude-skills/).
