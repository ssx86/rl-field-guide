# Beginner-brain audit report

## Scope and method

This audit covers the 46 Chinese deep chapters in reading order. The simulated reader begins with ordinary causal reasoning, percentages, averages, and simple algebra, but no reinforcement-learning terms. Each chapter was checked for prerequisite continuity, first-use definitions, analogy fidelity, explicit failure boundaries, and whether the section order follows a question rather than a fixed presentation template.

The detailed per-chapter ledger is in `brain.md`.

## Result after repair

- 46/46 chapters begin from a concrete decision or evidence problem.
- 46/46 finish with an explicit boundary instead of a universal recommendation.
- All chapters use authored section titles and ordering; there are at least ten distinct component sequences across the course.
- Formulas, worked calculations, source references, and existing bilingual factual alignment were preserved.
- Four first-use vocabulary jumps were repaired during the audit: regression in neural approximation, tree anatomy in MCTS, prior/posterior in latent world models, and chosen/rejected in direct preference optimization.

## The three largest structural risks checked

### 1. Algorithm names arriving before the problem

The rewrite now introduces the failure or constraint first. DQN follows moving targets and correlated samples; PPO follows oversized policy steps; SAC follows continuous actions and exploration; offline RL follows missing interaction and unsupported actions. Names answer a problem already visible to the reader.

### 2. Adjacent concepts being collapsed

The prose keeps high-risk distinctions separate: reward versus return, observation versus state, termination versus truncation, sample versus expectation, memory versus credit, search versus learning, SFT versus RL, and inference-time search versus training. These separations are repeated only when a later topic depends on them.

### 3. A formula or diagram becoming the explanation

Equations and visual components are optional evidence blocks in the Chinese renderer. The prose movement is the primary structure. The tabular-control formula comparison remains because the mathematical difference is the subject; method-selection omits a diagram because a forced picture would add presentation shape without explanatory value.

## Residual limitations

- This is a source, build, and browser-level editorial audit, not observed comprehension data from real novice readers.
- English deep chapters retain the previous fixed renderer and wording; the new authored narrative flow is currently Chinese-only.
- Some chapters necessarily use standard English algorithm names because those names are the searchable technical vocabulary; every central mechanism is still explained in Chinese prose.

## Release recommendation

Content and layout are ready for local acceptance. Publish only after the user has inspected representative early, middle, and late chapters in the local preview and explicitly requests deployment.
