import { describe, expect, it } from "vitest";
import { CURRICULUM, PARTS } from "./curriculum";

const requiredCoverage = [
  "bandits",
  "mdp",
  "dynamic-programming",
  "monte-carlo",
  "td-lambda",
  "off-policy",
  "function-approximation",
  "dqn",
  "policy-gradient",
  "actor-critic",
  "continuous-control",
  "partial-observability",
  "exploration",
  "model-based",
  "imitation-learning",
  "offline-rl",
  "off-policy-evaluation",
  "hierarchical-rl",
  "multi-agent-rl",
  "safe-rl",
  "evaluation",
  "rlhf",
  "preference-optimization",
  "rlvr",
] as const;

describe("comprehensive curriculum", () => {
  it("defines 46 ordered reading chapters across 9 parts", () => {
    expect(PARTS).toHaveLength(9);
    expect(CURRICULUM).toHaveLength(46);
    expect(CURRICULUM.map((chapter) => chapter.order)).toEqual(
      Array.from({ length: 46 }, (_, index) => index + 1),
    );
  });

  it("gives every chapter a unique route and a narrative bridge", () => {
    const slugs = CURRICULUM.map((chapter) => chapter.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const chapter of CURRICULUM) {
      expect(chapter.title.length).toBeGreaterThan(8);
      expect(chapter.purpose.length).toBeGreaterThan(40);
      expect(chapter.bridgeFromPrevious.length).toBeGreaterThan(40);
      expect(chapter.coverage.length).toBeGreaterThan(0);
    }
  });

  it("assigns every required RL family to at least one chapter", () => {
    const tags = new Set(CURRICULUM.flatMap((chapter) => chapter.coverage));
    for (const tag of requiredCoverage) expect(tags.has(tag)).toBe(true);
  });

  it("does not point a prerequisite forward in the route", () => {
    const orderBySlug = new Map(CURRICULUM.map((chapter) => [chapter.slug, chapter.order]));
    for (const chapter of CURRICULUM) {
      for (const prerequisite of chapter.prerequisites) {
        expect(orderBySlug.get(prerequisite)).toBeLessThan(chapter.order);
      }
    }
  });
});
