import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { stdout } from "node:process";
import { fileURLToPath, URL } from "node:url";

const rootPath = fileURLToPath(new URL("../dist/", import.meta.url));

function collect(directory, suffix) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collect(path, suffix) : path.endsWith(suffix) ? [path] : [];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pages = collect(rootPath, "index.html");
assert(pages.length === 145, `Expected 145 prerendered pages, found ${pages.length}`);
assert(existsSync(join(rootPath, "zh")), "The bilingual product must generate a Chinese route");
assert(existsSync(join(rootPath, "bilingual")), "The product must generate an alternating bilingual route");

const requiredPages = [
  ["index.html", "Open English course", "打开中文课程", "中/EN"],
  ["en/index.html", "A field guide to reinforcement learning", "Nine connected parts"],
  ["zh/index.html", "一套沿着决策与证据链展开的强化学习指南", "九个相连部分"],
  ["en/learn/rl-panorama/index.html", "How One Delivery Robot Leads Us Through Reinforcement Learning", "Seven plain questions for a new RL problem"],
  ["zh/learn/rl-panorama/index.html", "跟着一台配送机器人，走进整个强化学习", "用七个白话问题，判断一个新的强化学习任务"],
  ["bilingual/learn/rl-panorama/index.html", "language-pair", 'data-knowledge-term="reinforcement-learning"', "reinforcement learning, RL"],
  ["en/learn/before-rl/index.html", "decide whether learning from consequences is needed", "No prior RL vocabulary required"],
  ["en/learn/td-traces/index.html", "eligibility traces", "katex-display"],
  ["en/learn/offline-rl/index.html", "BCQ, CQL, and IQL", "support"],
  ["en/learn/rlvr-grpo/index.html", "RLVR, process rewards, and GRPO", "group-relative"],
  ["en/learn/method-selection/index.html", "deployment evidence is still missing", "weakest evidence level"],
  ["zh/learn/before-rl/index.html", "chapter-outline-desktop", "无需任何 RL 前置术语"],
  ["zh/learn/tabular-control/index.html", "Expected SARSA", "katex-display"],
  ["zh/learn/rlvr-grpo/index.html", "RLVR", "chapter-outline-mobile"],
  ["zh/learn/method-selection/index.html", "method selection", "lesson-references"],
  ["bilingual/learn/tabular-control/index.html", "language-marker", "State–Action–Reward–State–Action"],
];

for (const [page, ...needles] of requiredPages) {
  const html = readFileSync(join(rootPath, page), "utf8");
  for (const needle of needles) assert(html.includes(needle), `${page} is missing prerendered content: ${needle}`);
}

const englishLessonPages = collect(join(rootPath, "en", "learn"), "index.html").filter((page) => !page.includes("rl-panorama"));
const chineseLessonPages = collect(join(rootPath, "zh", "learn"), "index.html").filter((page) => !page.includes("rl-panorama"));
const bilingualLessonPages = collect(join(rootPath, "bilingual", "learn"), "index.html").filter((page) => !page.includes("rl-panorama"));
assert(englishLessonPages.length === 46, `Expected 46 English chapter pages, found ${englishLessonPages.length}`);
assert(chineseLessonPages.length === 46, `Expected 46 Chinese chapter pages, found ${chineseLessonPages.length}`);
assert(bilingualLessonPages.length === 46, `Expected 46 bilingual chapter pages, found ${bilingualLessonPages.length}`);

for (const page of englishLessonPages) {
  const html = readFileSync(page, "utf8");
  const name = relative(rootPath, page);
  assert(html.includes("knowledge-diagram"), `${name} is missing its semantic diagram`);
  assert(html.includes("static-evidence"), `${name} is missing its worked example`);
  assert(html.includes("longform-prose"), `${name} is missing continuous article prose`);
  assert(html.includes('class="lesson-references"') && html.includes('rel="noreferrer"'), `${name} is missing source provenance`);
  assert(html.includes('id="boundary"') && html.includes('boundary-section'), `${name} is missing its failure boundary`);
  assert(!html.includes("causal-strip"), `${name} still presents the opening as a slide strip`);
  assert(!html.includes("concept-list"), `${name} still presents explanation as a concept-card list`);
  assert(!html.includes("worked-grid"), `${name} still presents examples as a card grid`);
  assert(!html.includes("lesson-sections"), `${name} still renders the full-width chapter navigation strip`);
  assert((html.match(/<astro-island/g) ?? []).length === 1, `${name} must load exactly one shared knowledge-layer island`);
  assert(html.includes('data-knowledge-term='), `${name} is missing contextual term links`);
  assert(html.includes('class="knowledge-tip knowledge-tip-definition"'), `${name} is missing its chapter term guide`);
  assert(html.includes('data-heading-anchor'), `${name} is missing section permalinks`);
  assert(!html.includes("[["), `${name} contains an unresolved authored chapter link`);
}

