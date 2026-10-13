# Formula and notation audit — 2026-10-14

## Scope

- Audited every `equations[].latex` expression in the 46-chapter English corpus.
- Rendered the same expressions again through all 46 Chinese routes.
- Parsed every equation and every diagram value marked as mathematics with KaTeX `throwOnError: true`.
- Kept English/Chinese LaTeX, worked calculations, and source URLs byte-identical.
- Rebuilt the four-method tabular-control comparison as full-width rows and checked it at 1280, 768, 390, 375, and 320 CSS pixels.

## Notation contract

- Sampled random variables use capitals with time indices: `S_t`, `A_t`, `R_{t+1}`.
- Dummy values used by sums, maxima, and function arguments use lowercase symbols such as `s` and `a`.
- `π` denotes a policy and `Q` or `V` denotes a learned value estimate.
- A terminal transition removes bootstrap value; a time-limit truncation normally does not.
- Conditional expectations state what is held fixed. A single action likelihood ratio does not correct a different state distribution.

## Corrections made

1. Tabular control now renders the exact continuation terms for sampled SARSA, policy-weighted Expected SARSA, greedy Q-learning, and the select-with-A/evaluate-with-B Double Q update.
2. The one-step target uses `D_{t+1}` for the termination flag returned with `(R_{t+1}, S_{t+1})`, avoiding an off-by-one reading.
3. The importance-sampling identity is explicitly conditional on a fixed state and an action sampled from `b(·|s)`; it no longer overclaims correction of state occupancy.
4. The SAC trajectory objective now displays the discount factor on both reward and entropy terms.
5. The GRPO-style expression is labeled as a maximized objective `J_GRPO(θ)`, rather than an ambiguous loss `L` with the wrong optimization convention left implicit.

## Evidence boundary

Automated parsing proves syntactic renderability and the parity tests prevent locale drift. The semantic pass checked indexing, conditioning, optimization direction, terminal masking, and operator scope against each chapter's cited primary source. It does not claim that all research papers use one universal notation; where conventions differ, the chapter states the convention used locally.
