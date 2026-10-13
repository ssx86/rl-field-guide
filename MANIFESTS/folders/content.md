# rl-guide/ src/content（17 + chapters/ 9 = 26 文件）——课程内容层

> 混合状态：`curriculum.ts` + `chapters/part-1..9.ts` + `chapter-articles.ts` 是**线上 46 章课程的权威内容源**（经 [lang]/learn/[lesson].astro 渲染）；
> `chapters.ts`（旧 10 章库）、`course.ts`（12 课旧轨道）、`bilingual-course.ts`（16 课双语）、`learning-labs.ts`、`foundational-extensions.ts`、`planning-lesson.ts`、`mechanics-labs.ts` 服务于已停用的交互 SPA 层（有测试守护）。

### src/content/curriculum.ts 【线上权威】
- 职责: 规范阅读课程定义——9 部（problem/tabular/scale/memory/models/data/structure/reliability/language）× 46 章有序（slug/标题/目的/桥接/前置/覆盖标签）+ PARTS 元数据。
- 关键: PARTS、PartId、CurriculumChapter、CURRICULUM（order=数组位次+1）；~449 行纯数据。
- 坑/价值: 章序仅由数组位置决定、前置为自由字符串——仅靠 curriculum.test.ts 兜底；slug "continuous-control" 与旧 CHAPTERS 同名 id 撞名（内容形状不同）。
- lastRead: d6f85b0 (2026-10-13)

### src/content/curriculum.test.ts 【线上权威】
- 职责: 验证恰 9 部 46 章、序号 1..46 连续、slug 唯一、标题/目的/桥接长度门槛、24 个必需覆盖标签各至少一章、前置不指向后续章（悬空前置也会失败）；~65 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapter-articles.ts 【线上权威】
- 职责: 聚合九个分部文章模块为按线路序的 46 篇 CHAPTER_ARTICLES + slug 查找。
- 关键: 展开序即路由序（测试强制与 CURRICULUM 同步）；getChapterArticle 未知 slug 抛错；~30 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapter-types.ts
- 职责: 旧 10 章格式的类型契约（Chapter 及概念/例子/对照/检查点/护照子结构）；~56 行纯类型。
- 坑/价值: Chapter.id 必须是 course-progress 的 LessonId——把旧内容层钉在 SPA 进度域上。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapter-article.ts 【线上权威】
- 职责: 长文文章契约——slug/标题/导语/开篇问/桥接/情境/图/算例（setup/prediction/steps/result）/机制节/方程（latex/read/meaning）/边界/下一桥接/来源。
- 关键: 纯类型；深度约束全在 chapter-article.test.ts 而非类型本身；~50 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapter-article.test.ts 【线上权威】
- 职责: 验证 46 篇文章——九分部模块与 CURRICULUM slug 序一致、每篇 ≥3 情境段/≥3 图项/≥3 算例步/≥3 机制节/≥1 方程/≥2 边界段/≥2 来源/>500 词、方程散文长度、恰 46 篇唯一、约 100 个 RL 方法族术语在语料中出现；~184 行。
- 坑/价值: 46 计数与术语语料断言使增删章/删词都会挂 CI。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapters/part-1.ts ~ part-9.ts 【线上权威，9 文件】
- 职责: 逐部文章数据——part-1 问题分类与基础（5 章 318 行：before-rl/interaction-loop/return-horizon/probability-expectation/bandits-contextual-bandits）；part-2 表格核心（7 章 373 行：mdp-state-design/value-bellman/dynamic-programming/monte-carlo/td-traces/tabular-control/off-policy-deadly-triad）；part-3 深度值与策略梯度（9 章 457 行：linear→distributed-rl，内容最密）；part-4 结构挑战（3 章 156 行：pomdp-memory/deep-exploration/long-horizon-credit）；part-5 基于模型（3 章 156 行：mcts-alphazero/dyna-mpc/latent-world-models）；part-6 数据与演示（5 章 256 行：behavior-cloning-dagger/inverse-rl-gail/offline-rl/decision-transformer/off-policy-evaluation）；part-7 结构化泛化（3 章 156 行：hierarchical-rl/multi-agent-rl/transfer-meta-generalization）；part-8 可靠性工程（4 章 206 行：reward-design/safe-robust-risk/evaluation-reproducibility/rl-systems）；part-9 LLM 后训练（7 章 356 行：llm-as-rl→method-selection）。
- 关键: 每章满足严格 readonly ChapterArticle[] 结构（情境/图/算例/机制/方程/边界/桥接/来源）；来源常量 SUTTON_BARTO/SB、part-9 本地 PPO 常量。
- 坑/价值: 结构变更波及全部九部；part-9 分类不变式"名称不决定范式"（拒绝采样微调与 DPO 特意不标在线 RL）。
- lastRead: d6f85b0 (2026-10-13)