for (const page of chineseLessonPages) {
  const html = readFileSync(page, "utf8");
  const name = relative(rootPath, page);
  assert(html.includes("chapter-outline-desktop"), `${name} is missing its reading-rail chapter outline`);
  assert(html.includes("narrative-section"), `${name} is missing its authored prose movement`);
  assert(html.includes("longform-prose"), `${name} is missing continuous article prose`);
  assert(html.includes('class="lesson-references"') && html.includes('rel="noreferrer"'), `${name} is missing source provenance`);
  assert(html.includes('id="boundary"') && html.includes('boundary-section'), `${name} is missing its failure boundary`);
  assert(!html.includes("causal-strip"), `${name} still presents the opening as a slide strip`);
  assert(!html.includes("concept-list"), `${name} still presents explanation as a concept-card list`);
  assert(!html.includes("worked-grid"), `${name} still presents examples as a card grid`);
  assert(!html.includes("lesson-sections"), `${name} still renders the full-width chapter navigation strip`);
  assert((html.match(/<astro-island/g) ?? []).length === 1, `${name} must load exactly one shared knowledge-layer island`);
  assert(html.includes('data-knowledge-term='), `${name} is missing contextual term links`);
  assert(html.includes('class="knowledge-tip knowledge-tip-definition"'), `${name} is missing its chapter term guide`);
  assert(html.includes('data-heading-anchor'), `${name} is missing section permalinks`);
  assert(!html.includes("[["), `${name} contains an unresolved authored chapter link`);
}

for (const page of bilingualLessonPages) {
  const html = readFileSync(page, "utf8");
  const name = relative(rootPath, page);
  assert(html.includes("bilingual-section"), `${name} is missing the alternating bilingual article`);
  assert(html.includes('class="language-marker"'), `${name} is missing compact language labels`);
  assert(html.includes('lang="en"') && html.includes('lang="zh-CN"'), `${name} does not mark both passage languages`);
  assert(html.includes("chapter-outline-desktop") && html.includes("chapter-outline-mobile"), `${name} is missing responsive chapter outlines`);
  assert(!html.includes("lesson-sections"), `${name} still renders the full-width chapter navigation strip`);
  assert((html.match(/<astro-island/g) ?? []).length === 1, `${name} must load exactly one shared knowledge-layer island`);
  assert(html.includes('data-knowledge-term='), `${name} is missing contextual term links`);
  assert(html.includes('class="knowledge-tip knowledge-tip-definition"'), `${name} is missing its bilingual chapter term guide`);
  assert(html.includes('data-heading-anchor'), `${name} is missing section permalinks`);
  assert(!html.includes("[["), `${name} contains an unresolved authored chapter link`);
}

const brokenLinks = [];
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const match of html.matchAll(/(?:href|src)="(\/rl-field-guide\/[^"#?]*)/g)) {
    const urlPath = decodeURIComponent(match[1].slice("/rl-field-guide/".length));
    if (!urlPath) continue;
    const target = urlPath.endsWith("/") ? join(rootPath, urlPath, "index.html") : join(rootPath, urlPath);
    if (!existsSync(target)) brokenLinks.push(`${relative(rootPath, page)} -> ${match[1]}`);
  }
}

assert(brokenLinks.length === 0, `Broken generated links:\n${brokenLinks.join("\n")}`);
stdout.write(`Verified ${pages.length} prerendered pages across English, Chinese, and alternating bilingual reading modes.\n`);
