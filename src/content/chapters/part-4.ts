import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_FOUR_ARTICLES = [
  {
    slug: "pomdp-memory",
    title: "When one picture is not enough, let the agent remember",
    deck: "The same picture can hide two different situations. Recent history may reveal what the current sensor reading leaves out. The agent needs a useful memory, not merely a longer recording.",
    openingQuestion: "A ball is in the middle of the screen. Is it flying toward the robot or away from it?",
    bridge: "More actors means more data — but data that overlaps. One picture may still miss the fact that matters. Two identical frames can come from different histories and require opposite actions. We must either keep useful history or maintain several possible explanations of the hidden world.",
    situation: {
      title: "One still image cannot show which way the ball moves",
      paragraphs: ["The robot sees a ball in the center of the screen. One second ago, that ball was on the left; on another trip, it was on the right. The current image is identical either way, yet the robot should move in opposite directions — the fact that matters is velocity, and a single frame cannot hold it. The true situation contains the ball's speed and direction, but the camera delivers only a partial observation. A problem with this hidden information is called a Partially Observable Markov Decision Process, or POMDP, and it is the honest name for most real sensing.", "Three escape routes exist, and they differ in how much past they keep. The agent can stack recent frames, update explicit probabilities for several hidden situations, or learn an internal memory that carries forward whatever helps. Each tries to preserve just enough history to predict what comes next and choose well — not to record everything. Which route fits depends on how long information matters in your task, a question the mechanism takes up after a worked example in belief updating."],
    },
    diagram: {
      title: "The world has more information than the sensor shows", caption: "Past observations and actions help the agent build a useful guess about the hidden situation.",
      items: [
        { label: "Hidden situation", value: "Sₜ", note: "Includes facts such as speed, damage, or another player's plan." },
        { label: "Sensor reading", value: "Oₜ~Ω(·|Sₜ)", note: "Shows only part of the situation and may contain noise." },
        { label: "History", value: "Hₜ=(O₀,A₀,…,Oₜ)", note: "Keeps what the agent saw and did before now." },
        { label: "Useful summary", value: "bₜ(s) or hₜ", note: "Turns that history into information for the next choice." },
      ],
    },
    workedExample: {
      title: "A warning does not mean a 90% chance of failure",
      setup: "A machine is either Healthy or Faulty. Before the warning, failure has probability 0.20. A faulty machine warns 90% of the time. A healthy one warns 10% of the time.",
      prediction: "The warning is strong evidence, but false alarms exist. How should the old 20% chance and the new warning be combined?",
      steps: [
        { label: "Weight the failure story", calculation: "0.9×0.2=0.18", explanation: "Combine how common failure was with how often failure causes a warning." },
        { label: "Keep the false-alarm story", calculation: "0.1×0.8=0.08", explanation: "A healthy machine can still warn, so that explanation remains possible." },
        { label: "Turn weights into probabilities", calculation: "P(Faulty|warning)=0.18/(0.18+0.08)≈0.692", explanation: "After the warning, failure has probability about 69.2%, not 90%." },
        { label: "Choose an action", calculation: "compare failure cost with inspection cost", explanation: "The same belief can lead to different actions when the costs differ." },
      ],
      result: "The warning moves failure belief from 20% to about 69.2%. A belief state keeps both remaining explanations instead of pretending one guess is known fact.",
    },
    mechanism: {
      introduction: "Different memory tools keep different kinds of history. The right choice depends on how long information matters and whether the world model is known.",
      sections: [
        { title: "From beliefs to learned memory", paragraphs: ["When the rules and sensor noise are known, Bayes' rule can update a probability for every hidden state — a distribution called a belief state, which summarizes the whole history for future prediction. The worked example above showed how a warning moved failure belief from 20% to about 69% rather than to 90%, keeping both remaining explanations alive. Beliefs are principled but expensive: planning over them is hard because there are endlessly many probability mixtures, and most real tasks do not hand you the rules.", "The cheaper substitutes trade principle for practicality. A frame stack — the last few images pasted together — reveals speed and direction, but it fails when the decisive event happened before the window began, and stacking more frames never says which ones matter. A recurrent network learns what to carry forward instead: a Recurrent Neural Network, or RNN, updates an internal hidden state after each observation, with Long Short-Term Memory, or LSTM, as one common design. During replay, a burn-in prefix rebuilds that memory first, as R2D2 does, or the learner trains on a history the actor never had."] },
        { title: "Actions that are worth taking for what they reveal", paragraphs: ["Some actions pay off not in reward but in information. An inspection costs a shift of time, but it can reveal whether the machine is truly broken; walking around an object can reveal what was hidden behind it. In each case the action changes the world and the agent's knowledge at once, and a good policy may deliberately pay to reduce uncertainty before committing to the real decision.", "This idea — information-gathering as action — closes a circle the earlier chapters left open. Exploration in Part 3 was mostly noise or entropy; here it becomes a deliberate, plannable move with a price and a payoff. Keep it in mind as you read the next chapter, which asks a harder version of the same question: how an agent can stay committed to one informative direction for many steps, instead of tossing a new coin at every turn."] },
      ],
    },
    equations: [
      { latex: "b_t(s)=\\Pr(S_t=s\\mid O_{0:t},A_{0:t-1})", read: "The belief gives a probability to each hidden state after using all observations and earlier actions.", meaning: "Earlier actions matter because they changed the world. The belief is a list of possibilities, not one hidden state presented as certain." },
      { latex: "b_{t+1}(s')\\propto \\Omega(o_{t+1}\\mid s')\\sum_s p(s'\\mid s,a_t)b_t(s)", read: "First predict how the hidden state may change. Then use the new observation to raise or lower each possibility.", meaning: "This is a Bayes filter. A learned memory may copy the same information flow without producing well-calibrated probabilities." },
    ],
    boundary: {
      title: "More memory can preserve the wrong clue", paragraphs: ["A recurrent network may remember a player name, a simulator clock, or leaked reward instead of the hidden fact we wanted. We should change irrelevant history and check whether the decision stays the same." ,"History also cannot reveal what no safe action ever makes observable. If two hidden situations always produce the same evidence, memory cannot separate them. The system needs a new sensor, a safe test, or an extra assumption."],
    },
    nextBridge: "Memory helps the agent use a path it has already seen. It does not make the agent visit an unknown path in the first place. The next chapter asks how exploration can stay focused for many steps instead of tossing a new coin at every turn.",
    sources: [SB, { label: "Kaelbling, Littman, and Cassandra — Planning and Acting in Partially Observable Stochastic Domains", url: "https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume13/kaelbling98a-html/kaelbling98a.html", kind: "paper" }],
  },
  {
    slug: "deep-exploration",
    title: "Real exploration may require ten brave steps in the same direction",
    deck: "A random choice at every step can make an agent wobble near the start. Deep exploration keeps one useful question alive long enough to test it.",
    openingQuestion: "If the reward is ten rooms to the right, how will the agent find it when random moves keep sending it back left?",
    bridge: "Memory tells the agent what happened before. It still does not make the agent walk far enough into an unknown corridor. A useful test may require many unrewarded steps in one direction. Exploration must therefore guide a whole sequence, not only add noise to each separate action.",
    situation: {
      title: "A random television can look new forever",
      paragraphs: ["The agent begins in room one; only room ten gives a point, and every earlier room gives zero. If the agent randomly re-decides its direction at every door, an unlucky run of turns keeps pulling it back toward the start — random walks return home far more often than they travel far. Discovering the reward would take ten brave steps in the same direction, and dithering never takes them. So researchers built bonuses that reward rarely visited places, optimistic guesses that stay with one path for a whole trip, and curiosity signals that pay for the unpredictable.", "But surprise has a dark twin. A television showing random pixels stays unpredictable forever: the agent cannot learn or control those pixels, yet a careless curiosity reward keeps paying it to watch. The agent parks itself in front of the noise and collects its treat, and the task is never solved. Before any exploration signal earns your trust, you must separate learnable ignorance — the kind that shrinks as the agent learns — from permanent noise, which no amount of visiting will ever quiet."],
    },
    diagram: {
      title: "Before rewarding surprise, ask what kind it is", caption: "A useful exploration signal should shrink with learning, respond to the agent's actions, and eventually help the real task.",
      items: [
        { label: "Is it unknown?", value: "counts or uncertainty", note: "Look for missing evidence, not just a changing picture." },
        { label: "Can it be learned?", value: "error should fall", note: "Repeated visits should make a familiar place less surprising." },
        { label: "Can it be controlled?", value: "actions change outcomes", note: "Uncontrollable noise should not earn endless reward." },
        { label: "Does it help?", value: "external task result", note: "An inner exploration score is a guide, not the final goal." },
      ],
    },
    workedExample: {
      title: "Watch a novelty bonus fade from the first visit to the hundredth",
      setup: "The exploration bonus is beta divided by the square root of N(s). Beta is 1. N(s) counts how often the agent has visited state s.",
      prediction: "The arithmetic is easy. The harder question is whether two slightly different pictures should count as the same place.",
      steps: [
        { label: "First visit", calculation: "1/√1=1", explanation: "A newly counted state receives the full bonus of 1." },
        { label: "Tenth visit", calculation: "1/√10≈0.316", explanation: "The bonus becomes smaller as evidence grows." },
        { label: "Hundredth visit", calculation: "1/√100=0.1", explanation: "A familiar state now receives only one tenth of the first bonus." },
        { label: "Check the identity rule", calculation: "N(s) depends on what counts as the same s", explanation: "If every noisy image gets a new identity, the bonus never learns that the room is familiar." },
      ],
      result: "The bonus falls from 1 to 0.1 only if all one hundred visits are recognized as the same meaningful state. The identity rule matters more than the square root.",
    },
    mechanism: {
      introduction: "Exploration methods disagree about what 'unknown' means. We should judge each one by the kind of ignorance it measures and the behavior it creates.",
      sections: [
        { title: "Two kinds of unknown, and the counting problem", paragraphs: ["Uncertainty caused by missing evidence can shrink after useful experience — this is epistemic uncertainty. Randomness built into the world remains even after the rules are fully known — this is aleatoric uncertainty. Exploration should mainly pay for the first kind, because the second cannot be solved by more visits; a dice roll stays a dice roll no matter how often you watch it. Whenever you meet an exploration bonus, ask which kind of unknown it is actually measuring.", "Counting visits is the simplest way to measure the first kind, and the count bonus in the equations below divides a constant by the square root of the visit count. Exact state counts work in a small table; camera images need a shortcut such as hashing, a density model, or a learned embedding. The shortcut is the whole game. Make the identity rule too strict and every noisy frame looks new, so the bonus never fades; make it too loose and different rooms and dangers collapse into one count, and the bonus fades before anything is learned."] },
        { title: "Curiosity, distilled", paragraphs: ["Curiosity methods reward a prediction problem the agent can improve. A forward model predicts what follows the current state and action, and its error becomes an intrinsic reward; an inverse model encourages features tied to the agent's own actions; information gain instead rewards a real change in belief. Random Network Distillation, or RND, is the minimalist version: freeze a random target network, train a second network to copy it on visited observations, and treat the leftover error as novelty. Familiar inputs become easy to copy; new inputs keep larger error.", "Even the minimalist version carries the family's failure modes. Forgetting, poor scaling, or genuinely random pixels can keep the error high on inputs that are not usefully new, and the agent will keep chasing them. So judge any exploration reward by its behavior, not its score: does the error shrink with repeat visits, does it respond to the agent's actions, does external task performance eventually improve? An inner exploration number is a guide, never the goal — and no definition of 'unknown' licenses a dangerous action on a real machine."] },
      ],
    },
    equations: [
      { latex: "r_t^{int}=\\frac{\\beta}{\\sqrt{N(S_t)}}", read: "The count bonus divides beta by the square root of the number of visits to the current state.", meaning: "Rare states receive more bonus. The rule works only when the system groups observations into meaningful states." },
      { latex: "r_t^{RND}=\\left\\|f_{predictor}(O_t)-f_{fixed}(O_t)\\right\\|_2^2", read: "RND uses the squared difference between a trained predictor and a frozen random target network.", meaning: "The difference often shrinks on familiar inputs. Noise or forgetting can keep it high even when the experience is not useful." },
    ],
    boundary: {
      title: "Being surprised is not the same as making progress", paragraphs: ["An agent may circle through flashing, changing rooms and earn a large curiosity score while never approaching the real goal. External reward, state coverage, and the inner exploration reward should be reported separately." ,"The word 'unknown' does not grant permission to try a dangerous action. Real systems still need safety limits, simulation, demonstrations, human review, or offline evidence before exploration reaches the physical world."],
    },
    nextBridge: "Suppose focused exploration finally reaches the reward in room ten. We now know that one long trip worked. We still do not know which early choice deserves the credit. The next chapter asks how a late result should change actions taken much earlier.",
    sources: [SB, { label: "Burda et al. — Exploration by Random Network Distillation", url: "https://arxiv.org/abs/1810.12894", kind: "paper" }, { label: "Pathak et al. — Curiosity-driven Exploration by Self-supervised Prediction", url: "https://proceedings.mlr.press/v70/pathak17a.html", kind: "paper" }],
  },
  {
    slug: "long-horizon-credit",
    title: "A late reward should not give equal credit to every earlier move",
    deck: "Finding one successful trip is only the start. The learner must decide which early choices helped and which merely happened along the way.",
    openingQuestion: "The agent picked up a key, wandered for ninety steps, and then opened a door. Which action really earned the final ten points?",
    bridge: "Deep exploration can finally discover a distant reward. The successful trip still contains key choices, harmless waiting, and lucky accidents. Giving the same lesson to every earlier action mixes them together. We need ways to move information backward without pretending that time order alone proves cause.",
    situation: {
      title: "The door pays once, but the key mattered much earlier",
      paragraphs: ["The agent picks a key at step five and opens a door at step one hundred; the ten-point reward appears only at the door. A complete return can reach every earlier action, but it arrives as an undifferentiated glow and never explains why the key mattered more than the hallway. Handing the same lesson to every earlier action mixes signal with accident. Eligibility traces carry later prediction errors toward recent states; a multi-step skill can turn 'get the key' into one higher-level action; reward redistribution moves part of a late reward toward an earlier informative event.", "Hindsight Experience Replay, or HER, asks a different question entirely. If the agent missed the red door but reached the blue door, the same real trip can teach how to reach blue — relabel the goal and every step becomes sensible in retrospect. Each of these tools moves information backward in its own way: through updates, through action hierarchy, through reward timing, or through the question asked. And none of them, alone, proves causal responsibility. That proof is exactly what this chapter teaches you to demand."],
    },
    diagram: {
      title: "Four tools shorten four different kinds of distance", caption: "They move an update, shorten the action chain, move reward in time, or change the goal label. These are not the same operation.",
      items: [
        { label: "Trace", value: "send δ backward", note: "Let recent visited states hear a later prediction error sooner." },
        { label: "Skill", value: "many moves become one option", note: "Let the higher level make fewer, longer decisions." },
        { label: "Redistribute", value: "move reward earlier", note: "Place part of a late result near an informative event." },
        { label: "Hindsight", value: "change the goal label", note: "Reuse a real trip as evidence for a goal it actually reached." },
      ],
    },
    workedExample: {
      title: "Move seven of the ten points back to the key",
      setup: "A three-step trip has rewards [0,0,10]. Gamma is 1. A proposed redistribution changes the rewards to [7,0,3].",
      prediction: "The timing changes. Does the total change too, and what else must be checked before the new reward is trusted?",
      steps: [
        { label: "Add the old rewards", calculation: "0+0+10=10", explanation: "All feedback originally arrives at the final step." },
        { label: "Add the new rewards", calculation: "7+0+3=10", explanation: "This trip still has total reward 10." },
        { label: "Notice the earlier lesson", calculation: "step-one reward changes from 0 to 7", explanation: "The key event now receives a useful signal immediately." },
        { label: "Check the real task", calculation: "compare policies before and after redistribution", explanation: "Equal sums on one trip do not prove that all policies keep the same ranking." },
      ],
      result: "The new rewards teach the first step sooner. The accounting works for this trip. We must still check that the change does not reward a useless event or alter which policy is best.",
    },
    mechanism: {
      introduction: "These tools do not solve one identical problem. Each changes a different part of the path from a late result to an early decision.",
      sections: [
        { title: "Traces and skills: shortening the path", paragraphs: ["An eligibility trace marks recently visited states or features; when a new Temporal-Difference error arrives, the marked places receive part of it, and the mark fades with time. This speeds learning from delayed rewards considerably — the door's error reaches the key's neighborhood within a few updates instead of a hundred. But notice the principle underneath: traces give credit mainly by recency. They do not know whether an earlier action was necessary, only that it was nearby, so a merely recent accident can collect as happily as the true cause.", "Skills attack the same distance from the other end. An option is a multi-step skill with a starting rule, its own policy, and a stopping rule, so 'get the key' can become one high-level choice instead of twenty motor commands — the decision chain itself becomes shorter, and credit has fewer steps to travel. The risk is architectural: a poor skill library can hide an important route entirely, so shorter does not automatically mean better. Someone still chose the skills, and that choice is part of the learning system."] },
        { title: "Moving reward and changing the question", paragraphs: ["Reward redistribution edits the timing instead of the actions. A sequence model watches when the expected final return suddenly changes and moves some reward near that event, giving the learner a shorter target — the worked example moved seven of ten points back to the key while preserving the total. Two duties come with the edit. The move must preserve the original decision goal, and prediction is not cause: a nearby light may predict success without producing it, so rewarding the light teaches the agent to watch, not to act.", "Hindsight is the quietest tool of the four because it changes neither rewards nor updates — only the question. A trip that missed goal g may have reached another goal g prime; HER keeps every real state and action but relabels the goal, so the trip becomes genuine evidence for a goal it actually achieved. The limit is honesty: hindsight cannot invent an action, outcome, or path that never occurred, and it works only when the alternative goal is meaningful for your task. Used within that limit, it turns failure into curriculum."] },
      ],
    },
    equations: [
      { latex: "\\sum_{t=0}^{T-1}\\tilde R_{t+1}=\\sum_{t=0}^{T-1}R_{t+1}", read: "The redistributed rewards add up to the same total as the original rewards.", meaning: "This is a basic check when gamma is 1. Keeping every policy's ranking unchanged needs stronger evidence." },
      { latex: "r_t^{g'}=\\mathbf{1}\\{\\text{achieved}_{t+1}=g'\\}", read: "A hindsight reward uses another goal, g prime, that the trip actually reached.", meaning: "The transition remains real, but the question changes. This works only when the alternative goal is valid and uses the same world rules." },
    ],
    boundary: {
      title: "Predicting success does not prove that an event caused it", paragraphs: ["A green light may always appear before the door opens because both depend on a hidden switch. Rewarding the light will not help if the agent cannot control it. Changing or removing the suspected event provides stronger evidence." ,"A model can also memorize a long trip without learning a reusable decision. We should judge credit by faster learning, transfer to new paths, robust behavior, and an unchanged task goal—not by a colorful attention map."],
    },
    nextBridge: "Credit methods learn after a future has been experienced. What if the agent can consider several possible futures before it moves? The next part introduces search and planning. It begins with known game rules, then asks what happens when the world model must also be learned.",
    sources: [SB, { label: "Arjona-Medina et al. — RUDDER: Return Decomposition for Delayed Rewards", url: "https://proceedings.neurips.cc/paper/2019/hash/16105fb9cc614fc29e1bda00dab60d41-Abstract.html", kind: "paper" }, { label: "Andrychowicz et al. — Hindsight Experience Replay", url: "https://proceedings.neurips.cc/paper/2017/hash/453fadbd8a1a3af50a9df4df899537b5-Abstract.html", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
