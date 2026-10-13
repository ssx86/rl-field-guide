# RL Field Guide: independent web tutorial prototype

Status: prototype for review. No production frontend code has been generated yet.

## 1. Design read

Reading this as: an interactive English learning atlas for a learner who understands best by predicting, manipulating, and inspecting evidence, with a modern scientific-instrument visual language based on the existing `qlearning/design.md`.

Design dials:

- DESIGN_VARIANCE: 4. Stable grid, with the active experiment holding the strongest visual weight.
- MOTION_INTENSITY: 5. Motion only explains actions, value propagation, and state changes.
- VISUAL_DENSITY: 7. Rich enough for a complete learning map, but each lesson reveals one causal chain at a time.

## 2. Product boundary

This will be a separate single-page web application, not a route added to the current lab.

- Proposed folder: `D:\workspace\reinforcement-learning\rl-guide`
- Proposed development port: `5180`
- Stack: Vite, React, TypeScript, Tailwind CSS, customized shadcn/ui, Phosphor Icons, Recharts
- Formula rendering: KaTeX as a rendering-only addition
- Language: every learner-facing string is English
- Existing `qlearning` project: read-only source of visual language and reusable RL examples
- Content claim: a coherent map of core modern reinforcement learning, not an encyclopedia of every paper

## 3. The learner model

The course should follow the learner's demonstrated habits:

1. Start from a concrete doubt, not a definition.
2. Ask for a prediction before showing the answer.
3. Let one action change one visible piece of evidence.
4. Separate what was observed from what was inferred.
5. Compare two methods on the same problem.
6. Introduce the formula only after its quantities have appeared in the experiment.
7. Keep the algorithm inspectable instead of hiding it behind animation.
8. End with a transfer challenge where the learner changes the environment or assumption.

The repeated lesson loop is:

```text
See a problem -> Make a prediction -> Run one step -> Inspect the evidence
-> Name the idea -> Read the formula -> Break an assumption -> Transfer the idea
```

No lesson starts with a long theoretical article.

## 4. Information architecture

### Global sections

1. Start Here
2. Decisions Under Uncertainty
3. When the Model Is Known
4. Learning From Complete Returns
5. Learning Before the Episode Ends
6. From Tables to Neural Networks
7. Learning Policies Directly
8. Continuous Control
9. Learning and Using a Model
10. Modern Practice and Boundaries
11. Challenge Lab
12. Formula and Concept Atlas

### Knowledge coverage

| Section | Core knowledge | Primary example |
| --- | --- | --- |
| Start Here | agent, environment, observation, state, action, reward, return, episode | a two-room delivery task |
| Decisions Under Uncertainty | bandits, exploration, exploitation, regret, epsilon-greedy, UCB | choosing an uncertain treatment arm |
| When the Model Is Known | MDP, transition model, Bellman expectation, Bellman optimality, policy evaluation, value iteration, policy iteration | deterministic and stochastic gridworlds |
| Learning From Complete Returns | Monte Carlo prediction and control, importance sampling | blackjack and delayed rewards |
| Learning Before the Episode Ends | TD(0), n-step returns, eligibility traces, SARSA, Expected SARSA, Q-learning, Double Q-learning | cliff walking with safe and risky paths |
| From Tables to Neural Networks | function approximation, feature generalization, DQN, replay, target networks, Double DQN, dueling networks, prioritized replay | visual navigation and discrete driving |
| Learning Policies Directly | policy gradient theorem, REINFORCE, baseline, advantage, actor-critic, GAE, PPO | cart-pole and adaptive traffic control |
| Continuous Control | deterministic policies, DDPG, TD3, entropy, SAC | steering and throttle in continuous driving |
| Learning and Using a Model | Dyna, planning updates, MPC, MCTS, learned dynamics, world models | maze changes and short-horizon control |
| Modern Practice and Boundaries | offline RL, imitation learning, inverse RL, hierarchical RL, multi-agent RL, POMDPs, safety, reward hacking, evaluation, reproducibility, RLHF overview | logged driving data, warehouse teams, preference tuning |
| Challenge Lab | method selection and failure diagnosis | six mixed scenarios with incomplete information |
| Formula and Concept Atlas | connected formulas, assumptions, failure modes, algorithm family tree | side-by-side symbolic and numeric views |

