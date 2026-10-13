import type { Language } from "@/content/bilingual-course";

export interface PanoramaMovement {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly turn: string;
  readonly paragraphs: readonly string[];
  readonly coda: string;
}

export interface PanoramaArticle {
  readonly language: Language;
  readonly eyebrow: string;
  readonly title: string;
  readonly deck: string;
  readonly opening: readonly string[];
  readonly movements: readonly PanoramaMovement[];
  readonly diagnosticTitle: string;
  readonly diagnosticIntro: string;
  readonly diagnosticQuestions: readonly string[];
  readonly closing: readonly string[];
}
