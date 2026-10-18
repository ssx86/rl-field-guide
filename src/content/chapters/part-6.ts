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
        "Imagine a skilled driver agreeing to teach your robot. For hours she drives near the center of the lane while a camera records everything she sees and a log records every steering command she issues. You now own thousands of picture-action pairs, and you can train a network to predict her action from each picture. This direct copying recipe is called Behavior Cloning, and it is nothing more exotic than supervised learning wearing a reinforcement learning costume. Yet the moment you hand the wheel to the copy, the trouble begins.",
        "Let the copy drive, and watch one small steering error pull the car toward the lane edge. Pictures from the edge were rare in the lesson, so the next prediction is made in territory the network barely studied — and it may be worse than the last. Here is the trap: the policy's own action decides which picture it must answer next. Dataset Aggregation, or DAgger, breaks the loop by adding the missing recovery lessons. The learner drives, the expert labels the states the learner actually reaches, and those answers join the training set — if you can afford the expert's repeated help.",
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
        { title: "Copying is supervised learning, and the exam keeps changing", paragraphs: [
          "Start with what Behavior Cloning actually is. For a small set of actions, the model learns a probability for each action; for steering, it learns a range or a probability distribution. Either way, the expert action is treated like the answer on a training worksheet, and fitting those answers is ordinary supervised learning. No reward enters the picture, and nothing becomes reinforcement learning merely because the trained policy later acts many times in a row. The method deserves a plain name: it is a copier.",
          "So why does the copier fail? Because the training pictures came from expert driving, while the deployment pictures come from learner driving — and the policy's own actions decide which pictures arrive next. Researchers call the gap covariate shift, but the name understates what happens here, because the shift sits inside a feedback loop. The learner chooses an action, the action changes the next state, and that new state becomes the learner's next question. A small error moves the camera toward the lane edge, where examples are sparse, so the next guess is worse, and the loop tightens.",
        ] },
        { title: "DAgger turns confusion into new questions", paragraphs: [
          "DAgger breaks the loop by letting the learner ask for help where it actually goes. The cycle is simple to describe: run the current learner, record the states it reaches, ask the expert what she would do in each of those states, add her answers to the training set, and retrain. Because the added data follows the learner as it changes, the new lessons teach recovery instead of adding more perfect trips down the center of the lane. Early rounds may mix expert and learner control so that a weak first policy cannot cause harm.",
          "One more caution belongs here, because it shows what good data means. Two safe experts may genuinely disagree: a blocked path might be safely passed on the left or the right, and averaging those two steering commands could point the car straight at the obstacle. That disagreement is not a labeling error. The policy may need to represent several possible actions, or receive an extra clue about the expert's intention, so data quality includes the shape of the choices, not just the count of recordings.",
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
        "Watch a driver turn away from a short road that cuts across a field, and start inventing explanations. Perhaps the field is dangerous when wet. Perhaps the paved road uses less energy. Perhaps leaving the road is simply against the rules of the site. The same route supports all three stories, and from the outside you cannot tell them apart. Behavior Cloning never faced this puzzle, because it copies the turn without caring why it happened. But the moment you want the reason, you discover that one observed choice can fit many different goals.",
        "A method can search for a reward that would make the expert's behavior look sensible under the known world rules. This backward step is called Inverse Reinforcement Learning, or IRL, and it works from behavior toward a possible goal instead of starting from a known reward. Notice what IRL does not do: it does not uncover a label hidden inside the demonstration. Different rewards can lead to the same best action, so more demonstrations can remove some explanations while still leaving several alive. The guess is rarely unique.",
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
        { title: "From explaining a reward to allowing several good trips", paragraphs: [
          "Inverse RL asks which reward would make the expert's trips look good, and once such a reward is learned it can guide a new plan when the surroundings change — the whole appeal of recovering a reason instead of an action. But hold on to your skepticism: the answer is an explanation inside the chosen model, not a certificate of the expert's true motive. Adding a constant, changing the scale, or reshaping a reward can leave the preferred policy unchanged, and a narrow set of demonstrations deepens the ambiguity. Any recovered reward is one member of a family of candidates.",
          "Maximum-Entropy IRL takes this ambiguity seriously by leaving room for several good choices. An expert may take either of two safe routes to work, and MaxEnt gives higher probability to higher-reward trips while still allowing that variety — the word entropy here means spread among possible choices, and it prevents the model from treating every unchosen action as forbidden. Still, the method can only use features that were recorded. A goal the data never measured remains invisible to it, however elegant the mathematics becomes.",
        ] },
        { title: "Matching behavior, and the human inside the data", paragraphs: [
          "Generative Adversarial Imitation Learning, or GAIL, quietly changes the question. Instead of recovering a reward at all, it trains a judge called a discriminator to tell expert state-action pairs from learner pairs, while the learner changes its policy to make that judgment harder. Pushed this way, the learner converges toward the expert's occupancy distribution — the pattern of states and actions visited over time. The judge's score has real force as a training signal, but it is not a human-readable reward, and the method still needs live interaction with the environment or a simulator.",
          "Whichever route you take, remember that a human choice can contain habit, missing information, and unfair rules alongside the goal. A demonstration may reflect what the expert knew, what she had always done, or a constraint the learner cannot see — and copying or explaining the behavior preserves all of it together. A learned reward should therefore be tested in situations where competing explanations lead to different actions. Similar behavior on the original demonstrations is only the first and weakest check.",
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
        "Suppose the doctors on your ward almost always treat a certain kind of patient with drug A and never with drug B. The hospital log is full of outcomes after A — recoveries, side effects, readmissions — and it contains not a single direct answer for B in that situation. Now you want to do better than the old policy using only this fixed record of past transitions, a setting called Offline Reinforcement Learning, or Offline RL. The moment your new policy becomes curious about drug B, the data goes silent.",
        "That silence would not matter if the network shared it. A Q-network produces a number for every action, including B, because one network shares patterns across many inputs — and if that unsupported number comes out accidentally high, maximization will choose B. There is no new patient trial to correct the mistake; the log cannot argue back. This is the central problem of offline RL, and it is not a bug in any particular algorithm. It is the question the whole field is built around: what does the data really support before you trust an improvement?",
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
        { title: "Three places to put the caution", paragraphs: [
          "Batch-Constrained Q-learning, or BCQ, puts the caution before the choice. It learns which actions resemble actions in the log, proposes those familiar candidates — perhaps with a small adjustment around each one — and lets Q pick among them. Questions about completely new actions simply never reach the maximization step. The price is subtle: if the learned behavior model fails to represent a rare good action, that action stays invisible, and with it any improvement that only it could offer.",
          "Conservative Q-Learning, or CQL, puts the caution inside the numbers themselves. It adds a penalty whenever many candidate actions receive values above the logged actions, pushing doubtful values downward until the policy has less reason to exploit an unsupported high Q. The penalty is deliberately added caution, and its strength is a real dial: too little and false high values survive, too much and a real but rare improvement gets pushed down along with the fakes. Its setting must be checked against the actual dataset.",
          "Implicit Q-Learning, or IQL, refuses to look outside the log at all. It fits a state value from the Q values of logged actions, using expectile regression — a weighted average that can lean toward the better part of those logged values — and then trains the policy to copy high-advantage logged actions more strongly. By never taking an explicit maximum over unseen actions, it avoids one route to false optimism. It still cannot conjure a good action that the data never supports.",
        ] },
        { title: "The dataset is part of the problem, not just a file", paragraphs: [
          "Notice that all three methods assume the dataset itself is worth trusting, and that assumption deserves its own scrutiny. A log collected by experts differs from one collected by beginners or by a changing mixture of policies; missing failures, wrong end-of-episode labels, and poor coverage can change the answer before any algorithm is chosen. The caution tools of the previous section manage missing evidence, but they cannot create it.",
          "So when you read or write an offline RL report, ask the questions the data must answer: who collected it, which actions appear in which states, how were rewards recorded, and which patient groups or situations are thinly covered. A dataset name and a total row count are not an answer. The dataset is part of the problem statement, and often it is the part that decides the outcome.",
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
        "Take any recorded trip and, standing at each step, add up how much reward remained from that point to the end. This running number is called return-to-go: a trip with five rewards of 2 has return-to-go 10 at the start, then 8, 6, 4, and 2 as the trip unfolds. Now arrange the whole trip as an ordered sentence — return-to-go, state, action, return-to-go, state, action — and hand it to a Transformer, a sequence model that connects pieces across a history. Decision Transformer, or DT, learns to predict the action that came next in the log.",
        "At deployment, the order of the sentence is what matters, because the request comes before the action that must answer it. You enter a desired return-to-go, the model predicts an action, the world returns a real reward, and you subtract it before asking for the next action. Keep one thing firmly in mind: the number is a request, not a promise. If the training data contains no trip that ever earned anything close to your target, typing a larger number does not create the missing skill.",
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
        { title: "Training looks back at a finished future; deployment only wishes", paragraphs: [
          "There is a quiet asymmetry underneath this method. For a finished training trip, return-to-go can be calculated exactly, because the future rewards are already recorded — and using that information is legal, since the action label comes from the same finished record. At deployment there is no finished future. The input is a desired number chosen by you or by the system, subtracted downward as real rewards arrive. Both numbers are called return-to-go, but only one of them is a fact; the other is a wish.",
          "Inside the model, the boundary between past and future is drawn by causal attention: an action prediction may use only earlier pieces of the sequence, and time markers tell the model where each state and action belongs. The boundary is easy to break by accident. A one-step mistake in sequence construction can leak a later reward or action into the input, silently turning your evaluation into fiction, and a limited context window can quietly drop older information. A small hand-written trip, checked piece by piece to see exactly what is visible at every prediction, is the cheapest insurance.",
        ] },
        { title: "What the loss is, and what a big number can buy", paragraphs: [
          "Understand what the training loss really is, because it decides what can go wrong. For a small action set, training uses cross-entropy; for steering or force, it fits numbers or an action distribution. In every case the target is the action recorded in the offline data — supervised learning again, wearing sequence-model clothes, with no Bellman maximum asking whether some absent action might be better. That removes one route to offline failure. It does not remove the copier's oldest problem: after its own early mistakes, the model can still enter states unlike any example it learned from.",
          "So what does typing a bigger target buy you? Only patterns that already exist. A high target can steer the model toward pieces of high-return trips when such trips are present — but if every 100-point trip began in an easy state, the model learns the association 'easy state, big number', not a plan for reaching 100 from a hard one. Useful tests therefore vary the starting state and the requested return together, check actual closed-loop success and action support, and include a safe fallback for requests outside the training range.",
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
        "Suppose your old recommender showed item A 80 percent of the time and item B 20 percent of the time. The log reflects those odds: many outcomes after A, far fewer after B. Now a candidate policy reverses the chances, and you must judge it before it touches a real user. You cannot run it — staying offline is the whole point — so you must squeeze the answer out of data collected by a different policy. The log records a result only for the item that was actually shown.",
        "One idea is to give the rare B records more influence, so that the old log better resembles the new policy. This is importance sampling, and it works only when the log records how likely the old policy was to choose each action — those probabilities are the exchange rate between the two worlds. If the old policy never chose B in a certain state, no reweighting can reveal B's result there; a learned model may fill the gap, but its answer comes from extra assumptions rather than logged evidence. Every evaluation method pays for missing direct experience somehow.",
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
        { title: "Three routes to a number, each with its own failure", paragraphs: [
          "Importance sampling changes how loudly each recorded trip speaks. At every step, divide the target policy's probability of the logged action by the behavior policy's probability, multiply those ratios along the trip, and use the product as the trip's weight; under strong assumptions the average then represents the target policy. But watch what multiplication does on a long trip: ratios compound into extremely large or vanishingly small products, so one unusual trip can dominate the estimate or disappear from it. Normalizing or clipping reduces that noise while changing the estimate, and exact behavior probabilities should be logged at collection time.",
          "Fitted Q Evaluation, or FQE, avoids weights by learning a value instead. Keep the target policy fixed, repeatedly fit Q from logged transitions, and replace the greedy maximum with the target policy's average next-action value. Because the model shares information across similar states, FQE often varies less than full-trip reweighting. Its weakness is the mirror image of its strength: where the target policy leaves the logged data, the model extrapolates smoothly and confidently — and can be confidently wrong. Weights are honest about their noise; a value model hides its bias.",
          "A Doubly Robust, or DR, estimator tries to keep the best of both. It starts from a learned value as a guess, then uses importance-weighted logged results to correct the difference between that guess and what actually happened. Under the right conditions the estimate stays sound when either the value model or the probability model is correct — that is the 'doubly' — but the name offers no protection when both are wrong, when weights explode, or when an action has no support in the log at all.",
        ] },
        { title: "Spending the evidence honestly", paragraphs: [
          "There is one more way to fool yourself, and it needs no fancy mathematics. Suppose the same log scores fifty candidate policies and you report only the highest score. Random estimation noise helped choose that winner, so the winning estimate is too optimistic on average — the log has been spent twice, once to select and once to boast. Keep policy selection and final confirmation on separate data when possible, or name candidates in advance and adjust the uncertainty for the many comparisons. The final policy should never grade itself.",
          "A final habit completes the discipline. Whatever route you chose, report how much evidence the estimate really uses: the tails of the weight distribution, the effective sample size, the overlap between behavior and target policies, and an uncertainty interval around the final number. Two estimators agreeing is weak evidence when they share the same blind spot, so name the assumptions each one leans on. An estimate without those attachments is a claim about the estimator, not about the policy.",
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
