# rl-guide/ MANIFESTS 索引 — RL Field Guide（rl-field-guide@0.1.0）

纯中文 46 章/9 部分 RL 阅读课程（Astro 静态站），部署于 ssx86.github.io/rl-field-guide。
2026-10-19 纯中文重写版上线：旧三语架构与 SPA 遗留层整体删除（墓碑见 [folders/rebuild-2026-10-19.md](folders/rebuild-2026-10-19.md)，恢复基线 `git checkout 1bc75f0`）；现行权威内容 = `src/content/zh-chapters/ch01..46.ts`，页面 = `src/pages/zh/`。

## 源码/文档文件夹

| 文件夹 | 文件数 | 模式 | 摘要 |
|---|---|---|---|
| (root) | 12 | per-file | [root.md](folders/root.md) — 审计/认知账本/配置 + REBUILD-PROMPT.md（2026-10-19 重写任务书） |
| .github · docs/audit-2026-10-12 · scripts | 6 | per-file | [docs-and-scripts.md](folders/docs-and-scripts.md) — 部署工作流、审计决策文档、校验脚本（verify-static.mjs 已按新结构重写） |
| src/content/zh-chapters（现行权威） | 48 | per-file | 46 章纯中文内容 + render.ts（KaTeX 服务端渲染）+ zh-guide.ts（内容模型） |
| src/pages · src/styles | 50 | per-file | [astro-site.md](folders/astro-site.md) — 纯中文站点层：根重定向 + /zh/ 目录 + 46 章静态页 + 保留样式 |
| 🪦 已删除 | — | tombstone | [rebuild-2026-10-19.md](folders/rebuild-2026-10-19.md) — 2026-10-19 删除的三语路由/双语内容/SPA 层/旧测试（含各目录考古走查：[spa-layer.md](folders/spa-layer.md)、[content.md](folders/content.md)、[components.md](folders/components.md)） |
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
