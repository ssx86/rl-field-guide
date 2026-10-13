import katex from "katex";
import { describe, expect, it } from "vitest";

import { CHAPTER_ARTICLES, getChapterArticle } from "@/content/chapter-articles";

describe("formula rendering contracts", () => {
  it("renders every chapter equation with strict KaTeX parsing", () => {
    for (const chapter of CHAPTER_ARTICLES) {
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
    for (const chapter of CHAPTER_ARTICLES) {
      for (const item of chapter.diagram.items as readonly (typeof chapter.diagram.items[number] & { latex?: string })[]) {
        const latex = item.latex;
        if (!latex) continue;
        expect(() => katex.renderToString(latex, { displayMode: true, throwOnError: true }), `${chapter.slug}: ${item.label}`).not.toThrow();
      }
    }
  });
});
