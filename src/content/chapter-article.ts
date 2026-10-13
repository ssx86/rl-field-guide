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
    readonly variant?: "flow" | "formula-compare";
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
}
