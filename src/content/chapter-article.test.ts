import { describe, expect, it } from "vitest";

import { PART_ONE_ARTICLES } from "@/content/chapters/part-1";
import { PART_TWO_ARTICLES } from "@/content/chapters/part-2";
import { PART_THREE_ARTICLES } from "@/content/chapters/part-3";
import { PART_FOUR_ARTICLES } from "@/content/chapters/part-4";
import { PART_FIVE_ARTICLES } from "@/content/chapters/part-5";
import { PART_SIX_ARTICLES } from "@/content/chapters/part-6";
import { PART_SEVEN_ARTICLES } from "@/content/chapters/part-7";
import { PART_EIGHT_ARTICLES } from "@/content/chapters/part-8";
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
