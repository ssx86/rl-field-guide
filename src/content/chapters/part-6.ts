import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_SIX_ARTICLES = [
  {
    slug: "behavior-cloning-dagger",
    title: "Copy an expert, then learn how to recover from your own mistakes",
    deck: "An expert can show a robot what to do on a good route. The robot also needs examples of what to do after it drifts away from that route.",
    openingQuestion: "If a robot copies the expert correctly 99 times out of 100, why can a long trip still fail so often?",
    bridge: "Rewards and imagined worlds are not the only teachers. Sometimes we already have recordings of good behavior. We can begin by copying them. The difficulty starts when the copy makes one small mistake and reaches a place that the expert never showed.",
    situation: {
      title: "The driving lesson contains the center of the lane, but not the edge",
      paragraphs: [
        "A skilled driver records camera pictures and steering actions while staying near the center of a lane. We can train a policy to predict the driver's action from each picture. This direct copying method is called Behavior Cloning, or BC.",
        "Now let the copied policy drive. One small steering error moves the car toward the lane edge. Pictures from the edge were rare in the lesson, so the next prediction may be worse. The policy's own action has changed the kind of picture it must answer next.",
        "Dataset Aggregation, or DAgger, adds the missing recovery lessons. The learner drives, the expert labels the states that the learner actually reaches, and those new examples join the training set. This helps, but learner driving and repeated expert help may be costly or unsafe.",
      ],
    },
    diagram: {
      title: "One mistake separates the lesson from the real trip",
      caption: "Behavior Cloning learns from expert states. DAgger adds labels for states created by the learner's own actions.",
      items: [
        { label: "Watch", value: "expert state and action", note: "Record what the expert sees and does on successful trips." },
        { label: "Copy", value: "predict the expert action", note: "Learn the action that usually goes with each recorded state." },
        { label: "Drive", value: "visit learner states", note: "A small mistake may create a state missing from the lesson." },
        { label: "Ask again", value: "expert recovery action", note: "Add an expert answer for the learner's new state." },
      ],
    },
    workedExample: {
      title: "A 1% step error becomes a much larger trip error",
      setup: "In a simplified 100-step task, suppose each decision is correct with probability 0.99. Also suppose that any wrong decision ends success and that the errors are independent.",
      prediction: "Is the chance of getting all 100 decisions right closer to 99%, 90%, or 36%?",
      steps: [
        { label: "Check one step", calculation: "P(correct)=0.99", explanation: "For one familiar state, a 99% success rate looks excellent." },
        { label: "Check the whole trip", calculation: "P(all correct)=0.99¹⁰⁰≈0.366", explanation: "All 100 steps must be correct. Their combined chance is only about 36.6%." },
        { label: "Remember the changed states", calculation: "errors need not remain 1% after leaving the expert's state distribution", explanation: "After the first mistake, later states may be unfamiliar. The next error rate can become larger than 1%." }, // Marcus P0 fix: typo "dexpert" -> "the expert's state distribution"
        { label: "Add recovery lessons", calculation: "add (learner state, expert recovery action)", explanation: "DAgger asks the expert what to do in states produced by the learner's mistakes." },
      ],
      result: "Even the friendly calculation gives only a 36.6% chance of a perfect trip. Real driving may be worse because one error changes the later pictures. A one-step score is therefore not a long-trip guarantee.",
    },
    mechanism: {
      introduction: "The main question is simple: which states supplied the training questions, and which states will appear when the learner takes control?",
      sections: [
        { title: "Behavior Cloning learns an answer key from demonstrations", paragraphs: [
          "For a small set of actions, the model can learn a probability for each action. For steering, it can learn a range or a probability distribution. In both cases, the expert action is treated like the answer on a training worksheet.",
          "This is supervised learning. It uses no reward and does not become reinforcement learning just because the trained policy later acts many times in a row.",
        ] },
        { title: "The learner creates a different collection of states", paragraphs: [
          "Training pictures came from expert driving. Deployment pictures come from learner driving. When those two collections differ, researchers call the problem covariate shift.",
          "Here the shift is part of a feedback loop. The learner chooses an action, the action changes the next state, and that new state becomes the learner's next question. Ordinary test accuracy hides this loop.",
        ] },
        { title: "DAgger collects answers where the learner is confused", paragraphs: [
          "DAgger repeats a cycle. Run the current learner, record the states it reaches, ask the expert for good actions there, add the answers, and train again. Early runs may mix expert and learner control for safety.",
          "The added data follows the learner as it changes. It teaches recovery instead of merely adding more perfect trips down the center of the lane.",
        ] },
        { title: "Two good experts may choose different actions", paragraphs: [
          "A blocked path may be safe to pass on the left or on the right. Averaging those two steering actions could point straight at the obstacle. The disagreement is not necessarily a labeling error.",
          "The policy may need to represent several possible actions or receive an extra clue about the expert's intention. Data quality includes this kind of choice, not only the number of recordings.",
        ] },
      ],
    },
    equations: [
      { latex: "\\hat\\pi=\\arg\\min_{\\pi}\\mathbb{E}_{(s,a)\\sim D_E}[-\\log\\pi(a\\mid s)]", read: "Choose the policy that gives high probability to the actions in the expert dataset.", meaning: "The average is taken over states visited by the expert. A small loss proves a good fit there, not in states created by the learner's mistakes." },
      { latex: "D_{k+1}=D_k\\cup\\{(s,\\pi_E(s)):s\\sim d_{\\pi_k}\\}", read: "DAgger adds the expert's action for states visited by the current learner.", meaning: "The dataset grows toward the learner's real problems. Doing this requires a safe learner run and an expert who can answer those new cases." },
    ],
    boundary: {
      title: "A demonstration shows an action, not every reason or safety rule behind it",
      paragraphs: [
        "A copied policy can learn a shortcut that happened to match the expert recordings. Tests should include changed backgrounds, recovery states, and cases where the shortcut stops working.",
        "DAgger is a poor fit when an early learner can cause serious harm or when no expert can label new states. A simulator, a safety controller, or a method that stays close to recorded actions may be needed instead.",
      ],
    },
    nextBridge: "The expert's actions tell us what happened, but not always what the expert was trying to protect. The next chapter asks whether a goal can be guessed from demonstrations, and why that guess is rarely unique.",
    sources: [{ label: "Ross, Gordon, and Bagnell — A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning", url: "https://proceedings.mlr.press/v15/ross11a.html", kind: "paper" }, { label: "Pomerleau — ALVINN: An Autonomous Land Vehicle in a Neural Network", url: "https://papers.nips.cc/paper/95-alvinn-an-autonomous-land-vehicle-in-a-neural-network", kind: "paper" }, SB],
  },
  {
    slug: "inverse-rl-gail",
    title: "Watching a choice does not tell us the one true reason for it",
    deck: "A demonstration can rule out some goals, but several goals may still explain the same behavior. Some methods learn a possible reward. Others only try to behave like the expert.",
    openingQuestion: "A driver takes the longer road. Was the driver avoiding danger, saving fuel, following a rule, or simply choosing a familiar route?",
    bridge: "Behavior Cloning copies actions. DAgger adds recovery examples. Neither method explains why the expert chose those actions. If the road changes, a reason could help the agent make a new choice. The trouble is that one observed choice can fit many different reasons.",
    situation: {
      title: "One route can fit several stories",
      paragraphs: [
        "Imagine that a driver avoids a short road across a field. Perhaps the field is dangerous. Perhaps the paved road uses less energy. Perhaps leaving the road is against the rules. The same route supports all three stories.",
        "A method can search for a reward that would make the expert's behavior look sensible. This is called Inverse Reinforcement Learning, or IRL. It works backward from behavior to a possible goal instead of starting with a known reward.",
        "IRL does not uncover a label hidden inside the demonstration. Different rewards can lead to the same best action. More demonstrations can remove some explanations, but they may still leave several answers.",
      ],
    },
    diagram: {
      title: "Three questions use the same demonstrations in different ways",
      caption: "Copying an action, proposing a reward, and matching a pattern of visits are three different promises.",
      items: [
        { label: "Copy", value: "state → expert action", note: "Behavior Cloning predicts the action shown in the lesson." },
        { label: "Explain", value: "trip → possible reward", note: "IRL looks for a reward that could make the trip sensible." },
        { label: "Allow variety", value: "several likely trips", note: "Keep several good routes instead of forcing one perfect route." },
        { label: "Match behavior", value: "similar visits and actions", note: "Learn to resemble the expert without claiming one true reward." },
      ],
    },
    workedExample: {
      title: "One route comparison gives a range of possible weights",
      setup: "The expert route has time 10 and risk 1. Another route has time 8 and risk 3. Score a route by negative cost: −wtime×time−wrisk×risk.",
      prediction: "Can one set of positive weights prefer the expert route while another set prefers the alternative?",
      steps: [
        { label: "Care more about safety", calculation: "wtime=1, wrisk=5: expert=−15, alternative=−23", explanation: "The expert route wins because its lower risk matters more than two extra units of time." },
        { label: "Care more about speed", calculation: "wtime=5, wrisk=1: expert=−51, alternative=−43", explanation: "The shorter route now wins because time receives the larger weight." },
        { label: "Use the observed choice", calculation: "expert preferred ⇒ 10wt+1wr ≤ 8wt+3wr", explanation: "The expert choice tells us that risk weight must be at least as large as time weight in this example." },
        { label: "Watch more situations", calculation: "new comparisons add inequalities", explanation: "Each new comparison can remove more weight choices. It can also reveal that the expert is not perfectly consistent." },
      ],
      result: "The demonstration gives a rule for a whole region of possible weights. It does not reveal one exact pair. More varied situations can shrink the region without proving a single true motive.",
    },
    mechanism: {
      introduction: "Goal learning always depends on what the learner can observe, what kinds of rewards it is allowed to consider, and how nearly optimal the expert is assumed to be.",
      sections: [
        { title: "Inverse RL finds a possible explanation", paragraphs: [
          "IRL asks which reward would make the expert's trips look good under the known world rules. Once learned, that reward can guide a new plan when the surroundings change.",
          "The result is an explanation inside the chosen model. Adding a constant, changing the scale, or reshaping a reward can leave the preferred policy unchanged. A narrow set of demonstrations creates even more ambiguity.",
        ] },
        { title: "Maximum-entropy IRL leaves room for several good choices", paragraphs: [
          "An expert may choose either of two safe routes. Maximum-Entropy Inverse Reinforcement Learning, or MaxEnt IRL, gives higher probability to higher-reward trips while still allowing variety.",
          "The word entropy here means spread among possible choices. It prevents the model from treating every unchosen action as forbidden. It still cannot use a feature that was never recorded.",
        ] },
        { title: "GAIL learns to resemble the expert", paragraphs: [
          "Generative Adversarial Imitation Learning, or GAIL, uses a judge called a discriminator. The judge tries to tell expert state-action pairs from learner pairs. The learner changes its policy to make that judgment harder.",
          "The learner is then pushed toward the expert's occupancy distribution, meaning the pattern of states and actions visited over time. The judge's score is a training signal, not a uniquely meaningful human reward.",
        ] },
        { title: "A human choice can contain habit, missing information, and unfair rules", paragraphs: [
          "A demonstration may reflect the expert's goal, but it may also reflect habit, limited knowledge, or a rule the learner cannot see. Copying or explaining the behavior can preserve all of these together.",
          "A learned reward should therefore be tested in situations where competing explanations lead to different actions. Similar behavior on the original demonstrations is only the first check.",
        ] },
      ],
    },
    equations: [
      { latex: "p(\\tau\\mid\\theta)=\\frac{1}{Z(\\theta)}\\exp\\left(\\sum_t r_\\theta(s_t,a_t)\\right)", read: "Maximum-entropy IRL gives higher probability to a trip when its learned rewards add to a larger total.", meaning: "The normalizing term turns all trip scores into probabilities. The available actions, world rules, and chosen reward features limit which explanations are possible." },
      { latex: "\\min_\\pi\\max_D\\;\\mathbb{E}_{\\pi_E}[\\log D(s,a)]+\\mathbb{E}_{\\pi}[\\log(1-D(s,a))]-\\lambda H(\\pi)", read: "GAIL trains a judge to separate expert and learner examples while the policy learns to confuse that judge.", meaning: "The goal is similar state-action visits, not one recovered human-readable reward. Standard GAIL still needs learner interaction with the environment." },
    ],
    boundary: {
      title: "Explaining a human action does not make that action good",
      paragraphs: [
        "If the expert never visits a dangerous area, the demonstrations say little about its reward there. Optimizing an inferred reward may send the learner into that unsupported area.",
        "Human behavior can contain mistakes, unfair treatment, and rules from one institution. IRL explains behavior under assumptions. It does not turn observed behavior into a moral standard.",
      ],
    },
    nextBridge: "IRL and GAIL often assume that the learner can keep interacting with a world or simulator. The next chapter removes that freedom. The learner receives one fixed log and must decide how far beyond it to trust its own guesses.",
    sources: [{ label: "Ziebart et al. — Maximum Entropy Inverse Reinforcement Learning", url: "https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf", kind: "paper" }, { label: "Ho and Ermon — Generative Adversarial Imitation Learning", url: "https://proceedings.neurips.cc/paper/2016/hash/cc7e2b878868cbae992d1fb743995d8f-Abstract.html", kind: "paper" }, SB],
  },
  {
    slug: "offline-rl",
    title: "When the agent cannot try again, missing data must stay unknown",
    deck: "A fixed log records what happened after chosen actions. It says little about actions that were never tried. Offline methods differ mainly in how carefully they handle that blank space.",
    openingQuestion: "If action B never appears in the log, why should we trust a network that suddenly gives B the highest score?",
    bridge: "Expert behavior is ideal, but real logs are messy. A recording may contain a mixture of good, ordinary, and bad decisions. We would like to learn a better policy from it. We are not allowed to run new experiments when the policy becomes curious about an unrecorded action.",
    situation: {
      title: "A medical record contains outcomes only for treatments that were actually used",
      paragraphs: [
        "Suppose doctors often used treatment A for a certain kind of patient and never used treatment B. The log contains outcomes after A. It contains no direct answer for B in that situation.",
        "A Q-network still produces a number for B because one network shares patterns across many inputs. If that unsupported number is accidentally high, the policy may choose B. There is no new patient trial to correct the mistake.",
        "Learning only from a fixed collection of past transitions is called Offline Reinforcement Learning, or Offline RL. Its central problem is deciding what the data really supports before trusting a possible improvement.",
      ],
    },
    diagram: {
      title: "The policy must not confuse a blank area with a good area",
      caption: "Each offline method puts caution in a different place: the allowed actions, the Q values, or the way good logged actions are selected.",
      items: [
        { label: "Fixed log", value: "past states, actions, rewards", note: "The behavior that collected the data decides what was observed." },
        { label: "Blank area", value: "little or no action evidence", note: "A network can still output a number there." },
        { label: "Stay close", value: "limit action candidates", note: "Choose among actions that resemble actions in the log." },
        { label: "Lower confidence", value: "distrust unsupported values", note: "Avoid letting unsupported high values control the policy." },
      ],
    },
    workedExample: {
      title: "An unsupported score of 10 immediately enters the learning target",
      setup: "At next state s′, the log contains action A with estimated Q=4. The critic also gives unseen action B a Q of 10. Reward is 1 and gamma is 0.9.",
      prediction: "Which target will ordinary Q-learning use, and what evidence supports the value of B?",
      steps: [
        { label: "Take the largest number", calculation: "max(4,10)=10", explanation: "Ordinary maximization chooses B even though the log has no B transition in this state." },
        { label: "Build the target", calculation: "y=1+0.9×10=10", explanation: "The unsupported guess becomes a training label. Later updates can spread that guess to earlier states." },
        { label: "Stay with recorded support", calculation: "choose A ⇒ y=1+0.9×4=4.6", explanation: "A behavior-constrained method uses A because the log contains evidence for it." },
        { label: "Accept the cost of caution", calculation: "conservatism may miss a genuinely better B", explanation: "B might truly be better. Without new evidence, the log cannot settle that question." },
      ],
      result: "Ordinary Q-learning uses 10, while the support-constrained target is 4.6. The cautious method has not proved that B is bad. It has refused to treat an unsupported guess as a fact.",
    },
    mechanism: {
      introduction: "Offline algorithms can be compared by one plain question: where do they stop the policy from chasing a number made in a data-poor area?",
      sections: [
        { title: "BCQ lets the policy choose among familiar actions", paragraphs: [
          "Batch-Constrained Q-learning, or BCQ, learns which actions look like actions in the log. It proposes those familiar candidates and lets Q choose among them. A small adjustment may be allowed around each candidate.",
          "This reduces questions about completely new actions. It can also hide a rare good action when the learned behavior model fails to represent it.",
        ] },
        { title: "CQL pushes doubtful action values downward", paragraphs: [
          "Conservative Q-Learning, or CQL, adds a penalty when many candidate actions receive values above the logged actions. The policy then has less reason to exploit an unsupported high Q.",
          "The penalty intentionally adds caution. Too little caution leaves false high values. Too much can push down a real but rare improvement. Its strength must be checked for the actual dataset.",
        ] },
        { title: "IQL selects better actions from inside the data", paragraphs: [
          "Implicit Q-Learning, or IQL, fits a state value from the Q values of logged actions. It uses expectile regression, a weighted average that can lean toward the better part of those logged values.",
          "The policy then copies high-advantage logged actions more strongly. IQL avoids an explicit maximum over unseen actions, but it still cannot learn a good action that the data never supports.",
        ] },
        { title: "The dataset is part of the problem, not just a file", paragraphs: [
          "A log collected by experts differs from one collected by beginners or by a changing mixture of policies. Missing failures, wrong end-of-episode labels, and poor coverage can change the answer before any algorithm is chosen.",
          "Reports should describe who collected the data, which actions appear in which states, how rewards were recorded, and which groups are thinly covered. A dataset name or total size is not enough.",
        ] },
      ],
    },
    equations: [
      { latex: "\\alpha\\left(\\log\\sum_a e^{Q(s,a)}-\\mathbb{E}_{a\\sim D}[Q(s,a)]\\right)", read: "A simplified CQL penalty compares high values across candidate actions with values for actions found in the dataset.", meaning: "It pushes against unsupported optimism. The way candidate actions are sampled and the strength alpha both affect how much real improvement may also be suppressed." },
      { latex: "L_V=\\mathbb{E}_{(s,a)\\sim D}[|\\tau-\\mathbf{1}(Q(s,a)-V(s)<0)|(Q(s,a)-V(s))^2]", read: "IQL fits V with an uneven squared-error rule so that larger logged Q values can receive more emphasis.", meaning: "The estimate uses actions in the dataset instead of taking a maximum over unseen actions. Its result still depends on coverage and on how strongly good logged actions are favored." },
    ],
    boundary: {
      title: "Caution manages missing evidence; it does not create evidence",
      paragraphs: [
        "A policy can look strong under its own learned Q and still fail when executed. Independent offline evaluation, a trusted simulator, shadow testing, and small controlled trials may be needed before deployment.",
        "Past treatment choices may depend on facts missing from the log. Then reward differences do not show the effect of actions alone. Offline RL does not solve that causal problem automatically.",
      ],
    },
    nextBridge: "BCQ, CQL, and IQL still organize learning around values or policy improvement. The next chapter tries a different interface: write a trip as a sequence and predict the next action after stating how much reward is still desired.",
    sources: [{ label: "Fujimoto, Meger, and Precup — Off-Policy Deep Reinforcement Learning without Exploration", url: "https://proceedings.mlr.press/v97/fujimoto19a.html", kind: "paper" }, { label: "Kumar et al. — Conservative Q-Learning", url: "https://proceedings.neurips.cc/paper/2020/hash/0d2b2061826a5df3221116a5085a6052-Abstract.html", kind: "paper" }, { label: "Kostrikov, Nair, and Levine — Offline Reinforcement Learning with Implicit Q-Learning", url: "https://openreview.net/forum?id=68n2s9ZJWF8", kind: "paper" }],
  },
  {
    slug: "decision-transformer",
    title: "Turn a recorded trip into a sequence and ask for the next action",
    deck: "A sequence model can read the desired remaining reward, recent states, and past actions. It predicts an action that resembles recorded trips with similar conditions.",
    openingQuestion: "If the training data never contains a 100-point trip, can typing a target of 100 somehow create one?",
    bridge: "Offline RL usually learns a value and uses it to prefer some logged behavior. We can also arrange each recorded trip as an ordered sequence. The model then learns to predict the next action, much as a language model predicts the next piece of text.",
    situation: {
      title: "A trip becomes an ordered sentence made of goals, states, and actions",
      paragraphs: [
        "After a recorded trip ends, we can add up how much reward remained at each step. This number is called return-to-go. A trip with five rewards of 2 has return-to-go 10 at the start, then 8, 6, 4, and 2.",
        "Decision Transformer, or DT, reads return-to-go, the current state, and earlier actions in order. A Transformer is a sequence model that can connect pieces across that history. DT learns to predict the action that appeared next in the log.",
        "During deployment, we enter a desired return-to-go. Each real reward is subtracted before the next decision. The number is a request, not a promise. The model still needs similar successful behavior in its training data.",
      ],
    },
    diagram: {
      title: "Place the request before the action that must answer it",
      caption: "The model sees a remaining target and the current state before predicting an action. Real rewards update the target as the trip continues.",
      items: [
        { label: "Ask", value: "R̂ₜ", note: "State how much reward is still desired." },
        { label: "Observe", value: "Sₜ", note: "Add the current information from the environment." },
        { label: "Act", value: "Aₜ", note: "Predict an action from the sequence seen so far." },
        { label: "Reduce", value: "R̂ₜ₊₁=R̂ₜ−rₜ", note: "Subtract the reward that was actually received." }, // Marcus P0 fix: off-by-one, align with R̂ₜ=Σ_{k=t}^T r_k (−rₜ, not −rₜ₊₁)
      ],
    },
    workedExample: {
      title: "A target of 10 becomes 7 and then 5",
      setup: "A user requests total return 10. The first action earns reward 3. The second action earns reward 2.",
      prediction: "What desired return-to-go should the model read before each later action?",
      steps: [
        { label: "Start with the request", calculation: "R̂₀=10", explanation: "The first action is predicted from the initial state and a desired return of 10." },
        { label: "Subtract the first reward", calculation: "R̂₁=10−3=7", explanation: "Three points have been received. Seven points remain in the request." },
        { label: "Subtract the second reward", calculation: "R̂₂=7−2=5", explanation: "After two more points, the remaining target becomes 5." },
        { label: "Check the training support", calculation: "look for training contexts near return 10", explanation: "If no similar trip reached about 10, the request lies outside the examples the model learned from." },
      ],
      result: "The condition moves from 10 to 7 to 5. It keeps track of the user's request. It does not tell the model a future that is already known or create a missing high-score skill.",
    },
    mechanism: {
      introduction: "Decision Transformer changes the shape of the training problem. It does not remove the old question of whether the dataset contains useful evidence.",
      sections: [
        { title: "Training knows the completed future; deployment does not", paragraphs: [
          "For a finished training trip, return-to-go can be calculated by adding future recorded rewards. That information is legal because the action label also comes from the finished record.",
          "At deployment, the future has not happened. The input is a desired number chosen by the user or system. Calling both numbers return-to-go should not hide this important difference.",
        ] },
        { title: "The model may read the past, but never the answer from the future", paragraphs: [
          "Causal attention means that an action prediction may use only earlier pieces in the sequence. Time markers tell the model where each state and action belongs. A limited context window may drop older information.",
          "A one-step mistake in sequence construction can leak a later reward or action into the input. A small hand-written trip is useful for checking exactly which pieces are visible at every prediction.",
        ] },
        { title: "The action loss is still supervised learning", paragraphs: [
          "For a small action set, training can use cross-entropy. For steering or force, it can fit numbers or an action distribution. In either case, the target is the action recorded in the offline data.",
          "There is no explicit Bellman maximum asking whether an absent action is better. That avoids one offline failure route, but the model can still enter unfamiliar states after its own early mistakes.",
        ] },
        { title: "A larger target number may be an impossible request", paragraphs: [
          "A high target can select patterns from high-return trips when such trips exist. If all 100-point trips began in an easy state, the model may learn that association rather than a plan for reaching 100 from a hard state.",
          "Useful tests vary the starting state and requested return together. They check actual closed-loop success, action support, and a safe fallback when the request is outside the training range.",
        ] },
      ],
    },
    equations: [
      { latex: "\\hat R_t=\\sum_{k=t}^{T}r_k", read: "At time t, return-to-go is the sum of rewards from that point to the end of a recorded trip.", meaning: "Training can calculate it after the trip finishes. Deployment instead supplies a desired value and subtracts real rewards as they arrive." },
      { latex: "\\min_\\theta\\mathbb{E}_{\\tau\\sim D}[-\\log p_\\theta(a_t\\mid\\hat R_{\\le t},s_{\\le t},a_{<t})]", read: "Decision Transformer gives high probability to the logged action when it sees the return, state, and action history available at that time.", meaning: "This is supervised action prediction on offline trips. Reliable control still requires the model's own rollout states to remain close to useful training examples." },
    ],
    boundary: {
      title: "A target number is neither a route nor a guarantee",
      paragraphs: [
        "The model may connect a high return with an action that worked in a different starting state. Local world rules can make that action wrong here, even though the statistical association is real.",
        "A sequence model can also memorize episode length, identifiers, or leaked rewards. Tests should vary targets, starting states, context length, and dataset quality and compare against simpler copying methods.",
      ],
    },
    nextBridge: "A fixed dataset can produce many candidate policies, including different Decision Transformer targets. Before risking a real deployment, we need a separate way to estimate how one chosen policy may perform from data collected by another.",
    sources: [{ label: "Chen et al. — Decision Transformer: Reinforcement Learning via Sequence Modeling", url: "https://proceedings.neurips.cc/paper/2021/hash/7f489f642a0ddb10272b5c31057f0663-Abstract.html", kind: "paper" }, { label: "Janner, Li, and Levine — Offline Reinforcement Learning as One Big Sequence Modeling Problem", url: "https://proceedings.neurips.cc/paper/2021/hash/099fe6b0b444c23836c4a5d07346082b-Abstract.html", kind: "paper" }],
  },
  {
    slug: "off-policy-evaluation",
    title: "Use an old log to judge a new policy, without pretending the log saw everything",
    deck: "An old policy created the data. A new policy would choose differently. Evaluation methods either reweight the old evidence, learn a value model, or combine both.",
    openingQuestion: "Can an old recommendation log tell us what would happen if a new system showed different items?",
    bridge: "Offline learning can create many candidate policies. Their training scores are not independent judges because those scores helped create the candidates. We need a separate evaluation step before letting a new policy affect real users.",
    situation: {
      title: "The log records a result only for the item that was shown",
      paragraphs: [
        "Suppose an old recommender showed item A 80% of the time and item B 20% of the time. A new policy reverses those chances. The log has many outcomes for A and far fewer for B.",
        "We can give the rare B records more influence so that the old log better resembles the new policy. This idea is called importance sampling. It works only when the log records how likely the old policy was to choose each action.",
        "If the old policy never chose B in a certain state, no reweighting can reveal B's result there. A learned model may make a guess, but that answer comes from extra assumptions rather than direct logged evidence.",
      ],
    },
    diagram: {
      title: "Three evaluation routes fail in different ways",
      caption: "Reweighting can become noisy. A value model can be biased. Combining them helps only when at least one part is reliable and the data overlaps the new policy.",
      items: [
        { label: "Reweight", value: "importance sampling", note: "Use recorded action probabilities to change each trip's influence." },
        { label: "Model", value: "learn target-policy value", note: "Learn the fixed target policy's value from logged transitions." },
        { label: "Combine", value: "model plus correction", note: "Start with a model and correct its errors with weighted evidence." },
        { label: "Report", value: "coverage and uncertainty", note: "Show how much evidence the estimate really uses." },
      ],
    },
    workedExample: {
      title: "One step doubles a trip's weight and the next halves it",
      setup: "At step one, the logged action has probability 0.6 under the target policy and 0.3 under the behavior policy. At step two, the probabilities are 0.2 and 0.4. The logged return is 5.",
      prediction: "Will the complete trip receive more weight, less weight, or the same weight?",
      steps: [
        { label: "Compare the first action", calculation: "ρ₀=0.6/0.3=2", explanation: "The target chooses this action twice as often as the behavior policy, so the weight doubles." },
        { label: "Compare the second action", calculation: "ρ₁=0.2/0.4=0.5", explanation: "The target chooses the second logged action half as often, so the weight is halved." },
        { label: "Multiply along the trip", calculation: "ρ=2×0.5=1", explanation: "The two changes cancel. This trip keeps weight 1 and contributes its return of 5 once." },
        { label: "Inspect every other weight", calculation: "other trajectories may have ρ near 0 or very large", explanation: "Another trip may receive almost no voice or dominate the whole estimate. One calm example does not prove low variance." },
      ],
      result: "This trip has weight 1. The final estimate can still be unstable when other trips have extreme weights. Reports should include weight tails, effective sample size, overlap, and an uncertainty interval.",
    },
    mechanism: {
      introduction: "Off-Policy Evaluation, or OPE, means judging one target policy with data collected by another behavior policy. Every method pays for missing direct experience in a different way.",
      sections: [
        { title: "Importance sampling changes how loudly each recorded trip speaks", paragraphs: [
          "At every step, divide the target policy's probability of the logged action by the behavior policy's probability. Multiplying those ratios gives the full trip weight. The average then represents the target policy under strong assumptions.",
          "Long trips can produce extremely large or small products. Normalizing or clipping weights can reduce noise, but it also changes the estimate. Exact behavior probabilities are valuable data and should be logged at collection time.",
        ] },
        { title: "FQE learns the value of one fixed policy", paragraphs: [
          "Fitted Q Evaluation, or FQE, keeps the target policy fixed. It repeatedly fits Q from logged transitions, using the target policy's average next-action value instead of choosing the largest Q.",
          "FQE often varies less than full-trip reweighting because the model shares information across similar states. It can still be confidently wrong where the target policy leaves the logged data.",
        ] },
        { title: "A doubly robust estimate starts with a model and corrects it", paragraphs: [
          "A Doubly Robust, or DR, estimator uses a learned value as a starting guess. Importance-weighted logged results then correct the difference between that guess and what actually happened.",
          "Under the right conditions, the estimate can remain sound when either the value model or the probability model is correct. The name does not protect it when both are wrong, weights explode, or an action has no support.",
        ] },
        { title: "Choosing the winner uses up evaluation evidence", paragraphs: [
          "If the same log scores fifty policies and we report only the highest score, random estimation noise helps choose the winner. The winning estimate is then too optimistic on average.",
          "Policy selection and final confirmation should use separate data when possible. Another option is to name candidates in advance and adjust uncertainty for many comparisons. The final policy should not grade itself.",
        ] },
      ],
    },
    equations: [
      { latex: "\\hat V_{IS}(\\pi)=\\frac{1}{n}\\sum_{i=1}^n\\left(\\prod_{t=0}^{T_i-1}\\frac{\\pi(a_t^i|s_t^i)}{b(a_t^i|s_t^i)}\\right)G_i", read: "Importance sampling multiplies target-to-behavior action probability ratios along each trip and uses the product to weight its recorded return.", meaning: "The estimate can be unbiased under strong conditions, yet its variance can be enormous. Longer trips and nearly deterministic target policies often make overlap worse." },
      { latex: "y=r+\\gamma\\mathbb{E}_{a'\\sim\\pi(\\cdot|s')}[Q_k(s',a')]", read: "FQE builds a target from the reward and the fixed target policy's expected next-action value.", meaning: "It does not take the largest action value as Q-learning does. Its answer is trustworthy only where function approximation and logged state-action coverage are good enough." },
    ],
    boundary: {
      title: "Sometimes the correct offline answer is simply 'this log cannot tell us'",
      paragraphs: [
        "Hidden information, changing behavior policies, delayed rewards, and unrecorded human interventions can break every estimator. Agreement between methods is weak evidence when they share the same blind spot.",
        "A good historical lower bound does not prove safety for future users. Simulation, shadow deployment, small staged experiments, stop rules, and monitoring remain part of the evidence chain.",
      ],
    },
    nextBridge: "Fixed-data learning and evaluation are now separate jobs. The next part changes the structure of decisions themselves. It begins with skills that last for several steps, then studies agents that adapt or interact.",
    sources: [{ label: "Precup, Sutton, and Singh — Eligibility Traces for Off-Policy Policy Evaluation", url: "https://www.cs.mcgill.ca/~dprecup/publications/Iswc.pdf", kind: "paper" }, { label: "Jiang and Li — Doubly Robust Off-policy Value Evaluation", url: "https://proceedings.mlr.press/v48/jiang16.html", kind: "paper" }, { label: "Le et al. — Batch Policy Learning under Constraints", url: "https://proceedings.mlr.press/v97/le19a.html", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
