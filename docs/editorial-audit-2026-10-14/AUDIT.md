# Editorial and formula audit — 2026-10-14

This audit separates four claims: authored copy, automated consistency, browser rendering, and public deployment. A pass in one column does not imply a pass in another.

## Standards

- Editorial: each chapter begins with a concrete tension, lets the example create the need for a concept, and ends with a real limitation that opens the next question.
- Voice: no legacy generator phrases, fake quotations, slogan stacks, generic three-step summaries, or repeated paragraph templates.
- Mathematics: English LaTeX and worked calculations are the source of truth; Chinese pages reuse those exact strings. Case, primes, subscripts, terminal masks, conditioning bars, maxima, sums, and policy symbols remain identical.
- Cognitive load: a reader can follow the situation before meeting notation; every equation points back to quantities already introduced.
- Layout: long display math scrolls inside its own card; formula-comparison rows use a full-width vertical layout; no page-level horizontal overflow from 320 px upward.

## Page-by-page manuscript review

| Page | Reader question carried through the page | Editorial intervention |
|---|---|---|
| 00 · RL panorama | Why does one decision problem keep demanding new machinery? | Built one delivery-robot narrative with nine turns; concepts enter only when the prior solution breaks. |
| 01 · Before RL | Does a score make this RL? | Replaced taxonomy dump with three delivery variants and a complexity gate. |
| 02 · Interaction loop | What belongs on each side of the boundary? | Used one cleaning-robot clock sequence; separated observation from state. |
| 03 · Return and horizon | Why can a locally good move be globally bad? | Let a tempting shortcut expose return, discount, termination, and truncation. |
| 04 · Probability | How can 4.2 matter if it never occurs? | Used a concrete lottery before introducing expectation and risk limits. |
| 05 · Bandits | When is exploration only about the next choice? | Began with menu experiments, then broke the reset assumption to motivate state. |
| 06 · MDP state | Why can the same 80°C require different actions? | Turned Markovity into a falsifiable rising-versus-falling temperature test. |
| 07 · Bellman value | How can one number hold many futures? | Used a stochastic door and preserved policy conditioning throughout. |
| 08 · Dynamic programming | Why sample if the model is known? | Made reward propagation visible across synchronous sweeps. |
| 09 · Monte Carlo | What can a finished episode teach without a model? | Framed first/every-visit estimates as different uses of one completed story. |
| 10 · TD and traces | Can learning begin before the ending? | Positioned n-step and lambda as a visible evidence/estimate boundary. |
| 11 · Tabular control | Whose next action does the target evaluate? | Rebuilt the four-method comparison around one transition and four futures. |
| 12 · Off-policy | Can old behavior answer for a new policy? | Put overlap before arithmetic and made extreme weights a warning, not trivia. |
| 13 · Linear approximation | Which states should share an update? | Used warehouse features to expose both generalization and representation error. |
| 14 · Neural approximation | Why does ordinary regression intuition fail? | Followed the two feedback loops: moving targets and policy-induced data. |
| 15 · DQN | What exactly do replay and the target network stabilize? | Traced a transition through storage, sampling, target construction, and masking. |
| 16 · DQN family | Which defect does each extension repair? | Replaced feature-list prose with fault-to-tool reasoning and an ablation boundary. |
| 17 · REINFORCE | Why can equal returns imply opposite updates? | Used two state baselines to make advantage direction tangible. |
| 18 · Actor–Critic | How can the policy learn before episode end? | Made critic error propagation and GAE's bias/variance role explicit. |
| 19 · TRPO/PPO | When does reused data become stale? | Centered the chapter on probability ratios, sign-aware clipping, and measured KL. |
| 20 · Continuous control | How do we maximize over infinitely many actions? | Let the actor replace enumeration, then exposed critic exploitation and scaling. |
| 21 · Distributed RL | Why is more throughput not automatically more learning? | Followed sample age from actor through queue to learner. |
| 22 · POMDP memory | What history changes the action now? | Used identical distance readings with opposite velocity histories. |
| 23 · Deep exploration | Why is random television attractive but useless? | Distinguished novelty, controllability, learnability, and task value. |
| 24 · Long-horizon credit | Who deserves credit for a late success? | Separated propagation, temporal abstraction, redistribution, and hindsight. |
| 25 · MCTS/AlphaZero | Why search when a policy network already exists? | Traced select–expand–evaluate–backup and the search-to-network improvement loop. |
| 26 · Dyna/MPC | How far should an imperfect model be trusted? | Made rollout horizon a bias budget and replanning a feedback mechanism. |
| 27 · Latent world models | Must a useful model reconstruct every pixel? | Contrasted irrelevant wallpaper with a hidden door lock. |
| 28 · BC/DAgger | Why does 99% imitation accuracy fail in closed loop? | Made learner-state coverage, not supervised accuracy, the central conflict. |
| 29 · IRL/GAIL | Can behavior reveal a unique goal? | Used equivalent route explanations to establish non-identifiability first. |
| 30 · Offline RL | Why does argmax seek unsupported actions? | Framed conservative methods as different definitions of evidence radius. |
| 31 · Decision Transformer | Does asking for a higher return create a better policy? | Separated conditioning from capability and enforced causal sequence order. |
| 32 · OPE | What can logs prove before deployment? | Organized the chapter as identification, estimation, diagnostics, uncertainty. |
| 33 · Hierarchical RL | When may many steps become one action? | Defined an option through its lifecycle and its semi-MDP backup. |
| 34 · Multi-agent RL | What changes when teammates learn too? | Exposed non-stationarity, joint credit, and CTDE information boundaries. |
| 35 · Transfer/meta | What does “new task” really mean? | Required an explicit adaptation budget before naming a generalization result. |
| 36 · Reward design | When does a metric stop representing the goal? | Started with premature ticket closure and moved to potential-based shaping. |
| 37 · Safe/robust/risk | Which failures cannot be averaged away? | Separated constraints, shields, model sets, and tail risk. |
| 38 · Evaluation | Why is the best seed not evidence? | Replaced leaderboard language with distributions, budgets, ablations, and behavior. |
| 39 · RL systems | How can a wrapper change the algorithm? | Used termination/truncation and checkpoint state as executable semantic tests. |
| 40 · LLM as RL | Where are state, action, and return in a response? | Mapped the token timeline before contrasting SFT and sequence feedback. |
| 41 · RLHF/PPO | Where does error enter the three-stage pipeline? | Followed SFT, preference labels, reward model, PPO, and external evaluation. |
| 42 · Direct preference | What did DPO simplify, and what did it not solve? | Used a probability-decrease counterexample to explain relative preference. |
| 43 · RLAIF/judges | Is a consistent model judge an objective judge? | Made position bias and calibration the main plot, not a footnote. |
| 44 · RLVR/GRPO | What if the whole comparison group is wrong? | Kept absolute pass rate beside group-relative advantage. |
| 45 · Test-time compute | When does more sampling amplify the evaluator's error? | Treated proposal diversity and selector calibration as joint requirements. |
| 46 · Method selection | Which constraints eliminate methods before ranking them? | Ended with a falsifiable selection route and explicit unknowns, not a winner table. |

