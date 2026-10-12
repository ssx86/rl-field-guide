import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_FOUR_ARTICLES = [
  {
    slug: "pomdp-memory",
    title: "Act under partial observability with belief and memory",
    deck: "A POMDP separates hidden world state from the observation available to the agent. Memory helps only when it preserves information that changes future predictions or decisions.",
    openingQuestion: "If the same image can mean moving left or moving right, what must an agent remember before it acts?",
    bridge: "Distributed systems can collect more observations, but they cannot reveal variables the sensors never expose at one instant. The Markov promise now fails at the observation level. POMDPs model hidden state explicitly, while belief states, filters, frame stacks, and recurrent networks summarize history for decision-making.",
    situation: {
      title: "One camera frame cannot reveal velocity",
      paragraphs: ["A robot sees a ball at the center of an image. In one history the ball is moving left; in another it is moving right. The current pixels are identical, but the correct interception action differs. Treating one frame as state merges futures with different transition distributions." ,"A partially observable Markov decision process keeps an underlying Markov state, emits an observation through an observation model, and lets the policy condition on observation history or a summary. A belief state is a probability distribution over hidden states given past observations and actions." ,"Exact beliefs require known dynamics and observation likelihoods and can be expensive. Frame stacks approximate short motion history. Bayesian filters maintain structured beliefs. Recurrent policies learn hidden states from data. External memory and transformers extend context, but larger memory does not guarantee that training discovers the relevant statistic."],
    },
    diagram: {
      title: "Hidden state produces observation; history produces belief", caption: "The environment remains Markov in hidden state. The agent must infer enough of that state from observations, past actions, and a model or learned memory.",
      items: [
        { label: "Hidden world", value: "Sₜ", note: "Contains velocity, intent, faults, or other unobserved causes." },
        { label: "Observation", value: "Oₜ~Ω(·|Sₜ)", note: "Sensors provide partial and possibly noisy evidence." },
        { label: "History", value: "Hₜ=(O₀,A₀,…,Oₜ)", note: "Past actions matter because they changed the hidden state and information." },
        { label: "Belief or memory", value: "bₜ(s) or hₜ", note: "A compact internal summary conditions the policy." },
      ],
    },
    workedExample: {
      title: "Update a two-state belief after a noisy signal",
      setup: "A machine is Healthy or Faulty. Prior fault probability is 0.20. A warning appears with probability 0.9 if Faulty and 0.1 if Healthy.",
      prediction: "After seeing a warning, should fault belief become 0.9, remain 0.2, or combine likelihood with the prior?",
      steps: [
        { label: "Faulty evidence", calculation: "0.9×0.2=0.18", explanation: "Joint weight for Faulty and warning combines prior and likelihood." },
        { label: "Healthy evidence", calculation: "0.1×0.8=0.08", explanation: "Warnings can be false positives, so Healthy retains weight." },
        { label: "Normalize", calculation: "P(Faulty|warning)=0.18/(0.18+0.08)≈0.692", explanation: "Posterior belief is about 69.2%, not 90%." },
        { label: "Decision", calculation: "stop if expected failure cost exceeds inspection cost", explanation: "The belief becomes decision-relevant only through action consequences and utility." },
      ],
      result: "A belief combines current evidence with historical probability. Recurrent policies try to learn an analogous useful summary when the generative model is unknown.",
    },
    mechanism: {
      introduction: "Memory methods differ in what structure they assume and how their internal state is trained, initialized, and evaluated.",
      sections: [
        { title: "Belief state restores a Markov information state", paragraphs: ["Given a correct POMDP model, the posterior distribution over hidden states is sufficient for predicting future observations and rewards. Planning in belief space is still difficult because beliefs are continuous even when hidden states are finite."] },
        { title: "Frame stacks encode a fixed short window", paragraphs: ["Stacking recent observations can reveal velocity in visual tasks and is easy to audit. It fails when relevant events occur outside the window or require variable-duration memory."] },
        { title: "Recurrent policies learn a task-specific summary", paragraphs: ["An RNN updates hidden state from observation, action, and sometimes reward. Training with truncated sequences, zero resets, or replay requires careful burn-in; otherwise the hidden state used for loss does not match the trajectory history."] },
        { title: "Active information gathering is part of control", paragraphs: ["An action can change both the world and what becomes observable. A diagnostic test may have immediate cost but reduce uncertainty. Policies that treat belief only as input without valuing information can miss such dual-control behavior."] },
      ],
    },
    equations: [
      { latex: "b_t(s)=\\Pr(S_t=s\\mid O_{0:t},A_{0:t-1})", read: "The belief at time t is the posterior probability of each hidden state given all observations so far and the actions previously taken.", meaning: "Actions belong in the conditioning because they change state transitions and which observations become likely. The belief is a distribution, not one guessed hidden state." },
      { latex: "b_{t+1}(s')\\propto \\Omega(o_{t+1}\\mid s')\\sum_s p(s'\\mid s,a_t)b_t(s)", read: "Predict the next hidden state through the transition model, weight it by the likelihood of the new observation, then normalize.", meaning: "This Bayes filter separates prediction from correction. Learned filters and recurrent networks approximate similar information flow without necessarily representing calibrated probabilities." },
    ],
    boundary: {
      title: "More context can preserve noise as easily as signal", paragraphs: ["A recurrent network may memorize identifiers, simulator timing artifacts, or reward leakage rather than hidden state. Counterfactual histories and observation corruptions help test what information it actually uses." ,"Partial observability cannot always be solved from history. If two hidden states generate identical observation distributions under every safe action, no memory can distinguish them without new sensors, interventions, or assumptions."],
    },
    nextBridge: "Memory reconstructs information from visited trajectories. It does not decide which unfamiliar trajectories should be visited. The next chapter expands bandit exploration into long sequential problems using optimism, counts, uncertainty, curiosity, information gain, and random-network distillation.",
    sources: [SB, { label: "Kaelbling, Littman, and Cassandra — Planning and Acting in Partially Observable Stochastic Domains", url: "https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume13/kaelbling98a-html/kaelbling98a.html", kind: "paper" }],
  },
  {
    slug: "deep-exploration",
    title: "Explore with uncertainty, counts, entropy, curiosity, and RND",
    deck: "Sequential exploration must reach informative states through coordinated action. Random dithering at each step often cannot cross a long corridor of individually unrewarding choices.",
    openingQuestion: "How can an agent value a state it has never reached when external reward offers no clue that the state matters?",
    bridge: "POMDP memory preserves relevant history once a trajectory is observed. Sparse environments present a prior obstacle: the useful trajectory may never occur. Bandit exploration chooses uncertain actions once; deep exploration must commit to sequences, distinguish epistemic uncertainty from randomness, and avoid treating every unpredictable event as progress.",
    situation: {
      title: "A chain requires coherent exploration",
      paragraphs: ["An agent starts at the left end of a ten-room chain. Every step right gives zero reward until the final room gives +1. Epsilon-greedy noise may repeatedly undo progress by stepping left. A committed optimistic hypothesis or sampled value function can direct an entire episode toward the unknown end." ,"Count bonuses reward rarely visited states. In large or continuous spaces, pseudo-counts estimate novelty through density models or learned representations. Curiosity uses prediction error as intrinsic reward. Random Network Distillation trains a predictor to match a fixed random target network and uses its error as a novelty signal." ,"Prediction error is not identical to useful uncertainty. A television showing random pixels remains unpredictable forever, producing the noisy-TV failure. Stochastic transitions, sensor noise, and changing other agents can attract curiosity without yielding controllable knowledge. Representation choice and episodic versus lifelong novelty matter."],
    },
    diagram: {
      title: "Exploration signals answer different questions", caption: "Action noise, optimism, posterior sampling, counts, and curiosity are mechanisms with different assumptions; all require external-task evaluation.",
      items: [
        { label: "Dithering", value: "random action noise", note: "Local diversity; weak for coordinated long sequences." },
        { label: "Optimism / posterior", value: "uncertain value hypotheses", note: "Can commit behavior across multiple steps." },
        { label: "Counts", value: "bonus for low visitation", note: "Needs a meaningful notion of the same state." },
        { label: "Curiosity / RND", value: "prediction or distillation error", note: "Scales novelty but can chase uncontrollable noise." },
      ],
    },
    workedExample: {
      title: "Compare a count bonus before and after ten visits",
      setup: "An intrinsic bonus is β/√N(s) with beta 1. A new state is assigned count 1 after its first visit; a familiar state has count 100.",
      prediction: "How much larger is the new-state bonus, and what assumption hides inside the count?",
      steps: [
        { label: "New state", calculation: "1/√1=1", explanation: "The first visit receives the full intrinsic bonus." },
        { label: "Ten visits", calculation: "1/√10≈0.316", explanation: "Novelty decays as evidence accumulates." },
        { label: "Hundred visits", calculation: "1/√100=0.1", explanation: "A familiar state still receives a small bonus under this rule." },
        { label: "Representation check", calculation: "N(s) depends on state identity", explanation: "If every noisy pixel frame is treated as new, counts never reflect semantic familiarity." },
      ],
      result: "The arithmetic is simple; the hard problem is defining novelty so that counts or errors decrease for what the agent has meaningfully learned.",
    },
    mechanism: {
      introduction: "Exploration bonuses alter the reward used for learning, while posterior and optimism methods alter beliefs or action selection. Their evidence should remain separated.",
      sections: [
        { title: "Epistemic and aleatoric uncertainty require different responses", paragraphs: ["Epistemic uncertainty can shrink with data and motivates exploration. Aleatoric randomness remains even with complete knowledge. Ensembles, Bayesian approximations, and disagreement try to estimate reducible uncertainty but require calibration checks."] },
        { title: "Count methods depend on representation", paragraphs: ["Exact counts work in tabular spaces. Hashing, density pseudo-counts, episodic memory, or learned embeddings define equivalence in larger spaces. A representation optimized only for reward may erase novelty before reward is found."] },
        { title: "Curiosity learns a controllable prediction problem", paragraphs: ["Forward models predict features after actions; inverse models encourage action-related features; information-gain objectives value belief change. Each can still be exploited by model error or non-stationarity."] },
        { title: "RND separates a fixed target from a trained predictor", paragraphs: ["A fixed random network maps observations to targets. A predictor trained on visited observations becomes accurate there, leaving high error on unfamiliar inputs. Observation normalization and predictor training balance are crucial to prevent scale drift or forgetting." ] },
      ],
    },
    equations: [
      { latex: "r_t^{int}=\\frac{\\beta}{\\sqrt{N(S_t)}}", read: "A simple count bonus gives larger intrinsic reward to states visited fewer times and decays with the square root of the visit count.", meaning: "The schedule balances novelty and decay, but its validity depends entirely on whether the count groups observations into meaningful states." },
      { latex: "r_t^{RND}=\\left\\|f_{predictor}(O_t)-f_{fixed}(O_t)\\right\\|_2^2", read: "RND novelty is squared error between a learned predictor and a fixed randomly initialized target network on the current observation.", meaning: "Predictor error tends to shrink on familiar observations. Noise, distribution shift, optimizer capacity, and forgetting can keep error high for reasons unrelated to useful exploration." },
    ],
    boundary: {
      title: "Novelty is not the same as task progress", paragraphs: ["An agent can maximize intrinsic reward by cycling through visually changing but irrelevant states. External return, state coverage, and controllability diagnostics should be reported separately rather than summed into one success score." ,"Unsafe domains cannot justify unconstrained exploration. Simulators, uncertainty-aware constraints, demonstrations, offline data, and human oversight may be necessary before any novelty bonus reaches the real system."],
    },
    nextBridge: "Exploration can finally reach a distant reward, but reaching it does not reveal which early choice deserves credit. The next chapter studies long-horizon attribution, temporal abstraction, reward redistribution, and hindsight without pretending correlation proves causation.",
    sources: [SB, { label: "Burda et al. — Exploration by Random Network Distillation", url: "https://arxiv.org/abs/1810.12894", kind: "paper" }, { label: "Pathak et al. — Curiosity-driven Exploration by Self-supervised Prediction", url: "https://proceedings.mlr.press/v70/pathak17a.html", kind: "paper" }],
  },
  {
    slug: "long-horizon-credit",
    title: "Assign credit across long delays instead of only adding more memory",
    deck: "Long-horizon credit asks which earlier decisions changed a distant result. More history and longer returns carry information backward but do not by themselves establish causal responsibility.",
    openingQuestion: "When a reward arrives one hundred steps later, which earlier actions should change and by how much?",
    bridge: "Exploration discovers rare successful trajectories. Standard returns can update every action along them, but success may depend on only a few decisions. This chapter separates temporal transport of a signal from causal attribution, then compares traces, temporal abstraction, reward redistribution, and hindsight relabeling.",
    situation: {
      title: "A key picked up early opens a door much later",
      paragraphs: ["In a maze, an agent picks up a key at step five, wanders for ninety steps, and opens a goal door at step one hundred. The external reward arrives only at the door. Monte Carlo assigns that return to every earlier action; one-step TD propagates it slowly; eligibility traces spread the final TD error through recent states." ,"A hierarchical option such as acquire-key can compress many low-level moves into a temporally extended action. Reward redistribution methods attempt to move delayed reward toward events that predict it, making learning targets shorter. Hindsight experience replay changes the goal label after a failed attempt so that achieved states still provide goal-conditioned evidence." ,"Each mechanism answers a different question. Traces transport TD errors. Options define reusable temporal structure. Redistribution changes the reward timing while trying to preserve total return. Hindsight changes the task label. None proves that a correlated event caused the outcome under intervention."],
    },
    diagram: {
      title: "Four mechanisms shorten different distances", caption: "Credit can be moved through updates, compressed through actions, redistributed in time, or recovered by relabeling goals. Their invariants and failure modes differ.",
      items: [
        { label: "Eligibility traces", value: "spread δ backward", note: "Faster temporal propagation through visited features." },
        { label: "Options", value: "macro-actions", note: "Plan and learn at a longer behavioral timescale." },
        { label: "Reward redistribution", value: "move predictive reward earlier", note: "Shorten delay while preserving trajectory return when valid." },
        { label: "Hindsight", value: "relabel achieved goal", note: "Turn some failures into off-policy goal-conditioned examples." },
      ],
    },
    workedExample: {
      title: "Compare delayed and redistributed reward",
      setup: "A three-step trajectory has rewards [0,0,10] with gamma 1. A valid redistribution assigns [7,0,3] while preserving total return.",
      prediction: "Does redistribution change the episode return? Which decision receives an earlier learning signal?",
      steps: [
        { label: "Original return", calculation: "0+0+10=10", explanation: "All task feedback arrives at the final event." },
        { label: "Redistributed return", calculation: "7+0+3=10", explanation: "The total is preserved for this trajectory." },
        { label: "Earlier signal", calculation: "step-one reward changes from 0 to 7", explanation: "The key-acquisition event can now receive immediate evidence instead of waiting for backward propagation." },
        { label: "Validity check", calculation: "compare policy ordering before and after redistribution", explanation: "Preserving sampled sums is not enough if redistribution changes which policies are optimal across trajectories." },
      ],
      result: "A useful redistribution shortens temporal delay while preserving the decision objective. Predictive attribution must be tested for policy invariance and spurious correlations.",
    },
    mechanism: {
      introduction: "Long-horizon credit methods change how learning signals travel, but each rests on a different structural assumption.",
      sections: [
        { title: "Traces accelerate correlation-based assignment", paragraphs: ["Eligibility connects current TD errors to recently active states or features. It improves propagation without distinguishing which prior event was causally necessary. Trace decay and repeated-state handling control how broadly credit spreads."] },
        { title: "Temporal abstraction changes the action space", paragraphs: ["Options have initiation sets, internal policies, and termination rules. Learning at the option level can shorten horizons and reuse skills, but poor options can hide crucial control or create non-stationary lower-level behavior."] },
        { title: "Redistribution predicts delayed consequences", paragraphs: ["Sequence models can identify events after which expected remaining return changes. Moving reward toward those events can create more informative local targets. Predictor leakage, confounding, and failure to preserve optimal policies are central risks."] },
        { title: "Hindsight changes goals, not history", paragraphs: ["A trajectory that missed goal g may have achieved g′. Relabeling it as an example for g′ supplies reward and transition evidence in goal-conditioned tasks. It cannot make impossible actions appear or fix an incorrect dynamics model." ] },
      ],
    },
    equations: [
      { latex: "\\sum_{t=0}^{T-1}\\tilde R_{t+1}=\\sum_{t=0}^{T-1}R_{t+1}", read: "A return-preserving reward redistribution keeps the total redistributed reward equal to the original trajectory reward.", meaning: "The equality is a necessary accounting condition in the undiscounted example. Policy invariance across trajectories and discount treatment require stronger construction and validation." },
      { latex: "r_t^{g'}=\\mathbf{1}\\{\\text{achieved}_{t+1}=g'\\}", read: "A simple hindsight reward relabels a transition using an alternative goal that the trajectory actually achieved.", meaning: "The transition remains real while the goal-conditioned task changes. This is off-policy data reuse and depends on goals sharing dynamics and a well-defined relabeling scheme." },
    ],
    boundary: {
      title: "Prediction of reward is not proof of causal credit", paragraphs: ["An event immediately before success may be a spectator correlated with a hidden cause. Reward redistribution based only on prediction can reinforce shortcuts. Interventions, environment structure, and counterfactual tests strengthen the attribution claim." ,"Very long context models can memorize trajectories without producing useful control abstractions. Credit quality should be judged by learning speed, transfer, robustness, and preserved objectives—not by attention maps or saliency alone."],
    },
    nextBridge: "Credit assignment learns from experienced futures. Model-based methods add an explicit ability to consider futures before acting. The next part begins with search and MCTS under known rules, then learns dynamics and latent world models when those rules are unavailable.",
    sources: [SB, { label: "Arjona-Medina et al. — RUDDER: Return Decomposition for Delayed Rewards", url: "https://proceedings.neurips.cc/paper/2019/hash/16105fb9cc614fc29e1bda00dab60d41-Abstract.html", kind: "paper" }, { label: "Andrychowicz et al. — Hindsight Experience Replay", url: "https://proceedings.neurips.cc/paper/2017/hash/453fadbd8a1a3af50a9df4df899537b5-Abstract.html", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