## 5. Screen prototype

### A. Home: the learning map

```text
+--------------------------------------------------------------------------------+
| RL FIELD GUIDE       Learn map      Resume: TD Learning      Theme      Search  |
+----------------------+---------------------------------------------------------+
|                      |                                                     18% |
|  Your route          |  Learn reinforcement learning by making it change.     |
|                      |  Predict first. Run the system. Explain the evidence.    |
|  Start Here          |                                                         |
|  Model Known         |  [ Continue the current experiment ]                    |
|  Returns             |                                                         |
|  TD Learning         |  +----------------------+  +-------------------------+  |
|  Deep Value          |  | Interactive map      |  | Your evidence notebook  |  |
|  Policy Learning     |  | Known model?         |  | 4 predictions checked   |  |
|  Continuous Control  |  | Yes -> plan          |  | 2 misconceptions fixed  |  |
|  Model-Based RL      |  | No  -> learn          |  | 1 transfer challenge    |  |
|  Modern Practice     |  +----------------------+  +-------------------------+  |
|                      |                                                         |
|  Challenge Lab       |  Recommended next: Why Q-learning is not always needed  |
+----------------------+---------------------------------------------------------+
```

The opening decision is intentionally not “What is RL?” It is “What is unknown, and therefore what must be learned?” This makes planning, supervised estimation, and model-free learning distinguishable from the beginning.

### B. Lesson: evidence workbench

```text
+--------------------------------------------------------------------------------+
| RL FIELD GUIDE  /  When the Model Is Known  /  Reward propagation      3 of 8 |
+----------------------+----------------------------------------+-----------------+
| Lesson route         | Challenge                              | Evidence        |
|                      |                                        |                 |
| [done] Known model   | A reward appears at the goal.          | Transition      |
| [now ] One backup    | Which states change after one          | s = 14          |
| [next] Full sweep    | synchronous Bellman sweep?             | a = right       |
| [lock] Policy        |                                        | r = -1          |
|                      | [ choose your prediction ]             | s' = 15         |
| Key question         |                                        |                 |
| “Can I calculate     | +------------------------------------+ | Value change    |
|  instead of train?”  | | interactive grid and value layer   | | old V = 0       |
|                      | | reward pulse moves only when valid  | | target = -1     |
|                      | +------------------------------------+ | new V = -1      |
|                      |                                        |                 |
|                      | [ Run one sweep ] [ Change update mode ]| Why it changed  |
+----------------------+----------------------------------------+-----------------+
| What changed?  Only states backed up from already-valued successors changed.   |
| [ Numbers ] [ Symbols ] [ Plain English ]   Bellman equation appears on demand |
+--------------------------------------------------------------------------------+
```

Desktop grid:

- Left route: 240px
- Center experiment: flexible, minimum 620px
- Right evidence inspector: 320px
- Bottom explanation lens: full width of center and right columns

Below 768px:

1. challenge prompt
2. interactive visual
3. controls
4. evidence inspector
5. explanation lens
6. lesson route as a drawer

### C. Concept atlas

The atlas is a connected map, not a list of cards.

```text
                    Does the full model exist?
                         /               \
                      yes                 no
                      /                    \
          Dynamic Programming        Can episodes finish?
           /        |       \          /              \
    Evaluation  Iteration  Search    yes                no
                                      |                  |
                               Monte Carlo          TD Learning
                                                        |
                                         Is a table still practical?
                                                /              \
                                             yes                no
                                           Q/SARSA       Value approximation
                                                                  |
                                                      Discrete or continuous?
```

Selecting a node changes three synchronized areas:

- What problem this method solves
- What information it assumes
- What commonly breaks

## 6. Interaction contract for every lesson

