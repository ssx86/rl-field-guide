import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { CHAPTER_TERMS } from "@/content/terminology";
import {
  getKnowledgeConnections,
  getKnowledgeTermForChapterTerm,
  KNOWLEDGE_TERMS,
  KNOWLEDGE_TERMS_BY_ID,
} from "@/content/knowledge-graph";

describe("knowledge graph", () => {
  it("gives every chapter term a bilingual definition and stable destination", () => {
    for (const chapter of CURRICULUM) {
      for (const term of CHAPTER_TERMS[chapter.slug]) {
        const knowledge = getKnowledgeTermForChapterTerm(term);
        expect(knowledge.definition.en.length).toBeGreaterThan(20);
        expect(knowledge.definition.zh.length).toBeGreaterThan(8);
        expect(CURRICULUM.some((candidate) => candidate.slug === knowledge.slug)).toBe(true);
      }
    }
  });

  it("keeps ids unique and resolves prerequisite relationships", () => {
    expect(new Set(KNOWLEDGE_TERMS.map((term) => term.id)).size).toBe(KNOWLEDGE_TERMS.length);
    expect(Object.keys(KNOWLEDGE_TERMS_BY_ID)).toHaveLength(KNOWLEDGE_TERMS.length);
    expect(getKnowledgeConnections("tabular-control").prerequisites.length).toBeGreaterThan(0);
    expect(getKnowledgeConnections("tabular-control").leadsTo.length).toBeGreaterThan(0);
  });
});
