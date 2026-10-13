import type { ChapterArticle } from "@/content/chapter-article";

export interface ChineseManuscript {
  readonly title: string;
  readonly deck: string;
  readonly openingQuestion: string;
  readonly bridge: string;
  readonly situation: ChapterArticle["situation"];
  readonly diagram: {
    readonly title: string;
    readonly caption: string;
    readonly items: readonly { readonly label: string; readonly value: string; readonly note: string }[];
  };
  readonly workedExample: {
    readonly title: string;
    readonly setup: string;
    readonly prediction: string;
    readonly steps: readonly { readonly label: string; readonly explanation: string }[];
    readonly result: string;
  };
  readonly mechanism: ChapterArticle["mechanism"];
  readonly equations: readonly { readonly read: string; readonly meaning: string }[];
  readonly boundary: ChapterArticle["boundary"];
  readonly nextBridge: string;
}

function requireLength(label: string, actual: number, expected: number): void {
  if (actual !== expected) throw new Error(`${label}: expected ${expected} items, received ${actual}`);
}

export function applyChineseManuscript(english: ChapterArticle, copy: ChineseManuscript): ChapterArticle {
  requireLength(`${english.slug} diagram`, copy.diagram.items.length, english.diagram.items.length);
  requireLength(`${english.slug} example`, copy.workedExample.steps.length, english.workedExample.steps.length);
  requireLength(`${english.slug} equations`, copy.equations.length, english.equations.length);

  return {
    slug: english.slug,
    title: copy.title,
    deck: copy.deck,
    openingQuestion: copy.openingQuestion,
    bridge: copy.bridge,
    situation: copy.situation,
    diagram: {
      title: copy.diagram.title,
      caption: copy.diagram.caption,
      variant: english.diagram.variant,
      items: copy.diagram.items.map((item, index) => ({
        ...item,
        latex: english.diagram.items[index].latex,
      })),
    },
    workedExample: {
      title: copy.workedExample.title,
      setup: copy.workedExample.setup,
      prediction: copy.workedExample.prediction,
      steps: copy.workedExample.steps.map((step, index) => ({
        ...step,
        calculation: english.workedExample.steps[index].calculation,
      })),
      result: copy.workedExample.result,
    },
    mechanism: copy.mechanism,
    equations: copy.equations.map((equation, index) => ({
      latex: english.equations[index].latex,
      ...equation,
    })),
    boundary: copy.boundary,
    nextBridge: copy.nextBridge,
    sources: english.sources,
  };
}
