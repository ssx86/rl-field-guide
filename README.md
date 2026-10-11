# RL Field Guide

An evidence-first, English-language reinforcement learning tutorial. The current vertical slice teaches why a fully known environment can be planned through directly instead of learned from sampled experience.

## Run locally

```bash
npm install
npm run dev
```

The development server uses `http://localhost:5180`.

To run the verified production build:

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Current learning slice

- English learning map for the broader RL curriculum
- prediction gate before evidence is revealed
- synchronous Bellman sweeps
- dependency-ordered backward planning
- sampled Q-learning comparison
- numeric, symbolic, and plain-English explanation lenses
- light and dark themes
- responsive layouts verified at 320px, 768px, and desktop widths

The existing `qlearning` project is not modified by this application.
