import { describe, expect, it } from "vitest";
import { CHAPTERS } from "@/content/chapters";

describe("legacy English chapter library", () => {
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

  it("gives every chapter concepts, worked examples, a counterexample, and no Chinese learner copy", () => {
    for (const chapter of Object.values(CHAPTERS)) {
      expect(chapter.concepts.length, chapter.id).toBeGreaterThanOrEqual(4);
      expect(chapter.examples.length, chapter.id).toBeGreaterThanOrEqual(2);
      expect(chapter.counterexample.length, chapter.id).toBeGreaterThan(20);
      expect(JSON.stringify(chapter), chapter.id).not.toMatch(/[\u3400-\u9fff]/);
    }
  });
});
