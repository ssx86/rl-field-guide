# Beginner brain ledger: Chinese deep chapters

## Reader at the door

The simulated reader is an ordinary adult who can follow daily cause and effect, compare quantities, understand percentages and averages, and rearrange simple algebra. The reader has used ordinary apps and can imagine a car choosing a route, a game ending, or a queue becoming stale.

The deliberately restricted professional baseline is zero: no reinforcement-learning vocabulary, no machine-learning training vocabulary, no calculus, no probability notation, no assumption that `token`, `gradient`, `KL`, `bootstrap`, `logit`, `critic`, or an algorithm acronym is self-explanatory. Familiar-looking English is not knowledge.

Operating rule: the brain may use only **daily-life knowledge ∪ facts learned through the previous chapter**. A paragraph fails if its central step needs anything else and does not teach it locally. In every entry below, **Starting model** is the cumulative snapshot before the chapter, **New distinction** is the added fact, **Cognitive route** is the derivation the prose asks the reader to make, **Analogy consistency** checks whether the concrete carrier still matches the mechanism, and **Audit** records the second-pass result after repairs.

## Part 1 — Recognize the problem

### 01 · Before RL

- Starting model: a program receives inputs and may be scored.
- New distinction: a scored prediction is not automatically a sequential decision; an action must alter later evidence or choices.
- Cognitive route: remove the word “reward,” inspect the causal loop, then compare RL with simpler alternatives.
- Analogy consistency: the route-choice contrast carries only the sequence-versus-one-shot distinction; it is not reused to claim every RL task is navigation.
- Audit: pass. “Reward” grows out of consequences rather than arriving as unexplained jargon.

### 02 · Interaction loop

- Starting model: the reader can recognize a sequential decision.
- New distinction: agent, environment, observation, state, action, reward, termination, and truncation occupy different positions in time.
- Cognitive route: draw who controls what before naming an algorithm; treat state as a predictive promise.
- Analogy consistency: the driving example preserves control boundaries and is dropped once the timestamp relation is established.
- Audit: pass. The clock order prevents the common leak in which the agent is allowed to see the result before acting.

### 03 · Return and horizon

- Starting model: one transition produces one reward and a later situation.
- New distinction: return aggregates later rewards; horizon and discount say how far and how strongly the future counts; stopping is not always terminal.
- Cognitive route: compare two paths with equal first rewards, then ask where the future ends.
- Analogy consistency: the dead-end route demonstrates delayed consequence only; the text explicitly stops it from implying that equal return means equal safety.
- Audit: pass. Terminal versus truncated is attached to bootstrap semantics, not presented as an API footnote.

### 04 · Probability and expectation

- Starting model: repeated runs can end differently.
- New distinction: a sample is one outcome; a distribution is the rule producing outcomes; expectation is a conditional weighted average.
- Cognitive route: separate one lucky episode from policy quality before introducing stochastic policies.
- Analogy consistency: repeated delivery times support samples and averages without pretending every uncertainty comes from dice-like randomness.
- Audit: pass. Randomness, ignorance, and estimator error remain separate.

### 05 · Bandits and contextual bandits

- Starting model: choices have uncertain outcomes but no lasting state transition.
- New distinction: exploration buys information; epsilon-greedy, optimism/UCB, and sampling express different reasons to explore.
- Cognitive route: remove state transition first, then add context without pretending context creates a future.
- Analogy consistency: repeated choices are used only while actions do not alter a continuing state; the analogy expires exactly where state transition begins.
- Audit: pass after repair. “Posterior sampling” was replaced by the concrete act of sampling one model still allowed by current evidence before the name Thompson sampling appears.

### 06 · MDP and state design

- Starting model: actions can change later situations.
- New distinction: the Markov property is a claim about the chosen state representation, not a badge attached to the world.
- Cognitive route: ask what forgotten history still changes the next-step distribution.
- Analogy consistency: the same 80°C display with different trends preserves the claim that equal observations can hide different predictive histories.
- Audit: pass. State compression and state explosion are presented as competing errors.

### 07 · Value and Bellman equations

