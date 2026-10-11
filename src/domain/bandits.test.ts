import { describe, expect, it } from "vitest";
import {
  chooseEpsilonGreedy,
  chooseUcb,
  runBanditDecision,
  sampleMeanUpdate,
  ucbScore,
} from "@/domain/bandits";

describe("bandit calculations", () => {
  it("updates a sample-average estimate from the observed reward", () => {
    expect(sampleMeanUpdate(3, 4, 5)).toBe(3.4);
  });

  it("uses the greedy arm when the epsilon roll is outside exploration", () => {
    const decision = chooseEpsilonGreedy([3, 6, 0], 0.42, 0.1, 2);

    expect(decision).toEqual({ arm: 1, mode: "exploit" });
  });

  it("uses the supplied exploratory arm when the epsilon roll triggers exploration", () => {
    const decision = chooseEpsilonGreedy([3, 6, 0], 0.04, 0.1, 2);

    expect(decision).toEqual({ arm: 2, mode: "explore" });
  });

  it("gives an untried arm an infinite UCB score", () => {
    expect(ucbScore(0, 5, 0)).toBe(Number.POSITIVE_INFINITY);
    expect(chooseUcb([
      { estimate: 3, pulls: 4 },
      { estimate: 6, pulls: 1 },
      { estimate: 0, pulls: 0 },
    ])).toBe(2);
  });

  it("returns one trace that powers the decision, estimate, and regret displays", () => {
    const trace = runBanditDecision("ucb");

    expect(trace.chosenArm.name).toBe("Untried C");
    expect(trace.reward).toBe(4);
    expect(trace.newEstimate).toBe(4);
    expect(trace.instantRegret).toBe(0);
    expect(trace.reason).toContain("has not been tried");
    expect(trace.updatedArms[2]).toMatchObject({ pulls: 1, totalReward: 4, estimate: 4 });
    expect(trace.updatedScores[2]).toBe(6.68);
  });
});
