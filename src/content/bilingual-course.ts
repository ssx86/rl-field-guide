export const LANGUAGES = ["en", "zh"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LESSON_IDS = [
  "before-rl",
  "interaction-loop",
  "return-and-time",
  "bandits",
  "mdp",
  "planning",
  "mc-and-td",
  "control",
  "deep-value",
  "policy-learning",
  "continuous-and-models",
  "llm-post-training",
  "llm-rlhf",
  "llm-preference",
  "llm-reasoning",
  "real-world-practice",
] as const;

export type LessonId = (typeof LESSON_IDS)[number];

export interface LessonExample {
  readonly title: string;
  readonly setup: string;
  readonly steps: readonly string[];
  readonly result: string;
}

export interface LessonFormula {
  readonly latex: string;
  readonly read: string;
  readonly meaning: string;
}

export interface Lesson {
  readonly id: LessonId;
  readonly stage: string;
  readonly title: string;
  readonly subtitle: string;
  readonly openingQuestion: string;
  readonly prerequisites: readonly LessonId[];
  readonly outcome: string;
  readonly story: string;
  readonly concepts: readonly { readonly title: string; readonly body: string }[];
  readonly examples: readonly LessonExample[];
  readonly formulas: readonly LessonFormula[];
  readonly misconception: string;
  readonly transfer: { readonly question: string; readonly answer: string };
  readonly nextReason: string;
  readonly references?: readonly { readonly label: string; readonly url: string }[];
}

export interface CourseCopy {
  readonly languageName: string;
  readonly htmlLang: string;
  readonly brand: string;
  readonly title: string;
  readonly strapline: string;
  readonly introduction: string;
  readonly startLabel: string;
  readonly resumeLabel: string;
  readonly routeLabel: string;
  readonly methodTitle: string;
  readonly methodSteps: readonly { readonly label: string; readonly note: string }[];
  readonly promiseTitle: string;
  readonly promises: readonly string[];
  readonly labels: {
    readonly zeroStart: string;
    readonly lesson: string;
    readonly minutes: string;
    readonly prerequisites: string;
    readonly none: string;
    readonly outcome: string;
    readonly story: string;
    readonly ideas: string;
    readonly examples: string;
    readonly formula: string;
    readonly misconception: string;
    readonly transfer: string;
    readonly reveal: string;
    readonly next: string;
    readonly previous: string;
    readonly courseMap: string;
    readonly language: string;
    readonly theme: string;
  };
  readonly lessons: readonly Lesson[];
}

const enLessons: readonly Lesson[] = [
  {
    id: "before-rl",
    stage: "Orientation",
    title: "Before RL: what kind of problem is this?",
    subtitle: "Begin with decisions and consequences, not notation.",
    openingQuestion: "A thermostat, a chess engine, and an image classifier all use computation. Which one actually needs reinforcement learning?",
    prerequisites: [],
    outcome: "You can tell when RL is a useful framing—and when supervised learning, search, or a fixed rule is simpler.",
    story: "Imagine teaching a puppy to wait at a door. You cannot provide the correct muscle movement for every millisecond. You can let it act, observe what follows, and shape behavior with consequences. RL studies this repeated decision loop.",
    concepts: [
      { title: "A decision must change what happens next", body: "RL matters when an action affects future situations. If each prediction is independent, supervised learning is usually the cleaner tool." },
      { title: "The right action is not handed to us", body: "The learner receives outcomes, not a complete answer key. It must discover which behavior causes better long-term outcomes." },
      { title: "Feedback may arrive late", body: "An action can look harmless now and matter much later. Credit assignment is the problem of connecting delayed outcomes to earlier choices." },
    ],
    examples: [
      { title: "Email spam filter", setup: "A dataset already labels each email as spam or not spam.", steps: ["Input an email", "Compare the prediction with its label", "Update the classifier"], result: "This is supervised learning: the correct target is available for each example." },
      { title: "Warehouse robot", setup: "A robot repeatedly chooses routes while congestion changes.", steps: ["Choose a turn", "Observe the next aisle and time cost", "Keep acting until delivery"], result: "This is a natural RL problem because choices change future choices and the final delay is cumulative." },
    ],
    formulas: [],
    misconception: "RL is not simply ‘machine learning with a reward number.’ The sequential effect of actions and the absence of per-action labels are the important differences.",
    transfer: { question: "A medical model recommends a one-time treatment from historical patient records. Is RL automatically required?", answer: "No. If there is only one decision and reliable outcome labels, causal estimation or supervised prediction may be enough. RL becomes relevant when treatments form a sequence and today’s action changes tomorrow’s state." },
    nextReason: "Now define the smallest loop that makes a sequential decision problem precise.",
  },
  {
    id: "interaction-loop",
    stage: "Orientation",
    title: "The interaction loop",
    subtitle: "Agent, environment, observation, action, reward, repeat.",
    openingQuestion: "If a delivery robot sees a camera frame and receives +1 at the destination, what is still missing before it can learn?",
    prerequisites: ["before-rl"],
    outcome: "You can draw a clean boundary between agent and environment and describe one transition without mixing state, action, and reward.",
    story: "A learner never acts in a vacuum. At time t it sees information, chooses an action, and the environment answers with new information and a scalar reward. This loop is the grammar of RL.",
    concepts: [
      { title: "Agent and environment", body: "The agent is the decision-maker. Everything affected by the decision belongs to the environment. The boundary is a modeling choice, but the interface must be explicit." },
      { title: "Observation is not always state", body: "An observation is what the agent can see. A state contains enough information to predict the future. One camera frame may hide velocity, so several frames or memory may be needed." },
      { title: "Reward is not the goal description", body: "Reward is the numeric signal emitted at one step. The objective is the accumulated return. A badly designed reward can produce behavior we never intended." },
    ],
    examples: [
      { title: "Two-room delivery", setup: "The robot begins in room A and must deliver to room B.", steps: ["Observation: current room", "Action: move or wait", "Reward: -1 per step, +5 on delivery"], result: "The shortest successful route has the largest accumulated outcome." },
      { title: "Partially observed driving", setup: "A single image shows a car near an intersection.", steps: ["The image reveals position", "It does not reveal exact velocity", "Add recent frames or a recurrent memory"], result: "The raw observation was not a complete Markov state." },
    ],
    formulas: [{ latex: "(S_t, A_t, R_{t+1}, S_{t+1})", read: "state, action, next reward, next state", meaning: "One transition is the smallest reusable piece of experience." }],
    misconception: "The environment is not necessarily the physical world. A simulator, a game engine, a database, or a person can all be part of the environment if they answer the agent’s actions.",
    transfer: { question: "For a language-model assistant, what could be an action and what could be an observation?", answer: "An action could be the next generated token or a tool call. The observation could include the conversation, tool results, and system state. The exact boundary depends on what the policy controls." },
    nextReason: "One reward is not enough; we need a way to compare whole futures.",
  },
  {
    id: "return-and-time",
    stage: "Foundations",
    title: "Goals that unfold over time",
    subtitle: "Return, discounting, episodes, and continuing tasks.",
    openingQuestion: "Would you prefer +4 now, or +5 after three costly steps?",
    prerequisites: ["interaction-loop"],
    outcome: "You can calculate a return numerically and explain what the discount factor changes without calling it merely impatience.",
    story: "Rewards are local receipts. Return is the total bill. RL algorithms evaluate behavior by combining the rewards that follow a decision.",
    concepts: [
      { title: "Return combines future rewards", body: "The return at time t adds rewards from the future. Episodic tasks end; continuing tasks need a convention that keeps the total well-defined." },
      { title: "Discounting controls horizon", body: "A discount below one makes distant rewards count less and keeps infinite sums finite. It also encodes how far ahead the agent effectively plans." },
      { title: "Terminal states stop bootstrapping", body: "After a true terminal transition there is no next value to add. Time limits require care because truncation is not always genuine termination." },
    ],
    examples: [
      { title: "Short route", setup: "Rewards are -1, -1, then +5 with discount 1.", steps: ["Add the three rewards", "-1 - 1 + 5", "Compare with alternative routes"], result: "The return is 3." },
      { title: "Delayed reward", setup: "Rewards are 0, 0, then +10 with discount 0.9.", steps: ["First reward: 0", "Second reward: 0.9 × 0", "Third reward: 0.9² × 10"], result: "The return from the start is 8.1." },
    ],
    formulas: [{ latex: "G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots", read: "return equals the next reward plus discounted later rewards", meaning: "Gamma controls the effective planning horizon; it does not change which rewards actually occurred." }],
    misconception: "A small discount factor is not always a statement that the agent is psychologically impatient. It can be a mathematical device, a model of uncertainty, or a deliberate horizon choice.",
    transfer: { question: "An episode ends only because the simulator reached a 1,000-step limit. Should the next-state value always be zero?", answer: "No. A time-limit truncation may hide a continuing future, so zeroing the next value can bias learning. Only genuine terminal states necessarily have zero continuation value." },
    nextReason: "With goals defined, we can start with the simplest learn-by-trying problem.",
  },
  {
    id: "bandits",
    stage: "Foundations",
    title: "One decision, uncertain outcomes",
    subtitle: "Bandits isolate exploration before state enters the picture.",
    openingQuestion: "One option has paid well three times; another has never been tried. Which should you choose next?",
    prerequisites: ["return-and-time"],
    outcome: "You can explain exploration versus exploitation, estimate action values, and compare epsilon-greedy with optimism or UCB.",
    story: "A multi-armed bandit repeats one choice in one situation. It removes state transitions so we can study the cost of learning what each action is worth.",
    concepts: [
      { title: "Sample-average value", body: "Estimate an action by averaging rewards observed after choosing it. The estimate changes only when that action is sampled." },
      { title: "Exploration has an opportunity cost", body: "Trying an uncertain action may reveal a better option, but it may also sacrifice reward now. Regret measures the gap from always choosing the unknown best action." },
      { title: "Uncertainty should guide trials", body: "Epsilon-greedy explores uniformly. UCB prefers actions that are promising or insufficiently tested. Optimistic initialization makes early uncertainty visible through high initial estimates." },
    ],
    examples: [
      { title: "Café menu", setup: "Tea has average rating 7 after ten visits; a new drink has no data.", steps: ["Exploit: order tea", "Explore: test the new drink", "Update only the chosen drink’s estimate"], result: "A small exploration rate trades short-term certainty for information." },
      { title: "Non-stationary ads", setup: "Click rates change after a seasonal event.", steps: ["Old averages retain stale data", "Use a constant step size", "Recent clicks receive more weight"], result: "Tracking a moving value requires forgetting some history." },
    ],
    formulas: [{ latex: "Q_{n+1}(a)=Q_n(a)+\\alpha[R_n-Q_n(a)]", read: "new estimate equals old estimate plus step size times prediction error", meaning: "The bracket is evidence minus expectation; alpha controls how quickly the estimate moves." }],
    misconception: "Exploration is not random noise added for its own sake. It is information gathering. Good exploration directs trials toward uncertainty that can change future decisions.",
    transfer: { question: "Why can a fixed one-percent exploration rate remain costly after a million trials?", answer: "It keeps choosing random actions even when estimates are already precise. A decaying schedule or uncertainty-aware rule can reduce unnecessary exploration, provided the environment is not changing." },
    nextReason: "Now add state, so today’s action can change tomorrow’s choices.",
  },
  {
    id: "mdp",
    stage: "Tabular reasoning",
    title: "A map for sequential decisions",
    subtitle: "States, transitions, policies, values, and the Markov property.",
    openingQuestion: "What information must a map contain before an optimal route can be calculated rather than learned?",
    prerequisites: ["interaction-loop", "return-and-time"],
    outcome: "You can read an MDP, distinguish a policy from a value function, and test whether a proposed state is Markov enough.",
    story: "A Markov decision process is not an algorithm. It is a contract describing what can happen after each action and how outcomes are scored.",
    concepts: [
      { title: "The model predicts consequences", body: "A transition model gives probabilities for next states and rewards. Deterministic maps are a special case with probability one." },
      { title: "A policy chooses actions", body: "A policy maps states or observations to action distributions. It is the behavior we can execute." },
      { title: "A value predicts future return", body: "V asks how good a state is under a policy. Q asks how good one action is before following the policy. Values evaluate; policies act." },
    ],
    examples: [
      { title: "Windy corridor", setup: "Moving right succeeds 80% of the time and slips left 20%.", steps: ["List both possible next states", "Weight each outcome by probability", "Add immediate and future value"], result: "A model must represent uncertainty, not only the most likely transition." },
      { title: "Hidden battery", setup: "A robot’s location is visible but battery level is omitted.", steps: ["The same location can lead to different failures", "Future depends on hidden battery", "Add battery level to the state"], result: "Location alone violates the Markov assumption for this task." },
    ],
    formulas: [{ latex: "v_\\pi(s)=\\mathbb{E}_\\pi[G_t\\mid S_t=s]", read: "state value is expected return from state s while following policy pi", meaning: "The expectation averages both policy randomness and environment randomness." }],
    misconception: "The Markov property does not mean the world has no history. It means the chosen state representation contains the history that still matters for predicting the future.",
    transfer: { question: "Is a screenshot a sufficient state for a moving ball game?", answer: "Usually not. One frame shows position but not velocity. Frame stacking, inferred velocity, or recurrent memory can make the representation closer to Markov." },
    nextReason: "If this full model is known, we can plan without collecting trial-and-error data.",
  },
  {
    id: "planning",
    stage: "Tabular reasoning",
    title: "When the model is known: plan",
    subtitle: "Bellman backups, policy evaluation, and value iteration.",
    openingQuestion: "If every transition and reward is already known, why spend thousands of steps rediscovering them?",
    prerequisites: ["mdp"],
    outcome: "You can perform one Bellman backup and choose among direct calculation, policy iteration, value iteration, and search.",
    story: "Planning uses a model as a counterfactual machine: try possible actions in calculation, propagate their consequences backward, and improve behavior before acting in the real environment.",
    concepts: [
      { title: "A backup moves information backward", body: "A state’s value is updated from immediate reward plus the value of successor states. Repeated backups propagate distant reward through the map." },
      { title: "Evaluation and improvement are different", body: "Policy evaluation asks how good a fixed policy is. Policy improvement chooses better actions from those values. Policy iteration alternates them." },
      { title: "Update order can matter", body: "Synchronous sweeps read old values; asynchronous updates can reuse new values immediately. Both may converge, but at different speeds." },
    ],
    examples: [
      { title: "Acyclic corridor", setup: "Every state has one rightward action and the goal reward is known.", steps: ["Start at the goal’s predecessor", "Calculate its value", "Move backward in dependency order"], result: "One backward pass solves the corridor; sampling is unnecessary." },
      { title: "Stochastic grid", setup: "An intended move sometimes slips sideways.", steps: ["Enumerate possible successors", "Weight by transition probability", "Repeat sweeps until values stabilize"], result: "Expected Bellman backups handle stochastic dynamics." },
    ],
    formulas: [{ latex: "Q^*(s,a)=\\sum_{s'}p(s'|s,a)[r+\\gamma\\max_{a'}Q^*(s',a')]", read: "optimal action value averages reward plus the best next value over possible successors", meaning: "The model supplies probabilities; the max supplies optimal future behavior." }],
    misconception: "Value iteration is not model-free learning. It may look like repeated updating, but each update uses an explicitly known model rather than a sampled transition from experience.",
    transfer: { question: "A game has exact rules but an enormous tree. Must you switch to model-free RL?", answer: "Not necessarily. Search methods such as MCTS use the known model selectively, expanding promising parts of the tree instead of sweeping the entire state space." },
    nextReason: "When the model is absent, we must estimate values from experienced trajectories.",
  },
  {
    id: "mc-and-td",
    stage: "Learning from experience",
    title: "Learn from returns—or learn one step early",
    subtitle: "Monte Carlo, temporal difference, and the bias–variance tradeoff.",
    openingQuestion: "Must an episode finish before a prediction can improve?",
    prerequisites: ["return-and-time", "mdp"],
    outcome: "You can calculate MC and TD targets, explain bootstrapping, and select a target length for the task.",
    story: "Without a model, experience becomes the teacher. Monte Carlo waits for the full outcome. TD uses the next reward plus its current estimate, so it can learn before the ending is known.",
    concepts: [
      { title: "Monte Carlo uses complete sampled returns", body: "It does not bootstrap from current value estimates. The target is unbiased under the sampled policy, but can vary widely between episodes." },
      { title: "TD bootstraps", body: "TD(0) replaces the unknown remainder of a trajectory with the current estimate of the next state. This introduces bias but often lowers variance and enables online learning." },
      { title: "n-step methods form a spectrum", body: "One-step TD bootstraps quickly; full-return MC waits. Intermediate n-step targets trade computation, bias, and variance." },
    ],
    examples: [
      { title: "Hotel review", setup: "A traveler rates the whole trip only after checkout.", steps: ["MC waits for the final rating", "Assign the observed return to visited states", "Average across trips"], result: "Complete episodes provide direct but noisy targets." },
      { title: "Commute delay", setup: "After one road segment the next location already has a delay estimate.", steps: ["Observe 3 minutes now", "Look up 12 minutes for the next state", "Target 3 + gamma × 12"], result: "TD updates immediately by bootstrapping from the next estimate." },
    ],
    formulas: [{ latex: "V(S_t)\\leftarrow V(S_t)+\\alpha[R_{t+1}+\\gamma V(S_{t+1})-V(S_t)]", read: "move the old value toward reward plus the next value", meaning: "The bracket is the TD error: surprise measured against the current one-step prediction." }],
    misconception: "Bootstrapping does not mean copying an answer known to be correct. It means using another learned estimate as part of the target; that efficiency comes with coupled errors.",
    transfer: { question: "Which is easier for a never-ending server-control task: ordinary episodic Monte Carlo or TD learning?", answer: "TD learning. It can update after each transition without waiting for an episode that may never naturally end." },
    nextReason: "Prediction evaluates behavior; control must also improve the behavior that generates experience.",
  },
  {
    id: "control",
    stage: "Learning from experience",
    title: "From prediction to control",
    subtitle: "SARSA, Q-learning, exploration, and off-policy targets.",
    openingQuestion: "Two agents explore near a cliff. Why can one learn a safer route even with the same rewards?",
    prerequisites: ["bandits", "mc-and-td"],
    outcome: "You can compute SARSA and Q-learning targets and explain on-policy versus off-policy behavior using the action inside the target.",
    story: "Control learns action values and uses them to improve a policy. The central choice is whether the target evaluates the behavior actually taken or a different, usually greedier, policy.",
    concepts: [
      { title: "SARSA learns about its behavior", body: "Its target uses the next action actually selected by the exploratory policy. Risk from future exploration therefore appears in its values." },
      { title: "Q-learning learns about a greedy target", body: "Its target uses the maximum next action value even while behavior still explores. This is off-policy learning." },
      { title: "Coverage still matters", body: "Off-policy does not mean data can be arbitrary. Important state-action pairs need adequate coverage, and function approximation adds stability concerns." },
    ],
    examples: [
      { title: "Cliff walking", setup: "Exploration near a cliff occasionally steps into a large penalty.", steps: ["SARSA includes the sampled exploratory next action", "Q-learning inserts the greedy next action", "Compare learned paths"], result: "SARSA often learns a safer path while Q-learning targets the shortest greedy path." },
      { title: "Numeric update", setup: "Reward = 2, gamma = 0.9, current Q = 4, best next Q = 6, alpha = 0.5.", steps: ["Target = 2 + 0.9 × 6 = 7.4", "Error = 7.4 - 4 = 3.4", "New Q = 4 + 0.5 × 3.4"], result: "The updated value is 5.7." },
    ],
    formulas: [{ latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha[R_{t+1}+\\gamma\\max_a Q(S_{t+1},a)-Q(S_t,A_t)]", read: "Q-learning moves the chosen action value toward reward plus the best estimated next action", meaning: "The max makes the target greedy even if data came from exploratory behavior." }],
    misconception: "Off-policy does not mean the agent never explores. It means the policy being evaluated or improved differs from the policy that generated the action in the data.",
    transfer: { question: "If safety during learning matters, is greedy-target Q-learning automatically the best choice?", answer: "No. The learned target may ignore the real cost of exploratory behavior. On-policy evaluation, constraints, shielding, or safer data collection may be more appropriate." },
    nextReason: "Tables break when states are numerous or continuous, so values must generalize.",
  },
  {
    id: "deep-value",
    stage: "Scaling up",
    title: "From tables to deep value functions",
    subtitle: "Function approximation, DQN, replay, and target networks.",
    openingQuestion: "Why not train a neural network on each new transition and immediately use its own latest prediction as the target?",
    prerequisites: ["control"],
    outcome: "You can explain the DQN stability problem and the distinct jobs of replay, a target network, Double DQN, and representation learning.",
    story: "A table memorizes each state separately. A function approximator shares parameters, allowing similar states to share evidence. That power also couples errors across many predictions.",
    concepts: [
      { title: "Generalization replaces lookup", body: "A neural network maps observations to action values. One update can change predictions for many states, including states absent from the batch." },
      { title: "Replay changes the data stream", body: "A replay buffer reuses past transitions and samples them in a less correlated order. It improves data efficiency but also defines which experience is remembered." },
      { title: "A target network slows a moving target", body: "DQN computes targets with a delayed copy of the value network. Double DQN separates action selection from evaluation to reduce overestimation." },
    ],
    examples: [
      { title: "Adjacent pixels", setup: "Two game screens differ by one pixel but represent the same situation.", steps: ["A table treats them as unrelated keys", "A network extracts shared features", "Both screens receive similar Q values"], result: "Function approximation can generalize across observations." },
      { title: "Correlated driving frames", setup: "Consecutive video frames are nearly identical.", steps: ["Online updates see a narrow slice of states", "Replay mixes older and newer transitions", "A target network changes more slowly"], result: "The regression problem becomes less correlated and less self-chasing." },
    ],
    formulas: [{ latex: "L(\\theta)=\\mathbb{E}[(r+\\gamma\\max_{a'}Q_{\\theta^-}(s',a')-Q_\\theta(s,a))^2]", read: "minimize squared error between current Q and a delayed Bellman target", meaning: "Theta learns; theta-minus is held fixed for a while to stabilize the target." }],
    misconception: "Replay and target networks do not make deep Q-learning universally stable. Distribution shift, sparse rewards, poor exploration, and the deadly triad can still cause failure.",
    transfer: { question: "Why is plain DQN a poor direct fit for steering angles?", answer: "DQN takes a maximum over a discrete list of actions. Fine-grained continuous actions would require an impractically large discretization or a policy designed for continuous outputs." },
    nextReason: "Instead of deriving behavior from values, we can optimize the policy itself.",
  },
  {
    id: "policy-learning",
    stage: "Scaling up",
    title: "Learn the policy directly",
    subtitle: "Policy gradients, baselines, actor–critic, GAE, and PPO.",
    openingQuestion: "If the action is continuous or the best behavior must remain stochastic, why learn every action value first?",
    prerequisites: ["mc-and-td", "deep-value"],
    outcome: "You can trace a policy-gradient update, explain the role of an advantage estimate, and state what PPO’s clipped objective is trying to prevent.",
    story: "A parameterized policy produces actions directly. Successful sampled actions become more likely; unsuccessful ones become less likely. A critic supplies a lower-variance learning signal.",
    concepts: [
      { title: "Log probability turns outcomes into direction", body: "The gradient of log policy probability points toward making a sampled action more likely. Multiplying by return or advantage chooses the direction and strength." },
      { title: "A baseline reduces variance", body: "Subtracting an expected value leaves an advantage: better or worse than expected. A learned critic estimates that baseline." },
      { title: "PPO limits abrupt policy change", body: "The probability ratio compares new and old policies. Clipping discourages a single batch from moving behavior too far, though it is not a hard safety guarantee." },
    ],
    examples: [
      { title: "Biased coin policy", setup: "A policy chooses left with probability 0.6 and left produces a positive advantage.", steps: ["Sample left", "Compute positive advantage", "Increase log probability of left"], result: "The updated policy becomes slightly more likely to choose left." },
      { title: "Traffic signal actor–critic", setup: "The actor selects green-light durations; the critic predicts future delay.", steps: ["Actor samples a duration", "Environment reports queue change", "Critic forms an advantage estimate"], result: "The actor learns from whether the outcome was better than expected." },
    ],
    formulas: [{ latex: "\\nabla_\\theta J(\\theta)=\\mathbb{E}[\\nabla_\\theta\\log\\pi_\\theta(a|s)\\,A(s,a)]", read: "change policy parameters in proportion to action log probability times advantage", meaning: "Positive advantage reinforces the sampled action; negative advantage suppresses it." }],
    misconception: "PPO is not automatically the best RL algorithm and clipping does not guarantee monotonic improvement. Environment structure, sample cost, action space, and implementation details still decide the fit.",
    transfer: { question: "Why can a deterministic best action be undesirable in negotiation or games?", answer: "Predictable behavior may be exploitable, and several actions may be useful. A stochastic policy represents deliberate uncertainty directly instead of adding noise after the fact." },
    nextReason: "Continuous control and planning with learned models reveal the next major design choices.",
  },
  {
    id: "continuous-and-models",
    stage: "Scaling up",
    title: "Continuous control and learned worlds",
    subtitle: "DDPG, TD3, SAC, Dyna, MPC, MCTS, and world models.",
    openingQuestion: "Should an agent learn the action to take, learn what the world will do, or learn both?",
    prerequisites: ["policy-learning", "planning"],
    outcome: "You can place major continuous-control and model-based methods on a common map and explain their main tradeoffs.",
    story: "Continuous actions remove the easy max over a short list. Model-based methods add another option: predict future dynamics and use those predictions to plan or generate extra learning experience.",
    concepts: [
      { title: "Continuous actors output actions", body: "DDPG and TD3 learn deterministic actors; TD3 uses two critics and delayed actor updates. SAC learns a stochastic policy and rewards entropy as well as task return." },
      { title: "Models can plan or produce data", body: "MPC replans from the current state over a short horizon. Dyna mixes real transitions with simulated ones. MCTS builds a selective search tree." },
      { title: "Model error compounds", body: "A learned world model can imagine impossible futures. Short horizons, uncertainty estimates, ensembles, and repeated replanning help limit exploitation of model mistakes." },
    ],
    examples: [
      { title: "Robot arm", setup: "Each joint torque is a continuous number.", steps: ["Actor outputs a torque vector", "Critic scores the state-action pair", "Policy follows the critic gradient or an entropy objective"], result: "Continuous policies avoid enumerating millions of discretized actions." },
      { title: "Model-predictive driving", setup: "A learned model predicts the next few positions for candidate steering sequences.", steps: ["Simulate short candidate futures", "Choose the best first action", "Observe reality and replan"], result: "Frequent replanning limits the damage from long-range model error." },
    ],
    formulas: [{ latex: "J_{SAC}=\\mathbb{E}[\\sum_t r_t+\\alpha\\mathcal{H}(\\pi(\\cdot|s_t))]", read: "SAC maximizes reward plus weighted policy entropy", meaning: "Entropy encourages a policy that remains usefully stochastic; alpha controls that tradeoff." }],
    misconception: "Model-based RL is not automatically more sample-efficient in practice. A model that is cheap to learn but wrong in decision-relevant regions can make planning confidently harmful.",
    transfer: { question: "When would short-horizon MPC be preferable to one long imagined rollout?", answer: "When model error grows with horizon. Acting once, observing the real next state, and replanning repeatedly anchors predictions to reality." },
    nextReason: "The final step is to handle data limits, safety, evaluation, and human objectives.",
  },
  {
    id: "llm-post-training",
    stage: "LLM reinforcement learning",
    title: "Where RL enters an LLM pipeline",
    subtitle: "Pretraining, supervised fine-tuning, and post-training solve different problems.",
    openingQuestion: "A language model predicts the next token extremely well. Why can it still ignore a user’s instruction?",
    prerequisites: ["policy-learning"],
    outcome: "You can map language generation to an RL trajectory and separate pretraining, SFT, reward modeling, and policy optimization by the signal each stage uses.",
    story: "An LLM begins as a next-token predictor. Post-training turns that broad predictor into an assistant. Some stages imitate demonstrations; RL stages optimize consequences of whole generated responses. Calling every post-training step ‘RLHF’ hides the mechanism that actually supplies the learning signal.",
    concepts: [
      { title: "A response is a trajectory", body: "The prompt and generated prefix form the state, the next token is an action, and the completed response is a trajectory. A preference score or verifier often arrives only after the final token, creating a long credit-assignment problem." },
      { title: "Pretraining learns a distribution", body: "Next-token prediction learns patterns in a large corpus. It can acquire knowledge and capabilities, but the objective does not directly say which answer is helpful, honest, safe, or aligned with a particular instruction." },
      { title: "SFT imitates demonstrations", body: "Supervised fine-tuning maximizes likelihood of curated responses. It teaches formats and behavior present in demonstrations, but it does not compare alternative outputs or explore responses beyond the demonstration set." },
      { title: "RL optimizes a sequence-level consequence", body: "A policy samples responses, receives a learned or verifiable score, and changes token probabilities to increase expected score. This is useful when quality is easier to compare or verify than to demonstrate token by token." },
    ],
    examples: [
      { title: "Helpful answer formatting", setup: "A demonstration shows a concise answer with a table.", steps: ["SFT observes the desired response", "Cross-entropy increases probability of its tokens", "No alternative answer is scored"], result: "This is imitation, not reinforcement learning." },
      { title: "Code answer with tests", setup: "The model samples four programs and a test suite scores each completed program.", steps: ["Each program is a token trajectory", "The verifier returns pass or fail", "Policy probabilities shift toward trajectories that pass"], result: "This is sequence-level RL with a verifiable terminal reward." },
    ],
    formulas: [{ latex: "\\mathcal{L}_{SFT}=-\\sum_t \\log \\pi_\\theta(y_t\\mid x,y_{<t})", read: "SFT minimizes negative log probability of each demonstrated token", meaning: "The target token is supplied by the dataset. An RL objective instead scores sampled trajectories by their consequences." }],
    misconception: "Post-training is not a synonym for RL. Instruction tuning can be purely supervised, preference optimization can avoid online rollouts, and only some stages fit the interaction-and-reward loop directly.",
    transfer: { question: "A dataset contains one expert response per prompt and training only copies those responses. Where are the environment and reward?", answer: "They are absent from the training loop. This is supervised imitation. It may initialize an RL policy, but the update itself does not sample actions and optimize their observed consequences." },
    nextReason: "Now follow the classic RLHF pipeline from comparisons to a learned reward and a constrained policy update.",
    references: [{ label: "InstructGPT: Training language models to follow instructions with human feedback", url: "https://arxiv.org/abs/2203.02155" }],
  },
  {
    id: "llm-rlhf",
    stage: "LLM reinforcement learning",
    title: "RLHF under the microscope",
    subtitle: "Preference data, reward models, PPO, KL control, and credit assignment.",
    openingQuestion: "Humans can rank two complete answers, but cannot provide a reward for every token. How does one comparison train billions of token decisions?",
    prerequisites: ["llm-post-training"],
    outcome: "You can trace the full PPO-style RLHF pipeline, derive the reward-model probability, and explain why a reference policy and KL penalty are used.",
    story: "Classic RLHF converts human comparisons into a scalar reward model, then treats the language model as a policy. The policy samples whole responses, the reward model scores them, a critic estimates expected return, and PPO updates token probabilities while discouraging excessive drift from a reference model.",
    concepts: [
      { title: "Comparisons become a reward model", body: "Annotators choose a preferred response for the same prompt. A reward model learns a scalar score whose difference predicts that choice. The score is an inferred proxy, not a direct measurement of human values." },
      { title: "The LLM is a token policy", body: "At each prefix, the policy selects the next token. Reward is often sparse and terminal, so an advantage estimate must assign response-level quality back across many token actions." },
      { title: "PPO reuses on-policy rollouts cautiously", body: "Responses are sampled from a frozen old policy. PPO compares new and old token probabilities and clips the ratio so one batch cannot push the policy arbitrarily far." },
      { title: "KL control protects a reference behavior", body: "A KL penalty discourages moving too far from the SFT or reference model. It reduces reward-model exploitation and language degradation, but it also limits how much new behavior can be learned." },
      { title: "Four models may coexist", body: "A practical PPO pipeline can hold the trainable policy, frozen reference policy, reward model, and value model. This makes RLHF expensive in memory, rollout generation, and synchronization." },
    ],
    examples: [
      { title: "Pairwise helpfulness ranking", setup: "For one prompt, a reviewer prefers answer A over answer B.", steps: ["Reward model emits r(A) and r(B)", "A Bradley–Terry loss increases r(A)-r(B)", "Later, unseen answers receive predicted scores"], result: "A binary preference becomes a reusable—but fallible—scalar reward." },
      { title: "Overly verbose policy", setup: "The reward model has a hidden preference for longer answers.", steps: ["Policy discovers that length raises predicted reward", "Responses become verbose without becoming more useful", "KL control and held-out human evaluation expose the shortcut"], result: "RL optimizes the learned proxy, including its mistakes." },
    ],
    formulas: [
      { latex: "P(y_w\\succ y_l\\mid x)=\\sigma(r_\\phi(x,y_w)-r_\\phi(x,y_l))", read: "the preferred answer should receive a higher reward score than the rejected answer", meaning: "Only score differences matter to the pairwise model; calibration outside the comparison distribution is not guaranteed." },
      { latex: "J(\\theta)=\\mathbb{E}_{y\\sim\\pi_\\theta}[r_\\phi(x,y)-\\beta D_{KL}(\\pi_\\theta\\|\\pi_{ref})]", read: "maximize learned reward while paying a penalty for drifting from the reference policy", meaning: "Beta sets the tradeoff between preference optimization and staying near trusted language behavior." },
    ],
    misconception: "A reward model is not a human in a box. It generalizes from finite comparisons, inherits annotator and sampling biases, and can be exploited precisely because the policy searches harder than the data collection process did.",
    transfer: { question: "Why not optimize the reward model score without a reference-policy constraint?", answer: "The policy can move into response regions where the reward model has little evidence and exploit spurious features. KL control does not solve the problem, but it narrows the search and helps preserve language quality." },
    nextReason: "PPO-style RLHF is not the only way to learn from preferences; direct objectives change the data and optimization loop.",
    references: [{ label: "InstructGPT RLHF pipeline", url: "https://arxiv.org/abs/2203.02155" }],
  },
  {
    id: "llm-preference",
    stage: "LLM reinforcement learning",
    title: "Direct preference learning and AI feedback",
    subtitle: "DPO, offline preference data, online RL, RLAIF, and what is lost without exploration.",
    openingQuestion: "Can a model learn from preferred and rejected answers without training a separate reward model and running PPO?",
    prerequisites: ["llm-rlhf"],
    outcome: "You can derive the intuition behind DPO, distinguish offline preference optimization from online RL, and evaluate when AI-generated feedback helps or amplifies evaluator bias.",
    story: "DPO rewrites a KL-regularized preference objective as a classification loss on response pairs. It is simpler than PPO-style RLHF, but its data are usually fixed: the policy cannot discover and label new failure modes unless the collection loop is refreshed.",
    concepts: [
      { title: "DPO compares relative policy shifts", body: "For a preferred and rejected response, DPO increases the preferred response’s log-probability relative to a reference more than it increases the rejected response’s. No explicit scalar reward model is required." },
      { title: "Offline data bounds what can be learned", body: "A fixed preference dataset covers responses generated by earlier policies. DPO is stable and efficient, but it cannot automatically explore new answers and request feedback on them." },
      { title: "Online RL closes the feedback loop", body: "Online methods sample from the current policy, score new outputs, and update on the changing distribution. This can improve beyond static data but makes reward reliability and training stability more demanding." },
      { title: "RLAIF scales evaluation, not truth", body: "An AI judge can produce preferences cheaply and consistently under a written rubric. It can also share blind spots with the policy, prefer style over substance, or be manipulated by the candidate response." },
      { title: "Preference data encode a population", body: "Agreement, annotator expertise, prompt distribution, and tie handling define the target. A single consensus score can erase legitimate plural values." },
    ],
    examples: [
      { title: "One preferred pair", setup: "The reference model assigns similar probability to a concise correct answer and a fluent wrong answer.", steps: ["Dataset marks the correct answer preferred", "DPO increases its relative log-ratio", "The rejected answer’s relative ratio falls"], result: "The policy learns the comparison directly without a separate reward-model inference step." },
      { title: "AI constitution", setup: "A judge model compares two answers using an explicit set of safety principles.", steps: ["Generate candidate answers", "Judge each pair against the principles", "Train on AI-produced preferences and audit with humans"], result: "RLAIF can scale a specified rubric, but human audits are still needed for shared failure modes." },
    ],
    formulas: [{ latex: "\\mathcal{L}_{DPO}=-\\log\\sigma\\left(\\beta\\left[\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)}-\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}\\right]\\right)", read: "make the preferred response improve relative to the reference more than the rejected response", meaning: "The reference policy anchors the comparison; beta controls how strongly the policy is pushed away from it." }],
    misconception: "DPO is not ‘PPO but easier’ in every operational sense. It solves a related preference objective under particular assumptions and a fixed dataset; it does not provide the same online exploration loop.",
    transfer: { question: "When should you refresh a DPO preference dataset?", answer: "When the new policy produces outputs outside the old dataset’s coverage or reveals new failure modes. Collecting comparisons from the current policy reduces the gap between training data and deployed behavior." },
    nextReason: "Preference rewards are subjective proxies; reasoning tasks introduce programmatic verifiers and a different RL regime.",
    references: [
      { label: "Direct Preference Optimization", url: "https://arxiv.org/abs/2305.18290" },
      { label: "Constitutional AI and RLAIF", url: "https://arxiv.org/abs/2212.08073" },
    ],
  },
  {
    id: "llm-reasoning",
    stage: "LLM reinforcement learning",
    title: "RL for reasoning and verifiable outcomes",
    subtitle: "RLVR, outcome versus process rewards, GRPO, test-time compute, and reward hacking.",
    openingQuestion: "If a math answer can be checked automatically, what exactly does RL teach that supervised solutions do not?",
    prerequisites: ["llm-preference", "policy-learning"],
    outcome: "You can explain RL with verifiable rewards, group-relative advantages, process supervision, and why longer reasoning is neither the objective nor proof of better reasoning.",
    story: "Math, code, and formal tasks can return objective success signals. RL can sample many solution trajectories, reinforce strategies that pass a verifier, and improve beyond a fixed demonstration set. The difficulty moves from subjective preference labeling to verifier coverage and credit assignment.",
    concepts: [
      { title: "RLVR uses a programmatic outcome", body: "A unit test, exact answer checker, theorem verifier, or simulator can score a completed trajectory. Rewards are scalable and precise within the verifier’s scope, but anything the verifier omits becomes exploitable." },
      { title: "Outcome and process rewards answer different questions", body: "Outcome supervision asks whether the final answer is correct. Process supervision evaluates intermediate steps and can localize mistakes, but step labels or process reward models are expensive and can constrain valid unconventional reasoning." },
      { title: "GRPO uses peers as a baseline", body: "For several responses to the same prompt, rewards are normalized within the group. Responses better than their peers receive positive advantages, reducing the need for a separate learned value model." },
      { title: "Train-time and test-time compute are distinct", body: "More RL samples during training can change the policy. More reasoning samples, search, or verification at inference spends test-time compute without changing parameters. Both can improve measured performance through different mechanisms." },
      { title: "Verifiable does not mean unhackable", body: "A model can exploit weak tests, output formatting, judge prompts, or benchmark leakage. Hold out verifiers, inspect trajectories, diversify tasks, and measure generalization rather than reward alone." },
      { title: "Distillation is not the same as RL", body: "A smaller model can imitate reasoning traces from a stronger policy through supervised learning. This transfers behavior from generated data but does not itself optimize sampled outcomes." },
    ],
    examples: [
      { title: "Code generation with hidden tests", setup: "Eight sampled programs receive binary reward from a private test suite.", steps: ["Group programs by prompt", "Normalize pass/fail rewards within the group", "Increase likelihood of tokens in above-average programs"], result: "The policy learns solution patterns from verifiable outcomes without a subjective reward model." },
      { title: "Correct answer, broken reasoning", setup: "A math response reaches the right number through an invalid intermediate claim.", steps: ["Outcome checker returns success", "A process verifier flags the invalid step", "Compare whether the task needs correctness only or trustworthy derivations"], result: "Outcome and process supervision can disagree; the right signal depends on the acceptance goal." },
    ],
    formulas: [{ latex: "A_i=\\frac{r_i-\\operatorname{mean}(r_1,\\ldots,r_G)}{\\operatorname{std}(r_1,\\ldots,r_G)+\\epsilon}", read: "a response’s advantage is its reward relative to other responses for the same prompt", meaning: "Group-relative normalization supplies a local baseline; it does not prove the reward itself measures the intended capability." }],
    misconception: "RL for reasoning does not simply reward ‘thinking longer.’ It rewards trajectories that score well under a verifier. Longer chains can help, waste compute, or hide errors; length is an observed behavior, not the intended objective.",
    transfer: { question: "A coding model learns to print a hard-coded answer that passes public tests. Is RLVR working?", answer: "The optimizer is working, but the verifier is incomplete. Use hidden and adversarial tests, vary instances, inspect solutions, and evaluate on held-out distributions so reward correlates with genuine problem solving." },
    nextReason: "Finally combine these LLM lessons with offline data, safety constraints, robust evaluation, and deployment evidence.",
    references: [
      { label: "DeepSeekMath and GRPO", url: "https://arxiv.org/abs/2402.03300" },
      { label: "DeepSeek-R1 and reasoning RL", url: "https://arxiv.org/abs/2501.12948" },
      { label: "Process supervision: Let’s Verify Step by Step", url: "https://arxiv.org/abs/2305.20050" },
    ],
  },
  {
    id: "real-world-practice",
    stage: "Practice and boundaries",
    title: "RL outside the clean simulator",
    subtitle: "Offline data, partial observability, hierarchy, multi-agent systems, safety, evaluation, and RLHF.",
    openingQuestion: "A policy scores highly in one simulator seed. What evidence would make you trust it in the real world?",
    prerequisites: ["control", "deep-value", "policy-learning", "continuous-and-models", "llm-reasoning"],
    outcome: "You can identify the main failure boundary in a real project, select a safer learning setup, and design an evaluation that is harder to game.",
    story: "Real deployments add constraints that textbook environments hide: logged data may miss important actions, observations may be incomplete, other agents may adapt, rewards may be proxies, and experiments may be unsafe.",
    concepts: [
      { title: "Offline RL faces distribution shift", body: "The policy may propose actions absent from the dataset, where value estimates are unreliable. Conservative objectives and behavior constraints reduce extrapolation." },
      { title: "Structure changes the problem", body: "Memory addresses partial observability; options and skills add hierarchy; multi-agent learning must handle other learners changing the environment." },
      { title: "Evaluation is part of the algorithm", body: "Use multiple seeds, learning curves, uncertainty intervals, ablations, held-out environments, and safety metrics. Inspect behavior, not only average return." },
      { title: "Human feedback is still a proxy", body: "RLHF learns a reward model from preferences and then optimizes a policy against it. Reward-model errors, annotator disagreement, and distribution shift remain central risks." },
    ],
    examples: [
      { title: "Logged driving data", setup: "The dataset contains careful human driving but almost no recovery from dangerous states.", steps: ["A naive critic extrapolates to unseen maneuvers", "The policy exploits optimistic errors", "Constrain it near supported actions and test off-distribution cases"], result: "High estimated value is not evidence of safe behavior outside dataset support." },
      { title: "Preference-tuned assistant", setup: "Humans choose the better of two responses and a reward model learns those preferences.", steps: ["Collect paired judgments", "Train a reward model", "Optimize the language policy while monitoring drift"], result: "RLHF is a pipeline of learned proxies, not direct access to human values." },
    ],
    formulas: [{ latex: "\\text{evidence}=\\text{return}+\\text{safety}+\\text{robustness}+\\text{uncertainty}", read: "deployment evidence combines performance with safety, robustness, and uncertainty", meaning: "This is a checklist, not a theorem: a single mean score is never the whole acceptance case." }],
    misconception: "A benchmark win is not deployment proof. Results can depend on seeds, wrappers, reward scales, hidden evaluation choices, and simulator assumptions that do not survive contact with reality.",
    transfer: { question: "A reward-optimized support bot closes tickets quickly by ending conversations early. What failed?", answer: "The reward was a gameable proxy. Add outcome and quality measures, inspect trajectories, test adversarial cases, and keep human review around high-impact decisions." },
    nextReason: "Return to the map and choose a path based on what is known, what can be sampled, and what must remain safe.",
  },
] as const;

const zhLessons: readonly Lesson[] = [
  {
    id: "before-rl", stage: "起点", title: "学 RL 之前：这到底是哪一类问题？", subtitle: "先看决策与后果，不从符号开始。",
    openingQuestion: "恒温器、棋类程序和图片分类器都在计算，哪一种真的需要强化学习？", prerequisites: [],
    outcome: "你能判断什么时候 RL 是合适的问题框架，也能识别什么时候监督学习、搜索或固定规则更简单。",
    story: "想象你在教小狗进门前等待。你没法给出每一毫秒正确的肌肉动作，只能让它行动、观察后果，再用结果塑造行为。RL 研究的就是这种反复决策的闭环。",
    concepts: [
      { title: "动作必须改变之后会发生什么", body: "当一次动作会影响后续处境时，RL 才真正有意义。如果每次预测彼此独立，监督学习通常更直接。" },
      { title: "系统不会把正确动作直接告诉我们", body: "学习者得到的是结果，而不是完整答案。它需要自己发现哪种行为会带来更好的长期后果。" },
      { title: "反馈可能很晚才出现", body: "某个动作眼下看不出影响，却可能在很久以后决定结果。信用分配就是把延迟后果连接回更早的选择。" },
    ],
    examples: [
      { title: "垃圾邮件分类", setup: "数据集已经标好了每封邮件是不是垃圾邮件。", steps: ["输入一封邮件", "将预测与标签比较", "更新分类器"], result: "这是监督学习：每个样本都有正确目标。" },
      { title: "仓库机器人", setup: "机器人反复选择路线，而通道拥堵会变化。", steps: ["选择转弯方向", "观察下一条通道和耗时", "继续行动直到送达"], result: "这是自然的 RL 问题，因为当前选择会改变未来选择，最终延误是一路累积出来的。" },
    ], formulas: [],
    misconception: "RL 不是简单的“带奖励数字的机器学习”。真正重要的是动作会连续影响未来，而且系统没有为每个动作准备标准答案。",
    transfer: { question: "一个医疗模型根据历史病例推荐一次性治疗，是否天然需要 RL？", answer: "不一定。如果只有一次决策，而且结果标签可靠，因果估计或监督预测可能足够。只有当治疗形成序列、今天的动作会改变明天的状态时，RL 才更相关。" },
    nextReason: "接下来定义最小的交互闭环，让连续决策问题变得精确。",
  },
  {
    id: "interaction-loop", stage: "起点", title: "交互闭环", subtitle: "智能体、环境、观察、动作、奖励，然后重复。",
    openingQuestion: "送货机器人能看到摄像头画面，到达目的地会得到 +1；在它开始学习之前，还缺什么？", prerequisites: ["before-rl"],
    outcome: "你能清晰划分智能体与环境，并且描述一次状态转移，不再混淆状态、动作和奖励。",
    story: "学习者从来不是凭空行动。在时刻 t，它先看到信息，再选择动作；环境返回新信息和一个标量奖励。这个闭环就是 RL 的基本语法。",
    concepts: [
      { title: "智能体与环境", body: "智能体是做决定的一方，所有会被决定影响的东西都属于环境。边界可以由建模者选择，但接口必须说清楚。" },
      { title: "观察不一定等于状态", body: "观察是智能体能看到的东西；状态要包含足以预测未来的信息。单帧画面可能看不出速度，因此需要多帧或记忆。" },
      { title: "奖励不等于完整目标", body: "奖励是某一步发出的数字信号，目标则是累积回报。奖励设计得不好，系统会学出我们不想要的行为。" },
    ],
    examples: [
      { title: "两房间送货", setup: "机器人从 A 房间出发，要把物品送到 B 房间。", steps: ["观察：当前房间", "动作：移动或等待", "奖励：每步 -1，送达 +5"], result: "最短的成功路线拥有最大的累积结果。" },
      { title: "部分可观测驾驶", setup: "一张图片显示汽车接近路口。", steps: ["图片显示位置", "它没有显示准确速度", "加入最近几帧或循环记忆"], result: "原始观察并不是完整的马尔可夫状态。" },
    ],
    formulas: [{ latex: "(S_t, A_t, R_{t+1}, S_{t+1})", read: "状态、动作、下一步奖励、下一状态", meaning: "一次转移是可复用的最小经验单元。" }],
    misconception: "环境不一定是物理世界。模拟器、游戏引擎、数据库甚至人，只要会回应智能体的动作，都可以属于环境。",
    transfer: { question: "对语言模型助手来说，什么可以是动作，什么可以是观察？", answer: "动作可以是下一个词元，也可以是工具调用；观察可以包括对话、工具结果和系统状态。具体边界取决于策略到底能控制什么。" },
    nextReason: "单步奖励还不够，我们需要比较完整未来的方法。",
  },
  {
    id: "return-and-time", stage: "基础", title: "跨越时间的目标", subtitle: "回报、折扣、回合与持续任务。",
    openingQuestion: "你会选择现在得到 +4，还是经过三步成本后得到 +5？", prerequisites: ["interaction-loop"],
    outcome: "你能用数字算出回报，并解释折扣因子究竟改变了什么，而不只是把它叫作“急躁”。",
    story: "奖励像每一步的小票，回报才是总账单。RL 算法把一个决定之后发生的奖励合在一起，用它评价行为。",
    concepts: [
      { title: "回报把未来奖励合起来", body: "时刻 t 的回报包含之后的奖励。回合任务会结束；持续任务则需要一种让总和保持有定义的约定。" },
      { title: "折扣控制有效视野", body: "小于 1 的折扣让远期奖励权重更低，也让无限总和保持有限。它实际上决定了智能体看多远。" },
      { title: "真正终止后不再自举", body: "真实终止之后没有下一状态价值可加。要小心时间上限，因为截断不一定等于任务真的结束。" },
    ],
    examples: [
      { title: "短路线", setup: "奖励依次是 -1、-1、+5，折扣为 1。", steps: ["把三个奖励相加", "-1 - 1 + 5", "与其他路线比较"], result: "回报等于 3。" },
      { title: "延迟奖励", setup: "奖励依次是 0、0、+10，折扣为 0.9。", steps: ["第一个奖励：0", "第二个奖励：0.9 × 0", "第三个奖励：0.9² × 10"], result: "从起点看，回报是 8.1。" },
    ],
    formulas: [{ latex: "G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots", read: "回报等于下一步奖励加上经过折扣的后续奖励", meaning: "gamma 控制有效规划视野，但不会改变实际上发生了哪些奖励。" }],
    misconception: "较小的折扣因子不一定表示智能体在心理上更急躁。它可以是数学工具、不确定性的模型，也可以是人为选择的规划范围。",
    transfer: { question: "模拟器只是因为达到 1000 步上限而结束，下一状态价值是否一定要设为零？", answer: "不一定。时间截断可能只是藏住了还会继续的未来，强行归零会带来偏差。只有真实终止状态才必然没有延续价值。" },
    nextReason: "目标已经定义好，接着从最简单的“边试边学”问题开始。",
  },
  {
    id: "bandits", stage: "基础", title: "一次决策，不确定结果", subtitle: "老虎机问题先隔离探索，再引入状态。",
    openingQuestion: "一个选项已经连续三次回报不错，另一个从未试过；下一次该选哪个？", prerequisites: ["return-and-time"],
    outcome: "你能解释探索与利用、估计动作价值，并比较 epsilon-greedy、乐观初始化和 UCB。",
    story: "多臂老虎机在同一种情境里重复做一次选择。它暂时拿掉状态转移，让我们单独看清“弄明白每个动作值多少”要付出什么代价。",
    concepts: [
      { title: "样本平均价值", body: "用选择某动作后观察到的奖励平均值估计它。只有真正采样这个动作时，它的估计才会变化。" },
      { title: "探索有机会成本", body: "尝试不确定动作可能发现更好选项，也可能牺牲眼前奖励。遗憾衡量的是与始终选择未知最优动作之间的差距。" },
      { title: "让不确定性指导尝试", body: "epsilon-greedy 均匀随机探索；UCB 偏向前景好或测试不足的动作；乐观初始化则让早期不确定性体现为偏高估值。" },
    ],
    examples: [
      { title: "咖啡馆菜单", setup: "喝过十次的茶平均 7 分，新饮品还没有数据。", steps: ["利用：继续点茶", "探索：尝试新品", "只更新被选择饮品的估计"], result: "少量探索用短期确定性换取信息。" },
      { title: "变化中的广告", setup: "季节活动之后，点击率发生变化。", steps: ["旧平均值保留过时数据", "改用固定步长", "让最近点击占更大权重"], result: "追踪变化的价值，需要有选择地忘掉一部分历史。" },
    ],
    formulas: [{ latex: "Q_{n+1}(a)=Q_n(a)+\\alpha[R_n-Q_n(a)]", read: "新估计等于旧估计加上步长乘以预测误差", meaning: "括号里是证据减去预期，alpha 决定估计移动多快。" }],
    misconception: "探索不是为了随机而随机，它是在收集信息。好的探索会把尝试集中在那些可能改变未来决策的不确定性上。",
    transfer: { question: "为什么固定 1% 的探索率在尝试一百万次后仍可能很昂贵？", answer: "即使估计已经很精确，它还是会继续随机选择。若环境不再变化，递减探索率或感知不确定性的规则可以减少无意义尝试。" },
    nextReason: "现在加入状态，让今天的动作可以改变明天能做的选择。",
  },
  {
    id: "mdp", stage: "表格推理", title: "连续决策的地图", subtitle: "状态、转移、策略、价值与马尔可夫性质。",
    openingQuestion: "一张地图必须包含哪些信息，最优路线才能被直接算出来，而不是靠试错学出来？", prerequisites: ["interaction-loop", "return-and-time"],
    outcome: "你能读懂一个 MDP，分清策略与价值函数，并判断给定状态是否足够满足马尔可夫性质。",
    story: "马尔可夫决策过程不是算法，而是一份问题合同：每个动作之后可能发生什么，以及如何给结果计分。",
    concepts: [
      { title: "模型预测动作后果", body: "转移模型给出下一状态与奖励的概率。确定性地图只是概率为 1 的特殊情况。" },
      { title: "策略负责选择动作", body: "策略把状态或观察映射到动作分布，它是最终可以被执行的行为。" },
      { title: "价值负责预测未来回报", body: "V 问某策略下一个状态有多好；Q 问先做一个动作、再遵循策略会有多好。价值用来评价，策略用来行动。" },
    ],
    examples: [
      { title: "有风走廊", setup: "向右移动有 80% 成功，20% 会滑向左边。", steps: ["列出两个可能的下一状态", "按概率加权结果", "加上即时奖励与未来价值"], result: "模型必须表示不确定性，而不只是最可能的转移。" },
      { title: "隐藏电量", setup: "机器人位置可见，但电池电量没有记录。", steps: ["同一位置可能导致不同故障", "未来取决于隐藏电量", "把电量加入状态"], result: "对这个任务来说，只有位置不满足马尔可夫假设。" },
    ],
    formulas: [{ latex: "v_\\pi(s)=\\mathbb{E}_\\pi[G_t\\mid S_t=s]", read: "状态价值是在状态 s 按策略 pi 行动时的期望回报", meaning: "这个期望同时平均了策略随机性与环境随机性。" }],
    misconception: "马尔可夫性质不是说世界没有历史，而是说选定的状态表达已经包含了那些仍会影响未来的历史。",
    transfer: { question: "一张截图足以作为移动小球游戏的状态吗？", answer: "通常不够。单帧只显示位置，看不出速度。叠加多帧、显式估计速度或使用循环记忆，可以让表达更接近马尔可夫状态。" },
    nextReason: "如果完整模型已知，我们不必先收集试错数据，就可以直接规划。",
  },
  {
    id: "planning", stage: "表格推理", title: "模型已知时：先规划", subtitle: "贝尔曼备份、策略评估与价值迭代。",
    openingQuestion: "如果每个转移和奖励都已经知道，为什么还要花几千步重新发现它们？", prerequisites: ["mdp"],
    outcome: "你能完成一次贝尔曼备份，并在直接计算、策略迭代、价值迭代与搜索之间作出选择。",
    story: "规划把模型当成一台反事实机器：在计算里尝试动作，把后果向前面的状态传播，再在真实环境行动前改进策略。",
    concepts: [
      { title: "备份让信息向后传播", body: "一个状态的价值由即时奖励和后继状态价值更新。反复备份会让远处奖励逐步传遍地图。" },
      { title: "评估与改进不是一回事", body: "策略评估问固定策略有多好；策略改进则根据价值选择更好的动作。策略迭代在两者之间交替。" },
      { title: "更新顺序会影响速度", body: "同步扫描读取旧价值；异步更新可以立刻复用刚算出的新价值。两者都可能收敛，但速度不同。" },
    ],
    examples: [
      { title: "无环走廊", setup: "每个状态都只能向右，终点奖励已知。", steps: ["从终点前一个状态开始", "算出它的价值", "按依赖顺序向后移动"], result: "一次反向计算就能解出走廊，不需要采样。" },
      { title: "随机网格", setup: "想走的方向偶尔会侧滑。", steps: ["枚举可能后继", "按转移概率加权", "反复扫描直到价值稳定"], result: "期望贝尔曼备份能够处理随机动态。" },
    ],
    formulas: [{ latex: "Q^*(s,a)=\\sum_{s'}p(s'|s,a)[r+\\gamma\\max_{a'}Q^*(s',a')]", read: "最优动作价值是对所有可能后继的即时奖励与最佳未来价值做概率加权", meaning: "模型提供概率，max 提供最优未来行为。" }],
    misconception: "价值迭代不是无模型学习。虽然它也在反复更新，但每次更新使用的是明确已知的模型，而不是从经验里抽到的一次转移。",
    transfer: { question: "一个游戏规则完全已知，但搜索树巨大，是否必须改用无模型 RL？", answer: "不一定。MCTS 等搜索方法会有选择地使用已知模型，只扩展更有希望的树枝，而不是扫描整个状态空间。" },
    nextReason: "模型缺失时，我们就要从亲历的轨迹里估计价值。",
  },
  {
    id: "mc-and-td", stage: "从经验学习", title: "等完整回报，还是提前一步学习", subtitle: "蒙特卡洛、时序差分与偏差—方差权衡。",
    openingQuestion: "必须等一整个回合结束之后，预测才能改进吗？", prerequisites: ["return-and-time", "mdp"],
    outcome: "你能计算 MC 与 TD 目标，解释自举，并根据任务选择目标长度。",
    story: "没有模型时，经验就是老师。MC 等待完整结果；TD 用下一步奖励加当前估计，因此在终点尚未出现时就可以学习。",
    concepts: [
      { title: "MC 使用完整采样回报", body: "它不从当前价值估计自举。在采样策略下目标无偏，但不同回合之间可能波动很大。" },
      { title: "TD 会自举", body: "TD(0) 用当前的下一状态估计替代尚未发生的后半段轨迹。它引入偏差，却通常降低方差，并支持在线学习。" },
      { title: "n 步方法形成连续谱", body: "一步 TD 很快自举，完整回报 MC 一直等待；中间的 n 步目标在计算、偏差和方差之间折中。" },
    ],
    examples: [
      { title: "酒店评价", setup: "旅客只在退房后给整段旅程评分。", steps: ["MC 等最终评分", "把观察到的回报分配给访问状态", "在多次旅程间取平均"], result: "完整回合提供直接但噪声较大的目标。" },
      { title: "通勤延误", setup: "走完一段路后，下一地点已经有延误估计。", steps: ["当前观察到 3 分钟", "查询下一状态估计 12 分钟", "目标为 3 + gamma × 12"], result: "TD 用下一估计自举，因此可以立刻更新。" },
    ],
    formulas: [{ latex: "V(S_t)\\leftarrow V(S_t)+\\alpha[R_{t+1}+\\gamma V(S_{t+1})-V(S_t)]", read: "让旧价值向即时奖励加下一状态价值移动", meaning: "括号里是 TD 误差，也就是相对当前一步预测的意外程度。" }],
    misconception: "自举并不是复制一个已知正确的答案，而是把另一个学出来的估计当作目标的一部分；这种效率也会让误差彼此耦合。",
    transfer: { question: "对于永不自然结束的服务器控制任务，普通回合式 MC 与 TD 哪个更容易使用？", answer: "TD 更合适，因为它每次转移后就能更新，不必等待一个可能永远不会自然结束的回合。" },
    nextReason: "预测只是在评价行为；控制还必须改进产生经验的行为。",
  },
  {
    id: "control", stage: "从经验学习", title: "从预测走向控制", subtitle: "SARSA、Q-learning、探索与异策略目标。",
    openingQuestion: "两个智能体在悬崖边用相同奖励探索，为什么一个可能学出更安全的路线？", prerequisites: ["bandits", "mc-and-td"],
    outcome: "你能计算 SARSA 与 Q-learning 目标，并通过目标中的动作解释同策略与异策略学习。",
    story: "控制要学习动作价值，并用它改进策略。关键选择是：目标评价实际执行的行为，还是评价另一个通常更贪心的策略。",
    concepts: [
      { title: "SARSA 学自己的真实行为", body: "它的目标使用探索策略实际选出的下一动作，因此未来探索带来的风险会进入价值。" },
      { title: "Q-learning 学贪心目标", body: "即使行为仍在探索，它的目标也使用下一状态中的最大动作价值。这就是异策略学习。" },
      { title: "覆盖仍然重要", body: "异策略不代表什么数据都行。重要的状态—动作对仍需充分覆盖，加入函数逼近后还会出现稳定性问题。" },
    ],
    examples: [
      { title: "悬崖行走", setup: "悬崖附近的探索动作偶尔造成巨大惩罚。", steps: ["SARSA 放入真实采样的探索动作", "Q-learning 放入贪心下一动作", "比较最后学出的路线"], result: "SARSA 往往学到更安全路线，Q-learning 则瞄准最短的贪心路线。" },
      { title: "一次数字更新", setup: "奖励 2，gamma 0.9，当前 Q 为 4，下一状态最大 Q 为 6，alpha 0.5。", steps: ["目标 = 2 + 0.9 × 6 = 7.4", "误差 = 7.4 - 4 = 3.4", "新 Q = 4 + 0.5 × 3.4"], result: "更新后的价值是 5.7。" },
    ],
    formulas: [{ latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha[R_{t+1}+\\gamma\\max_a Q(S_{t+1},a)-Q(S_t,A_t)]", read: "Q-learning 让所选动作价值靠近即时奖励加最佳下一动作估计", meaning: "max 让目标保持贪心，即使数据来自探索行为。" }],
    misconception: "异策略不代表智能体从不探索，而是被评价或改进的策略，与生成数据动作的策略不同。",
    transfer: { question: "如果学习过程中的安全也很重要，使用贪心目标的 Q-learning 是否天然最好？", answer: "不是。这个目标可能忽略真实探索行为的代价。同策略评价、约束、安全屏蔽或更安全的数据收集方式可能更合适。" },
    nextReason: "当状态很多或连续时，表格会失效，价值必须能够泛化。",
  },
  {
    id: "deep-value", stage: "扩大规模", title: "从表格到深度价值函数", subtitle: "函数逼近、DQN、经验回放与目标网络。",
    openingQuestion: "为什么不能每得到一个新转移就训练神经网络，并立刻用它自己的最新预测当目标？", prerequisites: ["control"],
    outcome: "你能解释 DQN 的稳定性问题，以及经验回放、目标网络、Double DQN 与表示学习各自承担的工作。",
    story: "表格把每个状态分开记忆；函数逼近器共享参数，让相似状态共享证据。这种能力也会把许多预测的误差耦合起来。",
    concepts: [
      { title: "用泛化代替查表", body: "神经网络把观察映射为动作价值。一次更新会改变许多状态的预测，包括这批数据里没有出现的状态。" },
      { title: "回放改变数据流", body: "经验回放复用旧转移，并用相关性较低的顺序抽样。它提高数据效率，同时也决定哪些经验被记住。" },
      { title: "目标网络放慢移动目标", body: "DQN 用延迟更新的价值网络副本计算目标。Double DQN 分开动作选择与价值评估，以降低过度估计。" },
    ],
    examples: [
      { title: "相邻像素", setup: "两张游戏画面只差一个像素，却表示同一局势。", steps: ["表格把它们当作无关键值", "网络提取共享特征", "两个画面得到相近 Q 值"], result: "函数逼近可以在观察之间泛化。" },
      { title: "高度相关的驾驶帧", setup: "连续视频帧几乎完全一样。", steps: ["在线更新只看到很窄的状态片段", "回放混合新旧转移", "目标网络变化得更慢"], result: "回归数据相关性降低，目标也不再追着自己快速移动。" },
    ],
    formulas: [{ latex: "L(\\theta)=\\mathbb{E}[(r+\\gamma\\max_{a'}Q_{\\theta^-}(s',a')-Q_\\theta(s,a))^2]", read: "最小化当前 Q 与延迟贝尔曼目标之间的平方误差", meaning: "theta 正在学习，theta-minus 暂时固定，用来稳定目标。" }],
    misconception: "经验回放和目标网络并不能让深度 Q 学习在所有问题上稳定。分布偏移、稀疏奖励、探索不足和致命三元组仍会导致失败。",
    transfer: { question: "为什么普通 DQN 不适合直接输出方向盘角度？", answer: "DQN 要在离散动作列表中取最大值。把连续角度切成足够细的离散动作会产生巨大列表，更适合使用直接输出连续动作的策略。" },
    nextReason: "除了从价值间接得到行为，我们也可以直接优化策略。",
  },
  {
    id: "policy-learning", stage: "扩大规模", title: "直接学习策略", subtitle: "策略梯度、基线、Actor–Critic、GAE 与 PPO。",
    openingQuestion: "如果动作连续，或者最佳行为必须保留随机性，为什么还要先学每个动作的价值？", prerequisites: ["mc-and-td", "deep-value"],
    outcome: "你能追踪一次策略梯度更新，解释优势估计的作用，并说清 PPO 的裁剪目标想防止什么。",
    story: "参数化策略直接产生动作。带来好结果的采样动作会变得更可能，带来坏结果的会变得不可能；评论家提供方差更低的学习信号。",
    concepts: [
      { title: "对数概率把结果变成方向", body: "策略对数概率的梯度指向“让采样动作更可能”。再乘上回报或优势，就决定更新方向与强度。" },
      { title: "基线降低方差", body: "减去期望价值后得到优势：结果比预期更好还是更差。学习出来的评论家负责估计这个基线。" },
      { title: "PPO 限制突然的大步变化", body: "概率比比较新旧策略；裁剪会阻止一个批次把行为推得过远，但它并不是严格的安全保证。" },
    ],
    examples: [
      { title: "有偏硬币策略", setup: "策略以 0.6 概率选择左，而这次选择左得到正优势。", steps: ["采样到左", "计算出正优势", "提高左动作的对数概率"], result: "更新后策略会稍微更常选择左。" },
      { title: "交通灯 Actor–Critic", setup: "Actor 选择绿灯时长，Critic 预测未来拥堵。", steps: ["Actor 采样一个时长", "环境返回队列变化", "Critic 形成优势估计"], result: "Actor 根据结果是否好于预期来学习。" },
    ],
    formulas: [{ latex: "\\nabla_\\theta J(\\theta)=\\mathbb{E}[\\nabla_\\theta\\log\\pi_\\theta(a|s)\\,A(s,a)]", read: "按动作对数概率梯度乘以优势来改变策略参数", meaning: "正优势强化采样动作，负优势抑制采样动作。" }],
    misconception: "PPO 不是天然最好的 RL 算法，裁剪也不保证性能单调提升。环境结构、采样成本、动作空间和实现细节仍决定它是否合适。",
    transfer: { question: "为什么谈判或博弈中的最佳动作可能不应该是确定性的？", answer: "可预测的行为可能被对手利用，而且多个动作都可能有价值。随机策略可以直接表达这种有意的不确定性，而不是事后再加噪声。" },
    nextReason: "连续控制与学习世界模型，会揭示下一组关键设计选择。",
  },
  {
    id: "continuous-and-models", stage: "扩大规模", title: "连续控制与学出来的世界", subtitle: "DDPG、TD3、SAC、Dyna、MPC、MCTS 与世界模型。",
    openingQuestion: "智能体应该学习该做什么，学习世界接下来会怎样，还是两者都学？", prerequisites: ["policy-learning", "planning"],
    outcome: "你能把主要连续控制与基于模型方法放在同一张地图上，并解释它们的核心权衡。",
    story: "连续动作让短列表上的 max 不再容易。基于模型的方法则增加了一条路：预测未来动态，再用这些预测做规划或生成额外学习经验。",
    concepts: [
      { title: "连续 Actor 直接输出动作", body: "DDPG 与 TD3 学确定性 Actor；TD3 使用两个 Critic，并延迟 Actor 更新。SAC 学随机策略，同时奖励任务回报与熵。" },
      { title: "模型可以规划，也可以造数据", body: "MPC 从当前状态做短视野重规划；Dyna 混合真实与模拟转移；MCTS 有选择地构造搜索树。" },
      { title: "模型误差会逐步累积", body: "学出来的世界模型可能想象出不可能的未来。短视野、不确定性估计、模型集合与频繁重规划能限制对模型错误的利用。" },
    ],
    examples: [
      { title: "机械臂", setup: "每个关节力矩都是连续数字。", steps: ["Actor 输出力矩向量", "Critic 为状态—动作打分", "策略沿 Critic 梯度或熵目标更新"], result: "连续策略避免枚举数百万个离散动作。" },
      { title: "模型预测驾驶", setup: "学习模型为候选转向序列预测未来几个位置。", steps: ["模拟短期候选未来", "只执行最佳序列的第一个动作", "观察真实结果并重新规划"], result: "频繁重规划限制了长期模型误差造成的损害。" },
    ],
    formulas: [{ latex: "J_{SAC}=\\mathbb{E}[\\sum_t r_t+\\alpha\\mathcal{H}(\\pi(\\cdot|s_t))]", read: "SAC 最大化奖励加上经过权重的策略熵", meaning: "熵鼓励策略保持有用的随机性，alpha 控制两者权衡。" }],
    misconception: "基于模型的 RL 在实践中不一定更省样本。如果模型在影响决策的区域里是错的，规划会非常自信地做出有害选择。",
    transfer: { question: "什么时候短视野 MPC 比一次很长的想象轨迹更合适？", answer: "当模型误差随视野增长时。每次只执行一步，观察真实下一状态，再反复重规划，可以不断把预测锚定回现实。" },
    nextReason: "最后处理数据边界、安全、评估与人类目标。",
  },
  {
    id: "llm-post-training", stage: "LLM 强化学习", title: "RL 在大模型训练流程中出现在哪里", subtitle: "预训练、监督微调与后训练解决的是不同问题。",
    openingQuestion: "一个语言模型已经能很好地预测下一个词元，为什么它仍可能不听用户指令？", prerequisites: ["policy-learning"],
    outcome: "你能把语言生成映射成 RL 轨迹，并根据每个阶段使用的学习信号，区分预训练、SFT、奖励建模与策略优化。",
    story: "LLM 最初是下一词元预测器，后训练把这个广泛预测器变成助手。有些阶段模仿示范，有些 RL 阶段优化整个回答的后果。把所有后训练都叫 RLHF，会掩盖真正提供学习信号的机制。",
    concepts: [
      { title: "一个回答就是一条轨迹", body: "提示词与已生成前缀构成状态，下一个词元是动作，完整回答是一条轨迹。偏好分或验证器常常只在最后一个词元之后给分，因此形成很长的信用分配问题。" },
      { title: "预训练学习数据分布", body: "下一词元预测从大规模语料中学习规律，可以获得知识和能力，但这个目标不会直接说明什么答案更有帮助、更诚实、更安全，或更符合某条指令。" },
      { title: "SFT 模仿示范", body: "监督微调最大化精选回答的似然。它能教会示范里出现的格式与行为，但不会比较多个候选，也不会探索示范数据之外的回答。" },
      { title: "RL 优化序列级后果", body: "策略采样完整回答，得到学习型或可验证分数，再调整词元概率以提高期望得分。当质量容易比较或验证，却难以逐词示范时，这很有价值。" },
    ],
    examples: [
      { title: "模仿有帮助的回答格式", setup: "一条示范回答简洁，并使用了表格。", steps: ["SFT 读取目标回答", "交叉熵提高这些目标词元的概率", "没有任何替代回答被评分"], result: "这是模仿学习，不是强化学习。" },
      { title: "带测试的代码回答", setup: "模型采样四段程序，测试套件为每段完整程序评分。", steps: ["每段程序是一条词元轨迹", "验证器返回通过或失败", "策略把概率移向通过测试的轨迹"], result: "这是使用可验证终局奖励的序列级 RL。" },
    ],
    formulas: [{ latex: "\\mathcal{L}_{SFT}=-\\sum_t \\log \\pi_\\theta(y_t\\mid x,y_{<t})", read: "SFT 最小化每个示范词元的负对数概率", meaning: "目标词元由数据集直接给出；RL 目标则根据采样轨迹的后果打分。" }],
    misconception: "后训练不等于 RL。指令微调可以完全是监督学习，偏好优化也可能不做在线采样；只有一部分阶段直接符合“交互—奖励”的闭环。",
    transfer: { question: "一个数据集每个提示只有一条专家回答，训练过程只复制这些回答。环境和奖励在哪里？", answer: "这个训练闭环里没有环境与奖励，它是监督模仿。它可以初始化之后的 RL 策略，但这次更新本身没有采样动作并优化观察到的后果。" },
    nextReason: "接着沿经典 RLHF 流程，看比较数据如何变成奖励，再变成受约束的策略更新。",
    references: [{ label: "InstructGPT：使用人类反馈训练指令遵循模型", url: "https://arxiv.org/abs/2203.02155" }],
  },
  {
    id: "llm-rlhf", stage: "LLM 强化学习", title: "把 RLHF 拆开看", subtitle: "偏好数据、奖励模型、PPO、KL 约束与信用分配。",
    openingQuestion: "人只能比较两个完整回答，却无法给每个词元奖励；一次比较怎样训练几十亿次词元决策？", prerequisites: ["llm-post-training"],
    outcome: "你能追踪完整的 PPO 式 RLHF 流程，推导奖励模型的偏好概率，并解释为什么需要参考策略与 KL 惩罚。",
    story: "经典 RLHF 先把人类比较变成标量奖励模型，再把语言模型当作策略。策略采样完整回答，奖励模型评分，Critic 估计期望回报，PPO 调整词元概率，同时抑制策略远离参考模型。",
    concepts: [
      { title: "比较数据变成奖励模型", body: "标注者对同一提示选择更好的回答。奖励模型学习标量分数，让分数差能够预测选择结果。这个分数是学出来的代理，不是人类价值的直接测量。" },
      { title: "LLM 是逐词元策略", body: "在每个前缀上，策略选择下一个词元。奖励通常稀疏且只在结尾出现，因此优势估计必须把整段回答的质量分回许多词元动作。" },
      { title: "PPO 谨慎复用同策略轨迹", body: "先用冻结的旧策略采样回答，再比较新旧策略对词元的概率。概率比裁剪阻止一个批次把策略推得过远。" },
      { title: "KL 约束保护参考行为", body: "KL 惩罚阻止策略远离 SFT 或参考模型，可以降低奖励模型利用与语言退化，但同时也限制能学到多少新行为。" },
      { title: "训练时可能同时存在四个模型", body: "实际 PPO 流程可能同时保存可训练策略、冻结参考策略、奖励模型与价值模型，因此内存、生成采样与同步成本都很高。" },
    ],
    examples: [
      { title: "一对有帮助性排序", setup: "同一提示下，评审更喜欢回答 A 而不是回答 B。", steps: ["奖励模型输出 r(A) 与 r(B)", "Bradley–Terry 损失拉大 r(A)-r(B)", "之后对未见回答给出预测分数"], result: "一个二元偏好被转成可复用、但并不可靠的标量奖励。" },
      { title: "过度啰嗦的策略", setup: "奖励模型暗中偏爱更长的回答。", steps: ["策略发现长度能提高预测奖励", "回答越来越长，却没有更有用", "KL 约束与留出的人类评估暴露捷径"], result: "RL 会连同代理模型的错误一起优化。" },
    ],
    formulas: [
      { latex: "P(y_w\\succ y_l\\mid x)=\\sigma(r_\\phi(x,y_w)-r_\\phi(x,y_l))", read: "偏好回答的奖励分应该高于被拒回答", meaning: "成对模型只依赖分数差，超出比较数据分布后并不保证校准。" },
      { latex: "J(\\theta)=\\mathbb{E}_{y\\sim\\pi_\\theta}[r_\\phi(x,y)-\\beta D_{KL}(\\pi_\\theta\\|\\pi_{ref})]", read: "最大化学习型奖励，同时为偏离参考策略付出代价", meaning: "beta 控制偏好优化与保留可信语言行为之间的权衡。" },
    ],
    misconception: "奖励模型不是“装在盒子里的人”。它只从有限比较中泛化，会继承标注者与采样偏差，而且策略的搜索强度超过原始数据收集过程时，尤其容易找到漏洞。",
    transfer: { question: "为什么不能不加参考策略约束，直接把奖励模型分数优化到最高？", answer: "策略会进入奖励模型缺少证据的回答区域，利用虚假特征。KL 不能彻底解决问题，但能缩小搜索范围，并帮助保留语言质量。" },
    nextReason: "PPO 式 RLHF 不是学习偏好的唯一方法；直接目标会改变数据与优化闭环。",
    references: [{ label: "InstructGPT 的 RLHF 流程", url: "https://arxiv.org/abs/2203.02155" }],
  },
  {
    id: "llm-preference", stage: "LLM 强化学习", title: "直接偏好学习与 AI 反馈", subtitle: "DPO、离线偏好数据、在线 RL、RLAIF，以及缺少探索会失去什么。",
    openingQuestion: "能否不用单独训练奖励模型、也不运行 PPO，就从偏好与被拒回答中学习？", prerequisites: ["llm-rlhf"],
    outcome: "你能推导 DPO 的直觉，区分离线偏好优化与在线 RL，并判断 AI 反馈何时能扩展监督、何时会放大评估者偏差。",
    story: "DPO 把带 KL 约束的偏好目标改写成回答对上的分类损失。它比 PPO 式 RLHF 简单，但数据通常是固定的：除非重新采集，策略不会主动发现并标注新的失败模式。",
    concepts: [
      { title: "DPO 比较相对策略变化", body: "对一条偏好回答和一条被拒回答，DPO 让偏好回答相对于参考模型的对数概率增幅更大，不需要显式训练标量奖励模型。" },
      { title: "离线数据限制了可学习范围", body: "固定偏好集覆盖的是旧策略生成的回答。DPO 稳定且高效，却不会自动探索新回答并请求新的反馈。" },
      { title: "在线 RL 重新闭合反馈环", body: "在线方法从当前策略采样，用评估器给新输出评分，再针对不断变化的分布更新。这可能超越静态数据，也更考验奖励可靠性与训练稳定性。" },
      { title: "RLAIF 扩展的是评估规模，不是真理", body: "AI 评审可以按书面准则廉价且一致地产生偏好，也可能与被训练策略共享盲点、偏爱形式而非事实，甚至被候选回答操纵。" },
      { title: "偏好数据代表某一群人", body: "一致率、标注者专业度、提示分布与平局处理共同定义学习目标。压成一个共识分数，可能抹掉合理存在的多元价值。" },
    ],
    examples: [
      { title: "一组偏好数据", setup: "参考模型给简洁正确回答和流畅错误回答近似概率。", steps: ["数据标记正确回答为偏好项", "DPO 提高它相对参考的对数比", "被拒回答的相对比下降"], result: "策略直接学习比较，不需要单独运行奖励模型推理。" },
      { title: "AI 宪法评审", setup: "评审模型根据一组明确安全原则比较两个回答。", steps: ["生成候选回答", "按原则判断每一对", "用 AI 偏好训练，并由人类抽查"], result: "RLAIF 能扩展明确准则，但仍需人工发现共享失败模式。" },
    ],
    formulas: [{ latex: "\\mathcal{L}_{DPO}=-\\log\\sigma\\left(\\beta\\left[\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)}-\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}\\right]\\right)", read: "让偏好回答相对参考模型的提升超过被拒回答", meaning: "参考策略固定比较锚点，beta 控制策略被推离参考的强度。" }],
    misconception: "DPO 不是在所有操作意义上都等于“更简单的 PPO”。它在特定假设与固定数据下求解相关偏好目标，但不具备同样的在线探索闭环。",
    transfer: { question: "什么时候应该刷新 DPO 偏好数据集？", answer: "当新策略开始产生旧数据没有覆盖的回答，或暴露新的失败模式时。用当前策略重新采样并比较，可以缩小训练数据与部署行为之间的差距。" },
    nextReason: "偏好奖励仍是主观代理；推理任务则可以使用程序化验证器，形成另一种 RL。",
    references: [
      { label: "Direct Preference Optimization", url: "https://arxiv.org/abs/2305.18290" },
      { label: "Constitutional AI 与 RLAIF", url: "https://arxiv.org/abs/2212.08073" },
    ],
  },
  {
    id: "llm-reasoning", stage: "LLM 强化学习", title: "面向推理与可验证结果的 RL", subtitle: "RLVR、结果与过程奖励、GRPO、测试时计算与奖励黑客。",
    openingQuestion: "如果数学答案可以自动检查，RL 能教会什么，是监督学习现成解答教不会的？", prerequisites: ["llm-preference", "policy-learning"],
    outcome: "你能解释可验证奖励 RL、组相对优势与过程监督，也能说明为什么更长的推理既不是目标，也不是推理更好的证据。",
    story: "数学、代码和形式化任务可以返回客观成功信号。RL 能采样许多解题轨迹，强化通过验证器的策略，并超越固定示范集。难点从主观偏好标注转移到验证器覆盖与信用分配。",
    concepts: [
      { title: "RLVR 使用程序化结果", body: "单元测试、精确答案检查、定理验证器或模拟器可以给完整轨迹评分。奖励在验证范围内精确且可扩展，但验证器遗漏的任何东西都可能被利用。" },
      { title: "结果奖励与过程奖励问的问题不同", body: "结果监督只问最终答案是否正确；过程监督评价中间步骤，可以定位错误，但步骤标签或过程奖励模型成本高，也可能压制非传统但有效的推理。" },
      { title: "GRPO 用同组回答作基线", body: "对同一提示采样多个回答后，在组内归一化奖励。优于同组平均的回答得到正优势，从而减少单独训练价值模型的需要。" },
      { title: "训练时计算与测试时计算不同", body: "训练阶段增加 RL 样本会改变策略参数；推理阶段增加采样、搜索或验证只消耗测试时计算，不改变参数。两者通过不同机制提高结果。" },
      { title: "可验证不等于无法钻空子", body: "模型仍会利用脆弱测试、输出格式、评审提示或基准泄漏。需要留出验证器、检查轨迹、增加任务多样性，并测量泛化而非只看奖励。" },
      { title: "蒸馏不等于 RL", body: "小模型可以用监督学习模仿强策略生成的推理轨迹。这是在迁移生成数据中的行为，但蒸馏更新本身没有优化采样结果。" },
    ],
    examples: [
      { title: "带隐藏测试的代码生成", setup: "八段采样程序由私有测试套件返回二元奖励。", steps: ["按提示把程序分组", "在组内归一化通过与失败奖励", "提高高于组平均程序中词元的概率"], result: "策略从可验证结果学习解题模式，不需要主观奖励模型。" },
      { title: "答案正确，推理错误", setup: "一道数学题得到正确数字，却包含一个无效的中间断言。", steps: ["结果检查器返回成功", "过程验证器标出错误步骤", "根据任务判断只需正确答案还是可信推导"], result: "结果监督与过程监督可能冲突，正确的信号取决于验收目标。" },
    ],
    formulas: [{ latex: "A_i=\\frac{r_i-\\operatorname{mean}(r_1,\\ldots,r_G)}{\\operatorname{std}(r_1,\\ldots,r_G)+\\epsilon}", read: "一个回答的优势，是它的奖励相对同一提示下其他回答的位置", meaning: "组内归一化提供局部基线，但不能证明奖励本身测量了真正想要的能力。" }],
    misconception: "推理 RL 不是简单奖励“想得更久”。它奖励的是在某个验证器下高分的轨迹。更长链条可能有帮助，也可能浪费计算或隐藏错误；长度只是现象，不是目标。",
    transfer: { question: "代码模型学会输出硬编码答案，刚好通过公开测试。RLVR 算成功吗？", answer: "优化器成功了，但验证器不完整。需要隐藏与对抗测试、变化题目实例、检查真实解法，并在留出分布上评估，让奖励与真正解题能力保持相关。" },
    nextReason: "最后把这些 LLM 课程与离线数据、安全约束、稳健评估和部署证据合并起来。",
    references: [
      { label: "DeepSeekMath 与 GRPO", url: "https://arxiv.org/abs/2402.03300" },
      { label: "DeepSeek-R1 与推理 RL", url: "https://arxiv.org/abs/2501.12948" },
      { label: "过程监督：Let’s Verify Step by Step", url: "https://arxiv.org/abs/2305.20050" },
    ],
  },
  {
    id: "real-world-practice", stage: "实践与边界", title: "走出干净模拟器的 RL", subtitle: "离线数据、部分可观测、层级、多智能体、安全、评估与 RLHF。",
    openingQuestion: "一个策略在某个模拟器种子上得分很高，还需要什么证据，你才会相信它能进入真实世界？", prerequisites: ["control", "deep-value", "policy-learning", "continuous-and-models", "llm-reasoning"],
    outcome: "你能识别真实项目的主要失败边界，选择更安全的学习设置，并设计更难被钻空子的评估。",
    story: "真实部署会加入教材环境隐藏的约束：日志数据缺少关键动作，观察不完整，其他智能体会适应，奖励只是代理指标，而真实实验可能不安全。",
    concepts: [
      { title: "离线 RL 面临分布偏移", body: "策略可能提出数据集里从未出现的动作，而这些动作的价值估计并不可靠。保守目标与行为约束可以减少外推。" },
      { title: "问题结构会改变方法", body: "记忆应对部分可观测；选项和技能引入层级；多智能体学习还要处理其他学习者让环境不断变化。" },
      { title: "评估本身就是算法的一部分", body: "需要多个种子、学习曲线、不确定区间、消融实验、留出环境与安全指标。不能只看平均回报，还要检查真实行为。" },
      { title: "人类反馈仍然是代理", body: "RLHF 从偏好学习奖励模型，再针对它优化策略。奖励模型误差、标注者分歧与分布偏移仍是核心风险。" },
    ],
    examples: [
      { title: "驾驶日志数据", setup: "数据里几乎都是谨慎驾驶，危险状态下的恢复动作很少。", steps: ["朴素 Critic 对未见动作外推", "策略利用乐观误差", "约束策略靠近有数据支持的动作，并测试分布外情况"], result: "高估计价值不是数据支持范围之外行为安全的证据。" },
      { title: "偏好对齐助手", setup: "人类在两个回答中选出更好的一个，奖励模型学习这些偏好。", steps: ["收集成对判断", "训练奖励模型", "优化语言策略并监控漂移"], result: "RLHF 是一串学出来的代理模型，而不是直接读取人类价值。" },
    ],
    formulas: [{ latex: "\\text{证据}=\\text{回报}+\\text{安全}+\\text{稳健性}+\\text{不确定性}", read: "部署证据由性能、安全、稳健性与不确定性共同组成", meaning: "这是检查清单而非定理：单一平均分永远不是完整验收依据。" }],
    misconception: "赢得基准不等于完成部署证明。结果可能依赖随机种子、包装器、奖励尺度、隐藏评估选择，以及无法迁移到现实的模拟器假设。",
    transfer: { question: "一个追求奖励的客服机器人通过提前结束对话来快速关闭工单，哪里失败了？", answer: "奖励是可以被钻空子的代理指标。需要加入结果与质量指标、检查完整轨迹、测试对抗案例，并在高影响决定上保留人工复核。" },
    nextReason: "回到课程地图，根据已知信息、可采样数据与必须保护的安全边界选择方法。",
  },
] as const;

export const COURSE: Record<Language, CourseCopy> = {
  en: {
    languageName: "English", htmlLang: "en", brand: "RL FIELD GUIDE", title: "Reinforcement learning, from zero to the real world",
    strapline: "Build intuition first. Predict, run, inspect, explain—then name the equation.",
    introduction: "This route begins before RL vocabulary. It first teaches you how to recognize a sequential decision problem, then adds one idea at a time through deep and model-based RL into a dedicated four-lesson track on RLHF, DPO, RLAIF, RLVR, GRPO, and reasoning models.",
    startLabel: "Start from zero", resumeLabel: "Continue learning", routeLabel: "Your learning route", methodTitle: "How every lesson works",
    methodSteps: [
      { label: "See", note: "Start with an ordinary situation and one concrete doubt." },
      { label: "Predict", note: "Commit before the explanation reveals the mechanism." },
      { label: "Inspect", note: "Follow numbers, transitions, or probabilities step by step." },
      { label: "Name", note: "Introduce the formula only after its quantities are visible." },
      { label: "Transfer", note: "Change one assumption and decide what still works." },
    ],
    promiseTitle: "What this course will not assume",
    promises: ["No prior RL terminology", "No equation before its purpose", "No algorithm without a boundary case", "No progress credit for scrolling"],
    labels: { zeroStart: "Zero-start route", lesson: "Lesson", minutes: "min", prerequisites: "Before this lesson", none: "Nothing—begin here", outcome: "After this lesson", story: "Begin with a situation", ideas: "Build the idea", examples: "Worked examples", formula: "Now give the pattern a name", misconception: "Common trap", transfer: "Transfer check", reveal: "Reveal the answer", next: "Next lesson", previous: "Previous", courseMap: "Course map", language: "中文", theme: "Theme" },
    lessons: enLessons,
  },
  zh: {
    languageName: "中文", htmlLang: "zh-CN", brand: "RL 学习指南", title: "从零开始，直到真实世界的强化学习",
    strapline: "先建立直觉：预测、运行、检查、解释，最后再给公式命名。",
    introduction: "这条路线从 RL 术语出现之前开始：先学会识别连续决策问题，再一次只增加一个概念；在深度与基于模型 RL 之后，用四门独立课程深入学习 RLHF、DPO、RLAIF、RLVR、GRPO 与推理模型。",
    startLabel: "从零开始", resumeLabel: "继续学习", routeLabel: "你的学习路线", methodTitle: "每一课怎么学",
    methodSteps: [
      { label: "看情境", note: "先用日常情境提出一个具体疑问。" },
      { label: "先预测", note: "在解释揭示机制之前，先做出自己的判断。" },
      { label: "查证据", note: "逐步追踪数字、状态转移或概率。" },
      { label: "再命名", note: "等公式里的量都出现之后，再引入符号。" },
      { label: "做迁移", note: "改变一个假设，判断原方法是否仍然成立。" },
    ],
    promiseTitle: "这门课不会预设什么",
    promises: ["不预设任何 RL 术语", "不在说明用途前扔出公式", "不讲没有边界条件的算法", "不会因为滚动页面就算完成"],
    labels: { zeroStart: "零基础路线", lesson: "第", minutes: "分钟", prerequisites: "学习本课之前", none: "无需前置知识，从这里开始", outcome: "学完你将能够", story: "先从一个情境开始", ideas: "逐步建立概念", examples: "完整例子", formula: "现在给规律一个名字", misconception: "常见误区", transfer: "迁移检查", reveal: "查看答案", next: "下一课", previous: "上一课", courseMap: "课程地图", language: "English", theme: "主题" },
    lessons: zhLessons,
  },
};

export function getCourse(language: Language): CourseCopy {
  return COURSE[language];
}

export function getLesson(language: Language, lessonId: LessonId): Lesson {
  const lesson = COURSE[language].lessons.find((item) => item.id === lessonId);
  if (!lesson) throw new Error(`Unknown lesson: ${language}/${lessonId}`);
  return lesson;
}

export function isLanguage(value: string | undefined): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function isLessonId(value: string | undefined): value is LessonId {
  return LESSON_IDS.includes(value as LessonId);
}
