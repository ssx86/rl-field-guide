# rl-guide/ src/components（34 文件）· folder-level + 抽样

### src/components/  [folder-level]
- 内容: 交互课程指南的组件层——28 个 React (.tsx) 交互岛（课程屏、实验小部件、面板）+ 6 个服务端渲染 .astro 组件（静态文章图/布局）+ ui/ 原语子目录。
- 模式: 按前缀分族——`*-screen.tsx`（home/lesson/chapter/bandit）为 4–11KB 编排布局；`chapter-*`、`bandit-*` 为被各屏组合的子部件；实验台（return-lab、control-update-lab、mechanics-workbench、corridor-experiment）为带证据回调的动手小部件；通用面板（evidence-panel、prediction-panel、explanation-lens、method-tabs、formula）为可复用展示件；app-header 为布局件。约定：交互在 .tsx（水合、状态+域逻辑），静态解释在 PascalCase .astro。
- 坑/价值: **上线产品只用 6 个 .astro 组件**；全部 28 个 .tsx 属于已停用的 SPA 层（见 spa-layer.md 警示）——.astro 文件零 .tsx 引用，dist 零 astro-island（verify-static 禁之）。

### src/components/chapter-screen.tsx（抽样）
- 职责: 单章顶层编排屏——串起预测、交互实验、内容、检查点、侧栏并记录证据种类。
- 关键: ChapterScreen；按 chapter.id 挂实验台（"returns"/"td-control"）或 hasMechanicsLab()；~83 行。
- 坑/价值: 证据记录（prediction/experiment/numeric/transfer/reflection）由用户交互在此触发——进度追踪咽喉点。属 SPA 层。
- lastRead: d6f85b0 (2026-10-13)

### src/components/bandit-board.tsx（抽样）
- 职责: 三臂老虎机实验面板——奖励表、ε-greedy/UCB 页签、运行/对比决策控制。
- 关键: BanditBoard；runBanditDecision/ucbScore/INITIAL_BANDIT_ARMS；~91 行。
- 坑/价值: 预测未锁定前"运行一次决策"禁用——predict-first 门控在 props；对比轨迹每渲染重算。属 SPA 层。
- lastRead: d6f85b0 (2026-10-13)

### src/components/method-tabs.tsx（抽样）
- 职责: 规划课三解法的受控 Radix 页签（含各法摘要）；~37 行。
- 坑/价值: 纯展示全受控；文案来自 planning-lesson 数据模块。属 SPA 层。
- lastRead: d6f85b0 (2026-10-13)

### src/components/ui/button.tsx（per-file）
- 职责: cva Button——primary/secondary/ghost 变体 × default/sm/icon 尺寸、asChild Slot；~35 行。
- lastRead: d6f85b0 (2026-10-13)

### .astro 组件（6，线上在用）
ArticleDiagram.astro（知识图，variant 类驱动 flow/pipeline/compare/branch/matrix/bars 布局）、GuideHeader.astro（粘性头 + 主题切换）、LearningLoopVisual.astro（五步阅读法视觉）、LessonDiagram.astro（课时图，type-only 引用 bilingual-course 类型）、MethodMap.astro（方法选择地图）、StaticEvidence.astro（静态证据步进条）——被 src/pages 的三组页面与 GuideLayout 消费，随 `astro build` 预渲染进 dist。

> 其余 .tsx 组件未逐个阅读（folder-level 批处理规则）；新增/变更文件由 manifest-check 提示再读。
