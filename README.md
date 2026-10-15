# RL Field Guide

A bilingual English/Chinese, zero-start reading course that covers reinforcement learning from problem framing through modern language-model post-training. It is built with Astro, React, TypeScript, Tailwind CSS, and customized shadcn/ui components, and runs independently on port `5180`.

The published route starts with a bilingual Chapter 00 panorama, followed by 46 deep chapters in nine connected parts. Every page is prerendered as complete HTML. The panorama connects the field through one evolving decision problem; the deep chapters then slow down for evidence, equations, and limits.

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

The build produces 97 static pages: one bilingual language gate, two localized course maps, one matched Chapter 00 pair, and 46 matched deep-chapter pairs. The verification scripts enforce route order, formula/calculation/source parity, strict KaTeX rendering, semantic diagrams, worked examples, source links, boundaries, link integrity, keyboard access, language-preserving anchors, theme behavior, long-formula visibility, and document-level overflow checks at six responsive widths.

## Evidence boundary

A passing build proves that the course artifact is internally consistent and browser-readable. It does not prove that a learner has mastered RL, that every research branch is settled, or that tutorial results justify production deployment. The final chapters make those limits explicit.