- Starting model: return describes an entire future under a policy.
- New distinction: value is expected future return; Bellman bookkeeping splits it into one step plus the remaining future.
- Cognitive route: first need a map of consequences, then discover the recursive identity.
- Analogy consistency: the map metaphor is limited to future consequences under a policy and never implies that value is a physical property of the state.
- Audit: pass. Expectation remains over possible transitions rather than silently choosing the best successor.

## Part 2 — Solve small problems exactly

### 08 · Dynamic programming

- Starting model: value obeys one-step recursive bookkeeping.
- New distinction: with a known model, the job is planning; policy evaluation and improvement answer different questions.
- Cognitive route: contrast calculation from known rules with learning from sampled experience.
- Analogy consistency: calculating on known rules is contrasted with collecting experience; the chapter does not turn the known model into a sampled log.
- Audit: pass. Synchronous, in-place, and prioritized updates are identified as schedules, not different objectives.

### 09 · Monte Carlo

- Starting model: values can be estimated from experience when the model is unknown.
- New distinction: complete returns avoid bootstrapping but can have high variance; visit-count conventions matter.
- Cognitive route: wait for the episode’s answer, then notice the cost of waiting and noise.
- Analogy consistency: waiting for an episode’s final bill matches complete-return estimation and is explicitly bounded to episodic data.
- Audit: pass. “Unbiased” is not allowed to imply “stable.”

### 10 · TD and traces

- Starting model: Monte Carlo waits for an episode; Bellman equations permit one-step decomposition.
- New distinction: TD bootstraps, n-step targets interpolate, and eligibility traces allocate a later error backward.
- Cognitive route: need earlier learning in long episodes, then ask which prior states still deserve credit.
- Analogy consistency: traces are described as fading responsibility records, not as literal memory that identifies causality.
- Audit: pass. Lambda is explained as a time-scale choice rather than a decorative hyperparameter.

### 11 · Tabular control

- Starting model: a sampled transition can update an action value.
- New distinction: SARSA, Expected SARSA, and Q-learning differ in whose next action values the target uses; Double Q separates selection from evaluation.
- Cognitive route: freeze one transition and vary only the answer to “who values the next state?”
- Analogy consistency: one frozen transition is retained across all four methods, so the comparison changes only the next-state valuation rule.
- Audit: pass. The formula matrix is subordinate to the question and remains mathematically exact.

### 12 · Off-policy learning and the deadly triad

- Starting model: behavior and target policies can differ.
- New distinction: importance ratios reweight existing coverage but cannot invent missing actions; off-policy learning, bootstrapping, and approximation can amplify one another.
- Cognitive route: ask whether old data has standing to speak for the new policy before applying a correction.
- Analogy consistency: “old data speaking for a new policy” maps to representativeness, and the prose explicitly says reweighting cannot invent an unobserved consequence.
- Audit: pass. Zero support is stated as “no answer,” not as a numerical inconvenience.

## Part 3 — Approximate and scale

### 13 · Linear approximation

- Starting model: tables fail when many states should share evidence.
- New distinction: features explicitly choose the sharing pattern; a projected update couples states.
- Cognitive route: decide what “similar” should mean before introducing weights.
- Analogy consistency: feature sharing remains a mechanical coupling between states, not a vague claim that the model “understands similarity.”
- Audit: pass after repair. Gradient is introduced as the direction in which a tiny weight change moves a prediction before “semi-gradient” is used.

### 14 · Neural approximation

- Starting model: linear features hand-code similarity.
- New distinction: a network learns its representation while its targets and data distribution move with the policy.
- Cognitive route: begin with the loss resembling ordinary regression, then expose why RL data is not a fixed supervised dataset.
- Analogy consistency: the moving-target description applies to targets and data distributions; it is not stretched into a claim that every update is unstable.
- Audit: pass after repair. Regression is defined as moving a numerical prediction toward a given numerical target before the chapter contrasts fixed supervised data with RL data.

### 15 · DQN