## Automated gates

- Exactly 46 Chinese manuscripts; their slug set must equal the English curriculum.
- No legacy generator phrase may appear anywhere in the Chinese corpus.
- No teaching paragraph may be duplicated across Chinese chapters.
- Equation LaTeX, diagram LaTeX, worked calculations, and sources must match English exactly.
- KaTeX renders every formula at build time with `throwOnError: true`.

## Evidence still required at release time

The final release record must add: full test output, static build count, browser widths checked, public GitHub Pages workflow result, and a fresh public-site read-back. Until those checks run, this file records manuscript review—not publication.

## Second editorial pass: tutorial craft and plain-language review

### Skill selection and limits

- `writing-for-humans` was installed and used for reader contract, mental-model progression, narrative turns, and evidence-bearing examples. Its bundled blanket bans on adverbs and passive voice were not applied mechanically because technical prose sometimes needs them.
- `unslop` was installed and used with its expert/minimal-repair contract. Formulae, numbers, algorithm names, and domain-valid terms such as “robust” were protected. Its story preset was rejected because invented scenes or quotations would weaken a technical tutorial.
- `shuorenhua` supplied the public-writing scene, protected-span rules, two-pass reread, and checks for narrator scaffolding, slogan stacks, binary overstatement, and monotonous rhythm.
- `beginner-brain-audit` supplied the cumulative reader model and the prerequisite/analogy checks recorded in `brain.md` and the page-by-page table above.
- Interactive fiction-oriented skills and Diataxis procedural-tutorial skills were reviewed but not used: they either require repeated author choices or deliberately avoid the explanatory essay the reader requested.

### Findings and dispositions

| Finding | Severity | Disposition |
|---|---:|---|
| Chapter 00 reached only 44 of the 46 deep-reading routes. | Required | Added natural narrative handoffs to `before-rl` and `probability-expectation` in both languages; added an exact curriculum-set regression test. |
| One TRPO/PPO deck used a stock “not only … but also” frame without needing it. | Minor | Recast as a direct two-factor statement without changing the claim. |
| English Chapter 00 used several long-dash pivots and narrator labels. | Minor | Rewrote the affected sentences and headings as direct causal prose. |
| Scanner flagged “robust” throughout the corpus. | Protected technical term | Kept it where it names robust RL or robust estimation; no lexical substitution. |
| Scanner flagged a domain-valid “not only … but also” sentence explaining that an action changes both reward and the next decision. | Protected explanatory contrast | Kept it because both halves add necessary information; the regression guard does not ban all grammatical contrasts. |
| Chinese em dashes appeared in `智能体—环境` and `状态—动作`. | Protected technical compound | Kept them; the English stylistic dash check is language-specific. |
| The delivery robot returns throughout Chapter 00 and the ending recalls the opening. | Intentional narrative architecture | Kept it as the article's organizing image, not a generic redemption arc or recap loop. |

### Round-two editorial verdict

No Critical or Required editorial finding remains open. The article still introduces concepts by making the previous solution fail, while the 46 deep chapters retain their repeatable evidence architecture: situation, worked example, mechanism, boundary, and next bridge. Repeatable architecture is intentional; paragraph text remains independently authored. Formula strings, worked calculations, symbol case, primes, subscripts, sums, maxima, terminal masks, and source lists were not rewritten during this prose pass.

Release evidence remains pending until the full automated suite, static build, responsive browser audit, GitHub Pages workflow, and fresh public read-back all pass.
