# Myself-style audit · Chinese chapter rewrite

## Evidence used

The rewrite used the `myself` skill against the self-only meeting corpus named in its source map: 14 transcript files, 70,585 characters. The corpus was used to recover recurring reasoning moves, not to copy verbal fillers, meeting-specific facts, or personal phrasing into the tutorial.

The strongest recurring moves were:

1. Start from the object already in front of the reader and ask what it is actually for.
2. Separate two adjacent problems before proposing a solution; identify which part is genuinely unknown and which part is merely laborious.
3. Keep one concrete object on screen long enough to finish the mechanism instead of switching examples mid-thought.
4. Turn a technical label into a sequence the reader can inspect: what entered, what changed, what came back, and what evidence would verify it.
5. Do not generate the polished surface first. Establish the decision path and failure boundary, then decide whether a formula, example, diagram, or table earns its place.

These moves were converted into the public teaching-voice contract in `docs/editorial/teaching-voice-contract.md`. Voice-recognition fillers and confirmation tics were deliberately excluded; imitating them would reproduce noise rather than reasoning style.

## Audit questions

Every rewritten chapter was checked against the following questions:

- Does the first paragraph expose a concrete obstruction before naming the method?
- Does the chapter retain one causal object until the obstruction is resolved?
- When two methods look similar, does the text isolate the single decision on which they differ?
- Does every judgment name its evidence source rather than say only that something is “better” or “more stable”?
- Does the boundary state what the method cannot prove or repair?
- Does the last unresolved question make the next chapter necessary?
- Could the section order be changed without breaking the reasoning? If yes, the chapter is probably a catalogue and must be rewritten.

## Findings and repairs

### Catalogue-shaped family chapters

The highest-risk chapters were DQN family, continuous control, offline RL, direct preference optimization, and RL-for-LLM variants. Their previous structure could be read as a set of neighboring names. The rewritten version groups each name by the exact component it changes—target, representation, data distribution, exploration, policy constraint, or proxy signal—and ends by naming the evidence each repair still lacks.

### Formula-first explanations

Tabular control, policy gradients, PPO, and safety metrics risked asking the reader to infer the question from notation. The rewrite now states the disputed choice first: who values the next state, how a parameter change moves an action probability, how far old data can speak for a new policy, or which bad outcomes an average hides. Equations remain unchanged and arrive as compact records of an already visible relationship.

### Repeated article silhouette

The renderer supports varied block order, but layout variation alone does not create varied reasoning. The rewritten corpus therefore uses chapter-specific section IDs and transitions. Automated inspection reports:

- 46 chapter openings, with no duplicate first 16-character opening.
- 366 rendered prose paragraphs, all unique.
- At least 10 distinct narrative component sequences.
- No occurrences of the banned presentation phrases “首先，我们”, “其次，我们”, “最后，我们”, “综上所述”, “在本章节中”, “让我们深入探讨”, or “值得注意的是”.

### False imitation of speech

The first draft risk was to reproduce hesitation words or frequent spoken pivots. That was rejected. The final prose borrows the corpus's method—problem, evidence, action, verification—while keeping edited written Chinese. Naturalness is measured by continuity and named subjects, not by inserting “嗯”, “对”, or conversational padding.

## Second-pass result

All 46 chapters pass the style audit after repair. The text does not use a single compulsory chapter silhouette, does not rely on a large comparison table as the course spine, and does not ask algorithm names to carry an explanation. Remaining standard English names are kept as searchable technical vocabulary, but they appear only after the reader can say what problem the name exists to solve.

This audit establishes source-to-text consistency under the `myself` reasoning standard. It does not claim that the prose is a literal transcript imitation or that every future reader will prefer the same cadence.