- Starting model: a neural network can approximate action values but creates correlated data and moving targets.
- New distinction: replay changes the training stream; a target network slows the target’s movement.
- Cognitive route: name the two failure mechanisms before naming the two repairs.
- Analogy consistency: replay “reshuffles the training stream” and target delay “slows the chase”; both metaphors are immediately translated into stored transitions and delayed parameters.
- Audit: pass. Engineering devices remain causally tied to estimator stability.

### 16 · DQN family

- Starting model: the DQN baseline has identifiable failure modes.
- New distinction: Double, dueling, prioritized replay, distributional value, and noisy exploration repair different parts of the system.
- Cognitive route: sort extensions by whether they alter target, architecture, sampling, representation, or exploration.
- Analogy consistency: extensions are grouped by the exact system part they alter, so “family” does not imply interchangeable repairs.
- Audit: pass. Rainbow is a combination, not evidence that every component helps every task.

### 17 · REINFORCE and policy gradients

- Starting model: value-based selection becomes awkward when actions cannot be usefully enumerated.
- New distinction: change action probabilities directly using sampled return and log-probability gradients; use a baseline to reduce variance.
- Cognitive route: ask for a differentiable handle on a random action rather than dropping in the log trick unexplained.
- Analogy consistency: “push or pull an action probability” is tied to the sign and weight of the sampled return, not to literal force or reward-as-probability.
- Audit: pass after repair. Gradient and logits are both defined in action-probability language at first use; the return is explicitly kept separate from the new probability.

### 18 · Actor–critic and GAE

- Starting model: REINFORCE has a valid but noisy delayed signal.
- New distinction: the critic estimates advantage for the actor; GAE selects a bias–variance time scale.
- Cognitive route: introduce the critic as an early judge because the full return is slow and noisy.
- Analogy consistency: actor and critic are roles in one feedback loop, not two independent people whose judgments can be trusted separately.
- Audit: pass. Mutual dependence and error propagation are explicit.

### 19 · TRPO and PPO

- Starting model: policy gradients give a direction but not a universally safe step size.
- New distinction: probability ratios measure local change; TRPO constrains average KL while PPO clips incentive.
- Cognitive route: show why old-policy data loses relevance when the new policy moves too far.
- Analogy consistency: the “step too far” frame is translated into old-data relevance; KL is defined as one-number distribution distance before reuse.
- Audit: pass after repair. KL no longer arrives as assumed mathematical vocabulary, and clipping remains distinct from a hard constraint.

### 20 · Continuous control

- Starting model: discrete maximization relied on listing actions.
- New distinction: DDPG supplies an actor–critic skeleton, TD3 repairs overestimation, and SAC adds entropy to the objective.
- Cognitive route: begin with the impossibility of enumerating steering angles or torques.
- Analogy consistency: steering angle and torque establish non-enumerable actions without implying all continuous actions share the same units or limits.
- Audit: pass. Action units and bounds are treated as part of the problem definition.

### 21 · Distributed RL

- Starting model: actors produce experience and a learner updates a policy.
- New distinction: distribution adds policy lag, queue delay, replay skew, and correction choices—not just speed.
- Cognitive route: follow the timestamp of one transition through the system.
- Analogy consistency: following one timestamped transition through queues preserves the estimator issue and does not reduce distributed RL to hardware speed.
- Audit: pass after repair. V-trace is explained as correcting an old trajectory by behavior/current-policy probability differences; burn-in is defined as a prefix used to recover hidden state.

## Part 4 — Remember and explore

### 22 · POMDP and memory

- Starting model: a Markov state should make the present sufficient for predicting the next step.
- New distinction: partial observation creates hidden-state uncertainty; belief is a distribution, and memory is only one mechanism for updating it.
- Cognitive route: use identical observations with different hidden situations.
- Analogy consistency: identical views with different hidden situations establishes partial observability; memory is then presented as one possible repair, not the hidden state itself.
- Audit: pass. A recurrent network is not equated with a correct belief state.

### 23 · Deep exploration

