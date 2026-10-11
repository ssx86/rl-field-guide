export type LessonId = "planning" | "bandits" | "returns" | "td-control";
export type EvidenceKind = "prediction" | "experiment" | "numeric" | "transfer" | "reflection";
export type CourseProgress = Record<LessonId, readonly EvidenceKind[]>;

export interface EvidenceTotals extends Record<EvidenceKind, number> {
  readonly total: number;
}

export function createEmptyProgress(): CourseProgress {
  return {
    planning: [],
    bandits: [],
    returns: [],
    "td-control": [],
  };
}

export function recordEvidence(progress: CourseProgress, lesson: LessonId, kind: EvidenceKind): CourseProgress {
  if (progress[lesson].includes(kind)) return progress;
  return { ...progress, [lesson]: [...progress[lesson], kind] };
}

export function evidenceTotals(progress: CourseProgress): EvidenceTotals {
  const totals: Record<EvidenceKind, number> = {
    prediction: 0,
    experiment: 0,
    numeric: 0,
    transfer: 0,
    reflection: 0,
  };
  let total = 0;

  for (const evidence of Object.values(progress)) {
    for (const kind of evidence) {
      totals[kind] += 1;
      total += 1;
    }
  }

  return { ...totals, total };
}
