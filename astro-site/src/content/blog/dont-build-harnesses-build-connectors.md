---
title: "How to train your agents: don't improve the harness, improve the connectors!"
date: 2026-06-03
description: "Harnesses are overrated. We improved our slide agent on the PrezEval benchmark not by tweaking the harness, but by building better connectors: the tools the model uses to act on its environment."
lang: en
---

Harnesses are overrated. Or at least, they're not the ones who should provide intelligence: anything they do on top of allowing the model to properly use tools in a loop is overkill, any extra scaffolding will be a hindrance when the models become smarter (Noam Brown from OpenAI put it better: "Your fancy AI scaffolds will be washed away by scale"[^scaffold]).

And on our agent, we did only a minimal harness. The boxes that I think any harness should tick are:

- planning
- proper tool calling
- proper image handling
- good caching (KV cache optimization is king for cost reductions[^kvcache])

And that's it! And actually, most existing agent harnesses already tick these features.

Yet the chart below shows that the curve of progress of our AI agent on the PrezEval benchmark[^prezeval] went up:

![Folio's performance on the PrezEval benchmark over time, annotated with what drove each step up.](/blog/prezeval-hillclimb.png)

How did we improve performance, if not the harness?

Well, in what remains: the tools (aka the connectors that the LLM uses to interact with its environment). We made great slide-editing tools.

A good tool is a good API (given the basic assumption that it works), so it needs:

1. **Clear inputs and outputs.**
   - clear inputs: the input arguments
   - clear outputs: the text returned to our model, for instance clear error logs (and in our case, images too: slide screenshots)
2. **A good mental model of what happens:** the documentation.

That's why, by the way, MCP has somewhat fallen out of favor, replaced by CLI (command-line interface) + skills[^skills]: a good CLI already ticks point (1), and a clear skill ticks point (2). The combination of a good CLI + a good skill makes MCP overkill.

For Folio, good tools are our secret recipe: we have perfected over time a proprietary representation of slides in a simpler language (some call it a Domain Specific Representation, or DSR). That means we have a SOTA CLI for slides, and our system-prompt additions do the rest.

[^scaffold]: Noam Brown, [on X](https://x.com/latentspacepod/status/1944507223574544619).

[^prezeval]: We released PrezEval earlier this year: [github.com/Folio-AI-Labs/PrezEvalPublic](https://github.com/Folio-AI-Labs/PrezEvalPublic).

[^kvcache]: ["Context Engineering for AI Agents: Lessons from Building Manus"](https://manus.im/fr/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus), Manus.

[^skills]: Simon Willison, ["Claude Skills are awesome, maybe a bigger deal than MCP"](https://simonwillison.net/2025/Oct/16/claude-skills/).
