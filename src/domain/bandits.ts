export type BanditStrategy = "epsilon-greedy" | "ucb";

export interface BanditArm {
  readonly name: string;
  readonly pulls: number;
  readonly totalReward: number;
  readonly estimate: number;
  readonly trueMean: number;
  readonly rewards: readonly number[];
}

export interface BanditDecisionTrace {
  readonly strategy: BanditStrategy;
  readonly decisionMode: "explore" | "exploit" | "uncertainty";
  readonly chosenArm: BanditArm;
  readonly reward: number;
  readonly oldEstimate: number;
  readonly newEstimate: number;
  readonly previousPulls: number;
  readonly newPulls: number;
  readonly instantRegret: number;
  readonly reason: string;
  readonly scores: readonly number[];
}

export const INITIAL_BANDIT_ARMS: readonly BanditArm[] = [
  { name: "Steady A", pulls: 4, totalReward: 12, estimate: 3, trueMean: 3, rewards: [3, 3, 3, 3] },
  { name: "Flashy B", pulls: 1, totalReward: 6, estimate: 6, trueMean: 2.8, rewards: [6, 0, 2, 3.2] },
  { name: "Untried C", pulls: 0, totalReward: 0, estimate: 0, trueMean: 4.2, rewards: [4, 5, 3.8, 4] },
] as const;

function round(value: number): number {
  return Number(value.toFixed(2));
}

export function sampleMeanUpdate(oldEstimate: number, previousPulls: number, reward: number): number {
  if (!Number.isInteger(previousPulls) || previousPulls < 0) {
    throw new RangeError("previousPulls must be a non-negative integer");
  }
  return round(oldEstimate + (reward - oldEstimate) / (previousPulls + 1));
}

export function chooseEpsilonGreedy(
  estimates: readonly number[],
  randomRoll: number,
  epsilon: number,
  exploratoryArm: number,
): { readonly arm: number; readonly mode: "explore" | "exploit" } {
  if (estimates.length === 0) throw new RangeError("At least one arm is required");
  if (epsilon < 0 || epsilon > 1) throw new RangeError("epsilon must be between zero and one");
  if (exploratoryArm < 0 || exploratoryArm >= estimates.length) throw new RangeError("exploratoryArm is outside the arm set");

  if (randomRoll < epsilon) return { arm: exploratoryArm, mode: "explore" };

  const bestEstimate = Math.max(...estimates);
  return { arm: estimates.indexOf(bestEstimate), mode: "exploit" };
}

export function ucbScore(estimate: number, totalPulls: number, armPulls: number, exploration = 2): number {
  if (armPulls === 0) return Number.POSITIVE_INFINITY;
  if (totalPulls < 1 || armPulls < 0) throw new RangeError("Pull counts must be valid");
  return round(estimate + exploration * Math.sqrt(Math.log(totalPulls) / armPulls));
}

export function chooseUcb(arms: readonly Pick<BanditArm, "estimate" | "pulls">[]): number {
  if (arms.length === 0) throw new RangeError("At least one arm is required");
  const totalPulls = arms.reduce((sum, arm) => sum + arm.pulls, 0);
  const scores = arms.map((arm) => ucbScore(arm.estimate, totalPulls, arm.pulls));
  return scores.indexOf(Math.max(...scores));
}

export function runBanditDecision(
  strategy: BanditStrategy,
  arms: readonly BanditArm[] = INITIAL_BANDIT_ARMS,
): BanditDecisionTrace {
  const totalPulls = arms.reduce((sum, arm) => sum + arm.pulls, 0);
  const scores = arms.map((arm) => ucbScore(arm.estimate, totalPulls, arm.pulls));
  const epsilonDecision = chooseEpsilonGreedy(arms.map((arm) => arm.estimate), 0.42, 0.1, 2);
  const chosenIndex = strategy === "ucb" ? chooseUcb(arms) : epsilonDecision.arm;
  const chosenArm = arms[chosenIndex];
  const reward = chosenArm.rewards[chosenArm.pulls % chosenArm.rewards.length];
  const bestMean = Math.max(...arms.map((arm) => arm.trueMean));

  return {
    strategy,
    decisionMode: strategy === "ucb" ? "uncertainty" : epsilonDecision.mode,
    chosenArm,
    reward,
    oldEstimate: chosenArm.estimate,
    newEstimate: sampleMeanUpdate(chosenArm.estimate, chosenArm.pulls, reward),
    previousPulls: chosenArm.pulls,
    newPulls: chosenArm.pulls + 1,
    instantRegret: round(bestMean - chosenArm.trueMean),
    reason: strategy === "ucb" && chosenArm.pulls === 0
      ? `${chosenArm.name} has not been tried, so its uncertainty bonus is treated as infinite.`
      : `The epsilon roll is 0.42, above epsilon 0.10, so the largest current estimate is exploited.`,
    scores,
  };
}
