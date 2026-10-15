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
assert(pages.length === 97, `Expected 97 prerendered pages, found ${pages.length}`);
assert(existsSync(join(rootPath, "zh")), "The bilingual product must generate a Chinese route");

const requiredPages = [
  ["index.html", "Open English course", "打开中文课程"],
  ["en/index.html", "A field guide to reinforcement learning", "Nine connected parts"],
  ["zh/index.html", "一套沿着决策与证据链展开的强化学习指南", "九个相连部分"],
  ["en/learn/rl-panorama/index.html", "How a Machine Learns to Choose", "Seven questions that locate almost any RL problem"],
  ["zh/learn/rl-panorama/index.html", "一台机器怎样学会做决定", "用七个问题给任何 RL 项目定位"],
  ["en/learn/before-rl/index.html", "decide whether learning from consequences is needed", "No prior RL vocabulary required"],
  ["en/learn/td-traces/index.html", "eligibility traces", "katex-display"],
  ["en/learn/offline-rl/index.html", "BCQ, CQL, and IQL", "support"],
  ["en/learn/rlvr-grpo/index.html", "RLVR, process rewards, and GRPO", "group-relative"],
  ["en/learn/method-selection/index.html", "deployment evidence is still missing", "claim strength"],
  ["zh/learn/before-rl/index.html", "先判断问题，再决定要不要用强化学习", "无需任何 RL 前置术语"],
  ["zh/learn/tabular-control/index.html", "Expected SARSA", "katex-display"],
  ["zh/learn/rlvr-grpo/index.html", "RLVR", "答案可验证时"],
  ["zh/learn/method-selection/index.html", "哪个算法最强", "缺失证据清单"],
];

for (const [page, ...needles] of requiredPages) {
  const html = readFileSync(join(rootPath, page), "utf8");
  for (const needle of needles) assert(html.includes(needle), `${page} is missing prerendered content: ${needle}`);
}

const englishLessonPages = collect(join(rootPath, "en", "learn"), "index.html").filter((page) => !page.includes("rl-panorama"));
const chineseLessonPages = collect(join(rootPath, "zh", "learn"), "index.html").filter((page) => !page.includes("rl-panorama"));
assert(englishLessonPages.length === 46, `Expected 46 English chapter pages, found ${englishLessonPages.length}`);
assert(chineseLessonPages.length === 46, `Expected 46 Chinese chapter pages, found ${chineseLessonPages.length}`);

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
  assert(!html.includes("<astro-island"), `${name} must not depend on an interactive learning island`);
}

for (const page of chineseLessonPages) {
  const html = readFileSync(page, "utf8");
  const name = relative(rootPath, page);
  assert(html.includes("narrative-sections"), `${name} is missing its authored chapter navigation`);
  assert(html.includes("narrative-section"), `${name} is missing its authored prose movement`);
  assert(html.includes("longform-prose"), `${name} is missing continuous article prose`);
  assert(
    html.includes("knowledge-diagram") || html.includes("static-evidence") || html.includes("formula-list"),
    `${name} is missing a concrete evidence component`,
  );
  assert(html.includes('class="lesson-references"') && html.includes('rel="noreferrer"'), `${name} is missing source provenance`);
  assert(html.includes('id="boundary"') && html.includes('boundary-section'), `${name} is missing its failure boundary`);
  assert(!html.includes("causal-strip"), `${name} still presents the opening as a slide strip`);
  assert(!html.includes("concept-list"), `${name} still presents explanation as a concept-card list`);
  assert(!html.includes("worked-grid"), `${name} still presents examples as a card grid`);
  assert(!html.includes("<astro-island"), `${name} must not depend on an interactive learning island`);
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
stdout.write(`Verified ${pages.length} prerendered pages, the bilingual Chapter 00 panorama, and 46 matched deep-chapter pairs.\n`);
