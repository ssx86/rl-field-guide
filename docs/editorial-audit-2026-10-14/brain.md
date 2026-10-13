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

## Second pass after the writing-skill audit

The simulated reader is unchanged: an adult who understands routes, repeated choices, averages, and ordinary cause and effect, but has no RL vocabulary. The second pass checks the new read-first route one movement at a time instead of assuming that a complete curriculum automatically supplies a complete overview.

| Stop | What the reader can now say in ordinary language | Next question earned rather than announced |
|---|---|---|
| Opening | An action produces both a result and the next learning situation. | Do we need learning from consequences at all? |
| 01 · One choice | Shortest paths, supervised prediction, and bandits solve different evidence problems; probability makes noisy averages meaningful. | What changes when one choice alters the next choice? |
| 02 · Future | State, action, reward, policy, trajectory, and return describe one timed loop; Bellman value keeps an account of later consequences. | What evidence is available when the map is known or missing? |
| 03 · Values | DP uses a known model; MC waits for sampled endings; TD bootstraps; SARSA and Q-learning disagree about whose next action is valued. | How can experience transfer when the state table explodes? |
| 04 · Scale | Approximation shares updates; DQN, policy gradients, actor–critic, PPO, continuous control, and distributed RL repair different scaling pressures. | Is failure caused by missing information, missing visits, or delayed credit? |
| 05 · Hidden causes | Memory, exploration, and credit assignment address three different breaks in the evidence chain. | Can imagined experience replace expensive real interaction? |
| 06 · Models | Search, learned dynamics, latent models, and planning trade interaction for assumptions; a planner can exploit model error. | What if new interaction is unsafe or forbidden? |
| 07 · Logged world | Demonstrations, inverse methods, offline RL, sequence conditioning, and OPE remain bounded by data support. | Can temporal or social structure make the task manageable? |
| 08 · Structure | Options, teams, and transfer change the unit of action, the source of non-stationarity, or the task distribution. | What if the score itself is the wrong target? |
| 09 · Measurement | Reward design, constraints, evaluation, RLHF, direct preferences, judges, verifiers, and search are distinct evidence systems. | Which constraints eliminate method families before ranking algorithms? |
| Closing diagnostic | Seven questions locate a new RL problem without starting from an acronym. | Open the matching deep chapter and inspect its mechanism and boundary. |

Two missing handoffs were found and repaired in both languages: the article now links the initial diagnosis to `before-rl`, and noisy comparisons to `probability-expectation`. The resulting link set equals all 46 curriculum slugs in English and Chinese. Repeated links to bandits and tabular control are intentional callbacks, not missing pages.

The chapter-by-chapter cognitive check remains the 47-row table in `AUDIT.md` (Chapter 00 plus Chapters 01–46). On this second pass, every row was checked against the cumulative snapshots above. No chapter requires a concept that first appears later in the prescribed route; direct-entry readers receive a bridge and prerequisite links rather than a false promise of zero prerequisites.
