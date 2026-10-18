# RL Field Guide · 强化学习指南（纯中文版）

一篇一章、读完就能懂的强化学习中文教程：46 章、9 个部分，从"什么时候需要 RL"一路讲到语言模型后训练（RLHF、DPO、RLAIF、RLVR/GRPO、推理时计算与选型）。基于 Astro 静态站构建，每页都是纯预渲染 HTML，公式由 KaTeX 在构建期服务端渲染。

- 线上地址：<https://ssx86.github.io/rl-field-guide/zh/>
- 内容：`src/content/zh-chapters/ch01..46.ts`（每章一个文件，纯文本叙事格式）
- 页面：`src/pages/zh/chXX.astro`（静态页，无动态路由）
- 渲染：`src/content/zh-chapters/render.ts`（分段、二级标题、加粗、行内/独立公式）

2026-10-19 之前的双语三路由架构与交互 SPA 遗留层已整体移除（决策记录见 `REBUILD-PROMPT.md`，墓碑见 `MANIFESTS/folders/rebuild-2026-10-19.md`，恢复基线 `git checkout 1bc75f0`）。

## 本地使用

```sh
npm install
npm run dev        # http://localhost:5180/rl-field-guide/zh/
```

## 质量检查（CI 同链路）

```sh
npm test                        # vitest（零测试约束，--passWithNoTests）
npm run lint                    # eslint
npm run build                   # astro check + astro build（48 页）
npm run verify:static           # 46 章齐全 + 全站 KaTeX 零错误 + 零 astro-island
node scripts/check-zh-chapter.mjs src/content/zh-chapters/chXX.ts   # 单章校验（字数/公式/禁用词/链接）
node scripts/fix-zh-backslashes.mjs --check                         # 模板字符串反斜杠体检
```

## 证据边界

构建与校验通过只证明内容结构一致、公式可渲染、路由齐全；不证明学习者已掌握 RL，也不代表教程结论可以直接用于生产系统。第 8、9 部分对这些问题有专门讨论。
