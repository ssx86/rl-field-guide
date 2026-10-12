# Beginner brain state

Audience model: an adult learner who can read plain English or Chinese, do basic arithmetic, and follow coordinates, but does not yet know reinforcement learning, probability notation, calculus, neural networks, or LLM post-training.

The course must never assume more than `daily knowledge ∪ facts already taught`. Each lesson must remain understandable as continuous reading: situation, diagram, numeric evidence, concept name, equation when useful, and a visible boundary.

| After lesson | Facts the learner may now use | Still not assumed |
| --- | --- | --- |
| 01 Before RL | A learning problem needs repeated decisions, feedback, and consequences that affect later choices. State, action, reward, and next state are distinguishable. | Probability, return, Markov property, value functions |
| 02 Interaction loop | A trajectory is an ordered sequence of state, action, reward, and next state. Terminal means no future step follows. | Discounting, bootstrapping, Bellman equations |
| 03 Return and time | Return adds future rewards; discounting changes how much later rewards count; terminal transitions do not bootstrap. | Probability-weighted expectation, policies as distributions |
| 04 Bandits | Exploration gathers information; exploitation uses the best current estimate; sample averages update estimates. | State transitions, Bellman backups |
| 05 MDPs | Transition probabilities are weights that sum to one; expected value is a probability-weighted average; the Markov assumption concerns the chosen state description. | Dynamic programming sweeps, learned value functions |
| 06 Planning | When a model is known, one-step backups propagate rewards backward; order and repeated sweeps matter when loops exist. | Learning from sampled experience |
| 07 MC and TD | Monte Carlo waits for a completed return; TD bootstraps from the next estimate; targets differ in delay and variance. | Action-value control |
| 08 Control | SARSA uses the action actually selected; Q-learning uses the best next action; terminal targets omit future value. | Function approximation and replay |
| 09 Deep value | A neural network can share one value function across many states; replay and target networks stabilize DQN; terminal masks are required. | Policy gradients and continuous actions |
| 10 Policy learning | A policy can output action probabilities; positive advantage raises sampled-action probability and negative advantage lowers it; clipping limits an update. | Entropy trade-offs and continuous-control families |
| 11 Continuous and model methods | Action space and model availability form two separate method-choice axes; actor-critic, model-based, and model-free methods have different evidence needs. | Token trajectories and preference data |
| 12 LLM post-training | An LLM trajectory is a generated token sequence; a scorer can give sequence-level feedback; supervised learning and RL use different signals. | Reward models, KL control, preference objectives |
| 13 RLHF | Humans compare responses, a reward model generalizes those comparisons, PPO updates token probabilities, and a reference policy limits drift. | Direct preference optimization |
| 14 Preference optimization | DPO changes the relative log-probability of preferred versus rejected responses; offline data cannot reveal every online failure. | Group-relative reasoning updates |
| 15 Reasoning and verification | Verifiable rewards can score outcomes; GRPO compares samples within a group; pass/fail reward still does not prove process quality. | Deployment claims |
| 16 Real-world practice | Evidence for deployment needs returns, safety, robustness, uncertainty, held-out evaluation, and a stop condition. A tutorial result is not production proof. | Production competence, domain-specific safety approval |

## Rules used in the rewrite

1. New notation appears after a concrete numeric trace, not before it.
2. Every lesson names what is required now and what is safe to postpone.
3. The page may invite the reader to pause and think, but the full explanation is always visible and never gated by an interaction.
4. Formula cards state what the symbols refer to and sit beside a boundary or counterexample.
5. The final lesson is a capstone decision, not a decorative summary formula.

