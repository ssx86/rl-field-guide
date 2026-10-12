import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_SEVEN_ARTICLES = [
  {
    slug: "hierarchical-rl",
    title: "Build temporal hierarchy with options, MAXQ, goals, and skills",
    deck: "Hierarchical RL changes the unit of decision. A higher-level policy selects a goal or skill; a lower-level policy executes several environment steps before control returns.",
    openingQuestion: "When a task repeats 'navigate to the door' thousands of times, should the agent relearn every footstep inside every plan?",
    bridge: "Offline methods were constrained by the evidence already collected. Hierarchy addresses a different bottleneck: long tasks repeat meaningful subproblems. Options formalize temporally extended actions, MAXQ decomposes value by subtasks, and goal-conditioned skills turn desired states into reusable control interfaces.",
    situation: {
      title: "A delivery policy should reason in rooms as well as motor commands",
      paragraphs: ["A robot that plans only left-wheel and right-wheel torques faces a very long horizon. Skills such as leave elevator, navigate corridor, and dock at station compress reliable sequences. A manager can plan over skills while workers handle short control." ,"An option has an initiation set, an internal policy, and a termination condition. It may last one step or many. The induced high-level process is semi-Markov because durations vary. Option value includes every reward accrued during execution and discounts according to elapsed primitive steps." ,"MAXQ decomposes a value function into completion and subtask values under a task graph. Goal-conditioned policies take desired outcomes as input, and learned skill discovery methods seek diverse controllable behaviors using information or novelty objectives. A discovered diversity axis is not guaranteed to align with useful tasks."],
    },
    diagram: {
      title: "Hierarchy adds a second action clock", caption: "Primitive actions change the environment every step. Options or skills hold control until termination, after which the manager chooses again.",
      items: [
        { label: "Manager state", value: "s", note: "Chooses an option or subgoal using long-horizon context." },
        { label: "Option", value: "(I,πo,β)", note: "Defines where it can start, how it acts, and when it ends." },
        { label: "Primitive rollout", value: "aₜ,…,aₜ₊ₖ₋₁", note: "Worker interacts for a variable number of steps." },
        { label: "Return control", value: "sₜ₊ₖ", note: "Manager observes result, duration, and cumulative reward." },
      ],
    },
    workedExample: {
      title: "Back up a three-step option",
      setup: "An option lasts three primitive steps and receives rewards 1, 0, and 2. Gamma is 0.9. The next high-level state has value 5.",
      prediction: "Which power of gamma multiplies the next high-level value?",
      steps: [
        { label: "Internal rewards", calculation: "1+0.9×0+0.9²×2=2.62", explanation: "Rewards are discounted at their primitive-step distances." },
        { label: "Continuation", calculation: "0.9³×5=3.645", explanation: "The manager regains control after three steps, so continuation uses gamma cubed." },
        { label: "Option target", calculation: "2.62+3.645=6.265", explanation: "Semi-Markov backup accounts for both cumulative option reward and duration." },
        { label: "Termination risk", calculation: "bad β can end too early or never return", explanation: "Option learning includes termination quality, not only worker action quality." },
      ],
      result: "A high-level transition compresses many primitive transitions but must preserve their reward and elapsed time. Ignoring duration changes the objective.",
    },
    mechanism: {
      introduction: "Hierarchy is useful when its abstractions preserve control authority and transfer across states or tasks.",
      sections: [
        { title: "Options extend the action set", paragraphs: ["Primitive actions are options that terminate after one step, so the framework includes ordinary MDP control. Learned termination can create flexible boundaries but may collapse to trivial durations without regularization or high-level pressure."] },
        { title: "MAXQ decomposes returns by task graph", paragraphs: ["A parent task's value combines the child subtask's expected return with completion value afterward. Recursive optimality can differ from globally flat optimality because the decomposition constrains which policies are representable."] },
        { title: "Goal conditioning shares one worker", paragraphs: ["A universal value function or goal-conditioned policy learns behavior for many desired outcomes. Hindsight relabeling can improve data use. Goal representation and metric decide which outcomes are considered close or achieved."] },
        { title: "Skill discovery needs downstream validation", paragraphs: ["DIAYN-style diversity, mutual information, empowerment, or successor features can create distinguishable behaviors. Usefulness depends on controllability, coverage, composition, and how easily a manager can invoke them for real tasks." ] },
      ],
    },
    equations: [
      { latex: "Q(s,o)=\\mathbb{E}\\left[\\sum_{i=0}^{k-1}\\gamma^iR_{t+i+1}+\\gamma^k\\max_{o'}Q(S_{t+k},o')\\right]", read: "An option value sums rewards during the option and bootstraps from the next option decision after its random duration k.", meaning: "The gamma power records elapsed primitive time. Option transitions are semi-Markov, so pretending every option lasts one step biases temporal preference." },
      { latex: "o=(\\mathcal I_o,\\pi_o,\\beta_o)", read: "An option consists of an initiation set, an internal policy, and a termination function.", meaning: "All three components matter operationally: where the skill is valid, what it does, and when control returns. A reusable skill needs explicit contracts for each." },
    ],
    boundary: {
      title: "A hierarchy can freeze the wrong abstraction", paragraphs: ["If the available options omit a crucial maneuver, the manager cannot recover flat optimal behavior. Hand-designed hierarchies encode assumptions; learned hierarchies can optimize diversity instead of task utility." ,"Lower-level policies can change during training, making the manager's transition dynamics non-stationary. Freezing, versioning, joint training, or relabeling option outcomes addresses different parts of that moving interface."],
    },
    nextBridge: "A hierarchy coordinates policies inside one agent. Multi-agent RL adds several decision-makers whose actions change one another's environment, making stationarity, credit, communication, and equilibrium central concerns.",
    sources: [SB, { label: "Sutton, Precup, and Singh — Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction", url: "https://www.sciencedirect.com/science/article/pii/S0004370299000521", kind: "paper" }, { label: "Dietterich — Hierarchical Reinforcement Learning with the MAXQ Value Function Decomposition", url: "https://www.jair.org/index.php/jair/article/view/10266", kind: "paper" }],
  },
  {
    slug: "multi-agent-rl",
    title: "Coordinate multiple learners with CTDE, VDN, QMIX, MADDPG, and self-play",
    deck: "In multi-agent RL, each learner's environment includes other changing policies. Cooperative, competitive, and mixed settings require different solution concepts and evidence.",
    openingQuestion: "If every agent improves against yesterday's opponents, why can the joint system become worse today?",
    bridge: "Hierarchical RL coordinates internal levels toward one objective. Multi-agent systems contain distinct actors with shared, opposing, or mixed incentives. Independent learning creates non-stationarity; centralized training can use joint information while decentralized execution preserves local action boundaries.",
    situation: {
      title: "Two warehouse robots turn one another into moving dynamics",
      paragraphs: ["Two robots share narrow aisles. If each independently learns a Q-function while the other changes policy, the same state-action pair no longer has a stationary outcome distribution. Yesterday's safe turn can collide with today's newly learned convention." ,"Centralized training with decentralized execution gives critics access to joint observations and actions during training while each deployed actor uses local information. VDN adds per-agent utilities; QMIX mixes them monotonically so decentralized argmax actions agree with the joint argmax. MADDPG uses centralized critics with decentralized deterministic actors." ,"Self-play generates opponents from the learning process and can produce curricula, conventions, or cycles. Competitive performance is relative to an opponent population. Elo-like ratings, exploitability, population diversity, cross-play, and held-out agents reveal different aspects of robustness."],
    },
    diagram: {
      title: "Training information and execution information can differ", caption: "CTDE uses privileged joint context only while learning. Every deployed action must remain computable from the agent's allowed local observation or communication.",
      items: [
        { label: "Local actors", value: "aᵢ~πᵢ(oᵢ)", note: "Execution respects each agent's information boundary." },
        { label: "Central critic", value: "Q(s,a₁,…,aN)", note: "Training can reduce non-stationarity with joint context." },
        { label: "Value factorization", value: "VDN/QMIX", note: "Combines per-agent utilities under structural assumptions." },
        { label: "Population", value: "self-play / league", note: "Opponent mixture defines what robustness means." },
      ],
    },
    workedExample: {
      title: "Expose a coordination game with two equilibria",
      setup: "Two agents independently choose Left or Right. Matching Left gives both 4, matching Right gives both 3, and mismatch gives both 0.",
      prediction: "Which joint action is globally best, and why can independent exploration struggle?",
      steps: [
        { label: "Joint values", calculation: "Q(Left,Left)=4; Q(Right,Right)=3; mismatches=0", explanation: "Both coordinated outcomes beat mismatch; Left is globally better." },
        { label: "Independent uncertainty", calculation: "an agent's reward depends on the other's simultaneous action", explanation: "The same local action appears good or bad as the other policy changes." },
        { label: "Convention trap", calculation: "frequent Right coordination reinforces Right", explanation: "The agents may settle on the lower-payoff equilibrium because unilateral change temporarily causes mismatch." },
        { label: "Central training", calculation: "joint critic observes both actions", explanation: "It can represent coordination value while decentralized actors learn compatible local choices." },
      ],
      result: "Non-stationarity and equilibrium selection are not ordinary stochastic noise. Evaluation must include partners or opponents outside the exact training pairing.",
    },
    mechanism: {
      introduction: "Multi-agent algorithm names encode assumptions about rewards, observability, coordination structure, and execution constraints.",
      sections: [
        { title: "Independent learners ignore strategic non-stationarity", paragraphs: ["Treating other agents as environment can be simple and scalable, but replay becomes stale as their policies change. Fingerprints, opponent models, centralized critics, or on-policy collection address different symptoms." ] },
        { title: "VDN and QMIX factor cooperative value", paragraphs: ["VDN sums utilities. QMIX learns a mixing network constrained to be monotonic in each agent utility, enabling decentralized greedy actions. Non-monotonic joint advantages cannot be represented exactly." ] },
        { title: "MADDPG centralizes critics", paragraphs: ["Each actor uses its local observation, while its critic conditions on joint actions and observations during training. The critic can model interaction but scales poorly as agents and action dimensions grow." ] },
        { title: "Self-play needs population evidence", paragraphs: ["Training only against the latest policy can forget older strategies or cycle. Opponent sampling, leagues, exploiters, and cross-play matrices reveal whether progress generalizes beyond a narrow convention." ] },
      ],
    },
    equations: [
      { latex: "Q_{tot}=f_{mix}(Q_1(o_1,a_1),\\ldots,Q_n(o_n,a_n),s),\\qquad \\frac{\\partial Q_{tot}}{\\partial Q_i}\\ge0", read: "QMIX combines individual utilities through a state-conditioned mixing network constrained to be monotonic in every agent utility.", meaning: "Monotonicity makes each agent's local greedy action consistent with the joint greedy action. It also limits the class of cooperative value functions the model can express." },
      { latex: "J_i=\\mathbb{E}[Q_i(x,a_1,\\ldots,\\mu_i(o_i),\\ldots,a_n)]", read: "A MADDPG actor is optimized through a centralized critic that sees joint context while substituting the current agent's action from its local actor.", meaning: "Centralized information exists only during training. Deployment validity requires the actor to act from permitted local observation and communication." },
    ],
    boundary: {
      title: "Training partners can become a hidden test leak", paragraphs: ["Agents may coordinate through simulator quirks, synchronized randomness, or identities absent in deployment. Cross-play with independently trained populations and perturbed communication is necessary before claiming cooperation." ,"A shared team reward can conceal unfair or unsafe allocation among agents or people. Team return, individual outcomes, equilibrium stability, and exploitability should remain separate metrics."],
    },
    nextBridge: "Multi-agent learning asks whether behavior works with different partners. Transfer, multi-task, meta-RL, and sim-to-real broaden that question to different tasks and environments, forcing us to distinguish adaptation from memorization.",
    sources: [{ label: "Sunehag et al. — Value-Decomposition Networks", url: "https://arxiv.org/abs/1706.05296", kind: "paper" }, { label: "Rashid et al. — QMIX", url: "https://proceedings.mlr.press/v80/rashid18a.html", kind: "paper" }, { label: "Lowe et al. — Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments", url: "https://proceedings.neurips.cc/paper/2017/hash/68a9750337a418a86fe06c1991a1d64c-Abstract.html", kind: "paper" }],
  },
  {
    slug: "transfer-meta-generalization",
    title: "Separate multi-task learning, transfer, meta-RL, generalization, and sim-to-real",
    deck: "Training on several tasks can share representations, adapt quickly, or generalize to new conditions. Those are different claims and require different train-test splits.",
    openingQuestion: "Did a policy learn a reusable principle, or merely memorize the finite set of training variations?",
    bridge: "Multi-agent cross-play tested behavior with new partners. Transfer broadens the distribution shift: new goals, dynamics, observations, or reward scales. Multi-task learning trains shared competence; transfer fine-tunes; meta-RL learns an adaptation procedure; generalization tests without task-specific updates; sim-to-real crosses a modeling gap.",
    situation: {
      title: "A robot trained on ten floors meets an eleventh",
      paragraphs: ["Ten training floors vary in color, corridor width, and goal location. A shared policy may perform on all ten yet fail on a held-out floor. Success on training tasks demonstrates multi-task fit, not zero-shot generalization." ,"Fine-tuning the policy with experience on floor eleven is transfer learning. If training explicitly optimized the policy or recurrent state to adapt from a few episodes, the method is meta-learning or meta-RL. Measuring performance before, during, and after adaptation separates initial generalization from adaptation speed." ,"Sim-to-real adds a source-target gap in dynamics, sensing, latency, and appearance. Domain randomization trains across simulated variations, system identification estimates real parameters, and residual learning corrects a nominal controller. Covering random parameters does not guarantee that the real system lies inside the simulated support."],
    },
    diagram: {
      title: "One split supports four different claims", caption: "The evaluation protocol—not a method label—determines whether evidence concerns multi-task fit, zero-shot transfer, few-shot adaptation, or real-world deployment.",
      items: [
        { label: "Multi-task", value: "train and test on task set", note: "Measures shared capacity on known tasks." },
        { label: "Generalization", value: "test unseen task, no updates", note: "Measures zero-shot behavior under defined shift." },
        { label: "Transfer / meta-RL", value: "allow adaptation data", note: "Measure learning curve and final performance separately." },
        { label: "Sim-to-real", value: "deploy across reality gap", note: "Requires hardware safety, calibration, and staged evidence." },
      ],
    },
    workedExample: {
      title: "Read an adaptation curve instead of one final score",
      setup: "On a held-out task, a meta-trained policy scores 40 before adaptation, 70 after one episode, and 82 after five. A pretrained baseline scores 60, 65, and 80.",
      prediction: "Which method has better zero-shot generalization, faster one-shot adaptation, and better five-shot performance?",
      steps: [
        { label: "Zero-shot", calculation: "baseline 60 > meta 40", explanation: "The baseline starts stronger before target-task updates." },
        { label: "One-shot", calculation: "meta 70 > baseline 65", explanation: "The meta policy adapts faster after one episode." },
        { label: "Five-shot", calculation: "meta 82 > baseline 80", explanation: "The advantage remains but narrows at the final budget." },
        { label: "Complete claim", calculation: "report full curve, variance, and data cost", explanation: "Calling the meta method simply better hides its weaker initial behavior." },
      ],
      result: "Adaptation is a trajectory of performance versus target data. A single post-adaptation score cannot distinguish a good prior from an efficient learner.",
    },
    mechanism: {
      introduction: "Generalization claims require an explicit axis of variation and a split that withholds that axis without leaking identifiers.",
      sections: [
        { title: "Multi-task sharing can transfer or interfere", paragraphs: ["Shared encoders and policies reuse structure, while gradients from conflicting tasks cause negative transfer. Task conditioning, modular networks, routing, and gradient balancing encode different assumptions about shared factors." ] },
        { title: "Meta-RL learns an inner adaptation process", paragraphs: ["Gradient-based methods optimize parameters that fine-tune rapidly; recurrent meta-RL stores task inference in hidden state; context-based methods infer a latent task variable. All can memorize a small training-task family unless evaluated on genuine held-out structure." ] },
        { title: "Generalization needs controlled shift categories", paragraphs: ["Visual texture, dynamics, reward, topology, action delay, and initial-state shifts test different capabilities. Averaging them into one score hides the source of failure and encourages benchmark overfitting." ] },
        { title: "Sim-to-real combines robust control and evidence staging", paragraphs: ["Randomization broadens simulator experience; identification narrows uncertainty; adaptation updates on real data; safety layers limit exploration. Hardware validation should progress from shadow and low-energy tests to bounded operation with stop conditions." ] },
      ],
    },
    equations: [
      { latex: "\\theta_i'=\\theta-\\alpha\\nabla_\\theta L_{\\mathcal T_i}(\\theta),\\qquad \\min_\\theta\\sum_i L_{\\mathcal T_i}(\\theta_i')", read: "A gradient-based meta-learner chooses initial parameters whose one-step task-specific updates perform well across training tasks.", meaning: "The outer objective rewards adaptability under the chosen inner algorithm and task distribution. Generalization beyond that distribution remains an empirical question." },
      { latex: "\\phi^*=\\arg\\max_\\phi\\mathbb{E}_{\\xi\\sim p_{sim}(\\xi)}[J(\\pi_\\phi;\\xi)]", read: "Domain randomization trains a policy across simulator parameters drawn from a chosen distribution.", meaning: "Robustness is only trained over variations included in p sim. The real system may lie outside that range or combine parameters in untested ways." },
    ],
    boundary: {
      title: "A broad benchmark is not the same as an unseen world", paragraphs: ["Repeated tuning on a public test set turns it into training information. Hidden test families, versioned environments, and pre-registered metrics reduce leakage but cannot represent every deployment shift." ,"Fast adaptation can be unsafe if initial exploratory actions are aggressive. Meta-RL does not exempt target-domain learning from constraints, monitoring, or human approval."],
    },
    nextBridge: "Transfer asks whether behavior survives changed tasks. Reliability now asks whether the objective, constraints, evaluation, and training system justify any real claim. The next part begins with reward design and specification gaming.",
    sources: [{ label: "Finn, Abbeel, and Levine — Model-Agnostic Meta-Learning", url: "https://proceedings.mlr.press/v70/finn17a.html", kind: "paper" }, { label: "Tobin et al. — Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World", url: "https://arxiv.org/abs/1703.06907", kind: "paper" }, SB],
  },
] satisfies readonly ChapterArticle[];
