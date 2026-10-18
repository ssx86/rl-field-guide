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
        "An automatic door opens when its sensor detects a person. That behavior is a rule an engineer can write in one line. When the door misbehaves, you can find the faulty line. A photo classifier works differently, but it too has a source of truth outside itself. It studies labelled pictures and compares each guess against the supplied answer. In both systems, someone already knows the right output. The system's whole job is to reproduce it well.",
        "Now imagine a warehouse robot at an intersection. When it turns left, its position shifts and its battery drains. The next decision starts from a situation its previous action helped create. Nobody stands at each corner to mark which turn was correct. The robot only discovers, much later, whether the delivery was fast. It must learn from what its own choices cause over time. That gap, between a score and an answer key, is where reinforcement learning lives.",
      ],
    },
    diagram: {
      title: "Ask four questions before choosing RL",
      caption: "A number called reward — the score we have been discussing — is not enough on its own. RL becomes a candidate only when the system must improve a chain of choices from their results.", // Marcus P1 fix
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
        { title: "From predictions to decisions", paragraphs: [
          "A predictor tells you what will happen. A policy tells you what to do. The difference sounds small, but it changes everything about how the system learns. When a robot decides to turn left, that decision moves it to a new part of the building. It also changes the robot's battery level and determines what options remain open for the next choice. A prediction can be wrong and nothing else changes. A policy decision, once executed, reshapes the world the learner will face.",
          "The world does not come with answer keys. The learner has to work backward from outcomes. If a delivery took forty minutes and the robot made seven turns, which of those turns helped, and which wasted time? Nobody marks each turn as correct or incorrect. The learner must distribute credit across the whole sequence — a problem so fundamental it has its own name: credit assignment.",
          "And here is the twist that separates reinforcement learning from every other kind of machine learning: the robot's own choices determine what data it will see. If it never turns onto Maple Street, it will never know whether Maple Street is faster. To find out, it has to risk a slower delivery today. That trade-off is the exploration problem. It is the cost of gathering information versus the cost of using what you already know, and it has no counterpart in supervised learning.",
        ]},
        { title: "Judging a chain, not a single step", paragraphs: [
          "One more shift in perspective completes the picture. A single turn might look good — the robot moves, it feels productive — and still ruin the delivery because it led into a dead end. Conversely, a turn that feels wasteful now might be the only path to a much better route three steps later. Reinforcement learning therefore evaluates choices by their long-term consequences, not their immediate rewards. The sum of rewards across an entire trip is called the return. Maximizing return — not any single reward — is the goal.",
          "But be careful. A return is just a number. It is useful for learning, but it does not automatically equal what people actually care about. Suppose you give one point per package delivered. The system may learn to deliver many tiny packages and ignore the urgent ones. The gap between what you can measure and what you truly want is the reward design problem, and we will return to it in Part 8.",
        ]},
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
        "Watch a cleaning robot work through one move. It sees walls, dirt, and a battery reading of 40 percent. Then it sends the command 'move right.' Notice how little of what happens next is up to it. The floor decides whether the wheels slip. The move costs power whether or not it succeeds. The robot may reach a new place or stay exactly where it was. The robot chose the command; the world chose everything that followed.",
        "There is a line between what the learner chooses and what the world produces. It is called the agent-environment boundary. Here is the surprising part: you decide where to draw it. Suppose a fixed controller handles the motors. Then the learned action might be 'go to the next hallway.' Suppose instead the learner commands each wheel directly. Then the action becomes a motor force. Both descriptions fit the same robot, yet they create different learning problems — one with a few meaningful actions, one with many primitive ones.",
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
        { label: "Write down what was known", calculation: "Sₜ = (hallway A, battery 0.40)", explanation: "The robot uses this information to choose. If speed or a hidden obstacle also changes the result, this pair is not enough to be a full state." }, // Marcus P1 fix
        { label: "Write down the choice", calculation: "Aₜ = right", explanation: "The policy chose 'right.' It did not choose 'arrive at B,' because slipping is outside its control." },
        { label: "Let the world produce one result", calculation: "P(B | A, right)=0.8; P(A | A, right)=0.2", explanation: "The same action can lead to B or leave the robot in A. The record contains the one result that happened this time." },
        { label: "Put the cost after the action", calculation: "Rₜ₊₁ = −1", explanation: "The energy cost appears because the robot tried the move. We therefore record it after Aₜ, together with the next state." },
      ],
      result: "The order protects us from cheating. It shows what the robot knew when it chose and which result followed that choice.",
    },
    mechanism: {
      introduction: "Four names in the loop must stay separate",
      sections: [
        { title: "From observation to state", paragraphs: [
          "Start with what the robot actually receives: a camera picture, a battery reading, maybe a map. Each of these is an observation. An observation is allowed to be incomplete. It may leave out the robot's speed or the fact that a door locked ten minutes ago. Nothing goes wrong simply because the input is partial. Trouble appears only when the missing fact changes what happens next.",
          "Suppose two identical camera pictures come from two different speeds. The slow robot stops safely; the fast one skids into the wall. Calling the picture a state makes a promise the picture cannot keep. A state is meant to contain everything needed to predict the next result. Renaming the picture s does not add the missing speed. The honest move is to put the speed into the state — or admit the input is only an observation.",
        ]},
        { title: "Rules describe many results; records keep the order", paragraphs: [
          "A transition rule describes many possible results at once. Moving right from hallway A reaches hallway B 80 percent of the time. It fails in place the other 20 percent. A single recorded move shows only one of those outcomes. That is why one lucky arrival at B proves nothing about the rule. The rule lives in the chances, and the chances reveal themselves only across many tries.",
          "Each step that actually happens is written down in order. The record holds the information, the action, the reward that followed, and the new information that came next. That ordered record is a trajectory. Later, a training program may shuffle whole records to speed up learning. That is fine. What it must never do is change which reward followed which action. Break that pairing and you have rewritten history. The algorithm would learn from a world that never existed.",
        ]},
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
        "Suppose the robot can squeeze through a narrow shortcut and collect +2 immediately. But the gate behind it may close and trap it for the rest of the trip. The wider hallway pays 0 now and feels like a waste. It reaches the destination two steps later for +10. Which choice is better depends on how far ahead you add. Looking only at the next reward, the shortcut wins. Looking at the whole route, the hallway wins. The total of future rewards — the return — is exactly that wider view.",
        "Two more details shape what the return means. First, we may give later rewards a smaller weight. Each one is multiplied by a number called gamma, written γ. This is discounting, and it is a design choice — not a claim that far-away results matter less morally. Second, we must ask whether the task truly ended or the recording simply stopped. If the parcel is delivered, the future inside this task is gone. If the computer stopped because of a time limit, the hidden future still exists. Ignoring it will bias everything we learn.",
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
        { title: "Where the return starts, and how far it reaches", paragraphs: [
          "Before you trust any return calculation, check where it starts counting. In this book, Gₜ begins with Rₜ₊₁ — the reward that arrives after the current action. That first reward keeps weight 1, not γ. The detail sounds pedantic. Yet this off-by-one slip is one of the most common bugs in reinforcement-learning code. The cheapest protection is to write one real step of your task beside the formula. Then match every symbol to an event that truly happened.",
          "Next ask how far ahead the return should reach. Gamma decides that. A small γ fades the future quickly. Learning concentrates on nearby results, and the estimates stay calm. A γ close to 1 carries information far down the route. But distant rewards arrive noisier, and the estimates can shake. Neither choice is free, so report the task horizon and γ together. An average return of 40 means something quite different under different pairs.",
        ]},
        { title: "Endings, and things that only look like endings", paragraphs: [
          "Some tasks have a natural finish. A delivery ends when the parcel arrives. A game ends at checkmate or the final whistle. Others never truly end. A heating controller could run for years, tonight looking exactly like this morning. For a continuing task we can still cut the stream into training pieces, and that is often convenient. But be clear about what we did. Those cuts are bookkeeping, not endings. The world never agreed to reset itself for our convenience.",
          "The distinction earns a name because it changes the arithmetic. Termination means the task itself ended. Nothing remains inside it, so the future's value is zero, and the learning target should say so. Truncation means the record stopped for an outside reason, such as a time limit. The world could have continued. So the target should estimate the missing future from V(Sₜ₊₁) instead of zeroing it out. Code should carry two separate flags. Only the true-termination flag may erase future value.",
        ]},
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
        "Let's follow the robot across a glass hallway. On most trips the crossing is clean, and the robot earns +5. But on about one trip in five, glare confuses its sensor. It must stop and recover, so it earns only +1. Notice what did and did not change. The robot took the same action from the same situation both times. The world itself produced different results. When one action can give different answers, reward becomes a random quantity, and a single trip stops being trustworthy evidence.",
        "To compare choices we need the long-run average, called the expected reward. Multiply each possible reward by its chance, then add the products. The hallway's expectation is 0.8×5 + 0.2×1 = 4.2. Yet no trip ever pays 4.2 — the average exists only as a tendency across many repetitions. Keep one more distinction in mind. The policy can also roll dice. It might choose the hallway 70 percent of the time and the stairs 30 percent. Randomness in the policy picks the action. Randomness in the environment picks what happens after it.",
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
        { title: "The grammar of chance", paragraphs: [
          "A few pieces of notation will carry us through the coming chapters. Each earns its place by answering a question. When the same action can return +5 or +1, the reward is a random variable. We write it with an uppercase letter, like R. The outcome of one particular trip — the 5 you just watched — gets a lowercase r. The capital letter stands for 'the number that has not been decided yet.' Keeping the two apart keeps your algebra honest.",
          "The vertical bar in E[R | S=s, A=a] reads as 'given,' or 'holding fixed.' It means: average the reward after pinning the state to s and the action to a. Mix in nothing else. A stochastic policy assigns chances to actions. For a short list, every probability is at least zero, and together they sum to one. The policy then samples one action from that list. With these three tools you can state precisely which uncertainty an average is averaging over. That clarity is most of the battle.",
        ]},
        { title: "What the average will not tell you", paragraphs: [
          "Suppose one action yields +5 almost always, and a rare glitch yields −1000. The average can still look attractive. A learner chasing it will keep choosing that action, right up to the day the glitch arrives. Expected value summarizes a distribution; it is not the distribution. The spread, the worst cases, and how often they visit are all hidden behind one number. Safety limits and risk measures exist precisely because those questions are real. Expected return alone cannot answer them.",
          "The data can deepen the trap. Suppose the current policy almost never tries an action. The log then holds almost no evidence about it. Its average is a guess dressed up as a number. That is a coverage problem, not ordinary noise. Collecting more of the same data will not fix it. Remember this gap when we reach exploration. How much you know about each option matters as much as what the averages say.",
        ]},
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
        "Imagine you run a café that can show three digital menu cards at the counter. Card A has been shown 100 times and averages a satisfaction score of 3.0. Card B has been shown only twice and averages 3.4 — the current champion. Card C has never been shown at all. Always displaying B feels like the responsible choice. It has a name: exploitation. But two trials are weak evidence. Trying C may earn a little less today. It may still reveal a much better card for the next hundred customers. Spending one choice on information is exploration.",
        "This repeated decision, with a reset after every round, is the multi-armed bandit. It is the smallest problem that still contains the whole exploration dilemma. A contextual bandit adds one honest luxury. It conditions the choice on information known beforehand, such as the hour or the weather. One menu may win in the morning and another at night. Yet it remains a bandit only while today's card does not change tomorrow's customers. The moment one choice shapes the next situation, you have left this chapter's world behind.",
      ],
    },
    diagram: {
      title: "Four rules choose what to try next",
      caption: "Each rule uses the current reward estimates. They differ in how they make room for choices that are still uncertain.",
      items: [
        { label: "Greedy", value: "choose max Q", note: "Q(a) is the current estimate of option a's average reward. Always uses the largest current estimate and can get stuck after an early lucky result." }, // Marcus P1 fix
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
        { title: "Why the average alone is not enough", paragraphs: [
          "Bandit learning quietly splits into two jobs, and confusing them is the classic beginner's mistake. The first job is estimation: keep an average reward for each option. When customer taste is stable, treating every result equally is exactly right. When taste drifts, a constant step size α lets newer results dominate. The estimate Q(a) is a memory with a policy for forgetting. Choose that forgetting policy as deliberately as any other.",
          "But estimating rewards is only half the story. Let's return to the café and look more carefully at those averages. Card A has been shown 100 times and averages 3.0. Card B has been shown 10 times and averages 2.8. Card C has been shown once and averages 2.5. If you only look at averages, A wins. But think about how confident you should be in each number. After 100 showings, you have a pretty good idea what A is worth. After 10 showings, B's average is still noisy — maybe it had a lucky or unlucky streak. After just one showing, C's average of 2.5 tells you almost nothing. Maybe C is terrible. Or maybe C had one unlucky customer and would have been the best card all along.",
          "This is the core problem: the average tells you how good an option has been, but not how much you can trust that number. An option tried once has a wide range of possible true values. An option tried 100 times has a narrow range. If you always pick the highest average, you might be stuck on a mediocre option just because you never gave the others a fair chance.",
        ]},
        { title: "UCB: a shrinking exploration subsidy", paragraphs: [
          "Upper Confidence Bound — UCB — solves this with one elegant move. Instead of asking only 'which option looks best now?', it also asks 'which option do I know the least about?' It gives each option a score that combines both answers. The score has two parts. The first part is the current average — what you already believe. The second part is an uncertainty bonus that starts large for rarely-tried options and shrinks toward zero as you gather more evidence.",
          "Think of the bonus as an exploration subsidy. Every option gets one, but the subsidy shrinks each time you try that option. After one trial, the subsidy is generous — the system is saying 'you barely know this one, give it another chance.' After 100 trials, the subsidy is nearly gone — 'you have seen enough; trust the average.' The subsidy also depends on how much you have explored overall. If you have made 1000 total choices but only tried option C three times, C's subsidy grows. The system actively directs attention toward the biggest gaps in its knowledge.",
          "Here is the crucial distinction: the UCB score is not the option's true value, and it is not the updated average. It is a temporary decision-making number — 'given what I know and what I don't, what should I try right now?' After trying that option, you record the reward, update the average, recompute all the bonuses, and choose again.",
        ]},
        { title: "The other rules, and what exploration costs", paragraphs: [
          "Epsilon-greedy is simpler but cruder: flip a coin. With probability 1−ε, pick the current winner. With probability ε, pick anything at random. It explores, but blindly — it spends exploration budget on already-well-known options just as often as on unknown ones. Thompson sampling takes a more sophisticated route: it builds a probability model of what each option's true value might be, samples one possible world from that model, and acts greedily as if that sampled world were real. Over many rounds, this naturally explores uncertain options more often. None of these rules is universally best. The right choice depends on how long the decisions continue, how expensive each trial is, and how noisy the rewards are.",
          "Exploration is not free, and regret is the ledger that proves it. Regret compares the reward you actually collected with the reward of the best fixed option over the same span. Every probe of a losing option adds regret now. Every refusal to probe a winning option adds regret for as long as you refuse. A stall open for one day should explore far less than one open for a year.",
          "Context is the last refinement and also the exit sign. A contextual bandit conditions its choice on facts known before the decision — morning versus evening, rain versus sun. The best option can change with them. But the reset assumption still rules. Today's choice must not change tomorrow's context. Suppose showing a card trains customers, drains stock, or shifts what they want next week. Then the rounds are no longer independent. You need the full sequential machinery that begins in the next part of the book.",
        ]},
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