- Starting model: random one-step exploration works poorly when discovery requires a coherent sequence.
- New distinction: counts, uncertainty, prediction error, information gain, entropy, curiosity, and RND encode different evidence.
- Cognitive route: contrast a planned exploratory trajectory with repeated coin flips.
- Analogy consistency: committing to one exploratory route captures temporally coherent information gathering; it expires before intrinsic reward mechanisms are compared.
- Audit: pass. The noisy-TV counterexample blocks the shortcut “novel equals useful.”

### 24 · Long-horizon credit

- Starting model: memory can retain events, but retention does not identify causes.
- New distinction: credit assignment, reward redistribution, and hindsight relabeling solve different problems.
- Cognitive route: ask which early action was cause, enabling condition, or coincidence.
- Analogy consistency: cause, enabling condition, and coincidence remain separate; the chapter does not let “memory” stand in for causal credit.
- Audit: pass. Hindsight changes the goal label only where dynamics remain valid.

## Part 5 — Learn and search a model

### 25 · MCTS and AlphaZero

- Starting model: a known simulator can be queried before acting.
- New distinction: a search tree expands action sequences selectively; selection, expansion, evaluation, and backup play different roles; AlphaZero forms a search–network loop.
- Cognitive route: move trial and error inside the model, then ration the search budget.
- Analogy consistency: the tree is defined from current state, action, and successor before search vocabulary appears; tree exploration stays separate from real-environment exploration.
- Audit: pass after repair. Root, edge, layer, selection, expansion, evaluation, and backup all have observable jobs.

### 26 · Dyna and MPC

- Starting model: the environment rules may be learned rather than given.
- New distinction: Dyna uses a model to create training experience; MPC replans actions online; short imagined rollouts limit compounding error.
- Cognitive route: ask what a learned model is used for, not merely whether it predicts well.
- Analogy consistency: “practice inside the model” is bounded by model error and never treated as free real experience.
- Audit: pass. Visual fidelity is not accepted as decision fidelity.

### 27 · Latent world models

- Starting model: a learned model need not reconstruct every pixel to support decisions.
- New distinction: latent state preserves control-relevant information; posterior uses the observed next frame while prior predicts without it; Dreamer and MuZero retain different targets.
- Cognitive route: compress only what does not alter reward or available actions.
- Analogy consistency: compression is judged by changed rewards/actions, not by visual resemblance, so the suitcase-like intuition does not erase control-relevant detail.
- Audit: pass after repair. Prior and posterior are defined by whether the next observation is already available.

## Part 6 — Learn from existing data

### 28 · Behavior cloning and DAgger

- Starting model: demonstrations provide state–action pairs.
- New distinction: supervised imitation suffers compounding distribution shift; DAgger asks the expert on states reached by the learner.
- Cognitive route: one small imitation error changes the next input, which causes another unfamiliar decision.
- Analogy consistency: one steering mistake causing an unfamiliar next view exactly matches compounding distribution shift; expert relabeling is restricted to learner-visited states.
- Audit: pass. DAgger is not reduced to “more demonstrations.”

### 29 · Inverse RL and GAIL

- Starting model: expert behavior is observed but the objective may be missing.
- New distinction: many rewards can explain the same behavior; IRL recovers an objective model while GAIL matches occupancy behavior more directly.
- Cognitive route: ask whether reproducing behavior proves the inferred reason.
- Analogy consistency: several motives producing the same route supports reward ambiguity, while GAIL is explicitly described as matching state-action behavior rather than recovering motive.
- Audit: pass. Interpretability requires evidence beyond imitation success.

### 30 · Offline RL

- Starting model: no fresh environment queries are permitted.
- New distinction: out-of-support actions can receive fictitious high values; BCQ, CQL, and IQL remain near evidence in different ways.
- Cognitive route: treat the dataset as the only observable world.
- Analogy consistency: treating the fixed dataset as the only observable world preserves the support constraint and stops before implying that conservative estimates are always optimal.
- Audit: pass. Pessimism is a response to missing evidence, not a moral preference for inaction.

### 31 · Decision Transformer

- Starting model: trajectories include states, actions, rewards, and return-to-go.
- New distinction: sequence conditioning can request a target return but does not itself perform online planning.
- Cognitive route: train on historical remaining return, then distinguish the deployment request from knowledge of the future.
- Analogy consistency: “ask for a return, then imitate” is immediately limited to trajectory patterns in the data; the requested return is not treated as a plan.
- Audit: pass. Dataset support remains the boundary.

