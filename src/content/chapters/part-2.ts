import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;
const SPINNING_UP = { label: "OpenAI Spinning Up — RL introduction and notation", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html", kind: "official documentation" } as const;

export const PART_TWO_ARTICLES = [
  {
    slug: "mdp-state-design",
    title: "Build an MDP and test whether the chosen state is Markov",
    deck: "A Markov decision process is not a decorative tuple. It is a claim that the chosen state contains enough information to predict the next consequence of every action.",
    openingQuestion: "If two histories look identical now but lead to different futures, can the current observation honestly be called a state?",
    bridge: "Bandits reset after each choice. The moment an action changes the next decision, the learner needs a model of persistent state. This chapter adds that persistence carefully: it defines an MDP, shows why occupancy depends on the policy, and treats state design as a falsifiable modeling decision rather than a variable-naming convention.",
    situation: {
      title: "A maintenance screen can hide the history that matters",
      paragraphs: [
        "A factory controller sees a machine temperature of 80°C and may cool, continue, or stop. If the machine reached 80°C after ten minutes of rising load, failure risk may be high. If it is cooling down from 95°C, the same displayed temperature can imply a safer future. A screen reading alone is therefore an observation, not necessarily a Markov state.",
        "An MDP describes a set of states, actions available in each state, a distribution over next states and rewards, and an initial-state distribution. A policy selects actions. Together, the policy and transition distribution induce a distribution over trajectories and over how often each state-action pair is visited. That occupancy distribution determines which parts of the system produce training evidence.",
        "State construction can restore predictive sufficiency by adding trend, recent actions, elapsed time, or a filtered belief about hidden condition. Adding every historical measurement is not automatically better: it increases dimension, may encode identifiers or leakage, and can make learning harder. The useful state is compact enough to learn from while retaining the information required for consequences and constraints.",
      ],
    },
    diagram: {
      title: "An MDP is a closed predictive interface",
      caption: "Given the current state and action, earlier history should not change the distribution of the next state and reward. When it does, the interface is partially observable.",
      items: [
        { label: "Initial condition", value: "S₀ ~ ρ₀", note: "The start distribution affects which problems are actually evaluated." },
        { label: "Policy choice", value: "Aₜ ~ π(·|Sₜ)", note: "The policy controls behavior and therefore future data coverage." },
        { label: "Environment response", value: "Sₜ₊₁,Rₜ₊₁ ~ p(·|Sₜ,Aₜ)", note: "The kernel lists every possible consequence and probability." },
        { label: "Occupancy", value: "dπ(s,a)", note: "The policy and dynamics jointly determine which state-action pairs are seen." },
      ],
    },
    workedExample: {
      title: "Test two proposed states for the same machine",
      setup: "The controller observes temperature 80. Historical logs show a 30% failure rate after rising into 80 and a 5% rate after falling into 80. Compare a state that stores only temperature with one that also stores the trend.",
      prediction: "Before calculating, decide whether one transition distribution can truthfully represent both histories when only temperature is stored.",
      steps: [
        { label: "State proposal A", calculation: "S = temperature = 80", explanation: "Both histories collapse into the same state even though their failure probabilities differ." },
        { label: "Conditional check", calculation: "P(fail|80,rising)=0.30 ≠ P(fail|80,falling)=0.05", explanation: "Earlier trend changes the next-outcome distribution after conditioning on the proposed state." },
        { label: "State proposal B", calculation: "S = (temperature, trend)", explanation: "The two predictive situations are now distinct, allowing the transition model or value function to represent different risk." },
        { label: "Policy consequence", calculation: "π(stop|80,rising) may exceed π(stop|80,falling)", explanation: "A state distinction matters only when it can change a relevant prediction or decision." },
      ],
      result: "Temperature alone fails this Markov test. Adding trend is justified by a specific predictive difference, not by a general preference for larger feature vectors.",
    },
    mechanism: {
      introduction: "The MDP formalism separates the controllable decision from the stochastic response and makes assumptions visible enough to challenge.",
      sections: [
        { title: "The Markov property is conditional sufficiency", paragraphs: ["The Markov property does not say that the future is independent of the past. It says the current state summarizes every aspect of the past needed to predict the next state and reward under each action. Future outcomes can still be stochastic and can still depend strongly on the current state."] },
        { title: "Rewards and transitions can share uncertainty", paragraphs: ["Some texts model a joint distribution p(s′,r|s,a); others separate p(s′|s,a) and an expected reward function. Both are valid when used consistently. The joint form makes clear that reward can depend on the realized transition, not only on the starting state and action."] },
        { title: "Occupancy exposes data coverage", paragraphs: ["A policy that never enters a dangerous machine regime supplies no direct data about recovery actions there. The occupancy measure connects policy behavior to the dataset. It later becomes central in off-policy learning, imitation, distribution shift, and evaluation."] },
        { title: "Finite horizons may require time in the state", paragraphs: ["If exactly ten decisions remain, an action can have different value than when one decision remains. When remaining time changes consequences or optimal behavior, it belongs in the state. Hiding it breaks stationarity even if every sensor reading is otherwise identical."] },
      ],
    },
    equations: [
      { latex: "p(s',r\\mid s,a)=\\Pr\\{S_{t+1}=s',R_{t+1}=r\\mid S_t=s,A_t=a\\}", read: "The transition-and-reward kernel gives the probability of each next state and reward after a particular current state and action.", meaning: "The Markov claim is that this conditional distribution does not need the earlier trajectory. If history changes it after s and a are fixed, the proposed state is missing information." },
      { latex: "d^{\\pi}(s,a) \\propto \\sum_{t\\ge 0}\\gamma^t\\Pr_{\\pi}(S_t=s,A_t=a)", read: "A discounted occupancy measure summarizes how often policy pi visits each state-action pair, weighting later visits by powers of gamma.", meaning: "Occupancy is not an environment property alone. Changing the policy changes the evidence distribution even when the physical dynamics stay fixed." },
    ],
    boundary: {
      title: "No dataset can prove the Markov property everywhere",
      paragraphs: ["Historical checks can reveal violations but cannot establish sufficiency for every unvisited condition. Domain knowledge, interventions, stress tests, and deployment monitoring remain necessary, especially when hidden variables change over time." ,"A richer state can also create leakage. Including a post-action measurement, future label, or simulator-only variable may make offline scores excellent while producing a policy that cannot run in real time. State features must be available at the exact decision moment."],
    },
    nextBridge: "An MDP expands into a tree of possible futures. The next chapter compresses that tree into value functions and derives Bellman equations as one-step bookkeeping identities, not as formulas to memorize in isolation.",
    sources: [SB, SPINNING_UP],
  },
  {
    slug: "value-bellman",
    title: "Use value functions and Bellman equations as recursive bookkeeping",
    deck: "A value function is an expected future return under stated behavior. A Bellman equation works because that future can be split into the next reward and the value of what remains.",
    openingQuestion: "How can one number summarize many future trajectories without pretending those trajectories are identical?",
    bridge: "The MDP names states, actions, and uncertain transitions, but a decision still appears to require comparing enormous future trees. Value functions compress those trees into conditional expectations. Bellman equations then reveal a recursive consistency: today's value equals one step of consequence plus the value assigned to tomorrow.",
    situation: {
      title: "A corridor value is a forecast under a policy",
      paragraphs: [
        "A robot at corridor A follows a policy that usually moves right. Some runs reach the goal quickly; others slip and take longer. The state value vπ(A) is not the reward stored inside corridor A. It is the expected return from A when the robot continues following policy π.",
        "The action value qπ(A,right) answers a more specific counterfactual: take right now, then follow π. It can differ from vπ(A) because the state value averages all actions the policy may choose. An optimal value places a maximum over possible behavior, whereas a policy value evaluates one stated policy. Mixing these meanings creates invalid targets.",
        "The Bellman expectation equation expands the first transition, averages its reward and next-state value, and then stops because the next-state value already summarizes the remaining future. The Bellman optimality equation replaces the policy's action average with a maximum. That small syntactic change turns evaluation into a control claim.",
      ],
    },
    diagram: {
      title: "Split one future at the first transition",
      caption: "The recursive step does not discard the long horizon. It delegates the rest of the horizon to the next state's value under the same policy or optimality assumption.",
      items: [
        { label: "Start", value: "Sₜ=s", note: "Fix the state whose future is being summarized." },
        { label: "Choose", value: "Aₜ~π(·|s)", note: "Policy value averages the actions this policy actually takes." },
        { label: "One consequence", value: "Rₜ₊₁ and Sₜ₊₁", note: "Average every possible transition with its probability." },
        { label: "Remainder", value: "γvπ(Sₜ₊₁)", note: "The next value summarizes all later rewards recursively." },
      ],
    },
    workedExample: {
      title: "Back up value through a stochastic door",
      setup: "From state A, action right reaches a goal worth 5 with probability 0.8 and a waiting state worth 1 with probability 0.2. There is no immediate reward and gamma is 0.9.",
      prediction: "Predict whether q(A,right) should equal the most likely branch, the unweighted average, or the probability-weighted average.",
      steps: [
        { label: "Successful branch", calculation: "0.8×(0+0.9×5)=3.6", explanation: "Both probability and discount weight this branch's continuation value." },
        { label: "Waiting branch", calculation: "0.2×(0+0.9×1)=0.18", explanation: "The less likely branch still contributes to expected action value." },
        { label: "Action value", calculation: "qπ(A,right)=3.6+0.18=3.78", explanation: "Expectation combines all modeled branches rather than selecting only the modal outcome." },
        { label: "State value", calculation: "vπ(A)=Σa π(a|A)qπ(A,a)", explanation: "To obtain state value, repeat the calculation for each action and weight by policy probabilities." },
      ],
      result: "The backup transforms a branch of future possibilities into one expected value while preserving the policy and transition assumptions that produced it.",
    },
    mechanism: {
      introduction: "Four related value objects answer different questions. Keeping their conditioning visible prevents most notation confusion.",
      sections: [
        { title: "vπ evaluates a state under a policy", paragraphs: ["The policy is part of the definition even when it is not written on every line. Changing π changes which actions and future states are likely, so it changes vπ. A value number without a named policy, dataset, or optimality claim is incomplete evidence."] },
        { title: "qπ evaluates a chosen first action", paragraphs: ["Action value conditions on Aₜ=a before returning to the policy. It supports action comparison without an explicit transition model once q is learned. Advantage Aπ(s,a)=qπ(s,a)−vπ(s) measures how an action compares with the policy's usual behavior at that state."] },
        { title: "Expectation and optimality equations are not interchangeable", paragraphs: ["The expectation equation follows a policy distribution. The optimality equation assumes future actions maximize value. Algorithms such as SARSA and Q-learning differ precisely in which continuation they place in the target."] },
        { title: "Bellman error is a diagnostic, not the whole objective", paragraphs: ["A value function that satisfies the correct Bellman equation for a finite discounted MDP is meaningful. Under approximation and sampled data, small training loss on visited transitions may coexist with large errors elsewhere. Coverage and generalization remain separate questions."] },
      ],
    },
    equations: [
      { latex: "v_{\\pi}(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma v_{\\pi}(s')\\right]", read: "State value under policy pi averages, over policy actions and environment outcomes, the next reward plus discounted value of the next state.", meaning: "Every sum corresponds to a visible source of uncertainty: the policy chooses an action and the environment chooses an outcome. The recursive term retains the complete remaining horizon." },
      { latex: "q_*(s,a)=\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma\\max_{a'}q_*(s',a')\\right]", read: "Optimal action value equals the expected next reward plus discounted value of taking the best action from the next state onward.", meaning: "The maximum expresses a control assumption. Replacing a policy expectation with this maximum changes which behavior the equation evaluates and introduces maximization bias when estimates are noisy." },
    ],
    boundary: {
      title: "Value is conditional, not an intrinsic property of a state", paragraphs: ["The same physical state can have different values under different policies, reward definitions, horizons, discounts, and start distributions. Comparing values across experiments is meaningless unless those conditions match." ,"Expected value can also hide multimodal or dangerous outcomes. Distributional RL predicts more of the return distribution; safe and risk-sensitive RL constrain or reweight outcomes. Standard value functions are a powerful summary, not a complete risk report."],
    },
    nextBridge: "Bellman equations state consistency. When the full transition and reward model is known, dynamic programming turns that consistency into algorithms: repeated evaluation, policy improvement, and value backups until the numbers stop changing.",
    sources: [SB, SPINNING_UP],
  },
  {
    slug: "dynamic-programming",
    title: "Plan with policy evaluation, policy iteration, and value iteration",
    deck: "Dynamic programming uses a complete model to turn Bellman equations into sweeps of expected backups. It plans; it does not learn transition consequences by trial and error.",
    openingQuestion: "If every transition probability and reward is already known, why sample experience when the expectation can be computed directly?",
    bridge: "Bellman equations describe the values a policy should satisfy. Dynamic programming supplies procedures for finding those values from a known finite model. Seeing this exact case first creates a reference point for later sampled methods, whose updates approximate the same backups with incomplete experience.",
    situation: {
      title: "A tiny grid can be solved without exploration",
      paragraphs: [
        "Consider a four-room deterministic grid with a goal worth +1 and zero reward elsewhere. The map, legal actions, and consequences are known. Starting from arbitrary value estimates, a sweep updates every state using the model. Information about the goal moves backward one transition per synchronous sweep.",
        "Policy evaluation holds behavior fixed and computes its value. Policy improvement chooses actions that look better according to that value. Repeating the two processes gives policy iteration. Value iteration combines partial evaluation with immediate greedy improvement by applying the Bellman optimality backup directly.",
        "The order of updates matters for speed but not for the fixed point under standard finite discounted assumptions. Synchronous Jacobi-style sweeps read an old value table and write a new one. In-place Gauss–Seidel updates use new values immediately. A deterministic acyclic problem can sometimes be solved in one backward topological pass; loops and stochastic transitions generally require iteration or solving equations.",
      ],
    },
    diagram: {
      title: "Generalized policy iteration has two coupled motions",
      caption: "Evaluation moves values toward the current policy; improvement moves the policy toward greediness with respect to current values. They need not finish in isolation to make progress.",
      items: [
        { label: "Evaluate", value: "v ← Tπv", note: "Back up expected consequences under the current policy." },
        { label: "Improve", value: "π ← greedy(v)", note: "Choose actions with larger one-step lookahead values." },
        { label: "Repeat", value: "policy iteration", note: "Full evaluation followed by improvement converges in finite MDPs." },
        { label: "Interleave", value: "value iteration / GPI", note: "Partial evaluation and frequent improvement can converge together." },
      ],
    },
    workedExample: {
      title: "Move a terminal reward backward through two states",
      setup: "A deterministic chain S₀→S₁→Goal has zero transition reward until entering Goal, which gives +1. Gamma is 0.9 and all values begin at zero. Use synchronous value-iteration sweeps.",
      prediction: "After one synchronous sweep, which state can know about the goal? After two sweeps, what is V(S₀)?",
      steps: [
        { label: "Initial table", calculation: "V₀(S₀)=V₀(S₁)=0", explanation: "The terminal state's continuation value is zero; the +1 belongs to the transition entering it." },
        { label: "Sweep one", calculation: "V₁(S₁)=1+0.9×0=1; V₁(S₀)=0+0.9×0=0", explanation: "Synchronous S₀ still reads the old zero value of S₁." },
        { label: "Sweep two", calculation: "V₂(S₀)=0+0.9×1=0.9", explanation: "The goal information has now moved two transitions backward." },
        { label: "Greedy policy", calculation: "π(S)=argmaxa[r+γV(s′)]", explanation: "At each state, compare known consequences under candidate actions and select the largest backed-up value." },
      ],
      result: "The calculation is exact planning because every consequence used by the backup comes from the known model. No exploratory trajectory was required.",
    },
    mechanism: {
      introduction: "Dynamic programming is computationally expensive in large spaces, but it makes the structure of evaluation and control unusually transparent.",
      sections: [
        { title: "Iterative policy evaluation solves a fixed point", paragraphs: ["Repeated application of the Bellman expectation operator contracts value error for finite discounted MDPs. A stopping tolerance converts mathematical convergence into a practical algorithm. The residual threshold and update order should be reported because they change computation and approximate accuracy."] },
        { title: "The policy-improvement theorem connects values to better behavior", paragraphs: ["If a new policy is greedy with respect to vπ, its value is no worse than π's value under standard assumptions. Policy iteration alternates this guaranteed improvement with evaluation. Ties need stable handling to avoid meaningless policy oscillation."] },
        { title: "Value iteration merges evaluation and improvement", paragraphs: ["Each optimality backup acts as one evaluation step for a greedy target. Values may not equal any intermediate policy's exact value, yet the sequence converges to v*. A greedy policy extracted after convergence is optimal."] },
        { title: "Asynchronous planning prioritizes useful backups", paragraphs: ["Not every state must be updated in lockstep. In-place sweeps, prioritized sweeping, and search focus computation where values are changing or decisions are imminent. The model is still doing the work; scheduling only changes which exact backup happens next."] },
      ],
    },
    equations: [
      { latex: "V_{k+1}(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma V_k(s')\\right]", read: "One policy-evaluation sweep replaces each state value by the model's expected one-step return plus the previous sweep's next-state value.", meaning: "A synchronous implementation reads V k everywhere and writes V k plus one. An in-place implementation uses some freshly updated values, often speeding propagation while preserving the same fixed point." },
      { latex: "V_{k+1}(s)=\\max_a\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma V_k(s')\\right]", read: "Value iteration applies the optimality backup by selecting the action with the greatest expected reward plus discounted next value.", meaning: "The maximum performs policy improvement inside every backup. It is valid here because the complete model allows every candidate action's expectation to be computed." },
    ],
    boundary: {
      title: "Planning assumes the model is available and trustworthy", paragraphs: ["A table of estimated transitions learned from sparse data is not the same as a known model. Planning deeply through an inaccurate model can amplify error. Model-based RL later combines learned dynamics, uncertainty, and replanning to manage that risk." ,"Exact sweeps also scale poorly with huge or continuous state spaces. Function approximation, sampling, and search replace exhaustive updates, but they give up some exactness. Dynamic programming remains the conceptual baseline for what those approximations are trying to compute."],
    },
    nextBridge: "When the model is not available, expectations cannot be enumerated. Monte Carlo methods replace model backups with complete sampled returns, revealing what can be learned from experience alone and why variance becomes the price of that freedom.",
    sources: [SB, { label: "Richard Bellman — A Markovian Decision Process", url: "https://www.jstor.org/stable/24900506", kind: "paper" }],
  },
  {
    slug: "monte-carlo",
    title: "Estimate values from complete sampled episodes with Monte Carlo",
    deck: "Monte Carlo learning waits for an episode to finish, then treats the observed return as a sample of the value it wants to estimate.",
    openingQuestion: "What can an agent learn without a model if it is willing to wait until the outcome is complete?",
    bridge: "Dynamic programming computed expectations from a complete model. Monte Carlo removes that model and follows actual episodes instead. The Bellman structure remains in the background, but the update target is now a realized return rather than an enumerated expectation or a bootstrapped estimate.",
    situation: {
      title: "A card game reveals its value only at the end",
      paragraphs: ["A player reaches a hand total of 18, chooses to stick, and later wins +1 or loses −1. The environment model—the dealer's hidden card and draw probabilities—need not be supplied. Repeating games from similar states produces sampled returns whose average estimates value." ,"First-visit Monte Carlo updates a state once per episode, using the return following its first occurrence. Every-visit Monte Carlo updates after each occurrence. Both converge under suitable sampling conditions, but their finite-data behavior and dependence differ." ,"Prediction evaluates a policy that generates episodes. Control must also improve behavior while retaining exploration. Exploring starts is a theoretical device that assigns positive probability to every state-action start; epsilon-soft policies are more practical in small tasks because every action keeps a nonzero chance."],
    },
    diagram: {
      title: "A complete return replaces a model expectation", caption: "Monte Carlo does not bootstrap from its current estimate. It waits until later rewards are observed and then averages those sampled returns.",
      items: [
        { label: "Generate", value: "S₀,A₀,R₁,…,S_T", note: "Follow the policy through a complete episode." },
        { label: "Look backward", value: "Gₜ=Rₜ₊₁+γGₜ₊₁", note: "Compute each visited decision's realized return." },
        { label: "Average", value: "V(s) ← mean returns", note: "Repeated episodes approximate the expectation." },
        { label: "Improve", value: "π ← ε-soft greedy(Q)", note: "Control balances better actions with continuing coverage." },
      ],
    },
    workedExample: {
      title: "Compare two sampled returns for the same state",
      setup: "State S is first visited in two episodes. With gamma 1, the later rewards are [0, 0, 1] in episode one and [0, −1] in episode two.",
      prediction: "Predict the two returns and the sample-average estimate after both episodes.",
      steps: [
        { label: "Episode one return", calculation: "G¹(S)=0+0+1=1", explanation: "All rewards after the selected visit contribute because gamma is one." },
        { label: "Episode two return", calculation: "G²(S)=0−1=−1", explanation: "A different trajectory from the same state produces a different sample." },
        { label: "Value estimate", calculation: "V(S)=(1+(−1))/2=0", explanation: "Zero is the sample mean; neither episode itself had return zero." },
        { label: "Incremental update", calculation: "V₂=1+(1/2)(−1−1)=0", explanation: "The familiar error update reproduces the same running average without storing both returns." },
      ],
      result: "Monte Carlo value is an empirical expectation over complete outcomes. Its target is unbiased for on-policy episodic return but can vary substantially between episodes.",
    },
    mechanism: {
      introduction: "Waiting for completion avoids bootstrapping error while introducing variance, delay, and a dependence on episode boundaries.",
      sections: [
        { title: "The target contains real later rewards", paragraphs: ["Monte Carlo does not use V(Sₜ₊₁) inside its target. Errors in the current value table therefore do not directly contaminate the return. Random environment outcomes and policy actions still make that return noisy."] },
        { title: "On-policy coverage comes from the behavior itself", paragraphs: ["An epsilon-soft policy assigns every available action at least some probability, allowing action values to be estimated while the policy becomes mostly greedy. Reducing epsilon too quickly can freeze an early error; keeping it large forever imposes continuing regret."] },
        { title: "Off-policy Monte Carlo needs likelihood ratios", paragraphs: ["Episodes generated by one policy can evaluate another only when the behavior gives adequate probability to the target policy's actions. Importance sampling reweights trajectories, often with severe variance. This becomes a full chapter after TD control."] },
        { title: "Episode completion is both strength and limitation", paragraphs: ["Games and bounded simulations provide natural endings. Continuing control, long conversations, or rare terminal outcomes can make complete returns impractical. Temporal-difference learning updates earlier by borrowing a value estimate for the unseen remainder."] },
      ],
    },
    equations: [
      { latex: "G_t=\\sum_{k=0}^{T-t-1}\\gamma^kR_{t+k+1}", read: "The episodic return from time t sums every later reward until terminal time T, discounting by temporal distance.", meaning: "This target is computed from the sampled episode. It contains no estimated continuation after T, so T must represent the task ending rather than an accidental truncation unless a bootstrap correction is added." },
      { latex: "V(S_t)\\leftarrow V(S_t)+\\alpha\\left[G_t-V(S_t)\\right]", read: "Move the current value estimate toward the complete sampled return by a fraction alpha of their difference.", meaning: "With visit-count step sizes this forms a sample mean. Constant step sizes emphasize recent returns and can track non-stationarity at the cost of persistent variance." },
    ],
    boundary: {
      title: "A complete episode can still provide incomplete evidence", paragraphs: ["A return reveals what happened under the chosen trajectory, not what would have happened under unchosen actions. Control still requires exploration or justified off-policy data." ,"If episode length is capped for convenience and the target is treated as terminal, Monte Carlo silently changes the task. Very long episodes also make return variance and delayed learning severe, motivating multi-step and TD methods."],
    },
    nextBridge: "Monte Carlo waits for the whole outcome. Temporal-difference learning asks how much of the same lesson can be learned after one or several steps by combining observed rewards with a current estimate of the remaining future.",
    sources: [SB, { label: "David Silver — UCL Reinforcement Learning lecture on model-free prediction", url: "https://www.davidsilver.uk/wp-content/uploads/2020/03/MC-TD.pdf", kind: "official documentation" }],
  },
  {
    slug: "td-traces",
    title: "Move from TD(0) to n-step returns and eligibility traces",
    deck: "Temporal-difference learning updates before an episode ends. The price is bootstrapping: part of the target comes from a value estimate that may itself be wrong.",
    openingQuestion: "How much real future should an update wait for before it borrows an estimate for the rest?",
    bridge: "Monte Carlo uses a complete sampled return and can wait a long time. TD(0) uses one observed transition and a bootstrapped next-state value. Between them lies a spectrum of n-step targets and lambda returns; eligibility traces implement that spectrum online by carrying recent credit forward through updates.",
    situation: {
      title: "A delayed goal can teach earlier states before the episode ends",
      paragraphs: ["A robot takes twenty moves to reach a charging station. Monte Carlo changes the value of the first state only after all twenty moves. TD(0) changes the nineteenth state immediately when it sees the goal, then propagates that improvement backward through later visits." ,"An n-step return waits for n real rewards before bootstrapping. A larger n relies more on sampled outcomes and less on current estimates. The lambda return averages targets of many lengths, giving a continuous control over this bias-variance tradeoff." ,"Eligibility traces provide a backward view. Recently visited states receive temporary credit. Each new TD error updates all states with nonzero trace, approximately matching the forward lambda-return view under standard conditions. Accumulating and replacing traces behave differently when a feature or state repeats."],
    },
    diagram: {
      title: "Targets differ by where they stop observing and start estimating", caption: "One-step TD borrows early, Monte Carlo never borrows before termination, and n-step or lambda methods interpolate between them.",
      items: [
        { label: "TD(0)", value: "Rₜ₊₁+γV(Sₜ₊₁)", note: "Fast update, more bootstrap dependence." },
        { label: "n-step", value: "n rewards + γⁿV(Sₜ₊ₙ)", note: "Waits for a chosen amount of real future." },
        { label: "Monte Carlo", value: "complete return", note: "No bootstrap before a true terminal state." },
        { label: "TD(λ)", value: "weighted mixture", note: "Combines many target lengths or implements their backward trace equivalent." },
      ],
    },
    workedExample: {
      title: "Compute one-step and two-step targets",
      setup: "From S₀, rewards are 2 then 3. Gamma is 0.9. Current estimates are V(S₁)=5 and V(S₂)=8. The episode continues after S₂.",
      prediction: "Which target uses more observed reward, and which depends more heavily on the current value table?",
      steps: [
        { label: "One-step target", calculation: "G₀:₁=2+0.9×5=6.5", explanation: "Only the first reward is observed; the rest is summarized by V(S₁)." },
        { label: "Two-step target", calculation: "G₀:₂=2+0.9×3+0.9²×8=11.18", explanation: "Two rewards are observed before bootstrapping from S₂." },
        { label: "TD error", calculation: "δ₀=2+0.9×5−V(S₀)", explanation: "The error compares the one-step target with the current prediction at S₀." },
        { label: "Trace update", calculation: "V(s)←V(s)+αδₜeₜ(s)", explanation: "The current TD error also updates recent states according to their decayed eligibility." },
      ],
      result: "The targets can differ sharply because they combine different evidence and different bootstrap points. Lambda is a principled way to blend that spectrum, not a magic constant.",
    },
    mechanism: {
      introduction: "TD learning is the bridge between complete-return estimation and recursive dynamic programming, but its implementation depends on careful terminal handling and trace semantics.",
      sections: [
        { title: "Bootstrapping trades delay for target bias", paragraphs: ["A wrong next-state value makes the one-step target wrong, yet frequent updates can correct estimates rapidly as experience arrives. Monte Carlo avoids that particular dependency but inherits full trajectory variance. Neither target dominates in every problem."] },
        { title: "n-step returns expose a continuum", paragraphs: ["Increasing n adds actual rewards and moves the bootstrap farther away. In online systems it also delays the update and requires a buffer. For terminal transitions before n steps, the target stops without a continuation value."] },
        { title: "Lambda weights many horizons", paragraphs: ["The forward lambda return geometrically weights one-step, two-step, and longer targets. Lambda zero recovers TD(0); lambda one approaches Monte Carlo in episodic tasks. The effective behavior also depends on gamma, step size, and function approximation."] },
        { title: "Traces assign recent eligibility, not causal proof", paragraphs: ["A trace marks which past states or features are eligible to receive the current TD error. It does not establish that they caused the outcome. Replacing traces can limit repeated-feature buildup; true-online variants preserve closer equivalence under approximation."] },
      ],
    },
    equations: [
      { latex: "G_{t:t+n}=R_{t+1}+\\gamma R_{t+2}+\\cdots+\\gamma^{n-1}R_{t+n}+\\gamma^nV(S_{t+n})", read: "The n-step target observes n rewards, then bootstraps from the estimated value of the state reached after those n transitions.", meaning: "This expression makes the evidence boundary visible. Everything before the final term was observed on the trajectory; only the continuation value is estimated." },
      { latex: "e_t(s)=\\gamma\\lambda e_{t-1}(s)+\\mathbf{1}(S_t=s)", read: "An accumulating eligibility trace decays old eligibility by gamma lambda and adds one for the state visited now.", meaning: "A later TD error is distributed backward through these traces. Replacing traces cap or reset repeated-state eligibility and therefore should not be treated as identical." },
    ],
    boundary: {
      title: "Longer targets do not automatically solve long-horizon credit", paragraphs: ["Increasing n or lambda can carry outcome information farther, but it also spreads noisy return evidence and still relies on correlation along the trajectory. Sparse-reward exploration and causal credit can remain unsolved." ,"Off-policy traces require correction or specialized algorithms. Naively applying long traces to data from a different behavior policy can update toward the wrong target and become unstable with approximation."],
    },
    nextBridge: "TD targets so far evaluate a stated policy. Control changes the policy while learning. The next chapter compares SARSA, Expected SARSA, Q-learning, and Double Q-learning by asking exactly which next-action value appears in each target.",
    sources: [SB, { label: "Sutton — Learning to Predict by the Methods of Temporal Differences", url: "https://link.springer.com/article/10.1007/BF00115009", kind: "paper" }],
  },
  {
    slug: "tabular-control",
    title: "Compare SARSA, Expected SARSA, Q-learning, and Double Q-learning",
    deck: "Control algorithms can observe the same transition and still learn different values because their targets describe different future policies.",
    openingQuestion: "After an exploratory action, should the update evaluate the action actually selected, the policy's average next action, or the greedy next action?",
    bridge: "TD prediction borrowed a next-state value under a fixed policy. Control must improve behavior while collecting data, so the target needs a precise answer to whose future is being evaluated. SARSA, Expected SARSA, and Q-learning differ at that one point; Double Q-learning addresses the optimism created by noisy maximization.",
    situation: {
      title: "Exploration beside a cliff separates behavior from target",
      paragraphs: ["A walker can take a short route beside a cliff or a longer safe route. An epsilon-greedy behavior policy occasionally makes random moves. SARSA evaluates the next action actually sampled by that behavior, so cliff risk influences its learned route. Q-learning evaluates the greedy next action even while behavior explores." ,"Expected SARSA replaces the sampled next action with the expectation under the policy, reducing sampling variance while retaining a chosen policy target. Q-learning is off-policy because its greedy target can differ from the behavior that produced the transition." ,"When action estimates contain noise, taking their maximum tends to select positive errors. Standard Q-learning uses the same estimates to select and evaluate the maximum. Double Q-learning separates those roles across two tables, reducing maximization bias without claiming to remove all estimation error."],
    },
    diagram: {
      title: "One transition supports three continuation questions", caption: "The reward is shared. The algorithms diverge only in how they value the next state, and that choice defines the target policy.",
      variant: "formula-compare",
      items: [
        { label: "SARSA", value: "Q of the sampled next state–action pair", latex: "Q(S_{t+1},A_{t+1}),\\quad A_{t+1}\\sim\\pi(\\cdot\\mid S_{t+1})", note: "Evaluate the next action sampled from the behavior policy." },
        { label: "Expected SARSA", value: "Policy-weighted sum of next-state action values", latex: "\\sum_{a\\in\\mathcal{A}(S_{t+1})}\\pi(a\\mid S_{t+1})Q(S_{t+1},a)", note: "Average over every available next action under the stated target policy." },
        { label: "Q-learning", value: "Maximum next-state action value", latex: "\\max_{a\\in\\mathcal{A}(S_{t+1})}Q(S_{t+1},a)", note: "Evaluate a greedy target even when the behavior policy explores." },
        { label: "Double Q-learning", value: "Select with table A and evaluate with table B", latex: "a^*=\\arg\\max_a Q^A(S_{t+1},a),\\quad Q^B(S_{t+1},a^*)", note: "When updating Qᴬ, select with Qᴬ and evaluate with Qᴮ; the other update is symmetric." },
      ],
    },
    workedExample: {
      title: "Compute three targets from the same observed transition",
      setup: "A transition gives reward 2, gamma 0.9, and a nonterminal next state. The behavior selects an action valued 3. The two next actions have Q values 3 and 6. The epsilon-greedy target policy chooses them with probabilities 0.1 and 0.9.",
      prediction: "Order the SARSA, Expected SARSA, and Q-learning targets before calculating.",
      steps: [
        { label: "SARSA", calculation: "2+0.9×3=4.7", explanation: "The sampled exploratory next action is part of the five-element S-A-R-S-A transition." },
        { label: "Expected SARSA", calculation: "2+0.9×(0.1×3+0.9×6)=7.13", explanation: "The continuation is averaged under the stated epsilon-greedy policy." },
        { label: "Q-learning", calculation: "2+0.9×6=7.4", explanation: "The continuation assumes a greedy action even though behavior may explore." },
        { label: "Terminal check", calculation: "if terminated, all three targets equal reward 2", explanation: "No algorithm bootstraps past a true terminal transition." },
      ],
      result: "Different targets are not minor coding variants. They evaluate different continuations and therefore can learn different behavior around risk created by exploration.",
    },
    mechanism: {
      introduction: "Tabular control combines TD errors with policy improvement. Convergence claims depend on coverage, step sizes, stationarity, and the exact target.",
      sections: [
        { title: "SARSA is on-policy control", paragraphs: ["Behavior and target are the same policy. As epsilon decays under suitable GLIE conditions, the policy becomes greedy while every state-action pair continues to receive enough visits. With persistent epsilon, SARSA learns the value of that exploratory behavior rather than the fully greedy policy."] },
        { title: "Expected SARSA trades computation for lower target variance", paragraphs: ["When action probabilities and values can be summed, expectation removes randomness from which next action happened to be sampled. It can be on-policy or off-policy depending on which policy appears in the expectation."] },
        { title: "Q-learning separates behavior and greedy target", paragraphs: ["The max makes the update off-policy. Tabular convergence under standard conditions is powerful, but behavior still determines coverage and real-world safety. A greedy mathematical target does not prevent the data-collecting policy from taking exploratory actions."] },
        { title: "Double estimation reduces selection bias", paragraphs: ["Double Q-learning randomly updates one table, uses it to select a maximizing action, and uses the other table to evaluate that action. Deep Double DQN carries the same selection/evaluation idea into neural networks with online and target parameters."] },
      ],
    },
    equations: [
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\\right]", read: "SARSA moves the current action value toward the reward plus the discounted value of the next action actually selected.", meaning: "The target includes behavior's exploration. The name SARSA records the five observed elements: state, action, reward, next state, and next action." },
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma\\max_aQ(S_{t+1},a)-Q(S_t,A_t)\\right]", read: "Q-learning moves the current action value toward reward plus the discounted largest next-state action value.", meaning: "The maximization defines a greedy target policy. Behavior may be different, which makes coverage and off-policy stability important beyond the tabular case." },
    ],
    boundary: {
      title: "A greedy target is not a safety guarantee", paragraphs: ["In the cliff example, Q-learning's target imagines greedy continuation while the actual epsilon-greedy behavior can still fall. Deployed exploration requires constraints, shielding, simulation, or another evidence plan; it cannot be justified by the target equation." ,"Tabular convergence does not transfer automatically to neural approximation. Replay, moving targets, and off-policy bootstrapping form the deadly triad studied next and can produce divergence even when the tabular algorithm is well behaved."],
    },
    nextBridge: "Q-learning already learns about one policy from data generated by another. The next chapter makes that separation explicit, derives importance ratios, and shows why off-policy learning, bootstrapping, and function approximation can become an unstable combination.",
    sources: [SB, { label: "Watkins and Dayan — Q-learning", url: "https://link.springer.com/article/10.1007/BF00992698", kind: "paper" }, { label: "van Hasselt — Double Q-learning", url: "https://proceedings.neurips.cc/paper/2010/hash/091d584fced301b442654dd8c23b3fc9-Abstract.html", kind: "paper" }],
  },
  {
    slug: "off-policy-deadly-triad",
    title: "Correct off-policy data and recognize the deadly triad",
    deck: "Off-policy learning reuses behavior generated elsewhere, but corrections require coverage and can have extreme variance. With approximation and bootstrapping, the same mismatch can drive values away from any sensible solution.",
    openingQuestion: "Can data from one policy answer what another policy would have done, and what must be true before the correction is valid?",
    bridge: "Tabular Q-learning showed that behavior and target can differ. General off-policy learning now names both policies and accounts for their action probabilities. The benefit is data reuse; the risks are missing coverage, explosive likelihood ratios, and the deadly triad of off-policy updates, bootstrapping, and function approximation.",
    situation: {
      title: "A cautious logger rarely chooses the target policy's action",
      paragraphs: ["A behavior policy b recommends treatment A with probability 0.9 and B with probability 0.1. A proposed target policy π reverses those probabilities. A logged B outcome is much more representative of the target than an A outcome, so importance sampling weights it more heavily." ,"The one-step ratio π(a|s)/b(a|s) is 9 for B and about 0.11 for A. Across a long trajectory, multiplying ratios can produce enormous or tiny weights. A few rare episodes may dominate the estimate, yielding correct expectation in theory but unusable finite-sample variance." ,"No reweighting can recover an action that behavior never took. The coverage condition requires b(a|s)>0 wherever π(a|s)>0 for relevant states. Function approximation adds generalization across states, and bootstrapping feeds current estimates back into targets. Together with off-policy mismatch, these ingredients can amplify error instead of averaging it away."],
    },
    diagram: {
      title: "Correction works only where behavior provides support", caption: "Likelihood ratios change the contribution of observed data. They cannot create counterfactual outcomes for actions absent from the log.",
      items: [
        { label: "Behavior policy", value: "b(a|s)", note: "Generated the observed action and must be logged or known." },
        { label: "Target policy", value: "π(a|s)", note: "The policy whose value or update is desired." },
        { label: "Importance ratio", value: "ρ=π/b", note: "Upweights actions more likely under target and downweights others." },
        { label: "Coverage gate", value: "π>0 ⇒ b>0", note: "Without overlap, the desired counterfactual is unidentified from these data." },
      ],
    },
    workedExample: {
      title: "Reweight two logged actions",
      setup: "Behavior chooses A with 0.9 and B with 0.1. Target chooses A with 0.1 and B with 0.9. The log contains one reward 2 after A and one reward 6 after B.",
      prediction: "Which sample receives the larger weight when estimating the target policy?",
      steps: [
        { label: "A ratio", calculation: "ρ(A)=0.1/0.9≈0.111", explanation: "A is common under behavior but rare under target, so its contribution shrinks." },
        { label: "B ratio", calculation: "ρ(B)=0.9/0.1=9", explanation: "B is rare in the log but common under target, so this one sample receives large influence." },
        { label: "Ordinary weighted sum", calculation: "0.111×2+9×6=54.222", explanation: "With only two samples the estimate is dominated by B. Normalization or clipping can reduce variance but changes bias and interpretation." },
        { label: "Missing support case", calculation: "if b(B|s)=0, ρ(B) is undefined", explanation: "The log contains no B consequence. A model assumption or new data is required; arithmetic cannot fix absence." },
      ],
      result: "Off-policy correction is a data-coverage argument before it is an equation. Large ratios warn that the target relies on decisions behavior almost never made.",
    },
    mechanism: {
      introduction: "Off-policy methods differ in where they apply corrections, how they control variance, and whether their targets remain stable with approximation.",
      sections: [
        { title: "Importance sampling changes the measure", paragraphs: ["Multiplying by π/b converts an expectation under behavior into one under target when support and probability assumptions hold. Per-decision ratios can correct only the part of a return affected by each action, often reducing variance relative to a full-trajectory product."] },
        { title: "Variance control introduces tradeoffs", paragraphs: ["Self-normalized weights, clipping, truncation, Retrace-style coefficients, and V-trace trade some bias for stability. The chosen correction is part of the algorithm and must be reported. A stable curve does not mean the uncorrected target policy was identified."] },
        { title: "The deadly triad is an interaction", paragraphs: ["Function approximation alone can work, bootstrapping alone can work, and off-policy learning alone can work. Combining all three can make the projected update operator unstable. Baird's counterexample shows divergence in a tiny linear setting, so the issue is not merely deep-network optimization."] },
        { title: "Target networks and replay manage symptoms, not proofs", paragraphs: ["Deep RL commonly freezes target parameters temporarily and samples replay data to reduce correlation. These mechanisms improve practical behavior but do not guarantee convergence under arbitrary off-policy distributions. Diagnostics need value scale, TD error, coverage, ratios, and performance under the target policy."] },
      ],
    },
    equations: [
      { latex: "\\rho_t=\\frac{\\pi(A_t\\mid S_t)}{b(A_t\\mid S_t)}", read: "The importance ratio at time t is the target policy probability of the observed action divided by the behavior policy probability of that action.", meaning: "The denominator must be positive and accurately known for observed actions. Ratios far from one reveal distribution mismatch and potential variance, not merely a numerical nuisance." },
      { latex: "\\mathbb{E}_{A\\sim b(\\cdot\\mid s)}[\\rho(A,s)X(s,A)]=\\mathbb{E}_{A\\sim\\pi(\\cdot\\mid s)}[X(s,A)]", read: "At a fixed state, weighting behavior-policy actions by the target-to-behavior likelihood ratio recovers the target policy's conditional action expectation.", meaning: "The fixed-state condition matters: one action ratio does not correct a different state-occupancy distribution. Whole-trajectory or per-decision estimators need the corresponding sequence of ratios, support, and sampling assumptions." },
    ],
    boundary: {
      title: "Off-policy data is not automatically counterfactual evidence", paragraphs: ["Logged policy probabilities correct action-selection mismatch only for recorded context. If hidden variables influenced both action and outcome, standard importance sampling does not remove that confounding. Causal assumptions and data collection design remain necessary." ,"A low training loss on replay can coexist with catastrophic target-policy behavior outside the data support. Conservative offline RL, uncertainty, simulators, or guarded online collection address parts of that problem later; none turns absent evidence into certainty."],
    },
    nextBridge: "The tabular setting made every state-action value independent. Real problems cannot store one number per pair, so the next part replaces tables with shared functions. Linear approximation is the cleanest place to see how one update generalizes—and how the deadly triad can spread one error across many states.",
    sources: [SB, { label: "Precup, Sutton, and Singh — Eligibility Traces for Off-Policy Policy Evaluation", url: "https://www.cs.mcgill.ca/~dprecup/publications/Iswc.pdf", kind: "paper" }, { label: "Tsitsiklis and Van Roy — Analysis of Temporal-Difference Learning with Function Approximation", url: "https://ieeexplore.ieee.org/document/580874", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
