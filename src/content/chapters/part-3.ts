import type { ChapterArticle } from "@/content/chapter-article";

const SB = { label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition", url: "https://incompleteideas.net/book/RLbook2020.pdf", kind: "book" } as const;
const SPINNING_UP = { label: "OpenAI Spinning Up — Deep RL algorithms", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html", kind: "official documentation" } as const;

export const PART_THREE_ARTICLES = [
  {
    slug: "linear-approximation",
    title: "When the table becomes too large, let similar situations learn together",
    deck: "A table keeps a separate answer for every situation. A simple shared formula can let one experience help many similar situations.",
    openingQuestion: "If a controller learns something at 80.0°C, should it really start from zero again at 79.9°C?",
    bridge: "Tables break when situations multiply. Real measurements can take almost any value, so the same situation may never appear twice. We need a rule for deciding which situations are similar enough to share experience. Using one formula instead of a huge table is called function approximation. We begin with a linear function because we can still see exactly how each input changes the answer.",
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
    bridge: "Hand-picked features hit a ceiling. A camera image contains too many details for us to list every useful feature by hand. A neural network can learn those features. This is called neural function approximation. It makes the model much more powerful. It also creates a new problem: changing the network can change its predictions, its actions, its future data, and even some future targets.",
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
    bridge: "Two problems emerged: instability and sample waste. Neighboring frames look almost the same, so many updates repeat nearly identical evidence. The network's next-state estimate also helps form the target, so changing the network can move both the answer and the answer key. A Deep Q-Network, or DQN, adds one tool for each problem: a memory of past transitions and a slower copy of the network.",
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
    title: "Match each DQN repair to the mistake it targets",
    deck: "Later versions of DQN do not form one ladder from weak to strong. Each one changes a different part of learning.",
    openingQuestion: "If two add-ons improve the game score, did they actually fix the same problem?",
    bridge: "Basic DQN has a memory and a slow target network, but it can still fail in several ways. It may prefer a value that is high only because of noise. It may spend equal training time on easy and surprising experiences. It may move a late reward backward too slowly. We will begin with each mistake, then name the repair made for it.",
    situation: {
      title: "A higher score can hide six different repairs",
      paragraphs: ["Suppose several action estimates are noisy. Taking the largest one tends to pick an estimate that was lucky enough to be high. A method called Double DQN separates the network that selects an action from the network that scores it." ,"Now imagine a safe room where every action is almost equally good. The network should learn that the room itself is valuable without relearning that fact for every action. A dueling network separates the value of the state from the extra benefit of each action." ,"Other changes solve other problems. Prioritized replay studies surprising experiences more often. Multi-step targets carry rewards across more than one step. Distributional methods learn a range of possible returns. Noisy networks change exploration. Rainbow is a tested bundle of several such repairs, not one new reason why learning works."],
    },
    diagram: {
      title: "Start with the failure, then choose the repair", caption: "Each component changes one part of the learning process and leaves the other parts mostly alone.",
      items: [
        { label: "Lucky high estimates", value: "Double DQN", note: "Use different networks to choose and score the action." },
        { label: "Repeated state learning", value: "Dueling network", note: "Separate state value from the action's extra effect." },
        { label: "Unequal learning value", value: "Prioritized replay", note: "Study surprising records more often, then correct the sampling bias." },
        { label: "More than one possible return", value: "Distributional method", note: "Predict a distribution instead of only one average." },
      ],
    },
    workedExample: {
      title: "Use two networks for two different jobs",
      setup: "Both true next-action values are 5. The online network estimates A=6 and B=5.5; the target network estimates A=4.8 and B=5.1.",
      prediction: "First let the online network choose. Then stop it from scoring the winner. What number does the target network give that chosen action?",
      steps: [
        { label: "Basic DQN", calculation: "max target Q = max(4.8,5.1)=5.1", explanation: "The target network chooses B and uses its own score of 5.1." },
        { label: "Choose with the online network", calculation: "argmax online Q = A", explanation: "The online network chooses A because 6 is larger than 5.5." },
        { label: "Score with the target network", calculation: "target Q(A)=4.8", explanation: "The action is already fixed as A. The target network now reads A's score instead of choosing again." },
        { label: "Read the result carefully", calculation: "5.1 versus 4.8; true value 5", explanation: "This one example does not prove that 4.8 is always better. It only shows that one noise pattern no longer does both jobs." },
      ],
      result: "Double DQN changes how the next value is estimated. It does not add exploration, new experience, or faster reward travel. Those need different repairs.",
    },
    mechanism: {
      introduction: "The family makes sense when we ask what each component changes and what evidence would show that the change helped.",
      sections: [
        { title: "A dueling network needs a rule for joining its two answers", paragraphs: ["It learns one number for how good the state is and another for how each action differs from the average. The two parts could trade a constant and still make the same final Q value. Subtracting the mean action advantage fixes a shared reference point."] },
        { title: "Prioritized replay changes who gets studied", paragraphs: ["A large Temporal-Difference error, or TD error, can mark a useful surprise. It can also mark noise or a bad record. Sampling large errors more often focuses work but changes the training distribution. Importance weights reduce that bias; they do not prove that every large error deserves attention."] },
        { title: "A return distribution is not the model's confidence", paragraphs: ["Sometimes the same action leads to several possible returns. Distributional reinforcement learning predicts that spread instead of only the mean. C51 uses fixed positions for possible returns, while quantile methods learn cut points. This spread describes outcome randomness, not how certain the network is about unseen data."] },
        { title: "Rainbow is a bundle to test, not an answer to copy", paragraphs: ["Rainbow combines Double DQN, a dueling network, prioritized replay, multi-step targets, C51, and noisy networks. The parts can help one another, but a new task may need only some of them. An ablation removes one part at a time under the same budget to find which part actually mattered."] },
      ],
    },
    equations: [
      { latex: "y=r+\\gamma Q_{\\theta^-}\\left(s',\\arg\\max_{a'}Q_{\\theta}(s',a')\\right)", read: "The online network chooses the next action. The slower target network then gives that chosen action its score.", meaning: "Using different estimates for the two jobs weakens one source of upward bias. It does not guarantee that every estimate will be accurate or never too low." },
      { latex: "Q(s,a)=V(s)+A(s,a)-\\frac{1}{|\\mathcal{A}|}\\sum_{a'}A(s,a')", read: "Start with the value of the state, add the chosen action's extra advantage, then subtract the average advantage.", meaning: "Subtracting the average gives the two parts a common reference. The final Q values keep the relative action preferences." },
    ],
    boundary: {
      title: "More components can make a failure harder to explain", paragraphs: ["If Rainbow performs badly, the cause could be the replay priorities, return range, target length, exploration noise, or an interaction between them. Adding every part at once makes the broken assumption harder to find." ,"Learning a return distribution also does not automatically make the policy cautious. If actions are still chosen by average return, the policy can ignore rare bad outcomes. Risk-sensitive behavior needs an explicit decision rule and its own test."],
    },
    nextBridge: "All of these methods still learn action scores and choose from them. What if the action is a steering angle or a long piece of text, so listing every choice is impossible? We can instead make the policy itself a probability distribution and directly change which actions become more likely.",
    sources: [{ label: "Hessel et al. — Rainbow: Combining Improvements in Deep Reinforcement Learning", url: "https://ojs.aaai.org/index.php/AAAI/article/view/11796", kind: "paper" }, { label: "Bellemare, Dabney, and Munos — A Distributional Perspective on Reinforcement Learning", url: "https://proceedings.mlr.press/v70/bellemare17a.html", kind: "paper" }, SB],
  },
  {
    slug: "reinforce-policy-gradient",
    title: "Change action probabilities directly with REINFORCE",
    deck: "Instead of scoring every possible action, a policy can produce actions itself. Better-than-usual outcomes make a sampled action a little more likely next time.",
    openingQuestion: "If a robot can turn its wheel to any angle, how could we score every possible angle before choosing one?",
    bridge: "DQN works well when it can list the actions and compare their Q values. A steering angle, robot force, or long text response has far too many possibilities. We can instead let a policy output a probability distribution over actions. Then learning asks a new question: which sampled choices should become a little more or less likely?",
    situation: {
      title: "One good outcome should cause a small nudge, not a permanent rule",
      paragraphs: ["Suppose a delivery robot can turn by any angle. Its policy gives a range of angles different probabilities, then samples one. If the trip goes better than usual, learning should make similar angles a little more likely in similar situations." ,"The first simple method for doing this is called REINFORCE. It records how the policy's parameters affected the probability of the sampled action. The later return says whether to push that probability up or down. The environment itself does not need to provide a derivative." ,"One trip can be lucky or unlucky, so the update is noisy. We compare the return with what was normally expected in that state. This expected level is called a baseline. The difference between the return and the baseline is called an advantage."],
    },
    diagram: {
      title: "Turn one sampled trip into a small probability change", caption: "The outcome gives the direction. The policy's log probability shows which parameters helped produce the action.",
      items: [
        { label: "Choose", value: "Aₜ~πθ(·|Sₜ)", note: "The policy samples one action from its current distribution." },
        { label: "Observe", value: "Gₜ", note: "Add the rewards that came after this action." },
        { label: "Compare", value: "Âₜ=Gₜ−baseline", note: "Ask whether the outcome was better or worse than usual." },
        { label: "Nudge", value: "θ←θ+αÂₜ∇logπ", note: "Raise or lower the sampled action's future likelihood." },
      ],
    },
    workedExample: {
      title: "Give one successful choice a small nudge",
      setup: "A policy chooses Left with probability 0.60 and Right with 0.40. This time it samples Left, and Left performs 2 points better than the baseline. We take one small learning step.",
      prediction: "Should Left jump to probability 1, rise slightly, or fall? What should happen if it performs below the baseline next time?",
      steps: [
        { label: "Decide the direction", calculation: "Â=+2", explanation: "Left did better than expected, so its log probability should increase." },
        { label: "Keep probabilities adding to one", calculation: "raise Left logit relative to Right", explanation: "When Left becomes more likely, Right must give up some probability. The policy keeps a valid distribution." },
        { label: "Take only a small step", calculation: "0.60→approximately 0.63", explanation: "The exact change depends on the learning rate and policy parameters. The return is not copied directly into the probability." },
        { label: "Reverse after a bad result", calculation: "Â<0 → reduce sampled-action log probability", explanation: "A below-usual result makes the sampled action less likely, while other options remain available." },
      ],
      result: "The advantage says which way to move and how strongly to push. The learning rate and policy design decide the actual change in probability.",
    },
    mechanism: {
      introduction: "This direct route avoids listing every action, but it raises three new questions: how the sample creates a direction, which rewards belong to it, and how to control noisy updates.",
      sections: [
        { title: "The policy provides the path for the gradient", paragraphs: ["We cannot send a derivative through a real road or a person. We can still calculate how the policy parameters changed the sampled action's log probability. Multiplying that direction by the observed outcome gives a policy-gradient estimate. It works with a black-box environment, but one trip can be very noisy."] },
        { title: "A baseline asks whether the result was unusual", paragraphs: ["Ten points can be excellent in a hard state and disappointing in an easy one. Subtracting a state-based baseline turns the signal into 'better or worse than usual.' The baseline must not secretly depend on the sampled action, or it can change the expected learning direction."] },
        { title: "An action cannot cause rewards that happened before it", paragraphs: ["For an action at time t, we add only rewards from time t onward. This is called reward-to-go. Removing earlier rewards cuts irrelevant noise. It still does not tell us which one of many earlier actions truly caused a late success."] },
        { title: "Entropy keeps choices open, but it is not free", paragraphs: ["Entropy is larger when action probabilities are spread out. Adding an entropy bonus can stop the policy from choosing one action too early. Too little may close exploration; too much may stop the policy from committing. It changes the learning goal and cannot repair a bad reward." ] },
      ],
    },
    equations: [
      { latex: "\\nabla_{\\theta}J(\\theta)=\\mathbb{E}_{\\pi_{\\theta}}\\left[\\sum_t\\nabla_{\\theta}\\log\\pi_{\\theta}(A_t\\mid S_t)\\,G_t\\right]", read: "For every sampled action, take the direction that raises its log probability and weight that direction by the later return.", meaning: "Across many trips, this moves the policy toward actions connected with higher return. Any one trip can still give a noisy or unlucky direction." },
      { latex: "\\hat A_t=G_t-b(S_t)", read: "Subtract the usual outcome for state Sₜ from the sampled later return Gₜ.", meaning: "The result is an advantage estimate: positive means better than usual, and negative means worse. A state-only baseline lowers noise without changing the expected direction." },
    ],
    boundary: {
      title: "A correct average direction can still need too many trips", paragraphs: ["REINFORCE often needs many fresh trajectories because full returns vary so much. A method can be unbiased on average and still give a poor estimate from a small batch. One update can also be too large and make the policy worse." ,"The method increases the reward we wrote down. It does not know whether that reward has a loophole or whether exploration is unsafe. Safety limits and behavior tests remain separate work."],
    },
    nextBridge: "REINFORCE may wait until a long trip ends before it knows whether an action beat the baseline. Could another learner estimate the usual future earlier? Actor–critic methods add that second learner, called a critic, so the policy can receive faster feedback.",
    sources: [SB, { label: "Williams — Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning", url: "https://link.springer.com/article/10.1007/BF00992696", kind: "paper" }, SPINNING_UP],
  },
  {
    slug: "actor-critic-gae",
    title: "Let a critic give the policy earlier feedback",
    deck: "The actor chooses what to do. The critic estimates what usually happens from the current state. Their difference gives faster feedback, but the critic can be wrong.",
    openingQuestion: "Can we judge a move before the whole game ends, without blindly trusting a guess about the future?",
    bridge: "REINFORCE may wait a long time for the final return. We can train a second model to predict the usual future from each state. This model is called the critic. The policy that chooses actions is called the actor. Comparing what happened with what the critic expected gives the actor earlier feedback.",
    situation: {
      title: "One move gives the actor and the critic different lessons",
      paragraphs: ["A robot turns left. Before the turn, the critic says the current state is worth 5. The robot receives reward 1, and the critic says the next state is worth 6. With a discount factor of 0.9, the one-step target is 6.4." ,"The target is 1.4 above the old estimate. The actor reads this as 'the sampled turn did better than expected' and makes it more likely. The critic reads the same gap as 'my estimate of 5 was too low' and raises its state-value prediction." ,"Earlier feedback is less noisy than waiting for every possible ending, but it now depends on the critic's guess. Generalized Advantage Estimation, or GAE, mixes several nearby prediction gaps. It lets us choose how much to trust quick guesses and how much to wait for longer evidence."],
    },
    diagram: {
      title: "The same transition becomes two different lessons", caption: "The actor changes action probabilities. The critic changes its prediction of what usually happens.",
      items: [
        { label: "Actor", value: "πθ(a|s)", note: "Chooses an action and later changes its probability." },
        { label: "Critic", value: "Vφ(s)", note: "Predicts the usual future return from a state." },
        { label: "Surprise", value: "r+γV(s′)−V(s)", note: "Says whether this step was better or worse than expected." },
        { label: "GAE", value: "δₜ+(γλ)δₜ₊₁+…", note: "Mixes surprises from several later steps." },
      ],
    },
    workedExample: {
      title: "Read one transition in two different ways",
      setup: "The critic predicts V(Sₜ)=5. The reward is 1, the next prediction V(Sₜ₊₁)=6, the discount factor gamma is 0.9, and the task continues.",
      prediction: "Was this step better or worse than the critic expected? Which probability and which value estimate should change?",
      steps: [
        { label: "Build an early target", calculation: "y=1+0.9×6=6.4", explanation: "Keep the reward 1 and use the next value estimate to fill in the unfinished future." },
        { label: "Compare with the old expectation", calculation: "δ=6.4−5=1.4", explanation: "The result is 1.4 better than the critic expected from the current state." },
        { label: "The actor's lesson", calculation: "+1.4∇logπ(Aₜ|Sₜ)", explanation: "A positive advantage makes the sampled action more likely in similar states." },
        { label: "The critic's lesson", calculation: "minimize ½(6.4−Vφ(Sₜ))²", explanation: "The critic raises its current-state estimate from 5 toward the target 6.4." },
      ],
      result: "The same gap teaches two models. If either value estimate was badly wrong, the actor and critic can both learn the wrong lesson. Their results must be checked separately.",
    },
    mechanism: {
      introduction: "Actor–critic is a partnership, not one blended learner. Its speed comes from borrowing an early estimate, and that estimate creates a new source of error.",
      sections: [
        { title: "The critic buys speed with possible bias", paragraphs: ["A full return can vary wildly because many later events are random. The critic gives earlier, steadier feedback by guessing the unfinished future. If that guess is wrong, the advantage can have the wrong size or even the wrong sign. A small value loss does not by itself prove that the policy improved." ] },
        { title: "A2C and A3C organize workers differently", paragraphs: ["Advantage Actor-Critic, or A2C, waits for several workers and then updates from their combined batch. Asynchronous Advantage Actor-Critic, or A3C, lets workers update without waiting. A3C mixes experience well, but a worker may calculate a gradient using old parameters. Both still use an actor and a critic." ] },
        { title: "GAE makes a slider between quick guesses and longer evidence", paragraphs: ["The Greek letter lambda, written λ, controls how quickly later Temporal-Difference gaps fade. A small λ relies mostly on the critic's next-step guess. A large λ includes more later evidence and usually more noise. The real decay also includes gamma, so λ cannot be read alone." ] },
        { title: "Shared network layers make the two learners interfere", paragraphs: ["The actor and critic often share early features. This saves computation, but a large critic update can damage features the policy needs. The moving policy also changes the data used by the critic. Policy loss, value loss, entropy, gradient size, and real behavior should be watched separately." ] },
      ],
    },
    equations: [
      { latex: "\\delta_t=R_{t+1}+\\gamma V_{\\phi}(S_{t+1})-V_{\\phi}(S_t)", read: "Add the reward to the discounted next-state estimate, then subtract what the critic expected before the action.", meaning: "A positive result says this transition was better than expected. It does not prove that the action is always best, because both value estimates can be wrong." },
      { latex: "\\hat A_t^{\\mathrm{GAE}(\\gamma,\\lambda)}=\\sum_{l=0}^{\\infty}(\\gamma\\lambda)^l\\delta_{t+l}", read: "Start with the current prediction gap, then add later gaps with smaller and smaller weights.", meaning: "Lambda controls how much longer evidence enters the advantage. A real ending removes the future; a time-limit cut normally still needs a value estimate." },
    ],
    boundary: {
      title: "A more accurate critic does not make the goal safe", paragraphs: ["The critic predicts the reward we chose under the data it has seen. It can predict that reward accurately even when the reward has a loophole or safety rules are missing." ,"Actor–critic data becomes old as soon as the actor changes. Training too many times on the same batch means the new policy is learning from experience produced by an older one. The next chapter asks how far one update should be allowed to move the policy."],
    },
    nextBridge: "The critic gives the actor a useful direction, but the actor can still move too far in one update. Then the old batch and old critic no longer describe the new policy well. The next chapter asks how to measure that distance and keep each policy update within a safer range.",
    sources: [SB, { label: "Schulman et al. — High-Dimensional Continuous Control Using Generalized Advantage Estimation", url: "https://arxiv.org/abs/1506.02438", kind: "paper" }, { label: "Mnih et al. — Asynchronous Methods for Deep Reinforcement Learning", url: "https://proceedings.mlr.press/v48/mniha16.html", kind: "paper" }],
  },
  {
    slug: "trpo-ppo",
    title: "A good direction is not enough: control how far the policy moves",
    deck: "Old experience can guide a small change. It may not describe what happens after one giant change. TRPO and PPO try to keep each update close enough to its evidence.",
    openingQuestion: "If yesterday's driving lesson says 'turn a little more left,' should we turn the wheel a few degrees or all the way?",
    bridge: "The critic can tell the actor which sampled choices looked better than usual. It does not tell the actor how large the next change should be. A huge update may create a policy that the old batch never tested. We therefore need to measure how far the new policy has moved from the policy that collected the data.",
    situation: {
      title: "The batch is a photograph of the old policy",
      paragraphs: ["Suppose the old policy chose Left with probability 0.20. The batch tells us what happened around that behavior. After training, the new policy might choose Left with probability 0.21 or 0.90. The same old batch is much less trustworthy for the second change." ,"We can compare the old and new action probabilities. Their ratio tells us how one sampled action changed. A second measure, Kullback–Leibler divergence, or KL divergence, compares the whole action distribution." ,"A natural policy gradient uses this distribution distance when choosing a step. Trust Region Policy Optimization, or TRPO, gives the average KL distance a budget. Proximal Policy Optimization, or PPO, uses a simpler training rule that removes some reward for moving too far."],
    },
    diagram: {
      title: "Check how far the new policy has left its evidence", caption: "The old batch supports a nearby change. Ratios and KL measure the move. TRPO or PPO then tries to keep that move under control.",
      items: [
        { label: "Collect", value: "(s,a,Â) from πold", note: "Save what the old policy did and how that choice turned out." },
        { label: "Compare", value: "r=πnew(a|s)/πold(a|s)", note: "Ask how much more or less likely the same action became." },
        { label: "Measure", value: "KL(πold||πnew)", note: "Compare the old and new action distributions." },
        { label: "Limit", value: "TRPO budget or PPO clip", note: "Reduce the push when the update has already moved far." },
      ],
    },
    workedExample: {
      title: "A useful action has already become 30% more likely",
      setup: "One sampled action has advantage +2. The old policy chose it with probability 0.20. The new policy gives it probability 0.26. PPO uses epsilon 0.20.",
      prediction: "The action did well, so raising its probability makes sense. But should this old sample keep rewarding every further increase?",
      steps: [
        { label: "Measure the change", calculation: "r=0.26/0.20=1.30", explanation: "The new policy makes this action 1.30 times as likely. That is a 30% increase." },
        { label: "Find the clip band", calculation: "[1−0.2,1+0.2]=[0.8,1.2]", explanation: "For this example, the upper edge is 1.2." },
        { label: "Read the raw score", calculation: "rÂ=1.3×2=2.6", explanation: "Without clipping, this sample still rewards the full 30% increase." },
        { label: "Use the cautious score", calculation: "min(2.6,1.2×2)=2.4", explanation: "The extra push above 1.2 gives this sample no more benefit." },
      ],
      result: "PPO has flattened this sample's reward for moving farther. It has not built a wall around the whole policy. We still measure KL after the update.",
    },
    mechanism: {
      introduction: "TRPO and PPO answer the same practical worry in different ways: do not let one old batch justify a completely different policy.",
      sections: [
        { title: "Raw parameter distance can be misleading", paragraphs: ["A small change to a network number can greatly change action probabilities. Another equally sized change may barely matter. The Fisher information matrix describes this local sensitivity. Rescaling the gradient with it gives a natural gradient, whose step better reflects policy behavior."] },
        { title: "TRPO writes the distance budget into the problem", paragraphs: ["TRPO asks for a better policy while keeping average KL below a chosen limit. It estimates a step with conjugate gradient, then uses line search to check the result. These are approximations made from samples, so the budget is not a proof that every state changed safely." ] },
        { title: "PPO changes what each old sample can reward", paragraphs: ["PPO-Clip compares the raw training score with a clipped one and keeps the less helpful score. A good action stops earning extra credit after one side of the band. A bad action uses the other side. The rule is easier to run than TRPO, but it is not a hard distance limit." ] },
        { title: "Every extra training round makes the batch older", paragraphs: ["The first update starts near the policy that collected the batch. After each epoch, the current policy moves farther away. More epochs reuse data, but they also spend its freshness. Learning rate, batch order, critic updates, and shared network layers all affect the real move." ] },
      ],
    },
    equations: [
      { latex: "L^{\\mathrm{CLIP}}(\\theta)=\\mathbb{E}_t\\left[\\min\\left(r_t(\\theta)\\hat A_t,\\operatorname{clip}(r_t(\\theta),1-\\epsilon,1+\\epsilon)\\hat A_t\\right)\\right]", read: "For each sample, PPO compares the raw probability-ratio score with a clipped score and keeps the smaller one.", meaning: "The rule removes some reward for moving farther. It does not stop the whole policy from moving, so we still check KL and real performance." },
      { latex: "\\max_\\theta L(\\theta)\\quad\\text{subject to}\\quad\\mathbb{E}_s[D_{KL}(\\pi_{old}(\\cdot|s)\\|\\pi_\\theta(\\cdot|s))]\\le\\delta", read: "TRPO looks for an improvement while asking the average KL distance to stay below delta.", meaning: "The old batch is trusted only near its policy. Because the distance and update are estimated from samples, the limit remains approximate." },
    ],
    boundary: {
      title: "A cautious update is not the same as safe behavior", paragraphs: ["PPO does not know that a robot must avoid people or that a budget must not be exceeded. It only changes how the training score reacts to a policy move. Real safety rules still need their own tests and controls." ,"PPO also needs fresh data from recent policies. When real interaction is expensive, an off-policy method may reuse old transitions more often. That choice creates a different problem: the value model may be asked about actions the data barely covered."],
    },
    nextBridge: "PPO can choose a steering angle from a continuous distribution, but it mainly learns from fresh trips. What if each real trip is expensive and we want to reuse old experience? The next chapter introduces actors that learn from replay, then asks how they can avoid chasing mistakes in the critic.",
    sources: [{ label: "Schulman et al. — Trust Region Policy Optimization", url: "https://proceedings.mlr.press/v37/schulman15.html", kind: "paper" }, { label: "Schulman et al. — Proximal Policy Optimization Algorithms", url: "https://arxiv.org/abs/1707.06347", kind: "paper" }, SPINNING_UP],
  },
  {
    slug: "continuous-control",
    title: "When actions have no end, train another learner to suggest one",
    deck: "A steering wheel has countless possible angles. We cannot test every angle inside one update. DDPG, TD3, and SAC train an actor to suggest useful continuous actions.",
    openingQuestion: "If a robot arm can use any force between zero and ten, who searches those countless choices?",
    bridge: "DQN can compare a short list such as Left, Right, and Stop. It cannot list every possible steering angle or motor force. We can instead train one model to suggest an action and another model to judge it. The first is the actor. The second is the critic. Old transitions can be stored and reused, but the actor may learn to exploit mistakes in the critic.",
    situation: {
      title: "The actor follows a map drawn by the critic",
      paragraphs: ["Imagine that the actor suggests motor force 4.2. The critic predicts how much future reward that force will bring. It also tells the actor which nearby direction looks better. The actor can then move toward 4.3 without checking every possible number." ,"This is efficient, but the critic's map is learned from limited data. It may draw a fake hill in a region that replay barely covers. The actor is trained to climb hills, so it can discover and exploit that mistake." ,"Deep Deterministic Policy Gradient, or DDPG, uses one deterministic actor. Twin Delayed Deep Deterministic Policy Gradient, or TD3, slows three common error paths. Soft Actor-Critic, or SAC, keeps a random policy and gives useful randomness a place in the goal."],
    },
    diagram: {
      title: "Three ways to keep an actor from blindly chasing its critic", caption: "All three reuse old experience. They differ in how actions are chosen and how they limit the critic's mistakes.",
      items: [
        { label: "DDPG", value: "one action + one critic", note: "Add outside noise so the deterministic actor still explores." },
        { label: "TD3", value: "two critics + slower actor", note: "Trust the lower estimate and smooth the target action." },
        { label: "SAC", value: "random actor + two critics", note: "Reward both good outcomes and useful choice diversity." },
        { label: "All three", value: "replay + target networks", note: "Reuse old transitions, but remain limited by what those transitions cover." },
      ],
    },
    workedExample: {
      title: "One critic says 8 and the other says 5",
      setup: "For the same next action, critic one predicts 8 and critic two predicts 5. The reward is 1, gamma is 0.9, and the trip continues.",
      prediction: "The actor likes large values. Why does TD3 use the smaller prediction instead of the exciting one?",
      steps: [
        { label: "Trust one critic", calculation: "y=1+0.9×8=8.2", explanation: "If 8 is a mistake, this large target helps the mistake grow." },
        { label: "Compare both critics", calculation: "min(8,5)=5", explanation: "TD3 deliberately keeps the lower estimate for this target." },
        { label: "Build the cautious target", calculation: "y=1+0.9×5=5.5", explanation: "The result may be too low, but it is harder for the actor to exploit." },
        { label: "Let the critics learn first", calculation: "update policy less often than critics", explanation: "The value map gets more fitting steps before the actor follows it again." },
      ],
      result: "The target 5.5 is intentionally cautious. TD3 also delays actor updates and smooths target actions. These repairs reduce exploitation of errors, but they cannot create missing experience.",
    },
    mechanism: {
      introduction: "These methods all solve the endless-action search with an actor. Their main difference is how they explore and how they respond when the critic is wrong.",
      sections: [
        { title: "DDPG follows the slope of the critic's map", paragraphs: ["DDPG's actor always gives one action for a state. The critic says how its prediction would change if that action moved a little. This slope flows back through the actor. Exploration comes from noise added around the chosen action. A false slope can therefore send the actor the wrong way."] },
        { title: "TD3 slows three routes by which an error can grow", paragraphs: ["First, TD3 uses the lower of two critic targets. Second, it updates the actor less often. Third, it adds a little noise to the target action, so a very narrow fake peak is less attractive. Each repair has a cost, including possible underestimation or slower learning."] },
        { title: "SAC makes randomness part of the learning goal", paragraphs: ["SAC's actor produces a distribution instead of one fixed action. It seeks reward and entropy. Entropy is high when several actions remain plausible. A temperature called alpha decides how much that variety is worth. It can be adjusted during training toward a chosen target entropy."] },
        { title: "Replay saves interaction but does not fill blank regions", paragraphs: ["DDPG, TD3, and SAC can train many times from stored transitions. That makes them off-policy and often saves real interaction. Yet the critic has direct evidence only near recorded actions. Far outside that region, a confident value may be a guess. Warm-up data and exploration change what replay covers." ] },
      ],
    },
    equations: [
      { latex: "\\nabla_\\theta J\\approx\\mathbb{E}_{s\\sim D}\\left[\\nabla_a Q_\\phi(s,a)|_{a=\\mu_\\theta(s)}\\nabla_\\theta\\mu_\\theta(s)\\right]", read: "The deterministic actor follows the direction in which its critic predicts a better action.", meaning: "This avoids listing every action. It also means that a wrong critic slope can become a wrong policy move." },
      { latex: "J_{SAC}=\\mathbb{E}\\left[\\sum_{t=0}^{\\infty}\\gamma^t\\left(R_{t+1}+\\alpha\\mathcal{H}(\\pi(\\cdot\\mid S_t))\\right)\\right]", read: "SAC adds policy entropy, multiplied by alpha, to the usual stream of rewards.", meaning: "Randomness is part of the goal, not just outside exploration noise. Alpha controls how strongly the policy values that randomness." },
    ],
    boundary: {
      title: "A smooth action in a simulator may fail on a real machine", paragraphs: ["A simulator may ignore motor delay, wear, loose parts, and sensor failure. It may also reset after every mistake. A high simulator score does not prove that the same small control changes will work on a physical robot." ,"Two critics and a random policy only manage learning errors. They are not emergency brakes. A real system still needs action limits, shutdown rules, staged testing, and evidence collected under realistic conditions."],
    },
    nextBridge: "One actor can collect only one stream of experience at a time. We might run many actors in parallel and send all their data to one learner. That sounds like a speed trick, but it creates a new question: how old is a trajectory by the time the learner finally uses it?",
    sources: [{ label: "Lillicrap et al. — Continuous control with deep reinforcement learning", url: "https://arxiv.org/abs/1509.02971", kind: "paper" }, { label: "Fujimoto, van Hoof, and Meger — Addressing Function Approximation Error in Actor-Critic Methods", url: "https://proceedings.mlr.press/v80/fujimoto18a.html", kind: "paper" }, { label: "Haarnoja et al. — Soft Actor-Critic", url: "https://proceedings.mlr.press/v80/haarnoja18b.html", kind: "paper" }],
  },
  {
    slug: "distributed-rl",
    title: "More actors collect faster, but their experience arrives from the past",
    deck: "Many workers can gather experience at once. While they act, the learner keeps changing. Distributed reinforcement learning must handle data made by older versions of the policy.",
    openingQuestion: "If a worker starts a game with version 100 and returns when the learner is at version 130, whose behavior does its story describe?",
    bridge: "Replay already mixes experience from different times. Now imagine one hundred workers, called actors, each running its own environment. They fetch a policy, act for a while, and send back a trajectory. During that delay, a central learner may update many times. Faster collection therefore creates older data as well as more data.",
    situation: {
      title: "The learner and its actors no longer share one present",
      paragraphs: ["An actor downloads policy version 100 and starts collecting steps. The learner does not wait. It may reach version 130 before that actor's data arrives. The trajectory is valid evidence about version 100, not a fresh sample from version 130." ,"Different systems handle this split in different ways. Asynchronous Advantage Actor-Critic, or A3C, lets workers send gradients without waiting. Ape-X sends many actors' transitions into one replay store. Importance Weighted Actor-Learner Architecture, or IMPALA, corrects delayed trajectories with V-trace." ,"Recurrent Replay Distributed DQN, or R2D2, also stores sequences for agents with memory. It must rebuild the hidden memory that existed before a sampled sequence. In every design, queues, version gaps, and refresh schedules change the learning problem."],
    },
    diagram: {
      title: "Follow one trajectory from an old actor to a new learner", caption: "Every wait makes the data older. Version numbers and queue time show where that delay entered.",
      items: [
        { label: "Actor", value: "policy version k", note: "Collect a trajectory with the last downloaded policy." },
        { label: "Queue", value: "wait or replay", note: "Store and transport the trajectory while the learner continues." },
        { label: "Learner", value: "policy version k+n", note: "Use the older trajectory in a newer update." },
        { label: "Refresh", value: "new parameters", note: "Send newer weights back to actors often enough to limit lag." },
      ],
    },
    workedExample: {
      title: "One sample arrives 30 versions late",
      setup: "An actor used version 100 and chose an action with probability 0.20. When its sample arrives, the learner is at version 130 and gives the same action probability 0.50.",
      prediction: "The version gap says the sample is old. How different is the action probability, and why might IMPALA cap the correction?",
      steps: [
        { label: "Count the delay", calculation: "130−100=30 learner updates", explanation: "The sample crossed 30 learner versions. This is easy to log, but it does not show the exact behavior change." },
        { label: "Compare action probabilities", calculation: "ρ=0.50/0.20=2.5", explanation: "The current policy makes this action 2.5 times as likely as the actor did." },
        { label: "Cap the correction", calculation: "ρ̄=min(c,2.5)", explanation: "V-trace limits how much one badly mismatched sample can change the update." },
        { label: "Reduce the cause", calculation: "refresh actors, shorten rollouts, or tune queue", explanation: "A correction helps after lag appears. Better system timing can make the lag smaller." },
      ],
      result: "The number 30 measures system age. The ratio 2.5 measures this action's mismatch. V-trace controls the sample's influence, while the system design controls why it became old.",
    },
    mechanism: {
      introduction: "Distributed learning is not merely the same algorithm on more machines. Data routes and delays decide what evidence reaches each update.",
      sections: [
        { title: "A3C lets workers update without waiting", paragraphs: ["Each A3C worker collects a short trip with its local parameters. It then sends a gradient to shared parameters. Other workers may have updated the model in the meantime, so the gradient can be old. Advantage Actor-Critic, or A2C, waits and combines workers into one synchronized batch instead."] },
        { title: "Ape-X separates collecting speed from learning speed", paragraphs: ["Ape-X uses many actors to fill one prioritized replay store. Actors can use different exploration rates. A central learner samples from the store and trains quickly. Fast environments and high priorities may dominate the data, so more samples do not automatically mean more balanced coverage."] },
        { title: "IMPALA corrects, but cannot erase, policy lag", paragraphs: ["IMPALA lets trajectories stream to the learner without making actors wait. V-trace compares the current policy with the behavior policy that made each action. It caps large ratios to control wild updates. The cap lowers variance but also accepts some bias." ] },
        { title: "R2D2 must rebuild what the recurrent agent remembered", paragraphs: ["A recurrent agent's hidden state summarizes earlier observations. Starting a replayed sequence with empty memory can create a state the actor never had. R2D2 first replays a burn-in prefix without training on it. This rebuilds a more suitable hidden state before the learning section begins." ] },
      ],
    },
    equations: [
      { latex: "\\rho_t=\\min\\left(\\bar\\rho,\\frac{\\pi(A_t|S_t)}{\\mu(A_t|S_t)}\\right),\\qquad c_t=\\min\\left(\\bar c,\\frac{\\pi(A_t|S_t)}{\\mu(A_t|S_t)}\\right)", read: "V-trace divides the current action probability by the old behavior probability, then caps that ratio.", meaning: "The cap stops one stale sample from having huge influence. This adds some bias, and it requires the actor to save its original probability correctly." },
      { latex: "\\text{policy lag}=\\text{learner version at update}-\\text{actor version at collection}", read: "Policy lag subtracts the actor's collection version from the learner's current version.", meaning: "The result helps find old queues or slow refreshes. The same version gap can still represent very different changes in behavior." },
    ],
    boundary: {
      title: "A busy system is not necessarily a learning system", paragraphs: ["A dashboard may show more environment steps each second while the learner receives repeated or very old data. A growing queue can make the number look better and the evidence worse. We must compare return, data use, wall time, and policy lag together." ,"Failures can also stay quiet. Some actors may crash, priorities may stop changing, or parameters may fail to reach part of the fleet. Version logs, queue ages, actor health, and recovery tests are part of proving that the algorithm actually ran as intended."],
    },
    nextBridge: "Many actors can collect more observations, but they cannot reveal information that the environment never shows. Sometimes two different situations look identical right now, and only the recent past tells them apart. The next part asks how an agent can remember or estimate what is hidden.",
    sources: [{ label: "Espeholt et al. — IMPALA", url: "https://proceedings.mlr.press/v80/espeholt18a.html", kind: "paper" }, { label: "Horgan et al. — Distributed Prioritized Experience Replay", url: "https://arxiv.org/abs/1803.00933", kind: "paper" }, { label: "Kapturowski et al. — Recurrent Experience Replay in Distributed Reinforcement Learning", url: "https://openreview.net/forum?id=r1lyTjAqYX", kind: "paper" }],
  },
] satisfies readonly ChapterArticle[];
