import { describe, expect, it } from "vitest";

import { PANORAMA_ARTICLES, getPanoramaArticle } from "@/content/panorama-article";
import { CURRICULUM } from "@/content/curriculum";

describe("the read-first RL panorama", () => {
  it("offers an independently authored article in both languages", () => {
    expect(PANORAMA_ARTICLES.en.movements).toHaveLength(9);
    expect(PANORAMA_ARTICLES.zh.movements).toHaveLength(9);
    expect(PANORAMA_ARTICLES.en.title).not.toBe(PANORAMA_ARTICLES.zh.title);
    expect(getPanoramaArticle("en")).toBe(PANORAMA_ARTICLES.en);
  });

  it("links every deep-reading marker to an existing chapter", () => {
    const slugs = new Set(CURRICULUM.map((chapter) => chapter.slug));
    const marker = /\[\[[^\]|]+\|([^\]]+)\]\]/g;

    for (const article of Object.values(PANORAMA_ARTICLES)) {
      const text = article.movements.flatMap((movement) => [
        ...movement.paragraphs,
        movement.turn,
        movement.coda,
      ]).join("\n");
      const linkedSlugs = [...text.matchAll(marker)].map((match) => match[1]);
      expect(linkedSlugs.length).toBeGreaterThan(20);
      expect(linkedSlugs.every((slug) => slugs.has(slug))).toBe(true);
    }
  });

  it("keeps the overview as an essay rather than a comparison table", () => {
    for (const article of Object.values(PANORAMA_ARTICLES)) {
      expect(article.movements.every((movement) => movement.paragraphs.length >= 4)).toBe(true);
      expect(article.diagnosticQuestions).toHaveLength(7);
      expect(JSON.stringify(article)).not.toMatch(/comparisonTable|matrix|scorecard/i);
    }
  });
});
