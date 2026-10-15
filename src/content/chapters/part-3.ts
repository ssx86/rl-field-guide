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
