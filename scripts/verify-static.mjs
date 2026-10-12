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
assert(pages.length === 35, `Expected 35 prerendered pages, found ${pages.length}`);

const requiredPages = [
  ["en/index.html", 'lang="en"', "Reinforcement learning, from zero to the real world"],
  ["zh/index.html", 'lang="zh-CN"', "从零开始，直到真实世界的强化学习"],
  ["en/learn/before-rl/index.html", "Before RL: what kind of problem is this?", "Nothing—begin here"],
  ["zh/learn/before-rl/index.html", "学 RL 之前：这到底是哪一类问题？", "无需前置知识"],
  ["en/learn/llm-rlhf/index.html", "RLHF under the microscope", "katex-display"],
  ["zh/learn/llm-reasoning/index.html", "面向推理与可验证结果的 RL", "DeepSeekMath 与 GRPO"],
];

for (const [page, ...needles] of requiredPages) {
  const html = readFileSync(join(rootPath, page), "utf8");
  for (const needle of needles) assert(html.includes(needle), `${page} is missing prerendered content: ${needle}`);
}

for (const language of ["en", "zh"]) {
  for (const lesson of ["before-rl", "interaction-loop", "return-and-time", "bandits", "mdp", "planning", "mc-and-td", "control", "deep-value", "policy-learning", "continuous-and-models", "llm-post-training", "llm-rlhf", "llm-preference", "llm-reasoning", "real-world-practice"]) {
    const page = `${language}/learn/${lesson}/index.html`;
    const html = readFileSync(join(rootPath, page), "utf8");
    assert(html.includes("knowledge-diagram"), `${page} is missing its core knowledge diagram`);
    assert(html.includes("static-evidence"), `${page} is missing its visible worked example`);
    assert(!html.includes("<astro-island"), `${page} must not ship an interactive lesson island`);
    assert(!html.includes("evidence-stepper"), `${page} still contains the old reveal interaction`);
  }
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
stdout.write(`Verified ${pages.length} prerendered pages, 32 reading lessons with diagrams, formulas, and internal links.\n`);
