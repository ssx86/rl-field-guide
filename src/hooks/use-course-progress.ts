import { useCallback, useEffect, useState } from "react";
import {
  createEmptyProgress,
  recordEvidence,
  type CourseProgress,
  type EvidenceKind,
  type LessonId,
} from "@/domain/course-progress";

const STORAGE_KEY = "rl-field-guide-progress-v1";
const EVIDENCE: readonly EvidenceKind[] = ["prediction", "experiment", "numeric", "transfer", "reflection"];

function restoreProgress(): CourseProgress {
  const empty = createEmptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Record<string, unknown> | null;
    if (!saved) return empty;
    const restored = (lesson: LessonId): EvidenceKind[] => Array.isArray(saved[lesson])
      ? saved[lesson].filter((kind): kind is EvidenceKind => EVIDENCE.includes(kind as EvidenceKind))
      : [];
    return {
      foundations: restored("foundations"),
      planning: restored("planning"),
      bandits: restored("bandits"),
      returns: restored("returns"),
      "td-control": restored("td-control"),
      "deep-value": restored("deep-value"),
      "policy-learning": restored("policy-learning"),
      "continuous-control": restored("continuous-control"),
      "model-based": restored("model-based"),
      "modern-practice": restored("modern-practice"),
      "challenge-lab": restored("challenge-lab"),
      "formula-atlas": restored("formula-atlas"),
    };
  } catch {
    return empty;
  }
}

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress>(restoreProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addEvidence = useCallback((lesson: LessonId, kind: EvidenceKind) => {
    setProgress((current) => recordEvidence(current, lesson, kind));
  }, []);

  return { progress, addEvidence };
}
