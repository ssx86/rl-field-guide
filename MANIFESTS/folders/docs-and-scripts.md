# rl-guide/ .github · docs · scripts——部署、审计与验证层

### docs/formula-audit-2026-10-14.md
- 职责: 记录 46 章双语公式的记号约定、语义修正、严格渲染范围与证据边界。

### docs/RL_GUIDE_PROTOTYPE.md 【历史原型，2026-10-13 自工作区根归档入库】
- 职责: rl-guide 的创建原型（"prototype for review. No production frontend code has been generated yet"）——本库立项前的设计文档。
- 关键: 设计读（继承 qlearning/design.md 视觉语言）；产品边界（独立 SPA、拟建目录即本库、端口 5180、Vite/React/TS/Tailwind/KaTeX、qlearning 只读引用）；学习者模型 8 原则 + "See→Predict→Run→Inspect→Name→Formula→Break→Transfer" 课程循环；12 节信息架构 + 知识覆盖表；ASCII 屏幕原型（学习地图/证据本）；~410 行。
- 坑/价值: 描述的是**最初的 12 节交互 SPA 设计**——该设计已被 2026-10-12 审计的 46 章阅读优先课程取代；作历史依据读，勿按此实施。曾在工作区根悬空（不属于任何 git 库），审计后移入本目录。
- lastRead: d6f85b0 (2026-10-13)

### .github/workflows/deploy-pages.yml
- 职责: GitHub Actions——CI 验证+构建后部署 Pages（push main 或手动）。
- 关键: build job（Node 24、npm ci、test、lint、build、verify:static、上传 dist）→ deploy（deploy-pages@v5）；并发组 pages 不取消进行中；~63 行。
- 坑/价值: 部署完全被测试/lint/构建/静态校验门控；权限 contents:read + pages:write + id-token:write。
- lastRead: d6f85b0 (2026-10-13)

### docs/audit-2026-10-12/feature-brief.md
- 职责: 审计前产品快照——双语 16 课阅读优先指南 + 七阶段学习法；明确列出站内没有的东西（测验/隐藏答案/进度/账号/后端等）；~15 行。
- 坑/价值: 相对覆盖计划已过时（描述 16 双语课，而最终产品是 46 章英文）——作"审计前"快照读。
- lastRead: d6f85b0 (2026-10-13)

### docs/audit-2026-10-12/comprehensive-coverage-plan.md
- 职责: 审计中央决策文档——定义"完整覆盖"、重写为 46 章/9 部路线、深度契约、阅读优先 UI 契约。
- 关键: 覆盖规则（术语须含目的/机制/例子/方程/失败边界才算覆盖）；来源脊柱（Sutton & Barto、Spinning Up、Gymnasium）；Before RL→…→LLM 后训练全路线；逐章深度契约（具体情境先于术语、语义图、算例、机制散文、量后才记号、反例、桥接、来源）；阅读优先 UI（无点击依赖的学习内容）；~113 行。
- 坑/价值: 取代旧 16 课设计；英文课程为权威且英文-only 是决策（无 /zh/ 路由）。
- lastRead: d6f85b0 (2026-10-13)

### docs/audit-2026-10-12/blind-questions-v1.md
- 职责: 盲测压力测试工件——隔离提示词 + 30 道固定格式盲用户问题（零背景学习者会遇到的缺陷）。
- 关键: 中文提示词禁用工具/代码/文档；30 问覆盖零基础可学性、学习循环诚实性、公式/示例可信度、导航与进度、双语对齐、移动/键盘/读屏、主题、失败边界、结课能力声明；~72 行。
- 坑/价值: 只有问题无答案——是 verification 矩阵与 audit-browser.py 部分回答的清单。
- lastRead: d6f85b0 (2026-10-13)

### docs/audit-2026-10-12/verification.md
- 职责: 验证矩阵——审计要求什么、实际验证了什么、用什么检查。
- 关键: 19 区域全 verified（9 部/恰 46 章链、46/46 图与算例、课内零交互控件零 astro-island、≥2 边界段与 ≥2 来源/章、320–768px 无横溢、键盘跳链、主题、零控制台错误、48 预渲染页）；命令与结果（61 测试/12 文件、lint 过、48 页 0 错、verify:static OK、audit-browser.py OK）；~35 行。
- 坑/价值: 文件内明示开放限制——检查只认证工件状态，不认证学习效果或真实部署；另注依赖弃用提示在发布路由之外。
- lastRead: d6f85b0 (2026-10-13)

### scripts/verify-static.mjs
- 职责: CI 静态校验——校验 95 个产物页、46 对中英章节、必要内容针、逐章结构标记与内链完整性。
- 关键: en/zh 各 46 章；逐课须含 knowledge-diagram/static-evidence/longform-prose/来源/边界，禁止旧卡片结构与 astro-island。
- lastRead: d6f85b0 (2026-10-13)

### scripts/audit-browser.py
- 职责: Playwright 无头浏览器行为审计——中英路线结构、92 章解剖、严格公式矩阵、语言锚点、主题、响应式、键盘与控制台洁净。
- 关键: en/zh 各 46 链；逐章恰 1 知识图/1 静态证据/零课内控件/零 astro-island；320–768px 无文档级横溢；公式区允许局部滚动但页面不溢出。
- 坑/价值: 需先 build+preview+Playwright；硬编码选择器（.route-stage 等）与特定章节路径——标记约定变更会静默失配。test-results/ 的浏览器 profile 即其运行残留。
- lastRead: d6f85b0 (2026-10-13)
