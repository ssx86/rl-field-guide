import { describe, expect, it } from "vitest";

import { PART_ONE_ARTICLES } from "@/content/chapters/part-1";
import { PART_TWO_ARTICLES } from "@/content/chapters/part-2";
import { CURRICULUM } from "@/content/curriculum";

const articleWords = (value: unknown) => JSON.stringify(value).split(/\s+/).filter(Boolean).length;

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