Every lesson contains these states:

1. **Cold start**: a concrete situation and one question.
2. **Prediction locked**: the learner commits to an answer before execution.
3. **One-step evidence**: only the changed state, action, value, or gradient is highlighted.
4. **Explanation reveal**: numeric substitution appears before symbolic notation.
5. **Counterexample**: one assumption changes and the previous method fails or becomes inefficient.
6. **Transfer**: the learner chooses a method for a new problem.
7. **Reflection**: one sentence must be completed in plain English.

Controls remain consistent:

- Predict
- Run one step
- Run one episode or sweep
- Pause
- Reset experiment
- Compare methods
- Show numbers
- Show symbols
- Explain in plain English

## 7. Example lesson scripts

### Example 1: Planning is not training

Prompt: “The map, rewards, and transitions are fully known. Do we need Q-learning?”

Experiment:

- Switch between backward calculation, synchronous value iteration, and sampled Q-learning.
- Use the same deterministic grid and initial values.
- Count backups, sampled transitions, and sweeps.

Evidence:

- Backward calculation solves an acyclic deterministic grid in dependency order.
- Synchronous value iteration needs repeated sweeps because each sweep reads the previous values.
- Q-learning eventually approaches the answer but wastes information that was already available.

Formula reveal:

```text
Q*(s,a) = sum over s' of P(s'|s,a) [R(s,a,s') + gamma max over a' Q*(s',a')]
```

### Example 2: On-policy and off-policy behavior

Prompt: “Two agents use the same exploration rate near a cliff. Why does one learn a safer path?”

Experiment:

- Run SARSA and Q-learning with identical seeds.
- Reveal the actual next action used by SARSA.
- Reveal the greedy next action used by Q-learning's target.

Evidence:

- SARSA evaluates the behavior it actually follows.
- Q-learning learns toward a greedy target while behavior can still explore.

### Example 3: Why replay changes deep learning

Prompt: “Why not train a neural network on each transition immediately?”

Experiment:

- Compare sequential correlated samples with shuffled replay samples.
- Plot loss, target drift, and state coverage.
- Freeze and unfreeze the target network.

Evidence:

- Replay changes the sample distribution and reuses experience.
- A target network slows the movement of the regression target.

### Example 4: Why TD3 uses two critics

Prompt: “If one critic can estimate value, why train two?”

Experiment:

- Add controllable positive noise to critic estimates.
- Compare max-like optimistic targets with the minimum of two target critics.
- Delay actor updates and watch action stability.

Evidence:

- Taking the smaller target estimate reduces optimistic value error.
- Delayed actor updates let the critics improve before the policy follows them.

### Example 5: Reward hacking

Prompt: “The score is rising. Is the behavior improving?”

Experiment:

- A warehouse agent receives reward for scanning packages and discovers repeated rescanning.
- The learner inspects event counts, true task completion, and the reward decomposition.
- The reward is revised and evaluated on a held-out scenario.

Evidence:

- High return is only evidence of satisfying the specified reward.
- It is not automatic evidence of satisfying the intended goal.

## 8. Formula presentation rules

Every important formula has four synchronized views:

1. **Story**: what question the formula answers.
2. **Numbers**: the values from the current experiment substituted into it.
3. **Symbols**: the correct mathematical expression rendered by KaTeX.
4. **Assumptions**: when the expression is valid and what changes at terminal states.

Example for one Q-learning update:

```text
Observed numbers
old Q = 2.0, reward = -1.0, gamma = 0.9, next max Q = 4.0, alpha = 0.5

Target
-1.0 + 0.9 * 4.0 = 2.6

TD error
2.6 - 2.0 = 0.6

Updated value
2.0 + 0.5 * 0.6 = 2.3
```

Formula correctness gates:

- terminal transitions never bootstrap
- probability distributions sum to one within numerical tolerance
- displayed numeric substitutions are generated from the same transition as the visual evidence
- algorithms state whether they are on-policy or off-policy
- known-model expectations include transition probabilities
- continuous-control action bounds are displayed and enforced
- equations receive unit tests for numeric examples