### 32 · Off-policy evaluation

- Starting model: a candidate policy exists but cannot yet be deployed.
- New distinction: direct modeling, importance sampling, and FQE have distinct model, variance, coverage, and bootstrap failures.
- Cognitive route: separate “can train from this log” from “can credibly compare policies with this log.”
- Analogy consistency: judging a policy without deploying it stays an evidence problem; modeling and reweighting are not described as virtual deployment.
- Audit: pass. Narrow intervals without overlap are rejected as false confidence.

## Part 7 — Add structure

### 33 · Hierarchical RL

- Starting model: long tasks contain repeated multi-step behavior.
- New distinction: an option includes initiation set, internal policy, and termination; high-level backups span variable durations.
- Cognitive route: turn a repeated segment into a callable action only after specifying control handoff.
- Analogy consistency: a callable repeated segment matches an option only after initiation, internal control, and termination are all specified.
- Audit: pass. Human-readable skill names are not treated as proof of useful decomposition.

### 34 · Multi-agent RL

- Starting model: in single-agent analysis the environment is often treated as stationary.
- New distinction: learning agents make one another’s environment nonstationary; team reward does not solve individual credit; CTDE separates training information from execution information.
- Cognitive route: notice that the world “learns back.”
- Analogy consistency: “the world learns back” is translated into other agents changing policies, and does not imply the physical environment itself optimizes.
- Audit: pass. Centralized training does not authorize global observations at deployment.

### 35 · Transfer, meta-learning, and generalization

- Starting model: several tasks or environments are related.
- New distinction: parameter reuse, representation reuse, skills, rapid adaptation, zero-shot generalization, and sim-to-real are different claims.
- Cognitive route: state what must survive the task change and the allowed adaptation budget.
- Analogy consistency: reuse and adaptation are tracked by what changes and how much new evidence is allowed, preventing “transfer” from becoming a vague similarity claim.
- Audit: pass. Domain randomization includes shortcut risk.

## Part 8 — Make it reliable

### 36 · Reward design

- Starting model: the agent optimizes the signal supplied, not an unstated human goal.
- New distinction: reward shaping may aid learning without changing the optimal policy; proxies invite shortcuts.
- Cognitive route: compare the measurable score with the actual intended outcome under changed conditions.
- Analogy consistency: “the agent follows the score” is repeatedly translated into objective optimization and is not anthropomorphized as malicious intent.
- Audit: pass. Reward hacking follows from optimization, not from attributing intent to the agent.

### 37 · Safety, robustness, and risk

- Starting model: average reward can hide unacceptable events.
- New distinction: constraints, robustness to perturbations/distribution shifts, and tail-risk sensitivity answer different requirements.
- Cognitive route: refuse to compress a hard requirement into one average score.
- Analogy consistency: refusing to average away a hard limit matches constraints; robustness and tail risk are introduced as separate questions rather than extra penalties in one score.
- Audit: pass after repair. CVaR is defined as the average within the worst selected fraction before the acronym is reused.

### 38 · Evaluation and reproducibility

- Starting model: RL results vary across seeds, budgets, and benchmark details.
- New distinction: evidence requires distributions, intervals, learning curves, fair tuning budgets, and declared comparison units.
- Cognitive route: reject a single favorable curve before discussing method superiority.
- Analogy consistency: auditing one confident learning curve maps to distributions, budgets, and intervals; it does not imply that more seeds repair an unfair protocol.
- Audit: pass. Reproducibility is treated as a claim chain, not a random-seed checkbox.

### 39 · RL systems

- Starting model: the algorithm consumes transitions produced by an environment and data system.
- New distinction: termination semantics, action units, queues, replay fields, code/config/data identity, and evaluation protocol can alter the implemented problem.
- Cognitive route: follow one transition end to end before optimizing throughput.
- Analogy consistency: tracing one transition through fields, queues, and versions keeps the same object visible and avoids switching to unrelated infrastructure examples.
- Audit: pass. System contracts precede scale claims.

