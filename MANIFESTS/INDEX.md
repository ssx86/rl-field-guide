# rl-guide/ MANIFESTS 索引 — RL Field Guide（rl-field-guide@0.1.0）

英文-only 46 章/9 部 RL 阅读课程（Astro 静态站 + React 遗留交互层），部署于 ssx86.github.io/rl-field-guide。
HEAD d6f85b0（feature/comprehensive-reading-course == origin/main；本地 main 落后 10 提交；工作树含 src/content/chapters.ts 未提交修改，2026-10-13）。

## 源码/文档文件夹

| 文件夹 | 文件数 | 模式 | 摘要 |
|---|---|---|---|
| (root) | 14 | per-file | [root.md](folders/root.md) — 审计/认知账本/配置；index.html 与 tsconfig.app.json 为遗留孤儿候选 |
| .github · docs/audit-2026-10-12 · scripts | 7 | per-file | [docs-and-scripts.md](folders/docs-and-scripts.md) — 部署工作流、四份审计决策文档、静态+浏览器校验脚本 |
| src（根）· src/domain · src/hooks · src/lib · src/test | 20 | per-file | [spa-layer.md](folders/spa-layer.md) — **已停用的交互 SPA 层**（有测试守护；类型仍被线上引用） |
| src/components | 34 | **folder-level** | [components.md](folders/components.md) — 6 个 .astro 线上在用 + 28 个 .tsx 属 SPA 层；抽样 3 + ui/button |
| src/content | 17 + 9 | per-file | [content.md](folders/content.md) — 线上权威（curriculum + part-1..9）与遗留内容（旧 10 章库/双语 16 课/实验文案）混居 |
| src/layouts · src/pages · src/styles | 6 | per-file | [astro-site.md](folders/astro-site.md) — 线上站点层（布局/三组页面/样式） |
| artifacts · public | 2 | binary | 首页截图审计证据 + favicon（见 root.md 尾） |

## Gitignored 产物目录（folder-level，永不逐文件走查）

| 目录 | 生成方式 | 体量 | 备注 |
|---|---|---|---|
| node_modules/ | `npm install` | ~391MB | 可再生 |
| dist/ | `npm run build`（astro） | ~2.9MB | 48 页当前构建（部署由 CI 重做） |
| .astro/ | `astro sync`/dev/build | 小 | 生成类型 |
| test-results/ | scripts/audit-browser.py（Playwright） | ~18MB | 浏览器 profile 残留，可再生——已处置清档（见 reports） |
| tsconfig.*.tsbuildinfo | tsc | 小 | 增量状态 |

## 机器状态

`state.json` — 106 文本文件 + 上述 ignored 目录；`node manifest-check.mjs <repo>` 复查。
报告见上级工作区 `../MANIFESTS/reports/`（工作区级审计，覆盖 qlearning + rl-guide 两库）。
