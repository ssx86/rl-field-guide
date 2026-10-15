import type { PanoramaArticle } from "@/content/panorama/types";

export const PANORAMA_EN: PanoramaArticle = {
  language: "en",
  eyebrow: "READ THIS FIRST · CHAPTER 00",
  title: "The Long Way from One Choice to Reinforcement Learning",
  deck: "One delivery robot, nine changes of circumstance, and the questions that make the field of reinforcement learning unfold in a necessary order.",
  opening: [
    "A delivery robot reaches a fork on a university campus. The path on the left is short and sometimes flooded. The path on the right is longer and usually clear. No one can hand it a correct answer for every hour and every parcel. It has to choose before it knows exactly what the choice will cost.",
    "At first this looks like a small routing problem. Then notice what the robot is missing. It sees only one outcome from the path it actually takes. The result may arrive late. That result changes what it will try tomorrow. And once it turns left, it cannot return to the same instant and discover what the right-hand path would have done. Acting produces both a consequence and the next piece of evidence.",
    "A family of methods built for that situation is called reinforcement learning. We will not begin by sorting its algorithms into boxes. We will make the robot's world harder one change at a time. Whenever an old answer stops working, the reason for the failure will give us the next idea and, only then, its name.",
    "This is a map, not a substitute for the territory. By the end you should be able to place almost any reinforcement-learning method by asking what problem it repairs, what evidence it needs, and where its claim runs out. The remaining forty-six chapters return to each stop slowly, with calculations, equations, and primary sources.",
  ],
  movements: [
    {
      id: "one-choice", number: "01", title: "Before a sequence exists, there is still a cost to not knowing", turn: "For one afternoon, every parcel returns the robot to the same gate. Nothing it does now changes the next parcel. Only the uncertainty about the two paths carries forward.",
      paragraphs: [
        "The first useful question is not which learning algorithm to use. It is whether consequences must be learned at all. Known travel times call for ordinary planning; labeled delay records may support prediction followed by a planner. [[The decision before reinforcement learning|before-rl]] is therefore a framing test. Learning from interaction earns its complexity only when the answer cannot be supplied more directly.",
        "Suppose the robot has to learn. Repeating the fastest observed path spends deliveries on the current winner. Trying the less familiar path spends a delivery on information. The two motives are usually called exploitation and exploration. Neither is virtuous by itself: permanent exploration wastes service, while permanent exploitation can freeze a lucky early guess.",
        "When each round ends before the next begins, the problem is called a [[multi-armed bandit|bandits-contextual-bandits]]. Random trials, optimism under uncertainty, and posterior sampling are different ways to pay for information. [[Probability and expectation|probability-expectation]] are needed because one wet afternoon is a sample, not the path's permanent value. Regret then measures the accumulated price of learning rather than condemning a single unlucky choice.",
        "Add the weather forecast or parcel type and the choice can depend on the current context. That is still a contextual bandit as long as today's route does not alter tomorrow's situation. The moment a route changes battery, location, or access to later deliveries, the reset disappears. The first decision must now be judged partly by the future it creates.",
      ],
      coda: "The robot no longer needs only an estimate of two paths. It needs a way to speak about a chain in which each choice rearranges the next choice.",
    },
    {
      id: "future", number: "02", title: "A present choice borrows its meaning from a future", turn: "The robot must now complete several deliveries on one charge. A short move may leave it stranded; a slower move may preserve a useful charging stop.",
      paragraphs: [
        "Draw the loop before naming a method. The robot receives some information, chooses, the world changes, and a score or cost appears. The decision-maker is called the agent; what answers it is called the environment. The available information is a state when it is sufficient for prediction, or an observation when it may not be. The choice is an action, the scoring signal is a reward, and the rule for choosing is a policy. [[The agent–environment interface|interaction-loop]] fixes their timing so later equations cannot quietly use information that was unavailable at the decision.",
        "A label does not make an input sufficient. The same camera frame can lead to different stopping distances when the robot is moving at different speeds. The claim that the current representation contains all relevant predictive history is called the Markov property; a sequential problem built around that claim is a [[Markov decision process|mdp-state-design]]. If the claim fails, more history or a belief about hidden conditions may be needed later.",
        "Immediate reward is too narrow for a detour whose benefit arrives ten steps later. The discounted sum of later rewards is called return. [[Return and horizon|return-horizon]] make us state how far the task extends and whether an episode truly ended or was merely cut off by a recorder. Those details change whether future value belongs in the target.",
        "The recurring bookkeeping rule that splits a future into the next consequence plus what remains afterward is the [[Bellman idea|value-bellman]]. It gives meaning to state value, action value, and advantage. It does not decide whether the reward represents the real purpose. If speed is the only number supplied, the robot may learn to cut through a crowded walkway with mathematical efficiency.",
      ],
      coda: "We can now state the problem without yet knowing how to solve it. The next divide is simple: do we already know how this world changes?",
    },
    {
      id: "learn-values", number: "03", title: "A known world can be planned; an unknown one must be sampled", turn: "First imagine a complete campus model. Then remove it and leave the robot only the transitions it actually experiences.",
      paragraphs: [
        "With a trusted model, trial and error is unnecessary. Repeatedly evaluating a policy and improving it is called [[dynamic programming|dynamic-programming]]. Policy iteration keeps those motions separate; value iteration interleaves them. These methods belong in the field because they reveal the target that later methods approximate, but their evidence comes from a model, not from risky online discovery.",
        "Without that model, one option is to wait for a delivery to finish and use the return that really occurred. This is [[Monte Carlo learning|monte-carlo]]. It avoids teaching an estimate from another estimate, but it waits for endings and can vary sharply across journeys. A method that updates after one transition by combining the new reward with its current estimate of what follows is called [[temporal-difference learning|td-traces]]. Longer returns and eligibility traces fill the space between those two endpoints.",
        "Learning what to do adds another choice: which future behavior should the update evaluate? Using the next action that the current behavior actually sampled produces State–Action–Reward–State–Action, or [[SARSA|tabular-control]]. Averaging that behavior's possible actions produces Expected SARSA. Using the currently best-valued next action produces Q-learning. The update shells look similar; the policy being evaluated is not.",
        "Experience collected by one policy can sometimes evaluate another, a setting called off-policy learning. It is valuable and conditional. Missing actions provide no counterfactual evidence, and large corrections can make estimates volatile. When off-policy data, bootstrapping, and shared function approximation meet, their unstable interaction is known as the [[deadly triad|off-policy-deadly-triad]]. That warning will matter as soon as the table disappears.",
      ],
      coda: "The small table made every dependency visible. Real images and sensor histories contain far too many distinct situations for one cell each.",
    },
    {
      id: "scale", number: "04", title: "Generalization saves memory and spreads mistakes", turn: "The robot now sees pixels. No two frames are identical, yet learning in one corridor ought to help in another that matters in the same way.",
      paragraphs: [
        "Replacing a cell for every state with a weighted combination of features is called [[linear function approximation|linear-approximation]]. One update can then improve many related situations. The same shared weight can also damage them together. A representation is therefore a claim about which differences matter, not merely a compression trick.",
        "A neural network can learn the representation, but [[neural function approximation|neural-approximation]] does not turn the task into ordinary supervised learning. The policy changes the data it sees, targets can depend on the network being updated, and consecutive samples are correlated. A falling loss can accompany worse behavior.",
        "For a manageable list of actions, a network that estimates every action value is called a [[Deep Q-Network, or DQN|dqn]]. Replay and a delayed target stabilize two specific moving parts. The [[DQN family|dqn-family]] then repairs separate weaknesses such as overestimation, inefficient replay, and an impoverished description of uncertain returns. A bundle of repairs is useful only when its individual assumptions still fit the job.",
        "Another route represents the policy directly. [[Policy gradients|reinforce-policy-gradient]] move action probabilities using sampled outcomes; an [[actor–critic with Generalized Advantage Estimation|actor-critic-gae]] adds a learned baseline to make that signal less noisy. Trust Region Policy Optimization and [[Proximal Policy Optimization|trpo-ppo]] limit how abruptly the policy moves, but neither a trust region nor clipping is a deployment safety barrier.",
        "Continuous controls require policies that output angles or torques rather than score a short menu. [[Continuous-control methods|continuous-control]] use critics, stochastic actors, entropy, or twin estimates in different combinations. Running many actors in parallel creates [[distributed reinforcement learning|distributed-rl]], where policy lag, queues, and replay age become part of the learning problem rather than mere infrastructure.",
      ],
      coda: "Scale solves the size of the representation. It does not supply missing information, visit a reward that is never reached, or explain which early act deserved a late success.",
    },
    {
      id: "hidden", number: "05", title: "Three failures can produce the same flat learning curve", turn: "Inside a building, identical doors hide different rooms, success is reported only at the final desk, and the useful lift sits beyond a corridor the robot has never tried.",
      paragraphs: [
        "One failure is informational: the current view does not distinguish situations that demand different actions. A sequential model with hidden state is called a [[Partially Observable Markov Decision Process|pomdp-memory]]. History, filters, recurrent memory, or a belief state can help only if earlier observations actually contain the missing clue.",
        "A second failure is reachability. The policy never arrives where useful evidence lives. Counts, optimism, curiosity, and [[deep exploration|deep-exploration]] change what the robot is willing to try. Novelty is not progress, however. An unpredictable screen can remain novel forever while teaching nothing about delivery.",
        "A third failure is attribution. The robot reaches the goal, but a reward two hundred steps later barely changes the turn that made it possible. Eligibility traces, temporal abstraction, reward redistribution, and hindsight are tools for [[long-horizon credit assignment|long-horizon-credit]]. They move or reshape evidence; they do not turn temporal correlation into proof of causal contribution.",
        "The remedies separate cleanly when we inspect trajectories. If the same visible input needs different behavior, repair information. If the rewarding region is absent, repair exploration or bring demonstrations. If success occurs but the decisive early behavior does not strengthen, inspect credit. A single return curve cannot tell us which break occurred.",
      ],
      coda: "When trying the wrong thing in reality is slow or dangerous, the robot needs to rehearse consequences before paying for them.",
    },
    {
      id: "models", number: "06", title: "Imagination is useful only while its errors stay visible", turn: "Give the robot a campus it can rehearse in. Then ask whether that campus is known, learned, or merely convenient.",
      paragraphs: [
        "If the rules are exact, search can look ahead without learning the transitions. [[Monte Carlo Tree Search and AlphaZero|mcts-alphazero]] show how learned policy and value guidance can work with a known simulator. The learner proposes where to search; the rules still decide what a move does.",
        "When transitions must be learned, real experience can train both behavior and a predictive model. [[Dyna and Model Predictive Control|dyna-mpc]] reuse that model for simulated updates or short plans that are revised after the next real observation. Short horizons and repeated replanning are not aesthetic choices; they limit the distance over which error compounds.",
        "Some models predict only what decisions need. [[Latent world models|latent-world-models]] can imagine in a compact state instead of reconstructing every pixel. That efficiency also weakens interpretation: a representation sufficient for search need not be a faithful scientific explanation of the campus.",
        "A planner actively searches for high predicted value, so it is unusually good at finding places where the model is wrong in an optimistic direction. Ensembles, uncertainty penalties, real-data checks, and conservative planning reduce the opening. They do not convert imagined transitions into independent evidence.",
      ],
      coda: "There are domains where even cautious exploration is not permitted. In those places, yesterday's decisions must carry most of the learning burden.",
    },
    {
      id: "logged-world", number: "07", title: "A fixed record teaches only inside the world it recorded", turn: "The robot moves into a hospital. Experts and historical logs are available; unconstrained online trials are not.",
      paragraphs: [
        "Treating expert actions as labels is called behavior cloning. It works near familiar states and can unravel after one unfamiliar mistake. [[Behavior cloning and Dataset Aggregation|behavior-cloning-dagger]] expose the difference between copying a fixed record and asking an expert to label the learner's own new states.",
        "Sometimes the goal itself must be inferred from behavior. [[Inverse reinforcement learning and adversarial imitation|inverse-rl-gail]] search for an objective or occupancy pattern consistent with demonstrations. The answer is rarely unique because expert actions mix purpose, habit, constraints, and information the learner may not observe.",
        "If the dataset is sealed, improving beyond its behavior without inventing value for unseen actions is the central difficulty of [[offline reinforcement learning|offline-rl]]. Conservative objectives and support constraints are different ways of respecting that boundary. A [[Decision Transformer|decision-transformer]] can instead model action sequences conditioned on desired return; asking for a high return still cannot summon a successful sequence that the record never contains.",
        "Before deployment, [[off-policy evaluation|off-policy-evaluation]] uses logged behavior to estimate another policy. Importance weights, learned models, fitted value evaluation, and doubly robust estimators trade assumptions differently. All of them need overlap. An absent action has neither a documented success nor a documented accident.",
      ],
      coda: "Data limits what one robot can learn. Structure asks whether a long job can be reorganized and whether experience can survive a change of robot, teammate, or building.",
    },
    {
      id: "structure", number: "08", title: "A long task can become a skill, and one learner can become a team", turn: "Delivering a parcel now means collecting it, calling a lift, finding a ward, and completing a hand-off while other robots move through the same halls.",
      paragraphs: [
        "A multi-step behavior with a start condition, an internal policy, and a stopping rule is often called an option. Building decisions from such units is [[hierarchical reinforcement learning|hierarchical-rl]]. Good abstractions shorten planning and permit reuse. Bad ones remove the fine-grained action that an unusual emergency requires.",
        "With several learners, each agent's environment changes as the others learn. [[Multi-agent reinforcement learning|multi-agent-rl]] studies cooperation, competition, communication, and joint credit. Centralized training can use joint information while deployed actors remain local, but a shared reward still does not automatically reveal who caused the outcome.",
        "A new building raises a different question: what should transfer? [[Transfer, meta-learning, and sim-to-real generalization|transfer-meta-generalization]] define families of changes under which experience may help. Fast adaptation on a benchmark is evidence about that benchmark's held-out distribution, not a general property called adaptability.",
        "Structure always exchanges freedom for leverage. A skill library narrows available behavior, a coordination protocol assumes something about partners, and simulator randomization chooses which worlds count as plausible. Those choices belong in the result, not in a footnote.",
      ],
      coda: "Even perfect organization cannot repair a score that rewards the wrong thing. The last turn is therefore about measurement, constraint, and proof.",
    },
    {
      id: "measurement", number: "09", title: "The optimizer follows the score; responsibility begins where the score stops", turn: "The delivery system rewards completed jobs. The robot discovers that marking a parcel delivered is easier than completing the hand-off.",
      paragraphs: [
        "The practice of connecting a numerical signal to the real outcome is [[reward design|reward-design]]. Shaping can make useful behavior easier to discover, yet a proxy under pressure may stop tracking the goal. Hard requirements should not be hidden inside a weighted average that permits enough reward to buy one unacceptable failure.",
        "This leads to [[safe, robust, constrained, and risk-sensitive reinforcement learning|safe-robust-risk]]. Cost budgets, tail-risk objectives, uncertainty sets, runtime shields, and human authority operate at different layers. A penalty learned during training is not the same thing as a physical interlock at deployment.",
        "A result also needs measurement discipline. [[Evaluation and reproducibility|evaluation-reproducibility]] ask for learning curves, seeds, intervals, matched budgets, ablations, and held-out tasks. [[Reinforcement-learning systems|rl-systems]] add executable environment contracts, correct episode endings, replay provenance, checkpoints, and observability. Passing a build proves neither reward validity nor field safety.",
        "Now replace the robot's motor command with a language model's next token. The mapping is useful only if we keep the boundary clear. [[Language models viewed through reinforcement learning|llm-as-rl]] are not automatically doing reinforcement learning: predicting provided target tokens is supervised fine-tuning; sampling an answer and changing its probability from later feedback creates a policy-learning loop.",
        "When people compare complete answers, [[Reinforcement Learning from Human Feedback with PPO|rlhf-ppo]] can learn a reward model and optimize newly sampled replies. Fixed preference pairs can instead support [[direct preference optimization|direct-preference]] without an online reinforcement-learning loop. If another model supplies judgments, [[Reinforcement Learning from AI Feedback|rlaif-judges]] scales the measuring instrument and inherits its biases.",
        "Tasks with checkable outcomes can use [[Reinforcement Learning with Verifiable Rewards and group-relative updates|rlvr-grpo]]. At deployment, a frozen model can spend more search, samples, or tool calls through [[test-time compute|test-time-compute]] without changing its parameters. Both approaches depend on a verifier that can recognize success and resist shortcuts.",
        "The final step is not choosing the most fashionable acronym. [[Method selection|method-selection]] begins with the evidence source, observability, model knowledge, online permissions, failure cost, and evaluation plan. Sometimes the correct decision is a simpler predictor or planner. Sometimes it is to collect data, narrow the claim, or refuse deployment.",
      ],
      coda: "Every method now has an address: the failure that called for it, the evidence that supports it, and the boundary beyond which its confidence becomes borrowed.",
    },
  ],
  diagnosticTitle: "Seven questions that locate almost any reinforcement-learning problem",
  diagnosticIntro: "When a paper, product, or benchmark arrives covered in acronyms, set the names aside and draw the decision process. Then ask:",
  diagnosticQuestions: [
    "What information exists at the moment of choice, and is it a sufficient state or only an observation?",
    "How does the current action alter later situations, available actions, and the data that will be collected?",
    "Does evidence come from a known model, online interaction, demonstrations, a fixed log, preferences, or a verifier?",
    "What must be estimated: value, policy, dynamics, hidden state, reward, or the quality of an answer?",
    "Is the present bottleneck missing information, missing coverage, delayed credit, model error, or distribution shift?",
    "Which requirements must never be traded for more reward, and where are they enforced outside the learner?",
    "What independent evidence would justify the intended claim, and which deployment situations remain unsupported?",
  ],
  closing: [
    "The robot never needed the whole field at once. A resetting choice called for a bandit. Consequential choices required state, return, and value. A known model allowed planning; an unknown one required samples. Large spaces demanded generalization. Hidden information, unreachable rewards, and delayed consequences demanded different repairs. Models made rehearsal possible. Demonstrations and logs constrained where improvement could be claimed. Skills, teams, and transfer added structure. Reward design and evaluation kept optimization from grading its own exam.",
    "That order matters more than memorizing an algorithm family tree. Reinforcement learning is a way of reasoning about decisions that create both consequences and future evidence. The next forty-six chapters slow this journey down. Each begins with a concrete obstruction, earns its terminology, carries one example through the arithmetic, and leaves the unsupported territory visible.",
  ],
};
