# rl-guide/ 遗留交互 SPA 层（src 根 5 + domain 10 + hooks 2 + lib 1 + test 1）

> 🪦 **本层已于 2026-10-19 随纯中文重写版整体删除**（决策：REBUILD-PROMPT.md；恢复：`git checkout 1bc75f0 -- src/ index.html`）。2026-10-13 审计的"keep / extract / remove"待决事项至此结案：remove。以下为删除前的走查记录，仅供考古。

> ⚠️ 设计债警示（2026-10-13 审计）：以下文件属于**已被取代的交互式课程层**——
> 2026-10-12 审计决定产品为"阅读优先、课内零交互控件/零 astro-island"（docs/audit-2026-10-12/comprehensive-coverage-plan.md、verification.md），
> 构建产物 dist/ 不含任何 astro-island，.astro 页面也不引用任何 .tsx 组件。
> 该层仍有 61 项测试守护（CI 门槛），`bilingual-course.ts` 的 Language/LessonId 类型仍被 .astro 文件以 type-only 方式引用，因此不可整层直接删除——退役需用户决策。

### src/App.tsx
- 职责: SPA 根组件——手写路由在家页/规划课/老虎机课/通用章节屏间切换。
- 关键: BanditScreen/ChapterScreen/HomeScreen/LessonScreen、CHAPTERS+isChapterId、useCourseProgress、useTheme；~66 行。
- 坑/价值: "planning"/"bandits" 有专屏，其余 id 落入 ChapterScreen；规划课一次回调发两类证据事件——证据记账在 App 而非各屏。**未被任何 .astro 页面挂载**；2026-10-13 审计已在文件头加设计债警示注释（指向线上内容真实所在与退役前置条件）。
- lastRead: d6f85b0→工作树 (2026-10-13, 加警示注释后重读戳记)

### src/App.test.tsx
- 职责: SPA 端到端行为测试——首页/规划课/老虎机课/章节屏的 predict-run-verify 流。
- 关键: 锁定预测前按钮锁定、单扫 Bellman 传播（S0=1.81）、证据本回传地图、UCB 算术（6.68）、MC 回报（0.81/0.51/2.40）、TD 控制终止去自举等；~156 行。
- 坑/价值: beforeEach 清 localStorage；全部数字为精确字面量。
- lastRead: d6f85b0 (2026-10-13)

### src/main.tsx
- 职责: React 入口——StrictMode 挂载 App 到 #root；~10 行。
- 坑/价值: 仅被根 index.html（遗留 Vite 入口）引用，Astro 布局不提供 #root——未上线。
- lastRead: d6f85b0 (2026-10-13)

### src/env.d.ts
- 职责: 环境类型声明（三斜线引用 .astro/types.d.ts 与 astro/client）；~2 行。
- 坑/价值: Astro 类型检查需要——**当前有效**（虽然归在本组）。
- lastRead: d6f85b0 (2026-10-13)

### src/styles.css
- 职责: SPA 全局样式——Tailwind、明暗变量、@theme 令牌、课程/老虎机/章节/实验室组件样式；~1093 行。
- 坑/价值: 多处 min-height: calc(100dvh - 161px) 硬编码头高；corridor-grid 13 列与 7 状态走廊图紧耦合；**线上页面用的是 guide-base.css/guide.css，本文件只服务 SPA 层**。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/bandits.ts
- 职责: 纯老虎机引擎——样本均值更新、ε-greedy/UCB 选臂、一次决策全轨迹（奖励/更新/得分/遗憾/理由）。
- 关键: INITIAL_BANDIT_ARMS、sampleMeanUpdate、chooseEpsilonGreedy、ucbScore、chooseUcb、runBanditDecision；~109 行。
- 坑/价值: 随机性全注入；全部 2 位小数 toFixed；instantRegret 用 trueMean（先知信息）。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/bandits.test.ts
- 职责: 验证增量更新、注入随机的 ε 分支、未试臂 UCB 无穷、完整 UCB 决策轨迹（6.68）；~47 行。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/course-progress.ts
- 职责: 不可变证据账本——12 课 × 5 种证据去重记录 + 聚合。
- 关键: LessonId、EvidenceKind、createEmptyProgress、recordEvidence、evidenceTotals；~61 行。
- 坑/价值: recordEvidence 对重复种类返回同一引用（幂等）；createEmptyProgress 键序与 LessonId 声明序不同（仅观感）。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/course-progress.test.ts
- 职责: 验证每课每证据种类至多一条（重复返回同引用）与跨课聚合；~30 行。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/planning.ts
- 职责: 已知模型规划算法（固定 7 状态走廊）——同步 Bellman 扫、有序反传、样本 Q-learning 回合，均带数值轨迹。
- 关键: synchronousBellmanSweep（Jacobi 快照）、orderedBackwardPass（就地）、qLearningEpisode；~142 行。
- 坑/价值: 三者强制 values[TERMINAL]=0；全部显示数字 2 位舍入；轨迹按状态索引。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/planning.test.ts
- 职责: 验证单扫恰传一状态、有序一遍解走廊（S0=1.81）、Q-learning α=1 与扫一致但上游需多回合、终态永不自举；~58 行。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/returns.ts
- 职责: 纯计算器——折扣回报、MC 更新、TD(0)、n 步回报、普通重要性采样权重。
- 关键: 各函数返回展示用轨迹对象；~70 行。
- 坑/价值: γ/α 钳 [0,1]；终止清自举项；权重>1 有意保留（方差教学点）。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/returns.test.ts
- 职责: 验证 0.81 折扣回报、MC 轨迹、TD 自举、终止忽略 nextValue（99）、两步混合（0.65）、IS 权重 2.4；~47 行。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/td-control.ts
- 职责: 四方法（sarsa/expected-sarsa/q-learning/double-q）单步 TD 控制更新的计算与叙事（bootstrap/target/新值 + 人读 targetMeaning）。
- 关键: 全字段可选教学默认（oldValue 2、reward -1、γ0.9、α0.5 等）；~81 行。
- 坑/价值: round() 加 1e-10 防半上漂移（与域内其它 toFixed 舍入不同）；double-q 用 doubleEvaluatorValues 评估。
- lastRead: d6f85b0 (2026-10-13)

### src/domain/td-control.test.ts
- 职责: 以编译期穷举表（satisfies Record<ControlMethod,…>）逐方法验证 bootstrap/target/新值/on-off-policy 标签与终止更新；~23 行。
- 坑/价值: 新增方法漏测试条目会在编译期失败。
- lastRead: d6f85b0 (2026-10-13)

### src/hooks/use-course-progress.ts
- 职责: 课程进度 hook——localStorage 持久化（rl-field-guide-progress-v1）+ addEvidence。
- 关键: restoreProgress 硬编码 12 课键；未知证据种类静默过滤；解析失败回空；~52 行。
- 坑/价值: 键集必须与 LessonId 联合类型同步。仅 SPA 层使用。
- lastRead: d6f85b0 (2026-10-13)

### src/hooks/use-theme.ts
- 职责: SPA 明暗主题 hook（documentElement data-theme + colorScheme）；~17 行。
- 坑/价值: 恒初始化 light 且不持久化——与 Astro 布局的 "rl-field-guide-theme" 键相互独立（两套主题系统）。
- lastRead: d6f85b0 (2026-10-13)

### src/lib/utils.ts
- 职责: cn（clsx + tailwind-merge）；~6 行。
- lastRead: d6f85b0 (2026-10-13)

### src/test/setup.ts
- 职责: Vitest setup——jest-dom + RTL cleanup；~5 行。
- lastRead: d6f85b0 (2026-10-13)
