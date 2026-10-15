# Beginner brain ledger: Chinese deep chapters

## Reader at the door

The simulated reader is an ordinary adult who can follow everyday cause and effect, percentages, averages, and simple algebra, but knows no reinforcement-learning vocabulary. They have read Chapter 00 in order. A term is not considered known merely because its English name looks familiar. For every chapter, the test is whether the new idea can be derived from the accumulated model, whether the analogy preserves the mechanism, and whether the boundary is explicit.

## Part 1 — Recognize the problem

### 01 · Before RL

- Starting model: a program receives inputs and may be scored.
- New distinction: a scored prediction is not automatically a sequential decision; an action must alter later evidence or choices.
- Cognitive route: remove the word “reward,” inspect the causal loop, then compare RL with simpler alternatives.
- Audit: pass. “Reward” grows out of consequences rather than arriving as unexplained jargon.

### 02 · Interaction loop

- Starting model: the reader can recognize a sequential decision.
- New distinction: agent, environment, observation, state, action, reward, termination, and truncation occupy different positions in time.
- Cognitive route: draw who controls what before naming an algorithm; treat state as a predictive promise.
- Audit: pass. The clock order prevents the common leak in which the agent is allowed to see the result before acting.

### 03 · Return and horizon

- Starting model: one transition produces one reward and a later situation.
- New distinction: return aggregates later rewards; horizon and discount say how far and how strongly the future counts; stopping is not always terminal.
- Cognitive route: compare two paths with equal first rewards, then ask where the future ends.
- Audit: pass. Terminal versus truncated is attached to bootstrap semantics, not presented as an API footnote.

### 04 · Probability and expectation

- Starting model: repeated runs can end differently.
- New distinction: a sample is one outcome; a distribution is the rule producing outcomes; expectation is a conditional weighted average.
- Cognitive route: separate one lucky episode from policy quality before introducing stochastic policies.
- Audit: pass. Randomness, ignorance, and estimator error remain separate.

### 05 · Bandits and contextual bandits

- Starting model: choices have uncertain outcomes but no lasting state transition.
- New distinction: exploration buys information; epsilon-greedy, optimism/UCB, and sampling express different reasons to explore.
- Cognitive route: remove state transition first, then add context without pretending context creates a future.
- Audit: pass. The boundary to full RL is explicit.

### 06 · MDP and state design

- Starting model: actions can change later situations.
- New distinction: the Markov property is a claim about the chosen state representation, not a badge attached to the world.
- Cognitive route: ask what forgotten history still changes the next-step distribution.
- Audit: pass. State compression and state explosion are presented as competing errors.

### 07 · Value and Bellman equations

- Starting model: return describes an entire future under a policy.
- New distinction: value is expected future return; Bellman bookkeeping splits it into one step plus the remaining future.
- Cognitive route: first need a map of consequences, then discover the recursive identity.
- Audit: pass. Expectation remains over possible transitions rather than silently choosing the best successor.

## Part 2 — Solve small problems exactly

### 08 · Dynamic programming

- Starting model: value obeys one-step recursive bookkeeping.
- New distinction: with a known model, the job is planning; policy evaluation and improvement answer different questions.
- Cognitive route: contrast calculation from known rules with learning from sampled experience.
- Audit: pass. Synchronous, in-place, and prioritized updates are identified as schedules, not different objectives.

### 09 · Monte Carlo

- Starting model: values can be estimated from experience when the model is unknown.
- New distinction: complete returns avoid bootstrapping but can have high variance; visit-count conventions matter.
- Cognitive route: wait for the episode’s answer, then notice the cost of waiting and noise.
- Audit: pass. “Unbiased” is not allowed to imply “stable.”

### 10 · TD and traces

- Starting model: Monte Carlo waits for an episode; Bellman equations permit one-step decomposition.
- New distinction: TD bootstraps, n-step targets interpolate, and eligibility traces allocate a later error backward.
- Cognitive route: need earlier learning in long episodes, then ask which prior states still deserve credit.
- Audit: pass. Lambda is explained as a time-scale choice rather than a decorative hyperparameter.

### 11 · Tabular control

- Starting model: a sampled transition can update an action value.
- New distinction: SARSA, Expected SARSA, and Q-learning differ in whose next action values the target uses; Double Q separates selection from evaluation.
- Cognitive route: freeze one transition and vary only the answer to “who values the next state?”
- Audit: pass. The formula matrix is subordinate to the question and remains mathematically exact.

