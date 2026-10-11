export interface ExtensionConcept {
  readonly title: string;
  readonly summary: string;
  readonly useWhen: string;
  readonly boundary: string;
}

export const FOUNDATIONAL_EXTENSIONS = {
  planning: {
    eyebrow: "Complete planning family",
    title: "Evaluation, improvement, and optimality",
    intro: "The corridor experiment isolates backup order. The wider dynamic-programming family changes which policy is evaluated and when actions are improved.",
    concepts: [
      { title: "Policy evaluation", summary: "Apply Bellman expectation backups until V^π is accurate enough for the current policy.", useWhen: "A policy is fixed and the model is known.", boundary: "Approximate evaluation can be sufficient; exact convergence before improvement is not mandatory." },
      { title: "Policy improvement", summary: "Choose actions greedily with respect to the evaluated one-step lookahead values.", useWhen: "The model can score alternative actions from each state.", boundary: "Ties and stochastic constraints must be handled explicitly." },
      { title: "Policy iteration", summary: "Alternate policy evaluation and greedy policy improvement until the policy stops changing.", useWhen: "Repeated evaluation is affordable and an explicit policy is useful.", boundary: "Large state spaces need approximate evaluation or function approximation." },
      { title: "Value iteration", summary: "Apply Bellman optimality backups, combining truncated evaluation and improvement in every sweep.", useWhen: "The goal is an optimal value function rather than full evaluation of each intermediate policy.", boundary: "Asynchronous order changes speed, not the fixed point, under standard finite discounted assumptions." },
    ],
  },
  bandits: {
    eyebrow: "Complete bandit family",
    title: "Uncertainty can be represented three ways",
    intro: "Epsilon-greedy buys information randomly and UCB adds an optimism bonus. Other bandits model posterior uncertainty, context, or drift directly.",
    concepts: [
      { title: "Thompson sampling", summary: "Sample one plausible reward parameter from each posterior and act greedily in that sampled world.", useWhen: "A probabilistic reward model and calibrated prior are available.", boundary: "A misspecified posterior can be confidently wrong." },
      { title: "Contextual bandit", summary: "Condition each action's expected immediate reward on features observed before the choice.", useWhen: "Users or situations differ, but actions do not change later states.", boundary: "Delayed action-dependent consequences turn the task into an MDP." },
      { title: "Nonstationary bandit", summary: "Use recency weighting, sliding windows, or change detection when reward distributions drift.", useWhen: "Old evidence becomes less predictive over time.", boundary: "Forgetting too quickly creates noise; forgetting too slowly misses change." },
      { title: "Regret and best-arm identification", summary: "Cumulative regret values reward during learning; pure exploration instead spends samples to identify the best arm confidently.", useWhen: "The deployment objective decides whether reward now or confidence later matters.", boundary: "These objectives require different stopping and sampling rules." },
    ],
  },
} as const;