## 9. Visual system

Inherited from `qlearning/design.md`:

- Page background: `#f5f6f4`
- Panel background: `#ffffff`
- Primary text: `#17201c`
- Secondary text: `#66706b`
- Border: `#dfe4e1`
- Single decorative accent: amber `#d97706`
- Success and danger colors are semantic only
- Panels: 12px radius
- Buttons and inputs: 8px radius
- UI type: Arial, Noto Sans, system sans-serif
- Numeric and formula type: Cascadia Code, SFMono-Regular, Consolas, monospace
- Icons: Phosphor, regular weight

Visual asset policy:

- Prefer real interactive diagrams generated from lesson data.
- Use purposeful illustrations for abstract topics such as partial observability, policy distributions, and model rollouts.
- Avoid decorative stock photography, fake dashboards, gradient blobs, and generic three-card sections.
- Value propagation uses amber intensity and motion direction, never a rainbow heatmap.
- Each animation must explain causality, feedback, or a state transition.

## 10. Content density and writing style

Learner-facing copy is concise, direct, and entirely English.

Rules:

- one question per screen
- no paragraph longer than 70 words in the experiment flow
- one primary action per state
- definitions appear after the learner has seen the thing being defined
- jargon is paired with an observable consequence
- each chapter contains at least two worked examples and one counterexample
- chapter completion requires explanation, not passive scrolling

Sample page copy:

```text
Question
What information do you already have?

Choice A
The full transition and reward model.

Choice B
Only sampled experience.

Explanation
If the full model is available, you can plan with it. Sampling is still possible,
but it throws away information you already own.
```

## 11. Progress and retention

Progress is evidence-based, not scroll-based.

A lesson is complete after the learner has:

- made one prediction
- run the experiment
- inspected the changed evidence
- answered one transfer question
- written or selected one plain-English explanation

The home screen records:

- concepts demonstrated
- misconceptions corrected
- formulas applied with numbers
- transfer challenges passed
- topics due for retrieval practice

No gamified points, streak pressure, or decorative badges are required.

## 12. Implementation stages after approval

### Stage 1: shell and one vertical slice

- create the independent `rl-guide` app on port 5180
- implement global navigation, learning map, lesson workbench, responsive layout, and theme tokens
- implement the full “Planning is not training” lesson
- verify formula rendering, keyboard navigation, narrow layout, and reduced motion

### Stage 2: tabular learning core

- add bandits, Monte Carlo, TD, SARSA, Expected SARSA, Q-learning, Double Q-learning
- add comparison mode and evidence notebook
- add deterministic numeric tests for every displayed update

### Stage 3: deep and continuous RL

- add DQN, policy gradients, actor-critic, PPO, DDPG, TD3, and SAC
- reuse the existing navigation and driving examples where technically appropriate
- keep training demonstrations bounded and reproducible in the browser

### Stage 4: model-based and modern practice

- add Dyna, MCTS, MPC, world-model concepts, offline RL, imitation, multi-agent, hierarchical RL, safety, evaluation, and RLHF overview
- add Challenge Lab scenarios and the connected Formula Atlas

### Stage 5: regression and acceptance

- content and formula review
- automated unit and component tests
- production build and lint
- browser verification at desktop, tablet, and 320px mobile
- keyboard-only and reduced-motion checks
- lesson-state persistence and reset checks
- user acceptance before calling the tutorial complete

## 13. Approval decisions

The prototype proposes these defaults:

- Title: **RL Field Guide**
- First lesson: **Planning Is Not Training**
- Main interaction: **predict, run, inspect, explain**
- Visual direction: **modern scientific instrument**
- Scope: **core modern RL from bandits and dynamic programming through deep, continuous, model-based, offline, multi-agent, safety, and RLHF overview**
- Build location: sibling app `rl-guide`
- Port: `5180`

If approved, implementation should begin with Stage 1 only. The remaining stages should follow after the first vertical slice is reviewed in the browser.
