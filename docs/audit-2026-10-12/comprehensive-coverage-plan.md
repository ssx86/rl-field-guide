# Comprehensive RL coverage contract

## What “complete” means here

No finite course can contain every paper ever published. This guide uses a stricter and testable definition: every major RL problem setting, method family, training signal, evaluation method, and deployment risk must have a named place in the route. A term only counts as covered when the course explains its purpose, mechanism, example, equation or technical object where useful, and failure boundary. Mentioning an acronym in a list does not count.

The English course is the authoritative learning product. It starts from ordinary sequential decisions and ends with modern LLM post-training. The route remains readable without interaction.

## Source spine

- Sutton and Barto, *Reinforcement Learning: An Introduction*, 2nd ed.: <https://incompleteideas.net/book/RLbook2020.pdf>
- OpenAI Spinning Up, concepts and algorithm taxonomy: <https://spinningup.openai.com/en/latest/spinningup/rl_intro.html>
- Farama Gymnasium, termination and truncation: <https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/>
- Original papers are linked from the chapter that teaches the method. Survey or product copy may guide discovery, but it does not replace the original work as technical evidence.

## Route: 46 chapters in 9 parts

### Part I — Recognize the problem

1. Before RL: when sequential learning is the wrong or right tool
2. The agent–environment interface
3. Return, horizon, termination, and truncation
4. Probability, expectation, and stochastic policies
5. Bandits and contextual bandits

### Part II — Solve small problems exactly

6. MDPs, state design, and the Markov property
7. Value functions and Bellman equations
8. Dynamic programming: evaluation, policy iteration, and value iteration
9. Monte Carlo prediction and control
10. TD(0), n-step returns, TD(lambda), and eligibility traces
11. SARSA, Expected SARSA, Q-learning, and Double Q-learning
12. Off-policy correction, importance sampling, and the deadly triad

### Part III — Approximate and scale

13. Linear function approximation and feature design
14. Neural function approximation and optimization basics
15. DQN: replay, target networks, and terminal masks
16. The DQN family: Double, dueling, prioritized, distributional, noisy, and Rainbow
17. REINFORCE and the policy-gradient theorem
18. Actor–critic, A2C/A3C, and GAE
19. Natural gradients, TRPO, and PPO
20. Continuous control: DDPG, TD3, and SAC
21. Distributed RL: Ape-X, IMPALA, and R2D2

### Part IV — Remember and explore

22. POMDPs, belief state, recurrence, and memory
23. Exploration: uncertainty, counts, entropy, curiosity, and RND
24. Long-horizon credit assignment and reward redistribution

### Part V — Learn and search a model

25. Search, MCTS, self-play, and AlphaZero
26. Dyna, MPC, PETS, and MBPO
27. Latent world models: Dreamer and MuZero

### Part VI — Learn from existing data

28. Behavior cloning, covariate shift, and DAgger
29. Inverse RL, maximum-entropy IRL, and GAIL
30. Offline RL: support mismatch, BCQ, CQL, and IQL
31. Sequence models: Decision Transformer and trajectory models
32. Off-policy evaluation: importance sampling, FQE, and doubly robust estimators

### Part VII — Add structure

33. Hierarchical RL: options, MAXQ, goals, and skills
34. Multi-agent RL: independent learners, CTDE, VDN, QMIX, MADDPG, and self-play
35. Multi-task, transfer, meta-RL, generalization, and sim-to-real

### Part VIII — Make it reliable

36. Reward design, shaping, specification gaming, and preference signals
37. Safe, constrained, robust, and risk-sensitive RL
38. Evaluation: seeds, intervals, learning curves, ablations, and benchmark limits
39. Environment and training systems: APIs, wrappers, logging, checkpoints, and monitoring

### Part IX — RL for language models

40. Tokens as actions: where RL begins and SFT ends
41. RLHF: preference data, reward models, PPO, value models, and KL control
42. Direct preference methods: DPO, IPO, KTO, ORPO, and SimPO—and why not all are RL
43. RLAIF, constitutional feedback, judges, and feedback quality
44. RLVR, process versus outcome reward, and GRPO
45. Search, test-time compute, and distillation versus RL training
46. Method selection and deployment evidence

## Depth contract for every chapter

Every chapter must contain continuous prose between headings. The minimum evidence is:

- a bridge from the previous chapter explaining why this question comes next;
- one concrete situation before terminology;
- one semantic HTML/CSS diagram whose meaning is also available as text;
- one fully worked numeric or procedural example;
- the main mechanism in prose, not only cards or bullets;
- notation introduced after its quantities have visible jobs;
- at least one counterexample or failure boundary;
- a bridge to the next chapter;
- original or official sources.

## UI contract

- The page should read like a technical essay, not a slide deck stacked vertically.
- Body copy uses a comfortable 65–75 character line length and visibly larger leading than labels.
- Cards are reserved for diagrams, calculations, tables, and warnings. Ordinary explanation remains in paragraphs.
- A heading never follows another heading without a paragraph that explains the transition.
- The chapter rail shows the current part and nearby chapters; the complete field map lives on the course page.
- Navigation, theme, and ordinary links may remain. Learning content never depends on clicks, tabs, accordions, quizzes, or reveal states.

