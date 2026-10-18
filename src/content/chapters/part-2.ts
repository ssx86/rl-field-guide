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
        "You are the controller of a factory machine, and the screen reads 80°C. From where you sit, the options look simple: cool it, keep it running, or stop it. But the number on the screen is quieter than the machine. Perhaps the temperature climbed from 60°C over the last ten minutes. Then the machine is still heating, and 80 is about to become 90. Perhaps it just cooled from 95°C. Then the danger is passing. Two different machines, one reading, two very different next chapters.",
        "What the controller receives is an observation — the raw delivery of information, nothing more. What the controller needs is a state: a summary that carries the past facts which actually change what happens next. Add the temperature's direction of travel to the screen reading. The two cases come apart, and the learner can finally see which situation it is in. The art of this chapter is deciding what belongs in that summary. The past always matters. The only question is which parts of it earn a place.",
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
        { title: "A state is a memory with a job", paragraphs: [
          "The past has not stopped mattering — it never does. What the Markov property asks is narrower and far more useful. The state should carry the parts of the past which change the next result. Everything older can then be safely forgotten. The bare temperature reading fails this test. The trend, a fact about the past, moves the failure odds from 5 percent to 30. Add the trend, and the pair (temperature, direction) passes. A good state is not a diary. It is a memory with a job to do.",
          "Time deserves a seat in that memory more often than you might expect. One minute left on the clock is a different situation from one hour left. The temperature and the trend may be identical. Yet the best action can change when the horizon shrinks. If the remaining time changes what should be done, the learner must see it. A hidden clock makes two different situations look identical. A learner that cannot tell them apart will average together answers that deserve to stay separate.",
        ]},
        { title: "Naming the whole task — and who visits it", paragraphs: [
          "Once you commit to a state, the whole task can be written down as a Markov Decision Process. An MDP lists the states, the actions available in each, and the chances of every possible next state and reward. It also says how a run begins. The policy is the rule that chooses actions from states. Nothing here is exotic. It is the interaction loop you drew in Part 1. It now stands on the promise that the state is enough.",
          "Here is the consequence people miss. A controller that always stops at 80°C will almost never see 90°C. So 90°C will never appear in its training data with any action attached. The situations a policy visits make up its occupancy. Unvisited situations create no evidence. Change the policy and you change the data, even though the factory itself never moved. In reinforcement learning, the learner's own behavior is part of its experimental design. That theme will follow us to the last page of this book.",
        ]},
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
        "Return to the robot waiting in corridor A. Its policy usually says 'move right.' The outcome is genuinely out of its hands. On most trips it rolls straight through. Sometimes the wheels slip, and it loses time. Some trips are quick, some are slow, and no single trip settles anything. So we ask a cooler-headed question. If the robot keeps following this policy from A, what reward can it expect on average across the whole future? That forecast is the state value.",
        "A narrower question sits beside it. Suppose the robot moves right now — this once, by decree — and after that single move returns to its policy. What is the expected reward then? That is the action value. Because the first move has been fixed, it answers a different question with a different number. Neither value is buried in the floor like treasure. Both are forecasts made under stated rules. They belong to a plan for acting, not to a place. Change the policy, and the same corridor changes its value.",
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
      setup: "A robot stands at position A. Moving right usually reaches the charging dock, but 20% of the time it slips to a waiting area. The move itself costs nothing: the transition reward for reaching the dock is 0, and v(dock)=5 (the dock is an absorbing state where the robot stays to charge). The waiting area likewise has v(waiting)=1. Gamma is 0.9.", // Marcus P0 fix: clarify reward vs value so 0.8×(0+0.9×5)=3.6 is reconstructible
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
      introduction: "The symbols are easier when each one is tied to a question. Convention: lowercase v_π, q_π denote true values under policy π; uppercase V, Q denote the learner's current estimates. This book uses uppercase from the next chapter onward.", // Marcus P1 fix
      sections: [
        { title: "Two questions, two values", paragraphs: [
          "Keep two questions sharply separated. Every formula in this book answers one of them. State value asks, 'How good is it to be here?' The answer always depends on the policy that acts from here. A bold policy and a timid one write different futures from the same corridor. Change the policy, and the state value changes with it. That is why we write v with a subscript π. A value without its policy is a number without its question.",
          "Action value asks, 'How good is this first move?' Fix one action, then follow the policy afterward. The gap between an action's value and the state's usual value is the advantage. It is exactly what a chooser needs. An action that beats its state's average has a positive advantage and deserves attention. Later chapters will speak of methods that 'use the advantage.' They are simply sharpening this comparison between what was chosen and what is normal here.",
        ]},
        { title: "One step plus the rest", paragraphs: [
          "Now comes the idea that makes calculation possible. A long future is painful to sum directly. So a Bellman equation breaks it after one step. The next reward covers the step you can see. The next state's value stands in for everything after it. Look back at the equations in this chapter. You will find that shape everywhere — one real reward, a discount, and a borrowed forecast. 'Bellman' is not new mathematics. It is the name for a powerful way of arranging the accounting.",
          "One fork remains, and it decides which question an equation answers. Averaging over the actions of a stated policy describes what that policy will actually do. That is the π(a|s) in the first equation. Taking the maximum instead imagines the chooser behaving greedily from the next state onward. That is the max in the second equation. The maximum quietly changes the question from 'What will this policy do?' to 'What is the best action?' Hold onto the distinction. The coming chapters build entire algorithms on it.",
        ]},
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
        "Imagine four rooms connected by doors. One room holds a goal worth +1, and every other move earns 0. Suppose you also know the entire map — exactly what each action does in each room. Then you could solve this on paper before any robot takes a step. Begin by giving every room value 0, since nothing is known yet. After one round of calculation, the room beside the goal discovers the +1. After a second round, that news reaches a room two steps away. Value flows backward through the map, one round at a time.",
        "This repeated use of known rules is called dynamic programming, or DP. The word 'programming' here means arranging calculations in a smart order. It is an older sense of the word, not writing computer code. The name has frightened students for decades without cause. The idea is the friendly one you just watched. If the rules are known, the goal's value can percolate backward until every room knows its future. No real trips, no risk, no exploration required.",
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
        { title: "Judge the policy, then improve it", paragraphs: [
          "The whole of dynamic programming swings between two jobs. The first is evaluation. Hold the policy fixed, follow it through the known model, and update the values round after round. Stop when another pass would barely move them. You are judging a stated rule. Monte Carlo will make the same judgment from real trips in the next chapter. Here the model supplies every consequence, so no trip is ever risked. The second job is improvement. At each state, look one step ahead. If some action now promises a larger forecast than the policy's own choice, switch to it.",
          "Do evaluation, then improvement, then evaluation again, and you have policy iteration. Each improvement step is safe. Under the values just computed, the new policy is never worse than the old one. In a finite discounted task, the alternation settles on the best policy. Notice how the two jobs feed each other. Better values suggest better actions. Better actions change which futures deserve re-judging.",
        ]},
        { title: "Blending the jobs, and sweeping smartly", paragraphs: [
          "Nothing forces you to finish one job before starting the other. Value iteration takes the greedy action inside every value update. It folds improvement into the sweep itself and never waits for a complete evaluation. In a finite discounted task, its values still climb toward the best possible ones. This willingness to interleave judging and improving is called generalized policy iteration. You will meet its ghost in nearly every algorithm ahead — even the ones that learn without any model.",
          "The order of updates is a quiet economy. A freshly computed value can be used immediately, instead of waiting for the whole round to finish. The states that matter most can be swept first — the goal's neighbors before the far corners. None of this changes the model or the answer being approached. Only the calculation order changes. But in a large world, the order decides whether an answer arrives this week or next year. That is why practitioners care about it so much.",
        ]},
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
      paragraphs: ["Suppose you are playing a card game whose hidden rules you do not know. You cannot list the shuffle probabilities. You would not fully trust a list if you could. Your total is 18, and you choose to stop drawing. The game plays out to a win worth +1 or a loss worth −1. Notice what you learned from. Not a rulebook — an outcome. That one finished game is a small, honest piece of evidence about what stopping from 18 tends to earn.", "One game gives one noisy answer. Many games from similar situations give many, and their average settles into an estimate. It estimates how good that situation is under your policy. This is Monte Carlo learning. The name simply means learning from repeated random trials, with each complete game serving as one trial. The strategy is the oldest one in statistics. When you cannot compute the expectation, repeat the experiment and measure it. The catch, which this chapter will face squarely, is what waiting for 'complete' costs."],
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
        { title: "An honest target, and one bookkeeping choice", paragraphs: [
          "The heart of the method is the target the learner moves toward. Monte Carlo builds the return from rewards that actually happened, end to end. It never inserts its own current value guess into the sum. That honesty has a real payoff. A wrong value estimate cannot directly corrupt the target, the way it will in the next chapter's method. Chance still makes individual returns noisy. But the noise belongs to the world, not to the learner's self-echo.",
          "One bookkeeping choice appears immediately. Suppose the same state turns up twice within a single game. You hold 18, draw down to 16, and later see 18 again. First-visit MC uses only the first appearance. Every-visit MC uses both. The two agree closely in most practice, and both can be proved sound. But they average different samples, so they can disagree in their digits. Know which one your code implements before you compare results with anyone.",
        ]},
        { title: "The price of waiting", paragraphs: [
          "To improve a policy rather than merely judge it, every action needs evidence. Evidence comes only from trying. If stopping from 18 is never tried, no amount of averaging will reveal its worth. An epsilon-soft policy keeps a small probability on every action for exactly this reason. Lowering that epsilon too quickly can freeze an early mistake in place. The policy stops visiting the very alternatives that could have corrected it. Exploration, which you first met at the café counter, returns here with real teeth.",
          "The deeper cost is time. A hand of cards ends in seconds, so waiting for complete returns is cheap. A factory controller may run for months. A task with no natural ending makes the whole idea wobble. Waiting delays learning badly. Complete returns also vary wildly from run to run. Hold that discomfort for one more page. The next chapter asks exactly whether the learner can start sooner, with a few real rewards and one careful guess about the unfinished future.",
        ]},
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
      paragraphs: ["A robot needs twenty moves to reach its charger. Under Monte Carlo learning, the value of the first position cannot change until the whole trip is known. The first state waits, in effect, for the ending of the world. But watch what actually happens along the way. When the robot finally sees the charger, the state just before it improves at once. Its future is now nearly certain. Something real has been learned before any trip was completed.", "On the robot's next trip, that improved state stands one step earlier in the chain. Its better forecast can flow one step farther back. Trip by trip, the news about the charger travels backward down the corridor. Nobody ever waits for a whole trip to be summed. This is temporal-difference learning, or TD. It does not compare a prediction to a finished outcome. It compares two predictions made at nearby times, using one real reward and one borrowed forecast."],
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
        { title: "How long to wait before borrowing", paragraphs: [
          "Every method in this family turns one dial. How much of the future must be real before the learner may guess the rest? A one-step target sees one actual reward and borrows a forecast for everything after. That borrowing is called bootstrapping, and it cuts both ways. It lets learning start immediately. But whatever is wrong in the next state's value seeps into the target, and from there into the update. Monte Carlo, at the other extreme, borrows nothing. It pays for that purity with returns that swing much more widely.",
          "Between the extremes sit the n-step targets. A larger n means more rewards that truly happened. It also means a smaller borrowed estimate in each target, which sounds strictly better. But it delays the updates and holds more of the trip in memory. It accepts more variance from the real world too. And if the task ends before n steps arrive, there is no value left to borrow at all. The target must simply stop where the truth stops.",
        ]},
        { title: "Lambda blends the wait; traces deliver the update", paragraphs: [
          "Rather than argue over the single best n, the lambda return blends them. It weights the one-step, two-step, and longer targets together. The weights fade according to one number, λ. Set λ to 0 and you recover TD(0), learning at the first opportunity. Set λ to 1 in a finished episodic task and the blend slides toward Monte Carlo. Between those poles lies a continuum. Lambda is simply where you choose to stand on it.",
          "Blending many target lengths could be expensive. The eligibility trace is the trick that makes it cheap. A trace is a fading mark on each recently visited state. Every step shrinks the old marks by γλ and stamps the current state with a one. When a new TD error appears, every state whose mark survives receives a share of it, all at once. The mark measures recency, not proof of cause. States are updated because they were nearby. The world's true credit assignment may disagree.",
        ]},
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
      paragraphs: ["Picture a walker choosing between two paths. The short path runs beside a cliff; the longer route is safer. Its epsilon-greedy policy usually picks the best-looking move. Now and then it throws in a random one. That is the standing price of exploration, and most days it is a small price. Now suppose one of those random moves sends the walker one step toward the cliff edge. The transition has happened. It sits in the log, waiting to be learned from. And here the story forks.", "One learning rule, reading this transition, values the move the walker actually made next. That includes the risky step toward the edge. Another rule imagines the walker turning perfectly greedy from the next state onward. It acts as if the randomness had never existed. Both rules saw the same state, the same action, the same reward. They will learn different values, because they answer questions about different futures. Near a cliff, that disagreement is not academic. It decides which path the walker ends up trusting."],
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
        { title: "Futures that include the explorer", paragraphs: [
          "SARSA's full name is a shopping list — State, Action, Reward, State, Action. The final item is the whole point. The last action is the one the behavior policy really chose next. So the learned value includes the cost of living with exploration. A walker that keeps stumbling near the cliff will find that danger honestly priced into its values. That is why SARSA often learns the safer route. It values the future it will actually live in, stumbles included.",
          "Expected SARSA makes one surgical change. Instead of using the single next action that happened to be sampled, it averages all next actions under the stated policy. A sampled action may be lucky or unlucky. The average removes that one source of randomness from the target. The cost is a little more computation per step. In the cliff example, it prices in the explorer's average behavior rather than the most recent whim. That usually steadies learning without changing the question being asked.",
        ]},
        { title: "Futures that imagine a different walker", paragraphs: [
          "Q-learning takes the maximum over next actions. That quietly changes whose future is being valued. The behavior policy may still explore. The walker may still be thrown toward the cliff tomorrow. But the target imagines greedy behavior from the next state onward. This is what 'off-policy' means. Data is collected under one policy; judgment is passed on another. The greedy target is mathematically clean, and it often races toward the optimal values. But do not mistake it for a safety feature. The imagined future is not the one the walker will live.",
          "The maximum has one more weakness worth naming now. It grows louder in later chapters. When several noisy estimates compete, the largest is often large by luck. Taking a maximum therefore leans systematically upward. Double Q-learning splits the job. One table chooses the winning action, and a different table scores it. Since the two tables' errors do not align, much of the upward bias cancels. It is a patch rather than a cure — but a cheap and famous one.",
        ]},
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
      paragraphs: ["Your company's old routing policy chose route A nine times out of ten, and route B once. A new policy you want to evaluate reverses those odds. It wants B most of the time. The log in front of you holds hundreds of A trips and a scattering of B trips. Every B record suddenly matters enormously to your question. You can weight it nine times heavier than before. The arithmetic will happily oblige. But notice what you did not do. You did not turn one real trip into nine independent ones.", "The harder case sits one step further. Suppose the old policy never chose B at all. Then the log contains no B result, and no weighting formula can conjure the missing experience. A ratio whose denominator is zero is not a huge weight. It is an undefined one. This is the coverage question, and it comes before every clever correction. Can the old data speak about the actions the new policy needs? If not, you need new data or an extra assumption — not better arithmetic."],
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
        { title: "Re-weighting old evidence — and where it strains", paragraphs: [
          "When coverage does hold, importance sampling does something quietly remarkable. Weight each record by the ratio ρ = π/b — the target's chance of the action divided by the behavior's chance. That converts an average over the behavior policy's choices into an average over the target's choices. One record, viewed under new management. The conditions are real, though. The behavior's chance must be known and positive wherever the target might act. That is exactly the coverage check from the worked example above.",
          "Single steps re-weight gracefully; long trips do not. A trajectory of many actions multiplies many ratios together. Products of chances behave badly. One near-zero ratio collapses the whole trip's weight. One large ratio inflates it. The variance of the estimate explodes. Clipping the ratios or normalizing them across a batch calms things down. But be honest about the trade. You have slightly changed the question to buy stability. The answer is now an approximation with a smoother face.",
        ]},
        { title: "The deadly triad", paragraphs: [
          "Now assemble the three ingredients this book has been handing you one at a time. Off-policy data, bootstrapping, and function approximation. Each alone is reasonable. Together they can form a loop. Shared parameters spread one state's error into its neighbors. Bootstrapping reuses the changed estimate as part of a new target. The off-policy mismatch keeps feeding the error instead of damping it. Sutton and Barto named this combination the deadly triad. The name is earned. With all three present, divergence is not an exotic failure. It is a live possibility.",
          "Practitioners dull the triad rather than defeat it. Replay buffers break the correlation between consecutive updates. Target networks freeze the borrowed forecast so it cannot chase the learner's own changes. These tools often produce smooth, convincing training curves. A smooth curve is still not a proof. Guarantees are scarce in this corner of the field. So the working habit is vigilance. Check coverage, watch the ratios, and watch value magnitudes and TD errors. Never let the target policy go unexamined.",
        ]},
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