## Part 9 — RL for language models

### 40 · Language models as RL

- Starting model: a language model generates one token after another.
- New distinction: prompt plus prefix is the state-like information, next token is the action, and sequence-level score creates delayed credit; SFT lacks a policy-consequence loop.
- Cognitive route: draw the token timeline before applying the RL label.
- Analogy consistency: token-as-action is declared a mapping, not an equivalence proof; word pieces and punctuation expose where the analogy becomes awkward.
- Audit: pass after repair. Token is defined as a generated unit before the mapping, and SFT is expanded and explained before the acronym is relied on.

### 41 · RLHF with PPO

- Starting model: human comparisons are data, not direct parameter updates.
- New distinction: a reward model is a proxy; sampled responses feed policy optimization; KL limits movement from a reference policy.
- Cognitive route: trace the whole pipeline and expose every approximation.
- Analogy consistency: KL as a leash is explicitly followed by what “tight” and “loose” mean, while the text preserves that it is a penalty rather than a physical guarantee.
- Audit: pass. Human preference, reward-model prediction, and policy objective are not collapsed.

### 42 · Direct preference optimization

- Starting model: comparison data identifies a preferred and a nonpreferred response.
- New distinction: DPO-family objectives alter their relative probabilities without a separately trained reward model or online rollout loop.
- Cognitive route: shorten the pipeline, then check which old limitations remain.
- Analogy consistency: shortening the pipeline is described literally by removed stages; it is not allowed to imply that data bias or support problems disappear.
- Audit: pass after repair. `chosen`, `rejected`, and the reference-policy comparison are established before DPO-family distinctions.

### 43 · RLAIF and AI judges

- Starting model: another model can produce preference labels or critiques.
- New distinction: scale changes error correlation; calibration, subgroup checks, and position sensitivity test different failure modes.
- Cognitive route: ask who produced the label and what shared blind spot they may repeat.
- Analogy consistency: a consistent judge is compared with a consistently biased judge, so stability never silently becomes truth.
- Audit: pass. Stability under reordered answers is not called correctness.

### 44 · RLVR and GRPO

- Starting model: some outcomes can be checked by a program rather than judged subjectively.
- New distinction: verifiable outcome rewards improve label clarity but not credit assignment; GRPO uses within-group relative performance as a baseline.
- Cognitive route: replace an opinion with a check, then inspect the verifier as an attack surface.
- Analogy consistency: replacing opinion with a programmatic check is bounded by verifier coverage and exploitability; group comparison is not treated as new external evidence.
- Audit: pass. Final-answer verification is not allowed to stand in for process validity.

### 45 · Test-time compute

- Starting model: a fixed model can sample, search, verify, and rerank several candidates at inference time.
- New distinction: better output without parameter change is not learning; distillation later moves inference work into training data.
- Cognitive route: separate per-query compute from model improvement.
- Analogy consistency: “spend more work per question” stays separate from parameter learning; distillation explicitly marks when inference results later become training data.
- Audit: pass. Candidate diversity and verifier quality, not sample count alone, explain gains.

### 46 · Method selection

- Starting model: the reader now has a map of problem structures and evidence limitations.
- New distinction: method choice is a sequence of gates about model knowledge, data collection, coverage, observability, action space, safety, and deployment evidence.
- Cognitive route: return to the problem description instead of ranking algorithm names.
- Analogy consistency: method selection is a sequence of evidence gates rather than a leaderboard; no earlier algorithm is retroactively declared universally best.
- Audit: pass. The ending produces a missing-evidence list rather than a winner.

## Final cumulative snapshot

The reader can now trace one decision problem through five questions: what information is available, how actions alter later situations, where evidence comes from, which estimator turns that evidence into a decision, and what boundary prevents the resulting claim from being stronger than the evidence. The first pass found ten vocabulary bridges that the author had silently assumed; each was repaired at first use and rechecked against later reuse. No chapter now requires a later chapter to explain its central mechanism retroactively, and no analogy is relied on after the prose has crossed its stated boundary.