### 12 · Off-policy learning and the deadly triad

- Starting model: behavior and target policies can differ.
- New distinction: importance ratios reweight existing coverage but cannot invent missing actions; off-policy learning, bootstrapping, and approximation can amplify one another.
- Cognitive route: ask whether old data has standing to speak for the new policy before applying a correction.
- Audit: pass. Zero support is stated as “no answer,” not as a numerical inconvenience.

## Part 3 — Approximate and scale

### 13 · Linear approximation

- Starting model: tables fail when many states should share evidence.
- New distinction: features explicitly choose the sharing pattern; a projected update couples states.
- Cognitive route: decide what “similar” should mean before introducing weights.
- Audit: pass. Small parameter count is not confused with weak assumptions.

### 14 · Neural approximation

- Starting model: linear features hand-code similarity.
- New distinction: a network learns its representation while its targets and data distribution move with the policy.
- Cognitive route: begin with the loss resembling ordinary regression, then expose why RL data is not a fixed supervised dataset.
- Audit: repaired. Added a plain-language definition of regression and the moving-data contrast before optimization terminology.

### 15 · DQN

- Starting model: a neural network can approximate action values but creates correlated data and moving targets.
- New distinction: replay changes the training stream; a target network slows the target’s movement.
- Cognitive route: name the two failure mechanisms before naming the two repairs.
- Audit: pass. Engineering devices remain causally tied to estimator stability.

### 16 · DQN family

- Starting model: the DQN baseline has identifiable failure modes.
- New distinction: Double, dueling, prioritized replay, distributional value, and noisy exploration repair different parts of the system.
- Cognitive route: sort extensions by whether they alter target, architecture, sampling, representation, or exploration.
- Audit: pass. Rainbow is a combination, not evidence that every component helps every task.

### 17 · REINFORCE and policy gradients

- Starting model: value-based selection becomes awkward when actions cannot be usefully enumerated.
- New distinction: change action probabilities directly using sampled return and log-probability gradients; use a baseline to reduce variance.
- Cognitive route: ask for a differentiable handle on a random action rather than dropping in the log trick unexplained.
- Audit: pass. Baseline subtraction is distinguished from changing the objective.

### 18 · Actor–critic and GAE

- Starting model: REINFORCE has a valid but noisy delayed signal.
- New distinction: the critic estimates advantage for the actor; GAE selects a bias–variance time scale.
- Cognitive route: introduce the critic as an early judge because the full return is slow and noisy.
- Audit: pass. Mutual dependence and error propagation are explicit.

### 19 · TRPO and PPO

- Starting model: policy gradients give a direction but not a universally safe step size.
- New distinction: probability ratios measure local change; TRPO constrains average KL while PPO clips incentive.
- Cognitive route: show why old-policy data loses relevance when the new policy moves too far.
- Audit: pass. Clipping is not described as a hard guarantee.

### 20 · Continuous control

- Starting model: discrete maximization relied on listing actions.
- New distinction: DDPG supplies an actor–critic skeleton, TD3 repairs overestimation, and SAC adds entropy to the objective.
- Cognitive route: begin with the impossibility of enumerating steering angles or torques.
- Audit: pass. Action units and bounds are treated as part of the problem definition.

### 21 · Distributed RL

- Starting model: actors produce experience and a learner updates a policy.
- New distinction: distribution adds policy lag, queue delay, replay skew, and correction choices—not just speed.
- Cognitive route: follow the timestamp of one transition through the system.
- Audit: pass. Throughput and freshness remain separate axes.

## Part 4 — Remember and explore

### 22 · POMDP and memory

- Starting model: a Markov state should make the present sufficient for predicting the next step.
- New distinction: partial observation creates hidden-state uncertainty; belief is a distribution, and memory is only one mechanism for updating it.
- Cognitive route: use identical observations with different hidden situations.
- Audit: pass. A recurrent network is not equated with a correct belief state.

### 23 · Deep exploration

- Starting model: random one-step exploration works poorly when discovery requires a coherent sequence.
- New distinction: counts, uncertainty, prediction error, information gain, entropy, curiosity, and RND encode different evidence.
- Cognitive route: contrast a planned exploratory trajectory with repeated coin flips.
- Audit: pass. The noisy-TV counterexample blocks the shortcut “novel equals useful.”

