import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_SIX_ARTICLES = [
  {
    slug: "behavior-cloning-dagger",
    title: "Learn from demonstrations with behavior cloning and DAgger",
    deck: "Behavior cloning treats expert actions as supervised labels. Its central failure is not ordinary test error but covariate shift: small mistakes move the learner into states the expert dataset never covered.",
    openingQuestion: "Why can a policy with 99% imitation accuracy still fail rapidly when it controls the system itself?",
    bridge: "World-model chapters assumed the agent could collect interaction and improve from consequences. Demonstrations offer a different starting point: imitate behavior already judged competent. This can avoid unsafe exploration, but the learner's own mistakes change the state distribution, so independent supervised accuracy does not predict rollout stability.",
    situation: {
      title: "A driving imitator drifts off the expert's center line",
      paragraphs: ["An expert driver supplies images and steering actions while staying near the lane center. A cloned policy makes a small steering error and moves toward the edge. Edge views are rare in the training data, causing a larger error and further drift. Errors compound because the learner visits states selected by its own policy." ,"Behavior cloning minimizes action prediction loss under the expert's state distribution. It is simple, scalable, and often a strong baseline. It does not use reward and should not be relabeled reinforcement learning merely because the deployed policy acts sequentially." ,"DAgger runs the learner, asks the expert for correct actions on learner-visited states, aggregates those labeled states, and retrains. It reduces covariate shift by matching training coverage to the policy's induced distribution. Querying an expert online can still be expensive, unsafe, or ambiguous when several actions are acceptable."],
    },
    diagram: {
      title: "Training and rollout distributions separate after the first error", caption: "Behavior cloning sees expert states. DAgger deliberately labels learner states so the supervised problem follows the deployed policy distribution.",
      items: [
        { label: "Expert data", value: "s~dexpert, a~πexpert", note: "Demonstrations concentrate near successful trajectories." },
        { label: "Clone", value: "minimize action loss", note: "Learns labels where expert states provide support." },
        { label: "Rollout shift", value: "s~dlearner", note: "Small errors reach unfamiliar recovery states." },
        { label: "DAgger", value: "query expert on learner states", note: "Aggregates recovery labels under relevant occupancy." },
      ],
    },
    workedExample: {
      title: "See how per-step error compounds",
      setup: "Suppose a cloned policy has independent error probability 1% per decision in a simplified 100-step task, and any error ends success.",
      prediction: "Is trajectory success close to 99%, 90%, or 36%?",
      steps: [
        { label: "One step", calculation: "P(correct)=0.99", explanation: "The supervised metric looks excellent for an individual expert-like state." },
        { label: "Hundred steps", calculation: "P(all correct)=0.99¹⁰⁰≈0.366", explanation: "Even under the optimistic independence assumption, uninterrupted success falls to about 36.6%." },
        { label: "Shift effect", calculation: "errors need not remain 1% after leaving dexpert", explanation: "Unfamiliar states can make later error probability larger, so real compounding may be worse." },
        { label: "DAgger response", calculation: "add (learner state, expert recovery action)", explanation: "Training obtains labels for states caused by the learner's current mistakes." },
      ],
      result: "Per-step accuracy is not a rollout guarantee. Sequential evaluation and state-distribution coverage are necessary even when training is ordinary supervised learning.",
    },
    mechanism: {
      introduction: "Imitation methods vary by what feedback is available and whether expert access continues after the first dataset.",
      sections: [
        { title: "Behavior cloning is maximum likelihood on demonstrations", paragraphs: ["For discrete actions it minimizes cross-entropy; for continuous actions it may fit a distribution or regression target. Multimodal expert behavior can make mean actions unsafe, so expressive policies and action likelihood diagnostics matter."] },
        { title: "Covariate shift is occupancy mismatch", paragraphs: ["The policy is evaluated under dπ but trained under dE. Small action errors change later states, violating the independent-example intuition. Data augmentation can help perceptual variation but cannot supply missing recovery decisions without assumptions."] },
        { title: "DAgger converts rollout states into supervised queries", paragraphs: ["Each iteration mixes expert and learner behavior, gathers expert labels on visited states, and appends them. Mixing protects early rollouts; later iterations increasingly expose the learner's own occupancy."] },
        { title: "Demonstration quality is not a scalar", paragraphs: ["Experts can be inconsistent, suboptimal, or optimized for a different objective. Multiple experts reveal variation but can also create conflicting labels. Confidence, provenance, and task conditions should accompany demonstrations." ] },
      ],
    },
    equations: [
      { latex: "\\hat\\pi=\\arg\\min_{\\pi}\\mathbb{E}_{(s,a)\\sim D_E}[-\\log\\pi(a\\mid s)]", read: "Behavior cloning chooses a policy that maximizes demonstrated-action likelihood under the expert dataset.", meaning: "The expectation is over expert occupancy, not learner occupancy. A low objective therefore certifies fit only where demonstrations provide evidence." },
      { latex: "D_{k+1}=D_k\\cup\\{(s,\\pi_E(s)):s\\sim d_{\\pi_k}\\}", read: "DAgger adds expert labels for states visited by the current learner policy to the accumulated dataset.", meaning: "The new data targets covariate shift directly. It requires a safe way to execute the learner and an expert capable of labeling the resulting states." },
    ],
    boundary: {
      title: "Expert imitation does not reveal why behavior works", paragraphs: ["A clone can reproduce shortcuts correlated with expert actions and fail after domain shift. Counterfactual tests, recovery scenarios, and causal features matter more than aggregate action accuracy." ,"DAgger is inappropriate when learner rollouts can cause unacceptable harm or expert queries are unavailable. Offline imitation, simulators, shields, or conservative policy constraints may be needed instead."],
    },
    nextBridge: "Demonstrations provide actions but may not reveal the objective. Inverse reinforcement learning tries to infer a reward that makes expert behavior plausible, while GAIL matches occupancy directly through adversarial training.",
    sources: [{ label: "Ross, Gordon, and Bagnell — A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning", url: "https://proceedings.mlr.press/v15/ross11a.html", kind: "paper" }, { label: "Pomerleau — ALVINN: An Autonomous Land Vehicle in a Neural Network", url: "https://papers.nips.cc/paper/95-alvinn-an-autonomous-land-vehicle-in-a-neural-network", kind: "paper" }, SB],
  },
  {
    slug: "inverse-rl-gail",
    title: "Infer objectives with inverse RL, maximum entropy, and GAIL",
    deck: "Inverse RL explains demonstrations through a reward hypothesis. Because many rewards produce the same behavior, the result is an assumption-dependent explanation, not a recovered ground truth.",
    openingQuestion: "If an expert chooses one route, can we determine whether it valued speed, safety, comfort, or an unobserved mixture?",
    bridge: "Behavior cloning copies expert actions and struggles outside demonstration states. Inverse RL asks a deeper question: which reward would make those trajectories rational? Maximum-entropy IRL represents uncertainty over behavior, and GAIL avoids an explicit recovered reward by adversarially matching expert and learner occupancy.",
    situation: {
      title: "One route supports many reward stories",
      paragraphs: ["A driver takes a longer road. The route may avoid traffic, reduce risk, prefer familiar turns, or satisfy a hidden appointment constraint. From one trajectory, many reward functions rank that route highest. Adding demonstrations across contexts can narrow but not eliminate ambiguity." ,"Classical inverse RL searches for rewards under which the expert policy is optimal or near-optimal. Feature expectations summarize how often behavior encounters properties such as time, toll, and risk. Reward shaping equivalences mean different reward functions can induce identical optimal policies." ,"Maximum-entropy IRL assigns higher probability to high-reward trajectories while preserving entropy, avoiding an assumption that the expert deterministically selects one optimum. GAIL trains a discriminator to distinguish expert from learner state-action pairs and updates the policy to fool it, approximately matching occupancy without producing a uniquely interpretable reward."],
    },
    diagram: {
      title: "Three imitation questions lead to three objects", caption: "Cloning predicts actions, inverse RL proposes a reward, and GAIL matches occupancy. They answer related but non-identical questions.",
      items: [
        { label: "Behavior cloning", value: "state→expert action", note: "Direct supervised fit under demonstration occupancy." },
        { label: "Inverse RL", value: "trajectory→reward hypothesis", note: "Needs dynamics, rationality, and reward-class assumptions." },
        { label: "MaxEnt IRL", value: "distribution over trajectories", note: "High reward increases likelihood without deterministic optimality." },
        { label: "GAIL", value: "match state-action occupancy", note: "Adversarial signal trains a policy through interaction." },
      ],
    },
    workedExample: {
      title: "Show reward ambiguity with two features",
      setup: "An expert route has time feature 10 and risk feature 1. An alternative has time 8 and risk 3. Reward is negative weighted cost: −wtime×time−wrisk×risk.",
      prediction: "Find two positive weight choices that prefer different routes.",
      steps: [
        { label: "Safety-heavy weights", calculation: "wtime=1, wrisk=5: expert=−15, alternative=−23", explanation: "The expert route is preferred because its lower risk outweighs two extra time units." },
        { label: "Speed-heavy weights", calculation: "wtime=5, wrisk=1: expert=−51, alternative=−43", explanation: "The alternative is preferred because time dominates." },
        { label: "Constraint from demonstration", calculation: "expert preferred ⇒ 10wt+1wr ≤ 8wt+3wr", explanation: "The observation constrains a region, here wr≥wt, rather than identifying one unique pair." },
        { label: "Need more contexts", calculation: "new comparisons add inequalities", explanation: "Diverse situations narrow the feasible reward set and reveal inconsistent expert behavior." },
      ],
      result: "A demonstration provides preference constraints under modeling assumptions. It does not expose a single true reward vector.",
    },
    mechanism: {
      introduction: "Objective inference is inseparable from assumptions about rationality, features, dynamics, and what was observable to the demonstrator.",
      sections: [
        { title: "Reward identifiability is limited", paragraphs: ["Adding a constant, positive scaling, or potential-based shaping can preserve policy ordering. More severe ambiguity arises when demonstrations cover only a narrow region. Evaluation should focus on induced behavior and transfer, not visual plausibility of a reward map."] },
        { title: "Maximum entropy models imperfect choice", paragraphs: ["Trajectory probability is proportional to exponential reward under a causal entropy formulation. This spreads probability among multiple good trajectories and yields a differentiable feature-expectation objective."] },
        { title: "GAIL uses a discriminator as a learned signal", paragraphs: ["The discriminator estimates whether state-action samples resemble expert or learner occupancy. Policy optimization treats its output as a reward-like signal. Instability, mode dropping, and sample cost inherit both adversarial training and RL difficulties."] },
        { title: "Preferences and IRL are related but distinct", paragraphs: ["Pairwise preference learning observes which of two outcomes is favored, while IRL observes behavior under environment dynamics. Both infer latent objectives and can inherit annotator bias, missing context, and strategic demonstrations." ] },
      ],
    },
    equations: [
      { latex: "p(\\tau\\mid\\theta)=\\frac{1}{Z(\\theta)}\\exp\\left(\\sum_t r_\\theta(s_t,a_t)\\right)", read: "Maximum-entropy IRL assigns trajectory probability proportional to the exponential of its cumulative learned reward.", meaning: "The partition function normalizes across possible trajectories. Dynamics, available actions, and reward features determine which explanations the model can represent." },
      { latex: "\\min_\\pi\\max_D\\;\\mathbb{E}_{\\pi_E}[\\log D(s,a)]+\\mathbb{E}_{\\pi}[\\log(1-D(s,a))]-\\lambda H(\\pi)", read: "GAIL trains a discriminator to separate expert and learner occupancy while training the policy to confuse it with an entropy regularizer.", meaning: "The adversarial objective targets occupancy matching rather than a uniquely recovered human-readable reward. Policy rollouts are still required in the standard algorithm." },
    ],
    boundary: {
      title: "Inferred rewards inherit blind spots from demonstrations", paragraphs: ["If experts never encounter a dangerous region, the inferred reward may assign it arbitrary value. Optimizing that reward can seek unsupported states. Active queries, constraints, and out-of-distribution checks remain necessary." ,"Human behavior is not automatically desirable or optimal. Demonstrations can encode habit, inequity, limited information, or institutional constraints. Inverse RL explains behavior under a model; it does not morally validate it."],
    },
    nextBridge: "Imitation assumes expert-quality examples or an objective inferred from them. Offline RL instead uses a fixed dataset that may contain mixed, mediocre, or unknown behavior and tries to improve without new interaction—making support mismatch the central risk.",
    sources: [{ label: "Ziebart et al. — Maximum Entropy Inverse Reinforcement Learning", url: "https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf", kind: "paper" }, { label: "Ho and Ermon — Generative Adversarial Imitation Learning", url: "https://proceedings.neurips.cc/paper/2016/hash/cc7e2b878868cbae992d1fb743995d8f-Abstract.html", kind: "paper" }, SB],
  },
  {
    slug: "offline-rl",
    title: "Learn from fixed logs with BCQ, CQL, and IQL",
    deck: "Offline RL seeks a policy from a fixed dataset without collecting corrective experience. Its defining danger is assigning high value to actions the dataset cannot support.",
    openingQuestion: "How can a policy improve beyond logged behavior without trusting invented values for actions never observed?",
    bridge: "Imitation stays near demonstrated behavior. Offline RL aims to use rewards in a broader fixed dataset to outperform its behavior policy. Standard off-policy algorithms can extrapolate: the critic overvalues an unsupported action, the actor chooses it, and no online interaction corrects the mistake. Offline methods constrain or pessimistically score this loop.",
    situation: {
      title: "A medical log contains outcomes only for treatments actually chosen",
      paragraphs: ["Historical records show patient state, clinician treatment, and outcome. For a particular severe state, treatment A appears often and B never appears. A flexible Q-network can still output a high value for B through generalization, but the log provides no direct outcome evidence there." ,"Batch-Constrained Q-learning learns a generative model of dataset actions and selects only likely candidates, with a small perturbation model. Conservative Q-learning adds a penalty that pushes down values for actions outside data relative to logged actions. Implicit Q-learning avoids querying arbitrary actions during value fitting and extracts a policy through advantage-weighted regression." ,"These methods make different compromises between improvement and conservatism. Dataset composition, behavior diversity, reward quality, terminal handling, and coverage by clinically relevant subgroups often matter more than benchmark algorithm names."],
    },
    diagram: {
      title: "Offline improvement is bounded by support", caption: "A fixed log contains factual outcomes for chosen actions. Every policy improvement claim outside that support depends on function generalization or structural assumptions.",
      items: [
        { label: "Dataset", value: "D from unknown behavior β", note: "Coverage and propensities may vary across states." },
        { label: "Extrapolation", value: "Q high for unseen action", note: "Bootstrapping can amplify unsupported errors." },
        { label: "Constraint", value: "BCQ stays near likely actions", note: "Restricts candidate actions using a learned behavior model." },
        { label: "Pessimism", value: "CQL lowers out-of-data values", note: "Trades aggressive improvement for conservative estimates." },
      ],
    },
    workedExample: {
      title: "See how an unsupported maximum corrupts a target",
      setup: "At next state s′, the dataset contains action A with estimated Q=4. The critic also outputs Q=10 for unseen action B. Reward is 1 and gamma 0.9.",
      prediction: "What target does ordinary Q-learning use, and why is it not evidence for B?",
      steps: [
        { label: "Unconstrained maximum", calculation: "max(4,10)=10", explanation: "The critic selects B even though no logged B transition supports that value." },
        { label: "Bootstrap target", calculation: "y=1+0.9×10=10", explanation: "The unsupported estimate feeds back as a label and can grow through repeated updates." },
        { label: "Support-constrained target", calculation: "choose A ⇒ y=1+0.9×4=4.6", explanation: "A behavior-constrained method refuses the unsupported candidate." },
        { label: "Tradeoff", calculation: "conservatism may miss a genuinely better B", explanation: "Without new evidence, safety from extrapolation and improvement beyond support are fundamentally in tension." },
      ],
      result: "The issue is not that B is known to be bad; it is that B's value is unidentified from this local data. Offline algorithms encode different responses to that uncertainty.",
    },
    mechanism: {
      introduction: "Offline RL methods should be compared by where they restrict policy, value, or action support and by what assumptions make their improvement plausible.",
      sections: [
        { title: "BCQ constrains candidate actions", paragraphs: ["A variational model generates actions resembling the dataset. A perturbation network makes bounded changes, and Q chooses among candidates. Model error in the behavior generator and multimodal action support affect what remains reachable."] },
        { title: "CQL learns conservative values", paragraphs: ["A log-sum-exp term raises pressure on many actions while logged-action value offsets it, encouraging lower values outside data. Conservative coefficients control underestimation versus extrapolation and require task-specific validation."] },
        { title: "IQL avoids explicit out-of-distribution maximization", paragraphs: ["Expectile regression fits a state value toward upper portions of logged action values. Q learns from that value, and the policy performs advantage-weighted behavior cloning. Improvement comes from emphasizing good logged actions rather than maximizing arbitrary actions." ] },
        { title: "Dataset audits precede algorithm choice", paragraphs: ["Coverage maps, action frequencies, reward missingness, terminal semantics, duplicate trajectories, leakage, subgroup support, and behavior changes over time determine what can be learned. A benchmark label such as medium-replay is not a substitute for this audit." ] },
      ],
    },
    equations: [
      { latex: "\\alpha\\left(\\log\\sum_a e^{Q(s,a)}-\\mathbb{E}_{a\\sim D}[Q(s,a)]\\right)", read: "A simplified CQL penalty contrasts high values across candidate actions with values assigned to actions actually present in the dataset.", meaning: "The penalty discourages unsupported optimism. Its exact continuous-action estimator and coefficient matter, and excess conservatism can suppress real improvements." },
      { latex: "L_V=\\mathbb{E}_{(s,a)\\sim D}[|\\tau-\\mathbf{1}(Q(s,a)-V(s)<0)|(Q(s,a)-V(s))^2]", read: "IQL fits state value using expectile regression so higher logged action values receive asymmetric emphasis controlled by tau.", meaning: "The value is estimated from dataset actions without an explicit max over unseen actions. The extracted policy still depends on dataset coverage and advantage weighting." },
    ],
    boundary: {
      title: "Offline evaluation cannot certify unsupported deployment", paragraphs: ["A method can score well under a learned value and fail when executed. Simulators, prospective shadow tests, conservative gates, and human review may be needed before controlled online validation." ,"Unobserved confounding can make logged rewards incomparable across actions. Offline RL is not a replacement for causal identification; propensity, policy, and outcome assumptions should be stated explicitly."],
    },
    nextBridge: "BCQ, CQL, and IQL retain value or policy-learning structure. Decision Transformer reframes an offline trajectory as a conditional sequence-modeling problem, predicting actions from history and a desired return-to-go.",
    sources: [{ label: "Fujimoto, Meger, and Precup — Off-Policy Deep Reinforcement Learning without Exploration", url: "https://proceedings.mlr.press/v97/fujimoto19a.html", kind: "paper" }, { label: "Kumar et al. — Conservative Q-Learning", url: "https://proceedings.neurips.cc/paper/2020/hash/0d2b2061826a5df3221116a5085a6052-Abstract.html", kind: "paper" }, { label: "Kostrikov, Nair, and Levine — Offline Reinforcement Learning with Implicit Q-Learning", url: "https://openreview.net/forum?id=68n2s9ZJWF8", kind: "paper" }],
  },
  {
    slug: "decision-transformer",
    title: "Condition sequence models with Decision Transformer",
    deck: "Decision Transformer predicts actions from past states, actions, and desired return-to-go. It changes the training interface, not the need for capable trajectories and honest conditioning.",
    openingQuestion: "Can offline control be learned as next-token prediction if the sequence includes what outcome the user wants?",
    bridge: "Offline RL usually constructs value targets or conservative policies. Decision Transformer instead orders return-to-go, state, and action tokens and trains autoregressively. At inference, a desired return conditions action prediction. The method can stitch patterns through sequence generalization, but it cannot demand unsupported competence into existence.",
    situation: {
      title: "A trajectory becomes a conditional language",
      paragraphs: ["A dataset contains episodes with different total returns. For each time step, return-to-go records the remaining reward from that point. The model sees desired return, current state, and past action context, then predicts the demonstrated next action." ,"At deployment, the user supplies a target return. After each observed reward, the remaining target is reduced and the sequence window advances. A high target can select high-performing behavior patterns if the dataset contains them. An impossible target may produce arbitrary extrapolation." ,"Unlike standard Q-learning, the model does not explicitly learn a Bellman backup or maximize a critic. It is still sequential decision learning from return-labeled trajectories. Whether to call it RL depends on taxonomy; its training objective is supervised sequence modeling on offline data."],
    },
    diagram: {
      title: "Interleave goal, state, and action tokens", caption: "The ordering ensures return-to-go and state are available before action prediction. Context length determines how much history the transformer can use.",
      items: [
        { label: "Desired outcome", value: "R̂ₜ", note: "Remaining target return conditions behavior." },
        { label: "Observed state", value: "Sₜ", note: "Current environment information enters next." },
        { label: "Predicted action", value: "Aₜ", note: "Autoregressive model imitates actions compatible with context." },
        { label: "Update target", value: "R̂ₜ₊₁=R̂ₜ−rₜ₊₁", note: "Deployment rolls the desired remainder forward." },
      ],
    },
    workedExample: {
      title: "Roll a return-to-go target through two decisions",
      setup: "A user asks for target return 10. The first action receives reward 3, and the second receives reward 2.",
      prediction: "What target-return token should condition the model before each subsequent action?",
      steps: [
        { label: "Initial condition", calculation: "R̂₀=10", explanation: "The first action is predicted from desired return ten and initial state." },
        { label: "After reward three", calculation: "R̂₁=10−3=7", explanation: "The next action is conditioned on seven remaining desired reward." },
        { label: "After reward two", calculation: "R̂₂=7−2=5", explanation: "The running condition preserves the requested total as observed reward accumulates." },
        { label: "Support check", calculation: "look for training contexts near return 10", explanation: "If high-return trajectories are absent, the target token is an out-of-distribution request rather than evidence of feasibility." },
      ],
      result: "Return conditioning is a control interface, not an optimizer. Its reliability depends on trajectory coverage, context, target calibration, and sequence generalization.",
    },
    mechanism: {
      introduction: "Sequence modeling shifts emphasis from explicit dynamic programming to conditional trajectory modeling, while retaining offline distribution risks.",
      sections: [
        { title: "Return-to-go is computed from future rewards during training", paragraphs: ["The token uses information available from the completed logged trajectory. At inference, it becomes a user-specified condition and is updated only with observed rewards. This train-test difference should be made explicit."] },
        { title: "Causal attention respects action-time information", paragraphs: ["The model attends only to earlier tokens in the sequence. Positional or timestep embeddings distinguish time, and context windows truncate older history. Partial observability benefits from history only within this effective context."] },
        { title: "Action loss remains supervised", paragraphs: ["Discrete actions use cross-entropy; continuous actions often use regression or probabilistic likelihood. Training emphasizes actions appearing in the dataset, with no Bellman maximization over absent alternatives."] },
        { title: "Target return selection is a deployment decision", paragraphs: ["Choosing the dataset maximum can be brittle or invite extrapolation. Validation across achievable targets, uncertainty, and adaptive fallback policies is more defensible than one aspirational number." ] },
      ],
    },
    equations: [
      { latex: "\\hat R_t=\\sum_{k=t}^{T}r_k", read: "Return-to-go at time t is the sum of rewards remaining in the logged trajectory from t through the end.", meaning: "Training can calculate this quantity after an episode completes. Deployment supplies a desired value and subtracts observed rewards, so the condition is aspirational rather than known future evidence." },
      { latex: "\\min_\\theta\\mathbb{E}_{\\tau\\sim D}[-\\log p_\\theta(a_t\\mid\\hat R_{\\le t},s_{\\le t},a_{<t})]", read: "Decision Transformer minimizes action prediction loss conditioned on return-to-go and the preceding trajectory context.", meaning: "The objective is behavioral likelihood under offline data. Good control requires that return-conditioned contexts generalize to states the model induces during rollout." },
    ],
    boundary: {
      title: "A high target token is not a plan or a guarantee", paragraphs: ["The model may have never seen a feasible path from the current state to the requested return. It can emit an action statistically associated with high returns elsewhere while violating local dynamics." ,"Sequence models can memorize dataset artifacts, episode length, or reward leakage. Evaluation should vary target returns, initial states, context length, and dataset quality and compare against behavior cloning and offline RL baselines."],
    },
    nextBridge: "Whether a policy comes from conservative values or sequence modeling, a fixed dataset still cannot be spent recklessly on online trials. Off-policy evaluation estimates target performance from logged behavior using importance sampling, models, and doubly robust combinations.",
    sources: [{ label: "Chen et al. — Decision Transformer: Reinforcement Learning via Sequence Modeling", url: "https://proceedings.neurips.cc/paper/2021/hash/7f489f642a0ddb10272b5c31057f0663-Abstract.html", kind: "paper" }, { label: "Janner, Li, and Levine — Offline Reinforcement Learning as One Big Sequence Modeling Problem", url: "https://proceedings.neurips.cc/paper/2021/hash/099fe6b0b444c23836c4a5d07346082b-Abstract.html", kind: "paper" }],
  },
  {
    slug: "off-policy-evaluation",
    title: "Estimate target policies with importance sampling, FQE, and doubly robust methods",
    deck: "Off-policy evaluation asks what a target policy would achieve using data from another behavior policy. Every estimator trades assumptions, variance, model bias, and coverage.",
    openingQuestion: "How much can a fixed log tell us about a policy that would have made different decisions?",
    bridge: "Offline algorithms propose policies without executing them. OPE provides evidence before deployment. Direct importance sampling reweights observed trajectories, Fitted Q Evaluation learns a target-policy value model, and doubly robust estimators combine both so one component can correct some error in the other.",
    situation: {
      title: "A recommendation log records only displayed items",
      paragraphs: ["A behavior policy displayed item A with probability 0.8 and B with 0.2. A target policy reverses those probabilities. Logged rewards for B are rare and receive high importance weight. If behavior probability is missing or zero, the counterfactual cannot be recovered by reweighting." ,"Trajectory importance sampling multiplies ratios across time and can explode. Per-decision variants align ratios with rewards. Weighted importance sampling normalizes weights, reducing variance but introducing finite-sample bias." ,"FQE repeatedly fits Q for the fixed target policy using logged transitions, relying on function approximation and coverage. Doubly robust estimators use a value model as a baseline and importance-weighted residuals as correction. Confidence intervals must account for trajectories, dependence, estimator tuning, and repeated policy selection."],
    },
    diagram: {
      title: "Three OPE routes fail differently", caption: "Importance sampling relies on propensities and overlap, FQE relies on generalization and Bellman fit, and doubly robust methods depend on at least one component being reliable.",
      items: [
        { label: "IS", value: "reweight observed returns", note: "Low model bias, potentially extreme variance." },
        { label: "FQE", value: "fit Qπ on logged transitions", note: "Lower variance, model and extrapolation bias." },
        { label: "Doubly robust", value: "model + weighted residual", note: "Combines signals and their assumptions." },
        { label: "Gate", value: "support and uncertainty", note: "No estimator replaces missing action coverage." },
      ],
    },
    workedExample: {
      title: "Compute and interpret a two-step trajectory weight",
      setup: "At step one, target chose the logged action with probability 0.6 and behavior with 0.3. At step two, target probability is 0.2 and behavior probability 0.4. Logged return is 5.",
      prediction: "Will the full trajectory be upweighted or downweighted?",
      steps: [
        { label: "First ratio", calculation: "ρ₀=0.6/0.3=2", explanation: "The first action is more representative of the target." },
        { label: "Second ratio", calculation: "ρ₁=0.2/0.4=0.5", explanation: "The second action is less representative of the target." },
        { label: "Trajectory weight", calculation: "ρ=2×0.5=1", explanation: "The ratios cancel for this trajectory, so its return keeps unit weight." },
        { label: "Variance warning", calculation: "other trajectories may have ρ near 0 or very large", explanation: "A benign average weight says nothing about effective sample size or tail influence." },
      ],
      result: "Importance ratios are path-specific. Effective sample size, maximum weight, overlap by state, and confidence intervals are as important as the point estimate.",
    },
    mechanism: {
      introduction: "OPE is an estimation workflow with pre-specified policies and uncertainty, not a single metric computed after choosing the most flattering candidate.",
      sections: [
        { title: "Importance sampling uses known behavior propensities", paragraphs: ["Ratios convert the behavior measure to the target measure when sequential ignorability and support hold. Estimated propensities add another error source. Logging exact action probabilities is therefore a product requirement, not merely analysis metadata."] },
        { title: "FQE fixes the policy and learns its Bellman value", paragraphs: ["Targets average next actions under the target policy rather than maximize. Repeated regression uses the offline transition distribution. Cross-fitting and held-out Bellman diagnostics reduce overfitting but cannot validate unsupported regions." ] },
        { title: "Doubly robust estimators use control variates", paragraphs: ["A learned Q and V supply baseline predictions; weighted temporal residuals correct them using logged evidence. The estimator can remain consistent when either the model or propensity component is correct under appropriate conditions, not when both fail arbitrarily." ] },
        { title: "Policy selection consumes evaluation evidence", paragraphs: ["Testing many policies and reporting the best OPE estimate induces selection bias. Separate selection and final evaluation logs, simultaneous confidence bounds, or correction for multiple comparisons are needed for defensible claims." ] },
      ],
    },
    equations: [
      { latex: "\\hat V_{IS}(\\pi)=\\frac{1}{n}\\sum_{i=1}^n\\left(\\prod_{t=0}^{T_i-1}\\frac{\\pi(a_t^i|s_t^i)}{b(a_t^i|s_t^i)}\\right)G_i", read: "Trajectory importance sampling averages logged returns after multiplying every action's target-to-behavior probability ratio along the trajectory.", meaning: "The product is unbiased under strong conditions but can have enormous variance. Long horizons and deterministic target policies often worsen effective coverage." },
      { latex: "y=r+\\gamma\\mathbb{E}_{a'\\sim\\pi(\\cdot|s')}[Q_k(s',a')]", read: "FQE fits a fixed target policy by regressing current Q on reward plus its expected next action value under that same policy.", meaning: "Unlike Q-learning, FQE does not maximize over actions. Approximation quality and state-action support determine whether iteration estimates target-policy value reliably." },
    ],
    boundary: {
      title: "OPE narrows risk; it does not certify deployment", paragraphs: ["Hidden confounding, reward delay, behavior-policy changes, unlogged interventions, and unsupported target actions can invalidate all estimators. Agreement among methods that share the same blind spot is not independent confirmation." ,"A high lower confidence bound under historical data does not establish robustness to future users or strategic responses. Shadow deployment, staged experiments, stop conditions, and monitoring remain part of the evidence chain."],
    },
    nextBridge: "Fixed-data methods answer how to learn and evaluate without fresh exploration. The next part adds structural assumptions: temporal hierarchies reuse skills, multi-agent RL models interacting learners, and transfer or meta-learning seeks behavior that adapts across related tasks.",
    sources: [{ label: "Precup, Sutton, and Singh — Eligibility Traces for Off-Policy Policy Evaluation", url: "https://www.cs.mcgill.ca/~dprecup/publications/Iswc.pdf", kind: "paper" }, { label: "Jiang and Li — Doubly Robust Off-policy Value Evaluation", url: "https://proceedings.mlr.press/v48/jiang16.html", kind: "paper" }, { label: "Le et al. — Batch Policy Learning under Constraints", url: "https://proceedings.mlr.press/v97/le19a.html", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
