import type { ChapterArticle } from "@/content/chapter-article";

const SUTTON_BARTO = {
  label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition",
  url: "https://incompleteideas.net/book/RLbook2020.pdf",
  kind: "book",
} as const;

export const PART_ONE_ARTICLES = [
  {
    slug: "before-rl",
    title: "Before using RL, ask whether you need it",
    deck: "A system does not need reinforcement learning just because it receives a score. First check where the correct answer comes from and whether one action changes what can happen later.",
    openingQuestion: "If a photo classifier and a warehouse robot both receive scores, what makes the robot special?",
    bridge: "Before picking an algorithm, look at the job itself. Where does the correct answer come from? Are the rules already known? Does one choice change what can happen next? Most of the time, these questions lead somewhere simpler than RL.",
    situation: {
      title: "Not every scoring system needs RL",
      paragraphs: [
        "An automatic door opens when its sensor detects a person — a rule an engineer can write in one line. A photo classifier studies labelled pictures and compares each guess against the supplied answer. Both systems have a source of truth that exists outside themselves.",
        "A warehouse robot faces a different world. When it turns left, its position shifts, its battery drains, and the next decision starts from a situation its previous action helped create. Nobody stands at each intersection to say which turn was correct. The robot must learn from what its choices cause over time — that gap is where reinforcement learning lives.",
      ],
    },
    diagram: {
      title: "Ask four questions before choosing RL",
      caption: "A number called reward is not enough. RL becomes a candidate only when the system must improve a chain of choices from their results.",
      items: [
        { label: "Is the correct answer already supplied?", value: "Yes → try supervised learning", note: "A labeled example tells the system what answer it should have given." },
        { label: "Are all the rules already known?", value: "Yes → try planning", note: "The system can search the known model instead of learning the rules by trial and error." },
        { label: "Does this action change later choices?", value: "Yes → decisions form a chain", note: "The action must be judged partly by the future situation it creates." },
        { label: "Must choices improve from their results?", value: "Yes → RL may fit", note: "The learner needs feedback and a fair test against simpler methods." },
      ],
    },
    workedExample: {
      title: "The same delivery request can hide three different problems",
      setup: "A delivery company wants faster routes. The best tool depends on what the company already knows. Compare these three versions before choosing a method.",
      prediction: "Which version might need a system that learns a chain of actions from later results?",
      steps: [
        { label: "A — every travel time is known", calculation: "shortest path on a weighted graph", explanation: "A route planner can search the map and choose the shortest path. There is nothing about the road rules left to learn." },
        { label: "B — each road has old delay records", calculation: "features → estimated minutes", explanation: "A prediction model can estimate the delay of each road. A separate planner can then use those estimates." },
        { label: "C — each turn changes the rest of the trip", calculation: "route choice → new location and traffic exposure → later choices", explanation: "An early turn changes the driver's later position and traffic. The company may need to learn a policy for the whole trip." },
        { label: "Now test the extra complexity", calculation: "compare against rule, prediction-plus-planning, and contextual-bandit baselines", explanation: "Version C has the shape of an RL problem. It still must beat simpler choices in a fair test." },
      ],
      result: "Only version C clearly needs choices to improve from a chain of results. Even there, RL is only a method to test. The problem shape tells us what may fit; an experiment tells us what works better.",
    },
    mechanism: {
      introduction: "What changes when a problem really does need RL?",
      sections: [
        { title: "A policy, not a prediction", paragraphs: ["A predictor gives an estimate, such as 'this road will take ten minutes.' A policy chooses what to do, such as 'take this road.' That choice changes where the robot goes and what data it sees next."] },
        { title: "Results, not answer keys", paragraphs: ["After a turn, the robot may lose one minute, reach a new place, and finish the delivery much later. The world does not mark the turn as correct or wrong. The learner has to work out which earlier actions helped the final result. This is called credit assignment."] },
        { title: "Trying changes what you will see", paragraphs: ["If the robot never tries an unfamiliar street, it will never learn whether that street is faster. Trying it may hurt today's delivery and help tomorrow's choices. This is why exploration has a real cost."] },
        { title: "The trip matters more than any single turn", paragraphs: ["One turn can earn a small reward and still ruin the delivery. RL therefore often adds rewards across a sequence. That total is called return. A return is useful for learning, but people must still check whether the number matches the result they truly care about."] },
      ],
    },
    equations: [],
    boundary: {
      title: "A score cannot prove that RL is the right tool",
      paragraphs: [
        "A recommendation system trained from clicks can be several different kinds of problem. Ask whether today's recommendation changes what the person will see or want tomorrow. Also ask how the old data was collected. The product name does not answer either question.",
        "Needing to learn does not mean the system is allowed to experiment freely. A new action in medicine, hiring, lending, or factory control can harm a real person. Old data, a simulator, hard limits, human review, or a non-RL method may be safer.",
      ],
    },
    nextBridge: "If the problem still looks like RL, the next step is to draw one round in the correct order. What can the learner see? What can it choose? What happens only after the choice?",
    sources: [
      SUTTON_BARTO,
      { label: "OpenAI Spinning Up — What is RL?", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html", kind: "official documentation" },
    ],
  },
  {
    slug: "interaction-loop",
    title: "Draw one turn of the decision loop",
    deck: "Put one step in order: the learner sees information, chooses an action, and only then receives a result. This order tells us what the learner was allowed to know.",
    openingQuestion: "When a robot sends the command 'move right,' what exactly did it choose — the destination, or just the motor signal?",
    bridge: "Suppose the problem does need RL. The next task is to describe one turn with enough precision that nothing important is left vague. What does the learner see? What can it choose? What comes back?",
    situation: {
      title: "What the robot chose, and what the world decided",
      paragraphs: [
        "A cleaning robot sees walls, dirt, and its battery level. It sends the command 'move right.' The floor then decides whether the wheels slip. The move may use power, reach a new place, and clean some dirt.",
        "The robot chose the command. It did not choose whether the wheels would slip. The line between what the learner chooses and what the world produces is called the agent-environment boundary.",
        "We decide where to draw that line. If a fixed controller handles the motors, the learned action may be 'go to the next hallway.' If the learner controls each wheel, the action may be a motor force. Both descriptions can be valid, but they create different learning problems.",
      ],
    },
    diagram: {
      title: "One step has a fixed order",
      caption: "First the agent receives information. Next it chooses. Only then does the environment return a reward and new information.",
      items: [
        { label: "What the agent knows now", value: "Sₜ or Oₜ", note: "A state is meant to be enough for prediction. An observation may show only part of the world." },
        { label: "What the agent chooses", value: "Aₜ ~ π(· | information)", note: "The policy may always return one action or may choose with some randomness." },
        { label: "What the environment returns", value: "Rₜ₊₁, Sₜ₊₁", note: "The result comes after the action and may vary even when the action is the same." },
        { label: "The ordered record", value: "trajectory τ", note: "A trajectory stores the steps in the order in which they happened." },
      ],
    },
    workedExample: {
      title: "Record one move in the order it happens",
      setup: "The robot is in hallway A with 40% battery. It chooses right. The move costs one energy point. It reaches hallway B 80% of the time and slips in place 20% of the time.",
      prediction: "Which facts were known before the choice, and which facts appeared only after it?",
      steps: [
        { label: "Write down what was known", calculation: "Sₜ = (corridor A, battery 0.40)", explanation: "The robot uses this information to choose. If speed or a hidden obstacle also changes the result, this pair is not enough to be a full state." },
        { label: "Write down the choice", calculation: "Aₜ = right", explanation: "The policy chose 'right.' It did not choose 'arrive at B,' because slipping is outside its control." },
        { label: "Let the world produce one result", calculation: "P(B | A, right)=0.8; P(A | A, right)=0.2", explanation: "The same action can lead to B or leave the robot in A. The record contains the one result that happened this time." },
        { label: "Put the cost after the action", calculation: "Rₜ₊₁ = −1", explanation: "The energy cost appears because the robot tried the move. We therefore record it after Aₜ, together with the next state." },
      ],
      result: "The order protects us from cheating. It shows what the robot knew when it chose and which result followed that choice.",
    },
    mechanism: {
      introduction: "Four names in the loop must stay separate",
      sections: [
        { title: "An observation is what the robot receives", paragraphs: ["A camera picture, a battery reading, or a map can be an observation. It may still leave out speed, a locked door, or another hidden fact."] },
        { title: "A state promises that the useful past is already included", paragraphs: ["Suppose two identical pictures come from different speeds. Their next results will differ, so the picture alone is not a complete state. Calling the picture s does not add the missing speed."] },
        { title: "A transition rule describes many possible results", paragraphs: ["The rule says that moving right reaches B 80% of the time. One recorded move shows only one result. A single success cannot prove the 80% rule."] },
        { title: "A trajectory keeps the steps in order", paragraphs: ["A trajectory stores observations, actions, rewards, and later observations in time order. A training program may shuffle whole records. It must not change which reward followed which action."] },
      ],
    },
    equations: [
      { latex: "A_t \\sim \\pi(\\cdot \\mid S_t), \\qquad (R_{t+1},S_{t+1}) \\sim p(\\cdot,\\cdot \\mid S_t,A_t)", read: "First, the policy uses the current state Sₜ to choose action Aₜ. Then the environment uses that state and action to produce the next reward and state.", meaning: "The order matters. The policy cannot use a reward that has not happened yet. The environment must respond to the action that was actually taken." },
    ],
    boundary: {
      title: "Calling an input 'state' does not make it complete",
      paragraphs: [
        "Two identical pictures can hide different speeds or locked doors. If those hidden facts change the next result, a policy that sees only the picture cannot tell the situations apart. More pixels do not always supply the missing fact.",
        "The chosen action may also differ from the action that reaches the world. A recommendation model may suggest an item, while another service blocks it for safety or stock. The data must record what was actually shown, not only what the model wanted to show.",
      ],
    },
    nextBridge: "The loop gives the robot one reward at a time. A whole route contains many rewards, so the next chapter explains how to judge the full sequence.",
    sources: [
      SUTTON_BARTO,
      { label: "Farama Gymnasium — Basic usage and the step API", url: "https://gymnasium.farama.org/introduction/basic_usage/", kind: "official documentation" },
    ],
  },
  {
    slug: "return-horizon",
    title: "Judge the whole route, not only the next reward",
    deck: "A good choice may look bad at first and pay off later. Return adds later rewards together, while the horizon and the kind of ending tell us when to stop counting.",
    openingQuestion: "If a shortcut gives two points now but blocks the robot later, was it really the better choice?",
    bridge: "One turn of the loop gives one reward. A route gives many rewards. We now need one number that describes the future from a chosen moment. We also need to know whether the task truly ended or whether the recording simply stopped.",
    situation: {
      title: "Why the last reward matters most",
      paragraphs: [
        "A robot can take a narrow shortcut and earn +2 now. The gate may then close and trap it. A wider hallway gives 0 now but reaches the destination two steps later for +10. Looking only at the next reward chooses the shortcut. Looking at the full route can choose the hallway.",
        "The total of future rewards is called return. We may give later rewards a smaller weight by multiplying them by a number called gamma, written γ. This is called discounting. Gamma is a design choice, not a rule that far-away results are morally less important.",
        "The horizon tells us how far the task can continue. Sometimes the task truly ends: the parcel is delivered or the game is over. Sometimes the computer only stops recording because a time limit was reached. The hidden future is gone in the first case, but it still exists in the second.",
      ],
    },
    diagram: {
      title: "Why the record stopped changes the calculation",
      caption: "A true ending belongs to the task. A time limit belongs to the recording. Only a true ending makes the remaining in-task value zero.",
      items: [
        { label: "Next reward", value: "Rₜ₊₁", note: "This is the result that appears right after the current action." },
        { label: "Later rewards", value: "γRₜ₊₂ + γ²Rₜ₊₃ + …", note: "They still belong to the current action's future, but discounting changes their weight." },
        { label: "The task truly ends", value: "bootstrap = 0", note: "Nothing remains inside this task, so there is no continuation value." },
        { label: "The recording hits a limit", value: "bootstrap from V(Sₜ₊₁)", note: "The world could continue, so we estimate the part that the record missed." },
      ],
    },
    workedExample: {
      title: "Add the same three rewards in two ways",
      setup: "A delivery route gives three rewards in sequence: a quick stop earns 2, a detour earns 0, and the final delivery earns 10. Compare γ = 1 and γ = 0.9. Then imagine the record stops before the last reward.",
      prediction: "The reward 10 is two steps away. Should it be multiplied by γ zero times, once, or twice?",
      steps: [
        { label: "Use no discount", calculation: "Gₜ = 2 + 0 + 10 = 12", explanation: "When γ equals 1, all three rewards keep their full size." },
        { label: "Use γ = 0.9", calculation: "Gₜ = 2 + 0.9×0 + 0.9²×10 = 10.1", explanation: "The reward 10 is two steps away, so it receives two factors of 0.9. It contributes 8.1." },
        { label: "The task truly ends after reward 0", calculation: "target = 2 + 0.9×0", explanation: "The parcel or game is finished. There is no later value inside this task." },
        { label: "The record only hits a time limit", calculation: "target = 2 + 0.9×V(Sₜ₊₁)", explanation: "The world could continue. V(Sₜ₊₁) is our estimate of the future that was not recorded." },
      ],
      result: "The return depends on the reward sequence and on the discount. The learning target also depends on why the record ended.",
    },
    mechanism: {
      introduction: "Four details decide what the return means",
      sections: [
        { title: "Start with the reward after the current action", paragraphs: ["In this book, Gₜ starts with Rₜ₊₁. That reward gets weight 1, not γ. Writing one real step beside the formula helps prevent an off-by-one mistake."] },
        { title: "Gamma changes how far rewards travel", paragraphs: ["A small γ focuses learning on nearby results. A γ close to 1 carries information farther, but estimates can become noisier. Report the task horizon and γ together."] },
        { title: "Some tasks end and some keep going", paragraphs: ["A game or delivery has a natural end. A heating controller may run without a natural finish. We can cut a continuing task into training pieces, but those cuts do not turn into real endings."] },
        { title: "Termination and truncation need different flags", paragraphs: ["Termination means the task ended. Truncation means the record stopped for an outside reason, such as a time limit. Code should remove future value only for true termination."] },
      ],
    },
    equations: [
      { latex: "G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots", read: "Start with the next reward. Multiply the following reward by γ, the next one by γ squared, and continue in the same way.", meaning: "The power of γ counts how many steps away a reward is. The formula adds the score we chose; it cannot tell us whether that score represents the real goal." },
      { latex: "y_t = R_{t+1} + \\gamma (1-D_{t+1})V(S_{t+1})", read: "Take the next reward and add the discounted next-state value, except when D says the task truly ended.", meaning: "D is the true-termination flag. A time-limit flag should normally keep the value term, because the unrecorded future can still matter." },
    ],
    boundary: {
      title: "Discounting cannot fix the wrong goal",
      paragraphs: [
        "A small γ can hide harm that appears much later. A large γ cannot create feedback that was never recorded. Choose γ from the time span of the decision, then test how the result changes when γ changes.",
        "Remaining time may also need to be part of the state. If five seconds remain, the best action may differ from the action with five minutes left. Hiding the clock can make two different situations look the same.",
      ],
    },
    nextBridge: "One route gives one return. The same policy can produce many different routes, so the next chapter explains how probability and averages help us compare uncertain results.",
    sources: [
      SUTTON_BARTO,
      { label: "Farama Gymnasium — Handling time limits", url: "https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/", kind: "official documentation" },
    ],
  },
  {
    slug: "probability-expectation",
    title: "Use probability without pretending the average will happen",
    deck: "The same action can lead to several results. Probability says how often each result may occur. Expected value combines them into an average, even when that average is never one real result.",
    openingQuestion: "An action gives +5 most of the time and +1 the rest of the time. How can its average be 4.2 when a robot never receives 4.2?",
    bridge: "One route gives one return, but the same policy can produce many routes. We need a way to describe all possible results and their chances. Then we can compare choices without confusing an average with a promise.",
    situation: {
      title: "When the same action gives different answers",
      paragraphs: [
        "A robot crosses a glass hallway. On most trips it reaches the next room and earns +5. On 20% of trips, glare confuses its sensor. It must recover and earns only +1. The robot took the same action, but the world produced different results.",
        "Expected reward is a weighted average. We multiply each possible reward by its chance, then add the products. If the robot repeats the trip many times, its average reward may move toward 4.2. One trip still gives either +5 or +1.",
        "The policy can also use randomness. It might choose the hallway 70% of the time and the stairs 30% of the time. Randomness in the policy chooses the action. Randomness in the environment changes what happens after the action. These are two different sources of uncertainty.",
      ],
    },
    diagram: {
      title: "Expected value counts every possible result",
      caption: "A probability distribution lists possible results and their chances. Expected value summarizes that list, but it does not show how widely the results differ.",
      items: [
        { label: "Clear hallway", value: "0.8 × 5 = 4.0", note: "The common +5 result adds four points to the average." },
        { label: "Glare and recovery", value: "0.2 × 1 = 0.2", note: "The less common +1 result still counts." },
        { label: "Expected reward", value: "4.0 + 0.2 = 4.2", note: "This is the long-run average, not a reward from one trip." },
        { label: "What the mean hides", value: "spread and worst cases", note: "Two choices can have the same average and very different bad outcomes." },
      ],
    },
    workedExample: {
      title: "Two choices can have the same average and different risks",
      setup: "A game offers two buttons. The Safe button always pays 4 points. The Risky button pays 10 points with probability 0.4 and 0 with probability 0.6. A policy chooses Safe 75% of the time and Risky 25% of the time.",
      prediction: "Work out the average for Risky and for the whole policy. Does the same average make Safe and Risky the same choice?",
      steps: [
        { label: "Average for Safe", calculation: "E[R | Safe] = 1×4 = 4", explanation: "Safe has only one possible reward, so its average is 4." },
        { label: "Average for Risky", calculation: "E[R | Risky] = 0.4×10 + 0.6×0 = 4", explanation: "Risky has the same average, but it gives either 10 or 0." },
        { label: "Average for the policy", calculation: "E[R] = 0.75×4 + 0.25×4 = 4", explanation: "Both actions average 4, so any mixture of them also averages 4." },
        { label: "Average from real trials", calculation: "sample mean = (r₁ + … + rₙ)/n", explanation: "A small number of trials will not usually average to exactly 4. We should report how uncertain the estimate is." },
      ],
      result: "Safe and Risky have the same expected reward, but their bad outcomes differ. An average is useful, yet it cannot answer every question about risk.",
    },
    mechanism: {
      introduction: "Four probability ideas are enough for the next chapters",
      sections: [
        { title: "A random variable can take different values", paragraphs: ["Reward is a random variable when the same action can give +5 or +1. We often use an uppercase letter for the unknown result and a lowercase letter for one result that was observed."] },
        { title: "The vertical bar tells us what is held fixed", paragraphs: ["E[R | S=s, A=a] means: average the reward after fixing state s and action a. It does not mix in other states or other actions."] },
        { title: "A stochastic policy gives chances to actions", paragraphs: ["For a short list of actions, all action probabilities must be at least zero and add to one. The policy then samples one action from that list."] },
        { title: "The average can hide rare harm", paragraphs: ["A very bad result may happen rarely enough that the average still looks good. Safety limits and risk measures ask questions that expected return alone cannot answer."] },
      ],
    },
    equations: [
      { latex: "\\mathbb{E}[X] = \\sum_x p(x)x", read: "Multiply every possible value x by its probability p(x), then add the products.", meaning: "Unlikely results still count. For a continuous quantity, an integral does the same job over all possible values." },
      { latex: "\\mathbb{E}[R \\mid S=s] = \\sum_a \\pi(a\\mid s)\\,\\mathbb{E}[R \\mid S=s,A=a]", read: "For each action, take its expected reward and multiply by the chance that the policy chooses it. Then add across actions.", meaning: "There are two kinds of chance here: the policy may choose different actions, and the environment may produce different results after an action." },
    ],
    boundary: {
      title: "The average may hide the result you fear most",
      paragraphs: [
        "A policy can have a slightly higher average and still have a small chance of severe harm. The mean, the spread, the worst part of the distribution, and hard limits answer different questions.",
        "The data can also be uneven. If the current policy almost never tries an action, the log tells us little about that action. Missing results are not the same as ordinary random noise.",
      ],
    },
    nextBridge: "We can now average uncertain results. The next chapter uses the smallest problem that still needs exploration: choose one option, see one reward, and start again.",
    sources: [
      SUTTON_BARTO,
      { label: "OpenAI Spinning Up — Key concepts and notation", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html#key-concepts-and-terminology", kind: "official documentation" },
    ],
  },
  {
    slug: "bandits-contextual-bandits",
    title: "Learn when to use the current winner and when to keep testing",
    deck: "A bandit problem asks one question again and again: use the option that looks best now, or spend one choice learning about an option we know less about?",
    openingQuestion: "Why would a careful learner choose an option whose current average is lower?",
    bridge: "Probability helped us compare uncertain results. A bandit keeps the rest of the problem simple. Choose one option, see one reward, and return to the same starting point. This lets us study exploration without long chains of actions.",
    situation: {
      title: "A café has to learn which menu card works best",
      paragraphs: [
        "A café can show three digital menu cards. Card A has been shown 100 times and averages 3.0. Card B has been shown only twice and averages 3.4. Card C has never been shown.",
        "Always showing B uses the highest current average. This is exploitation. But two trials are weak evidence. Trying C may earn less today and still reveal a much better card for the next hundred customers. This is exploration.",
        "A multi-armed bandit repeats this choice while resetting after each round. A contextual bandit also looks at information such as time or weather. It is still a bandit only when today's card does not change tomorrow's customer or choices.",
      ],
    },
    diagram: {
      title: "Four rules choose what to try next",
      caption: "Each rule uses the current reward estimates. They differ in how they make room for choices that are still uncertain.",
      items: [
        { label: "Greedy", value: "choose max Q", note: "Always uses the largest current estimate and can get stuck after an early lucky result." },
        { label: "Epsilon-greedy", value: "random with probability ε", note: "Usually uses the winner and sometimes chooses a random option." },
        { label: "Upper Confidence Bound (UCB)", value: "estimate + uncertainty bonus", note: "Favors an option when it looks good or has not been tested much." },
        { label: "Thompson sampling", value: "sample a possible model, then act", note: "Tries each option as often as the current evidence makes it look best." },
      ],
    },
    workedExample: {
      title: "Update one average without forgetting the first ten trials",
      setup: "Think of a drinks stall that only serves Tea and Coffee, and scores each cup from 0 to 10. Tea has been chosen 10 times and averages 7.0. The eleventh Tea reward is 9. Coffee averages 7.1 after 100 trials. There have been 111 choices in total.",
      prediction: "Will Tea's estimate jump to 9, stay at 7, or move part of the way? Which drink is less certain?",
      steps: [
        { label: "Find how surprising the new reward is", calculation: "9 − 7.0 = 2.0", explanation: "The new Tea reward is two points above the old estimate." },
        { label: "Give one share to the new trial", calculation: "α = 1/11", explanation: "There are now 11 Tea results. Each one should have an equal share in the average." },
        { label: "Move the Tea estimate part of the way", calculation: "Q₁₁(Tea) = 7.0 + (1/11)×2.0 ≈ 7.18", explanation: "The estimate moves toward 9 without throwing away the first ten trials." },
        { label: "Compare how much has been tested", calculation: "bonus ∝ √(ln 111 / N(a))", explanation: "Tea has 11 trials and Coffee has 100. UCB therefore gives Tea the larger uncertainty bonus." },
      ],
      result: "Greedy now chooses Tea because 7.18 is larger than 7.1. UCB also notices that Tea has been tested much less often. Estimating rewards and choosing what to try are separate jobs.",
    },
    mechanism: {
      introduction: "Bandit learning has two separate jobs",
      sections: [
        { title: "First estimate each option", paragraphs: ["When rewards stay stable, a running average treats every result equally. If customer taste changes, old results can become less useful. A constant step size gives newer results more influence."] },
        { title: "Then decide what to try", paragraphs: ["Epsilon-greedy uses simple random trials. UCB uses how often each option has been tried. Thompson sampling uses a probability model. Similar-looking choices can rest on different assumptions."] },
        { title: "Regret counts the cost of learning", paragraphs: ["Regret compares the reward actually collected with the reward from always using the best option. Exploration raises regret now and may lower it later. The useful balance depends on how long the decisions will continue."] },
        { title: "Context can change the best option", paragraphs: ["One menu may work in the morning and another in the evening. A contextual bandit uses information known before the choice. If today's choice changes tomorrow's context, we need a full sequential model instead."] },
      ],
    },
    equations: [
      { latex: "Q_{n+1}(a)=Q_n(a)+\\alpha_n\\bigl(R_n-Q_n(a)\\bigr)", read: "Start with the old estimate. Find the gap between the new reward and that estimate. Move by an alpha-sized part of the gap.", meaning: "When alpha is one divided by the number of visits, this gives the ordinary running average. A fixed alpha gives recent results more weight." },
      { latex: "A_t=\\arg\\max_a\\left[Q_t(a)+c\\sqrt{\\frac{\\ln t}{N_t(a)}}\\right]", read: "UCB adds a bonus to each reward estimate and chooses the largest total. The bonus becomes smaller when an option has been tried more often.", meaning: "The number c controls how strongly uncertainty matters. A larger c causes more exploration." },
      { latex: "\\operatorname{Regret}(T)=T\\mu^*-\\sum_{t=1}^{T}R_t", read: "Regret is the reward the best fixed option would have earned, minus the reward that was actually collected.", meaning: "Bad choices and too much testing both add regret. This comparison assumes that the same best option stays best." },
    ],
    boundary: {
      title: "A contextual bandit still assumes that the next round resets",
      paragraphs: [
        "Showing an item may change future interest, subscription, or stock. Then today's action changes tomorrow's situation. A contextual bandit that only counts the next click may miss that long-term effect.",
        "The log also shows a reward only for the option that was chosen. To judge other policies later, record the choice probabilities or run a controlled random test. Raw averages can mix the effect of the option with the type of customer who saw it.",
      ],
    },
    nextBridge: "A bandit starts fresh after every choice. Next we keep the new situation, so one action changes both the next reward and the next decision. That is where full sequential RL begins.",
    sources: [
      SUTTON_BARTO,
      { label: "Lattimore and Szepesvári — Bandit Algorithms", url: "https://tor-lattimore.com/downloads/book/book.pdf", kind: "book" },
      { label: "Auer, Cesa-Bianchi, and Fischer — Finite-time Analysis of the Multiarmed Bandit Problem", url: "https://homes.di.unimi.it/~cesabian/Pubblicazioni/ml-02.pdf", kind: "paper" },
    ],
  },
] satisfies readonly ChapterArticle[];
