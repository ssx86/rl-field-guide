export type MechanicsLabId =
  | "foundations"
  | "deep-value"
  | "policy-learning"
  | "continuous-control"
  | "model-based"
  | "modern-practice"
  | "challenge-lab"
  | "formula-atlas";

export interface MechanicsCase {
  readonly title: string;
  readonly prompt: string;
  readonly givens: readonly string[];
  readonly operation: string;
  readonly result: string;
  readonly interpretation: string;
}

export interface MechanicsLab {
  readonly title: string;
  readonly intro: string;
  readonly cases: readonly MechanicsCase[];
}

export const MECHANICS_LABS = {
  foundations: {
    title: "Problem formulation workbench",
    intro: "Change the boundary before choosing an algorithm. The same physical system can become a different learning problem when state, reward, or termination changes.",
    cases: [
      { title: "One camera frame", prompt: "Can a single image be the state of a moving cart?", givens: ["Position is visible", "Velocity is hidden", "Velocity changes the next image"], operation: "Test whether equal observations always imply equal next-state distributions under the same action.", result: "POMDP", interpretation: "The frame is an observation, not a sufficient Markov state. Stack history or infer a belief over velocity." },
      { title: "Scan-count reward", prompt: "Will more scans produce more completed deliveries?", givens: ["Reward = +1 per scan", "A parcel can be scanned repeatedly", "Completion is not rewarded"], operation: "Search for behavior that maximizes the metric without completing the intended task.", result: "Reward hacking", interpretation: "The policy can loop on one parcel. Measure completed delivery separately and redesign the objective or constraint." },
      { title: "Thermostat horizon", prompt: "Where should an episode end in a building that never closes?", givens: ["Control is continuous in time", "Comfort and energy repeat daily", "Midnight is not terminal"], operation: "Compare an arbitrary daily cutoff with a continuing discounted or average-reward objective.", result: "Continuing task", interpretation: "A calendar boundary should not erase future consequences. The objective must match the ongoing physical process." },
    ],
  },
  "deep-value": {
    title: "DQN stability workbench",
    intro: "Hold one transition fixed and change the machinery around the target. Each stabilizer addresses a different failure mode.",
    cases: [
      { title: "Frozen target", prompt: "What target does DQN regress toward?", givens: ["r = −1", "γ = 0.9", "target Q values = [4, 7]"], operation: "Use the slowly updated target network: y = −1 + 0.9 × max(4, 7).", result: "5.30", interpretation: "The target network slows target drift; replay separately addresses correlation and data reuse." },
      { title: "Double selection", prompt: "What if the online and target networks disagree?", givens: ["online Q = [4, 7]", "target Q = [5, 3]", "r = −1, γ = 0.9"], operation: "Select action 2 with the online network, then evaluate action 2 with the target network: −1 + 0.9 × 3.", result: "1.70", interpretation: "Double DQN removes the same noisy estimate from both selection and evaluation, reducing positive maximization bias." },
      { title: "Replay priorities", prompt: "Which transition is replayed most often?", givens: ["absolute TD errors = [0.2, 1.4, 0.6]", "priority exponent α = 1", "total priority = 2.2"], operation: "Normalize each absolute TD error by 2.2 to obtain sampling probabilities.", result: "[0.09, 0.64, 0.27]", interpretation: "The surprising middle transition dominates sampling, so importance weights are needed to limit the induced bias." },
    ],
  },
  "policy-learning": {
    title: "Policy update workbench",
    intro: "Follow the signal from return to advantage to a constrained probability change. The actor never sees a correct-action label.",
    cases: [
      { title: "REINFORCE direction", prompt: "Should a sampled action become more or less likely?", givens: ["sampled return G = +3", "log-probability gradient points toward the action", "baseline is absent"], operation: "Multiply the score-function gradient by the positive return and ascend the objective.", result: "Increase probability", interpretation: "A positive sampled outcome reinforces the action, but the single-trajectory estimate remains high variance." },
      { title: "Baseline advantage", prompt: "Was the outcome better than expected for this state?", givens: ["return G = 3", "baseline V(s) = 2", "same sampled action"], operation: "Center the policy signal with A = G − V(s) = 3 − 2.", result: "+1 advantage", interpretation: "The baseline preserves the expected policy gradient while reducing variance by comparing against state difficulty." },
      { title: "PPO clipping", prompt: "How much of a large probability jump counts?", givens: ["old probability = 0.20", "new probability = 0.32", "advantage = +2, ε = 0.2"], operation: "The ratio is 1.6; clip it to 1.2, so the positive-advantage surrogate uses 1.2 × 2.", result: "2.40 objective", interpretation: "Clipping removes the incentive for this sample to push farther, but it is not a hard bound on the whole policy." },
    ],
  },
  "continuous-control": {
    title: "Continuous action workbench",
    intro: "Trace neural outputs into bounded controls and compare the critic targets that keep deterministic and stochastic actors stable.",
    cases: [
      { title: "Actuator scaling", prompt: "What real action corresponds to tanh output 0.5?", givens: ["normalized output = 0.5", "actuator low = −2", "actuator high = 3"], operation: "Map [−1, 1] to [−2, 3]: −2 + ((0.5 + 1) / 2) × 5.", result: "1.75", interpretation: "The action stays inside physical bounds and the scaling remains explicit rather than hidden in simulator clipping." },
      { title: "TD3 twin critics", prompt: "Which critic defines the bootstrap?", givens: ["target critics = 6 and 4", "reward = 1", "γ = 0.9"], operation: "Take the smaller target estimate before bootstrapping: 1 + 0.9 × min(6, 4).", result: "4.60", interpretation: "The minimum counters optimistic critic errors, although correlated critics can still be wrong together." },
      { title: "SAC entropy target", prompt: "How does entropy enter a soft value target?", givens: ["next Q = 4", "entropy bonus αH = 0.1", "reward = 1, γ = 0.9"], operation: "Add the entropy bonus inside the discounted successor term: 1 + 0.9 × (4 + 0.1).", result: "4.69", interpretation: "Entropy rewards stochasticity during learning; safety and actuator constraints must still be enforced separately." },
    ],
  },
  "model-based": {
    title: "Planning with a learned world",
    intro: "Compare extra imagined backups, short-horizon action sequences, and search bonuses without hiding model error.",
    cases: [
      { title: "Dyna reuse", prompt: "How much learning follows one real transition?", givens: ["1 real TD update", "5 simulated model updates", "same stored experience model"], operation: "Apply the real update, update the model, then sample five bounded imagined transitions.", result: "6 value backups", interpretation: "Dyna reuses scarce experience, but a biased model can amplify the same mistake five additional times." },
      { title: "MPC candidates", prompt: "Which two-step action sequence is executed?", givens: ["sequence A predicted rewards = [3, 2]", "sequence B = [1, 4]", "γ = 0.9"], operation: "Score A as 3 + 0.9 × 2 = 4.8 and B as 1 + 0.9 × 4 = 4.6.", result: "Execute A's first action", interpretation: "MPC executes only the first action, observes reality, and replans instead of trusting the full imagined sequence." },
      { title: "MCTS selection", prompt: "Should search exploit the known branch or inspect a sparse branch?", givens: ["parent visits = 22, c = 1", "branch A mean = 0.7, visits = 20", "branch B mean = 0.5, visits = 2"], operation: "UCB1 gives A = 0.7 + √(ln 22 / 20) = 1.09 and B = 0.5 + √(ln 22 / 2) = 1.74.", result: "Explore branch B", interpretation: "Search spends computation where uncertainty can change the decision, then backs the new evidence up the tree." },
    ],
  },
  "modern-practice": {
    title: "Deployment evidence workbench",
    intro: "Treat data support, hidden state, constraints, and evaluation as parts of the algorithm rather than post-training paperwork.",
    cases: [
      { title: "Offline support", prompt: "Can the log evaluate an aggressive unseen action?", givens: ["action appears 0 times", "learned Q = 18", "behavior policy probability = 0"], operation: "Compare the proposed action with dataset support before trusting the extrapolated value.", result: "Reject the claim", interpretation: "No importance weight or critic can recover consequences that are absent from the fixed data without extra assumptions." },
      { title: "Hidden machine wear", prompt: "Why do identical sensor readings lead to different failures?", givens: ["current temperature matches", "maintenance histories differ", "wear is hidden"], operation: "Condition prediction on recent history or maintain a belief over hidden wear states.", result: "Add memory", interpretation: "The current observation violates Markov sufficiency; a larger feed-forward network cannot invent missing history." },
      { title: "Seed-level evidence", prompt: "Does a mean return of 200 prove reliable learning?", givens: ["seed returns = [20, 30, 550]", "mean = 200", "two of three seeds fail"], operation: "Inspect the distribution, median, failure rate, and confidence interval instead of the mean alone.", result: "Unstable result", interpretation: "A spectacular outlier hides frequent failure. Reproducibility requires independent seeds and a frozen evaluation protocol." },
    ],
  },
  "challenge-lab": {
    title: "Method selection workbench",
    intro: "Diagnose information, interaction, action structure, and risk before naming an algorithm.",
    cases: [
      { title: "Exact warehouse", prompt: "The deterministic transition table is complete. What comes first?", givens: ["full model known", "small discrete state space", "no sampling cost"], operation: "Order state dependencies and solve with dynamic programming or graph search.", result: "Plan first", interpretation: "Model-free sampling would discard exact information and add estimation error without solving a real constraint." },
      { title: "Fixed driving logs", prompt: "Road exploration is forbidden. What changes?", givens: ["dataset is fixed", "rare recoveries are sparse", "unsafe actions cannot be tried"], operation: "Audit support, constrain policy shift, and test rare cases in a separate validated simulator.", result: "Offline and conservative", interpretation: "An ordinary online exploration algorithm violates the interaction constraint before optimization even begins." },
      { title: "Eight torque controls", prompt: "Can DQN enumerate the useful actions?", givens: ["8 continuous dimensions", "each dimension is bounded", "smooth control is required"], operation: "Use a continuous actor-critic and expose the mapping from normalized outputs to physical torques.", result: "TD3 or SAC family", interpretation: "Discretizing each dimension creates a combinatorial action grid and destroys fine control near useful actions." },
    ],
  },
  "formula-atlas": {
    title: "Formula substitution workbench",
    intro: "Every substitution names its data source, target, and terminal rule before arithmetic begins.",
    cases: [
      { title: "Terminal Q update", prompt: "What survives after a terminal transition?", givens: ["old Q = 2", "reward = −100", "α = 0.5, next Q = 999"], operation: "Set the bootstrap to zero, then update: 2 + 0.5 × (−100 − 2).", result: "−49.00", interpretation: "The huge successor estimate is irrelevant because a true terminal transition has no future return." },
      { title: "Importance ratio", prompt: "How much should one off-policy trajectory count?", givens: ["target probabilities = [0.8, 0.6]", "behavior probabilities = [0.5, 0.4]", "support is nonzero"], operation: "Multiply action-wise ratios: (0.8 / 0.5) × (0.6 / 0.4).", result: "2.40", interpretation: "Large products create variance over long horizons, so effective sample size and weighted estimators must be monitored." },
      { title: "Bellman expectation", prompt: "What value follows a stochastic action?", givens: ["next values = 4 and 8", "transition probabilities = 0.75 and 0.25", "reward = 1, γ = 0.9"], operation: "Compute 1 + 0.9 × (0.75 × 4 + 0.25 × 8).", result: "5.50", interpretation: "A known-model expectation weights every successor; a sampled TD update would use only the observed successor." },
    ],
  },
} as const satisfies Record<MechanicsLabId, MechanicsLab>;

export function hasMechanicsLab(id: string): id is MechanicsLabId {
  return id in MECHANICS_LABS;
}
