# RL Field Guide

A bilingual English/Chinese, zero-start reading course that covers reinforcement learning from problem framing through modern language-model post-training. It is built with Astro, React, TypeScript, Tailwind CSS, and customized shadcn/ui components, and runs independently on port `5180`.

The published route contains 46 chapters in nine connected parts. Every chapter is prerendered as complete HTML and follows one evidence-first sequence:

`situation → semantic diagram → worked evidence → mechanism → equation when useful → validity boundary → next question`

The course deliberately names methods only after their job is visible. It includes tabular RL, deep value and policy methods, exploration and memory, model-based RL, imitation and offline RL, hierarchical and multi-agent RL, safety and evaluation, RL systems, RLHF, direct preference objectives, RLAIF, RLVR, GRPO, test-time compute, and method selection.

## Local use

```sh
npm install
npm run dev
```

The development server uses `http://localhost:5180/rl-field-guide/`.

## Quality checks

```sh
npm test -- --run
npm run lint
npm run build
npm run verify:static
python scripts/audit-browser.py
```

The build produces 95 static pages: one bilingual language gate, two localized course maps, and 46 matched chapter pairs. The verification scripts enforce route order, formula/calculation/source parity, strict KaTeX rendering, semantic diagrams, worked examples, source links, boundaries, link integrity, keyboard access, language-preserving anchors, theme behavior, and document-level overflow checks at four responsive widths.

## Evidence boundary

A passing build proves that the course artifact is internally consistent and browser-readable. It does not prove that a learner has mastered RL, that every research branch is settled, or that tutorial results justify production deployment. The final chapters make those limits explicit.
