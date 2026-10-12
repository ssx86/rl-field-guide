import type { ChapterArticle } from "@/content/chapter-article";

const SUTTON_BARTO = {
  label: "Sutton and Barto — Reinforcement Learning: An Introduction, second edition",
  url: "https://incompleteideas.net/book/RLbook2020.pdf",
  kind: "book",
} as const;

export const PART_ONE_ARTICLES = [
  {
    slug: "before-rl",
    title: "Before RL: decide whether learning from consequences is needed",
    deck: "Reinforcement learning is a way to learn behavior from consequences over time. It is not a decorative replacement for rules, supervised prediction, search, or ordinary optimization.",
    openingQuestion: "If a system receives a score, does that automatically make it a reinforcement-learning problem?",
    bridge: "A course about reinforcement learning should not begin by assuming reinforcement learning is the answer. It should begin with the decision problem. This chapter gives you a practical filter: identify who supplies the answer, whether an action changes the next situation, and whether success depends on a sequence rather than one isolated output.",
    situation: {
      title: "Three systems can look intelligent for three different reasons",
      paragraphs: [
        "Consider an automatic door, a photo classifier, and a warehouse robot. The door reacts to a sensor using a rule chosen by an engineer. The classifier receives photographs paired with correct labels during training. The robot chooses turns while congestion, battery level, and its own earlier route choices change what remains possible. All three systems process information, but only the third naturally asks how behavior should improve from a stream of consequences.",
        "The important difference is not the presence of a number called reward. You could assign the photo classifier one point for a correct label and still be doing supervised learning, because the correct answer is supplied for each example. You could give the automatic door a score for opening quickly and still keep a fixed controller, because no learning may be needed. RL becomes useful when the correct action is not directly labeled and the learner must discover a policy by interacting with, or learning from records of, a sequential process.",
        "That distinction protects you from a common engineering failure: turning a simpler problem into a harder one. RL adds exploration, delayed credit, non-stationary data, and evaluation risk. Those costs are justified only when actions shape future opportunities and the objective concerns the resulting trajectory. If a fixed rule, a planner with a complete model, supervised learning, or contextual bandits solve the actual problem, choosing them is a sign of good judgment rather than a failure to use RL.",
      ],
    },
    diagram: {
      title: "Ask three questions before naming an algorithm",
      caption: "The route reaches RL only when the system must choose behavior from consequences across time; a reward-shaped metric alone is not enough.",
      items: [
        { label: "Is the correct output supplied?", value: "Yes → supervised learning", note: "A labeled answer can train a predictor directly." },
        { label: "Is the environment fully known?", value: "Yes → planning may suffice", note: "Search or optimization can compute behavior without learning it from experience." },
        { label: "Does one action change later choices?", value: "Yes → sequential decision problem", note: "Now the quality of an action depends on the future it creates." },
        { label: "Must behavior improve from consequences?", value: "Yes → RL is a candidate", note: "The learner needs a policy, feedback, and evidence that the policy improved." },
      ],
    },
    workedExample: {
      title: "Classify a delivery-routing request before solving it",
      setup: "A courier company wants to reduce average delivery time. It has a street map, yesterday's traffic logs, and drivers who make a sequence of route choices. Decide which tool is justified under three versions of the problem.",
      prediction: "Before reading the steps, predict which version actually requires learning a policy from consequences.",
      steps: [
        { label: "Version A — known travel times", calculation: "shortest path on a weighted graph", explanation: "If travel times are fixed and known, a graph algorithm plans the route. There is no unknown behavior to learn." },
        { label: "Version B — predict one road's delay", calculation: "features → estimated minutes", explanation: "If each road segment has a target delay in historical data, supervised regression can predict it. A separate planner can use those predictions." },
        { label: "Version C — repeated routing under changing congestion", calculation: "route choice → new location and traffic exposure → later choices", explanation: "An early detour changes both the vehicle's future position and the congestion it encounters. Feedback arrives through the whole trip, so a sequential policy may be useful." },
        { label: "Evidence check", calculation: "compare against rule, prediction-plus-planning, and contextual-bandit baselines", explanation: "Calling Version C RL does not prove RL wins. The claim needs controlled evaluation against simpler alternatives." },
      ],
      result: "Only Version C clearly has the full RL shape, and even there RL remains a hypothesis to test. Problem classification narrows the method family; empirical evidence decides whether the added complexity earns its cost.",
    },
    mechanism: {
      introduction: "The core RL mechanism is a feedback loop, but each word in that phrase has a job. The following distinctions will remain stable throughout the course.",
      sections: [
        { title: "A policy chooses behavior, not just a prediction", paragraphs: ["A predictor maps input to an estimate. A policy maps the information available now to an action or a distribution over actions. The policy matters because its choices influence the data it will see next. A navigation policy that avoids unfamiliar streets may never collect evidence that one of them is faster."] },
        { title: "Consequences replace per-action answer keys", paragraphs: ["The environment usually does not reveal the uniquely correct action. It reveals what happened after the chosen action: perhaps a small immediate cost, a changed state, and a much later successful delivery. Learning must infer which aspects of behavior contributed to that outcome. This is the credit-assignment problem."] },
        { title: "Exploration changes the data-generating process", paragraphs: ["In supervised learning, a dataset can be treated as given. In online RL, the current policy helps create the next dataset. Trying an uncertain action may reduce immediate performance but teach the agent something useful. Avoiding it may look safe while permanently hiding a better strategy."] },
        { title: "Return evaluates a trajectory", paragraphs: ["RL usually compares behavior through cumulative reward, called return, rather than through one reward in isolation. This does not mean every real objective can be reduced safely to one number. It means the mathematical interface needs an explicit signal, whose validity must be audited against the real outcome people care about."] },
      ],
    },
    equations: [],
    boundary: {
      title: "A reward number does not certify the framing",
      paragraphs: [
        "A static recommender trained from clicks may be supervised learning, a contextual bandit, offline RL, or a causal-inference problem depending on how actions affect later observations and how the data was collected. The product label cannot settle the technical question. Draw the timeline and ask what would have been observed under actions that were not taken.",
        "RL is also not permission to experiment carelessly. In medicine, hiring, credit, or industrial control, exploration can impose real harm. Historical data, simulation, constraints, human review, or a non-RL solution may be required. A method is not appropriate merely because its objective can be written as a reward.",
      ],
    },
    nextBridge: "Once a problem survives this filter, the next task is to draw its interface. We need to say what lies inside the agent, what lies in the environment, what information is observed, what action is chosen, and exactly when the consequence arrives.",
    sources: [
      SUTTON_BARTO,
      { label: "OpenAI Spinning Up — What is RL?", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html", kind: "official documentation" },
    ],
  },
  {
    slug: "interaction-loop",
    title: "Draw the agent–environment interface before choosing a method",
    deck: "An RL problem becomes testable only after observations, states, actions, rewards, transitions, and episode boundaries are attached to a precise timeline.",
    openingQuestion: "When a robot sees an image and moves, which parts belong to the agent, which belong to the environment, and what must the state remember?",
    bridge: "The previous chapter decided when a sequence of consequences makes RL plausible. That decision is still too vague to implement. We now turn the story into an interface: at each time step, the agent receives information, selects an action, and the environment produces the next information and reward. Every later algorithm assumes this loop even when its code hides it.",
    situation: {
      title: "A cleaning robot exposes the boundary choices",
      paragraphs: [
        "Imagine a cleaning robot in an office. Its sensors report nearby walls, visible dirt, battery level, and perhaps a map. The robot chooses a motion command. The building then determines whether the wheels slip, how much battery is consumed, what the next sensors report, and whether dirt was removed. The robot does not choose those consequences; it chooses only the action sent across the boundary.",
        "The word state is often used casually for whatever array enters a neural network. In the theory, a state is sufficient information for predicting the distribution of the next reward and state after each possible action. An observation is simply what the agent receives. A single camera frame can be an observation without being a Markov state: two identical-looking frames may correspond to different velocities, battery histories, or hidden door states.",
        "The boundary is a modeling decision, not a fact found in nature. If route planning is inside the agent, the action may be a motor command. If a low-level controller is fixed and outside the learned policy, the action may be a waypoint. The same physical system can therefore yield different RL problems. The useful boundary is the one that makes decisions, feedback, safety controls, and evaluation assumptions explicit.",
      ],
    },
    diagram: {
      title: "One transition has an order",
      caption: "The agent sees information at time t, chooses an action, and only then receives the next reward and information. Index conventions vary, so code and equations must state which one they use.",
      items: [
        { label: "Information now", value: "Sₜ or Oₜ", note: "State is sufficient by assumption; observation may be partial." },
        { label: "Decision", value: "Aₜ ~ π(· | information)", note: "The policy may choose deterministically or sample from a distribution." },
        { label: "Environment response", value: "Rₜ₊₁, Sₜ₊₁", note: "The consequence follows the action and may be stochastic." },
        { label: "Accumulated record", value: "trajectory τ", note: "A trajectory contains the ordered sequence used for learning and evaluation." },
      ],
    },
    workedExample: {
      title: "Write one robot transition without skipping the clock",
      setup: "At time t the robot is in corridor A with 40% battery. It chooses to move right. The move costs one unit of energy and succeeds with probability 0.8; otherwise wheel slip leaves it in place.",
      prediction: "Should the reward and next observation be recorded before or after the action, and how many possible next states must the model include?",
      steps: [
        { label: "Record the information", calculation: "Sₜ = (corridor A, battery 0.40)", explanation: "This is the information used to choose. If velocity or hidden obstacles affect the next outcome, this tuple is not yet a sufficient state." },
        { label: "Choose the action", calculation: "Aₜ = right", explanation: "The action belongs to the policy. A stochastic policy would also record its probability for later likelihood ratios or diagnostics." },
        { label: "Sample the transition", calculation: "P(B | A, right)=0.8; P(A | A, right)=0.2", explanation: "The same state and action can lead to more than one next state. Stochasticity is part of the environment model, not an error in notation." },
        { label: "Attach the feedback", calculation: "Rₜ₊₁ = −1", explanation: "The energy cost is associated with the transition caused by Aₜ. The next record is therefore (Sₜ, Aₜ, Rₜ₊₁, Sₜ₊₁)." },
      ],
      result: "A transition is not a bag of four values. Its order says what information was available when the action was selected and which consequence that action produced.",
    },
    mechanism: {
      introduction: "Most implementation bugs that look mathematical are interface bugs: information leaks from the future, terminal states are mislabeled, or the action boundary does not match the deployed system.",
      sections: [
        { title: "State and observation are different promises", paragraphs: ["Calling an input state asserts that history adds no predictive information once the current state and action are known. Calling it an observation makes no such promise. When the promise is false, the agent may need frame stacking, a filter, a belief state, or recurrent memory. Those remedies appear later; for now the essential habit is not to hide partial observability behind a variable named s."] },
        { title: "A policy is conditioned on available information", paragraphs: ["A policy π(a|s) assigns probabilities to actions given a state. A deterministic policy returns one action. Neither form is inherently better. Stochastic policies support exploration and can represent deliberate uncertainty; deterministic actions can be convenient in continuous control. Both must obey the same information boundary at training and deployment."] },
        { title: "The transition kernel describes uncertainty", paragraphs: ["A model P(s′,r|s,a) describes a distribution over next state and reward. A sampled transition is one observation from that distribution. Confusing the sample with the distribution leads to overconfident conclusions: seeing the right move succeed once does not establish an 80% success probability."] },
        { title: "A trajectory preserves causal order", paragraphs: ["A trajectory contains the initial information, actions, rewards, and later information in order. Algorithms may learn from individual transitions, short fragments, or complete episodes, but the order determines which targets are valid. Shuffling replay samples changes training correlation; it does not rewrite which action caused which observed transition."] },
      ],
    },
    equations: [
      { latex: "A_t \\sim \\pi(\\cdot \\mid S_t), \\qquad (R_{t+1},S_{t+1}) \\sim p(\\cdot,\\cdot \\mid S_t,A_t)", read: "Sample the action from the policy given the current state; then sample the reward and next state from the environment given that state and action.", meaning: "The factorization records the information boundary. The policy cannot condition on the next reward, and the environment response depends on the chosen action. This order is the foundation for valid learning targets." },
    ],
    boundary: {
      title: "A convenient input is not automatically a Markov state",
      paragraphs: [
        "If two histories produce the same observation but different next-outcome distributions, a memoryless policy cannot distinguish them. Adding more pixels may not help. The missing information might be velocity, an unobserved intention, a latent machine fault, or a changing user preference.",
        "The agent–environment boundary can also hide control authority. A recommendation system may propose an item while another service filters it for policy, inventory, or safety. Evaluation must model the action actually executed and the feedback actually observed, not the action the learner wished to take.",
      ],
    },
    nextBridge: "The loop produces one reward at a time, but most decisions are judged by what unfolds after many steps. The next chapter turns this stream into return, explains horizons, and separates a true terminal event from an episode cut short by a time limit.",
    sources: [
      SUTTON_BARTO,
      { label: "Farama Gymnasium — Basic usage and the step API", url: "https://gymnasium.farama.org/introduction/basic_usage/", kind: "official documentation" },
    ],
  },
  {
    slug: "return-horizon",
    title: "Connect immediate rewards to return, horizon, and episode endings",
    deck: "Return combines a stream of rewards into the quantity a policy tries to improve. Horizon and episode endings determine which future rewards still belong in that calculation.",
    openingQuestion: "If two actions earn the same reward now but lead to different futures, what exactly should the agent compare?",
    bridge: "The agent–environment loop tells us when each reward arrives, but it does not yet say how a sequence should be judged. This chapter gives that sequence a measurable target. It also fixes one of the most damaging practical mistakes in RL: treating a time limit as if the underlying task had truly ended.",
    situation: {
      title: "A short detour can be better than a quick reward",
      paragraphs: [
        "A delivery robot can take a narrow shortcut that earns an immediate progress reward of +2 but often traps it behind a closing gate, or take a wider corridor with an immediate reward of 0 that reliably reaches a destination worth +10 two steps later. Comparing only the next reward favors the shortcut. Comparing the future sequence can favor the detour.",
        "Return is the sum of rewards from a chosen time onward, often with later rewards multiplied by successive powers of a discount factor gamma. Discounting can express time preference, mathematical convenience in continuing tasks, or uncertainty about whether the process continues. It must not be explained as a universal moral claim that distant outcomes matter less.",
        "A horizon tells us how far consequences are included. Some tasks genuinely terminate: a game ends, an item is delivered, or a patient leaves the modeled care episode. Other data streams are cut off only because a simulator uses a 1,000-step time limit or a log window ends. At a true termination there is no continuation value inside the task. At a truncation the unobserved future can still have value and usually should be bootstrapped.",
      ],
    },
    diagram: {
      title: "The ending determines whether value continues",
      caption: "Termination belongs to the task definition. Truncation belongs to data collection. Both stop the recorded episode, but only termination forces the continuation value to zero.",
      items: [
        { label: "Immediate feedback", value: "Rₜ₊₁", note: "The consequence attached to the current transition." },
        { label: "Future feedback", value: "γRₜ₊₂ + γ²Rₜ₊₃ + …", note: "Later rewards remain part of the current decision's return." },
        { label: "True termination", value: "bootstrap = 0", note: "The modeled task has ended, so no in-task future remains." },
        { label: "Time-limit truncation", value: "bootstrap from V(Sₜ₊₁)", note: "The record ended, but the underlying process could continue." },
      ],
    },
    workedExample: {
      title: "Calculate the same three rewards under two discounts",
      setup: "Starting now, a route produces rewards 2, 0, and 10. Compare the undiscounted return with gamma = 1 and the discounted return with gamma = 0.9. Then decide what changes if the record stops after the second reward only because of a time limit.",
      prediction: "Before calculating, decide whether the final reward should receive zero, one, or two powers of gamma from the starting time.",
      steps: [
        { label: "Undiscounted return", calculation: "Gₜ = 2 + 0 + 10 = 12", explanation: "With gamma equal to one, every reward in this finite episode receives equal weight." },
        { label: "Discounted return", calculation: "Gₜ = 2 + 0.9×0 + 0.9²×10 = 10.1", explanation: "The reward two transitions away receives two powers of gamma, so its present contribution is 8.1." },
        { label: "True terminal after reward 0", calculation: "target = 2 + 0.9×0", explanation: "If the task genuinely ends there, no later in-task reward or value exists." },
        { label: "Truncated after reward 0", calculation: "target = 2 + 0.9×V(Sₜ₊₁)", explanation: "If the environment merely stops recording, the next state's value estimates the missing continuation. Zeroing it creates systematic bias." },
      ],
      result: "Return compares whole futures from a chosen time. Correct targets require both the reward sequence and the semantic reason an episode ended.",
    },
    mechanism: {
      introduction: "Return, horizon, and ending semantics are one connected design choice. Changing any one of them changes what behavior counts as good.",
      sections: [
        { title: "Return is indexed from a decision point", paragraphs: ["The return Gₜ begins with the reward caused after the action at time t under the convention used here. This indexing prevents a subtle off-by-one error: Rₜ₊₁ is weighted by one, not by gamma. Textbooks and libraries may use different reward labels, so the safe practice is to write one concrete transition beside the equation."] },
        { title: "Gamma changes both priorities and learning dynamics", paragraphs: ["A gamma near zero emphasizes immediate consequences. A gamma near one carries information farther but can increase variance and sensitivity to modeling errors. The effective horizon is often roughly related to 1/(1−gamma) in continuing settings, but that is an intuition, not a hard cutoff. Task horizon and discount should be reported together."] },
        { title: "Episodic and continuing tasks need different care", paragraphs: ["Episodic tasks have natural resets that are part of the problem. Continuing tasks may be divided into artificial episodes for training convenience. Average-reward formulations can avoid discounting in some continuing problems. Discounted return is common, not mandatory."] },
        { title: "Termination and truncation produce different targets", paragraphs: ["Modern environment APIs expose separate termination and truncation flags because the distinction changes bootstrapping. A terminal mask should remove future value only when the MDP says the episode ended. Tests should include both cases; otherwise a learner can appear stable while estimating systematically wrong values near time limits."] },
      ],
    },
    equations: [
      { latex: "G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots", read: "Return at time t is the next reward plus gamma times the following reward, plus gamma squared times the reward after that, and so on.", meaning: "Each power records temporal distance from the decision being evaluated. The equation compresses the visible reward timeline; it does not explain whether the chosen reward signal faithfully represents the real objective." },
      { latex: "y_t = R_{t+1} + \\gamma (1-d_t)V(S_{t+1})", read: "A one-step target is the next reward plus discounted next-state value unless the transition truly terminates the task.", meaning: "Here d is a termination indicator, not a generic episode-ended flag. A separate truncation flag should normally leave the bootstrap term intact because value continues beyond the recorded window." },
    ],
    boundary: {
      title: "Discounting cannot repair a bad reward or a broken episode definition",
      paragraphs: [
        "Lowering gamma may hide long-term harm by removing it from the effective objective. Raising gamma may make learning noisier without adding missing feedback. The choice should follow the decision horizon and evaluation goal, then be stress-tested rather than tuned only for benchmark score.",
        "Some environments include remaining time in the state when the finite horizon is part of the task. If time affects transition or reward but is hidden from the agent, the observation is not Markov. Time limits are therefore both a target-construction issue and a state-design issue.",
      ],
    },
    nextBridge: "A return from one trajectory is a single outcome, while the same policy can produce many different trajectories. To compare policies under uncertainty, the next chapter introduces probability, expectation, and stochastic policies using these concrete futures rather than a detached mathematics review.",
    sources: [
      SUTTON_BARTO,
      { label: "Farama Gymnasium — Handling time limits", url: "https://gymnasium.farama.org/tutorials/gymnasium_basics/handling_time_limits/", kind: "official documentation" },
    ],
  },
  {
    slug: "probability-expectation",
    title: "Read probability, expectation, and stochastic policies without a math detour",
    deck: "Probability describes several possible futures; expectation combines them without pretending that the average future is the one that will actually occur.",
    openingQuestion: "If an action succeeds 80% of the time for +5 and fails 20% of the time for +1, why is its expected value 4.2 even though 4.2 never occurs?",
    bridge: "Return gave each realized trajectory a number. Yet one action can lead to different trajectories, and one stochastic policy can choose different actions in the same state. We therefore need a language for distributions and averages before value functions, Bellman equations, and policy gradients can be understood precisely.",
    situation: {
      title: "One corridor, two possible outcomes",
      paragraphs: [
        "A robot can move through a glass corridor. On a clear day it reaches the next room and earns +5. With probability 0.2, glare confuses its sensor and it earns only +1 after a recovery maneuver. The action is the same in both cases; the environment outcome is random from the agent's current information.",
        "The expected reward is not the most likely reward and not a promised reward. It is a probability-weighted average over all possible outcomes. If the action were repeated under the same conditions many times, the sample average would tend toward the expectation. A single attempt still produces either +5 or +1, never +4.2.",
        "Policies can also be stochastic. A policy might choose the corridor with probability 0.7 and the stairs with probability 0.3. This randomness can support exploration, represent uncertainty, or be part of an optimal strategy in adversarial settings. Environment stochasticity and policy stochasticity are different sources of variation, and evaluation should preserve that distinction.",
      ],
    },
    diagram: {
      title: "Expectation keeps every branch and its weight",
      caption: "A distribution lists possible outcomes and probabilities. Expectation is a summary of that distribution, not a substitute for its spread or tail risk.",
      items: [
        { label: "Clear corridor", value: "0.8 × 5 = 4.0", note: "The common successful outcome contributes four units to the mean." },
        { label: "Glare and recovery", value: "0.2 × 1 = 0.2", note: "The less likely outcome still contributes; it is not discarded." },
        { label: "Expected reward", value: "4.0 + 0.2 = 4.2", note: "The weighted sum is a long-run average, not a possible single reward." },
        { label: "Risk information", value: "distribution, variance, quantiles", note: "Two actions can share the same mean while exposing the agent to very different losses." },
      ],
    },
    workedExample: {
      title: "Compare two actions with equal-looking averages",
      setup: "Action Safe always returns 4. Action Risky returns 10 with probability 0.4 and 0 with probability 0.6. A policy chooses Safe with probability 0.75 and Risky with probability 0.25.",
      prediction: "Predict the expected reward of Risky and of the policy before calculating. Then ask whether the two actions are interchangeable.",
      steps: [
        { label: "Safe expectation", calculation: "E[R | Safe] = 1×4 = 4", explanation: "A deterministic reward is a degenerate distribution concentrated at four." },
        { label: "Risky expectation", calculation: "E[R | Risky] = 0.4×10 + 0.6×0 = 4", explanation: "Risky has the same mean but a very different distribution of outcomes." },
        { label: "Policy expectation", calculation: "E[R] = 0.75×4 + 0.25×4 = 4", explanation: "The law of total expectation averages action outcomes using the policy's action probabilities." },
        { label: "Empirical estimate", calculation: "sample mean = (r₁ + … + rₙ)/n", explanation: "Finite data will not usually equal four exactly. Confidence intervals and repeated seeds describe estimation uncertainty." },
      ],
      result: "Equal expectation does not mean equal risk. The mean is central to standard RL objectives, while later chapters add distributional, constrained, robust, and risk-sensitive views.",
    },
    mechanism: {
      introduction: "Only a small probability toolkit is required to read most RL equations, but each symbol must stay tied to the sampling process that gives it meaning.",
      sections: [
        { title: "A random variable assigns numbers to outcomes", paragraphs: ["Reward and return are random variables because policies and environments can produce different outcomes. Uppercase letters often denote the random quantity; lowercase letters denote a realized value. This convention helps distinguish an expectation over possible returns from one return observed in a log."] },
        { title: "Conditioning states what information is fixed", paragraphs: ["The expression E[R|S=s,A=a] averages rewards after fixing the current state and action. It does not average over other states or actions. Value functions are conditional expectations of future return, so careless conditioning changes the question being answered."] },
        { title: "A stochastic policy is a distribution over actions", paragraphs: ["For discrete actions, the probabilities must be non-negative and sum to one. For continuous actions, a density such as a Gaussian can be sampled and transformed to respect action bounds. The probability or density of the sampled action later appears in policy-gradient and off-policy corrections."] },
        { title: "Expectation is linear, but objectives need not be", paragraphs: ["Expected sums can be rearranged conveniently, which supports Bellman decompositions. Risk measures, constraints, and utility functions may not preserve the same algebra. Optimizing expected return alone can tolerate rare catastrophic outcomes if their probability-weighted cost looks small."] },
      ],
    },
    equations: [
      { latex: "\\mathbb{E}[X] = \\sum_x p(x)x", read: "For a discrete random variable, expectation is the sum of every possible value multiplied by the probability of that value.", meaning: "The sum includes unlikely outcomes as well as likely ones. For continuous variables the corresponding operation is an integral over a probability density; the conceptual job is unchanged." },
      { latex: "\\mathbb{E}[R \\mid S=s] = \\sum_a \\pi(a\\mid s)\\,\\mathbb{E}[R \\mid S=s,A=a]", read: "Expected reward in a state averages each action's expected reward using the probability that the policy selects that action.", meaning: "This is the law of total expectation applied to a policy. It exposes two sources of uncertainty: which action the policy samples and what outcome the environment produces after that action." },
    ],
    boundary: {
      title: "An expected value can hide the outcome you most care about",
      paragraphs: [
        "A policy with slightly higher expected return can still be unacceptable if it has a small probability of severe harm. Mean, variance, quantiles, conditional value at risk, and explicit constraints answer different questions. Later reliability chapters will make those choices explicit.",
        "Probabilities estimated from policy-generated data can also be biased by selection. If the current policy rarely tries an action, the log contains little evidence about it. Treating missing counterfactual outcomes as ordinary random noise produces false confidence.",
      ],
    },
    nextBridge: "With expectation available, we can study the smallest learning problem that still requires exploration. Bandits remove state transitions and delayed credit so that action values, uncertainty, regret, and contextual decisions can be seen without the rest of RL obscuring them.",
    sources: [
      SUTTON_BARTO,
      { label: "OpenAI Spinning Up — Key concepts and notation", url: "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html#key-concepts-and-terminology", kind: "official documentation" },
    ],
  },
  {
    slug: "bandits-contextual-bandits",
    title: "Learn exploration from bandits before state transitions complicate it",
    deck: "A bandit asks one recurring question: should the learner use the option that currently looks best or spend a choice to learn about an uncertain alternative?",
    openingQuestion: "Why would a rational learner deliberately choose an option whose current estimated reward is lower?",
    bridge: "Probability let us compare uncertain outcomes. A multi-armed bandit now isolates the exploration problem by removing state transitions: choose one action, observe its reward, and return to the same decision. Because there is no delayed credit, every difference among greedy choice, optimism, posterior sampling, and regret is easier to inspect.",
    situation: {
      title: "A café must learn which menu card works",
      paragraphs: [
        "A café alternates among three digital menu cards. Card A has been shown 100 times and earns an average of 3.0 units. Card B has been shown twice and averages 3.4. Card C is new. Showing only B exploits the largest current estimate, but two observations are fragile evidence. Showing C may perform poorly today yet reveal an option that improves hundreds of later decisions.",
        "The action-value estimate is an empirical prediction of reward for each action. A greedy policy always chooses the largest estimate. Epsilon-greedy usually chooses greedily but selects a random action with probability epsilon. Upper confidence bound methods add an uncertainty bonus, while Thompson sampling draws a plausible model from a posterior and acts optimally for that sampled model.",
        "Regret measures the cumulative reward lost relative to repeatedly choosing the best action in hindsight under the bandit assumptions. It makes exploration a budgeted tradeoff rather than a moral preference for novelty. In a contextual bandit, each decision also receives context such as time, weather, or customer segment. The action affects the immediate reward but, in the basic formulation, not the next context. Once actions shape later states, we have returned to full RL.",
      ],
    },
    diagram: {
      title: "Four selection rules buy information differently",
      caption: "All four rules use action-value evidence, but their exploration mechanisms and assumptions differ. Random exploration, optimism, and posterior sampling are not synonyms.",
      items: [
        { label: "Greedy", value: "choose max Q", note: "Uses current evidence and may lock into an early mistake." },
        { label: "Epsilon-greedy", value: "random with probability ε", note: "Simple persistent exploration, even among clearly poor actions." },
        { label: "UCB", value: "estimate + uncertainty bonus", note: "Optimism favors actions that are good or insufficiently tested." },
        { label: "Thompson sampling", value: "sample model, then act", note: "Action frequency reflects posterior probability of being optimal." },
      ],
    },
    workedExample: {
      title: "Update an action value and compare greedy with UCB",
      setup: "Action Tea has been chosen 10 times with estimated reward 7.0. Its eleventh reward is 9. Action Coffee has estimate 7.1 after 100 trials. The total decision count is 111. Use a sample-average update for Tea, then reason about a UCB bonus.",
      prediction: "Will Tea's new estimate move all the way to 9, stay at 7, or move a fraction of the gap? Which action should receive the larger uncertainty bonus?",
      steps: [
        { label: "Compute the prediction error", calculation: "9 − 7.0 = 2.0", explanation: "The new reward is two units above Tea's previous estimate." },
        { label: "Use the sample-average step size", calculation: "α = 1/11", explanation: "After the eleventh Tea observation, each reward receives equal weight in the running average." },
        { label: "Update Tea", calculation: "Q₁₁(Tea) = 7.0 + (1/11)×2.0 ≈ 7.18", explanation: "The estimate moves toward the observation without forgetting the previous ten samples." },
        { label: "Compare uncertainty", calculation: "bonus ∝ √(ln 111 / N(a))", explanation: "Tea has only 11 trials while Coffee has 100, so Tea receives the larger UCB bonus even before comparing estimates." },
      ],
      result: "Greedy choice now favors Tea by estimate alone, while UCB would also recognize that Tea remains less certain. The same update equation can support different action-selection rules.",
    },
    mechanism: {
      introduction: "Bandit methods separate two operations that are often conflated: estimating what each action yields and deciding which action to sample next.",
      sections: [
        { title: "Sample averages fit stationary rewards", paragraphs: ["When an action's reward distribution is stable, the incremental sample average gives every observation equal weight. In a non-stationary problem, old data can become misleading. A constant step size forgets gradually and tracks change, but its estimate continues to fluctuate."] },
        { title: "Exploration policies encode different beliefs", paragraphs: ["Epsilon-greedy ignores how uncertain each estimate is. UCB uses visit counts to construct optimism under specific concentration assumptions. Thompson sampling requires a probabilistic model and posterior update. Their behavior can look similar on a chart while their justification and failure modes remain different."] },
        { title: "Regret evaluates learning while acting", paragraphs: ["Cumulative regret compares collected reward with an oracle that always chooses the best arm. Low simple regret instead asks whether the learner identifies a good final action. Online advertising and clinical trials can value these objectives differently, so the evaluation metric should match the decision purpose."] },
        { title: "Contextual bandits condition action values", paragraphs: ["A contextual policy chooses from information available before the action. It can learn that one menu works in the morning and another in the evening. Standard contextual-bandit analysis assumes the action does not influence future contexts. If it changes customer trust, inventory, or future eligibility, a sequential model is needed."] },
      ],
    },
    equations: [
      { latex: "Q_{n+1}(a)=Q_n(a)+\\alpha_n\\bigl(R_n-Q_n(a)\\bigr)", read: "The new estimate equals the old estimate plus a step size times the difference between the observed reward and the old estimate.", meaning: "The parenthesized term is a prediction error. With alpha equal to one over the visit count, this reproduces a sample average. With a constant alpha, recent observations keep a fixed influence." },
      { latex: "A_t=\\arg\\max_a\\left[Q_t(a)+c\\sqrt{\\frac{\\ln t}{N_t(a)}}\\right]", read: "UCB chooses the action with the largest estimated reward plus an exploration bonus that shrinks as that action is sampled more often.", meaning: "The coefficient c controls optimism. The logarithm makes the pressure to revisit an action grow slowly with total time, while the visit count reduces uncertainty for well-tested actions." },
      { latex: "\\operatorname{Regret}(T)=T\\mu^*-\\sum_{t=1}^{T}R_t", read: "Regret after T decisions is the reward an oracle best action would have earned in expectation minus the reward actually collected.", meaning: "Regret charges both poor exploitation and excessive exploration. The benchmark assumes a stable best arm; when rewards drift or actions affect the future, that comparator must be reconsidered." },
    ],
    boundary: {
      title: "A contextual bandit is not a shortcut for every recommendation system",
      paragraphs: [
        "If showing an item changes future preference, subscription status, inventory, or the information later available, the action has stateful consequences. Treating the interaction as a contextual bandit can optimize immediate clicks while ignoring retention or long-term harm.",
        "Bandit feedback also reveals only the reward for the chosen action. Offline evaluation therefore needs propensity information or experimental randomization; simply comparing average rewards across actions can confound policy choice with user context. Exploration policy and data logging are part of the evidence design.",
      ],
    },
    nextBridge: "Bandits reset after each action. The next part adds a state that persists, so an action changes not only the next reward but also the next decision. That addition creates the Markov decision process and makes state design the first major modeling problem.",
    sources: [
      SUTTON_BARTO,
      { label: "Lattimore and Szepesvári — Bandit Algorithms", url: "https://tor-lattimore.com/downloads/book/book.pdf", kind: "book" },
      { label: "Auer, Cesa-Bianchi, and Fischer — Finite-time Analysis of the Multiarmed Bandit Problem", url: "https://homes.di.unimi.it/~cesabian/Pubblicazioni/ml-02.pdf", kind: "paper" },
    ],
  },
] satisfies readonly ChapterArticle[];
