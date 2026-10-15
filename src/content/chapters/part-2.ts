import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;
const SPINNING_UP = { label: "OpenAI Spinning Up — RL introduction and notation", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html", kind: "official documentation" } as const;

export const PART_TWO_ARTICLES = [
  {
    slug: "mdp-state-design",
    title: "Decide what the learner must remember",
    deck: "Two situations can look the same and still lead to different results. A useful state keeps the past information that changes what may happen next.",
    openingQuestion: "A machine reads 80°C in both cases. Why might it be safe in one case and dangerous in the other?",
    bridge: "A bandit starts over after every choice. A factory machine does not. What it did a minute ago can change what happens now. We therefore need a careful description of the learner's current situation.",
    situation: {
      title: "The same number can hide two different situations",
      paragraphs: [
        "A controller sees that a machine is at 80°C. It can cool the machine, keep it running, or stop it. The number on the screen looks clear, but it may leave out something important.",
        "Perhaps the machine has climbed from 60°C to 80°C. It may keep heating up. Or perhaps it has cooled from 95°C to 80°C. It may keep cooling. The same screen reading can lead to a different next result.",
        "The number on the screen is an observation. It is simply what the controller receives. If we also record whether the temperature is rising or falling, the learner can tell the two cases apart.",
      ],
    },
    diagram: {
      title: "Turn a stream of events into one decision step",
      caption: "We call the current information a state only when it contains what we need to predict the next result of each action.",
      items: [
        { label: "Where a run begins", value: "S₀ ~ ρ₀", note: "Different starting situations can make the task easier or harder." },
        { label: "What the learner chooses", value: "Aₜ ~ π(·|Sₜ)", note: "The policy uses the current state to choose an action." },
        { label: "What the world returns", value: "Sₜ₊₁,Rₜ₊₁ ~ p(·|Sₜ,Aₜ)", note: "The same action may lead to several next states and rewards." },
        { label: "What the learner often sees", value: "dπ(s,a)", note: "Its choices decide which situations appear often in its data." },
      ],
    },
    workedExample: {
      title: "Check whether temperature alone is enough",
      setup: "The screen reads 80°C. In old records, the machine fails 30% of the time when the temperature is rising. It fails 5% of the time when the temperature is falling.",
      prediction: "Can one state called '80°C' describe both cases well enough?",
      steps: [
        { label: "First idea", calculation: "S = temperature = 80", explanation: "This puts the rising case and the falling case into one box." },
        { label: "Compare the next result", calculation: "P(fail|80,rising)=0.30 ≠ P(fail|80,falling)=0.05", explanation: "The two boxes should not be one box. Their failure chances are different." },
        { label: "Add the missing fact", calculation: "S = (temperature, trend)", explanation: "Now the state tells us both the temperature and its direction of change." },
        { label: "Let the choice use it", calculation: "π(stop|80,rising) may exceed π(stop|80,falling)", explanation: "The controller may stop more often when the temperature is still rising." },
      ],
      result: "Temperature alone leaves out useful history. Adding the trend fixes this particular problem because it changes the prediction and the choice.",
    },
    mechanism: {
      introduction: "Now we can name the pieces without losing sight of the machine.",
      sections: [
        { title: "A state is a useful memory", paragraphs: ["The past still matters. We just ask the state to carry the parts of the past that change the next result. This requirement is called the Markov property."] },
        { title: "An MDP describes this kind of task", paragraphs: ["A Markov Decision Process, or MDP, lists the states, the actions, and the possible results. It also says how a run begins. The policy is the rule that chooses actions."] },
        { title: "The policy changes the data", paragraphs: ["A controller that always stops at 80°C will rarely see what happens at 90°C. The situations it visits make up its occupancy. Unvisited situations do not create training evidence."] },
        { title: "Time may belong in the state", paragraphs: ["One minute left is different from one hour left. If the remaining time changes the best action, the learner must know it. A clock can therefore be part of the state."] },
      ],
    },
    equations: [
      { latex: "p(s',r\\mid s,a)=\\Pr\\{S_{t+1}=s',R_{t+1}=r\\mid S_t=s,A_t=a\\}", read: "Fix the current state s and action a. The formula gives the chance of each next state s' and reward r.", meaning: "If earlier history still changes these chances, the state has left out something useful." },
      { latex: "d^{\\pi}(s,a) \\propto \\sum_{t\\ge 0}\\gamma^t\\Pr_{\\pi}(S_t=s,A_t=a)", read: "This number describes how often policy pi visits a state and takes an action. Later visits receive less weight.", meaning: "Change the policy and the learner visits different places. The training data changes even when the factory stays the same." },
    ],
    boundary: {
      title: "A good state is not simply the biggest state",
      paragraphs: ["Old data can reveal a missing fact, as the temperature example did. It cannot prove that no fact is missing in every future situation. Tests and expert knowledge are still needed.", "More information can also be unfair. A future measurement may improve a training score, but the real controller cannot see it yet. Every state feature must be available when the action is chosen."],
    },
    nextBridge: "A state and an action can lead to many possible futures. The next chapter shows how one number can summarize those futures without pretending they are all the same.",
    sources: [SB, SPINNING_UP],
  },
  {
    slug: "value-bellman",
    title: "Give each situation a useful forecast",
    deck: "A value is a forecast of the rewards still ahead. We can calculate it one step at a time: what happens next, plus what may happen after that.",
    openingQuestion: "A robot can reach the same door by many routes. How can one number help it compare what comes next?",
    bridge: "The previous chapter described the current situation. Now the robot must compare situations and actions. Listing every possible future would be too much. We need a smaller summary.",
    situation: {
      title: "The number belongs to a plan for acting",
      paragraphs: [
        "A robot waits in corridor A. Its policy usually tells it to move right, but the wheels sometimes slip. Some trips are quick and some are slow.",
        "We can ask how much reward the robot expects from A if it keeps following that policy. The answer is called the state value. It is a forecast, not a reward hidden inside the floor.",
        "We can ask a narrower question too: what if the robot moves right now, then returns to its policy? That answer is called the action value. The first action has been fixed, so the question is different.",
      ],
    },
    diagram: {
      title: "Break a long future after one step",
      caption: "Look at the next reward and next state. The value of that next state stands for everything that can happen later.",
      items: [
        { label: "Start here", value: "Sₜ=s", note: "Choose the situation whose future you want to judge." },
        { label: "Follow the policy", value: "Aₜ~π(·|s)", note: "The policy may give several actions different chances." },
        { label: "See one result", value: "Rₜ₊₁ and Sₜ₊₁", note: "Each possible result contributes according to its chance." },
        { label: "Use the next forecast", value: "γvπ(Sₜ₊₁)", note: "The next state's value carries the rest of the future." },
      ],
    },
    workedExample: {
      title: "Give both possible door results their proper weight",
      setup: "Moving right from A reaches a goal worth 5 with chance 0.8. It reaches a waiting place worth 1 with chance 0.2. The immediate reward is 0 and gamma is 0.9.",
      prediction: "Should we use only the common result, average the two results equally, or use their chances?",
      steps: [
        { label: "Goal result", calculation: "0.8×(0+0.9×5)=3.6", explanation: "The goal is common, so it gets weight 0.8. Its later value also gets the discount 0.9." },
        { label: "Waiting result", calculation: "0.2×(0+0.9×1)=0.18", explanation: "The waiting place is less common, but it still counts." },
        { label: "Value of moving right", calculation: "qπ(A,right)=3.6+0.18=3.78", explanation: "Adding both weighted results gives the expected action value." },
        { label: "Value of being at A", calculation: "vπ(A)=Σa π(a|A)qπ(A,a)", explanation: "Now do this for every action and use the chance that the policy chooses each one." },
      ],
      result: "The value 3.78 is an average forecast. A real trip will reach one result, not 3.78 points of a place.",
    },
    mechanism: {
      introduction: "The symbols are easier when each one is tied to a question.",
      sections: [
        { title: "State value asks, 'How good is it to be here?'", paragraphs: ["The answer depends on the policy that acts from here. Change the policy and the robot may choose different routes. The state value changes too."] },
        { title: "Action value asks, 'How good is this first move?'", paragraphs: ["We fix the first action, then follow the policy. Comparing action values helps the robot choose. Advantage is the action value minus the usual state value."] },
        { title: "Bellman means one step plus the rest", paragraphs: ["The next reward covers one step. The next state's value covers all later steps. Writing the forecast this way gives a Bellman equation."] },
        { title: "Following a policy and choosing the best action are different", paragraphs: ["One equation averages the actions from a stated policy. Another takes the largest action value. That maximum changes the question from 'What will this policy do?' to 'What is the best action?' "] },
      ],
    },
    equations: [
      { latex: "v_{\\pi}(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma v_{\\pi}(s')\\right]", read: "For each action and result, take the next reward plus the discounted next-state value. Weight it by its chance and add everything.", meaning: "The first sum covers what the policy may choose. The second covers what the world may return." },
      { latex: "q_*(s,a)=\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma\\max_{a'}q_*(s',a')\\right]", read: "Take action a now. For every possible result, add the reward and the value of choosing the best next action.", meaning: "The maximum says that later choices will be greedy. It does not describe a policy that still explores." },
    ],
    boundary: {
      title: "A value is a forecast made under stated rules", paragraphs: ["The same corridor can have different values under different policies, rewards, time limits, or discounts. Compare two value numbers only when these conditions match.", "An average value can hide a rare crash. It tells us the mean of possible returns, not the whole range. Safety checks must look beyond one average."],
    },
    nextBridge: "We now know how one value should agree with the values after it. If all rules of the world are known, we can repeat this calculation until the forecasts stop changing.",
    sources: [SB, SPINNING_UP],
  },
  {
    slug: "dynamic-programming",
    title: "When the rules are known, plan before you learn",
    deck: "If a complete map already tells us what every action can do, we can calculate a good route. We do not need to risk real trips just to discover known rules.",
    openingQuestion: "If a game gives us its full map and rules, why should a robot learn them again by trial and error?",
    bridge: "A Bellman equation tells us how nearby values fit together. A complete model lets us carry out those calculations for every state. This is planning with known rules.",
    situation: {
      title: "A small map can be solved on paper",
      paragraphs: [
        "Imagine four rooms connected by doors. The goal gives +1. Every other move gives 0. We know the whole map and the result of every action.",
        "Start by giving every room value 0. A room beside the goal can discover the +1 first. On the next round, that information reaches a room two steps away. The useful news moves backward through the map.",
        "This repeated use of known rules is called dynamic programming, or DP. Here, 'programming' means arranging calculations. It does not mean writing computer code.",
      ],
    },
    diagram: {
      title: "Take turns judging and improving the policy",
      caption: "First ask how good the current policy is. Then use that answer to choose better actions. Repeat.",
      items: [
        { label: "Judge the current rule", value: "v ← Tπv", note: "Calculate values while the policy stays fixed." },
        { label: "Choose better moves", value: "π ← greedy(v)", note: "At each state, prefer the action with the better forecast." },
        { label: "Repeat both jobs", value: "policy iteration", note: "Evaluate the policy, improve it, and begin again." },
        { label: "Mix the two jobs", value: "value iteration / GPI", note: "We may improve before evaluation is completely finished." },
      ],
    },
    workedExample: {
      title: "Watch the goal's value move backward",
      setup: "A path is S₀→S₁→Goal. Entering the goal gives +1. Other moves give 0. Gamma is 0.9, and both starting values are 0.",
      prediction: "Which state learns about the goal on the first round? What can S₀ know on the second round?",
      steps: [
        { label: "Before calculation", calculation: "V₀(S₀)=V₀(S₁)=0", explanation: "No room knows about the goal yet. The +1 arrives only when the robot enters it." },
        { label: "First round", calculation: "V₁(S₁)=1+0.9×0=1; V₁(S₀)=0+0.9×0=0", explanation: "S₁ is beside the goal. S₀ still reads the old value 0 for S₁." },
        { label: "Second round", calculation: "V₂(S₀)=0+0.9×1=0.9", explanation: "S₀ can now see the value that reached S₁ on the first round." },
        { label: "Choose an action", calculation: "π(S)=argmaxa[r+γV(s′)]", explanation: "Compare each action's reward and next-state value. Choose the largest result." },
      ],
      result: "The robot planned from the supplied map. It did not need to explore the real rooms to learn these consequences.",
    },
    mechanism: {
      introduction: "There are two jobs: work out what a policy will do, then make the policy better.",
      sections: [
        { title: "Policy evaluation keeps the actions fixed", paragraphs: ["Follow the current policy in the known model. Update the values again and again. Stop when another round changes them by only a small amount."] },
        { title: "Policy improvement uses the new values", paragraphs: ["At each state, look one step ahead. If another action has a larger forecast, change the policy. Repeating evaluation and improvement is called policy iteration."] },
        { title: "Value iteration mixes both jobs", paragraphs: ["Value iteration takes the best action inside every update. It does not wait for a complete policy evaluation. In a finite discounted task, the values move toward the best possible values."] },
        { title: "The update order can save work", paragraphs: ["A fresh value can be used immediately instead of waiting for a full round. We can also update important states first. The model stays the same; only the calculation order changes."] },
      ],
    },
    equations: [
      { latex: "V_{k+1}(s)=\\sum_a\\pi(a\\mid s)\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma V_k(s')\\right]", read: "For one update round, average the reward and old next-state value under the current policy and known model.", meaning: "A full round may read only old values. An in-place version may use a value that was updated a moment ago." },
      { latex: "V_{k+1}(s)=\\max_a\\sum_{s',r}p(s',r\\mid s,a)\\left[r+\\gamma V_k(s')\\right]", read: "For each action, calculate its expected reward and next value. Keep the largest result.", meaning: "The maximum improves the action choice during the value update. This works because the model describes every candidate action." },
    ],
    boundary: {
      title: "Planning is only as honest as its model", paragraphs: ["A guessed map is not a known map. If the model is wrong, planning can repeat that mistake many steps into the future. Real checks are still needed.", "Updating every state is also expensive when the world is huge. Later methods sample some states or use shared estimates instead. They trade exact calculation for speed and scale."],
    },
    nextBridge: "Now remove the map. The learner no longer knows every possible result. It must play or act, wait for an ending, and learn from the trip that actually happened.",
    sources: [SB, { label: "Richard Bellman — A Markovian Decision Process", url: "https://www.jstor.org/stable/24900506", kind: "paper" }],
  },
  {
    slug: "monte-carlo",
    title: "Learn from a complete game or trip",
    deck: "When the rules are unknown, the learner can wait for a run to finish. The rewards from that real run become one example of what the earlier choices were worth.",
    openingQuestion: "If we do not know the rules of a card game, what can we learn by playing it many times?",
    bridge: "The last chapter used a complete model. Now the model is gone. The learner can still follow a policy, record what happens, and learn after the ending is known.",
    situation: {
      title: "One finished card game gives one answer",
      paragraphs: ["A player has a total of 18 and chooses to stop drawing cards. The game later ends in a win worth +1 or a loss worth −1. We do not need to know every hidden card probability first.", "One game gives one result. Many games from similar situations give many results. Their average estimates how good that situation is under the player's policy.", "Learning this way is called Monte Carlo learning, or MC learning. The name means we use repeated random trials. Here, each complete game is one trial."],
    },
    diagram: {
      title: "Finish the run, then look backward", caption: "Monte Carlo waits for the later rewards to be observed. It does not fill in the unfinished future with its current guess.",
      items: [
        { label: "Play to the end", value: "S₀,A₀,R₁,…,S_T", note: "Follow the policy until the game or task truly ends." },
        { label: "Add later rewards", value: "Gₜ=Rₜ₊₁+γGₜ₊₁", note: "For each earlier point, calculate the return that followed it." },
        { label: "Average many runs", value: "V(s) ← mean returns", note: "The average becomes the value estimate for that state." },
        { label: "Keep some exploration", value: "π ← ε-soft greedy(Q)", note: "Every action needs some chance if we want evidence about it." },
      ],
    },
    workedExample: {
      title: "Average two different endings",
      setup: "The same state S appears in two games. Gamma is 1. After S, the first game gives [0, 0, 1]. The second gives [0, −1].",
      prediction: "What return follows S in each game? What is their average?",
      steps: [
        { label: "First game", calculation: "G¹(S)=0+0+1=1", explanation: "Gamma is 1, so we add all later rewards without shrinking them." },
        { label: "Second game", calculation: "G²(S)=0−1=−1", explanation: "The same state can lead to a different run and a different return." },
        { label: "Average", calculation: "V(S)=(1+(−1))/2=0", explanation: "The estimate is 0. Neither game actually had a return of 0." },
        { label: "Update without storing both", calculation: "V₂=1+(1/2)(−1−1)=0", explanation: "This running update gives the same average using the old estimate and the new return." },
      ],
      result: "Monte Carlo learns an average from finished runs. The target comes from real later rewards, but one run can differ greatly from the next.",
    },
    mechanism: {
      introduction: "Waiting for the ending solves one problem and creates three others.",
      sections: [
        { title: "The target uses rewards that really happened", paragraphs: ["The learner does not insert its current value guess into the return. A wrong value estimate cannot directly change this target. Chance still makes the result noisy."] },
        { title: "A repeated state creates a small choice", paragraphs: ["First-visit MC uses only the first time a state appears in one game. Every-visit MC uses every appearance. Both can work, but they do not use the same samples."] },
        { title: "Improving the policy still needs exploration", paragraphs: ["If an action is never tried, its return is unknown. An epsilon-soft policy keeps a small chance for every action. Lowering epsilon too quickly can preserve an early mistake."] },
        { title: "Long tasks make waiting expensive", paragraphs: ["A short game has a clear ending. A factory controller may run for months. Waiting for a complete return can delay learning and make the results vary widely."] },
      ],
    },
    equations: [
      { latex: "G_t=\\sum_{k=0}^{T-t-1}\\gamma^kR_{t+k+1}", read: "Start after time t. Add every later reward until the true ending T, using a larger power of gamma for a more distant reward.", meaning: "The formula uses the rewards from one finished run. If recording stopped early, the missing future has not become zero." },
      { latex: "V(S_t)\\leftarrow V(S_t)+\\alpha\\left[G_t-V(S_t)\\right]", read: "Find the gap between the complete return and the old value. Move alpha times that gap toward the return.", meaning: "A visit-count step size gives an ordinary average. A fixed alpha gives newer games more influence." },
    ],
    boundary: {
      title: "A finished run shows only the path that was taken", paragraphs: ["The player learns what happened after the chosen actions. The game says nothing about an action that was never tried. Exploration or other trustworthy data is still required.", "A time limit is not always a true ending. Treating a cut-off record as a finished task throws away the future that would have followed."],
    },
    nextBridge: "Monte Carlo waits until the end. The next chapter asks whether the learner can start sooner by using a few real rewards and one careful guess about the unfinished future.",
    sources: [SB, { label: "David Silver — UCL Reinforcement Learning lecture on model-free prediction", url: "https://www.davidsilver.uk/wp-content/uploads/2020/03/MC-TD.pdf", kind: "official documentation" }],
  },
  {
    slug: "td-traces",
    title: "Move from TD(0) to n-step returns and eligibility traces",
    deck: "Temporal-difference learning updates before an episode ends. The price is bootstrapping: part of the target comes from a value estimate that may itself be wrong.",
    openingQuestion: "How much real future should an update wait for before it borrows an estimate for the rest?",
    bridge: "Monte Carlo uses a complete sampled return and can wait a long time. TD(0) uses one observed transition and a bootstrapped next-state value. Between them lies a spectrum of n-step targets and lambda returns; eligibility traces implement that spectrum online by carrying recent credit forward through updates.",
    situation: {
      title: "A delayed goal can teach earlier states before the episode ends",
      paragraphs: ["A robot takes twenty moves to reach a charging station. Monte Carlo changes the value of the first state only after all twenty moves. TD(0) changes the nineteenth state immediately when it sees the goal, then propagates that improvement backward through later visits." ,"An n-step return waits for n real rewards before bootstrapping. A larger n relies more on sampled outcomes and less on current estimates. The lambda return averages targets of many lengths, giving a continuous control over this bias-variance tradeoff." ,"Eligibility traces provide a backward view. Recently visited states receive temporary credit. Each new TD error updates all states with nonzero trace, approximately matching the forward lambda-return view under standard conditions. Accumulating and replacing traces behave differently when a feature or state repeats."],
    },
    diagram: {
      title: "Targets differ by where they stop observing and start estimating", caption: "One-step TD borrows early, Monte Carlo never borrows before termination, and n-step or lambda methods interpolate between them.",
      items: [
        { label: "TD(0)", value: "Rₜ₊₁+γV(Sₜ₊₁)", note: "Fast update, more bootstrap dependence." },
        { label: "n-step", value: "n rewards + γⁿV(Sₜ₊ₙ)", note: "Waits for a chosen amount of real future." },
        { label: "Monte Carlo", value: "complete return", note: "No bootstrap before a true terminal state." },
        { label: "TD(λ)", value: "weighted mixture", note: "Combines many target lengths or implements their backward trace equivalent." },
      ],
    },
    workedExample: {
      title: "Compute one-step and two-step targets",
      setup: "From S₀, rewards are 2 then 3. Gamma is 0.9. Current estimates are V(S₁)=5 and V(S₂)=8. The episode continues after S₂.",
      prediction: "Which target uses more observed reward, and which depends more heavily on the current value table?",
      steps: [
        { label: "One-step target", calculation: "G₀:₁=2+0.9×5=6.5", explanation: "Only the first reward is observed; the rest is summarized by V(S₁)." },
        { label: "Two-step target", calculation: "G₀:₂=2+0.9×3+0.9²×8=11.18", explanation: "Two rewards are observed before bootstrapping from S₂." },
        { label: "TD error", calculation: "δ₀=2+0.9×5−V(S₀)", explanation: "The error compares the one-step target with the current prediction at S₀." },
        { label: "Trace update", calculation: "V(s)←V(s)+αδₜeₜ(s)", explanation: "The current TD error also updates recent states according to their decayed eligibility." },
      ],
      result: "The targets can differ sharply because they combine different evidence and different bootstrap points. Lambda is a principled way to blend that spectrum, not a magic constant.",
    },
    mechanism: {
      introduction: "TD learning is the bridge between complete-return estimation and recursive dynamic programming, but its implementation depends on careful terminal handling and trace semantics.",
      sections: [
        { title: "Bootstrapping trades delay for target bias", paragraphs: ["A wrong next-state value makes the one-step target wrong, yet frequent updates can correct estimates rapidly as experience arrives. Monte Carlo avoids that particular dependency but inherits full trajectory variance. Neither target dominates in every problem."] },
        { title: "n-step returns expose a continuum", paragraphs: ["Increasing n adds actual rewards and moves the bootstrap farther away. In online systems it also delays the update and requires a buffer. For terminal transitions before n steps, the target stops without a continuation value."] },
        { title: "Lambda weights many horizons", paragraphs: ["The forward lambda return geometrically weights one-step, two-step, and longer targets. Lambda zero recovers TD(0); lambda one approaches Monte Carlo in episodic tasks. The effective behavior also depends on gamma, step size, and function approximation."] },
        { title: "Traces assign recent eligibility, not causal proof", paragraphs: ["A trace marks which past states or features are eligible to receive the current TD error. It does not establish that they caused the outcome. Replacing traces can limit repeated-feature buildup; true-online variants preserve closer equivalence under approximation."] },
      ],
    },
    equations: [
      { latex: "G_{t:t+n}=R_{t+1}+\\gamma R_{t+2}+\\cdots+\\gamma^{n-1}R_{t+n}+\\gamma^nV(S_{t+n})", read: "The n-step target observes n rewards, then bootstraps from the estimated value of the state reached after those n transitions.", meaning: "This expression makes the evidence boundary visible. Everything before the final term was observed on the trajectory; only the continuation value is estimated." },
      { latex: "e_t(s)=\\gamma\\lambda e_{t-1}(s)+\\mathbf{1}(S_t=s)", read: "An accumulating eligibility trace decays old eligibility by gamma lambda and adds one for the state visited now.", meaning: "A later TD error is distributed backward through these traces. Replacing traces cap or reset repeated-state eligibility and therefore should not be treated as identical." },
    ],
    boundary: {
      title: "Longer targets do not automatically solve long-horizon credit", paragraphs: ["Increasing n or lambda can carry outcome information farther, but it also spreads noisy return evidence and still relies on correlation along the trajectory. Sparse-reward exploration and causal credit can remain unsolved." ,"Off-policy traces require correction or specialized algorithms. Naively applying long traces to data from a different behavior policy can update toward the wrong target and become unstable with approximation."],
    },
    nextBridge: "TD targets so far evaluate a stated policy. Control changes the policy while learning. The next chapter compares SARSA, Expected SARSA, Q-learning, and Double Q-learning by asking exactly which next-action value appears in each target.",
    sources: [SB, { label: "Sutton — Learning to Predict by the Methods of Temporal Differences", url: "https://link.springer.com/article/10.1007/BF00115009", kind: "paper" }],
  },
  {
    slug: "tabular-control",
    title: "Compare SARSA, Expected SARSA, Q-learning, and Double Q-learning",
    deck: "Control algorithms can observe the same transition and still learn different values because their targets describe different future policies.",
    openingQuestion: "After an exploratory action, should the update evaluate the action actually selected, the policy's average next action, or the greedy next action?",
    bridge: "TD prediction borrowed a next-state value under a fixed policy. Control must improve behavior while collecting data, so the target needs a precise answer to whose future is being evaluated. SARSA, Expected SARSA, and Q-learning differ at that one point; Double Q-learning addresses the optimism created by noisy maximization.",
    situation: {
      title: "Exploration beside a cliff separates behavior from target",
      paragraphs: ["A walker can take a short route beside a cliff or a longer safe route. An epsilon-greedy behavior policy occasionally makes random moves. SARSA evaluates the next action actually sampled by that behavior, so cliff risk influences its learned route. Q-learning evaluates the greedy next action even while behavior explores." ,"Expected SARSA replaces the sampled next action with the expectation under the policy, reducing sampling variance while retaining a chosen policy target. Q-learning is off-policy because its greedy target can differ from the behavior that produced the transition." ,"When action estimates contain noise, taking their maximum tends to select positive errors. Standard Q-learning uses the same estimates to select and evaluate the maximum. Double Q-learning separates those roles across two tables, reducing maximization bias without claiming to remove all estimation error."],
    },
    diagram: {
      title: "One transition supports three continuation questions", caption: "The reward is shared. The algorithms diverge only in how they value the next state, and that choice defines the target policy.",
      variant: "formula-compare",
      items: [
        { label: "SARSA", value: "Q of the sampled next state–action pair", latex: "Q(S_{t+1},A_{t+1}),\\quad A_{t+1}\\sim\\pi(\\cdot\\mid S_{t+1})", note: "Evaluate the next action sampled from the behavior policy." },
        { label: "Expected SARSA", value: "Policy-weighted sum of next-state action values", latex: "\\sum_{a\\in\\mathcal{A}(S_{t+1})}\\pi(a\\mid S_{t+1})Q(S_{t+1},a)", note: "Average over every available next action under the stated target policy." },
        { label: "Q-learning", value: "Maximum next-state action value", latex: "\\max_{a\\in\\mathcal{A}(S_{t+1})}Q(S_{t+1},a)", note: "Evaluate a greedy target even when the behavior policy explores." },
        { label: "Double Q-learning", value: "Select with table A and evaluate with table B", latex: "a^*=\\arg\\max_a Q^A(S_{t+1},a),\\quad Q^B(S_{t+1},a^*)", note: "When updating Qᴬ, select with Qᴬ and evaluate with Qᴮ; the other update is symmetric." },
      ],
    },
    workedExample: {
      title: "Compute three targets from the same observed transition",
      setup: "A transition gives reward 2, gamma 0.9, and a nonterminal next state. The behavior selects an action valued 3. The two next actions have Q values 3 and 6. The epsilon-greedy target policy chooses them with probabilities 0.1 and 0.9.",
      prediction: "Order the SARSA, Expected SARSA, and Q-learning targets before calculating.",
      steps: [
        { label: "SARSA", calculation: "2+0.9×3=4.7", explanation: "The sampled exploratory next action is part of the five-element S-A-R-S-A transition." },
        { label: "Expected SARSA", calculation: "2+0.9×(0.1×3+0.9×6)=7.13", explanation: "The continuation is averaged under the stated epsilon-greedy policy." },
        { label: "Q-learning", calculation: "2+0.9×6=7.4", explanation: "The continuation assumes a greedy action even though behavior may explore." },
        { label: "Terminal check", calculation: "if terminated, all three targets equal reward 2", explanation: "No algorithm bootstraps past a true terminal transition." },
      ],
      result: "Different targets are not minor coding variants. They evaluate different continuations and therefore can learn different behavior around risk created by exploration.",
    },
    mechanism: {
      introduction: "Tabular control combines TD errors with policy improvement. Convergence claims depend on coverage, step sizes, stationarity, and the exact target.",
      sections: [
        { title: "SARSA is on-policy control", paragraphs: ["Behavior and target are the same policy. As epsilon decays under suitable GLIE conditions, the policy becomes greedy while every state-action pair continues to receive enough visits. With persistent epsilon, SARSA learns the value of that exploratory behavior rather than the fully greedy policy."] },
        { title: "Expected SARSA trades computation for lower target variance", paragraphs: ["When action probabilities and values can be summed, expectation removes randomness from which next action happened to be sampled. It can be on-policy or off-policy depending on which policy appears in the expectation."] },
        { title: "Q-learning separates behavior and greedy target", paragraphs: ["The max makes the update off-policy. Tabular convergence under standard conditions is powerful, but behavior still determines coverage and real-world safety. A greedy mathematical target does not prevent the data-collecting policy from taking exploratory actions."] },
        { title: "Double estimation reduces selection bias", paragraphs: ["Double Q-learning randomly updates one table, uses it to select a maximizing action, and uses the other table to evaluate that action. Deep Double DQN carries the same selection/evaluation idea into neural networks with online and target parameters."] },
      ],
    },
    equations: [
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\\right]", read: "SARSA moves the current action value toward the reward plus the discounted value of the next action actually selected.", meaning: "The target includes behavior's exploration. The name SARSA records the five observed elements: state, action, reward, next state, and next action." },
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma\\max_aQ(S_{t+1},a)-Q(S_t,A_t)\\right]", read: "Q-learning moves the current action value toward reward plus the discounted largest next-state action value.", meaning: "The maximization defines a greedy target policy. Behavior may be different, which makes coverage and off-policy stability important beyond the tabular case." },
    ],
    boundary: {
      title: "A greedy target is not a safety guarantee", paragraphs: ["In the cliff example, Q-learning's target imagines greedy continuation while the actual epsilon-greedy behavior can still fall. Deployed exploration requires constraints, shielding, simulation, or another evidence plan; it cannot be justified by the target equation." ,"Tabular convergence does not transfer automatically to neural approximation. Replay, moving targets, and off-policy bootstrapping form the deadly triad studied next and can produce divergence even when the tabular algorithm is well behaved."],
    },
    nextBridge: "Q-learning already learns about one policy from data generated by another. The next chapter makes that separation explicit, derives importance ratios, and shows why off-policy learning, bootstrapping, and function approximation can become an unstable combination.",
    sources: [SB, { label: "Watkins and Dayan — Q-learning", url: "https://link.springer.com/article/10.1007/BF00992698", kind: "paper" }, { label: "van Hasselt — Double Q-learning", url: "https://proceedings.neurips.cc/paper/2010/hash/091d584fced301b442654dd8c23b3fc9-Abstract.html", kind: "paper" }],
  },
  {
    slug: "off-policy-deadly-triad",
    title: "Correct off-policy data and recognize the deadly triad",
    deck: "Off-policy learning reuses behavior generated elsewhere, but corrections require coverage and can have extreme variance. With approximation and bootstrapping, the same mismatch can drive values away from any sensible solution.",
    openingQuestion: "Can data from one policy answer what another policy would have done, and what must be true before the correction is valid?",
    bridge: "Tabular Q-learning showed that behavior and target can differ. General off-policy learning now names both policies and accounts for their action probabilities. The benefit is data reuse; the risks are missing coverage, explosive likelihood ratios, and the deadly triad of off-policy updates, bootstrapping, and function approximation.",
    situation: {
      title: "A cautious logger rarely chooses the target policy's action",
      paragraphs: ["A behavior policy b recommends treatment A with probability 0.9 and B with probability 0.1. A proposed target policy π reverses those probabilities. A logged B outcome is much more representative of the target than an A outcome, so importance sampling weights it more heavily." ,"The one-step ratio π(a|s)/b(a|s) is 9 for B and about 0.11 for A. Across a long trajectory, multiplying ratios can produce enormous or tiny weights. A few rare episodes may dominate the estimate, yielding correct expectation in theory but unusable finite-sample variance." ,"No reweighting can recover an action that behavior never took. The coverage condition requires b(a|s)>0 wherever π(a|s)>0 for relevant states. Function approximation adds generalization across states, and bootstrapping feeds current estimates back into targets. Together with off-policy mismatch, these ingredients can amplify error instead of averaging it away."],
    },
    diagram: {
      title: "Correction works only where behavior provides support", caption: "Likelihood ratios change the contribution of observed data. They cannot create counterfactual outcomes for actions absent from the log.",
      items: [
        { label: "Behavior policy", value: "b(a|s)", note: "Generated the observed action and must be logged or known." },
        { label: "Target policy", value: "π(a|s)", note: "The policy whose value or update is desired." },
        { label: "Importance ratio", value: "ρ=π/b", note: "Upweights actions more likely under target and downweights others." },
        { label: "Coverage gate", value: "π>0 ⇒ b>0", note: "Without overlap, the desired counterfactual is unidentified from these data." },
      ],
    },
    workedExample: {
      title: "Reweight two logged actions",
      setup: "Behavior chooses A with 0.9 and B with 0.1. Target chooses A with 0.1 and B with 0.9. The log contains one reward 2 after A and one reward 6 after B.",
      prediction: "Which sample receives the larger weight when estimating the target policy?",
      steps: [
        { label: "A ratio", calculation: "ρ(A)=0.1/0.9≈0.111", explanation: "A is common under behavior but rare under target, so its contribution shrinks." },
        { label: "B ratio", calculation: "ρ(B)=0.9/0.1=9", explanation: "B is rare in the log but common under target, so this one sample receives large influence." },
        { label: "Ordinary weighted sum", calculation: "0.111×2+9×6=54.222", explanation: "With only two samples the estimate is dominated by B. Normalization or clipping can reduce variance but changes bias and interpretation." },
        { label: "Missing support case", calculation: "if b(B|s)=0, ρ(B) is undefined", explanation: "The log contains no B consequence. A model assumption or new data is required; arithmetic cannot fix absence." },
      ],
      result: "Off-policy correction is a data-coverage argument before it is an equation. Large ratios warn that the target relies on decisions behavior almost never made.",
    },
    mechanism: {
      introduction: "Off-policy methods differ in where they apply corrections, how they control variance, and whether their targets remain stable with approximation.",
      sections: [
        { title: "Importance sampling changes the measure", paragraphs: ["Multiplying by π/b converts an expectation under behavior into one under target when support and probability assumptions hold. Per-decision ratios can correct only the part of a return affected by each action, often reducing variance relative to a full-trajectory product."] },
        { title: "Variance control introduces tradeoffs", paragraphs: ["Self-normalized weights, clipping, truncation, Retrace-style coefficients, and V-trace trade some bias for stability. The chosen correction is part of the algorithm and must be reported. A stable curve does not mean the uncorrected target policy was identified."] },
        { title: "The deadly triad is an interaction", paragraphs: ["Function approximation alone can work, bootstrapping alone can work, and off-policy learning alone can work. Combining all three can make the projected update operator unstable. Baird's counterexample shows divergence in a tiny linear setting, so the issue is not merely deep-network optimization."] },
        { title: "Target networks and replay manage symptoms, not proofs", paragraphs: ["Deep RL commonly freezes target parameters temporarily and samples replay data to reduce correlation. These mechanisms improve practical behavior but do not guarantee convergence under arbitrary off-policy distributions. Diagnostics need value scale, TD error, coverage, ratios, and performance under the target policy."] },
      ],
    },
    equations: [
      { latex: "\\rho_t=\\frac{\\pi(A_t\\mid S_t)}{b(A_t\\mid S_t)}", read: "The importance ratio at time t is the target policy probability of the observed action divided by the behavior policy probability of that action.", meaning: "The denominator must be positive and accurately known for observed actions. Ratios far from one reveal distribution mismatch and potential variance, not merely a numerical nuisance." },
      { latex: "\\mathbb{E}_{A\\sim b(\\cdot\\mid s)}[\\rho(A,s)X(s,A)]=\\mathbb{E}_{A\\sim\\pi(\\cdot\\mid s)}[X(s,A)]", read: "At a fixed state, weighting behavior-policy actions by the target-to-behavior likelihood ratio recovers the target policy's conditional action expectation.", meaning: "The fixed-state condition matters: one action ratio does not correct a different state-occupancy distribution. Whole-trajectory or per-decision estimators need the corresponding sequence of ratios, support, and sampling assumptions." },
    ],
    boundary: {
      title: "Off-policy data is not automatically counterfactual evidence", paragraphs: ["Logged policy probabilities correct action-selection mismatch only for recorded context. If hidden variables influenced both action and outcome, standard importance sampling does not remove that confounding. Causal assumptions and data collection design remain necessary." ,"A low training loss on replay can coexist with catastrophic target-policy behavior outside the data support. Conservative offline RL, uncertainty, simulators, or guarded online collection address parts of that problem later; none turns absent evidence into certainty."],
    },
    nextBridge: "The tabular setting made every state-action value independent. Real problems cannot store one number per pair, so the next part replaces tables with shared functions. Linear approximation is the cleanest place to see how one update generalizes—and how the deadly triad can spread one error across many states.",
    sources: [SB, { label: "Precup, Sutton, and Singh — Eligibility Traces for Off-Policy Policy Evaluation", url: "https://www.cs.mcgill.ca/~dprecup/publications/Iswc.pdf", kind: "paper" }, { label: "Tsitsiklis and Van Roy — Analysis of Temporal-Difference Learning with Function Approximation", url: "https://ieeexplore.ieee.org/document/580874", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
