import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_EIGHT_ARTICLES = [
  {
    slug: "reward-design",
    title: "A score can rise while the real job gets worse",
    deck: "An agent follows the score we give it. If that score misses part of the real goal, better learning can produce worse real behavior.",
    openingQuestion: "If a support bot earns one point for closing a ticket, what stops it from closing hard tickets before the customer is helped?",
    bridge: "The last chapter showed how an agent can reuse old learning on a new task. Fast learning is useful only when the lesson points the right way. We now need to separate the result people want from the number the agent can see.",
    situation: {
      title: "The support bot learns to close the ticket, not solve the problem",
      paragraphs: [
        "Imagine a support bot that earns one point whenever a ticket closes. Easy tickets close after a useful answer. Hard tickets also close if the bot sends a polite goodbye. The score cannot tell those two endings apart.",
        "The real goal is a solved customer problem. Ticket closure is only a measurable stand-in. A stand-in like this is called a proxy. The agent does not know what we meant; it searches for actions that make the proxy larger.",
        "We can add smaller rewards for useful progress. That practice is called reward shaping. We can also learn a score from human choices. Both methods add guidance, but each new signal can contain a new shortcut.",
      ],
    },
    diagram: {
      title: "Ask four different questions before training",
      caption: "A reward is safer to inspect when the wanted result, measured score, hard rule, and outside check stay separate.",
      items: [
        { label: "Wanted result", value: "customer problem solved", note: "This is the result people actually care about." },
        { label: "Measured score", value: "ticket closed", note: "This is the signal the learner can receive quickly." },
        { label: "Hard rule", value: "do not fake a solution", note: "Some behavior should remain forbidden even when it raises the score." },
        { label: "Outside check", value: "reopens and human review", note: "A separate check tests whether the score still matches the real result." },
      ],
    },
    workedExample: {
      title: "Move some reward earlier without changing the route ranking",
      setup: "A path is S0→S1→Goal. Gamma is 0.9. The two task rewards are 0 and 10. Let Φ(S0)=0, Φ(S1)=4, and Φ(Goal)=0.",
      prediction: "Use F=gamma Φ(s′)−Φ(s). Does the shaped path keep the same discounted total?",
      steps: [
        { label: "First shaping term", calculation: "F(S0,S1)=0.9×4−0=3.6", explanation: "Reaching S1 receives an early signal of progress." },
        { label: "Second shaping term", calculation: "F(S1,Goal)=0.9×0−4=−4", explanation: "The earlier bonus is removed when the goal is reached." },
        { label: "Shaped rewards", calculation: "3.6 and 10−4=6", explanation: "The two rewards become 3.6 and 6." },
        { label: "Discounted shaped return", calculation: "3.6+0.9×6=9", explanation: "The original return is also 0+0.9×10=9." },
      ],
      result: "This special shaping rule moves information earlier while keeping this path's discounted total. A random progress bonus has no such promise.",
    },
    mechanism: {
      introduction: "Reward design is the job of checking whether a learnable score still points toward the result people want.",
      sections: [
        { title: "A proxy becomes less trustworthy when we push it hard", paragraphs: [
          "Ticket closure may match solved problems in ordinary records. Once the agent is paid for closure, it searches unusual cases too. The proxy can then separate from the goal.",
          "This pattern is often called Goodhart's law. In reinforcement learning, or RL, the bad behavior is also called specification gaming. The agent follows the written scoring rule while defeating its purpose.",
        ] },
        { title: "One kind of shaping keeps the old best policy", paragraphs: [
          "Potential-based reward shaping gives each state a helper number, written Φ. A move receives the discounted next helper number minus the current one. The added terms cancel across a full path under the required conditions.",
          "The discount, terminal treatment, and helper function must match the task. A bonus that merely looks similar may change which route is best. The theorem protects a precise formula, not every reward called progress.",
        ] },
        { title: "A learned reward is still a prediction", paragraphs: [
          "People can compare two behaviors when they cannot write a perfect formula. A reward model learns from those comparisons and predicts which new behavior people would prefer. The policy then searches for high predicted scores.",
          "That search can find odd outputs outside the examples people judged. Reviewers may also disagree or miss an affected group. High-scoring behavior still needs fresh human checks and real outcome measures.",
        ] },
        { title: "Some limits should not be sold for more points", paragraphs: [
          "A single total can let one good result pay for one forbidden result. For example, many fast answers might outweigh one deceptive closure. That trade may be unacceptable even when the average score rises.",
          "Keep quality, cost, safety, and fairness visible as separate measures. A hard rule can become a constraint or an action block. The next chapter explains those tools.",
        ] },
      ],
    },
    equations: [
      { latex: "F(s,a,s')=\\gamma\\Phi(s')-\\Phi(s)", read: "The shaping term is the discounted potential of the next state minus the potential of the current state.", meaning: "Under the theorem's conditions, these added terms cancel along a path. They can speed up learning without choosing a different optimal policy." },
      { latex: "R'=R+F", read: "The shaped reward equals the original task reward plus the shaping term.", meaning: "Log the two parts separately. Otherwise a rising training score may come only from the helper signal instead of better task results." },
    ],
    boundary: {
      title: "A high training reward proves only that the scorer was satisfied",
      paragraphs: [
        "It does not prove that customers benefited or that rare harmful behavior disappeared. Check complete trajectories, real outcomes, edge cases, and examples that were not used to train the score.",
        "Human feedback does not finish the problem. People can disagree, tire, or judge from missing context. Record uncertainty and keep an appeal path for important decisions.",
      ],
    },
    nextBridge: "A better reward can still allow one gain to pay for one serious harm. The next chapter separates average cost limits, rare bad outcomes, model changes, and rules that block an unsafe action.",
    sources: [{ label: "Ng, Harada, and Russell — Policy Invariance under Reward Transformations", url: "https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf", kind: "paper" }, { label: "Amodei et al. — Concrete Problems in AI Safety", url: "https://arxiv.org/abs/1606.06565", kind: "paper" }, SB],
  },
  {
    slug: "safe-robust-risk",
    title: "A good average can hide one terrible outcome",
    deck: "Two policies can look similar on average while one sometimes causes a disaster. Safety tools differ because they protect against different kinds of failure.",
    openingQuestion: "Would you choose a machine that usually earns 10 points if one run in a hundred loses 100 points?",
    bridge: "The last chapter separated the real goal from its score. Even a well-chosen score can hide harmful trades. We now ask four simpler questions: Is there a cost limit? Is the worst tail acceptable? Can the world change? Can a dangerous action be blocked?",
    situation: {
      title: "The average hides the bad one run in a hundred",
      paragraphs: [
        "Policy A always returns 8. Policy B returns 10 on ninety-nine runs and −100 on one run. B has the higher average, 8.9. A person responsible for safety may still choose A.",
        "One approach writes harm as a separate cost with a budget. This is called constrained reinforcement learning. Its formal task is a Constrained Markov Decision Process, or CMDP. Reward and cost remain two visible numbers.",
        "Another approach studies the worst part of the result distribution. This is risk-sensitive reinforcement learning. A common measure is Conditional Value at Risk, or CVaR. It averages the outcomes inside a chosen bad tail.",
      ],
    },
    diagram: {
      title: "Four tools protect four different things",
      caption: "A budget, a bad tail, an uncertain world, and a blocked action answer different safety questions.",
      items: [
        { label: "Cost limit", value: "expected cost ≤ budget", note: "This keeps an explicit cost channel below a stated limit." },
        { label: "Tail measure", value: "worst outcomes", note: "This changes how rare, severe losses affect the decision." },
        { label: "Model range", value: "several possible worlds", note: "This checks changes in physics, sensors, or other response rules." },
        { label: "Action shield", value: "block a forbidden move", note: "This rule acts before the learned action reaches the world." },
      ],
    },
    workedExample: {
      title: "The mean chooses B, but the worst one percent chooses A",
      setup: "Policy A returns 8 every time. Policy B returns 10 with probability 0.99 and −100 with probability 0.01.",
      prediction: "Which policy wins by expected return? Which wins when the worst one percent decides?",
      steps: [
        { label: "A mean", calculation: "E[A]=8", explanation: "Every outcome from A is 8 in this small example." },
        { label: "B mean", calculation: "E[B]=0.99×10+0.01×(−100)=8.9", explanation: "B wins when we compare only expected return." },
        { label: "One-percent CVaR", calculation: "CVaR0.01(B)=−100", explanation: "The worst one percent of B contains only the catastrophic result." },
        { label: "Decision", calculation: "mean prefers B; tail criterion prefers A", explanation: "The two rules value the same outcomes differently." },
      ],
      result: "There is no arithmetic disagreement. The decision changes because the safety question changes. A report must name that question and its threshold.",
    },
    mechanism: {
      introduction: "The phrase safe reinforcement learning, or safe RL, is too broad by itself. We must name the protected quantity, the time window, and where the protection acts.",
      sections: [
        { title: "A cost budget stays separate from reward", paragraphs: [
          "A CMDP asks for high expected reward while each expected cost stays below its budget. A Lagrangian method gives every broken budget an adjustable price. The price rises when training observes too much cost.",
          "This is still an average constraint. A few terrible paths may hide inside an acceptable expected cost. Training may also cross the limit while the price and policy adjust.",
        ] },
        { title: "A smaller update can reduce sudden budget jumps", paragraphs: [
          "Constrained Policy Optimization, or CPO, compares a proposed policy with the current one. It uses a trust region to keep the update nearby. It then seeks reward improvement while respecting an estimated cost limit.",
          "The guarantee uses local approximations and expected quantities. It does not make every path safe. Estimation error, line search, and code details still matter.",
        ] },
        { title: "Tail risk needs real tail data", paragraphs: [
          "CVaR focuses attention on the worst chosen fraction of returns. A one-percent tail needs many runs before its average becomes stable. With one hundred runs, only one result may fall inside that tail.",
          "Confidence intervals and the actual count of bad events should accompany the estimate. A model of the return distribution can organize the data. It cannot invent disasters that were never sampled.",
        ] },
        { title: "Robustness ends at the edge of the tested changes", paragraphs: [
          "Robust reinforcement learning trains for several possible environment rules. The set may include different friction, sensor noise, delays, or deliberate disturbances. The policy then prepares for the worst case inside that set.",
          "A narrow set misses real failures. A very wide set can make the agent needlessly timid. An action shield adds another layer by blocking moves that a verified rule marks unsafe.",
        ] },
      ],
    },
    equations: [
      { latex: "\\max_\\pi J_R(\\pi)\\quad\\text{subject to}\\quad J_{C_i}(\\pi)\\le d_i", read: "A constrained task maximizes expected reward while each expected cost stays below its budget.", meaning: "Reward and cost remain visible. Because the limit is an expectation, it does not automatically protect every single trajectory." },
      { latex: "\\mathcal L(\\pi,\\lambda)=J_R(\\pi)-\\sum_i\\lambda_i(J_{C_i}(\\pi)-d_i),\\quad\\lambda_i\\ge0", read: "The Lagrangian subtracts a multiplier-weighted budget violation from reward.", meaning: "Each multiplier acts like a changing price for breaking one budget. Noisy estimates and step sizes can make both policy and price swing." },
    ],
    boundary: {
      title: "A training objective is only one layer of a safety case",
      paragraphs: [
        "Real sensors fail, people behave unexpectedly, and attacks may sit outside the training set. Deployment still needs monitors, fallback control, stop rules, and human authority.",
        "Passing one robustness test supports only that test. State the change set, cost window, tail level, and action rules instead of using safe or robust as unlimited labels.",
      ],
    },
    nextBridge: "Every safety claim now depends on measurements. The next chapter asks how many runs we need, what uncertainty looks like, and why one lucky curve cannot speak for an algorithm.",
    sources: [{ label: "Achiam et al. — Constrained Policy Optimization", url: "https://proceedings.mlr.press/v70/achiam17a.html", kind: "paper" }, { label: "Tamar et al. — Policy Gradient for Coherent Risk Measures", url: "https://proceedings.neurips.cc/paper/2015/hash/64223ccf70bbb65a3a4aceac37e21016-Abstract.html", kind: "paper" }, SB],
  },
  {
    slug: "evaluation-reproducibility",
    title: "One lucky run is not a result you can trust",
    deck: "The same reinforcement-learning code can succeed once and fail next time. A fair report shows repeated runs, uncertainty, data use, compute, and failure cases.",
    openingQuestion: "If five runs score 0, 0, 80, 90, and 100, what do we learn by showing only the run that scored 100?",
    bridge: "The last chapter gave us costs, tails, and robustness tests. Those numbers still vary from run to run. We now need an experiment that separates a repeatable improvement from a lucky seed, a larger budget, or a hidden change in the task.",
    situation: {
      title: "Two algorithms can win at different points on the same graph",
      paragraphs: [
        "Algorithm A reaches 80 quickly and then stops improving. Algorithm B learns slowly and reaches 90 after ten times more environment steps. The final score favors B. A tight data budget may favor A.",
        "A random seed controls repeatable sources of randomness, such as the starting numbers and environment choices. Different seeds can lead to different experience. Several complete training runs show how much the result moves.",
        "A confidence interval gives a range for an estimated result. It does not promise where every future run will land. It also cannot repair three poorly chosen runs or many measurements copied from one run.",
      ],
    },
    diagram: {
      title: "A method claim needs four kinds of evidence",
      caption: "Score, data, compute, and uncertainty answer different questions. One final number cannot replace the other three.",
      items: [
        { label: "Behavior", value: "return and task outcomes", note: "Show what the policy did, including constraint failures." },
        { label: "Data", value: "environment steps", note: "Count how much experience produced each point on the curve." },
        { label: "Compute", value: "updates, time, and hardware", note: "More training and search can raise the winning score." },
        { label: "Uncertainty", value: "runs, intervals, and failures", note: "Keep ordinary variation and broken runs visible." },
      ],
    },
    workedExample: {
      title: "The mean, median, and failure rate tell different stories",
      setup: "A candidate has final returns [0, 0, 80, 90, 100]. A baseline has [60, 60, 60, 60, 60].",
      prediction: "Which method wins by mean, median, and chance of scoring below 50?",
      steps: [
        { label: "Candidate mean", calculation: "(0+0+80+90+100)/5=54", explanation: "The two failed runs pull the average below the baseline." },
        { label: "Candidate median", calculation: "median=80", explanation: "The middle ranked run makes the candidate look stronger." },
        { label: "Failure rate", calculation: "2/5=40% below 50", explanation: "Two of the five candidate runs fail the chosen threshold." },
        { label: "Baseline", calculation: "mean=median=60; failure rate=0", explanation: "The baseline scores less than the candidate median but never fails here." },
      ],
      result: "No summary is always best. Show the five results, name the decision rule, and report the failure threshold before choosing a winner.",
    },
    mechanism: {
      introduction: "A reproducible experiment lets another person rebuild the comparison and see how far the evidence really reaches.",
      sections: [
        { title: "A learning curve must travel with its budget", paragraphs: [
          "Plot results against environment steps. Sometimes also plot updates and wall-clock time. Time to reach a target, area under the curve, and final score answer different practical questions.",
          "Give the baseline a fair tuning budget and similar access to evaluation. If one method tries one hundred settings and another tries five, the comparison also measures search effort.",
        ] },
        { title: "The full run is the experimental unit", paragraphs: [
          "Ten evaluations inside one training run share the same learned policy and history. They are not ten independent training runs. Treating them that way makes uncertainty look smaller than it is.",
          "A common mean interval uses the t distribution when its assumptions are reasonable. RL results can be lopsided or heavy-tailed. Statistical bootstrap resampling and robust summaries may then be more useful.",
        ] },
        { title: "A middle-half average can steady the center", paragraphs: [
          "The Interquartile Mean, or IQM, removes the lowest and highest quarters before averaging. It is less controlled by extreme runs than an ordinary mean and uses more information than a median.",
          "IQM still leaves out the tails on purpose. Show failure rates, performance profiles, and raw run values when rare failures matter. A tidy center must not erase a dangerous edge.",
        ] },
        { title: "An ablation asks whether a component caused the gain", paragraphs: [
          "An ablation removes or replaces one part of a method. The changed version gets a fair training and tuning budget. The test should predict where that part ought to help.",
          "Code that runs again proves only that the pipeline can run there. Matching a score is stronger. Supporting the same conclusion across new implementations or tasks is stronger again.",
        ] },
      ],
    },
    equations: [
      { latex: "\\bar x\\pm t_{1-\\alpha/2,n-1}\\frac{s}{\\sqrt n}", read: "This classical confidence interval puts a t-scaled standard error around the sample mean.", meaning: "It assumes independent runs and a suitable sampling shape. The formula cannot turn too few runs, or repeated measurements from one run, into strong evidence." },
      { latex: "\\operatorname{IQM}(x)=\\operatorname{mean}(x_i\\;\\text{between the 25th and 75th percentiles})", read: "The interquartile mean averages the middle half after trimming the lowest and highest quarters.", meaning: "It reduces the pull of extreme values. Keep the discarded failures visible through raw results, tail measures, or failure rates." },
    ],
    boundary: {
      title: "A detectable difference may still be too small to matter",
      paragraphs: [
        "A tiny score gain can cost far more data, time, or engineering work. Report the size of the gain and the resources used, not only whether an interval excludes zero.",
        "A benchmark is a limited set of tasks and rules. Repeated tuning can overfit it. Success there supports a claim about that protocol, not every real deployment.",
      ],
    },
    nextBridge: "A careful experiment still depends on code that records the right problem. The next chapter shows how one flag, one wrapper, or one incomplete checkpoint can change the mathematics without changing the algorithm's name.",
    sources: [{ label: "Agarwal et al. — Deep Reinforcement Learning at the Edge of the Statistical Precipice", url: "https://proceedings.neurips.cc/paper/2021/hash/f514cec81cb148559cf475e7426eed5e-Abstract.html", kind: "paper" }, { label: "Henderson et al. — Deep Reinforcement Learning that Matters", url: "https://ojs.aaai.org/index.php/AAAI/article/view/11694", kind: "paper" }, SB],
  },
  {
    slug: "rl-systems",
    title: "Code can run and still teach the wrong problem",
    deck: "The environment, data store, checkpoint, and logs all shape what a reinforcement-learning program learns. One wrong end-of-episode flag can change every nearby target.",
    openingQuestion: "If a time limit stops our recording but the task could continue, should the learner pretend that all future value became zero?",
    bridge: "The last chapter assumed that every run repeated the same experiment. Software can break that assumption quietly. We now follow one experience from the environment, through data storage, into an update, and finally into a saved run.",
    situation: {
      title: "One boolean flag removes almost all of the next value",
      paragraphs: [
        "Suppose a simulator stops after 1,000 steps. The task itself could continue, but our data collection has a time limit. If the learner treats this stop as a true ending, it throws away the value after step 1,000.",
        "A true ending is called termination. A stop caused by an outside limit is called truncation. Modern environment interfaces return separate flags because the value target usually treats these two events differently.",
        "An environment Application Programming Interface, or API, defines the returned observation, reward, and flags. A wrapper is code that changes those values before training sees them. Wrapper order therefore becomes part of the learning problem.",
      ],
    },
    diagram: {
      title: "One experience crosses four contracts",
      caption: "Each layer can change the state, action, reward, timing, or evidence. Record what entered and left every layer.",
      items: [
        { label: "Environment", value: "reset and step", note: "This produces observations, rewards, and the two ending flags." },
        { label: "Wrappers", value: "ordered changes", note: "Scaling, stacking, clipping, and action repeats change what training receives." },
        { label: "Storage", value: "replay or trajectories", note: "The stored record must preserve order, source, and ending meaning." },
        { label: "Learner", value: "update and checkpoint", note: "The update, logs, and saved state should be traceable to the same run." },
      ],
    },
    workedExample: {
      title: "A wrong time-limit flag changes the target from 50.5 to 1",
      setup: "A transition is truncated by a time limit. Its reward is 1, gamma is 0.99, and the estimated next value is 50.",
      prediction: "How much target value disappears if truncation is treated as termination?",
      steps: [
        { label: "Correct target", calculation: "1+0.99×50=50.5", explanation: "The task could continue, so the next value remains in the target." },
        { label: "Incorrect terminal target", calculation: "1", explanation: "The wrong flag removes the complete continuation term." },
        { label: "Target bias", calculation: "50.5−1=49.5", explanation: "One boolean mistake removes 49.5 from this target." },
        { label: "Schema fix", calculation: "store terminated=false, truncated=true", explanation: "Two fields let later code rebuild the correct target." },
      ],
      result: "The program can run with either target, but only one matches this continuing task. Environment fields are mathematical inputs, not small bookkeeping details.",
    },
    mechanism: {
      introduction: "Systems work protects the meaning of the algorithm from the moment an action is sent until the run can be rebuilt.",
      sections: [
        { title: "The environment contract belongs to the mathematics", paragraphs: [
          "Test observation shapes, number types, action bounds, reward units, reset behavior, and both ending flags. Also test the last observation returned at an ending. A small mismatch can reach every later update.",
          "Wrappers may normalize observations, clip rewards, repeat actions, or stack frames. Each change can be useful. List their exact order and version so two projects with the same environment name still know whether they trained on the same task.",
        ] },
        { title: "Old experience lives in a changing database", paragraphs: [
          "A replay buffer stores old transitions for later learning. Its capacity, removal rule, priorities, and sequence boundaries decide which experience is sampled. Concurrent writers can change that mix again.",
          "Store episode identity, source policy, ending flags, and any probability needed by the algorithm. Test saving, loading, and sequence boundaries. Private trajectories also need access limits and a deletion policy.",
        ] },
        { title: "Saving only the network cannot resume learning", paragraphs: [
          "Network weights are only one part of a running learner. Optimizer state, target networks, replay position, normalizer values, counters, and random state can all change the next update.",
          "The random state is often held by a Random Number Generator, or RNG. Compare an uninterrupted run with a save-and-resume run. A file that loads successfully may still restart a different experiment.",
        ] },
        { title: "Logs should help explain a failure", paragraphs: [
          "Track reward parts, ending reasons, action limits, value scale, learning errors, gradient size, replay age, policy delay, constraint breaks, invalid numbers, and throughput. A single average return hides too many causes.",
          "Bind every run to its code, configuration, environment, and data format. A hash is a short identifier made from those versions. It helps find the same artifacts, but it cannot prove that they were correct.",
        ] },
      ],
    },
    equations: [
      { latex: "y=r+\\gamma(1-\\mathbf{1}_{terminated})V(s')", read: "The one-step target removes the next value only when the task truly terminates.", meaning: "A truncation may stop this recorded episode while the underlying task continues. Finite-horizon tasks need time represented in state and may define the ending differently." },
      { latex: "\\text{run identity}=\\operatorname{hash}(\\text{code},\\text{config},\\text{environment},\\text{data schema})", read: "A run identity combines versions of the code, configuration, environment, and stored data format.", meaning: "The identifier helps us retrieve the same ingredients. It does not replace tests, complete checkpoints, or proof that the ingredients were correct." },
    ],
    boundary: {
      title: "Passing tests is evidence about the tested properties",
      paragraphs: [
        "A unit test can prove that one target handles a time limit as intended. It cannot prove reward quality, human acceptance, or safety under every real condition. Keep those claims separate.",
        "More logs are not always better. User trajectories may contain private or harmful material. Collect only what the investigation needs, restrict access, and set a retention period.",
      ],
    },
    nextBridge: "We can now trace the path from a decision problem to a reproducible training run. The final part applies the same questions to language models, where a token can be an action and several very different training methods are often given the same RL label.",
    sources: [{ label: "Farama Gymnasium — Handling Time Limits", url: "https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/", kind: "official documentation" }, { label: "Patterson et al. — Empirical Design in Reinforcement Learning", url: "https://arxiv.org/abs/2304.01315", kind: "paper" }, SB],
  },
] satisfies readonly ChapterArticle[];
