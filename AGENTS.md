# AGENTS.md — rl-field-guide (rl-guide)

Legislated 2026-10-14 by repo-cartographer from the workspace audit reports
(`../MANIFESTS/reports/2026-10-13-audit.md`, `2026-10-13-status-audit.md`).

## Project Focus

- 本项目只做: publishing the **English-only, reading-first RL Field Guide** — a
  46-chapter / 9-part reading course built as a static Astro site
  (https://ssx86.github.io/rl-field-guide). Shipped product = `src/pages/` +
  `src/content/curriculum.ts` + `src/content/chapters/part-1..9.ts`, deployed from
  `dist/` by CI with `verify:static` + `audit-browser.py` gates.
- 属于本项目的工作流（层，不是独立目标）: the audit decision archive
  (`docs/audit-2026-10-12/`), the archived founding prototype
  (`docs/RL_GUIDE_PROTOTYPE.md` — historical, do not implement from it),
  verification scripts (`scripts/`), the cognitive ledger (`brain.md`),
  CI + GitHub Pages deployment.
- 不属于本项目的事情（发现即向用户提出，不静默吸收）:
  - Interactive lesson UI in the shipped product — the 2026-10-12 audit decided
    reading-first: lesson pages carry zero interactive controls / zero
    astro-islands (enforced by `scripts/verify-static.mjs`). Runnable experiments
    belong in the sibling `qlearning` repo.
  - Chinese locale output — English-only is a deliberate product decision
    (no `/zh/` route; CJK is test-banned in shipped content). zh material exists
    only inside the legacy layer below.
  - Chapter content that bypasses `CURRICULUM` / `CHAPTER_ARTICLES` — the 46-count,
    ordering, and depth contracts are enforced by `curriculum.test.ts` /
    `chapter-article.test.ts`; change them consciously, never accidentally.
- **Focus violation awaiting user decision (pending user decision)**: the legacy
  interactive SPA layer (~50 files: `src/App.tsx`, `src/components/*.tsx` (28),
  `src/domain/`, bilingual `src/content/bilingual-course.ts` zh+en track,
  `index.html`, `src/styles.css`) is superseded by the reading-first course —
  no `.astro` page mounts it and `dist/` contains zero astro-islands. Three
  options were proposed 2026-10-13: keep as test asset / extract / remove.
  Until decided: it stays test-covered, carries the design-debt notice in
  `src/App.tsx`, and nothing new may be built on it.

## Structure Contract

- 目录权威: `MANIFESTS/INDEX.md` — new top-level folders must be registered there
  (with a summary) in the same change that creates them.
- 放置规则: new chapters → add a part module in `src/content/chapters/` +
  `CURRICULUM` entry (same change updates the count in `chapter-article.test.ts`);
  static page/layout work → `src/pages/` + `.astro` components; styles →
  `src/styles/guide*.css`; audit/decision docs → `docs/<topic>-<date>/`.
- 根目录禁放: one-off screenshots (use `artifacts/` for audit evidence), manual
  backups, scratch exports. `index.html` + `tsconfig.app.json` currently serve
  only the legacy layer — their fate is tied to the pending SPA decision.

## File Hygiene Rules

From the 2026-10-13 audit findings — these are "do it right at creation time" laws:

- **换路必清旧路**: when an approach is replaced, retire the old surface in the
  same change — delete it, or banner it (SUPERSEDED notice pointing to the new
  path) and consciously decide its tests' fate. Audit finding F1: the
  SPA→reading-course switch left the entire interactive layer in place with its
  tests green, which is exactly the double-track residue this law exists to
  prevent. (True retirement of that layer needs explicit user authorization.)
- **未提交的工作不悬空**: end a working session with changes committed or
  explicitly stashed with a note. Audit finding F2: an unexplained uncommitted
  trim dangled on a published branch.
- **浏览器审计产物即产即清**: `test-results/` Playwright profiles are regenerable
  scratch — delete after audit runs, don't let 18MB accumulate (finding F6);
  generated dirs (`dist/`, `.astro/`) are gitignored the moment they exist.
- **分支指针同步**: after publishing a feature branch to `origin/main`,
  fast-forward the local `main` pointer in the same session (finding F5).
- **英文-only 内容法**: shipped content stays CJK-free (tests enforce); any zh
  material lives only in the legacy layer pending the SPA decision.
- **无游离文件**: every new file is committed or gitignored within its working
  session. (Finding F4: the founding prototype floated at the workspace root
  outside any repo until archived into `docs/`.)
- **删除留墓碑**: any `git rm` records what/why/how-to-restore in
  `MANIFESTS/folders/*.md`.

## Last Audit

- 2026-10-13 repo-cartographer: reports at `../MANIFESTS/reports/2026-10-13-audit.md`
  and `2026-10-13-status-audit.md`; 遗留用户决策 2 项: (1) legacy SPA layer
  retirement (keep / extract / remove), (2) fate of the uncommitted
  `src/content/chapters.ts` trim (commit or discard).
