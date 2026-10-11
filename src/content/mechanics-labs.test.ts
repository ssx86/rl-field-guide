import { describe, expect, it } from "vitest";
import { MECHANICS_LABS } from "@/content/mechanics-labs";

const REQUIRED_LABS = [
  "foundations",
  "deep-value",
  "policy-learning",
  "continuous-control",
  "model-based",
  "modern-practice",
  "challenge-lab",
  "formula-atlas",
] as const;

describe("mechanics workbenches", () => {
  it("adds three causal experiments to every concept-first route", () => {
    expect(Object.keys(MECHANICS_LABS)).toEqual(REQUIRED_LABS);
    for (const lab of Object.values(MECHANICS_LABS)) {
      expect(lab.cases).toHaveLength(3);
      for (const item of lab.cases) {
        expect(item.givens.length).toBeGreaterThanOrEqual(2);
        expect(item.operation.length).toBeGreaterThan(12);
        expect(item.result.length).toBeGreaterThan(2);
        expect(item.interpretation.length).toBeGreaterThan(24);
      }
    }
  });

  it("keeps every workbench entirely in English", () => {
    expect(JSON.stringify(MECHANICS_LABS)).not.toMatch(/[\u3400-\u9fff]/);
  });
});
