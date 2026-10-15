import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;
const SPINNING_UP = { label: "OpenAI Spinning Up — Deep RL algorithms", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html", kind: "official documentation" } as const;

export const PART_THREE_ARTICLES = [
  {
    slug: "linear-approximation",
    title: "When the table becomes too large, let similar situations learn together",
    deck: "A table keeps a separate answer for every situation. A simple shared formula can let one experience help many similar situations.",
    openingQuestion: "If a controller learns something at 80.0°C, should it really start from zero again at 79.9°C?",
    bridge: "A table worked while the number of situations was small. Real measurements can take almost any value, so the same situation may never appear twice. We need a rule for deciding which situations are similar enough to share experience. Using one formula instead of a huge table is called function approximation. We begin with a linear function because we can still see exactly how each input changes the answer.",
    situation: {
      title: "Do not give every decimal its own empty notebook",
      paragraphs: ["Imagine an air conditioner that has learned how to react at 80.0°C. A moment later the sensor reads 79.9°C. A literal table sees a new number and opens a new, empty box. That throws away a useful connection." ,"Instead, we can describe the situation with a few useful clues. Is the room hot? Is the temperature rising? Is the building busy? These clues are called features. Situations that share a feature also share the number attached to it." ,"The prediction is made by multiplying each feature by a learned importance number, then adding the results. The result is a linear value estimate. This method is called linear function approximation. Linear does not mean the world is simple. It means the final addition follows a simple, visible rule."],
    },
    diagram: {
      title: "One lesson travels through every active clue", caption: "The feature design decides where an experience can travel. The learning update decides how far it moves.",
      items: [
        { label: "Situation", value: "s=(80°, rising)", note: "The room is hot, and it is getting hotter." },
        { label: "Clues", value: "x(s)=[1,0.8,1,…]", note: "These numbers describe the useful parts of the situation." },
        { label: "Estimate", value: "v̂=wᵀx", note: "Each clue adds its share to the final estimate." },
        { label: "Lesson", value: "w←w+αδx", note: "Every situation using the same clues changes too." },
      ],
    },
    workedExample: {
      title: "Follow one lesson through two features",
      setup: "A situation has features x=[1,0.5] and importance numbers w=[2,4]. The reward is 1. The discount factor gamma is 0.9, the next estimate is 6, and the learning rate alpha is 0.1.",
      prediction: "Before calculating, ask two questions. Is the new target above the old estimate? Which feature is more active?",
      steps: [
        { label: "Old estimate", calculation: "v̂=2×1+4×0.5=4", explanation: "The first feature adds 2. The second also adds 2, because 4 multiplied by 0.5 is 2." },
        { label: "New target", calculation: "y=1+0.9×6=6.4", explanation: "We add the reward now to most of the next estimate. This gives a target of 6.4." },
        { label: "Difference", calculation: "δ=6.4−4=2.4", explanation: "The target is 2.4 higher than the old estimate. Temporal-Difference error, or TD error, is the name for this gap." },
        { label: "Share the lesson", calculation: "w′=[2,4]+0.1×2.4×[1,0.5]=[2.24,4.12]", explanation: "The first feature was fully active, so it changes by 0.24. The half-active feature changes by 0.12." },
      ],
      result: "The current situation now gets a higher estimate. So does every other situation that uses either changed feature. Sharing saves experience, but a bad lesson can spread too.",
    },
    mechanism: {
      introduction: "This simple model gives us four separate questions: what clues we kept, which situations supplied data, how we built the target, and how large an update we allowed.",
      sections: [
        { title: "The features decide what the model can notice", paragraphs: ["Suppose wet and dry floors require different actions. If the feature list never records whether the floor is wet, no amount of training can recover that missing difference. The model can only learn with the clues it receives. Choosing and scaling features is therefore part of the method, not a small cleanup step."] },
        { title: "A stable answer can still be an imperfect answer", paragraphs: ["Several different situations may have to share the same features. The model then finds the best compromise it can express. Frequently visited situations influence that compromise more than rare ones. So weights that have stopped moving do not prove that every estimate is correct."] },
        { title: "For one update, we temporarily hold the target still", paragraphs: ["The next-state estimate in the target also comes from learned weights. In the common update, we treat that target as fixed for this one small step and change only the current prediction. This choice is called a semi-gradient. The word describes where the update is allowed to flow; it does not mean someone carelessly computed half a derivative."] },
        { title: "Old data may give the wrong situations too much influence", paragraphs: ["Data from another behavior may visit some situations too often and miss others completely. Weighting methods can reduce some mismatch, but they cannot create evidence for an action that was never tried. Shared weights can then spread errors beyond the states where they began."] },
      ],
    },
    equations: [
      { latex: "\\hat v(s,\\mathbf{w})=\\mathbf{w}^{\\top}\\mathbf{x}(s)", read: "Multiply each feature by its learned weight, then add the results to estimate the value of state s.", meaning: "The final rule is linear in the weights. The features themselves may still describe curved ranges, groups, or interactions." },
      { latex: "\\mathbf{w}_{t+1}=\\mathbf{w}_t+\\alpha\\left[R_{t+1}+\\gamma\\hat v(S_{t+1},\\mathbf{w}_t)-\\hat v(S_t,\\mathbf{w}_t)\\right]\\mathbf{x}(S_t)", read: "Take the prediction gap, make it smaller with the learning rate, and give each feature a share based on how active it was.", meaning: "Because many situations reuse the same weights, one update changes all of them. That is both the source of useful sharing and the path by which errors spread." },
    ],
    boundary: {
      title: "Readable weights do not prove that we chose the right clues", paragraphs: ["We may understand every weight and still have grouped together two situations that need opposite actions. A useful check is to search for pairs that look similar to the model but should lead to different decisions." ,"Adding more features is not a free cure. It can rebuild the giant table we were trying to avoid, or make unrelated situations move together. Linear approximation is a clear first way to share experience, not a promise that every task fits a straight line."],
    },
    nextBridge: "So far, a person still has to choose the useful clues. That is hard when the input is a camera image or sound. A neural network can learn its own features, but then even the rule for deciding which situations are similar starts moving during training.",
    sources: [SB, { label: "Sutton et al. — Gradient Descent for General Reinforcement Learning", url: "https://proceedings.mlr.press/v9/sutton10a.html", kind: "paper" }],
  },
  {
    slug: "neural-approximation",
    title: "What changes when the model learns its own features",
    deck: "A neural network can discover useful clues in raw images and sounds. The hard part is that its answers also change what data it will see next.",
    openingQuestion: "What if the student changes both tomorrow's questions and tomorrow's answer key?",
    bridge: "The previous chapter used features chosen by a person. A camera image contains too many details for us to list every useful feature by hand. A neural network can learn those features. This is called neural function approximation. It makes the model much more powerful. It also creates a new problem: changing the network can change its predictions, its actions, its future data, and even some future targets.",
    situation: {
      title: "A warehouse robot helps create its own homework",
      paragraphs: ["A robot sees camera images instead of a neat label saying where it is. A neural network can learn that certain edges look like shelves and certain shapes look like obstacles. This learned internal description is called a representation." ,"Now follow the loop. The network suggests an action. The action sends the robot down one corridor instead of another. That choice decides which images become new training examples. After the network changes, the robot may visit a different corridor and collect a different dataset." ,"Some learning targets also use the network's own estimate of what happens next. The model is therefore helping to write both the questions and the answer key. This is why a familiar-looking loss can behave very differently in reinforcement learning."],
    },
    diagram: {
      title: "One update can move three things", caption: "The network changes its answer, its behavior, and the data that behavior will collect next.",
      items: [
        { label: "Act", value: "policy θ → a route", note: "The current network chooses where the robot goes." },
        { label: "Collect", value: "route → new images", note: "That route decides what training examples appear." },
        { label: "Learn", value: "θ←θ−α∇L", note: "A batch of examples changes many shared parameters." },
        { label: "Repeat", value: "new θ → new route", note: "The next dataset may now be different." },
      ],
    },
    workedExample: {
      title: "First, watch one ordinary learning step",
      setup: "A tiny predictor uses v̂=wx. The input x is 2, the weight w is 1, and the target y is 5. The loss is L=½(y−v̂)², and the learning rate alpha is 0.1.",
      prediction: "The prediction is too low. Should the weight rise or fall? Notice that this example still has a fixed input and a fixed target.",
      steps: [
        { label: "Make a prediction", calculation: "v̂=1×2=2", explanation: "The model says 2, while the target says 5. The answer is 3 too low." },
        { label: "Measure the miss", calculation: "L=½(5−2)²=4.5", explanation: "The loss turns the size of the miss into one number. Smaller is better." },
        { label: "Find a direction", calculation: "∂L/∂w=(v̂−y)x=(2−5)×2=−6", explanation: "The negative gradient says that increasing the weight will reduce this loss." },
        { label: "Take a small step", calculation: "w′=1−0.1×(−6)=1.6", explanation: "The new weight is 1.6, so the new prediction is 3.2. It moved toward 5 without jumping there." },
      ],
      result: "This inner step is ordinary learning. The special difficulty begins after we reconnect it to the environment, because the next inputs and targets may change when the policy changes.",
    },
    mechanism: {
      introduction: "Deep reinforcement learning, or deep RL, is easier to understand when we separate four moving parts instead of calling everything a neural-network problem.",
      sections: [
        { title: "One example can change many answers", paragraphs: ["The same hidden features are reused for many states and actions. A useful lesson can therefore spread quickly. But an update for one corridor can also damage a prediction for another corridor. Testing the network on a fixed set of probe situations helps reveal this kind of interference."] },
        { title: "The answer key may be noisy or moving", paragraphs: ["A return changes from one trip to another. A target built from a later network prediction can carry that prediction's error. Larger batches can smooth some random variation, but they cannot make a wrong or shifting target correct."] },
        { title: "Small training choices change how far every step moves", paragraphs: ["Reward scale, input scale, learning rate, the optimizer, and gradient clipping all change the size of an update. Two experiments can show the same loss formula and still behave very differently. Reports must include these settings and how often the same data was reused."] },
        { title: "Training score and tested behavior are not the same thing", paragraphs: ["Training includes exploration and a policy that is still changing. A clearer check pauses learning and runs a fixed evaluation policy in separate episodes. Repeating that check with several random seeds gives stronger evidence, though it still cannot cover every real-world condition." ] },
      ],
    },
    equations: [
      { latex: "\\theta \\leftarrow \\theta-\\alpha\\nabla_{\\theta}\\frac{1}{B}\\sum_{i=1}^{B}\\ell(f_{\\theta}(x_i),y_i)", read: "Average the mistakes in a batch, find which direction reduces them, and move the network parameters a small distance that way.", meaning: "The calculation looks like supervised learning. In reinforcement learning, however, the policy and network may have helped produce both the examples and the targets." },
      { latex: "\\text{update-to-data ratio}=\\frac{\\text{gradient steps}\\times\\text{batch size}}{\\text{environment transitions collected}}", read: "This ratio compares how many training examples we reuse with how many new environment steps we collect.", meaning: "A high ratio saves environment interaction, but it can make the network study old or mistaken targets too many times. Data cost and computing cost are different things." },
    ],
    boundary: {
      title: "A smaller loss can sit beside a worse policy", paragraphs: ["The network can become better at matching old targets while the new policy walks into situations those targets barely covered. We must test what the agent actually does, not guess from the loss alone." ,"A more powerful network can also become better at exploiting a bad reward or a simulator bug. More capacity does not repair a missing observation, weak exploration, or a mistaken goal."],
    },
    nextBridge: "We can now study one concrete repair. A Deep Q-Network, or DQN, stores past experience and trains from a mixture of old examples. It also keeps a slower copy of the network to stop the target from moving after every tiny update.",
    sources: [SB, SPINNING_UP],
  },
  {
    slug: "dqn",
    title: "Give deep Q-learning a memory and a slower answer key",
    deck: "A Deep Q-Network mixes old experiences instead of studying only the latest moment. It also uses a slower network to write targets that stay still for a while.",
    openingQuestion: "Why does learning from every new game frame immediately make the network chase its own moving answer?",
    bridge: "The last chapter found two separate problems. Neighboring frames look almost the same, so many updates repeat nearly identical evidence. The network's next-state estimate also helps form the target, so changing the network can move both the answer and the answer key. A Deep Q-Network, or DQN, adds one tool for each problem: a memory of past transitions and a slower copy of the network.",
    situation: {
      title: "Do not study only the last second of the game",
      paragraphs: ["Imagine learning a game from screenshots. Frame 101 looks almost the same as frame 100. If the network updates after each frame in order, the same short scene pushes it again and again. It may forget other parts of the game." ,"DQN stores each transition in a replay buffer, which is simply a memory. Training draws a mixed batch from that memory. Old and new moments can now appear together, and one expensive experience can be studied more than once." ,"DQN also keeps a target network, which is a slower copy of the learning network. This copy writes the next-state part of the target for a while before it is updated. The learner now has a temporarily steadier answer key."],
    },
    diagram: {
      title: "One DQN update uses two networks and one memory", caption: "The online network learns quickly. The target network moves slowly. The replay buffer supplies mixed past experience.",
      items: [
        { label: "Experience", value: "(s,a,r,s′,done)", note: "Record what happened, including how the episode stopped." },
        { label: "Memory", value: "sample a mixed batch", note: "Study moments from different parts of the game together." },
        { label: "Answer key", value: "r+γmax Qθ⁻(s′,a′)", note: "Use the slower network for the next-state estimate." },
        { label: "Learning", value: "fit Qθ(s,a) to y", note: "Move the online network toward that target." },
      ],
    },
    workedExample: {
      title: "A true ending and a time limit are not the same",
      setup: "Two stored experiences both have reward 2. The discount factor gamma is 0.9, and the target network's best next estimate is 6. Experience A continues. Experience B reaches a real ending.",
      prediction: "Which experience still has a future worth 6? A recording that stops because of a time limit may look finished, but the task itself may still have a future.",
      steps: [
        { label: "The task continues", calculation: "yA=2+0.9×6=7.4", explanation: "Experience A gets the reward now and still keeps the discounted estimate of what may come next." },
        { label: "The task truly ends", calculation: "yB=2", explanation: "Experience B has no future reward after this point. We keep the reward 2 and remove the next estimate." },
        { label: "Compare with the online answer", calculation: "if Qθ=4, yA−Qθ=3.4", explanation: "If the online network said 4, it is 3.4 below the target. Learning moves the recorded action's estimate upward." },
        { label: "Only the clock stopped", calculation: "y=2+0.9×6", explanation: "A time limit may stop our recording without ending the task. In that case, the future estimate normally stays." },
      ],
      result: "The two targets are 7.4 and 2 even though both records may be marked as stopped. The replay buffer must preserve whether the task ended or only the recording ended.",
    },
    mechanism: {
      introduction: "DQN becomes much easier to remember when each part has one clear job and one clear limit.",
      sections: [
        { title: "Replay rearranges experience; it does not create experience", paragraphs: ["Random replay breaks up long runs of nearly identical frames and lets one transition teach the network several times. But every stored transition still came from an older or newer behavior policy. A replay buffer full of narrow experience is still narrow experience."] },
        { title: "The target network slows the moving answer key", paragraphs: ["We can copy the online network into the target network every fixed number of steps, or move it gradually. Updating too often makes the target chase the learner again. Updating too slowly leaves an old answer key. The useful speed depends on the task and the rest of training."] },
        { title: "The largest predicted value is not the same as evidence", paragraphs: ["The maximum in the target only chooses among numbers the network already produced. It does not force the agent to try an unfamiliar action. Exploration still decides which consequences enter memory. Replay cannot invent a missing transition."] },
        { title: "A game score belongs to its testing rules", paragraphs: ["Frame skipping, sticky actions, how lives are handled, how long training lasts, and how exploration is turned down during evaluation can all change the score. A DQN result is evidence for one complete testing protocol, not proof that the agent understands every visual task."] },
      ],
    },
    equations: [
      { latex: "y=r+\\gamma(1-d)\\max_{a'}Q_{\\theta^-}(s',a')", read: "Start with the reward. If the task has not truly ended, add the discounted best next estimate from the slower target network.", meaning: "The symbol d is 1 only for a real ending, so it switches the future part off. A time-limit cut should usually be recorded separately." },
      { latex: "L(\\theta)=\\mathbb{E}_{(s,a,r,s')\\sim D}\\left[\\left(y-Q_{\\theta}(s,a)\\right)^2\\right]", read: "Draw experiences from replay memory D and measure how far the online network's answer is from each target.", meaning: "A small loss means the network matches the stored targets well. It does not prove that the memory covers the situations the new policy will visit." },
    ],
    boundary: {
      title: "A memory and a slow copy do not solve every problem", paragraphs: ["DQN can still give an unseen action a value that is far too high. It can forget rare but important experiences, or become unstable when rewards and updates are badly scaled. Its two tools make training more manageable; they are not a proof that learning must succeed." ,"DQN also needs a short list of actions so it can compare every action and take the maximum. A steering wheel has too many possible angles for that simple scan. Continuous-action tasks need a different way to choose actions."],
    },
    nextBridge: "Once this basic loop works, we can point to its remaining mistakes one by one. The next chapter asks a practical question: which later DQN extension repairs which specific failure, and what new cost does that repair introduce?",
    sources: [SB, { label: "Mnih et al. — Human-level control through deep reinforcement learning", url: "https://www.nature.com/articles/nature14236", kind: "paper" }],
  },
  {
    slug: "dqn-family",
    title: "See what each DQN extension repairs—and what Rainbow combines",
    deck: "The DQN family is not one escalating list of tricks. Each extension changes a different error source, representation, data priority, target horizon, or exploration mechanism.",
    openingQuestion: "If two DQN extensions improve the same score, how can we tell whether they solved the same problem?",
    bridge: "DQN defined a stable baseline with visible weaknesses. This chapter keeps each repair attached to its mechanism. Double DQN changes selection and evaluation; dueling networks change parameterization; prioritized replay changes sampling; multi-step targets change horizon; distributional RL changes the prediction object; noisy networks change exploration.",
    situation: {
      title: "One replay transition can be wrong for several unrelated reasons",
      paragraphs: ["A Q estimate may be too high because the maximum selected a positive noise error. A state may matter greatly even when actions matter little, yet a standard head relearns that state value for every action. A rare surprising transition may be sampled too infrequently. None of those problems is fixed merely by using a larger network." ,"Double DQN uses the online network to select the next action and the target network to evaluate it. A dueling head estimates a state value and relative action advantages, then combines them with an identifiability correction. Prioritized replay samples large-error transitions more often and uses importance weights to reduce the induced bias." ,"C51 and related distributional methods predict a return distribution rather than only its mean. Noisy networks learn parameter noise for state-dependent exploration. Rainbow combines several extensions, but their interactions are empirical; the combined name does not erase the assumptions of its parts."],
    },
    diagram: {
      title: "Map each extension to the object it changes", caption: "A method family becomes understandable when every component has a target failure and an observable side effect.",
      items: [
        { label: "Target bias", value: "Double DQN", note: "Separate action selection from value evaluation." },
        { label: "Representation", value: "Dueling", note: "Separate common state value from relative action advantages." },
        { label: "Evidence frequency", value: "Prioritized replay", note: "Sample surprising transitions more often and correct bias." },
        { label: "Prediction and exploration", value: "Distributional + noisy", note: "Model return distributions and learn structured parameter noise." },
      ],
    },
    workedExample: {
      title: "Expose maximization bias with two noisy actions",
      setup: "Both true next-action values are 5. The online network estimates A=6 and B=5.5; the target network estimates A=4.8 and B=5.1.",
      prediction: "Compare standard DQN's target value with Double DQN's selection-and-evaluation value.",
      steps: [
        { label: "Standard DQN", calculation: "max target Q = max(4.8,5.1)=5.1", explanation: "The target network both selects B and evaluates B in this simplified comparison." },
        { label: "Double selection", calculation: "argmax online Q = A", explanation: "The online network selects A because its noisy estimate is six." },
        { label: "Double evaluation", calculation: "target Q(A)=4.8", explanation: "The target network evaluates the independently selected action instead of maximizing its own noise." },
        { label: "Interpretation", calculation: "5.1 versus 4.8; true value 5", explanation: "One sample does not prove lower error, but decoupling removes the systematic same-noise maximization mechanism." },
      ],
      result: "Double DQN changes the estimator, not the behavior policy or replay coverage. It should not be credited with repairs belonging to other components.",
    },
    mechanism: {
      introduction: "Understanding extensions by mechanism makes ablations meaningful and prevents a benchmark bundle from becoming folklore.",
      sections: [
        { title: "Dueling decomposition needs aggregation", paragraphs: ["Writing Q=V+A is unidentifiable because a constant can move between V and A. Subtracting the mean or maximum advantage fixes a convention. The benefit is strongest where action choice matters less than recognizing a generally valuable state."] },
        { title: "Priorities alter the training distribution", paragraphs: ["TD-error priorities focus computation but can over-sample noise, outliers, or unlearnable transitions. Exponent alpha controls prioritization; beta anneals importance correction. New transitions need a priority rule so they are not ignored before one error is measured."] },
        { title: "Distributional value is more than a confidence interval", paragraphs: ["C51 projects a transformed return distribution onto fixed atoms and minimizes a distributional loss. Quantile methods represent learned quantiles. The mean can recover a standard action value, while the shape supports richer learning signals and later risk objectives."] },
        { title: "Rainbow is a tested combination, not a universal default", paragraphs: ["Rainbow originally joined Double DQN, dueling, prioritized replay, multi-step targets, distributional C51, and noisy nets. Reproduction depends on interactions, environment protocol, and compute. Component ablations remain necessary when transferring domains."] },
      ],
    },
    equations: [
      { latex: "y=r+\\gamma Q_{\\theta^-}\\left(s',\\arg\\max_{a'}Q_{\\theta}(s',a')\\right)", read: "Double DQN selects the next action with the online network and evaluates that selected action with the target network.", meaning: "Decoupling reduces the positive bias created when the same noisy estimates both choose and score a maximum. It does not guarantee underestimation never occurs." },
      { latex: "Q(s,a)=V(s)+A(s,a)-\\frac{1}{|\\mathcal{A}|}\\sum_{a'}A(s,a')", read: "A dueling network combines state value with an action advantage after subtracting the mean advantage across actions.", meaning: "The subtraction makes the decomposition identifiable while preserving relative action preferences. It changes network structure, not the Bellman target itself." },
    ],
    boundary: {
      title: "A larger bundle can hide which assumption failed", paragraphs: ["If Rainbow underperforms, the cause may be a priority distribution, atom support, target horizon, exploration scale, or interaction among them. Copying every component makes diagnosis harder in a new domain." ,"Distributional predictions learned under expected-return control do not automatically produce a risk-sensitive policy. Choosing actions by mean ignores tail shape; risk objectives require an explicit decision rule and evaluation protocol."],
    },
    nextBridge: "Value-based methods infer a policy by comparing action scores. Policy-gradient methods instead parameterize the action distribution and move its probabilities directly. REINFORCE gives the first unbiased score-function estimator and makes variance the central problem.",
    sources: [{ label: "Hessel et al. — Rainbow: Combining Improvements in Deep Reinforcement Learning", url: "https://ojs.aaai.org/index.php/AAAI/article/view/11796", kind: "paper" }, { label: "Bellemare, Dabney, and Munos — A Distributional Perspective on Reinforcement Learning", url: "https://proceedings.mlr.press/v70/bellemare17a.html", kind: "paper" }, SB],
  },
  {
    slug: "reinforce-policy-gradient",
    title: "Differentiate expected return with REINFORCE and policy gradients",
    deck: "Policy gradients change action probabilities directly. REINFORCE uses sampled returns to tell the log-probability of each sampled action which direction to move.",
    openingQuestion: "How can a discrete sampled action produce a gradient for the probability distribution that generated it?",
    bridge: "DQN learns action values and derives behavior from their maximum. A parameterized policy can instead output probabilities or continuous distributions directly. The policy-gradient theorem turns expected return into an expectation of log-probability gradients weighted by return or advantage, avoiding differentiation through the environment.",
    situation: {
      title: "A dialogue policy must preserve more than one plausible action",
      paragraphs: ["A negotiation agent may choose ask, concede, clarify, or end. A value method scores each discrete action; a stochastic policy assigns probabilities. Sampling produces one action, but its outcome can increase or decrease the probability of that action in similar states." ,"The log-derivative identity moves the gradient inside an expectation. REINFORCE multiplies the gradient of log πθ(Aₜ|Sₜ) by the sampled return. High-return actions become more likely; low-return actions become less likely. The environment dynamics need not be differentiable." ,"Full returns have high variance. Subtracting a baseline that does not depend on the sampled action preserves the expected gradient while centering the signal. A learned state value is a common baseline, making return minus value an advantage estimate. Entropy bonuses can discourage premature collapse but change the objective."],
    },
    diagram: {
      title: "A sampled trajectory becomes a probability update", caption: "The return supplies direction; the log-probability gradient connects that direction to the parameters that made the sampled action likely.",
      items: [
        { label: "Sample", value: "Aₜ~πθ(·|Sₜ)", note: "The policy creates a trajectory and its own training distribution." },
        { label: "Score", value: "Gₜ or Âₜ", note: "Outcome evidence says whether the action exceeded a baseline." },
        { label: "Attribute", value: "∇θ log πθ(Aₜ|Sₜ)", note: "The score function identifies how parameters affected action probability." },
        { label: "Update", value: "θ←θ+α score×gradient", note: "Positive evidence raises and negative evidence lowers sampled-action likelihood." },
      ],
    },
    workedExample: {
      title: "Move a two-action softmax after positive advantage",
      setup: "A policy chooses Left with probability 0.60 and Right with 0.40. Left is sampled and receives advantage +2. Consider a small ascent step.",
      prediction: "Should Left jump to probability one, rise slightly, or fall? What would a negative advantage do?",
      steps: [
        { label: "Direction", calculation: "Â=+2", explanation: "The sampled Left action performed better than the baseline, so its log probability should increase." },
        { label: "Softmax coupling", calculation: "raise Left logit relative to Right", explanation: "Probabilities remain normalized; increasing one action's relative logit reduces the other's probability." },
        { label: "Small update", calculation: "0.60→approximately 0.63", explanation: "The exact change depends on logits, gradient, and step size. Policy gradients do not set probability directly to the return." },
        { label: "Negative case", calculation: "Â<0 → reduce sampled-action log probability", explanation: "A below-baseline outcome reverses the direction while keeping alternative actions available." },
      ],
      result: "Advantage determines direction and magnitude of the sampled-action update. Step size and parameterization determine the actual probability change.",
    },
    mechanism: {
      introduction: "Policy gradients remove the discrete argmax bottleneck and introduce a new set of variance, trust, and credit-assignment questions.",
      sections: [
        { title: "The score-function estimator does not differentiate the environment", paragraphs: ["The identity ∇π=π∇logπ lets sampled log probabilities carry the gradient. Rewards and transitions can be black boxes. This flexibility comes with noisy trajectory estimates and sensitivity to reward scale."] },
        { title: "A baseline reduces variance without changing expectation", paragraphs: ["A state-dependent baseline can be subtracted because the expected policy score over actions is zero. If the baseline depends on the sampled action without correction, it can bias the gradient. A learned critic introduces approximation error but often greatly improves efficiency."] },
        { title: "Reward-to-go improves temporal credit", paragraphs: ["An action at time t cannot affect rewards that occurred before it. Using return from t onward removes irrelevant earlier rewards and reduces variance. It still assigns the same later outcome to every contributing action along the sampled path."] },
        { title: "Entropy is an objective term, not free exploration", paragraphs: ["Adding entropy rewards broader action distributions. Its coefficient controls a real tradeoff with task return. Excess entropy can prevent commitment; too little can collapse exploration. SAC later formalizes maximum-entropy control in an off-policy actor-critic setting."] },
      ],
    },
    equations: [
      { latex: "\\nabla_{\\theta}J(\\theta)=\\mathbb{E}_{\\pi_{\\theta}}\\left[\\sum_t\\nabla_{\\theta}\\log\\pi_{\\theta}(A_t\\mid S_t)\\,G_t\\right]", read: "The policy gradient is the expected sum of each sampled action's log-probability gradient multiplied by the later return.", meaning: "The estimator increases probability for trajectory decisions associated with high return. Its expectation is correct under the sampling policy, but individual estimates can have high variance." },
      { latex: "\\hat A_t=G_t-b(S_t)", read: "An advantage estimate subtracts a state-dependent baseline from the sampled return.", meaning: "The baseline centers outcomes relative to what was expected in that state. It reduces variance without changing the expected gradient when it is independent of the sampled action." },
    ],
    boundary: {
      title: "An unbiased gradient can still be impractical", paragraphs: ["REINFORCE may require many trajectories because return variance is large and updates are on-policy. Unbiasedness does not guarantee low error at a finite data budget or stable improvement after a large step." ,"Policy gradients optimize the encoded reward under the sampled distribution. They do not prevent reward hacking, unsafe exploration, or collapse outside training contexts. Constraints and evaluation remain separate layers."],
    },
    nextBridge: "REINFORCE waits for sampled returns and uses a baseline only to center them. Actor–critic methods train a critic to produce earlier, lower-variance advantage estimates, leading to A2C, asynchronous A3C, and generalized advantage estimation.",
    sources: [SB, { label: "Williams — Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning", url: "https://link.springer.com/article/10.1007/BF00992696", kind: "paper" }, SPINNING_UP],
  },
  {
    slug: "actor-critic-gae",
    title: "Join policy and value learning with actor–critic and GAE",
    deck: "An actor chooses actions while a critic estimates how those choices compare with expected outcomes. Their coupling reduces variance but gives each learner a moving partner.",
    openingQuestion: "Can a learned value estimate teach a policy before the full return arrives without making the policy inherit every critic error?",
    bridge: "REINFORCE uses complete reward-to-go and can be noisy. Actor–critic replaces part of that sampled future with a critic's value estimate. A2C batches synchronous experience, A3C updates asynchronously, and generalized advantage estimation blends multi-step TD errors to control the bias-variance tradeoff.",
    situation: {
      title: "A critic compares a move with what was normally expected",
      paragraphs: ["A navigation actor samples a turn. The critic predicts value 5 before the turn. The robot receives reward 1 and the next state's predicted value is 6 with gamma 0.9. The one-step target is 6.4, so the action produced a positive TD error of 1.4." ,"The actor can use that error as an advantage estimate: increase the sampled turn's probability because the transition was better than expected. The critic uses the same error to improve its value prediction. These are distinct losses sharing data and often a network trunk." ,"A2C collects parallel rollouts and applies a synchronous update. A3C lets workers update shared parameters asynchronously, producing decorrelation but stale gradients. GAE forms a discounted sum of TD residuals, with lambda controlling how far future residuals influence the present advantage."],
    },
    diagram: {
      title: "Actor and critic learn different objects from one rollout", caption: "The critic supplies a baseline and bootstrap; the actor uses advantage to change probabilities. Shared data does not make their objectives identical.",
      items: [
        { label: "Actor", value: "πθ(a|s)", note: "Samples behavior and receives a signed advantage direction." },
        { label: "Critic", value: "Vφ(s)", note: "Predicts expected return and constructs TD residuals." },
        { label: "Advantage", value: "r+γV(s′)−V(s)", note: "Measures one transition against the critic's expectation." },
        { label: "GAE", value: "δₜ+(γλ)δₜ₊₁+…", note: "Blends residuals across horizons." },
      ],
    },
    workedExample: {
      title: "Compute one actor and critic signal",
      setup: "V(Sₜ)=5, reward is 1, V(Sₜ₊₁)=6, gamma is 0.9, and the transition is nonterminal.",
      prediction: "Should the sampled action become more or less likely, and which value prediction should the critic raise?",
      steps: [
        { label: "Bootstrap target", calculation: "y=1+0.9×6=6.4", explanation: "The critic combines observed reward with estimated continuation." },
        { label: "TD residual", calculation: "δ=6.4−5=1.4", explanation: "The outcome was better than the critic expected from Sₜ." },
        { label: "Actor direction", calculation: "+1.4∇logπ(Aₜ|Sₜ)", explanation: "Positive advantage increases the sampled action's log probability for similar states." },
        { label: "Critic direction", calculation: "minimize ½(6.4−Vφ(Sₜ))²", explanation: "The critic raises its state value toward the target, using its own optimizer and coefficient." },
      ],
      result: "One residual supplies two learning signals, but critic error affects actor direction. Value loss, policy loss, and entropy should be monitored separately.",
    },
    mechanism: {
      introduction: "Actor–critic efficiency comes from controlled bootstrapping and repeated rollout use, not from merging policy and value into one undifferentiated loss.",
      sections: [
        { title: "The critic trades variance for approximation bias", paragraphs: ["A learned baseline can update before terminal outcomes and reduce variance. A poor critic can reverse or distort finite-sample advantages. Value clipping, normalization, separate learning rates, and explained variance are practical diagnostics rather than theoretical decorations."] },
        { title: "A2C and A3C differ in systems semantics", paragraphs: ["A2C waits for a batch of workers and updates synchronously. A3C workers act and update asynchronously, so gradients may be computed from older parameters. Both are advantage actor–critic families; asynchrony is not the definition of actor–critic itself."] },
        { title: "GAE mixes TD residuals", paragraphs: ["Lambda near zero emphasizes one-step critic estimates. Lambda near one includes longer sampled futures. Gamma lambda controls decay, so lambda cannot be interpreted without gamma and rollout truncation." ] },
        { title: "Shared encoders couple optimization", paragraphs: ["Policy, value, and entropy terms often share features. A large value-loss gradient can damage policy representations, while policy shift changes critic targets. Loss coefficients and gradient norms belong in reproducible evidence." ] },
      ],
    },
    equations: [
      { latex: "\\delta_t=R_{t+1}+\\gamma V_{\\phi}(S_{t+1})-V_{\\phi}(S_t)", read: "The one-step TD residual is observed reward plus discounted next value minus current value.", meaning: "It trains the critic and can estimate advantage for the actor. A positive residual says this transition was better than the critic predicted, not that the action is globally optimal." },
      { latex: "\\hat A_t^{\\mathrm{GAE}(\\gamma,\\lambda)}=\\sum_{l=0}^{\\infty}(\\gamma\\lambda)^l\\delta_{t+l}", read: "Generalized advantage estimation is a decaying sum of future TD residuals.", meaning: "Lambda chooses how much longer-horizon evidence enters the advantage. Finite rollouts require a correct bootstrap at truncation and zero continuation only at true termination." },
    ],
    boundary: {
      title: "A better critic does not guarantee a safer actor", paragraphs: ["The critic estimates the chosen reward objective under collected data. It can become accurate while the reward itself is exploitable or safety constraints are absent." ,"On-policy actor–critic data becomes stale after policy updates. Reusing it for too many epochs without ratio control turns a nominally on-policy method into an uncontrolled off-policy approximation, motivating trust-region methods."],
    },
    nextBridge: "Actor–critic gives a useful gradient direction, but an update can move the policy so far that its data and critic become irrelevant. Natural gradients, TRPO, and PPO ask how policy change should be measured and constrained.",
    sources: [SB, { label: "Schulman et al. — High-Dimensional Continuous Control Using Generalized Advantage Estimation", url: "https://arxiv.org/abs/1506.02438", kind: "paper" }, { label: "Mnih et al. — Asynchronous Methods for Deep Reinforcement Learning", url: "https://proceedings.mlr.press/v48/mniha16.html", kind: "paper" }],
  },
  {
    slug: "trpo-ppo",
    title: "Control policy-update size with natural gradients, TRPO, and PPO",
    deck: "Policy improvement depends on the gradient direction and on how far the new action distribution moves from the data-generating policy.",
    openingQuestion: "Why can a gradient step that improves a sampled objective destroy the behavior that produced those samples?",
    bridge: "Actor–critic estimates advantages using data from the current policy. Large parameter changes can make the new policy assign very different probabilities, invalidating those advantages and collapsing performance. Trust-region methods measure movement in distribution space rather than assuming a Euclidean parameter step has consistent behavioral meaning.",
    situation: {
      title: "The same parameter step can mean a very different policy step",
      paragraphs: ["Changing a Gaussian policy's mean by 0.1 is modest when its standard deviation is 2 and enormous when the standard deviation is 0.01. Ordinary gradient length does not capture that difference. KL divergence measures change between action distributions over states." ,"Natural policy gradient rescales direction using the Fisher information geometry. TRPO approximately maximizes a surrogate objective subject to an average KL constraint, using conjugate gradients and line search. PPO replaces the hard optimization procedure with a clipped surrogate or KL penalty that is easier to implement." ,"The probability ratio πnew(a|s)/πold(a|s) says how much more or less likely the sampled action becomes. Clipping limits incentive once that ratio moves beyond a band for the sign of the advantage. It does not hard-constrain every state, guarantee monotonic improvement, or make unlimited epochs safe."],
    },
    diagram: {
      title: "Old-policy data supports only a local policy comparison", caption: "Ratios reuse sampled actions; KL measures distribution movement; clipping removes part of the incentive to move farther but does not create a universal safety boundary.",
      items: [
        { label: "Evidence", value: "(s,a,Â) from πold", note: "Advantages describe behavior near the data policy." },
        { label: "Ratio", value: "r=πθ(a|s)/πold(a|s)", note: "Reweights sampled actions under the candidate policy." },
        { label: "Geometry", value: "KL(πold||πθ)", note: "Measures action-distribution change rather than raw parameter distance." },
        { label: "Guard", value: "TRPO constraint or PPO clip", note: "Discourages updates that outrun their evidence." },
      ],
    },
    workedExample: {
      title: "Evaluate a PPO clipped term",
      setup: "A sampled action has positive advantage +2. Its old probability was 0.20 and its new probability is 0.26. PPO epsilon is 0.20.",
      prediction: "Compute the probability ratio and decide whether the positive-advantage objective uses the raw or clipped ratio.",
      steps: [
        { label: "Ratio", calculation: "r=0.26/0.20=1.30", explanation: "The sampled action became thirty percent more likely." },
        { label: "Clip interval", calculation: "[1−0.2,1+0.2]=[0.8,1.2]", explanation: "The upper clipped ratio is 1.2." },
        { label: "Raw surrogate", calculation: "rÂ=1.3×2=2.6", explanation: "Without clipping, the sample continues to reward the larger probability increase." },
        { label: "Clipped surrogate", calculation: "min(2.6,1.2×2)=2.4", explanation: "For positive advantage, the objective removes extra benefit beyond the upper band." },
      ],
      result: "Clipping limits this sample's incentive, not necessarily the final policy's global KL. Implementations monitor approximate KL and may stop epochs early.",
    },
    mechanism: {
      introduction: "TRPO and PPO share a local-evidence motivation but differ in optimization machinery and guarantees.",
      sections: [
        { title: "Natural gradient normalizes behavioral sensitivity", paragraphs: ["The Fisher matrix approximates local KL curvature. Multiplying by its inverse gives a direction whose scale reflects distribution change. Practical solvers avoid explicitly inverting a huge matrix."] },
        { title: "TRPO solves a constrained surrogate approximately", paragraphs: ["Conjugate gradient estimates the step, and line search checks objective improvement and KL. The theorem relies on assumptions and worst-case divergences stronger than common average-KL implementations; practical TRPO is still empirical." ] },
        { title: "PPO-Clip is a pessimistic sampled objective", paragraphs: ["The minimum chooses the less favorable of raw and clipped terms. Negative advantages reverse which boundary matters. Multiple epochs improve data reuse but also increase departure from the policy that generated the batch." ] },
        { title: "Normalization and batching affect effective trust", paragraphs: ["Advantage normalization, mini-batch order, optimizer moments, value updates, entropy bonuses, and action-distribution parameterization all affect actual movement. Reporting epsilon alone does not characterize a PPO update." ] },
      ],
    },
    equations: [
      { latex: "L^{\\mathrm{CLIP}}(\\theta)=\\mathbb{E}_t\\left[\\min\\left(r_t(\\theta)\\hat A_t,\\operatorname{clip}(r_t(\\theta),1-\\epsilon,1+\\epsilon)\\hat A_t\\right)\\right]", read: "PPO maximizes the smaller of the raw ratio-weighted advantage and a version whose probability ratio is clipped around one.", meaning: "The minimum removes sampled incentive for certain excessive changes. It is not a hard constraint on every action distribution, so KL and performance diagnostics remain necessary." },
      { latex: "\\max_\\theta L(\\theta)\\quad\\text{subject to}\\quad\\mathbb{E}_s[D_{KL}(\\pi_{old}(\\cdot|s)\\|\\pi_\\theta(\\cdot|s))]\\le\\delta", read: "TRPO seeks surrogate improvement while keeping average KL divergence from the old policy below a chosen radius.", meaning: "The constraint expresses local trust in old-policy evidence. Approximate solution, sampling error, and average rather than worst-case KL limit what can be guaranteed in practice." },
    ],
    boundary: {
      title: "PPO clipping is not a safety constraint", paragraphs: ["A clipped training objective does not encode collision, fairness, budget, or harm limits. It controls update incentives in probability space and can still produce unsafe actions or large changes in unobserved states." ,"PPO's popularity does not make it universally best. It is on-policy and can be data-hungry; SAC or TD3 may reuse continuous-control data more efficiently, while offline or model-based settings require different evidence assumptions."],
    },
    nextBridge: "PPO can parameterize continuous action distributions, but off-policy continuous control has its own influential family. DDPG, TD3, and SAC use actors to avoid maximizing a critic over infinitely many actions and differ in how they treat noise, bias, and entropy.",
    sources: [{ label: "Schulman et al. — Trust Region Policy Optimization", url: "https://proceedings.mlr.press/v37/schulman15.html", kind: "paper" }, { label: "Schulman et al. — Proximal Policy Optimization Algorithms", url: "https://arxiv.org/abs/1707.06347", kind: "paper" }, SPINNING_UP],
  },
  {
    slug: "continuous-control",
    title: "Handle continuous actions with DDPG, TD3, and SAC",
    deck: "Continuous actions prevent a simple finite max. Actor–critic methods learn an action-producing policy and a critic, then manage overestimation, exploration, and entropy in different ways.",
    openingQuestion: "If steering can be any real number, how can a Q-learning target choose the best next action?",
    bridge: "DQN enumerates discrete actions, while PPO can optimize a sampled continuous policy on-policy. DDPG learns a deterministic actor whose action maximizes a critic approximately. TD3 repairs common DDPG failure modes. SAC learns a stochastic actor and maximizes reward plus entropy using off-policy replay.",
    situation: {
      title: "A robotic joint has infinitely many candidate torques",
      paragraphs: ["A joint command may range continuously from −1 to 1. Computing maxa Q(s,a) by evaluating every action is impossible. A learned actor μ(s) outputs one candidate torque, and the critic's action gradient tells the actor how that torque should change." ,"DDPG combines deterministic policy gradients, replay, target networks, and external exploration noise. It can exploit critic errors: if the critic has a narrow false peak, the actor climbs it. TD3 uses two critics and the smaller target, delayed actor updates, and noise-smoothed target actions." ,"SAC learns a stochastic policy and a soft value objective that includes entropy. Reparameterization expresses a sampled action as a differentiable transformation of noise. Temperature alpha sets or automatically tunes the reward-entropy tradeoff. Action squashing requires correcting log probabilities for the tanh transformation."],
    },
    diagram: {
      title: "Three continuous-control designs make different commitments", caption: "All use actors and critics, but their target bias, exploration source, policy stochasticity, and update schedules differ.",
      items: [
        { label: "DDPG", value: "one deterministic actor + critic", note: "External noise explores; critic gradient updates actor." },
        { label: "TD3", value: "twin critics + delay + smoothing", note: "Targets common overestimation and brittle actor exploitation." },
        { label: "SAC", value: "stochastic actor + twin critics", note: "Maximum-entropy objective integrates exploration into policy." },
        { label: "Shared base", value: "off-policy replay + targets", note: "Data support and bootstrap stability still matter." },
      ],
    },
    workedExample: {
      title: "Compare a single critic target with TD3's clipped double target",
      setup: "For the target action, critic one predicts 8 and critic two predicts 5. Reward is 1, gamma is 0.9, and the transition continues.",
      prediction: "Which critic value enters TD3's target and what bias tradeoff does that make?",
      steps: [
        { label: "Single-critic target", calculation: "y=1+0.9×8=8.2", explanation: "If eight is an overestimate, the actor and critic can reinforce a false high-value action." },
        { label: "Clipped double value", calculation: "min(8,5)=5", explanation: "TD3 uses the lower target estimate to reduce positive bias." },
        { label: "TD3 target", calculation: "y=1+0.9×5=5.5", explanation: "The conservative choice can introduce underestimation but is harder for the actor to exploit." },
        { label: "Delayed actor", calculation: "update policy less often than critics", explanation: "The critic receives more fitting steps before the actor chases its current surface." },
      ],
      result: "TD3's three additions address distinct paths through which a deterministic actor can amplify critic error; none replaces coverage or task evaluation.",
    },
    mechanism: {
      introduction: "Continuous-control algorithms should be selected by data regime and failure mode, not by a one-dimensional leaderboard.",
      sections: [
        { title: "Deterministic policy gradients follow the critic surface", paragraphs: ["The actor gradient chains the critic's derivative with respect to action through the actor parameters. This is efficient but makes local critic shape decisive. Action scaling and saturation can suppress useful gradients."] },
        { title: "TD3's repairs are coupled", paragraphs: ["Twin targets limit overestimation, target-action smoothing discourages sharp unsupported peaks, and delayed policy updates reduce feedback speed. Removing one changes the role and tuning of the others."] },
        { title: "SAC optimizes a soft objective", paragraphs: ["Entropy values policy uncertainty at each state. Automatic temperature tuning compares observed log probabilities with a target entropy. Reward scale and target entropy jointly determine how exploratory the learned policy remains."] },
        { title: "Replay makes these methods sample-efficient and off-policy", paragraphs: ["Old transitions support many updates, but actions far outside replay support can receive arbitrary critic values. Exploratory noise, warm-up collection, conservative updates, and evaluation resets affect reliability." ] },
      ],
    },
    equations: [
      { latex: "\\nabla_\\theta J\\approx\\mathbb{E}_{s\\sim D}\\left[\\nabla_a Q_\\phi(s,a)|_{a=\\mu_\\theta(s)}\\nabla_\\theta\\mu_\\theta(s)\\right]", read: "A deterministic actor follows the critic's action gradient and propagates that direction through the actor network.", meaning: "The update avoids enumerating continuous actions, but it trusts critic gradients at actor-selected actions. Extrapolation error can therefore become a direct policy error." },
      { latex: "J_{SAC}=\\mathbb{E}\\left[\\sum_{t=0}^{\\infty}\\gamma^t\\left(R_{t+1}+\\alpha\\mathcal{H}(\\pi(\\cdot\\mid S_t))\\right)\\right]", read: "SAC maximizes the discounted sum of reward plus temperature alpha times policy entropy along the trajectory.", meaning: "Entropy is part of the optimization objective, not merely data-collection noise. Alpha controls the tradeoff and can be learned toward a target entropy." },
    ],
    boundary: {
      title: "Continuous control benchmarks can conceal physical mismatch", paragraphs: ["A simulator may expose normalized torques, perfect state estimates, fixed delays, and forgiving resets. Real actuators have latency, wear, saturation, uncertainty, and safety interlocks. Algorithm score does not validate sim-to-real transfer." ,"SAC's stochasticity and TD3's twin critics do not make unsupported offline actions safe. When no new interaction is allowed, offline RL objectives explicitly control distributional shift."],
    },
    nextBridge: "Once a single learner works, more actors can collect experience faster. Distributed RL changes policy freshness, replay composition, recurrent state, network bandwidth, and correction requirements; those systems choices become part of the algorithm.",
    sources: [{ label: "Lillicrap et al. — Continuous control with deep reinforcement learning", url: "https://arxiv.org/abs/1509.02971", kind: "paper" }, { label: "Fujimoto, van Hoof, and Meger — Addressing Function Approximation Error in Actor-Critic Methods", url: "https://proceedings.mlr.press/v80/fujimoto18a.html", kind: "paper" }, { label: "Haarnoja et al. — Soft Actor-Critic", url: "https://proceedings.mlr.press/v80/haarnoja18b.html", kind: "paper" }],
  },
  {
    slug: "distributed-rl",
    title: "Separate actors, learners, and replay in distributed RL",
    deck: "Distributed RL increases throughput by separating experience collection from parameter updates. It also creates policy lag, replay skew, recurrent-state problems, and new failure surfaces.",
    openingQuestion: "If one hundred actors collect data with old parameters, whose policy is the learner actually improving?",
    bridge: "DQN and continuous actor–critic methods already separate replay from learning. Distributed systems multiply that separation across machines. A3C updates asynchronously, Ape-X centralizes prioritized replay, IMPALA corrects trajectories from lagging actors with V-trace, and R2D2 stores recurrent sequences with state reconstruction.",
    situation: {
      title: "Throughput creates stale behavior",
      paragraphs: ["A fleet of actors periodically fetches learner parameters, runs environments, and sends trajectories. While an actor completes a rollout, the learner may perform hundreds of updates. The trajectory was generated by behavior μ, not the learner's current target policy π." ,"Ape-X uses many DQN actors with different exploration levels and a centralized prioritized replay buffer. IMPALA streams trajectories directly and applies truncated V-trace importance corrections. R2D2 combines recurrent Q-learning, prioritized sequence replay, burn-in, and stored recurrent states to handle partial observability at scale." ,"The bottleneck may be environment simulation, inference, replay bandwidth, learner compute, or synchronization. Frames per second alone can hide duplicated data, stale policies, dropped sequences, or poor sample efficiency. Distributed reproducibility requires systems metrics alongside return."],
    },
    diagram: {
      title: "A distributed pipeline has algorithmic queues", caption: "Every delay changes data age and policy mismatch. Queue length, parameter version, and replay priority belong in learning diagnostics.",
      items: [
        { label: "Actors", value: "μ₁,…,μN", note: "Collect diverse trajectories, often with different exploration." },
        { label: "Transport", value: "queues / replay", note: "Introduces delay, sampling policy, and possible data loss." },
        { label: "Learner", value: "update π or Q", note: "Consumes batches faster or slower than actors produce them." },
        { label: "Broadcast", value: "versioned parameters", note: "Refresh frequency controls actor policy lag." },
      ],
    },
    workedExample: {
      title: "Measure policy lag and one V-trace ratio",
      setup: "An actor generated an action with probability μ(a|s)=0.20 using parameter version 100. The learner is at version 130 and its current policy assigns π(a|s)=0.50.",
      prediction: "Compute the raw importance ratio and decide why IMPALA may truncate it.",
      steps: [
        { label: "Version lag", calculation: "130−100=30 learner updates", explanation: "Version distance is an operational signal, not a complete behavioral distance metric." },
        { label: "Raw ratio", calculation: "ρ=0.50/0.20=2.5", explanation: "The sampled action is much more likely under the current target policy." },
        { label: "Truncated correction", calculation: "ρ̄=min(c,2.5)", explanation: "A cap limits variance and influence from large mismatch, introducing a controlled bias." },
        { label: "Systems response", calculation: "refresh actors, shorten rollouts, or tune queue", explanation: "Correction does not excuse unlimited lag; architecture can reduce the mismatch at its source." },
      ],
      result: "Distributed correction and system design work together. A ratio reveals behavioral mismatch; version and queue metrics help locate its operational cause.",
    },
    mechanism: {
      introduction: "Distributed algorithms are defined partly by where state lives, how data moves, and how stale evidence is corrected.",
      sections: [
        { title: "A3C decorrelates through asynchronous workers", paragraphs: ["Workers maintain local copies, collect short rollouts, and push gradients to shared parameters. Updates are computed on stale copies and applied without a central replay buffer. A2C restores synchronization and batching, often mapping better to accelerators."] },
        { title: "Ape-X separates exploration from centralized learning", paragraphs: ["Actors can use different epsilon values, broadening experience. The learner samples prioritized transitions at high throughput. Priority updates and actor diversity shape replay composition and can overrepresent noisy surprises."] },
        { title: "IMPALA uses V-trace for actor–learner decoupling", paragraphs: ["V-trace applies truncated importance weights to construct corrected value targets and policy updates. It supports high throughput with lag but changes bias-variance properties through its caps."] },
        { title: "R2D2 treats recurrent state as data", paragraphs: ["Random sequence replay needs an initial hidden state. Stored states can be stale; zero states are wrong mid-episode. Burn-in replays earlier observations without loss to reconstruct a current hidden state before learning on the main sequence."] },
      ],
    },
    equations: [
      { latex: "\\rho_t=\\min\\left(\\bar\\rho,\\frac{\\pi(A_t|S_t)}{\\mu(A_t|S_t)}\\right),\\qquad c_t=\\min\\left(\\bar c,\\frac{\\pi(A_t|S_t)}{\\mu(A_t|S_t)}\\right)", read: "V-trace truncates target-to-behavior probability ratios with separate caps for value and trace corrections.", meaning: "The caps control variance caused by policy lag and define a biased but more stable correction. They rely on actors recording behavior probabilities accurately." },
      { latex: "\\text{policy lag}=\\text{learner version at update}-\\text{actor version at collection}", read: "Operational policy lag counts how many learner parameter versions separate collected data from the update consuming it.", meaning: "Version lag is easy to log and helps diagnose queues and refresh schedules. Equal version distance does not imply equal KL, so behavioral metrics remain useful." },
    ],
    boundary: {
      title: "More environment steps per second can produce less useful learning", paragraphs: ["If the learner cannot consume data, queues grow and trajectories stale. If the learner updates too aggressively, actors become off-policy and replay overfits. Throughput must be interpreted with return per environment step, compute, wall time, and policy lag." ,"Distributed failures can be silent: actor crashes bias environments, priorities stop updating, hidden states mismatch, or parameter broadcasts partially fail. Instrumentation and checkpoint recovery are correctness requirements, not only operations work."],
    },
    nextBridge: "Distributed computation scales experience but cannot restore information the agent never observes. The next part moves from scale to memory: POMDPs formalize hidden state, and recurrent policies or belief filters use history to act under partial observability.",
    sources: [{ label: "Espeholt et al. — IMPALA", url: "https://proceedings.mlr.press/v80/espeholt18a.html", kind: "paper" }, { label: "Horgan et al. — Distributed Prioritized Experience Replay", url: "https://arxiv.org/abs/1803.00933", kind: "paper" }, { label: "Kapturowski et al. — Recurrent Experience Replay in Distributed Reinforcement Learning", url: "https://openreview.net/forum?id=r1lyTjAqYX", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
