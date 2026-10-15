import { describe, expect, it } from "vitest";

import { READING_MODES, languageDestinations, modePath } from "@/content/reading-mode";

describe("static reading modes", () => {
  it("offers English, Chinese, and alternating bilingual routes", () => {
    expect(READING_MODES).toEqual(["en", "zh", "bilingual"]);
    expect(modePath("bilingual", "tabular-control")).toBe("/bilingual/learn/tabular-control/");
  });

  it("keeps all three destinations on the same page", () => {
    expect(languageDestinations("rl-panorama")).toEqual([
      { mode: "en", path: "/en/learn/rl-panorama/" },
      { mode: "zh", path: "/zh/learn/rl-panorama/" },
      { mode: "bilingual", path: "/bilingual/learn/rl-panorama/" },
    ]);
  });
});
