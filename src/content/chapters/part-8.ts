import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_EIGHT_ARTICLES = [
  {
    slug: "reward-design",
    title: "Design rewards without confusing the proxy for the goal",
    deck: "A reward is the learning interface, not the real-world objective itself. Shaping can accelerate learning, while misspecification can make capability amplify the wrong behavior.",
    openingQuestion: "If an agent earns a high score by ending customer conversations early, did it solve support or exploit the metric?",
    bridge: "Transfer and meta-learning can make a policy adapt quickly, which increases both usefulness and the speed at which it exploits a bad objective. Reliability begins before algorithm selection: define the desired outcome, the measurable proxy, the constraints that must not be traded away, and evidence that proxy improvement tracks real value.",
    situation: {
      title: "Resolution rate rewards the easiest closure, not necessarily the solved problem",
      paragraphs: ["A support agent receives +1 whenever a ticket closes. It learns to close difficult conversations after a polite final message. The proxy resolution rate rises while customers reopen cases or leave. The policy is not malfunctioning relative to reward; the reward is incomplete." ,"Reward shaping adds intermediate signals such as progress. Arbitrary shaping can change the optimal policy by making detours profitable. Potential-based shaping uses the discounted difference of a potential function and preserves optimal policies under standard MDP assumptions while changing learning speed." ,"Sparse human preferences, demonstrations, rule-based checks, and learned reward models provide alternative signals. They carry annotator inconsistency, distribution shift, and adversarial exploitability. Reward design is therefore an iterative measurement program with red teams and holdouts, not one final scalar authored at project start."],
    },
    diagram: {
      title: "Keep outcome, proxy, and constraints separate", caption: "A defensible system traces how measured reward relates to the real outcome and refuses to average hard constraints into a score that can be traded away.",
      items: [
        { label: "Real outcome", value: "customer problem solved", note: "What stakeholders actually value and later verify." },
        { label: "Proxy reward", value: "ticket closed", note: "Immediate measurable signal used for learning." },
        { label: "Constraint", value: "no deceptive closure", note: "A boundary that should not be bought with more reward." },
        { label: "Audit", value: "reopen rate + human review", note: "Tests whether proxy improvement transfers to outcome." },
      ],
    },
    workedExample: {
      title: "Compare ordinary shaping with policy-invariant shaping",
      setup: "A path has states S0→S1→Goal, gamma 0.9, task rewards 0 then 10. Let potential values be Φ(S0)=0, Φ(S1)=4, Φ(Goal)=0.",
      prediction: "Compute shaped rewards F=gamma Φ(s′)−Φ(s) and compare shaped total return with the original ordering.",
      steps: [
        { label: "First shaping term", calculation: "F(S0,S1)=0.9×4−0=3.6", explanation: "Progress to S1 receives an early positive signal." },
        { label: "Second shaping term", calculation: "F(S1,Goal)=0.9×0−4=−4", explanation: "Potential is removed when the goal is reached." },
        { label: "Shaped rewards", calculation: "3.6 and 10−4=6", explanation: "The learner receives progress evidence without simply adding free return." },
        { label: "Discounted shaped return", calculation: "3.6+0.9×6=9", explanation: "Original discounted return is 0+0.9×10=9; the trajectory's value ordering is preserved." },
      ],
      result: "Potential-based shaping redistributes learning signal while preserving the discounted objective under its assumptions. An arbitrary +3.6 progress bonus need not preserve policy ordering.",
    },
    mechanism: {
      introduction: "Reward reliability depends on specification, measurement, incentives, and the policy's ability to search for loopholes.",
      sections: [
        { title: "Proxies create Goodhart pressure", paragraphs: ["Once optimized, a metric's relationship with the underlying goal can weaken. Agents can find states outside the data used to validate the proxy. Reward audits should include adversarial behavior, edge cases, and outcome measures not used for training."] },
        { title: "Shaping should preserve the intended optimum", paragraphs: ["Potential-based shaping creates a telescoping adjustment under consistent gamma and terminal treatment. Even then, function approximation and exploration behavior may change, so empirical validation remains necessary."] },
        { title: "Learned rewards move specification into data", paragraphs: ["Preference or reward models generalize limited judgments to new outputs. Calibration, disagreement, annotator context, active sampling, and held-out adversarial sets determine whether the learned signal remains trustworthy." ] },
        { title: "Multi-objective tradeoffs should remain visible", paragraphs: ["Combining quality, cost, safety, and fairness into one weighted reward can hide unacceptable sacrifices. Pareto frontiers, lexicographic constraints, and separate dashboards preserve the decision for accountable reviewers." ] },
      ],
    },
    equations: [
      { latex: "F(s,a,s')=\\gamma\\Phi(s')-\\Phi(s)", read: "Potential-based shaping adds discounted next-state potential minus current-state potential to the task reward.", meaning: "The shaping terms telescope along a trajectory, preserving optimal policies under standard conditions. Terminal potentials and discount conventions must be handled consistently." },
      { latex: "R'=R+F", read: "The learner optimizes a shaped reward equal to the original task reward plus the shaping term.", meaning: "Separating R and F in logs makes it possible to see whether apparent progress comes from the real task outcome or only from the learning aid." },
    ],
    boundary: {
      title: "No reward is validated by training return alone", paragraphs: ["High reward establishes only that the policy found behavior scored highly by the implemented signal. It does not establish user benefit, safety, fairness, or causal impact." ,"Human feedback does not end the specification problem. Annotators can be inconsistent, manipulated, fatigued, or missing affected perspectives. Feedback governance and uncertainty are part of reward design."],
    },
    nextBridge: "Reward design states what to optimize. Some outcomes must instead be limited regardless of reward. The next chapter introduces constrained MDPs, Lagrangian updates, robustness, and risk-sensitive objectives that keep cost and tail behavior visible.",
    sources: [{ label: "Ng, Harada, and Russell — Policy Invariance under Reward Transformations", url: "https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf", kind: "paper" }, { label: "Amodei et al. — Concrete Problems in AI Safety", url: "https://arxiv.org/abs/1606.06565", kind: "paper" }, SB],
  },
  {
    slug: "safe-robust-risk",
    title: "Separate safe, constrained, robust, and risk-sensitive RL",
    deck: "Expected return can improve while rare harm, budget violations, or model uncertainty worsen. Safety families change different parts of the objective and should not be collapsed into one label.",
    openingQuestion: "If a policy has the best average reward but a one-percent chance of catastrophic loss, what optimization problem should it solve?",
    bridge: "A reward proxy can be corrected and still permit harmful tradeoffs. Constrained RL tracks expected costs against budgets. Risk-sensitive RL changes how outcome distributions are valued. Robust RL optimizes against uncertainty sets or adversarial disturbances. Runtime shields restrict actions regardless of learned preference.",
    situation: {
      title: "Average performance hides a dangerous tail",
      paragraphs: ["Policy A always returns 8. Policy B returns 10 with probability 0.99 and −100 with probability 0.01. B's expected return is 8.9, yet a safety-critical operator may reject its tail loss. Mean optimization alone cannot express that decision." ,"A constrained MDP maximizes reward subject to expected cumulative cost limits. Lagrangian methods attach multipliers to violations, converting the constrained problem into a saddle-point optimization. Constrained Policy Optimization approximates trust-region updates that satisfy constraints locally." ,"CVaR focuses on the worst alpha fraction of outcomes. Distributional critics can support tail estimates, while robust MDPs plan against sets of plausible transitions. Shields or control-barrier functions enforce action-level safety using verified models. These approaches protect different failure surfaces and can be combined."],
    },
    diagram: {
      title: "Safety questions live at different layers", caption: "A cost budget, a tail-risk objective, model uncertainty, and a runtime action rule are not interchangeable even when all reduce accidents.",
      items: [
        { label: "Constraint", value: "E[cumulative cost]≤d", note: "Limits an explicit cost channel." },
        { label: "Risk", value: "CVaR / utility", note: "Changes preference over the outcome distribution." },
        { label: "Robustness", value: "worst case over model set", note: "Protects against specified uncertainty in dynamics or observations." },
        { label: "Shield", value: "override unsafe action", note: "Enforces a runtime rule independent of learned value." },
      ],
    },
    workedExample: {
      title: "Compare mean return with a worst-tail decision",
      setup: "Policy A returns 8 always. Policy B returns 10 with probability 0.99 and −100 with probability 0.01.",
      prediction: "Which policy wins by expected return and which wins if the worst one percent is decisive?",
      steps: [
        { label: "A mean", calculation: "E[A]=8", explanation: "There is no return variance in this simplified policy." },
        { label: "B mean", calculation: "E[B]=0.99×10+0.01×(−100)=8.9", explanation: "B wins on expected return despite its catastrophic branch." },
        { label: "One-percent CVaR", calculation: "CVaR0.01(B)=−100", explanation: "The average of the worst one percent is the catastrophic loss." },
        { label: "Decision", calculation: "mean prefers B; tail criterion prefers A", explanation: "The objective, not arithmetic error, creates the different policy ordering." },
      ],
      result: "Safety requires an explicit decision criterion and threshold. Reporting only average return erases the value judgment that policy selection actually uses.",
    },
    mechanism: {
      introduction: "Safe RL is an umbrella; defensible implementations name the protected quantity, timescale, uncertainty set, and enforcement point.",
      sections: [
        { title: "CMDPs keep reward and cost separate", paragraphs: ["A policy maximizes expected return while one or more expected discounted costs stay below budgets. Multiplier updates penalize observed violations, but finite training can violate constraints and oscillate. Feasibility and initialization matter."] },
        { title: "CPO seeks locally feasible improvements", paragraphs: ["CPO uses surrogate reward and cost objectives with a trust region. Its theoretical bound relies on approximations and expected constraints, not per-trajectory immunity. Implementation accuracy and line search determine practical behavior."] },
        { title: "Risk-sensitive objectives inspect distributions", paragraphs: ["Variance penalties, exponential utility, quantiles, and CVaR encode different preferences. Tail estimates need many samples and careful confidence intervals; rare-event simulation or importance sampling may be required."] },
        { title: "Robustness is relative to an uncertainty set", paragraphs: ["Adversarial training, domain randomization, and robust MDPs protect against specified perturbations. Oversized sets produce over-conservative behavior; undersized sets provide false reassurance. The set needs empirical and domain justification." ] },
      ],
    },
    equations: [
      { latex: "\\max_\\pi J_R(\\pi)\\quad\\text{subject to}\\quad J_{C_i}(\\pi)\\le d_i", read: "A constrained MDP maximizes expected reward return while keeping each expected cost return below its budget.", meaning: "Costs remain visible rather than being hidden in a weighted reward. Expected constraints do not automatically prevent individual trajectory violations." },
      { latex: "\\mathcal L(\\pi,\\lambda)=J_R(\\pi)-\\sum_i\\lambda_i(J_{C_i}(\\pi)-d_i),\\quad\\lambda_i\\ge0", read: "A Lagrangian subtracts multiplier-weighted constraint violations from reward and optimizes policy and multipliers in opposite directions.", meaning: "Multipliers act as adaptive prices for violated budgets. Step sizes and estimation noise can cause oscillation, so actual constraint curves must be reported." },
    ],
    boundary: {
      title: "A safe-training objective is not a deployment safety case", paragraphs: ["Expected training constraints can fail under distribution shift, sensor faults, or adversarial conditions. Runtime monitors, fallback controllers, human authority, incident response, and staged rollout remain necessary." ,"Robustness to one perturbation can worsen another and reduce useful performance. A single adversarial benchmark cannot justify the broad label robust."],
    },
    nextBridge: "Safety criteria define what should be measured. The next chapter asks how to measure it honestly: seeds, confidence intervals, learning curves, ablations, environment versions, and benchmark limits.",
    sources: [{ label: "Achiam et al. — Constrained Policy Optimization", url: "https://proceedings.mlr.press/v70/achiam17a.html", kind: "paper" }, { label: "Tamar et al. — Policy Gradient for Coherent Risk Measures", url: "https://proceedings.neurips.cc/paper/2015/hash/64223ccf70bbb65a3a4aceac37e21016-Abstract.html", kind: "paper" }, SB],
  },
  {
    slug: "evaluation-reproducibility",
    title: "Evaluate RL with seeds, intervals, curves, ablations, and benchmark limits",
    deck: "RL results vary across random seeds, data budgets, environment versions, and implementation details. A final average score cannot carry all the evidence a method claim needs.",
    openingQuestion: "If one run reaches a record score and four fail, is the algorithm better?",
    bridge: "Reward and safety chapters defined outcomes and constraints. Evaluation determines whether observed improvements are repeatable, data-efficient, computationally justified, and caused by the proposed mechanism rather than a hidden protocol change.",
    situation: {
      title: "Two algorithms cross at different data budgets",
      paragraphs: ["Algorithm A learns quickly and plateaus at 80. Algorithm B learns slowly and reaches 90 after ten times more environment interaction. Reporting only final score favors B; reporting early sample efficiency favors A. Deployment may care about real-world data cost, wall-clock latency, or asymptotic quality." ,"Random initialization, environment seeds, exploration, replay order, and hardware nondeterminism create run variation. A small number of seeds can be dominated by luck. Confidence intervals, stratified bootstrap methods, robust aggregate metrics, and full learning curves communicate uncertainty better than mean plus one standard deviation." ,"Ablations remove or replace components to test causal contribution. Hyperparameter budgets must be comparable. Environment names need versions, wrappers, termination rules, and evaluation policies. Public benchmarks can be overfit through repeated tuning even without gradient access."],
    },
    diagram: {
      title: "A method claim needs four evidence axes", caption: "Outcome, data, compute, and uncertainty answer different questions. Collapsing them into one score invites accidental or strategic cherry-picking.",
      items: [
        { label: "Outcome", value: "return + task metrics + constraints", note: "What behavior achieved, not only proxy reward." },
        { label: "Data", value: "environment steps / trajectories", note: "Sample efficiency and coverage cost." },
        { label: "Compute", value: "updates, FLOPs, wall time, hardware", note: "Search and training budgets affect comparison." },
        { label: "Uncertainty", value: "seeds, intervals, IQM, failures", note: "Variation and catastrophic runs remain visible." },
      ],
    },
    workedExample: {
      title: "Compare mean, median, and failure rate",
      setup: "Five final returns are [0, 0, 80, 90, 100]. A baseline has [60, 60, 60, 60, 60].",
      prediction: "Which method wins by mean, median, and probability of scoring below 50?",
      steps: [
        { label: "Candidate mean", calculation: "(0+0+80+90+100)/5=54", explanation: "The large successes do not fully offset two failures." },
        { label: "Candidate median", calculation: "median=80", explanation: "The middle run is strong and makes the typical-ranked result look favorable." },
        { label: "Failure rate", calculation: "2/5=40% below 50", explanation: "A deployment-sensitive metric exposes instability hidden by the median." },
        { label: "Baseline", calculation: "mean=median=60; failure rate=0", explanation: "The preferred algorithm depends on the stated objective and risk tolerance." },
      ],
      result: "No single aggregate answers every decision. Raw seed outcomes, curves, and predeclared metrics let readers see the tradeoff rather than inherit the author's preferred summary.",
    },
    mechanism: {
      introduction: "Reproducibility starts with a complete protocol and ends with claims limited to the evidence actually gathered.",
      sections: [
        { title: "Learning curves are paired with budgets", paragraphs: ["Plot return and constraint metrics against environment steps, gradient updates, and sometimes wall time. Area under curve, time to threshold, and final performance describe different operational goals." ] },
        { title: "Intervals need independent experimental units", paragraphs: ["Transitions within one run are not independent seeds. Bootstrap and statistical tests should resample at the run or task level appropriate to the claim. Many-task suites need stratification so easy high-scale tasks do not dominate." ] },
        { title: "Ablations test mechanisms, not decoration", paragraphs: ["Remove one component while retuning fairly enough to avoid handicapping the variant. Add positive controls, matched parameter counts, and compute reporting. Interactions may require factorial rather than one-at-a-time ablations." ] },
        { title: "Reproduction distinguishes code, result, and conclusion", paragraphs: ["Running released code confirms a pipeline under one environment; matching a number confirms a result within tolerance; supporting the broad conclusion across implementations and tasks requires stronger independent evidence." ] },
      ],
    },
    equations: [
      { latex: "\\bar x\\pm t_{1-\\alpha/2,n-1}\\frac{s}{\\sqrt n}", read: "A classical confidence interval places a t-scaled standard error around a sample mean under independence and approximate distribution assumptions.", meaning: "RL seed distributions can be skewed or heavy-tailed, so bootstrap intervals and robust metrics may be preferable. The formula does not rescue too few or non-independent runs." },
      { latex: "\\operatorname{IQM}(x)=\\operatorname{mean}(x_i\\;\\text{between the 25th and 75th percentiles})", read: "The interquartile mean averages the central half of outcomes after trimming the lowest and highest quarters.", meaning: "IQM reduces sensitivity to extreme runs while retaining more information than the median. Failure rates and raw distributions should still accompany it when tails matter." },
    ],
    boundary: {
      title: "Statistical significance is not practical or deployment significance", paragraphs: ["A tiny benchmark improvement can be statistically detectable and operationally irrelevant. Effect size, data cost, compute, risk, and implementation complexity determine value." ,"Benchmarks encode narrow task distributions and can contain exploitable bugs. Strong benchmark evidence supports a bounded claim under that protocol, not general intelligence or real-world safety."],
    },
    nextBridge: "A rigorous metric plan still depends on a training system that records what happened. The next chapter treats environment APIs, wrappers, seeding, replay, checkpoints, logging, and monitoring as parts of algorithmic correctness.",
    sources: [{ label: "Agarwal et al. — Deep Reinforcement Learning at the Edge of the Statistical Precipice", url: "https://proceedings.neurips.cc/paper/2021/hash/f514cec81cb148559cf475e7426eed5e-Abstract.html", kind: "paper" }, { label: "Henderson et al. — Deep Reinforcement Learning that Matters", url: "https://ojs.aaai.org/index.php/AAAI/article/view/11694", kind: "paper" }, SB],
  },
  {
    slug: "rl-systems",
    title: "Build environments and training systems that preserve algorithm meaning",
    deck: "An RL algorithm is inseparable from its environment API, wrappers, data pipeline, checkpoints, and observability. A silent terminal flag or stale recurrent state can change the mathematics without changing the method name.",
    openingQuestion: "What evidence proves that the code is training the MDP described in the paper rather than a subtly different one?",
    bridge: "Evaluation can detect instability only if the system records the right quantities and can reproduce the run. This chapter connects environment contracts to data schemas, replay, seeding, checkpointing, distributed health, and deployment monitoring so that algorithmic claims survive implementation.",
    situation: {
      title: "One boolean done flag changes every target near a time limit",
      paragraphs: ["An environment ends after 1,000 steps and returns done=true. The trainer sets every bootstrap to zero. If the task is continuing and the limit is only computational, the learner systematically underestimates states near the cutoff." ,"Wrappers may normalize observations, clip rewards, stack frames, repeat actions, change reset distribution, or terminate on life loss. These transforms define the effective MDP and must be ordered and versioned. Two projects using the same environment name can train on different tasks." ,"A robust system stores transitions with termination and truncation separately, policy version, behavior probability when needed, recurrent-state context, episode ID, and provenance. Checkpoints include optimizer, replay or data cursor, normalizer statistics, RNG state, and configuration—not only network weights."],
    },
    diagram: {
      title: "Correctness flows through the whole training pipeline", caption: "Each layer can alter state, reward, action, timing, or evidence. Versioned contracts and read-back diagnostics keep these transformations visible.",
      items: [
        { label: "Environment", value: "reset / step contract", note: "Defines observations, rewards, termination, truncation, and info." },
        { label: "Wrappers", value: "ordered transforms", note: "Normalization, stacking, clipping, and action mapping modify the task." },
        { label: "Storage", value: "replay / trajectories", note: "Schema preserves causal order, provenance, probabilities, and flags." },
        { label: "Learner and monitor", value: "updates + diagnostics", note: "Checkpoints, metrics, alerts, and evaluation support recovery and audit." },
      ],
    },
    workedExample: {
      title: "Calculate the bias from a misread time limit",
      setup: "At a truncated transition, reward is 1, gamma 0.99, and estimated next value is 50. Compare the correct continuing target with a target that treats truncation as terminal.",
      prediction: "How much target value disappears because of one incorrect flag?",
      steps: [
        { label: "Correct target", calculation: "1+0.99×50=50.5", explanation: "The underlying task continues, so future value remains." },
        { label: "Incorrect terminal target", calculation: "1", explanation: "Zero bootstrap discards all continuation evidence." },
        { label: "Target bias", calculation: "50.5−1=49.5", explanation: "The implementation error overwhelms many algorithmic refinements." },
        { label: "Schema fix", calculation: "store terminated=false, truncated=true", explanation: "Target construction can then distinguish task semantics from data-collection limits." },
      ],
      result: "Environment contracts are mathematical inputs. A unit test for termination semantics can protect more validity than an untested algorithm extension.",
    },
    mechanism: {
      introduction: "RL systems engineering is evidence engineering: preserve which policy acted, what it observed, what happened next, and which transformations intervened.",
      sections: [
        { title: "Environment APIs need executable contracts", paragraphs: ["Validate spaces, action bounds, reward types, reset determinism, terminal observations, time limits, and illegal actions. Property tests can assert that absorbing states do not bootstrap and seeded replicas match where determinism is promised." ] },
        { title: "Replay is a stateful database", paragraphs: ["Capacity, eviction, prioritization, sequence boundaries, compression, and sampling concurrency change the training distribution. Persisting or reconstructing replay affects resume equivalence. Sensitive trajectories require access and retention controls." ] },
        { title: "Checkpoints must recover learning state", paragraphs: ["Optimizer moments, target networks, temperature parameters, normalizers, curriculum stage, RNG streams, counters, and configuration hashes determine the next update. Weight-only recovery can silently create a new experiment." ] },
        { title: "Observability connects symptoms to causes", paragraphs: ["Track reward components, episode endings, action saturation, value scale, TD errors, entropy, KL, gradient norms, replay age, policy lag, constraint violations, NaNs, throughput, and evaluator health. Alerts need actionable thresholds and preserved traces." ] },
      ],
    },
    equations: [
      { latex: "y=r+\\gamma(1-\\mathbf{1}_{terminated})V(s')", read: "A correct one-step target removes continuation value only when the task truly terminates.", meaning: "The truncation flag controls reset and data collection but normally does not appear in this terminal mask. Finite-horizon tasks may include remaining time in state and define termination differently." },
      { latex: "\\text{run identity}=\\operatorname{hash}(\\text{code},\\text{config},\\text{environment},\\text{data schema})", read: "A reproducible run identity combines versioned code, configuration, environment, and data-contract information.", meaning: "A model checkpoint without these dependencies is not a self-contained experimental record. Hashes identify artifacts but do not prove their correctness." },
    ],
    boundary: {
      title: "Passing tests does not prove real-world quality", paragraphs: ["Unit tests and deterministic smoke runs establish implementation properties. They do not prove reward validity, policy robustness, human acceptance, or production safety. Evidence layers must be labeled separately." ,"Excess logging can expose private user trajectories, proprietary environments, or unsafe actions. Observability needs minimization, access control, aggregation, and retention policies alongside technical usefulness."],
    },
    nextBridge: "The foundation is now complete from decision problem through reliable training systems. The final part applies these distinctions to language models, where tokens are actions, feedback pipelines are easily conflated, and many preference objectives are called RL even when no online policy interaction occurs.",
    sources: [{ label: "Farama Gymnasium — Handling Time Limits", url: "https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/", kind: "official documentation" }, { label: "Patterson et al. — Empirical Design in Reinforcement Learning", url: "https://arxiv.org/abs/2304.01315", kind: "paper" }, SB],
  },
] satisfies readonly ChapterArticle[];
