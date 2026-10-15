import katex from "katex";
import { describe, expect, it } from "vitest";

import { CHAPTER_ARTICLES, getChapterArticle } from "@/content/chapter-articles";
import { ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";

describe("formula rendering contracts", () => {
  it("renders every chapter equation with strict KaTeX parsing", () => {
    for (const chapter of [...CHAPTER_ARTICLES, ...ZH_CHAPTER_ARTICLES]) {
      for (const equation of chapter.equations) {
        expect(() => katex.renderToString(equation.latex, { displayMode: true, throwOnError: true }), `${chapter.slug}: ${equation.latex}`).not.toThrow();
      }
    }
  });

  it("uses exact, renderable continuation terms in the tabular-control comparison", () => {
    const chapter = getChapterArticle("tabular-control");
    const diagram = chapter.diagram as typeof chapter.diagram & { variant?: string };
    const items = diagram.items as readonly (typeof diagram.items[number] & { latex?: string })[];

    expect(diagram.variant).toBe("formula-compare");
    expect(items.map((item) => item.latex)).toEqual([
      "Q(S_{t+1},A_{t+1}),\\quad A_{t+1}\\sim\\pi(\\cdot\\mid S_{t+1})",
      "\\sum_{a\\in\\mathcal{A}(S_{t+1})}\\pi(a\\mid S_{t+1})Q(S_{t+1},a)",
      "\\max_{a\\in\\mathcal{A}(S_{t+1})}Q(S_{t+1},a)",
      "a^*=\\arg\\max_a Q^A(S_{t+1},a),\\quad Q^B(S_{t+1},a^*)",
    ]);

    for (const item of items) {
      expect(item.latex).toBeTruthy();
      expect(() => katex.renderToString(item.latex!, { displayMode: true, throwOnError: true }), item.label).not.toThrow();
    }
  });

  it("strictly renders every diagram value explicitly marked as mathematics", () => {
    for (const chapter of [...CHAPTER_ARTICLES, ...ZH_CHAPTER_ARTICLES]) {
      for (const item of chapter.diagram.items as readonly (typeof chapter.diagram.items[number] & { latex?: string })[]) {
        const latex = item.latex;
        if (!latex) continue;
        expect(() => katex.renderToString(latex, { displayMode: true, throwOnError: true }), `${chapter.slug}: ${item.label}`).not.toThrow();
      }
    }
  });

  it("locks the audited indexing and expectation scopes", () => {
    expect(getChapterArticle("return-horizon").equations[1].latex).toContain("D_{t+1}");
    expect(getChapterArticle("off-policy-deadly-triad").equations[1].latex).toContain("A\\sim b(\\cdot\\mid s)");
    expect(getChapterArticle("continuous-control").equations[1].latex).toContain("\\gamma^t");
    expect(getChapterArticle("rlvr-grpo").equations[1].latex).toContain("\\max_\\theta\\;J_{\\mathrm{GRPO}}");
    expect(getChapterArticle("method-selection").equations[0].latex).toContain("\\mathcal F");
    expect(getChapterArticle("method-selection").equations[1].latex).toContain("\\kappa_{\\mathrm{claim}}");
  });
});
