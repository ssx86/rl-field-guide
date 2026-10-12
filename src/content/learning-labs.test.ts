import { describe, expect, it } from "vitest";
import { LANGUAGES, LESSON_IDS, getLesson } from "@/content/bilingual-course";
import { getLearningLab } from "@/content/learning-labs";

describe("reading-first worked examples", () => {
  it("gives every lesson in both languages a question, numeric evidence, and visible transfer explanation", () => {
    for (const language of LANGUAGES) {
      for (const lessonId of LESSON_IDS) {
        const lab = getLearningLab(language, lessonId);
        expect(lab.foundation.required.length).toBeGreaterThan(2);
        expect(lab.prediction.choices.length).toBeGreaterThanOrEqual(2);
        expect(lab.prediction.correct).toBeLessThan(lab.prediction.choices.length);
        expect(lab.evidence.steps.length).toBeGreaterThanOrEqual(2);
        const evidenceText = [lab.prediction.prompt, lab.prediction.explanation, lab.evidence.setup, ...lab.evidence.steps, lab.evidence.result].join(" ");
        expect(/\d/.test(evidenceText), `${language}/${lessonId} needs numeric evidence`).toBe(true);
        expect(lab.transfer.choices.length).toBeGreaterThanOrEqual(2);
        expect(lab.transfer.correct).toBeLessThan(lab.transfer.choices.length);
      }
    }
  });

  it("keeps the corrected formula boundaries explicit", () => {
    for (const language of LANGUAGES) {
      expect(getLesson(language, "planning").formulas.some((formula) => formula.latex.includes("r(s,a,s')"))).toBe(true);
      expect(getLesson(language, "deep-value").formulas.some((formula) => formula.latex.includes("(1-d)"))).toBe(true);
      expect(getLesson(language, "real-world-practice").formulas).toEqual([]);
    }
  });
});
