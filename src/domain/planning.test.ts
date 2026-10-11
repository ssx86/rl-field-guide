import { describe, expect, it } from "vitest";
import {
  createInitialValues,
  orderedBackwardPass,
  qLearningEpisode,
  synchronousBellmanSweep,
} from "./planning";

describe("known-model planning lesson", () => {
  it("propagates the terminal reward by one predecessor per synchronous sweep", () => {
    const initial = createInitialValues();
    const first = synchronousBellmanSweep(initial);
    const second = synchronousBellmanSweep(first.values);

    expect(first.values).toEqual([-1, -1, -1, -1, -1, 10, 0]);
    expect(first.changedStates).toEqual([0, 1, 2, 3, 4, 5]);
    expect(second.values[4]).toBe(8);
    expect(second.values[3]).toBe(-1.9);
  });

  it("solves the acyclic corridor in one ordered backward pass", () => {
    const result = orderedBackwardPass(createInitialValues());

    expect(result.values).toEqual([1.81, 3.12, 4.58, 6.2, 8, 10, 0]);
    expect(result.changedStates).toEqual([5, 4, 3, 2, 1, 0]);
  });

  it("uses sampled experience so an early state needs later episodes to receive the reward", () => {
    const first = qLearningEpisode(createInitialValues(), { alpha: 1, gamma: 0.9 });
    const second = qLearningEpisode(first.values, { alpha: 1, gamma: 0.9 });

    expect(first.values).toEqual([-1, -1, -1, -1, -1, 10, 0]);
    expect(second.values[4]).toBe(8);
    expect(second.values[0]).toBe(-1.9);
  });

  it("never bootstraps from the terminal state", () => {
    const values = [0, 0, 0, 0, 0, 0, 999];
    const result = synchronousBellmanSweep(values);

    expect(result.values[5]).toBe(10);
  });
});
