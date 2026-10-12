# RL Field Guide

A bilingual, zero-to-practice reinforcement-learning course built with Astro, React, TypeScript, Tailwind CSS, and customized shadcn/ui components.

The site is prerendered at build time so every English and Chinese lesson ships as complete HTML. React is hydrated only for interactive evidence components.

## Local use

```sh
npm install
npm run dev
```

The development server uses port `5180` and the GitHub Pages base path `/rl-field-guide/`.

## Quality checks

```sh
npm test
npm run lint
npm run build
npm run verify:static
```

The build generates the language gate, two localized course maps, and every lesson in both languages under `dist/`.

## Learning route

The 16-lesson route starts before formal RL vocabulary and builds in prerequisite order:

1. recognizing sequential decision problems
2. the agent–environment interaction loop
3. return, discounting, and termination
4. bandits and exploration
5. MDPs, policies, and values
6. planning with a known model
7. Monte Carlo and temporal-difference learning
8. SARSA, Q-learning, and control
9. deep value learning and DQN
10. policy gradients, actor–critic, and PPO
11. continuous control and model-based RL
12. where RL enters the LLM post-training pipeline
13. reward models and PPO-style RLHF
14. DPO, online preference learning, and RLAIF
15. RLVR, GRPO, process supervision, and reasoning models
16. offline data, safety, robust evaluation, and deployment boundaries

Every lesson has the same English and Chinese structure, at least two worked examples, a misconception boundary, a transfer check, and formula rendering only after the underlying quantities have been introduced.
