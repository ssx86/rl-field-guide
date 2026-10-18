import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;

export const PART_FIVE_ARTICLES = [
  {
    slug: "mcts-alphazero",
    title: "Let a search check a few futures before the next move",
    deck: "A game may have clear rules and far too many possible futures. Search spends extra time on the current choice. A learned network helps it decide which futures deserve that time.",
    openingQuestion: "A chess program cannot inspect every possible game. Which moves should it examine first?",
    bridge: "Learning after the trip ended is safe but slow. What if the agent could plan before acting? Exact game rules offer another choice. Before moving, the agent can try possible moves inside the rules. It can spend more thought on useful branches and ignore most others.", // Marcus P0 fix: repair corrupted sentence "plan dened." -> "plan before acting?"
    situation: {
      title: "The rules fit on a page, but the future does not",
      paragraphs: [
        "In chess or Go, the program knows every legal move and exactly how each move changes the board — the rules fit on a page. The future does not: the number of possible move sequences grows so quickly that checking all of them would take far longer than the game deserves. Monte Carlo Tree Search, or MCTS, grows only a small tree of possible futures instead. It chooses a branch, adds one new position, estimates that position, and sends the result back up; repeating those four jobs makes the useful part of the tree larger.",
        "AlphaZero adds a learned network to this loop. The network suggests moves and estimates new positions, so search does not begin from nothing; search then checks those suggestions against simulated futures and produces better targets; self-play uses the search results to train the network again. Each side sharpens the other, which raises the question this chapter keeps in view: what exactly does the network contribute, what does the tree contribute, and where can each still be wrong?",
      ],
    },
    diagram: {
      title: "One search repeats four simple jobs",
      caption: "The network offers a starting guess. The tree collects local evidence for the current board position.",
      items: [
        { label: "Choose", value: "Q + search bonus", note: "Follow a branch that looks good or still lacks evidence." },
        { label: "Add", value: "one legal next position", note: "Use the exact game rules to grow the tree by one node." },
        { label: "Estimate", value: "move suggestions and value", note: "Ask the network how the new position may turn out." },
        { label: "Send back", value: "update N, W, and Q", note: "Let every edge on the chosen path learn from that estimate." },
      ],
    },
    workedExample: {
      title: "Why search checks B even though A looks better",
      setup: "A node has 25 total visits. Action A has mean value Q=0.6, network weight P=0.5, and 9 visits. B has Q=0.4, P=0.5, and 1 visit. Use bonus cP√N/(1+n) with c=1.",
      prediction: "A has the better current value. B has much less evidence. Which one gets the larger total search score?",
      steps: [
        { label: "Find A's bonus", calculation: "0.5×5/(1+9)=0.25", explanation: "The square root of 25 is 5. Nine earlier visits make A's extra search bonus small." },
        { label: "Score A", calculation: "0.6+0.25=0.85", explanation: "A keeps its value estimate of 0.6 and receives a bonus of 0.25." },
        { label: "Find B's bonus", calculation: "0.5×5/(1+1)=1.25", explanation: "B has only one visit. Its bonus is therefore much larger." },
        { label: "Score B", calculation: "0.4+1.25=1.65", explanation: "B wins this comparison. Search checks it next because the branch still lacks evidence." },
      ],
      result: "B scores 1.65, while A scores 0.85. Search does not claim that B is already the better game move. It spends the next piece of computation on B to learn more.",
    },
    mechanism: {
      introduction: "The network and the tree do different jobs. Keeping those jobs separate makes AlphaZero easier to understand.",
      sections: [
        { title: "How a search spends its attention", paragraphs: [
          "Each edge in the tree keeps three numbers: N counts visits, W adds the returned results, and Q is their average — local evidence assembled for this one decision, discarded or rebuilt when the position changes. A two-player game adds a twist of perspective: a good result for one player is bad for the other, so the program must flip the value at the right places while sending it back up. These numbers belong to the current search; a larger budget can rewrite them.",
          "The learned suggestion decides where that attention begins. The network gives each legal move a prior probability P, so moves it likes receive early visits — and the selection rule, called Predictor plus Upper Confidence Bounds applied to Trees, or PUCT, adds a bonus that shrinks as an edge gathers visits. The worked example above showed the balance in action: move B scored higher than the better-looking move A purely because B still lacked evidence. The search can still reject the network's favorite once simulations return worse numbers.",
          "The value estimate is what makes a fixed budget stretch across the tree. A new leaf may sit hundreds of moves from any final result, and the value head estimates that result without playing the branch to the end, so each simulation covers new ground instead of finishing old games. Treat the estimate as a prior, not an oracle: search can repair a small error when other branches supply better evidence, but a repeated bias guides the whole search confidently in the wrong direction.",
        ] },
        { title: "How search and network improve each other", paragraphs: [
          "After many simulations, the root's visit counts form a move distribution — a distillation of everything the search learned about this position. AlphaZero trains its policy output toward that distribution and its value output toward the final self-play result, so the network is always chasing a slightly stronger teacher: its own searching self. The updated network then guides later games, and the loop tightens. Root noise keeps self-play from repeating only familiar openings, since some exploration must survive to feed the search new positions.",
          "A loop that trains on itself needs external referees. Beating your latest self can hide a cycle — version A beats B, B beats C, C beats A — while each step looks like progress. Tests against fixed opponents and against older checkpoints give the loop something solid to lean on. Keep this caution in your pocket; it returns in the next part when the rules being searched are themselves learned from data, and the referee problem becomes harder.",
        ] },
      ],
    },
    equations: [
      { latex: "a=\\arg\\max_a\\left[Q(s,a)+c_{puct}P(s,a)\\frac{\\sqrt{\\sum_bN(s,b)}}{1+N(s,a)}\\right]", read: "Choose the action with the largest Q value plus a bonus for a promising branch that has received fewer visits.", meaning: "P is the network's first suggestion. N records search effort. The constant controls how strongly the search checks branches that still lack evidence." },
      { latex: "L=(z-v)^2-\\boldsymbol{\\pi}^{\\top}\\log\\mathbf{p}+c\\|\\theta\\|^2", read: "Training pulls the value v toward the game result z and the policy p toward the search visit distribution pi.", meaning: "The network learns from the improved search distribution, not only from the move that was played. The last term discourages unnecessarily large parameters." },
    ],
    boundary: {
      title: "Search is only as real as the rules it uses",
      paragraphs: [
        "Board games provide a cheap and exact simulator. A robot cannot safely try millions of futures in the physical world. If its simulator is wrong, more search explores the wrong world more carefully.",
        "Search also costs time and hardware at every move. A fair comparison must report simulations, delay, and inference compute. A network with one quick pass and a network with a thousand searches are different deployed systems.",
      ],
    },
    nextBridge: "AlphaZero can trust the game rules. A robot often has to learn its rules from experience. The next chapter asks how far an agent should trust an imperfect learned model.",
    sources: [{ label: "Silver et al. — Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm", url: "https://arxiv.org/abs/1712.01815", kind: "paper" }, { label: "DeepMind — AlphaZero and MuZero", url: "https://deepmind.google/research/alphazero-and-muzero/", kind: "official documentation" }, SB],
  },
  {
    slug: "dyna-mpc",
    title: "A learned model can help the agent think, but it can also lie",
    deck: "A model lets the agent try actions in imagination. Short imagined trips can save real experience. Long ones may turn a tiny prediction error into a completely false future.",
    openingQuestion: "If a robot's model is slightly wrong at every step, how many imagined steps should it trust?",
    bridge: "Chess has exact rules. A robot has only an approximate model learned from past data. The agent must now solve two problems. It must learn what actions do, and it must decide how much planning that learned model can safely support.",
    situation: {
      title: "A car that misses a little on each step can miss the whole road",
      paragraphs: [
        "Suppose a model predicts where a car will be after one steering action. A small direction error barely matters after one step — but reuse that wrong direction twenty times, and the imagined car has left the road entirely. Model Predictive Control, or MPC, limits the damage: plan several steps, perform only the first action, read the real sensors, and plan again. Each new observation replaces an imagined state with a real one, so error never accumulates without correction — at the price of constant replanning.",
        "Other methods use imagination for training rather than deciding. Dyna adds model-made transitions to ordinary learning, so one real experience becomes several practice updates. Model-Based Policy Optimization, or MBPO, begins short imagined trips from real stored states, buying cheap practice while keeping the repeated-model-error bill small. Both gain data efficiency; both now learn from futures the model invented. The question underneath every choice is the same — how far into imagination should the agent be allowed to run?",
      ],
    },
    diagram: {
      title: "Learning a model and using a model are two choices",
      caption: "The same prediction model can plan the next action or create practice data. Those uses fail in different ways.",
      items: [
        { label: "Learn", value: "(state, action) → next result", note: "Fit possible next states and rewards from real transitions." },
        { label: "Plan", value: "MPC or several models", note: "Compare short action sequences before taking one real action." },
        { label: "Practice", value: "Dyna or MBPO", note: "Create extra transitions for a value or policy learner." },
        { label: "Check", value: "error by place and distance", note: "Measure where the model fails and how error grows with more steps." },
      ],
    },
    workedExample: {
      title: "Watch a small step error grow across twenty imagined steps",
      setup: "For one simple illustration, say each imagined step keeps 95% of a fidelity score. Compare the score after one, five, and twenty steps.",
      prediction: "One step still looks strong. Which tested distance falls below one half?",
      steps: [
        { label: "One step", calculation: "0.95¹=0.95", explanation: "A one-step check gives a high score of 0.95." },
        { label: "Five steps", calculation: "0.95⁵≈0.774", explanation: "Repeating the loss five times leaves about 0.774." },
        { label: "Twenty steps", calculation: "0.95²⁰≈0.358", explanation: "Twenty repeats leave about 0.358. This is below one half." },
        { label: "Return to reality", calculation: "plan H steps, execute 1, observe, repeat", explanation: "MPC keeps replacing the next imagined starting point with a real observation." },
      ],
      result: "This multiplication is an illustration, not a universal law for model error. It shows why imagined distance matters. A good one-step score does not promise a good twenty-step plan.",
    },
    mechanism: {
      introduction: "A useful model must be judged by the decisions it supports. One average prediction score cannot answer that question alone.",
      sections: [
        { title: "Practice from imagination: Dyna and MBPO", paragraphs: [
          "Watch one real experience travel through Dyna. The transition updates both the model and the learner as usual; then Dyna asks the model for additional transitions and applies the same learning update to those as well, so the agent extracts more learning between costly real actions. The extra transitions are not new real evidence — they are the model's beliefs replayed back at you. If the model is wrong in one region, many imagined updates repeat the same error with total confidence, which is why the amount and starting places of imagined practice belong in your experiment log.",
          "MBPO turns that caution into a design rule. Its imagined trips start from states drawn from real stored experience, and each trip runs only a short continuation before a model-free learner trains on the mix of real and imagined transitions. The trade is explicit: shorter trips carry less repeated model error, while longer trips create more cheap data — and the best length shifts as the model improves and the agent's visited states change. Nothing here fixes a bad model; it merely prices how far you lean on it.",
        ] },
        { title: "Planning with feedback, and knowing where knowledge is weak", paragraphs: [
          "MPC is the discipline of never trusting imagination for long. It compares action sequences over a limited distance — sampling many and improving the promising ones, with the Cross-Entropy Method, or CEM, as one common recipe — then performs only the first action, measures the real result, and solves the problem again. That feedback loop is what keeps a slightly wrong model usable: the error has one step to mislead you, not twenty. The bill arrives at deployment, where the repeated planning costs real time on every single action.",
          "Probabilistic Ensembles with Trajectory Sampling, or PETS, trains several prediction models and reads their disagreement as a map of ignorance: where the models agree, planning proceeds boldly; where they diverge, the agent learns its data may be weak there. Do not mistake agreement for proof. All the models may share the same missing data or the same wrong assumption, and their confident common answer can still be wrong — especially outside the experience used for training. Ensembles warn; they do not certify.",
        ] },
      ],
    },
    equations: [
      { latex: "a_{t:t+H-1}^*=\\arg\\max_{a_{t:t+H-1}}\\mathbb{E}_{\\hat p}\\left[\\sum_{k=0}^{H-1}\\gamma^k\\hat r_{t+k+1}\\right]", read: "MPC chooses the action sequence with the largest predicted reward total over the next H steps.", meaning: "The hat marks a learned model rather than known rules. Usually only the first action is performed before the agent observes reality and plans again." },
      { latex: "D_{train}=D_{real}\\cup D_{model}", read: "The training collection contains real transitions and transitions made by the model.", meaning: "A model can create many samples, but they repeat what that model believes. Reports must keep real and imagined amounts separate." },
    ],
    boundary: {
      title: "A planner searches hardest where the model may be weakest",
      paragraphs: [
        "An average test set mostly contains ordinary actions. A planner hunts for unusually high predicted reward. It may find a strange action sequence that wins only because the model is wrong there.",
        "Important plans should be checked in reality, a trusted simulator, or a safe test. When real experience is cheap and prediction is hard, a model-free method may be simpler and more reliable.",
      ],
    },
    nextBridge: "A camera model may waste effort predicting every shadow and wall texture. The next chapter asks whether an agent can keep only the hidden information needed for choices and rewards.",
    sources: [SB, { label: "Chua et al. — Deep Reinforcement Learning in a Handful of Trials using Probabilistic Dynamics Models", url: "https://proceedings.neurips.cc/paper/2018/hash/3de568f8597b94bda53149c7d7f5958c-Abstract.html", kind: "paper" }, { label: "Janner et al. — When to Trust Your Model: Model-Based Policy Optimization", url: "https://proceedings.neurips.cc/paper/2019/hash/5faf461eff3099671ad63c6f3f094f7f-Abstract.html", kind: "paper" }],
  },
  {
    slug: "latent-world-models",
    title: "A useful world model does not need to redraw every pixel",
    deck: "Some picture details do not change the next good action. A latent model keeps a compact inner state instead. Dreamer learns behavior in imagined states, while MuZero uses them for search.",
    openingQuestion: "Must a warehouse robot predict every shadow, or only the facts that change where it should drive?",
    bridge: "Imagining full future trajectories is expensive. A full camera image can waste effort on wall color, flickering light, and other details that do not affect control. The agent can instead build a smaller internal description of the useful parts.",
    situation: {
      title: "The robot needs the shelf edge, not a perfect picture of the wall",
      paragraphs: [
        "A warehouse camera sees shelves, floor marks, shadows, and dust; the robot must preserve shelf position, speed, and hazards, but it hardly needs the exact color of every pixel. A compact internal description is called a latent state, and it is the same compression idea you used in Part 3 with features — except now the useful clues are learned instead of hand-drawn. Dreamer learns how latent states change after actions and trains an actor and critic on short imagined trips; its model also predicts rewards and whether a trip continues.",
        "MuZero learns a different model for a different purpose. It turns observation history into a hidden state and, from there, predicts the next hidden state, reward, policy, and value — everything AlphaZero's search needs, and not one pixel more. Where Dreamer's world supports acting by imagining, MuZero's world supports thinking by searching. Both raise the same quiet question, which this chapter takes seriously: if the model only keeps what its training asked for, what happens to the facts nobody asked about?",
      ],
    },
    diagram: {
      title: "Three jobs build a hidden world for decisions",
      caption: "One part reads reality, one moves the hidden state forward, and one turns that state into guidance for a decision.",
      items: [
        { label: "Represent", value: "history → hidden state", note: "Compress recent real observations into a useful internal description." },
        { label: "Move", value: "state + action → next state", note: "Imagine how an action changes that description." },
        { label: "Predict", value: "reward, policy, and value", note: "Read information that training or search needs." },
        { label: "Check", value: "compare with real experience", note: "Test whether the hidden future still leads to correct real decisions." },
      ],
    },
    workedExample: {
      title: "Search can continue without drawing another image",
      setup: "A MuZero-style model reads history h and considers action a. It makes hidden state s0. Its dynamics predicts reward 2 and hidden state s1. The value at s1 is 5, and gamma is 0.9.",
      prediction: "Which part reads the real observation? Then what one-step value does search send back?",
      steps: [
        { label: "Read the history", calculation: "s0=hθ(history)", explanation: "The representation function reads the real observation history and creates s0." },
        { label: "Move inside the model", calculation: "(r1=2,s1)=gθ(s0,a)", explanation: "The dynamics function predicts reward 2 and the next hidden state. It does not draw a new image." },
        { label: "Estimate what follows", calculation: "v1=fθ(s1)=5", explanation: "The prediction function gives value 5. It can also suggest actions for search." },
        { label: "Send one result back", calculation: "2+0.9×5=6.5", explanation: "Search adds the reward now to the discounted value later. The result is 6.5." },
      ],
      result: "Only the representation function had to read real observations in this example. The later search stayed in hidden states. Its one-step backup was 6.5.",
    },
    mechanism: {
      introduction: "Compression helps only when the hidden state keeps every fact needed for later choices. Dreamer and MuZero test that idea in different ways.",
      sections: [
        { title: "Dreamer's memory and its imagination", paragraphs: [
          "Dreamer's Recurrent State-Space Model, or RSSM, has two parts that answer two needs. A repeating memory carries information from the past, and a random latent variable represents uncertainty about what the current hidden situation may be. During training, a posterior state may use the new real observation, but a prior state must predict without it; a matching penalty teaches the prior to make a useful guess before the future arrives. This is the belief-state idea from Part 4 rebuilt in learned form.",
          "The actor then practises inside this learned world. Dreamer starts imagination from hidden states built on real data, rolls the model forward, and trains the actor and critic with predicted rewards and values — no new environment action is spent on those updates. A longer dream is cheaper than a longer real trip, but it trusts the model for more steps, and the actor may learn to exploit an error in the imagined physics. Real-data starts and limited imagined distance are the guardrails that keep training grounded.",
        ] },
        { title: "MuZero's economy, and what search does to a bad model", paragraphs: [
          "MuZero separates representation, dynamics, and prediction functions, and training asks them only to match rewards, values, and search policies across several steps — never to resemble a human-readable physical state. Two pictures may share one hidden state when they support the same future decisions, which saves capacity. The economy has a blind spot built in: missing information is hard to notice when no current target asks for it. Compression is only harmless while the questions you train on cover the facts you will later need.",
          "Search cuts both ways on top of such a model. Monte Carlo Tree Search compares many hidden futures, and extra branches can correct the network's first action suggestion — genuinely useful when the hidden dynamics stay accurate across those branches. But search also spends its effort on futures with high predicted reward, so a systematic model error becomes more attractive the longer you search, not less. Chosen plans must therefore be checked against held-out real experience; the boundary section below makes that requirement concrete for safety-critical facts.",
        ] },
      ],
    },
    equations: [
      { latex: "s_t\\sim q_\\phi(s_t\\mid s_{t-1},a_{t-1},o_t),\\qquad \\hat s_t\\sim p_\\theta(s_t\\mid s_{t-1},a_{t-1})", read: "The posterior state uses the new observation, while the prior state predicts without seeing that new observation.", meaning: "Training teaches the prior to approach the informed posterior. Future imagination must use the prior because the real future observation has not arrived." },
      { latex: "(r_{k+1},s_{k+1})=g_\\theta(s_k,a_k),\\qquad (p_k,v_k)=f_\\theta(s_k)", read: "MuZero's dynamics predicts the next reward and hidden state. Its prediction function gives a policy and a value.", meaning: "Neither function must reconstruct the next picture. They must remain useful over repeated hidden steps that search actually uses." },
    ],
    boundary: {
      title: "Compression can quietly remove a rare fact that later saves the robot",
      paragraphs: [
        "A rare warning light may have little effect on average reward during training. The hidden state may learn to ignore it. A later safety rule can then fail because the needed fact was never preserved.",
        "A smooth imagined trip is not proof of a correct one. Tests should probe safety facts, unusual actions, and different search depths. Important plans still need comparison with real outcomes.",
      ],
    },
    nextBridge: "These models still learn from interaction and can invent extra practice. The next part removes that freedom. The agent receives an existing dataset and must avoid actions that the dataset cannot support.",
    sources: [{ label: "Hafner et al. — Dream to Control: Learning Behaviors by Latent Imagination", url: "https://arxiv.org/abs/1912.01603", kind: "paper" }, { label: "Schrittwieser et al. — Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model", url: "https://www.nature.com/articles/s41586-020-03051-4", kind: "paper" }, { label: "DeepMind — AlphaZero and MuZero", url: "https://deepmind.google/research/alphazero-and-muzero/", kind: "official documentation" }],
  },
] satisfies readonly ChapterArticle[];