### 24 · Long-horizon credit

- Starting model: memory can retain events, but retention does not identify causes.
- New distinction: credit assignment, reward redistribution, and hindsight relabeling solve different problems.
- Cognitive route: ask which early action was cause, enabling condition, or coincidence.
- Audit: pass. Hindsight changes the goal label only where dynamics remain valid.

## Part 5 — Learn and search a model

### 25 · MCTS and AlphaZero

- Starting model: a known simulator can be queried before acting.
- New distinction: a search tree expands action sequences selectively; selection, expansion, evaluation, and backup play different roles; AlphaZero forms a search–network loop.
- Cognitive route: move trial and error inside the model, then ration the search budget.
- Audit: repaired. Added a literal definition of root, edge, and next layer before using tree-search language.

### 26 · Dyna and MPC

- Starting model: the environment rules may be learned rather than given.
- New distinction: Dyna uses a model to create training experience; MPC replans actions online; short imagined rollouts limit compounding error.
- Cognitive route: ask what a learned model is used for, not merely whether it predicts well.
- Audit: pass. Visual fidelity is not accepted as decision fidelity.

### 27 · Latent world models

- Starting model: a learned model need not reconstruct every pixel to support decisions.
- New distinction: latent state preserves control-relevant information; posterior uses the observed next frame while prior predicts without it; Dreamer and MuZero retain different targets.
- Cognitive route: compress only what does not alter reward or available actions.
- Audit: repaired. Defined prior and posterior in temporal language before using the pair.

## Part 6 — Learn from existing data

### 28 · Behavior cloning and DAgger

- Starting model: demonstrations provide state–action pairs.
- New distinction: supervised imitation suffers compounding distribution shift; DAgger asks the expert on states reached by the learner.
- Cognitive route: one small imitation error changes the next input, which causes another unfamiliar decision.
- Audit: pass. DAgger is not reduced to “more demonstrations.”

### 29 · Inverse RL and GAIL

- Starting model: expert behavior is observed but the objective may be missing.
- New distinction: many rewards can explain the same behavior; IRL recovers an objective model while GAIL matches occupancy behavior more directly.
- Cognitive route: ask whether reproducing behavior proves the inferred reason.
- Audit: pass. Interpretability requires evidence beyond imitation success.

### 30 · Offline RL

- Starting model: no fresh environment queries are permitted.
- New distinction: out-of-support actions can receive fictitious high values; BCQ, CQL, and IQL remain near evidence in different ways.
- Cognitive route: treat the dataset as the only observable world.
- Audit: pass. Pessimism is a response to missing evidence, not a moral preference for inaction.

### 31 · Decision Transformer

- Starting model: trajectories include states, actions, rewards, and return-to-go.
- New distinction: sequence conditioning can request a target return but does not itself perform online planning.
- Cognitive route: train on historical remaining return, then distinguish the deployment request from knowledge of the future.
- Audit: pass. Dataset support remains the boundary.

### 32 · Off-policy evaluation

- Starting model: a candidate policy exists but cannot yet be deployed.
- New distinction: direct modeling, importance sampling, and FQE have distinct model, variance, coverage, and bootstrap failures.
- Cognitive route: separate “can train from this log” from “can credibly compare policies with this log.”
- Audit: pass. Narrow intervals without overlap are rejected as false confidence.

## Part 7 — Add structure

### 33 · Hierarchical RL

- Starting model: long tasks contain repeated multi-step behavior.
- New distinction: an option includes initiation set, internal policy, and termination; high-level backups span variable durations.
- Cognitive route: turn a repeated segment into a callable action only after specifying control handoff.
- Audit: pass. Human-readable skill names are not treated as proof of useful decomposition.

### 34 · Multi-agent RL

- Starting model: in single-agent analysis the environment is often treated as stationary.
- New distinction: learning agents make one another’s environment nonstationary; team reward does not solve individual credit; CTDE separates training information from execution information.
- Cognitive route: notice that the world “learns back.”
- Audit: pass. Centralized training does not authorize global observations at deployment.

### 35 · Transfer, meta-learning, and generalization

- Starting model: several tasks or environments are related.
- New distinction: parameter reuse, representation reuse, skills, rapid adaptation, zero-shot generalization, and sim-to-real are different claims.
- Cognitive route: state what must survive the task change and the allowed adaptation budget.
- Audit: pass. Domain randomization includes shortcut risk.

