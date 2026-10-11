import { describe, expect, it } from "vitest";
import { CHAPTERS } from "@/content/chapters";
import { FOUNDATIONAL_EXTENSIONS } from "@/content/foundational-extensions";

const REQUIRED_TERMS = [
  "agent", "environment", "observation", "state", "action", "reward", "return", "episode",
  "Monte Carlo", "importance sampling", "TD(0)", "n-step", "eligibility traces",
  "SARSA", "Expected SARSA", "Q-learning", "Double Q-learning",
  "function approximation", "DQN", "replay", "target network", "Double DQN", "dueling", "prioritized replay",
  "policy gradient", "REINFORCE", "baseline", "advantage", "actor-critic", "GAE", "PPO",
  "DDPG", "TD3", "SAC", "Dyna", "MPC", "MCTS", "world models",
  "offline RL", "imitation learning", "inverse RL", "hierarchical RL", "multi-agent RL", "POMDP",
  "safety", "reward hacking", "reproducibility", "RLHF",
  "policy evaluation", "policy iteration", "value iteration", "Thompson sampling", "contextual bandit", "nonstationary",
  "distributional RL", "C51", "Rainbow", "A2C", "A3C", "TRPO", "natural gradient",
  "CQL", "IQL", "off-policy evaluation", "FQE", "Decision Transformer",
  "AlphaZero", "MuZero", "Dreamer", "intrinsic motivation", "curiosity", "meta-RL", "curriculum",
  "sim-to-real", "domain randomization", "constrained MDP", "risk-sensitive",
] as const;

describe("complete RL course coverage", () => {
  it("contains every overview chapter outside the two bespoke labs", () => {
    expect(Object.keys(CHAPTERS)).toEqual([
      "foundations",
      "returns",
      "td-control",
      "deep-value",
      "policy-learning",
      "continuous-control",
      "model-based",
      "modern-practice",
      "challenge-lab",
      "formula-atlas",
    ]);
  });

  it("covers the agreed core and modern RL vocabulary", () => {
    const corpus = JSON.stringify({ CHAPTERS, FOUNDATIONAL_EXTENSIONS }).toLowerCase();
    for (const term of REQUIRED_TERMS) expect(corpus, `missing ${term}`).toContain(term.toLowerCase());
  });

  it("gives every chapter concepts, worked examples, a counterexample, and no Chinese learner copy", () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(chapter.concepts.length, chapter.id).toBeGreaterThanOrEqual(4);
      expect(chapter.examples.length, chapter.id).toBeGreaterThanOrEqual(2);
      expect(chapter.counterexample.length, chapter.id).toBeGreaterThan(20);
      expect(JSON.stringify(chapter), chapter.id).not.toMatch(/[\u3400-\u9fff]/);
    }
  });
});
