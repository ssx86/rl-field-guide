import { describe, expect, it } from "vitest";
import { COURSE, LANGUAGES, getCourse, getLesson, type Language } from "@/content/bilingual-course";

describe("bilingual beginner curriculum", () => {
  it("keeps the English and Chinese course structures in exact parity", () => {
    const lessonIds = LANGUAGES.map((language) => getCourse(language).lessons.map((lesson) => lesson.id));

    expect(lessonIds[0]).toEqual(lessonIds[1]);
    expect(lessonIds[0].length).toBeGreaterThanOrEqual(12);
  });

  it("starts before formulas and builds prerequisites in order", () => {
    for (const language of LANGUAGES) {
      const course = getCourse(language);
      const first = course.lessons[0];

      expect(first.prerequisites).toEqual([]);
      expect(first.formulas).toEqual([]);
      expect(first.examples.length).toBeGreaterThanOrEqual(2);

      course.lessons.forEach((lesson, index) => {
        const earlierIds = new Set(course.lessons.slice(0, index).map((item) => item.id));
        expect(lesson.prerequisites.every((id) => earlierIds.has(id))).toBe(true);
      });
    }
  });

  it("gives every lesson concrete examples, a misconception, and a transfer task", () => {
    for (const language of LANGUAGES) {
      for (const lesson of getCourse(language).lessons) {
        expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
        expect(lesson.misconception.length).toBeGreaterThan(20);
        expect(lesson.transfer.question.length).toBeGreaterThan(10);
        expect(lesson.transfer.answer.length).toBeGreaterThan(10);
      }
    }
  });

  it("resolves every localized lesson by stable id", () => {
    for (const language of LANGUAGES) {
      for (const lesson of COURSE[language].lessons) {
        expect(getLesson(language, lesson.id)).toBe(lesson);
      }
    }
  });

  it("contains a deep, ordered LLM reinforcement-learning track", () => {
    const expectedTrack = ["llm-post-training", "llm-rlhf", "llm-preference", "llm-reasoning"];

    for (const language of LANGUAGES) {
      const course = getCourse(language);
      const ids = course.lessons.map((lesson) => lesson.id);
      const trackStart = ids.indexOf(expectedTrack[0] as (typeof ids)[number]);

      expect(trackStart).toBeGreaterThan(0);
      expect(ids.slice(trackStart, trackStart + expectedTrack.length)).toEqual(expectedTrack);
      for (const id of expectedTrack) {
        const lesson = getLesson(language, id as (typeof ids)[number]);
        expect(lesson.concepts.length).toBeGreaterThanOrEqual(4);
        expect(lesson.references?.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("rejects unsupported locales at the type boundary", () => {
    const supported: readonly Language[] = LANGUAGES;
    expect(supported).toEqual(["en", "zh"]);
  });
});
