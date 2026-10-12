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
assert(pages.length === 48, `Expected 48 prerendered pages, found ${pages.length}`);
assert(!existsSync(join(rootPath, "zh")), "The English-only product must not generate a Chinese route");

const requiredPages = [
  ["index.html", "Open the complete English course", "46 CHAPTERS"],
  ["en/index.html", "A field guide to reinforcement learning", "Nine connected parts"],
  ["en/learn/before-rl/index.html", "decide whether learning from consequences is needed", "No prior RL vocabulary required"],
  ["en/learn/td-traces/index.html", "eligibility traces", "katex-display"],
  ["en/learn/offline-rl/index.html", "BCQ, CQL, and IQL", "support"],
  ["en/learn/rlvr-grpo/index.html", "RLVR, process rewards, and GRPO", "group-relative"],
  ["en/learn/method-selection/index.html", "deployment evidence is still missing", "claim strength"],
];

for (const [page, ...needles] of requiredPages) {
  const html = readFileSync(join(rootPath, page), "utf8");
  for (const needle of needles) assert(html.includes(needle), `${page} is missing prerendered content: ${needle}`);
}

const lessonPages = collect(join(rootPath, "en", "learn"), "index.html");
assert(lessonPages.length === 46, `Expected 46 English chapter pages, found ${lessonPages.length}`);

for (const page of lessonPages) {
  const html = readFileSync(page, "utf8");
  const name = relative(rootPath, page);
  assert(html.includes("knowledge-diagram"), `${name} is missing its semantic diagram`);
  assert(html.includes("static-evidence"), `${name} is missing its worked example`);
  assert(html.includes("longform-prose"), `${name} is missing continuous article prose`);
  assert(html.includes("Original and official sources"), `${name} is missing source provenance`);
  assert(html.includes("Where it stops working"), `${name} is missing its failure boundary`);
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
stdout.write(`Verified ${pages.length} prerendered pages and all ${lessonPages.length} English long-form chapters.\n`);
