import { describe, expect, it } from "vitest";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";
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
});
