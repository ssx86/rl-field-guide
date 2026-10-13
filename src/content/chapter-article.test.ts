import { describe, expect, it } from "vitest";

import { PART_ONE_ARTICLES } from "@/content/chapters/part-1";
import { PART_TWO_ARTICLES } from "@/content/chapters/part-2";
import { PART_THREE_ARTICLES } from "@/content/chapters/part-3";
import { PART_FOUR_ARTICLES } from "@/content/chapters/part-4";
import { PART_FIVE_ARTICLES } from "@/content/chapters/part-5";
import { PART_SIX_ARTICLES } from "@/content/chapters/part-6";
import { PART_SEVEN_ARTICLES } from "@/content/chapters/part-7";
import { PART_EIGHT_ARTICLES } from "@/content/chapters/part-8";
import { PART_NINE_ARTICLES } from "@/content/chapters/part-9";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";
import { CURRICULUM } from "@/content/curriculum";

const articleWords = (value: unknown) => JSON.stringify(value).split(/\s+/).filter(Boolean).length;

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("Part I long-form chapter articles", () => {
  it("implements the first curriculum part in order", () => {
    const expected = CURRICULUM.filter((chapter) => chapter.part === "problem").map((chapter) => chapter.slug);
    expect(PART_ONE_ARTICLES.map((chapter) => chapter.slug)).toEqual(expected);
  });

  it("gives every chapter a bridge, situation, diagram, worked example, mechanism, boundary, next bridge, and sources", () => {
    for (const chapter of PART_ONE_ARTICLES) {
      expect(chapter.bridge.length).toBeGreaterThan(120);
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.nextBridge.length).toBeGreaterThan(100);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });

  it("keeps every equation readable in prose", () => {
    for (const chapter of PART_ONE_ARTICLES) {
      for (const equation of chapter.equations) {
        expect(equation.read.length).toBeGreaterThan(20);
        expect(equation.meaning.length).toBeGreaterThan(60);
      }
    }
  });
});

