import { describe, expect, it } from "vitest";
import { createKnowledgeAnnotator } from "@/content/knowledge-text";

describe("knowledge text annotation", () => {
  it("marks only the first occurrence of a term within a section scope", () => {
    const annotate = createKnowledgeAnnotator("en");
    const first = annotate("A policy gradient changes a policy. Another policy gradient follows.", "mechanism");
    const second = annotate("Policy gradient appears again.", "mechanism");
    expect(first.filter((segment) => segment.kind === "term")).toHaveLength(1);
    expect(second.filter((segment) => segment.kind === "term")).toHaveLength(0);
  });

  it("starts a fresh annotation set for a new section", () => {
    const annotate = createKnowledgeAnnotator("zh");
    expect(annotate("这里讨论价值与贝尔曼方程。", "opening").some((segment) => segment.kind === "term")).toBe(true);
    expect(annotate("贝尔曼方程再次出现。", "mechanism").some((segment) => segment.kind === "term")).toBe(true);
  });

  it("preserves explicit chapter links and does not annotate inside them", () => {
    const annotate = createKnowledgeAnnotator("en");
    const segments = annotate("Continue with [[Q-learning|tabular-control]] after the return.", "route");
    expect(segments).toContainEqual({ kind: "chapter-link", text: "Q-learning", slug: "tabular-control" });
    expect(segments.filter((segment) => segment.kind === "term").map((segment) => segment.text)).toContain("return");
  });

  it("does not match short acronyms inside longer names", () => {
    const annotate = createKnowledgeAnnotator("en");
    const segments = annotate("RLAIF and RL are different strings.", "acronyms");
    const terms = segments.filter((segment) => segment.kind === "term").map((segment) => segment.text);
    expect(terms).toContain("RLAIF");
    expect(terms).toContain("RL");
  });
});
