# RL Field Guide teaching voice contract

This contract governs the Chinese rewrite. It describes a way of reasoning, not a collection of verbal tics.

## The reader should meet a problem before a term

A chapter begins with a decision the reader can already understand. It asks what the current thing is for, what would go wrong without it, or which piece of evidence is missing. Only when the ordinary description becomes cumbersome should the chapter introduce the technical name. The term arrives as a handle for a problem the reader has already felt.

The chapter must stay with one situation long enough to finish the thought. It should not use a robot in one paragraph, a recommender in the next, and a board game in the third merely to prove that a concept is general. Generality is earned after one case has been made clear.

## The explanation advances by resolving one obstruction at a time

Each transition should answer a visible question left by the previous paragraph:

1. What are we trying to decide or improve?
2. Why does the obvious method fail in this exact situation?
3. What is the smallest new distinction that repairs that failure?
4. What new problem does the repair create?
5. Which later method exists specifically because of that new problem?

This is the spine of the course. Algorithm families should therefore feel like a sequence of repairs, not a catalogue.

## Definitions, examples, and equations have different jobs

- A definition gives a boundary: what counts and what does not.
- An example makes one mechanism observable. It should not carry four unrelated lessons.
- An equation compresses a relationship that has already been explained in ordinary language.
- A counterexample tests whether the reader has mistaken a local result for a universal claim.

No paragraph should switch jobs halfway through without saying so. If a formula introduces a new assumption, that assumption belongs in the prose before the formula.

## Chapters do not share one compulsory silhouette

Use the structure required by the idea:

- A boundary chapter may be a sequence of misclassifications and corrections.
- An algorithm chapter may follow one failed solution through successive repairs.
- A systems chapter may trace one transition through the actual data path.
- An evaluation chapter may begin from a confident claim and audit the evidence behind it.
- A mathematical chapter may build one quantity line by line, then use a counterexample to show its limit.

Examples, diagrams, calculations, and comparison tables are optional. They stay only when they make a mechanism easier to inspect than prose would.

## Sentence-level rules

- Prefer concrete verbs: choose, record, compare, update, stop, reuse, estimate.
- State the subject of every judgment. Do not write “the value is higher” when the real claim is “the greedy target assigns a higher continuation value.”
- Use short local recaps when a distinction has just been established.
- Introduce at most one unexplained technical term per paragraph.
- Use spoken pivots sparingly. Natural patience matters more than imitating catchphrases.
- Do not write slide headings disguised as prose, motivational filler, or symmetrical four-part lists merely because the data model has four slots.

## Acceptance test for every rewritten chapter

After reading only that chapter, a beginner should be able to answer:

1. What concrete problem forced this concept to appear?
2. What does the method actually change or estimate?
3. Why is the simpler previous method insufficient?
4. What is one situation where the new method still fails?
5. What unanswered question naturally leads to the next chapter?

If the reader can repeat the names but cannot answer these five questions, the chapter is not finished.
