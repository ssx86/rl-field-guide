# Cumulative beginner-brain audit

## Starting knowledge

The reader knows ordinary cause and effect, averages, probability as “how often,” and can follow arithmetic when each number has a visible job. The reader does not yet know RL vocabulary, Bellman notation, policy gradients, or post-training acronyms.

## Knowledge snapshots

1. After Chapter 00: RL is a family of responses to successive problem changes—not a bag of algorithm names. The reader can locate a new problem by asking about time, information, data, model access, risk, and feedback.
2. After Part 1: the reader can reject false RL problems, draw the agent–environment clock, distinguish reward from return, reason with expectations, and recognize when a bandit stops being enough.
3. After Part 2: state is understood as a predictive claim; value as policy-conditioned expectation; Bellman updates as bookkeeping; DP, MC, TD, control, and off-policy learning as different evidence routes.
4. After Part 3: the reader sees approximation as shared change, understands why neural targets move, and can tell which instability DQN, policy gradients, PPO, continuous-control, and distributed mechanisms address.
5. After Parts 4–5: memory repairs hidden state, exploration seeks useful unknowns, credit assigns delayed outcomes, and models/search exchange real interaction for assumptions about imagined futures.
6. After Part 6: demonstrations and logs constrain what can be learned; imitation, inverse methods, offline RL, sequence models, and OPE make different claims about the same evidence boundary.
7. After Parts 7–8: hierarchy, teams, and task distributions alter problem structure; reward, constraints, evaluation, and systems determine whether a score corresponds to a trustworthy result.
8. After Part 9: LLM post-training is readable using the same state–action–trajectory–feedback frame, while preference models, judges, verifiers, and test-time search introduce new measurement boundaries.

## Remaining prerequisite traps checked

- “State” is never introduced as merely the input array.
- Expected value is explained before it is used as a decision object.
- Bootstrapping is introduced through observed versus estimated terms before the name appears.
- On-policy/off-policy is introduced by naming behavior and target roles, not by definition alone.
- Advantage is explained as performance relative to a state baseline before GAE or PPO uses it.
- KL, importance ratios, and clipping all point back to old-versus-new action probabilities.
- Occupancy is introduced as what a policy visits before imitation or distribution shift relies on it.
- LLM chapters reuse established RL concepts instead of restarting with unexplained post-training jargon.

## Post-rewrite result

No critical prerequisite gap remains in the intended reading order. Readers who jump directly into a later chapter receive a short bridge plus prerequisite links; they are not promised that one isolated page replaces the cumulative route.
