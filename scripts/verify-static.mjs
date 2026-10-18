// 校验纯中文重写版的静态产物：46 章齐全、公式已渲染、无旧路由残留
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

// 1. 页面总数：根入口 + 目录页 + 46 章 = 48
const pages = collect(rootPath, "index.html");
assert(pages.length === 48, `Expected 48 prerendered pages, found ${pages.length}`);

// 2. 新结构齐全、旧三语路由不复存在
assert(existsSync(join(rootPath, "zh", "index.html")), "Missing /zh/ table of contents");
assert(!existsSync(join(rootPath, "en")), "Legacy /en/ route must be gone");
assert(!existsSync(join(rootPath, "bilingual")), "Legacy /bilingual/ route must be gone");
for (let i = 1; i <= 46; i++) {
  const slug = `ch${String(i).padStart(2, "0")}`;
  assert(existsSync(join(rootPath, "zh", slug, "index.html")), `Missing /zh/${slug}/`);
}

// 3. 根入口重定向到纯中文目录
const rootIndex = readFileSync(join(rootPath, "index.html"), "utf8");
assert(rootIndex.includes("/rl-field-guide/zh/"), "Root page must redirect to /zh/");

// 4. 抽查内容与公式渲染（KaTeX 服务端输出）
const toc = readFileSync(join(rootPath, "zh", "index.html"), "utf8");
assert(toc.includes("从零到实践"), "/zh/ TOC is missing its title block");
const ch01 = readFileSync(join(rootPath, "zh", "ch01", "index.html"), "utf8");
assert(ch01.includes("什么时候需要强化学习"), "ch01 title missing");
assert(ch01.includes("katex-display"), "ch01 display formula was not rendered");
const ch07 = readFileSync(join(rootPath, "zh", "ch07", "index.html"), "utf8");
assert(ch07.includes("katex-display"), "ch07 (Bellman) display formula was not rendered");
const ch46 = readFileSync(join(rootPath, "zh", "ch46", "index.html"), "utf8");
assert(ch46.length > 1000, "ch46 looks empty");

// 5. 全站零 KaTeX 错误、零未渲染的 $$ 残留、零 astro-island
let katexCount = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  assert(!html.includes("katex-error"), `${relative(rootPath, page)} contains a KaTeX rendering error`);
  assert(!html.includes("$$"), `${relative(rootPath, page)} contains unrendered $$ formula`);
  assert(!html.includes("astro-island"), `${relative(rootPath, page)} must not ship interactive islands`);
  katexCount += (html.match(/class="katex"/g) ?? []).length;
}
assert(katexCount >= 200, `Expected at least 200 rendered formulas site-wide, found ${katexCount}`);

stdout.write(`verify:static OK — 48 pages, 46 chapters, ${katexCount} rendered formulas\n`);
