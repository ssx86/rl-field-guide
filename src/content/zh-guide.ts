// ═══════════════════════════════════════════════════
// 强化学习野外指南 · 纯中文重写版
// 内容模型：一篇就是一个章节，流畅叙述，不是填表
// ═══════════════════════════════════════════════════

export interface Chapter {
  /** URL slug */
  slug: string;
  /** 章节标题（中文） */
  title: string;
  /** 所属 Part 编号 1-9 */
  part: number;
  /** Part 标题 */
  partTitle: string;
  /** 一句话说明这章讲什么 */
  intro: string;
  /** 纯文本叙述，用 \n\n 分段，用 ## 做二级标题（可选），$...$ 做行内公式，$$...$$ 做独立公式 */
  content: string;
  /** 上一章的 slug（用于上一页/下一页） */
  prev?: string;
  /** 下一章的 slug */
  next?: string;
}
