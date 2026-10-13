# rl-guide/ 根目录文件（14 + artifacts/public 各 1 二进制）

### .gitignore
- 职责: Astro/Node 标准忽略——node_modules、dist、.astro、coverage、test-results、.env、*.log、*.tsbuildinfo、vite.config 编译产物；~12 行。
- lastRead: d6f85b0 (2026-10-13)

### AUDIT.md
- 职责: 2026-10-12 多视角产品/内容审计报告。
- 关键: 产品决策（长文阅读课程而非幻灯片）；六视角评审表（PM/UI-UX/自评/初学者脑/平实语言/科普）；P0–P2 发现与解决表；"已验证状态"——12 测试文件/61 测试通过、lint 干净、0 Astro 警告、48 静态页/46 章浏览器四视口核验；明确不主张之事（掌握度/穷尽覆盖/安全审批/部署就绪）；~41 行。
- 坑/价值: 与当日一致、无未决项——但注意其"61 测试"大部分覆盖的是未上线的历史交互层（见工作区审计报告）。
- lastRead: d6f85b0 (2026-10-13)

### README.md
- 职责: 项目 README——RL Field Guide 课程站、本地用法、质量检查。
- 关键: 英文-only 46 章/9 部课程；Astro+React+TS+Tailwind+定制 shadcn/ui；端口 5180 /rl-field-guide/；dev/test/lint/build/verify:static/audit-browser.py；证据边界声明；~35 行。
- lastRead: d6f85b0 (2026-10-13)

### astro.config.mjs
- 职责: Astro 构建配置——site ssx86.github.io、base /rl-field-guide、静态输出、trailingSlash always、React 集成、Tailwind v4 插件；~14 行。
- lastRead: d6f85b0 (2026-10-13)

### brain.md
- 职责: "初学者脑"认知账本——46 章逐页的前置/类比/边界映射（受众建模）。
- 关键: 受众定义（无 RL/概率/微积分/NN 背景的平实英语成年人）；46 行逐章表（新增事实/桥接类比/认知检查与边界）；5 条跨页一致性规则；"最终学习者状态"与显式不主张；~68 行。
- 坑/价值: 无 TODO/待办标记，与 AUDIT.md 验证态一致——当前有效。
- lastRead: d6f85b0 (2026-10-13)

### components.json
- 职责: shadcn/ui CLI 配置（style new-york、Tailwind v4 css、@/* 别名、phosphor）；~17 行。
- lastRead: d6f85b0 (2026-10-13)

### eslint.config.js
- 职责: 扁平 ESLint（tseslint + react-hooks + react-refresh）；忽略 dist/coverage/.astro/env.d.ts；~22 行。
- lastRead: d6f85b0 (2026-10-13)

### index.html
- 职责: 遗留 Vite SPA 入口（title "RL Field Guide"、#root、/src/main.tsx）；~13 行。
- 坑/价值: **孤儿候选**——现产品是 Astro（astro dev/build 不用此文件），构建产物与部署完全不含它；仅被已停用的交互 SPA 层引用。
- lastRead: d6f85b0 (2026-10-13)

### package-lock.json
- 职责: npm 锁文件 v3（rl-field-guide@0.1.0；astro ^7.3.8、react 19、radix、katex、recharts 等）；仅读头部。
- lastRead: d6f85b0 (2026-10-13)

### package.json
- 职责: 站点清单——type module；dev/preview（astro，5180）、build=`astro check && astro build`、verify:static、lint、test=vitest run；~53 行。
- lastRead: d6f85b0 (2026-10-13)

### tsconfig.app.json
- 职责: Vite 模板遗留的 app 级 TS 配置；~22 行。
- 坑/价值: **疑似冗余**——Astro 构建走根 tsconfig.json（extends astro/tsconfigs/strict）；vitest 亦可用根配置。属遗留交互层配套。
- lastRead: d6f85b0 (2026-10-13)

### tsconfig.json
- 职责: 根 TS 配置——extends astro/tsconfigs/strict、.astro/types.d.ts、@/* 别名、vite/client+vitest+jest-dom 类型；~12 行。
- lastRead: d6f85b0 (2026-10-13)

### tsconfig.node.json
- 职责: Node 侧配置文件 TS 配置（vite.config.ts、eslint.config.js）；~10 行。
- lastRead: d6f85b0 (2026-10-13)

### vite.config.ts
- 职责: Vitest 配置（兼 Vite dev）——react+tailwind 插件、@ 别名、5180 端口、jsdom+setup；~24 行。
- 坑/价值: 主要供 vitest 消费；站点 dev/build 走 astro.config.mjs；端口与 package.json astro 脚本重复声明。
- lastRead: d6f85b0 (2026-10-13)

### artifacts/rl-field-guide-home.png [binary]
- 职责: 首页截图审计证据（109KB，git 跟踪，2026-10-11）；保留。

### public/favicon.svg [binary]
- 职责: 站点图标（246B，git 跟踪）。
