import { describe, expect, it } from "vitest";

import { PANORAMA_ARTICLES, getPanoramaArticle } from "@/content/panorama-article";
import { CURRICULUM } from "@/content/curriculum";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("the read-first RL panorama", () => {
  it("offers an independently authored article in both languages", () => {
    expect(PANORAMA_ARTICLES.en.movements).toHaveLength(9);
    expect(PANORAMA_ARTICLES.zh.movements).toHaveLength(9);
    expect(PANORAMA_ARTICLES.en.title).not.toBe(PANORAMA_ARTICLES.zh.title);
    expect(getPanoramaArticle("en")).toBe(PANORAMA_ARTICLES.en);
  });

  it("keeps every bilingual movement aligned at the paragraph level", () => {
    expect(PANORAMA_ARTICLES.en.opening).toHaveLength(PANORAMA_ARTICLES.zh.opening.length);
    for (const [index, english] of PANORAMA_ARTICLES.en.movements.entries()) {
      const chinese = PANORAMA_ARTICLES.zh.movements[index];
      expect(chinese.id, english.id).toBe(english.id);
      expect(chinese.paragraphs.length, english.id).toBe(english.paragraphs.length);
    }
    expect(PANORAMA_ARTICLES.en.closing).toHaveLength(PANORAMA_ARTICLES.zh.closing.length);
  });

  it("introduces the problem before naming reinforcement learning", () => {
    for (const article of Object.values(PANORAMA_ARTICLES)) {
      const opening = article.opening.join(" ");
      const nameIndex = article.language === "zh"
        ? opening.indexOf("强化学习（reinforcement learning, RL）")
        : opening.indexOf("reinforcement learning, usually shortened to RL");
      expect(nameIndex, article.language).toBeGreaterThan(article.opening[0].length);
    }
  });

  it("keeps Chapter 00 readable for a young first-time reader", () => {
    const stripLinks = (text: string) => text.replace(/\[\[([^|]+)\|[^\]]+\]\]/g, "$1");
    const englishSentences = collectStrings(PANORAMA_ARTICLES.en)
      .flatMap((text) => stripLinks(text).split(/[.!?]+/))
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => sentence.split(/\s+/).length);
    const chineseSentences = collectStrings(PANORAMA_ARTICLES.zh)
      .flatMap((text) => stripLinks(text).replace(/（[^）]+）/g, "").split(/[。！？；]+/))
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => [...sentence].length);

    expect(Math.max(...englishSentences)).toBeLessThanOrEqual(32);
    expect(englishSentences.reduce((sum, length) => sum + length, 0) / englishSentences.length).toBeLessThanOrEqual(14);
    expect(Math.max(...chineseSentences)).toBeLessThanOrEqual(85);
    expect(chineseSentences.reduce((sum, length) => sum + length, 0) / chineseSentences.length).toBeLessThanOrEqual(30);
  });

  it("links every deep chapter in both languages", () => {
    const slugs = new Set(CURRICULUM.map((chapter) => chapter.slug));
    const marker = /\[\[[^\]|]+\|([^\]]+)\]\]/g;
    const linkedByLanguage = new Map<string, Set<string>>();

    for (const article of Object.values(PANORAMA_ARTICLES)) {
      const text = article.movements.flatMap((movement) => [
        ...movement.paragraphs,
        movement.turn,
        movement.coda,
      ]).join("\n");
      const linkedSlugs = [...text.matchAll(marker)].map((match) => match[1]);
      expect(new Set(linkedSlugs)).toEqual(slugs);
      expect(linkedSlugs.every((slug) => slugs.has(slug))).toBe(true);
      linkedByLanguage.set(article.language, new Set(linkedSlugs));
    }

    expect(linkedByLanguage.get("en")).toEqual(linkedByLanguage.get("zh"));
  });

  it("keeps the read-first essay free of high-signal AI scaffolding", () => {
    const banned = [
      /here(?:'|’)s the thing/i,
      /it(?:'|’)s worth noting/i,
      /at the end of the day/i,
      /let that sink in/i,
      /not only .+ but also/i,
      /值得注意/,
      /综上所述/,
      /归根结底/,
      /这不仅仅是.+更是/,
      /真正的.+不是.+而是/,
    ];

    for (const article of Object.values(PANORAMA_ARTICLES)) {
      for (const segment of collectStrings(article)) {
        for (const pattern of banned) expect(segment).not.toMatch(pattern);
      }
    }

    expect(JSON.stringify(PANORAMA_ARTICLES.en)).not.toContain("—");
  });

  it("keeps the overview as an essay rather than a comparison table", () => {
    for (const article of Object.values(PANORAMA_ARTICLES)) {
      expect(article.movements.every((movement) => movement.paragraphs.length >= 4)).toBe(true);
      expect(article.diagnosticQuestions).toHaveLength(7);
      expect(JSON.stringify(article)).not.toMatch(/comparisonTable|matrix|scorecard/i);
    }
  });
});