### src/content/chapters.ts 【遗留 SPA 层】
- 职责: 旧英文概览章库——10 篇全撰章（foundations…formula-atlas），每章开篇问/主张/预测测验/概念公式/例子/反例/对照表/检查点/护照。
- 关键: CHAPTERS 常量映射、ChapterId、isChapterId；~340 行（工作区有未提交删减，见审计报告）。
- 坑/价值: `as const satisfies Record<string, Chapter>` 只查结构不查键错；id 兼作 LessonId；"continuous-control" 与 CURRICULUM slug 撞名不同物。**未上线**（仅 SPA 层引用）。
- lastRead: d6f85b0 (2026-10-13, 工作树含未提交修改)

### src/content/chapters.test.ts 【遗留 SPA 层】
- 职责: 验证旧库 10 章 id 精确有序、每章 ≥4 概念/≥2 例子/反例>20 字、全文零中文字符；~28 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/course.ts 【遗留 SPA 层】
- 职责: 课程落地页结构——4 组 12 课（全 available）+ 4 阶段教学法标签；~54 行。
- 坑/价值: 描述旧概览轨道（混 CHAPTERS id 与 bandits/planning），非 46 章 CURRICULUM；"planned" 状态未用。
- lastRead: d6f85b0 (2026-10-13)

### src/content/bilingual-course.ts 【遗留，类型仍被线上引用】
- 职责: 16 课双语（en+zh 全量翻译）课程库——LANGUAGES/LessonId（16 个）/Lesson/CourseCopy 类型 + getCourse/getLesson。
- 关键: ~870 行；每课开篇问/前置/成果/故事/概念/例子/公式/误区/迁移/下一课理由；zh 与 en 逐课对译。
- 坑/价值: **Language 与 LessonId 类型被 GuideLayout/GuideHeader/LessonDiagram 以 type-only import 引用**——文件不可整体删除；zh 内容按覆盖计划已从产品裁撤（英文-only 决策）但测试仍验双语对齐。
- lastRead: d6f85b0 (2026-10-13)

### src/content/bilingual-course.test.ts 【遗留 SPA 层】
- 职责: 验证 en/zh 课程结构精确对齐（同 id 序、≥12 课）、前置只引更早课、每课 ≥2 例子/误区/迁移、逐 id 稳定查找、LLM 四课有序深轨（≥4 概念、≥1 参考）、语言恰为 en+zh；~69 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/learning-labs.ts 【遗留 SPA 层】
- 职责: 每课的实验文案（en+zh 双语）——基础/预测/证据/迁移四段结构。
- 关键: getLearningLab(language, lessonId)；~131 行。
- 坑/价值: 依赖 bilingual-course 的 16 LessonId；数值证据由测试强制。
- lastRead: d6f85b0 (2026-10-13)

### src/content/learning-labs.test.ts 【遗留 SPA 层】
- 职责: 验证双语每课有问题/数值证据/可见迁移解释，及修正后的公式边界（planning r(s,a,s')、deep-value (1-d)、real-world 无公式）；~29 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/foundational-extensions.ts 【遗留 SPA 层】
- 职责: 规划/老虎机两课的"完整方法族"扩展概念卡（策略迭代族；Thompson/上下文/非平稳/遗憾）；~31 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/mechanics-labs.ts 【遗留 SPA 层】
- 职责: 8 个力学工作台（问题表述/DQN 稳定/策略更新/连续动作/学习世界/部署证据/方法选择/公式代入），每个 3 案例（givens/operation/result/interpretation）；~103 行。
- 坑/价值: 全英文（测试强制）；案例数值精确（5.30/1.70/2.40/4.60/4.69/−49.00 等）。
- lastRead: d6f85b0 (2026-10-13)

### src/content/mechanics-labs.test.ts 【遗留 SPA 层】
- 职责: 验证恰 8 工作台、每台 3 案例、字段长度门槛、全文零中文；~32 行。
- lastRead: d6f85b0 (2026-10-13)

### src/content/planning-lesson.ts 【遗留 SPA 层】
- 职责: 规划课三解法（同步/有序/采样）摘要文案 METHOD_SUMMARIES + LessonMethod 类型；~7 行。
- lastRead: d6f85b0 (2026-10-13)
