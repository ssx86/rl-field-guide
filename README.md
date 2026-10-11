# RL Field Guide

An evidence-first, English-language reinforcement learning tutorial. The course covers the full route from problem formulation and tabular learning through deep, policy-based, continuous-control, model-based, offline, safe, and human-feedback methods.

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

## Course coverage

- foundations: agent–environment boundaries, state, observation, rewards, returns, policies, and value
- exploration: bandits, epsilon-greedy, UCB, regret, and uncertainty
- planning: Bellman backups, ordered calculation, value iteration, and planning versus learning
- sampled learning: Monte Carlo, importance sampling, TD, n-step returns, eligibility traces, SARSA, Q-learning, and Double Q-learning
- deep value methods: function approximation, DQN, replay, target networks, Double DQN, dueling networks, and prioritized replay
- policy learning: REINFORCE, baselines, actor-critic, GAE, and PPO
- continuous control: DDPG, TD3, SAC, action bounds, and evaluation
- model-based RL: Dyna, MPC, MCTS, learned dynamics, and world models
- modern practice: offline RL, imitation and inverse RL, hierarchical and multi-agent RL, POMDPs, safety, reward hacking, reproducibility, and RLHF
- challenge lab and connected formula atlas

Every chapter includes:

- prediction gate before evidence is revealed
- mechanism-first explanations and correct rendered formulas
- at least two worked examples and one counterexample
- method comparisons, boundaries, a transfer check, and a method passport
- persistent evidence progress across predictions, experiments, numeric work, transfer, and reflection
- light and dark themes
- responsive course navigation for mobile and desktop

The existing `qlearning` project is not modified by this application.
