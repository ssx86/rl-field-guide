import { describe, expect, it } from "vitest";

import { CURRICULUM } from "@/content/curriculum";
import { CHAPTER_TERMS, formatChapterTerm } from "@/content/terminology";

describe("Chinese first-use terminology", () => {
  it("declares at least one canonical bilingual term for every deep chapter", () => {
    expect(Object.keys(CHAPTER_TERMS).sort()).toEqual(CURRICULUM.map((chapter) => chapter.slug).sort());
    for (const chapter of CURRICULUM) expect(CHAPTER_TERMS[chapter.slug].length, chapter.slug).toBeGreaterThan(0);
  });

  it("expands every registered acronym beside its English full name", () => {
    for (const terms of Object.values(CHAPTER_TERMS)) {
      for (const term of terms) {
        const rendered = formatChapterTerm(term);
        expect(rendered).toContain(`（${term.en}`);
        if (term.acronym) expect(rendered).toContain(`, ${term.acronym}）`);
      }
    }
  });
});
