# AGENTS.md — rl-field-guide (rl-guide)

 Originally legislated 2026-10-14 by repo-cartographer; **rewritten 2026-10-19** after the
pure-Chinese rebuild (decision record: `REBUILD-PROMPT.md`; deletion tombstones:
`MANIFESTS/folders/rebuild-2026-10-19.md`). The old bilingual laws below the history line
are void.

## Project Focus

- 本项目只做：publishing the **pure-Chinese, reading-first RL Field Guide** — 46 章 / 9 部分
  叙事式教程，Astro 静态站（https://ssx86.github.io/rl-field-guide/zh/）。
  Shipped product = `src/content/zh-chapters/ch01..46.ts` + `src/pages/zh/*.astro` +
  `render.ts`（KaTeX 构建期服务端渲染），由 CI 以 `test → lint → build → verify:static`
  四道门部署到 GitHub Pages。
- 属于本项目的工作流：校验脚本（`scripts/verify-static.mjs`、`check-zh-chapter.mjs`、
  `fix-zh-backslashes.mjs`）、认知账本（`brain.md`）、MANIFESTS 墓碑体系、CI 部署。
- 不属于本项目的事情（发现即向用户提出，不静默吸收）：
  - 页面内交互控件 / astro-island —— 产品是纯阅读静态页（verify-static 断言零 island）
  - 旧三语架构的任何复活 —— `/en/`、`/bilingual/`、六区块模板已删除，恢复需用户明示
  - 未经用户决策改动 `src/styles/` 与 `astro.config.mjs`（视觉与构建配置冻结）

## Structure Contract

- 内容权威：`src/content/zh-chapters/`。新增/修改章节 = 改对应 `chXX.ts`（纯文本，
  `\n\n` 分段、`## ` 二级标题、`**加粗**`、`$$公式$$`/`$公式$`；LaTeX 反斜杠在模板字符串里
  必须双写 `\\theta`——写完跑 `node scripts/check-zh-chapter.mjs <file>` 与
  `node scripts/fix-zh-backslashes.mjs --check`）。
- 页面：每章一个静态页 `src/pages/zh/chXX.astro`（模板复制自 ch01.astro，只改 import 与
  常量名）；目录页 `src/pages/zh/index.astro` 需导入全部章节；根 `src/pages/index.astro`
  重定向到 `/zh/`。**不用动态路由**（Windows 上曾出问题）。
- 墓碑：任何 `git rm` 在 `MANIFESTS/folders/*.md` 记录 what/why/how-to-restore。
- 根目录禁放临时文件；生成目录（dist/.astro）已在 .gitignore。

## File Hygiene Rules

- **换路必清旧路**：替换方案时同一变更内退役旧面（2026-10-19 重建是完整范例：内容、
  路由、测试、CI 校验一次切换，不留双轨）。
- **未提交的工作不悬空**：会话结束前提交或显式 stash 并留言。
- **CI 必须绿**：push 前本地跑全链路 `npm test && npm run lint && npm run build &&
  npm run verify:static`。verify-static 断言 48 页（根 + 目录 + 46 章）——改页面数量
  必须同步改脚本。
- **删除留墓碑**、**无游离文件**、**分支指针同步**（push 后同会话内对齐本地/远端指针）。

## Zero-Test Constraint

旧结构测试已全部删除。内容质量由三道程序化门槛把关（禁用词/字数/链接完整性、KaTeX
逐公式渲染、全站产物断言）。若未来恢复测试，需用户决策并更新本文件。

## Last Audit

- 2026-10-13 repo-cartographer：报告在 `../MANIFESTS/reports/`。两项遗留决策均已结案：
  (1) legacy SPA layer → 2026-10-19 随重建整体删除；(2) chapters.ts 未提交裁剪 → 随旧
  内容层一并消失。

## History

- 2026-10-14 立法时的双语架构规则已被 2026-10-19 纯中文重写取代，原文见
  `git show 1bc75f0:AGENTS.md`。
