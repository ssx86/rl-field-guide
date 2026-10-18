import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_SEVEN_ARTICLES = [
  {
    slug: "hierarchical-rl",
    title: "Let a long action have a beginning, a middle, and an end",
    deck: "A delivery robot should not plan every wheel movement from scratch. It can reuse a longer skill, such as go to the elevator, while another policy decides which skill to use next.",
    openingQuestion: "If a robot already knows how to reach a door, why should every new delivery plan rediscover all the small turns on the way there?",
    bridge: "Recorded data has limits. Now suppose the agent can act, but the job lasts a very long time. Many parts of the job repeat. We need a way to save and reuse those parts without forgetting what happens inside them.",
    situation: {
      title: "A delivery plan can speak in rooms instead of wheel movements",
      paragraphs: [
        "Imagine a robot leaving a mailroom, riding an elevator, crossing a corridor, and docking at a desk. At the level of motors, every one of those phases is a stream of wheel commands. Yet you would never give a friend directions that way — you would say 'take the elevator to three, then second door on the left'. The same economy is available to a learning agent: a manager policy chooses a longer action such as reach the elevator, and a worker policy performs the small actions until that longer action ends. Learning with these two time scales is called Hierarchical Reinforcement Learning, or HRL.",
        "One formal kind of longer action is called an option, and its three parts are worth memorizing because everything else in this chapter hangs on them. An option says where it may start (the initiation set), what policy runs while it is active (the option policy), and when it stops (the termination rule). An option can last one step or many, which means the manager must remember how much time passed before choosing again — a small bookkeeping change with large mathematical consequences, as you are about to see.",
      ],
    },
    diagram: {
      title: "The manager chooses again only after the longer action ends",
      caption: "The worker still changes the world one small step at a time. The manager sees the combined reward, elapsed time, and finishing state.",
      items: [
        { label: "Choose", value: "reach the elevator", note: "The manager selects a useful longer action for the current state." },
        { label: "Start", value: "allowed here?", note: "The longer action can begin only in states where it is valid." },
        { label: "Continue", value: "small actions", note: "The worker controls the robot for one or more environment steps." },
        { label: "Return", value: "new state and total reward", note: "When the skill stops, the manager receives control again." },
      ],
    },
    workedExample: {
      title: "A three-step skill must discount three steps of waiting",
      setup: "An option lasts three primitive steps and receives rewards 1, 0, and 2. Gamma is 0.9. The next high-level state has value 5.",
      prediction: "Which power of gamma multiplies the next high-level value?",
      steps: [
        { label: "Add rewards inside the skill", calculation: "1+0.9×0+0.9²×2=2.62", explanation: "The second and third rewards arrive later, so they receive more discounting." },
        { label: "Count the waiting time", calculation: "0.9³×5=3.645", explanation: "The manager gets the next value only after all three small steps have passed." },
        { label: "Make the target", calculation: "2.62+3.645=6.265", explanation: "The target contains rewards earned inside the skill and value after the skill ends." },
        { label: "Check the stop rule", calculation: "bad β can end too early or never return", explanation: "A useful worker must also know when to hand control back to the manager." },
      ],
      result: "The longer action saves planning effort, but it does not erase the three small steps. Their rewards and their time still belong in the value calculation.",
    },
    mechanism: {
      introduction: "A hierarchy helps only when each longer action has a clear job and a clear handoff back to the manager.",
      sections: [
        { title: "The option framework and the manager's new clock", paragraphs: [
          "The three parts of an option answer three practical questions: where can this skill start, what does it do while it runs, and when does the manager get control back? Notice that a one-step action fits the same definition — it simply stops immediately — so options add longer actions without removing ordinary ones, and the manager can still take a small step when no larger skill fits. The framework extends what you already know rather than replacing it. What genuinely changes is the clock.",
          "In an ordinary Markov Decision Process, or MDP, the policy chooses again after every step. With options, the next choice may come after one step or ten, and the setting has its own name: a Semi-Markov Decision Process, or SMDP. A reward received three steps later must be discounted three times, because the manager truly waited three steps; pretending every option lasts one step makes a slow skill look better than it is. When you evaluate a hierarchy, count the small steps inside every long action — their rewards and waiting time still belong in the value.",
        ] },
        { title: "Ways to build the family of skills", paragraphs: [
          "Where do the options come from? One answer is to draw a task tree, as MAXQ value-function decomposition does: a parent job such as deliver the parcel calls children such as reach the elevator and cross the corridor, and each child learns from its own part of the trip. The tree is powerful and dangerous in the same gesture, because it limits what the agent may do. If the tree leaves out a necessary move, the manager cannot invent it, and the best policy the tree allows may be worse than the best policy over all small actions used freely.",
          "Two softer answers exist. A goal-conditioned policy receives both the current state and a desired result, so a single worker can learn reach door A, reach door B, and reach the charger, while the manager simply changes the goal instead of loading a different worker each time. Other methods discover skills automatically by rewarding behaviors that differ from each other — but different does not always mean useful. Spinning left and spinning right are easy to tell apart, and neither delivers a parcel. A discovered skill earns its place only after a downstream test shows that having it actually helps.",
        ] },
      ],
    },
    equations: [
      { latex: "Q(s,o)=\\mathbb{E}\\left[\\sum_{i=0}^{k-1}\\gamma^iR_{t+i+1}+\\gamma^k\\max_{o'}Q(S_{t+k},o')\\right]", read: "The value of an option includes rewards collected during its k steps and the best value available when it ends.", meaning: "The power k records how long the manager waited. The option is not one magic step; the small steps still decide reward and discounting." },
      { latex: "o=(\\mathcal I_o,\\pi_o,\\beta_o)", read: "An option contains a start set, a policy for acting, and a rule for stopping.", meaning: "These three parts answer three practical questions: where can the skill start, what does it do, and when does the manager get control back?" },
    ],
    boundary: {
      title: "A neat hierarchy can organize the wrong pieces",
      paragraphs: [
        "Hand-made skills carry the designer's guesses about which pieces matter. Learned skills may chase easy variety instead of useful progress. A hierarchy should be compared with a strong policy that can still use the original small actions.",
        "The worker may also keep changing while the manager learns. Then reach the elevator does not produce the same result from week to week. Freezing versions or training the two levels carefully can reduce this moving target.",
      ],
    },
    nextBridge: "A manager and worker belong to one agent and usually serve one goal. The next chapter adds several agents. Now one learner's action changes the world seen by every other learner.",
    sources: [SB, { label: "Sutton, Precup, and Singh — Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction", url: "https://www.sciencedirect.com/science/article/pii/S0004370299000521", kind: "paper" }, { label: "Dietterich — Hierarchical Reinforcement Learning with the MAXQ Value Function Decomposition", url: "https://www.jair.org/index.php/jair/article/view/10266", kind: "paper" }],
  },
  {
    slug: "multi-agent-rl",
    title: "When several learners share a world, each one changes the others' lesson",
    deck: "Two robots can make each other better, worse, or simply confused. A useful method must say what each robot sees, what they share during training, and who receives each reward.",
    openingQuestion: "If one robot takes the same turn twice, why can it be safe yesterday and cause a collision today?",
    bridge: "A hierarchy gives one agent a manager and a worker. Their jobs can be designed to fit together. Separate agents are different. A teammate or opponent can learn a new policy, so the consequences of my action may change even when the physical room stays the same.",
    situation: {
      title: "Two warehouse robots are part of each other's environment",
      paragraphs: [
        "Two robots share a narrow aisle. Robot A learns a polite habit: wait when B passes on the left. Weeks later, B's own training settles on passing on the right — and A's old lesson now causes a crash. Nothing about the physical room changed; what changed is another learner. This is the defining discomfort of Multi-Agent Reinforcement Learning, or MARL: from each agent's point of view, the environment includes the other agents, and they keep moving. The agents may share one reward, compete for opposite rewards, or mix the two — and you must say which case you mean before choosing an algorithm.",
        "A common design softens the problem during training only. The training judge may see both robots' views and actions, while each deployed robot still acts from its own camera and its allowed messages. This is Centralized Training with Decentralized Execution, or CTDE, and its central discipline is honesty about information: the extra view is a teaching aid, not a crutch the robot may secretly lean on after graduation. Every channel that will not exist at deployment must be closed before you claim a result.",
      ],
    },
    diagram: {
      title: "The teacher may see both robots, but each robot still acts locally",
      caption: "Training can use the joint situation to explain a shared result. Deployment must close every information channel that will not exist in the real system.",
      items: [
        { label: "Robot A", value: "local view → action A", note: "At deployment, A uses only its own view and allowed messages." },
        { label: "Robot B", value: "local view → action B", note: "B makes a separate decision at the same time." },
        { label: "Training judge", value: "both views and actions", note: "Joint information can help explain why the shared result occurred." },
        { label: "Team result", value: "reward and next state", note: "The result may depend on the combination, not either action alone." },
      ],
    },
    workedExample: {
      title: "Two good meeting places create a coordination trap",
      setup: "Two agents independently choose Left or Right. Matching Left gives both 4, matching Right gives both 3, and mismatch gives both 0.",
      prediction: "Which joint action is globally best, and why can independent exploration struggle?",
      steps: [
        { label: "Compare the pairs", calculation: "Q(Left,Left)=4; Q(Right,Right)=3; mismatches=0", explanation: "Both matching choices work, but choosing Left together gives the larger reward." },
        { label: "Look at one agent", calculation: "an agent's reward depends on the other's simultaneous action", explanation: "Choosing Left looks good only when the other agent also chooses Left." },
        { label: "Notice the trap", calculation: "frequent Right coordination reinforces Right", explanation: "After the team learns Right, one agent changing alone receives zero and quickly changes back." },
        { label: "Use the joint lesson", calculation: "joint critic observes both actions", explanation: "A training judge can see that the pair of actions created the reward." },
      ],
      result: "Left together is best, but Right together is stable. Random exploration by one agent cannot easily move both agents at once, so coordination is a different problem from ordinary noise.",
    },
    mechanism: {
      introduction: "Before reading an algorithm name, ask four questions: who acts, who sees what, who receives the reward, and what information remains available after training?",
      sections: [
        { title: "A world that keeps learning, and scores that must add up", paragraphs: [
          "A single-agent method usually expects the world's response rules to stay roughly fixed while it learns. In MARL those rules include the other policies, so when another agent updates, yesterday's recorded transition describes a teammate that no longer exists. Independent learners simply ignore this: each agent trains as if the others were ordinary environment noise. The approach is appealingly simple and widely used, but a replay buffer can mix incompatible versions of teammates in one batch. Shorter buffers or current-policy data reduce the damage without explaining it away.",
          "Value decomposition attacks the coordination side of the problem. Value-Decomposition Networks, or VDN, learn one score per agent and add them to predict the team score, so each agent can simply choose its own highest-scoring action; the sum, however, is too rigid for every kind of teamwork. QMIX loosens it with a more flexible mixing network while keeping one rule: the team score must rise whenever any local score rises. That monotonicity keeps greedy local choices compatible with the team choice, but it pays a real price — it cannot represent cooperation that needs a locally unattractive sacrifice.",
        ] },
        { title: "Judging jointly, testing separately", paragraphs: [
          "Multi-Agent Deep Deterministic Policy Gradient, or MADDPG, gives the critic the joint view instead. Each agent keeps a local actor for deployment, but during training its centralized critic also sees the other agents' observations and actions, so it can explain interactions that a local score cannot. Two cautions travel with the design: the critic's input grows as more agents join, and the other policies keep moving underneath it. And the actor must still work after the centralized information is removed — the teaching aid cannot become a hidden crutch.",
          "The deepest question is whether an agent can handle partners it did not grow up with. In self-play, an agent learns against copies or earlier versions of itself and can reach impressive skill — or cycle between strategies, or settle into a private convention with one familiar population. Cross-play pairs agents trained in different runs, and success there is much stronger evidence than success with a training partner. For competitive systems, add exploitability tests that ask how badly a fresh opponent could take advantage of the learned policy.",
        ] },
      ],
    },
    equations: [
      { latex: "Q_{tot}=f_{mix}(Q_1(o_1,a_1),\\ldots,Q_n(o_n,a_n),s),\\qquad \\frac{\\partial Q_{tot}}{\\partial Q_i}\\ge0", read: "QMIX combines the agents' local values into one team value and requires the team value not to fall when a local value rises.", meaning: "That monotonic rule lets each agent choose greedily from its own values. It also rules out some team plans that require a locally bad-looking action." },
      { latex: "J_i=\\mathbb{E}[Q_i(x,a_1,\\ldots,\\mu_i(o_i),\\ldots,a_n)]", read: "MADDPG improves one local actor by asking a centralized critic about the joint situation.", meaning: "The actor still receives only its permitted local input at deployment. The training-only joint view cannot be used as a hidden crutch." },
    ],
    boundary: {
      title: "A high team score can hide a fragile agreement",
      paragraphs: [
        "Agents can coordinate through a simulator detail, a shared random seed, or an identity label that disappears later. Tests should change partners, remove members, disturb messages, and compare agents trained in separate runs.",
        "One team reward may also hide who was harmed or who did all the work. Team return, individual outcomes, stability, and resistance to exploitation answer different questions and should be reported separately.",
      ],
    },
    nextBridge: "Changing a partner tests one kind of unfamiliar situation. A new map, a new task, or real hardware creates other kinds. The next chapter separates starting well on a new task from learning that task quickly.",
    sources: [{ label: "Sunehag et al. — Value-Decomposition Networks", url: "https://arxiv.org/abs/1706.05296", kind: "paper" }, { label: "Rashid et al. — QMIX", url: "https://proceedings.mlr.press/v80/rashid18a.html", kind: "paper" }, { label: "Lowe et al. — Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments", url: "https://proceedings.neurips.cc/paper/2017/hash/68a9750337a418a86fe06c1991a1d64c-Abstract.html", kind: "paper" }],
  },
  {
    slug: "transfer-meta-generalization",
    title: "Starting well and learning fast are two different abilities",
    deck: "A policy may work on a new task before any update, or it may improve quickly after seeing a few examples. One final score cannot tell us which ability it has.",
    openingQuestion: "If one robot starts a new task at 60 points, while another starts at 40 but jumps to 70 after one try, which robot learned the more reusable lesson?",
    bridge: "Changing the other agents is one option. We can also change the room, the goal, the physics, or the reward. Each change asks a different question. We must first decide whether the policy may learn from the new task before we name its ability.",
    situation: {
      title: "A robot trained on ten floors enters an eleventh",
      paragraphs: [
        "Train one policy on ten office floors at once — this is multi-task learning — and it may serve all ten well. That proves one model can hold several known tasks; it says nothing about the eleventh floor. Now walk that policy into a building it has never seen. If it works before any update, you are watching zero-shot generalization. If instead you let it learn from the new floor, you are testing transfer and adaptation, and a method specifically trained to become good after only a little new experience is doing meta-learning. Same robot, same floor — different experiments, different claims.",
        "Moving from a simulator to real hardware opens a second gap of a different kind. Sensors, delays, friction, and lighting all differ from the simulated world, and the crossing is called simulation-to-reality transfer, or sim-to-real. Hold one uncomfortable question as you read: a simulator that varies widely is useful only if it includes the differences that actually matter outside it. Randomness is not coverage. The gap between two abilities — starting well and learning fast — is the real subject of this chapter.",
      ],
    },
    diagram: {
      title: "The same new task supports different tests",
      caption: "The important question is what the learner may do after the new task appears. No update and five training trips are not the same test.",
      items: [
        { label: "Known tasks", value: "train and test", note: "This measures how well one model handles the tasks used for learning." },
        { label: "New task", value: "zero updates", note: "This measures behavior before the learner receives target-task training." },
        { label: "New task", value: "a few updates", note: "This measures how quickly the learner uses limited new experience." },
        { label: "Real system", value: "simulation → hardware", note: "This also requires safety checks for physical mistakes." },
      ],
    },
    workedExample: {
      title: "Read the whole learning curve, not only the last score",
      setup: "On a held-out task, a meta-trained policy scores 40 before adaptation, 70 after one episode, and 82 after five. A pretrained baseline scores 60, 65, and 80.",
      prediction: "Which method has better zero-shot generalization, faster one-shot adaptation, and better five-shot performance?",
      steps: [
        { label: "Before learning", calculation: "baseline 60 > meta 40", explanation: "The usual pretrained policy starts the new task with the better behavior." },
        { label: "After one trip", calculation: "meta 70 > baseline 65", explanation: "The meta-trained policy uses the first new trip more effectively." },
        { label: "After five trips", calculation: "meta 82 > baseline 80", explanation: "The meta-trained policy remains slightly ahead, but the gap is now small." },
        { label: "State the full result", calculation: "report full curve, variance, and data cost", explanation: "Calling one method better would hide the baseline's stronger starting point." },
      ],
      result: "The baseline generalizes better before any update. The meta-trained policy adapts faster. A fair report shows both facts and counts every target-task trip used to produce them.",
    },
    mechanism: {
      introduction: "Claims about new tasks become clear when we state what changed, what stayed hidden during training, and how much new data the learner received.",
      sections: [
        { title: "Sharing, transferring, and learning the act of adapting", paragraphs: [
          "Start with sharing, the mildest form of reuse. A multi-task model may reuse useful parts across its training tasks — the same camera features serve every floor — and this positive transfer can reduce the data each task needs. But sharing has a dark twin: negative transfer, when two tasks push the same parameters in conflicting directions. An average score hides both effects, so compare each task against a model trained only for that task. Only then can you see which tasks helped one another and which were made worse by being forced to share.",
          "Transfer learning and meta-learning differ in a way one score hides. A transferred model starts from parameters, data, or skills learned elsewhere and adapts them to a named target task; a method that starts high has a useful prior. A meta-learner — Meta-RL — trains across a task family so that adapting itself becomes the learned skill: Model-Agnostic Meta-Learning, or MAML, learns parameters that improve after a few gradient steps; memory-based variants infer the task from recent experience. Report the score before and after each update budget. Both can memorize a small task family; unseen structure remains the real exam.",
        ] },
        { title: "Crossing from simulation to reality", paragraphs: [
          "Domain randomization answers the sim-to-real gap with variety: during training, change the simulated mass, friction, delay, and lighting, and hope that the real robot looks like one more member of that training range. Sometimes it does, and the transfer works. But notice the exact shape of the hope — random variation cannot protect against a difference that was never included. If the real robot has a sensor delay the simulator never modeled, no amount of randomizing the other parameters will cover it, and the first hardware test will say so.",
          "System identification walks the other direction: measure the real system and narrow the simulator's settings until the two agree. Even then, deployment should move through safe stages — held-out simulation first, then limited real calibration, then shadow runs, then bounded operation with a stop rule. The pattern is this chapter's lesson in miniature: a claim about a new world is only as strong as the range of worlds you actually tested, and the crossing should be gradual enough to survive being wrong.",
        ] },
      ],
    },
    equations: [
      { latex: "\\theta_i'=\\theta-\\alpha\\nabla_\\theta L_{\\mathcal T_i}(\\theta),\\qquad \\min_\\theta\\sum_i L_{\\mathcal T_i}(\\theta_i')", read: "A gradient-based meta-learner updates the shared starting parameters once for each training task, then checks how well the updated parameters work.", meaning: "Training rewards a starting point that adapts well under the chosen update rule. It does not prove that the same update will work on every kind of new task." },
      { latex: "\\phi^*=\\arg\\max_\\phi\\mathbb{E}_{\\xi\\sim p_{sim}(\\xi)}[J(\\pi_\\phi;\\xi)]", read: "Domain randomization trains the policy across simulator settings drawn from a chosen range.", meaning: "The range is part of the claim. A real delay or failure mode outside that range remains untested, even when the simulated average is high." },
    ],
    boundary: {
      title: "A new random seed may still be an old kind of problem",
      paragraphs: [
        "A held-out floor made by the same generator may closely resemble the training floors. Stronger tests hide new combinations or new structures and prevent repeated tuning on the final test set.",
        "Fast adaptation can also be dangerous. The first few trials may contain crashes or costly failures. Their cost belongs in the result instead of disappearing behind the final adapted score.",
      ],
    },
    nextBridge: "A policy may transfer perfectly and still chase the wrong goal. The next part asks how rewards, safety limits, evaluation, and the training system affect what we can honestly claim.",
    sources: [{ label: "Finn, Abbeel, and Levine — Model-Agnostic Meta-Learning", url: "https://proceedings.mlr.press/v70/finn17a.html", kind: "paper" }, { label: "Tobin et al. — Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World", url: "https://arxiv.org/abs/1703.06907", kind: "paper" }, SB],
  },
] satisfies readonly ChapterArticle[];