## Part 8 — Make it reliable

### 36 · Reward design

- Starting model: the agent optimizes the signal supplied, not an unstated human goal.
- New distinction: reward shaping may aid learning without changing the optimal policy; proxies invite shortcuts.
- Cognitive route: compare the measurable score with the actual intended outcome under changed conditions.
- Audit: pass. Reward hacking follows from optimization, not from attributing intent to the agent.

### 37 · Safety, robustness, and risk

- Starting model: average reward can hide unacceptable events.
- New distinction: constraints, robustness to perturbations/distribution shifts, and tail-risk sensitivity answer different requirements.
- Cognitive route: refuse to compress a hard requirement into one average score.
- Audit: pass. CMDP accounting and worst-group/tail evidence remain distinct.

### 38 · Evaluation and reproducibility

- Starting model: RL results vary across seeds, budgets, and benchmark details.
- New distinction: evidence requires distributions, intervals, learning curves, fair tuning budgets, and declared comparison units.
- Cognitive route: reject a single favorable curve before discussing method superiority.
- Audit: pass. Reproducibility is treated as a claim chain, not a random-seed checkbox.

### 39 · RL systems

- Starting model: the algorithm consumes transitions produced by an environment and data system.
- New distinction: termination semantics, action units, queues, replay fields, code/config/data identity, and evaluation protocol can alter the implemented problem.
- Cognitive route: follow one transition end to end before optimizing throughput.
- Audit: pass. System contracts precede scale claims.

## Part 9 — RL for language models

### 40 · Language models as RL

- Starting model: a language model generates one token after another.
- New distinction: prompt plus prefix is the state-like information, next token is the action, and sequence-level score creates delayed credit; SFT lacks a policy-consequence loop.
- Cognitive route: draw the token timeline before applying the RL label.
- Audit: pass. “Has a score” is again prevented from implying “is RL.”

### 41 · RLHF with PPO

- Starting model: human comparisons are data, not direct parameter updates.
- New distinction: a reward model is a proxy; sampled responses feed policy optimization; KL limits movement from a reference policy.
- Cognitive route: trace the whole pipeline and expose every approximation.
- Audit: pass. Human preference, reward-model prediction, and policy objective are not collapsed.

### 42 · Direct preference optimization

- Starting model: comparison data identifies a preferred and a nonpreferred response.
- New distinction: DPO-family objectives alter their relative probabilities without a separately trained reward model or online rollout loop.
- Cognitive route: shorten the pipeline, then check which old limitations remain.
- Audit: repaired. Defined `chosen` and `rejected` before using the labels.

### 43 · RLAIF and AI judges

- Starting model: another model can produce preference labels or critiques.
- New distinction: scale changes error correlation; calibration, subgroup checks, and position sensitivity test different failure modes.
- Cognitive route: ask who produced the label and what shared blind spot they may repeat.
- Audit: pass. Stability under reordered answers is not called correctness.

### 44 · RLVR and GRPO

- Starting model: some outcomes can be checked by a program rather than judged subjectively.
- New distinction: verifiable outcome rewards improve label clarity but not credit assignment; GRPO uses within-group relative performance as a baseline.
- Cognitive route: replace an opinion with a check, then inspect the verifier as an attack surface.
- Audit: pass. Final-answer verification is not allowed to stand in for process validity.

### 45 · Test-time compute

- Starting model: a fixed model can sample, search, verify, and rerank several candidates at inference time.
- New distinction: better output without parameter change is not learning; distillation later moves inference work into training data.
- Cognitive route: separate per-query compute from model improvement.
- Audit: pass. Candidate diversity and verifier quality, not sample count alone, explain gains.

### 46 · Method selection

- Starting model: the reader now has a map of problem structures and evidence limitations.
- New distinction: method choice is a sequence of gates about model knowledge, data collection, coverage, observability, action space, safety, and deployment evidence.
- Cognitive route: return to the problem description instead of ranking algorithm names.
- Audit: pass. The ending produces a missing-evidence list rather than a winner.

## Final cumulative snapshot

The reader can now trace one decision problem through five questions: what information is available, how actions alter later situations, where evidence comes from, which estimator turns that evidence into a decision, and what boundary prevents the resulting claim from being stronger than the evidence. The four repaired gaps were local vocabulary jumps rather than missing conceptual pillars. No chapter requires a later chapter to explain its central mechanism retroactively.
