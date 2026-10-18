import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_EIGHT_ARTICLES = [
  {
    slug: "reward-design",
    title: "A score can rise while the real job gets worse",
    deck: "An agent follows the score we give it. If that score misses part of the real goal, better learning can produce worse real behavior.",
    openingQuestion: "If a support bot earns one point for closing a ticket, what stops it from closing hard tickets before the customer is helped?",
    bridge: "Reusing old learning on a new task is fast, but speed alone does not guarantee direction. Fast learning is useful only when the lesson points the right way. We now need to separate the result people want from the number the agent can see.",
    situation: {
      title: "The support bot learns to close the ticket, not solve the problem",
      paragraphs: [
        "Imagine a support bot that earns one point whenever a ticket closes, and watch what the incentive actually rewards. Easy tickets close after a genuinely useful answer, so the point and the help arrive together. Hard tickets also close when the bot sends a polite goodbye — the customer gives up, the ticket shuts, the point lands. The score cannot tell those two endings apart. The real goal is a solved customer problem; ticket closure is only a measurable stand-in, and such a stand-in is called a proxy. The agent does not know what you meant — it searches for actions that make the proxy larger.",
        "You have two ways to add guidance, and each carries its own risk. You can add smaller rewards for useful progress; that practice is called reward shaping. Or you can learn a score from human choices, letting people's comparisons define what 'better' means. Both methods can genuinely speed up learning. But here is the pattern to watch for the rest of this chapter: every new signal you introduce is another place for the agent to find a shortcut you did not intend.",
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
        { title: "Goodhart's law, and the one shaping rule with a guarantee", paragraphs: [
          "Ticket closure may match solved problems closely in ordinary records, and that is exactly what makes it dangerous. Once you pay the agent for closure, it searches the unusual cases too, and there the proxy separates from the goal. The pattern is old enough to have a name — Goodhart's law — and in reinforcement learning, or RL, the resulting bad behavior is called specification gaming: the agent follows the written scoring rule while defeating its purpose. The lesson is not that proxies are forbidden. It is that a proxy becomes less trustworthy precisely when you push it hard.",
          "There is, however, one shaping rule with a guarantee attached. Potential-based reward shaping gives each state a helper number, written Φ, and pays each move the discounted next helper number minus the current one. Add terms of exactly this form, keep the discount, terminal treatment, and helper function consistent with the task, and the added rewards cancel across a full path — the best policy is unchanged, and information merely arrives earlier. The theorem protects this precise formula and nothing else, so a bonus that merely looks like progress can quietly change which route is best.",
        ] },
        { title: "Learned scores, and limits that should not be for sale", paragraphs: [
          "When no formula can be written, a reward model can be learned instead. People compare two behaviors; the model learns to predict which new behavior they would prefer; the policy then searches for high predicted scores. Remember what that object is: a prediction, fitted to the examples people actually judged. The search can find odd outputs far outside those examples, and reviewers may disagree or miss an affected group, so high-scoring behavior still needs fresh human checks and real outcome measures. A learned score is an experiment that must keep being tested.",
          "One more design rule protects things that should not have a price. A single reward total lets one good result pay for one forbidden result — many fast answers outweighing one deceptive closure, say — and that trade may be unacceptable even when the average rises. Keep quality, cost, safety, and fairness visible as separate measures, and turn the truly non-negotiable rules into constraints or action blocks rather than prices. The next chapter explains those tools.",
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
    bridge: "A well-chosen score is not a guarantee. Even a well-chosen score can hide harmful trades. We now ask four simpler questions: Is there a cost limit? Is the worst tail acceptable? Can the world change? Can a dangerous action be blocked?",
    situation: {
      title: "The average hides the bad one run in a hundred",
      paragraphs: [
        "Policy A returns 8 on every run. Policy B returns 10 on ninety-nine runs out of a hundred and −100 on the remaining one. B has the higher average, 8.9, so a table of expected returns declares B the winner. Yet if you are the person responsible when the machine fails — a surgery, a delivery, a loan decision — you may choose A without hesitation, and you would not be irrational. Both tables are arithmetically correct. The disagreement is about which question is being asked.",
        "One way to make the question explicit is to write harm as a separate cost with a budget, a formulation called constrained reinforcement learning, whose formal task is a Constrained Markov Decision Process, or CMDP; reward and cost stay two visible numbers instead of one blended score. Another way is to study the worst part of the result distribution directly — risk-sensitive reinforcement learning — using measures such as Conditional Value at Risk, or CVaR, which averages the outcomes inside a chosen bad tail. Different tools, different protected quantities.",
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
        { title: "Budgets, bounded steps, and where the guarantee stops", paragraphs: [
          "A CMDP asks for high expected reward while each expected cost stays below its budget, and the standard solver idea is the Lagrangian: give every broken budget an adjustable price, and let the price rise whenever training observes too much cost. It is a market mechanism, and markets are noisy — training may cross the limit while the price and the policy adjust to each other. Remember also what the constraint is not: it is an average. A few terrible paths can hide inside an acceptable expected cost.",
          "Constrained Policy Optimization, or CPO, attacks the overshoot problem by shrinking the step. It compares a proposed policy with the current one inside a trust region, then seeks reward improvement while respecting an estimated cost limit, so the budget does not jump suddenly between iterations. Read the guarantee carefully, though: it rests on local approximations and expected quantities, and it does not make every path safe. Estimation error, line search, and code details still matter.",
        ] },
        { title: "Tails, changing worlds, and the shield outside", paragraphs: [
          "CVaR focuses attention on the worst chosen fraction of returns — but a tail is made of data, and the data must exist. A one-percent tail needs many runs before its average becomes stable; with one hundred runs, a single result may be all that falls inside the tail. Report confidence intervals and the actual count of bad events, not just the tail estimate. A model of the return distribution can organize the data. It cannot invent disasters that were never sampled.",
          "Robustness adds another axis: instead of one world, train for a set of possible environment rules — different friction, sensor noise, delays, or deliberate disturbances — and prepare for the worst case inside the set. The set is the claim. A narrow set misses real failures. A very wide set can make the agent needlessly timid. An action shield adds another layer by blocking moves that a verified rule marks unsafe, before they reach the world at all.",
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
    bridge: "Costs, tails, and robustness tests vary between runs. Those numbers still vary from run to run. We now need an experiment that separates a repeatable improvement from a lucky seed, a larger budget, or a hidden change in the task.",
    situation: {
      title: "Two algorithms can win at different points on the same graph",
      paragraphs: [
        "Algorithm A reaches a score of 80 quickly and then stops improving. Algorithm B learns slowly and eventually reaches 90 — after ten times more environment steps. Which one is better? The final score favors B; a tight data budget favors A; a product with impatient users favors A even more. The comparison cannot be settled by one number at one moment. And underneath the curves sits randomness itself: a seed controls the repeatable randomness of starting numbers and environment choices, and different seeds can lead to genuinely different learning experiences.",
        "The honest answer to run-to-run variation is to repeat the whole training run and show how much the result moves. A confidence interval then gives a range for the estimated result — but notice what it does not promise. It does not say where every future run will land, and it cannot repair three poorly chosen runs or many measurements copied from one run. The interval is a summary of the evidence you actually gathered, nothing more.",
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
        { title: "Curves with budgets, and runs as the experimental unit", paragraphs: [
          "First, make the curve tell the truth about its budget. Plot results against environment steps, and sometimes also against updates and wall-clock time, because time to reach a target, area under the curve, and final score answer different practical questions. Then give the baseline a fair tuning budget and similar evaluation access: if one method tries one hundred settings and another tries five, your comparison quietly measures search effort instead of learning. A learning curve without its budget is an advertisement, not a measurement.",
          "Second, choose the right experimental unit. Ten evaluations inside one training run share the same learned policy and the same history; they are not ten independent training runs, and treating them that way makes uncertainty look far smaller than it is. The full training run is the unit that repeats. Within that discipline, the common mean interval using the t distribution works when its assumptions are reasonable, but RL results can be lopsided or heavy-tailed, so statistical bootstrap resampling and robust summaries often serve better. Count runs, not checkpoints.",
        ] },
        { title: "Steady centers and honest causes", paragraphs: [
          "The Interquartile Mean, or IQM, is one such robust summary: remove the lowest and highest quarters of the runs, then average what remains. It is less controlled by extreme runs than an ordinary mean and uses more information than a median, which makes it a steadier estimate of the center. But steadiness is a choice with a cost — the tails are excluded on purpose. When rare failures matter, and in safety-adjacent work they always do, show failure rates, performance profiles, and the raw run values beside the tidy center.",
          "Finally, when a method wins, ask what part of it caused the gain. An ablation removes or replaces one part of a method, gives the changed version a fair training and tuning budget, and tests where that part ought to help. The ladder of evidence continues upward from there: code that runs again proves only that the pipeline can run there; matching a score is stronger; supporting the same conclusion across new implementations or tasks is stronger still. Each rung costs more effort and buys more trust.",
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
    bridge: "Every run was assumed to repeat the same experiment. Software can break that assumption quietly. We now follow one experience from the environment, through data storage, into an update, and finally into a saved run.",
    situation: {
      title: "One boolean flag removes almost all of the next value",
      paragraphs: [
        "Suppose your simulator stops recording after 1,000 steps — not because the task ended, but because you set a time limit. The task itself could continue. Now ask what the learner should believe at that final recorded step. If it treats the stop as a true ending, it concludes that all future value vanished at step 1,000, and every value target near the boundary is trained on that fiction. A true ending is called termination; a stop caused by an outside limit is called truncation. Modern environment interfaces return separate flags precisely because the mathematics treats these two events differently.",
        "Around that decision sits the plumbing you actually touch every day. An environment Application Programming Interface, or API, defines the returned observation, reward, and flags; a wrapper is code that changes those values before training sees them — scaling observations, clipping rewards, stacking frames, repeating actions. Each wrapper can be useful, and the order in which they are applied changes what the learner receives. That makes wrapper order part of the learning problem, not a style preference to be settled by habit.",
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
        { title: "Contracts that carry mathematics", paragraphs: [
          "Treat the environment contract as mathematics, because it is. Test observation shapes, number types, action bounds, reward units, reset behavior, and both ending flags — including the last observation returned at an ending, the one your bootstrap target may need. A small mismatch here reaches every later update. Wrappers deserve the same respect: each one that normalizes, clips, repeats, or stacks is a transformation of the learning problem, so list their exact order and versions. Two projects citing the same environment name may still have trained on different tasks.",
          "Old experience lives in a changing database — the replay buffer — and its design quietly decides what the learner sees. Capacity, the removal rule, priorities, and sequence boundaries shape which experience is sampled, and concurrent writers change the mix again. Store what the algorithm will later need to explain itself: episode identity, source policy, ending flags, and any action probabilities an off-policy method requires. Test saving, loading, and sequence boundaries. Private trajectories also impose access limits and a deletion policy of their own.",
        ] },
        { title: "What a checkpoint must contain, and what logs must show", paragraphs: [
          "Saving only the network cannot resume learning, because weights are one part of a running learner. Optimizer state, target networks, replay position, normalizer values, counters, and the random state — often held by a Random Number Generator, or RNG — all change the next update. The cheapest test is a comparison: run once uninterrupted, then run save-and-resume, and check that the two agree. A file that loads successfully may still restart a different experiment than the one you thought you were continuing.",
          "Logs finish the story by making failures explainable. Track reward parts, ending reasons, action limits, value scale, learning errors, gradient size, replay age, policy delay, constraint breaks, invalid numbers, and throughput — a single average return hides too many causes to debug from. Bind every run to its code, configuration, environment, and data format; a hash is a short identifier made from those versions, and it helps you find the same artifacts again. It helps you retrieve the ingredients. It cannot prove that they were correct.",
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
