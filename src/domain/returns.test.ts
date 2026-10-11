import { describe, expect, it } from "vitest";
import {
  discountedReturn,
  importanceSamplingWeight,
  monteCarloUpdate,
  nStepReturn,
  tdZeroUpdate,
} from "@/domain/returns";

describe("return and prediction updates", () => {
  it("computes a complete discounted return from delayed rewards", () => {
    expect(discountedReturn([0, 0, 1], 0.9)).toBe(0.81);
  });

  it("moves a Monte Carlo estimate toward the observed complete return", () => {
    expect(monteCarloUpdate(0.2, 0.81, 0.5)).toEqual({
      oldValue: 0.2,
      observedReturn: 0.81,
      error: 0.61,
      newValue: 0.51,
    });
  });

  it("bootstraps a TD zero update from the next-state estimate", () => {
    expect(tdZeroUpdate({ oldValue: 0.2, reward: 0, nextValue: 0.6, gamma: 0.9, alpha: 0.5 })).toEqual({
      oldValue: 0.2,
      reward: 0,
      nextValue: 0.6,
      gamma: 0.9,
      alpha: 0.5,
      target: 0.54,
      error: 0.34,
      newValue: 0.37,
      terminal: false,
    });
  });

  it("never bootstraps across a terminal transition", () => {
    expect(tdZeroUpdate({ oldValue: 0.2, reward: 1, nextValue: 99, gamma: 0.9, alpha: 0.5, terminal: true }).target).toBe(1);
  });

  it("combines two observed rewards with a bootstrap for a two-step return", () => {
    expect(nStepReturn([0, 0], 0.8, 0.9)).toBe(0.65);
  });

  it("computes an off-policy trajectory weight from target and behavior probabilities", () => {
    expect(importanceSamplingWeight([0.8, 0.6], [0.5, 0.4])).toBe(2.4);
  });
});
