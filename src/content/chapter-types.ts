import type { LessonId } from "@/domain/course-progress";

export interface ChapterConcept {
  readonly title: string;
  readonly question: string;
  readonly explanation: string;
  readonly mechanics: readonly string[];
  readonly formula?: string;
  readonly formulaLabel?: string;
  readonly boundary: string;
}

export interface ChapterExample {
  readonly title: string;
  readonly situation: string;
  readonly walkthrough: readonly string[];
  readonly result: string;
}

export interface ChapterComparison {
  readonly method: string;
  readonly learnsFrom: string;
  readonly strength: string;
  readonly watchFor: string;
}

export interface ChapterCheckpoint {
  readonly question: string;
  readonly choices: readonly string[];
  readonly answer: number;
  readonly explanation: string;
}

export interface ChapterPassport {
  readonly assumes: string;
  readonly updates: string;
  readonly bestFor: string;
  readonly breaksWhen: string;
}

export interface Chapter {
  readonly id: LessonId;
  readonly section: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly openingQuestion: string;
  readonly claim: string;
  readonly predictionChoices: readonly string[];
  readonly predictionAnswer: number;
  readonly concepts: readonly ChapterConcept[];
  readonly examples: readonly ChapterExample[];
  readonly counterexample: string;
  readonly comparison: readonly ChapterComparison[];
  readonly checkpoint: ChapterCheckpoint;
  readonly passport: ChapterPassport;
}
