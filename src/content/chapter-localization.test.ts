import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { AUTHORED_CHINESE_SLUGS, ZH_CHAPTER_ARTICLES } from "@/content/chapter-localization";
import { CURRICULUM } from "@/content/curriculum";
import { AUTHORED_NARRATIVE_SLUGS } from "@/content/zh-manuscripts/chapter-narrative";
import { AUTHORED_CHAPTER_PROSE } from "@/content/zh-manuscripts/chapter-prose";
import { AUTHORED_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/chapters";

describe("bilingual chapter corpus", () => {
  it("keeps completed rewrites in their chapter-local manuscript instead of the central prose map", () => {
    const completedChapterLocalRewrites = [
      "before-rl",
      "interaction-loop",
      "return-horizon",
      "probability-expectation",
      "bandits-contextual-bandits",
      "mdp-state-design",
      "value-bellman",
      "dynamic-programming",
      "monte-carlo",
      "td-traces",
      "tabular-control",
      "off-policy-deadly-triad",
      "linear-approximation",
      "neural-approximation",
      "dqn",
      "dqn-family",
      "reinforce-policy-gradient",
      "actor-critic-gae",
      "trpo-ppo",
      "continuous-control",
      "distributed-rl",
    ];

    for (const slug of completedChapterLocalRewrites) {
      expect(AUTHORED_CHINESE_MANUSCRIPTS[slug].narrative, slug).toBeDefined();
    }
  });

  it("covers the same 46 routes in the same order", () => {
    expect(ZH_CHAPTER_ARTICLES).toHaveLength(46);
    expect(ZH_CHAPTER_ARTICLES.map((chapter) => chapter.slug)).toEqual(CURRICULUM.map((chapter) => chapter.slug));
  });

  it("requires an individually authored Chinese manuscript for every chapter", () => {
    expect(AUTHORED_CHINESE_SLUGS).toHaveLength(46);
    expect(new Set(AUTHORED_CHINESE_SLUGS)).toEqual(new Set(CURRICULUM.map((chapter) => chapter.slug)));
  });

  it("stores every Chinese manuscript in its own chapter-local source file", () => {
    const files = readdirSync(resolve("src/content/zh-manuscripts/chapters"))
      .filter((file) => file.endsWith(".ts") && file !== "index.ts")
      .map((file) => file.replace(/\.ts$/, ""))
      .sort();

    expect(files).toHaveLength(46);
    expect(files).toEqual(CURRICULUM.map((chapter) => chapter.slug).sort());
  });

  it("gives every Chinese chapter an authored, non-uniform narrative flow", () => {
    expect(new Set(AUTHORED_NARRATIVE_SLUGS)).toEqual(new Set(CURRICULUM.map((chapter) => chapter.slug)));

    const signatures = new Set<string>();
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      expect(chapter.narrative, chapter.slug).toBeDefined();
      const blocks = chapter.narrative ?? [];
      const sections = blocks.filter((block) => block.type === "section");
      const ids = sections.map((block) => block.type === "section" ? block.id : "");

      expect(sections.length, chapter.slug).toBeGreaterThanOrEqual(2);
      expect(new Set(ids).size, chapter.slug).toBe(ids.length);
      expect(blocks.at(0)?.type, chapter.slug).toBe("section");
      expect(blocks.at(-1)?.type, chapter.slug).toBe("boundary");
      expect(blocks.filter((block) => block.type === "worked-example").length, chapter.slug).toBeLessThanOrEqual(1);
      expect(blocks.filter((block) => block.type === "diagram").length, chapter.slug).toBeLessThanOrEqual(1);
      signatures.add(blocks.map((block) => block.type).join("→"));
    }

    expect(signatures.size).toBeGreaterThanOrEqual(10);
  });

  it("renders the independently rewritten prose for every narrative section and boundary", () => {
    const curriculumSlugs = CURRICULUM.map((chapter) => chapter.slug);
    expect(Object.keys(AUTHORED_CHAPTER_PROSE).sort()).toEqual([...curriculumSlugs].sort());

    let renderedParagraphs = 0;
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      const authored = AUTHORED_CHAPTER_PROSE[chapter.slug];
      const chapterLocalNarrative = AUTHORED_CHINESE_MANUSCRIPTS[chapter.slug].narrative;
      expect(authored, chapter.slug).toBeDefined();

      const renderedSections = (chapter.narrative ?? []).filter((block) => block.type === "section");
      const expectedSections = (chapterLocalNarrative ?? []).filter((block) => block.type === "section");
      expect(renderedSections.map((block) => block.type === "section" ? block.id : ""), chapter.slug)
        .toEqual(chapterLocalNarrative ? expectedSections.map((block) => block.type === "section" ? block.id : "") : Object.keys(authored.sections));

      for (const block of renderedSections) {
        if (block.type !== "section") continue;
        const chapterLocalSection = expectedSections.find((candidate) => candidate.type === "section" && candidate.id === block.id);
        expect(block.paragraphs, `${chapter.slug}: ${block.id}`).toEqual(
          chapterLocalNarrative && chapterLocalSection?.type === "section" ? chapterLocalSection.paragraphs : authored.sections[block.id],
        );
        expect(block.paragraphs.length, `${chapter.slug}: ${block.id}`).toBeGreaterThanOrEqual(2);
        for (const paragraph of block.paragraphs) {
          expect(paragraph.length, `${chapter.slug}: ${block.id}`).toBeGreaterThanOrEqual(60);
          renderedParagraphs += 1;
        }
      }

      expect(chapter.boundary, chapter.slug).toEqual(chapterLocalNarrative ? AUTHORED_CHINESE_MANUSCRIPTS[chapter.slug].boundary : authored.boundary);
      expect(chapter.boundary.paragraphs, `${chapter.slug}: boundary`).toHaveLength(2);
      renderedParagraphs += chapter.boundary.paragraphs.length;
    }

    expect(renderedParagraphs).toBeGreaterThanOrEqual(360);
  });

  it("avoids recurrent presentation-template language in the rewritten article", () => {
    const disallowedPhrases = [
      "首先，我们",
      "其次，我们",
      "最后，我们",
      "综上所述",
      "在本章节中",
      "让我们深入探讨",
      "值得注意的是",
    ];

    for (const [slug, authored] of Object.entries(AUTHORED_CHAPTER_PROSE)) {
      const prose = [
        ...Object.values(authored.sections).flat(),
        ...authored.boundary.paragraphs,
      ].join("\n");
      for (const phrase of disallowedPhrases) {
        expect(prose, `${slug}: ${phrase}`).not.toContain(phrase);
      }
    }
  });

  it("contains no legacy generator scaffolding or duplicated teaching paragraphs", () => {
    const legacyPhrases = [
      "阅读时先不要急着记名词",
      "先独立复算这一行",
      "先固定信息边界",
      "再追踪目标与数据",
      "最后验证结论范围",
      "按时间下标、条件符号和求和或最大化范围逐项读取",
    ];
    const paragraphs: string[] = [];
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      const copy = JSON.stringify(chapter);
      for (const phrase of legacyPhrases) expect(copy).not.toContain(phrase);
      paragraphs.push(
        chapter.bridge,
        ...chapter.situation.paragraphs,
        ...chapter.mechanism.sections.flatMap((section) => section.paragraphs),
        ...chapter.boundary.paragraphs,
        chapter.nextBridge,
      );
    }
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
  });

  it("keeps mathematical notation and sources aligned while localizing explanatory calculations", () => {
    for (const [index, english] of CHAPTER_ARTICLES.entries()) {
      const chinese = ZH_CHAPTER_ARTICLES[index];
      expect(chinese.equations.map((item) => item.latex)).toEqual(english.equations.map((item) => item.latex));
      expect(chinese.diagram.items.map((item) => item.latex)).toEqual(english.diagram.items.map((item) => item.latex));
      expect(chinese.sources).toEqual(english.sources);
    }
  });

  it("keeps Chinese equation readings attached to the equation they actually explain", () => {
    const expectedAnchors: Readonly<Record<string, readonly [string, string]>> = {
      "monte-carlo": ["完整回报", "增量更新"],
      "neural-approximation": ["小批次平均损失", "更新数据比"],
      "trpo-ppo": ["PPO", "TRPO"],
      "distributed-rl": ["V-trace", "策略滞后"],
      "long-horizon-credit": ["奖励重分配", "替代目标"],
      "dyna-mpc": ["MPC", "真实转移与模型生成转移"],
      "latent-world-models": ["后验隐状态", "MuZero"],
      "decision-transformer": ["剩余回报", "负对数似然"],
      "off-policy-evaluation": ["重要性估计", "FQE"],
      "hierarchical-rl": ["持续 k 步", "三部分"],
      "multi-agent-rl": ["QMIX", "MADDPG"],
      "reward-design": ["势能", "塑形后的奖励"],
      "safe-robust-risk": ["CMDP", "拉格朗日目标"],
      "rl-systems": ["终止掩码", "实验的身份"],
      "llm-as-rl": ["token", "SFT"],
      "direct-preference": ["DPO", "SimPO"],
      "rlaif-judges": ["评委一致率", "交换一致性"],
      "test-time-compute": ["至少一次成功", "部署效用"],
      "method-selection": ["证据、安全、数据权利与计算成本", "声明的强度"],
    };

    for (const [slug, anchors] of Object.entries(expectedAnchors)) {
      const chapter = ZH_CHAPTER_ARTICLES.find((item) => item.slug === slug);
      expect(chapter, slug).toBeDefined();
      for (const [index, anchor] of anchors.entries()) {
        expect(chapter?.equations[index].read, `${slug} equation ${index + 1}`).toContain(anchor);
      }
    }
  });

  it("does not leak English prose into Chinese worked examples", () => {
    for (const [chapterIndex, chapter] of ZH_CHAPTER_ARTICLES.entries()) {
      for (const [stepIndex, step] of chapter.workedExample.steps.entries()) {
        const english = CHAPTER_ARTICLES[chapterIndex].workedExample.steps[stepIndex].calculation;
        const wordTokens = english.match(/[A-Za-z]{3,}/g) ?? [];
        const letterShare = (english.match(/[A-Za-z]/g)?.length ?? 0) / english.length;
        const looksLikeFormula = /^[A-Z][(^=]/.test(english) || english.includes("=");
        if (wordTokens.length >= 2 && letterShare >= 0.35 && !looksLikeFormula) {
          expect(step.calculation, `${chapter.slug}: ${english}`).not.toBe(english);
        }
      }
    }
  });

  it("keeps worked-example reasoning independent from the diagram legend", () => {
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      expect(
        chapter.workedExample.steps.map((step) => step.label),
        `${chapter.slug}: worked-example labels must not be reused diagram labels`,
      ).not.toEqual(chapter.diagram.items.map((item) => item.label));
    }
  });

  it("contains real Chinese teaching copy rather than English fallback pages", () => {
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      const copy = [chapter.title, chapter.deck, chapter.openingQuestion, chapter.bridge, ...chapter.situation.paragraphs, ...chapter.boundary.paragraphs].join(" ");
      expect(copy.match(/[\p{Script=Han}]/gu)?.length ?? 0).toBeGreaterThan(80);
    }
  });

  it("develops every rendered Chinese section as prose rather than a slide note", () => {
    for (const chapter of ZH_CHAPTER_ARTICLES) {
      for (const block of chapter.narrative ?? []) {
        if (block.type !== "section") continue;
        const prose = block.paragraphs.join(" ");
        const sentenceCount = prose.match(/[。！？]/g)?.length ?? 0;

        expect(prose.length, `${chapter.slug}: ${block.title}`).toBeGreaterThanOrEqual(120);
        expect(sentenceCount, `${chapter.slug}: ${block.title}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("has replaced the first part's generated template with authored manuscripts", () => {
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining([
      "before-rl",
      "interaction-loop",
      "return-horizon",
      "probability-expectation",
      "bandits-contextual-bandits",
    ]));

    const authored = ZH_CHAPTER_ARTICLES.slice(0, 5).map((chapter) => JSON.stringify(chapter));
    for (const copy of authored) {
      expect(copy).not.toContain("阅读时先不要急着记名词");
      expect(copy).not.toContain("第 1 项展示");
      expect(copy).not.toContain("先独立复算这一行");
      expect(copy).not.toContain("先固定信息边界");
    }
  });

  it("uses authored Chinese manuscripts throughout the tabular foundations", () => {
    const partTwo = [
      "mdp-state-design",
      "value-bellman",
      "dynamic-programming",
      "monte-carlo",
      "td-traces",
      "tabular-control",
      "off-policy-deadly-triad",
    ];
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining(partTwo));
    for (const slug of partTwo) {
      const copy = JSON.stringify(ZH_CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug));
      expect(copy).not.toContain("阅读时先不要急着记名词");
      expect(copy).not.toContain("先独立复算这一行");
      expect(copy).not.toContain("先固定信息边界");
    }
  });

  it("uses authored Chinese manuscripts throughout deep value and policy learning", () => {
    const slugs = [
      "linear-approximation", "neural-approximation", "dqn", "dqn-family",
      "reinforce-policy-gradient", "actor-critic-gae", "trpo-ppo",
      "continuous-control", "distributed-rl",
    ];
    expect(AUTHORED_CHINESE_SLUGS).toEqual(expect.arrayContaining(slugs));
    for (const slug of slugs) {
      const copy = JSON.stringify(ZH_CHAPTER_ARTICLES.find((chapter) => chapter.slug === slug));
      expect(copy).not.toContain("第 1 项展示");
      expect(copy).not.toContain("公式 1：按时间下标");
    }
  });
});
