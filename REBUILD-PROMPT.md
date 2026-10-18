# RL 教程纯中文重写任务提示词

把下面这段直接发给新会话。

---

## 任务

继续完成强化学习野外指南（rl-field-guide）的纯中文重写。上一个会话已完成架构搭建和第一章示范（commit `1bc75f0`），剩余 45 章需要用子智能体并行写入。

## 项目位置

D:\workspace\rl-field-guide（git main 分支，GitHub: ssx86/rl-field-guide）

## 已完成的工作（不需要重做）

1. **诊断**：旧架构 16,246 行代码，71% 是维护"六区块模板"（situation/diagram/workedExample/mechanism/equations/boundary）的基础设施。15 个测试文件用硬编码最低字数锁死结构。三语路由（en/zh/bilingual）复杂度×3。
2. **新架构**：
   - 内容：`src/content/zh-chapters/chXX.ts` 每章一个文件
   - 页面：`src/pages/zh/chXX.astro` 每章一个静态页（不用动态路由，Windows 会崩）
   - 格式：纯文本，`\n\n` 分段，`## 做二级标题`，`$$公式$$`
   - 零测试约束
3. **第一章示范**：`src/content/zh-chapters/ch01.ts` + `src/pages/zh/ch01.astro` 已上线，访问 https://ssx86.github.io/rl-field-guide/zh/
4. **写作 Skill**：`~/.zcode/skills/humanize-writing/SKILL.md`（去 AI 味 8 个 Pass）+ `~/.zcode/skills/narrative-teaching/SKILL.md`（叙事教学 7 条铁律）+ `~/.zcode/skills/science-communication/SKILL.md`（科普审查 5 维度）

## 你要做的事

### 第一步：读现有内容作为知识源

读以下文件（这是重写的知识基础，不要从零编造）：
- `src/content/zh-manuscripts/chapters/` — 47 个中文手稿（旧结构但内容正确）
- `src/content/chapters/part-1.ts` ~ `part-9.ts` — 英文原稿（内容更完整）

### 第二步：用 3 个并行子智能体写全部 46 章

每个智能体负责约 15 章，产出两个文件/章：
- `src/content/zh-chapters/chXX.ts`（内容数据）
- `src/pages/zh/chXX.astro`（静态页面）

参照 `ch01.ts` 和 `ch01.astro` 的格式。

### 写作规则（子智能体的提示词必须包含这些）

**文体**：像写书，不是做 PPT。每段 3-5 句，50-100 字/段。用"我们来看看"设，但内容基于现有手稿，不要从零编造。公式前先说"为什么需要它"。

**结构**：每章 800-2000 字。用 `## 标题` 分 2-4 节（不是必须的，有些章可以一气呵成）。不设"情境/图解/算例/机制/边界"等模板区块。

**语言**：
- 删掉所有 AI 腔："值得注意的是""至关重要""此外""与此同时"
- 用主动语态，短句为主，偶尔长句
- 有观点，有态度，偶尔说"说实话我也不确定该怎么看这个"
- 公式用 $$LaTeX$$，行内用 $LaTeX$
- 术语首次出现给英文括注，如：策略（policy）

**章节规划**（9 个部分共 46 章）：

| Part | 主题 | 章数 | 核心概念 |
|---|---|---|---|
| 1 | 认识问题 | 5 | 什么时候用RL、循环、回报、概率、老虎机 |
| 2 | 精确解小问题 | 7 | MDP、Bellman、动态规划、蒙特卡洛、TD、SARSA/Q-learning、离策略 |
| 3 | 逼近并扩展规模 | 9 | 线性近似、神经网络、DQN、DQN变体、REINFORCE、Actor-Critic、TRPO/PPO、连续控制、分布式 |
| 4 | 记忆与探索 | 3 | POMDP、深度探索、长程信用分配 |
| 5 | 学模型并搜索 | 3 | MCTS/AlphaZero、Dyna/MPC、隐空间世界模型 |
| 6 | 从已有数据学 | 5 | 行为克隆/DAgger、逆向RL/GAIL、离线RL、Decision Transformer、离策略评估 |
| 7 | 加入结构 | 3 | 分层RL、多智能体、迁移/元学习 |
| 8 | 让结果可信 | 4 | 奖励设计、安全/鲁棒、实验可复现、RL系统工程 |
| 9 | 语言模型中的RL | 7 | LLM即RL、RLHF/PPO、直接偏好、RLAIF、RLVR/GRPO、推理时计算、方法选择 |

### 第三步：更新目录页

`src/pages/zh/index.astro` 需要导入所有章节并渲染目录列表。

### 第四步：构建验证

```
npm run build
```
要求 0 错误。然后 `npm run deploy` 发布。

### 第五步：删除旧基础设施

写完全部章节并验证后：
- 删除 `src/pages/[lang]/` 目录（旧的三语路由）
- 删除 `src/content/chapters/` 目录（旧的英文内容）
- 删除 `src/content/zh-manuscripts/` 目录（旧的中文手稿，知识已迁移到新文件）
- 删除 `src/content/bilingual-course.ts`、`reading-mode.ts` 等双语基础设施
- 删除所有 `*.test.ts` 文件（旧结构测试不再适用）
- 删除不再使用的组件（KnowledgeText、ArticleNarrative、BilingualChapterArticle 等）
- 重新构建确认无错误

### 约束

- 不要改 `src/styles/` 和 `astro.config.mjs`（视觉设计保留）
- 不要改旧路由（`/[lang]/`），等新内容全部完成后再删
- 每章内容基于现有手稿重写，不要凭空编造
- 数学公式必须正确（KaTeX 语法）
- 上一章/下一章链接要连贯（ch01→ch02→...→ch46）
- Git commit message 用中文，注明"纯中文重写版第 N 章"

## 参考文件

- 内容格式参照：`src/content/zh-chapters/ch01.ts`
- 页面格式参照：`src/pages/zh/ch01.astro`
- 旧中文手稿（知识源）：`src/content/zh-manuscripts/chapters/`
- 旧英文内容（更完整）：`src/content/chapters/part-*.ts`
- 写作 Skill：`~/.zcode/skills/humanize-writing/SKILL.md` + `~/.zcode/skills/narrative-teaching/SKILL.md`
