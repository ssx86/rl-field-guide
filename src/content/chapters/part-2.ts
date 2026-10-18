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
    bridge: "Now the robot must compare situations and actions. Listing every possible future would be too much. We need a smaller summary.",
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
      setup: "A robot stands at position A. Moving right usually reaches the charging dock worth 5 points, but 20% of the time it slips to a waiting area worth 1. The move itself costs nothing. Gamma is 0.9.",
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
      setup: "A robot walks a corridor: start → middle → exit. Reaching the exit earns +1. Every other step earns 0. Gamma is 0.9, and both starting values are 0.",
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
    bridge: "The model is gone. The learner can still follow a policy, record what happens, and learn after the ending is known.",
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
    title: "Learn before the trip is over",
    deck: "A learner does not always have to wait for the ending. It can use the next real reward, then borrow its current forecast for the part that has not happened yet.",
    openingQuestion: "A robot needs twenty moves to reach a charger. Can the nineteenth move teach it something before the whole trip is finished?",
    bridge: "Monte Carlo learning waits for a complete result. That can take a long time. We will now update earlier, while keeping a clear line between rewards we have seen and future value we are only estimating.",
    situation: {
      title: "The charger can send useful news backward",
      paragraphs: ["A robot reaches a charger after twenty moves. Monte Carlo learning waits until the trip ends before changing the first state's value. The wait may be long." ,"Another method updates after one move. When the robot sees the charger, the state just before it improves at once. Later visits can carry that better forecast farther backward." ,"This is called temporal-difference learning, or TD learning. It compares two predictions made at nearby times. The target uses a real reward and an estimated value for the unfinished future."],
    },
    diagram: {
      title: "Choose where real rewards stop and the estimate begins", caption: "A short target learns sooner and borrows more. A long target waits for more real rewards before using a value estimate.",
      items: [
        { label: "TD(0)", value: "Rₜ₊₁+γV(Sₜ₊₁)", note: "See one reward, then use the next state's estimated value." },
        { label: "n-step", value: "n rewards + γⁿV(Sₜ₊ₙ)", note: "See n rewards, then estimate the part that remains." },
        { label: "Monte Carlo", value: "complete return", note: "Wait for every reward until the task truly ends." },
        { label: "TD(λ)", value: "weighted mixture", note: "Blend short and long targets instead of choosing only one length." },
      ],
    },
    workedExample: {
      title: "Compare a quick update with a more patient update",
      setup: "A courier leaves the depot. The next two stops earn 2 and 3. Gamma is 0.9. The forecast for stop one is V=5 and for stop two is V=8. The trip continues after that.",
      prediction: "Which target uses more rewards that really happened? Which one relies more on the current value table?",
      steps: [
        { label: "One-step target", calculation: "G₀:₁=2+0.9×5=6.5", explanation: "We see reward 2, then let V(S₁) stand for everything later." },
        { label: "Two-step target", calculation: "G₀:₂=2+0.9×3+0.9²×8=11.18", explanation: "We see rewards 2 and 3 before using the estimate V(S₂)." },
        { label: "TD error", calculation: "δ₀=2+0.9×5−V(S₀)", explanation: "This is the gap between the quick target and the old forecast at S₀." },
        { label: "Trace update", calculation: "V(s)←V(s)+αδₜeₜ(s)", explanation: "Recent states receive part of the new error according to the trace they still carry." },
      ],
      result: "The targets differ because they stop observing at different places. Lambda gives a rule for blending several target lengths.",
    },
    mechanism: {
      introduction: "The family of methods changes one simple choice: how long to wait before borrowing a forecast.",
      sections: [
        { title: "Bootstrapping means using one estimate inside another", paragraphs: ["A one-step target learns quickly, but a wrong next-state value makes the target wrong too. Monte Carlo avoids that borrowed estimate, yet its complete returns can vary much more."] },
        { title: "An n-step target waits for n rewards", paragraphs: ["A larger n uses more events that really happened. It also delays the update and needs more memory. If the task ends early, there is no value left to borrow."] },
        { title: "Lambda blends many waiting times", paragraphs: ["A lambda return gives weights to one-step, two-step, and longer targets. Lambda 0 gives TD(0). In a finished episodic task, lambda 1 moves toward Monte Carlo."] },
        { title: "A trace keeps recent states ready for an update", paragraphs: ["An eligibility trace is a fading mark on recently visited states. A new TD error can update every state whose mark remains. The mark shows recency, not proof of cause."] },
      ],
    },
    equations: [
      { latex: "G_{t:t+n}=R_{t+1}+\\gamma R_{t+2}+\\cdots+\\gamma^{n-1}R_{t+n}+\\gamma^nV(S_{t+n})", read: "Add n observed rewards. Then add the discounted value estimate at the state reached after those n steps.", meaning: "The rewards came from the real trip. Only the final value term is a forecast for what has not yet been seen." },
      { latex: "e_t(s)=\\gamma\\lambda e_{t-1}(s)+\\mathbf{1}(S_t=s)", read: "Shrink the old trace by gamma times lambda. Then add one when state s is visited now.", meaning: "A later TD error travels back through the remaining traces. Different trace rules handle repeated visits differently." },
    ],
    boundary: {
      title: "A longer target does not tell us who truly caused the result", paragraphs: ["A larger n or lambda can move news farther backward. It also spreads noisy evidence. The robot may still fail to find a rare reward in the first place.", "Traces from another behavior policy need special correction. Reusing them without care can point the update toward the wrong policy and become unstable."],
    },
    nextBridge: "So far, the learner has judged a stated policy. Next it must improve the policy too. The key question will be simple: which next action should stand for the future?",
    sources: [SB, { label: "Sutton — Learning to Predict by the Methods of Temporal Differences", url: "https://link.springer.com/article/10.1007/BF00115009", kind: "paper" }],
  },
  {
    slug: "tabular-control",
    title: "Decide which next action should represent the future",
    deck: "Several algorithms can see the same move and reward, yet learn different answers. They disagree about what the learner will do after reaching the next state.",
    openingQuestion: "Should an update use the next action that really happened, the policy's average action, or the action that currently looks best?",
    bridge: "TD learning used a value for the next state. A learner that improves its actions needs a more exact answer. We will put one transition on the table and change only the way its future is valued.",
    situation: {
      title: "A short path beside a cliff makes the difference visible",
      paragraphs: ["A walker can use a short path beside a cliff or take a longer safe path. Its epsilon-greedy policy usually chooses the best-looking move and sometimes tries a random move." ,"Suppose one random move sends the walker toward the cliff. One learning rule includes that risky next move in its target. Another rule imagines that the walker becomes greedy from the next state onward." ,"The two rules saw the same transition. They learn different values because they are answering questions about different future behavior."],
    },
    diagram: {
      title: "Keep the transition fixed and change only the future", caption: "The reward is the same in every row. The rows differ only in which next-action value enters the target.",
      variant: "formula-compare",
      items: [
        { label: "SARSA", value: "Use the next action that was sampled", latex: "Q(S_{t+1},A_{t+1}),\\quad A_{t+1}\\sim\\pi(\\cdot\\mid S_{t+1})", note: "Value the action that the behavior policy really chose next." },
        { label: "Expected SARSA", value: "Average all next actions under a policy", latex: "\\sum_{a\\in\\mathcal{A}(S_{t+1})}\\pi(a\\mid S_{t+1})Q(S_{t+1},a)", note: "Use every next action and weight it by the policy's chance." },
        { label: "Q-learning", value: "Use the largest next-action value", latex: "\\max_{a\\in\\mathcal{A}(S_{t+1})}Q(S_{t+1},a)", note: "Value a greedy future even while the behavior policy explores." },
        { label: "Double Q-learning", value: "Choose with table A and score with table B", latex: "a^*=\\arg\\max_a Q^A(S_{t+1},a),\\quad Q^B(S_{t+1},a^*)", note: "Separate choosing the winner from judging the winner." },
      ],
    },
    workedExample: {
      title: "Use one transition to calculate three targets",
      setup: "The reward is 2 and gamma is 0.9. The task has not ended. The next sampled action is worth 3. The two next actions are worth 3 and 6, with policy chances 0.1 and 0.9.",
      prediction: "Before calculating, which target should be smallest and which should be largest?",
      steps: [
        { label: "SARSA", calculation: "2+0.9×3=4.7", explanation: "Use the next action that was actually sampled, even when it was exploratory." },
        { label: "Expected SARSA", calculation: "2+0.9×(0.1×3+0.9×6)=7.13", explanation: "Average the two next actions using their chances under the policy." },
        { label: "Q-learning", calculation: "2+0.9×6=7.4", explanation: "Use the larger value 6 and imagine greedy behavior from the next state." },
        { label: "If the task ended", calculation: "if terminated, all three targets equal reward 2", explanation: "There is no unfinished future after a true ending, so every target is just the reward." },
      ],
      result: "The formulas differ because the imagined future differs. This can change which route the walker learns near the cliff.",
    },
    mechanism: {
      introduction: "The algorithm names come last. First decide which future each update is meant to judge.",
      sections: [
        { title: "SARSA follows the behavior that produced the data", paragraphs: ["Its full name records State, Action, Reward, State, Action. The last action is the one really chosen next. If behavior keeps exploring, the learned value includes the cost of that exploration."] },
        { title: "Expected SARSA replaces one draw with an average", paragraphs: ["A sampled next action may be lucky or unlucky. Expected SARSA averages all next actions under a stated policy. It uses more calculation and removes this one source of randomness."] },
        { title: "Q-learning judges a greedy future", paragraphs: ["The behavior policy may still explore, but the maximum values the best-looking next action. This makes Q-learning off-policy. The greedy target does not make real exploration safe."] },
        { title: "Double Q-learning separates choosing from scoring", paragraphs: ["A noisy high estimate often wins a maximum. Double Q-learning uses one table to choose the action and another to score it. This reduces that upward bias but cannot remove every error."] },
      ],
    },
    equations: [
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\\right]", read: "Start with the reward, then add the discounted value of the next action that was really selected. Move the old value toward that target.", meaning: "The last action comes from the behavior policy. Exploration therefore appears inside the learned value." },
      { latex: "Q(S_t,A_t)\\leftarrow Q(S_t,A_t)+\\alpha\\left[R_{t+1}+\\gamma\\max_aQ(S_{t+1},a)-Q(S_t,A_t)\\right]", read: "Start with the reward, then add the discounted largest action value at the next state. Move the old value toward that target.", meaning: "The maximum describes a greedy target policy. The behavior that collected the data may still be different." },
    ],
    boundary: {
      title: "A greedy target cannot protect the walker from exploration", paragraphs: ["Q-learning may imagine greedy choices after the next state. The real epsilon-greedy walker can still make a random move into the cliff. Safe exploration needs separate limits or a safe simulator.", "These results also belong to the table setting. When many states share neural-network parameters, one update can change values elsewhere. The next chapter explains why that can become unstable."],
    },
    nextBridge: "Q-learning uses data from one behavior to judge another policy. Next we ask when old data is allowed to speak for a new policy, and what happens when the log barely covers the actions we care about.",
    sources: [SB, { label: "Watkins and Dayan — Q-learning", url: "https://link.springer.com/article/10.1007/BF00992698", kind: "paper" }, { label: "van Hasselt — Double Q-learning", url: "https://proceedings.neurips.cc/paper/2010/hash/091d584fced301b442654dd8c23b3fc9-Abstract.html", kind: "paper" }],
  },
  {
    slug: "off-policy-deadly-triad",
    title: "Check whether an old log can answer a new question",
    deck: "A log from one policy can sometimes help judge another. It works only when the log contains the actions the new policy needs, and a few rare records may receive too much weight.",
    openingQuestion: "If the old policy almost never chose route B, can its log tell us whether a new policy should choose B most of the time?",
    bridge: "Separating the data-collecting policy from the judged policy creates a new duty. Before reusing the log, we must check what it actually saw.",
    situation: {
      title: "The old route chooser rarely tried B",
      paragraphs: ["The old behavior policy chooses route A with chance 0.9 and B with chance 0.1. A proposed target policy reverses the chances. It wants B most of the time." ,"A rare B record matters a lot to the new policy. We can give it more weight. But making one record nine times heavier does not turn it into nine independent trips." ,"If the old policy never chose B, the log contains no B result. No weighting formula can create the missing trip. New data or an extra model assumption is required."],
    },
    diagram: {
      title: "First ask whether the log contains the needed action", caption: "A probability ratio can change the weight of an observed result. It cannot invent a result for an action that never happened.",
      items: [
        { label: "Who made the log", value: "b(a|s)", note: "The behavior policy chose the actions that produced the records." },
        { label: "Who we want to judge", value: "π(a|s)", note: "The target policy is the new policy named in the question." },
        { label: "How the weight changes", value: "ρ=π/b", note: "An action gets more weight when the target uses it more often." },
        { label: "The coverage check", value: "π>0 ⇒ b>0", note: "If the target may choose an action, the behavior must have allowed it too." },
      ],
    },
    workedExample: {
      title: "Give two old route records new weights",
      setup: "Behavior chooses A with 0.9 and B with 0.1. Target chooses A with 0.1 and B with 0.9. The log has one reward 2 after A and one reward 6 after B.",
      prediction: "Which record will receive more weight when we judge the target policy?",
      steps: [
        { label: "Weight for A", calculation: "ρ(A)=0.1/0.9≈0.111", explanation: "A was common in the old log but is rare under the target, so its weight shrinks." },
        { label: "Weight for B", calculation: "ρ(B)=0.9/0.1=9", explanation: "B was rare in the log but common under the target, so this single result gets a large weight." },
        { label: "Weighted sum", calculation: "0.111×2+9×6=54.222", explanation: "With only two records, B controls almost the whole answer. A computable number may still be unstable." },
        { label: "If B was never tried", calculation: "if b(B|s)=0, ρ(B) is undefined", explanation: "There is no B result to reweight. Arithmetic cannot repair an empty part of the log." },
      ],
      result: "Coverage comes before correction. A very large ratio is a warning that the answer depends on an action the old policy rarely tried.",
    },
    mechanism: {
      introduction: "Once coverage is present, weights can adjust the old records. That still leaves two different dangers.",
      sections: [
        { title: "Importance sampling changes who each record represents", paragraphs: ["The target-to-behavior ratio is called an importance ratio. Under the right coverage and probability conditions, weighting by this ratio changes an average from the behavior policy to the target policy."] },
        { title: "Long trips multiply the weights", paragraphs: ["A trip with many actions may multiply many ratios. The final weight can become huge or almost zero. Clipping or normalizing weights can calm the estimate, but it also changes the answer."] },
        { title: "Three ordinary ideas can form a dangerous loop", paragraphs: ["The loop combines off-policy data, bootstrapping, and function approximation. This combination is called the deadly triad. Shared parameters spread one error. Bootstrapping then reuses the changed estimate as a new target. The mismatch in data can keep feeding the error."] },
        { title: "A smooth training curve is not a proof", paragraphs: ["Replay and target networks often reduce shaking during training. They do not guarantee that every off-policy problem will converge. We must still check coverage, ratios, value size, TD errors, and the target policy itself."] },
      ],
    },
    equations: [
      { latex: "\\rho_t=\\frac{\\pi(A_t\\mid S_t)}{b(A_t\\mid S_t)}", read: "For the action that happened, divide its chance under the target policy by its chance under the behavior policy.", meaning: "The bottom number must be above zero and known correctly. A large ratio says the target depends on a rare old action." },
      { latex: "\\mathbb{E}_{A\\sim b(\\cdot\\mid s)}[\\rho(A,s)X(s,A)]=\\mathbb{E}_{A\\sim\\pi(\\cdot\\mid s)}[X(s,A)]", read: "At one fixed state, weight behavior actions by the ratio. Their average then matches the target policy's action average.", meaning: "This fixes the action mix at that state. It does not automatically fix how often the two policies reach different states." },
    ],
    boundary: {
      title: "Weights cannot repair hidden causes or missing experience", paragraphs: ["Suppose an unrecorded road closure affected both the route choice and the reward. Action probabilities cannot remove that hidden cause. We still need to understand how the log was collected.", "A small training loss may only show that the model fits the covered part of the log. Outside that part, the target policy can still fail badly. Missing evidence remains missing."],
    },
    nextBridge: "A table gives every state-action pair its own box. Real problems have too many boxes. The next part lets many states share one function, which saves space but also lets one mistaken update spread farther.",
    sources: [SB, { label: "Precup, Sutton, and Singh — Eligibility Traces for Off-Policy Policy Evaluation", url: "https://www.cs.mcgill.ca/~dprecup/publications/Iswc.pdf", kind: "paper" }, { label: "Tsitsiklis and Van Roy — Analysis of Temporal-Difference Learning with Function Approximation", url: "https://ieeexplore.ieee.org/document/580874", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
