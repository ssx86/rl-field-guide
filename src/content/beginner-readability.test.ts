import { describe, expect, it } from "vitest";

import type { ChapterArticle } from "@/content/chapter-article";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";

const REWRITTEN_FOR_BEGINNERS = [
  "before-rl",
  "interaction-loop",
  "return-horizon",
  "probability-expectation",
  "bandits-contextual-bandits",
  "mdp-state-design",
  "value-bellman",
  "dynamic-programming",
  "monte-carlo",
  "td-traces",
  "tabular-control",
  "off-policy-deadly-triad",
  "linear-approximation",
  "neural-approximation",
  "dqn",
  "dqn-family",
  "reinforce-policy-gradient",
  "actor-critic-gae",
  "trpo-ppo",
  "continuous-control",
  "distributed-rl",
  "pomdp-memory",
  "deep-exploration",
  "long-horizon-credit",
  "mcts-alphazero",
  "dyna-mpc",
  "latent-world-models",
  "behavior-cloning-dagger",
  "inverse-rl-gail",
  "offline-rl",
  "decision-transformer",
  "off-policy-evaluation",
] as const;

function visibleProse(chapter: ChapterArticle): string[] {
  return [
    chapter.deck,
    chapter.openingQuestion,
    chapter.bridge,
    ...chapter.situation.paragraphs,
    chapter.diagram.caption,
    ...chapter.diagram.items.map((item) => item.note),
    chapter.workedExample.setup,
    chapter.workedExample.prediction,
    ...chapter.workedExample.steps.map((step) => step.explanation),
    chapter.workedExample.result,
    chapter.mechanism.introduction,
    ...chapter.mechanism.sections.flatMap((section) => section.paragraphs),
    ...chapter.equations.flatMap((equation) => [equation.read, equation.meaning]),
    ...chapter.boundary.paragraphs,
    chapter.nextBridge,
    ...(chapter.narrative ?? []).flatMap((block) => block.type === "section" ? block.paragraphs : []),
  ];
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

describe("chapters rewritten for a young first-time reader", () => {
  for (const slug of REWRITTEN_FOR_BEGINNERS) {
    it(`${slug} keeps both languages within the plain-language sentence budget`, () => {
      const english = CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug)!;
      const chinese = ZH_CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug)!;
      const englishLengths = visibleProse(english)
        .flatMap((text) => text.split(/[.!?]+/))
        .map((sentence) => sentence.trim())
        .filter(Boolean)
        .map((sentence) => sentence.split(/\s+/).length);
      const chineseLengths = visibleProse(chinese)
        .flatMap((text) => text.replace(/（[^）]+）/g, "").split(/[。！？；]+/))
        .map((sentence) => sentence.trim())
        .filter(Boolean)
        .map((sentence) => [...sentence].length);

      expect(Math.max(...englishLengths), `${slug} English maximum`).toBeLessThanOrEqual(30);
      expect(average(englishLengths), `${slug} English average`).toBeLessThanOrEqual(13);
      expect(Math.max(...chineseLengths), `${slug} Chinese maximum`).toBeLessThanOrEqual(60);
      expect(average(chineseLengths), `${slug} Chinese average`).toBeLessThanOrEqual(27);
    });
  }
});
