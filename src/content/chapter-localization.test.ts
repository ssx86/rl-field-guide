import { describe, expect, it } from "vitest";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { AUTHORED_CHINESE_SLUGS, ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";
import { CURRICULUM } from "@/content/curriculum";

describe("bilingual chapter corpus", () => {
  it("covers the same 46 routes in the same order", () => {
    expect(ZH_CHAPTER_ARTICLES).toHaveLength(46);
    expect(ZH_CHAPTER_ARTICLES.map((chapter) => chapter.slug)).toEqual(CURRICULUM.map((chapter) => chapter.slug));
  });

  it("keeps formulas, worked calculations, and sources identical across languages", () => {
    for (const [index, english] of CHAPTER_ARTICLES.entries()) {
      const chinese = ZH_CHAPTER_ARTICLES[index];
      expect(chinese.equations.map((item) => item.latex)).toEqual(english.equations.map((item) => item.latex));
      expect(chinese.diagram.items.map((item) => item.latex)).toEqual(english.diagram.items.map((item) => item.latex));
      expect(chinese.workedExample.steps.map((item) => item.calculation)).toEqual(english.workedExample.steps.map((item) => item.calculation));
      expect(chinese.sources).toEqual(english.sources);
    }
  });

  it("contains real Chinese teaching copy rather than English fallback pages", () => {
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      const copy = [chapter.title, chapter.deck, chapter.openingQuestion, chapter.bridge, ...chapter.situation.paragraphs, ...chapter.boundary.paragraphs].join(" ");
      expect(copy.match(/[\p{Script=Han}]/gu)?.length ?? 0).toBeGreaterThan(80);
    }
  });

  it("has replaced the first part's generated template with authored manuscripts", () => {
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining([
      "before-rl",
      "interaction-loop",
      "return-horizon",
      "probability-expectation",
      "bandits-contextual-bandits",
    ]));

    const authored = ZH_CHAPTER_ARTICLES.slice(0, 5).map((chapter) => JSON.stringify(chapter));
    for (const copy of authored) {
      expect(copy).not.toContain("阅读时先不要急着记名词");
      expect(copy).not.toContain("第 1 项展示");
      expect(copy).not.toContain("先独立复算这一行");
      expect(copy).not.toContain("先固定信息边界");
    }
  });

  it("uses authored Chinese manuscripts throughout the tabular foundations", () => {
    const partTwo = [
      "mdp-state-design",
      "value-bellman",
      "dynamic-programming",
      "monte-carlo",
      "td-traces",
      "tabular-control",
      "off-policy-deadly-triad",
    ];
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining(partTwo));
    for (const slug of partTwo) {
      const copy = JSON.stringify(ZH_CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug));
      expect(copy).not.toContain("阅读时先不要急着记名词");
      expect(copy).not.toContain("先独立复算这一行");
      expect(copy).not.toContain("先固定信息边界");
    }
  });

  it("uses authored Chinese manuscripts throughout deep value and policy learning", () => {
    const slugs = [
      "linear-approximation", "neural-approximation", "dqn", "dqn-family",
      "reinforce-policy-gradient", "actor-critic-gae", "trpo-ppo",
      "continuous-control", "distributed-rl",
    ];
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining(slugs));
    for (const slug of slugs) {
      const copy = JSON.stringify(ZH_CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug));
      expect(copy).not.toContain("第 1 项展示");
      expect(copy).not.toContain("公式 1：按时间下标");
    }
  });
});