describe("Part II long-form chapter articles", () => {
  it("implements the tabular curriculum in order and at full article depth", () => {
    const expected = CURRICULUM.filter((chapter) => chapter.part === "tabular").map((chapter) => chapter.slug);
    expect(PART_TWO_ARTICLES.map((chapter) => chapter.slug)).toEqual(expected);

    for (const chapter of PART_TWO_ARTICLES) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});

describe("Part III long-form chapter articles", () => {
  it("implements approximation and scaling in curriculum order", () => {
    const expected = CURRICULUM.filter((chapter) => chapter.part === "scale").map((chapter) => chapter.slug);
    expect(PART_THREE_ARTICLES.map((chapter) => chapter.slug)).toEqual(expected);

    for (const chapter of PART_THREE_ARTICLES) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});

describe.each([
  ["memory", PART_FOUR_ARTICLES],
  ["models", PART_FIVE_ARTICLES],
] as const)("%s long-form chapter articles", (part, articles) => {
  it("matches the curriculum and supplies complete teaching evidence", () => {
    const expected = CURRICULUM.filter((chapter) => chapter.part === part).map((chapter) => chapter.slug);
    expect(articles.map((chapter) => chapter.slug)).toEqual(expected);
    for (const chapter of articles) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});

describe("reliability long-form chapter articles", () => {
  it("covers objective, constraints, experiments, and systems in curriculum order", () => {
    expect(PART_EIGHT_ARTICLES.map((chapter) => chapter.slug)).toEqual(CURRICULUM.filter((chapter) => chapter.part === "reliability").map((chapter) => chapter.slug));
    for (const chapter of PART_EIGHT_ARTICLES) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});

describe("language-model long-form chapter articles", () => {
  it("keeps RL, preference optimization, AI feedback, verification, and search distinct", () => {
    expect(PART_NINE_ARTICLES.map((chapter) => chapter.slug)).toEqual(CURRICULUM.filter((chapter) => chapter.part === "language").map((chapter) => chapter.slug));
    for (const chapter of PART_NINE_ARTICLES) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});

describe("complete article collection", () => {
  it("provides exactly one article for every curriculum chapter in route order", () => {
    expect(CHAPTER_ARTICLES).toHaveLength(46);
    expect(CHAPTER_ARTICLES.map((chapter) => chapter.slug)).toEqual(CURRICULUM.map((chapter) => chapter.slug));
    expect(new Set(CHAPTER_ARTICLES.map((chapter) => chapter.slug)).size).toBe(46);
  });

  it("keeps the major RL method families and modern post-training boundaries in the published prose", () => {
    const corpus = JSON.stringify(CHAPTER_ARTICLES).toLowerCase();
    const requiredTerms = [
      "markov decision process", "bellman", "policy iteration", "value iteration",
      "monte carlo", "td(0)", "eligibility traces", "sarsa", "expected sarsa",
      "q-learning", "double q-learning", "importance sampling", "deadly triad",
      "linear value", "neural function", "dqn", "double dqn", "dueling",
      "prioritized replay", "distributional", "noisy", "rainbow", "reinforce",
      "policy gradient", "actor–critic", "a2c", "a3c", "gae", "natural gradient",
      "trpo", "ppo", "ddpg", "td3", "sac", "ape-x", "impala", "r2d2",
      "pomdp", "belief", "curiosity", "rnd", "reward redistribution", "hindsight",
      "mcts", "alphazero", "dyna", "mpc", "pets", "mbpo", "dreamer", "muzero",
      "behavior cloning", "dagger", "inverse rl", "maximum entropy", "gail",
      "bcq", "cql", "iql", "decision transformer", "fqe", "doubly robust",
      "options", "maxq", "vdn", "qmix", "maddpg", "meta-rl", "sim-to-real",
      "reward shaping", "specification gaming", "cmdp", "cpo", "cvar",
      "random seeds", "checkpoints", "sft", "rlhf", "dpo", "ipo", "kto",
      "orpo", "simpo", "rlaif", "constitutional", "rlvr", "grpo",
      "process reward", "outcome reward", "test-time compute", "distillation",
    ];

    for (const term of requiredTerms) expect(corpus, `missing ${term}`).toContain(term);
  });

  it("keeps all deep chapters free of high-signal AI scaffolding", () => {
    const englishPatterns = [
      /here(?:'|’)s the thing/i,
      /it(?:'|’)s worth noting/i,
      /at the end of the day/i,
      /let that sink in/i,
      /stands? as a testament/i,
      /in today(?:'|’)s rapidly .+ landscape/i,
      /game[- ]changer/i,
    ];
    const chinesePatterns = [
      /值得注意的是/,
      /综上所述/,
      /归根结底/,
      /稳稳兜住/,
    ];

    for (const segment of collectStrings(CHAPTER_ARTICLES)) {
      for (const pattern of englishPatterns) expect(segment).not.toMatch(pattern);
    }
    for (const segment of collectStrings(ZH_CHAPTER_ARTICLES)) {
      for (const pattern of chinesePatterns) expect(segment).not.toMatch(pattern);
    }
  });
});

describe.each([
  ["data", PART_SIX_ARTICLES],
  ["structure", PART_SEVEN_ARTICLES],
] as const)("%s long-form chapter articles", (part, articles) => {
  it("matches the curriculum and teaches each family beyond a name check", () => {
    expect(articles.map((chapter) => chapter.slug)).toEqual(CURRICULUM.filter((chapter) => chapter.part === part).map((chapter) => chapter.slug));
    for (const chapter of articles) {
      expect(chapter.situation.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(chapter.diagram.items.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedExample.steps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.mechanism.sections.length).toBeGreaterThanOrEqual(3);
      expect(chapter.equations.length).toBeGreaterThanOrEqual(1);
      expect(chapter.boundary.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(chapter.sources.length).toBeGreaterThanOrEqual(2);
      expect(articleWords(chapter)).toBeGreaterThan(500);
    }
  });
});
