import { getChineseBrief } from "@/content/chapter-localization";
import { CURRICULUM, PARTS, type CurriculumChapter } from "@/content/curriculum";
import type { Language } from "@/content/bilingual-course";

export const ZH_PARTS = [
  { id: "problem", title: "先认清问题", purpose: "判断任务是否真是连续决策，并把反馈闭环画清楚，不隐藏关键假设。" },
  { id: "tabular", title: "精确解小问题", purpose: "在可枚举的小模型和表格中看清每一次更新从哪里来。" },
  { id: "scale", title: "逼近并扩展规模", purpose: "用函数替代表格，同时持续追踪目标、数据来源和稳定性风险。" },
  { id: "memory", title: "记忆与探索", purpose: "分别处理信息缺失、反馈稀疏和长延迟，不把三类问题混成一个。" },
  { id: "models", title: "学习模型并搜索", purpose: "用搜索或学习到的动力学规划，并测量模型误差如何改变决策。" },
  { id: "data", title: "从既有数据学习", purpose: "在无法安全在线探索时，利用示范和固定日志学习并标明支持边界。" },
  { id: "structure", title: "加入结构", purpose: "复用技能、协调多个学习者，并在相关任务之间迁移。" },
  { id: "reliability", title: "让结果可信", purpose: "设计奖励、约束、实验与训练系统，使结论能够被复核。" },
  { id: "language", title: "语言模型中的 RL", purpose: "精确映射 token 生成，并把 RL 与相邻的监督偏好目标分开。" },
] as const;

export function getLocalizedParts(language: Language) {
  return language === "zh" ? ZH_PARTS : PARTS;
}

export function getLocalizedCurriculum(language: Language): readonly CurriculumChapter[] {
  if (language === "en") return CURRICULUM;
  return CURRICULUM.map((chapter) => {
    const brief = getChineseBrief(chapter.slug);
    return {
      ...chapter,
      title: brief.title,
      purpose: brief.focus,
      bridgeFromPrevious: chapter.order === 1
        ? "先判断问题形状，让后续算法名称回答真实需要。"
        : `沿着上一章留下的问题继续：${brief.focus}`,
    };
  });
}
