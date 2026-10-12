# RL Field Guide audit — 2026-10-12

## Product decision

This is a field guide for sustained reading, not a slide deck, acronym catalog, or click-through course game. The route begins by deciding whether RL is needed, then adds each method family only when the learner has encountered the problem it solves. Long prose is intentional where a learner needs continuity; diagrams and worked examples carry relationships that prose alone would make hard to inspect.

The governing sequence is:

`predict → trace the situation → calculate visible evidence → name the mechanism → test the boundary → transfer to the next question`

## Multi-lens audit

| Lens | Question used in review | Result |
| --- | --- | --- |
| Product manager | Does each chapter close a learner question and create a reason for the next chapter? | 46 chapters form nine prerequisite-ordered parts; the home page exposes the complete route and purpose of each part. |
| UI/UX | Does the page behave like a readable technical article rather than a collection of equal cards? | Continuous prose is the dominant surface. Cards are limited to diagrams, worked steps, equations, sources, and navigation where containment has meaning. |
| `myself` | Are claims separated into implementation, automated evidence, browser evidence, and deployment evidence? | The final chapter and this audit state those boundaries explicitly. No build or benchmark is presented as production proof. |
| Beginner brain | Can a learner derive each new term from daily knowledge plus previously taught facts? | Every chapter declares what it builds on, starts with a concrete situation, and introduces notation only after quantities have jobs. The 46-page cognitive ledger is in `brain.md`. |
| Plain-language / anti-AI | Do paragraphs say who does what, avoid slogan-like contrast, and keep necessary caveats near the claim? | Abstract openings were replaced with actors, timelines, numbers, and direct boundary statements. Repeated template filler and decorative conclusions were removed. |
| Popular-science writing | Can readers see the mechanism without losing technical correctness? | Each chapter combines a semantic diagram, at least three worked steps, mechanism prose, equations with spoken readings, and original or official sources. |

## Findings and resolution

| Priority | Finding | Resolution | Evidence |
| --- | --- | --- | --- |
| P0 | The earlier 16-page route could not support the requested breadth | Expanded to 46 chapters across nine parts, including classical, deep, offline, structured, reliable, and LLM-focused RL | Curriculum and article collection tests |
| P0 | Equal-sized lesson cards made the site feel like a presentation | Rebuilt chapters as long-form articles with prose before containers | Desktop and mobile visual inspection |
| P0 | “All RL” could decay into an untested marketing claim | Added an executable coverage contract for the major method families and modern post-training boundaries | Terminology coverage test |
| P1 | Topic transitions could look like missing pages | Added a bridge from the previous question, a “why it is here” contract, and a next-question bridge to every chapter | 46 generated pages and content tests |
| P1 | Formulas could arrive as unexplained decoration | Equations appear after situations and worked evidence, with a spoken reading and a paragraph explaining what the relation does and does not prove | Article schema test and browser inspection |
| P1 | Long formulas widened the final chapter on phones | Constrained formula grid items so only the formula viewport can scroll | 320/375/390/768 overflow audit |
| P1 | LLM training terminology is often collapsed into “RL” | Separate chapters distinguish SFT, PPO-style RLHF, direct preference objectives, AI feedback, RLVR/GRPO, search, test-time compute, and distillation | Part 9 content test and browser review |
| P1 | A complete route can overwhelm navigation | Desktop shows only the current part; mobile shows previous/current/next with an expandable part list | Responsive browser audit |
| P2 | Accessibility and theme behavior needed runtime evidence | Kept semantic headings/lists/figures, a skip link, visible focus, 44px controls, and action-named theme control | Keyboard, anchor, theme, and console audit |

## Verified state

- Automated: 12 test files and 61 tests pass; lint passes; Astro reports 0 errors and 0 warnings; static verification passes 48 pages and 46 chapters.
- Browser runtime: all 46 chapters were opened and checked; nine route parts, theme, anchors, keyboard access, diagrams, examples, sources, and four responsive viewports pass; browser console has no errors or warnings.
- Human visual review: home, first chapter, continuous-control formulas, direct-preference boundaries, and the final method-selection chapter were inspected at desktop and mobile sizes.
- Not claimed: learner mastery, research exhaustiveness beyond the explicit coverage contract, domain-specific safety approval, production deployment readiness, or release publication of this branch.
