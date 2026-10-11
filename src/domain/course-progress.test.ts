import { describe, expect, it } from "vitest";
import { createEmptyProgress, evidenceTotals, recordEvidence } from "@/domain/course-progress";

describe("course evidence progress", () => {
  it("records each kind of evidence once per lesson", () => {
    const initial = createEmptyProgress();
    const predicted = recordEvidence(initial, "bandits", "prediction");
    const duplicate = recordEvidence(predicted, "bandits", "prediction");

    expect(duplicate.bandits).toEqual(["prediction"]);
    expect(duplicate).toBe(predicted);
  });

  it("summarizes evidence across lessons instead of counting page visits", () => {
    let progress = createEmptyProgress();
    progress = recordEvidence(progress, "planning", "prediction");
    progress = recordEvidence(progress, "planning", "numeric");
    progress = recordEvidence(progress, "bandits", "prediction");
    progress = recordEvidence(progress, "bandits", "transfer");

    expect(evidenceTotals(progress)).toEqual({
      prediction: 2,
      experiment: 0,
      numeric: 1,
      transfer: 1,
      reflection: 0,
      total: 4,
    });
  });
});
