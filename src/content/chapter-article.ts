export interface ArticleDiagramItem {
  readonly label: string;
  readonly value: string;
  readonly latex?: string;
  readonly note: string;
}

export interface ArticleSource {
  readonly label: string;
  readonly url: string;
  readonly kind: "book" | "paper" | "official documentation";
}

export type ArticleNarrativeBlock =
  | {
      readonly type: "section";
      readonly id: string;
      readonly title: string;
      readonly paragraphs: readonly string[];
    }
  | { readonly type: "diagram" }
  | { readonly type: "worked-example" }
  | { readonly type: "equations" }
  | { readonly type: "boundary" };

export interface ChapterArticle {
  readonly slug: string;
  readonly title: string;
  readonly deck: string;
  readonly openingQuestion: string;
  readonly bridge: string;
  readonly situation: {
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly diagram: {
    readonly title: string;
    readonly caption: string;
    readonly variant?: "flow" | "pipeline" | "formula-compare" | "compare" | "branch" | "matrix" | "layers";
    readonly items: readonly ArticleDiagramItem[];
  };
  readonly workedExample: {
    readonly title: string;
    readonly setup: string;
    readonly prediction: string;
    readonly steps: readonly { readonly label: string; readonly calculation: string; readonly explanation: string }[];
    readonly result: string;
  };
  readonly mechanism: {
    readonly introduction: string;
    readonly sections: readonly { readonly title: string; readonly paragraphs: readonly string[] }[];
  };
  readonly equations: readonly {
    readonly latex: string;
    readonly read: string;
    readonly meaning: string;
  }[];
  readonly boundary: {
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly nextBridge: string;
  readonly sources: readonly ArticleSource[];
  readonly narrative?: readonly ArticleNarrativeBlock[];
}
