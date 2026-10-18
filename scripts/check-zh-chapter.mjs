// 校验 zh-chapters 章节文件：语法可加载、公式全部是合法 KaTeX、无模板区块残留
// 用法: node scripts/check-zh-chapter.mjs src/content/zh-chapters/ch02.ts [...]
import { renderToString } from "katex";
import { pathToFileURL } from "node:url";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("用法: node scripts/check-zh-chapter.mjs <chapter.ts> [...]");
  process.exit(1);
}

let failed = false;
for (const file of files) {
  const problems = [];
  let mod;
  try {
    mod = await import(pathToFileURL(file).href);
  } catch (error) {
    console.error(`[FAIL] ${file} 无法加载: ${error.message}`);
    failed = true;
    continue;
  }
  const chapter = Object.values(mod)[0];
  const content = chapter?.content ?? "";

  if (typeof content !== "string" || content.length < 500) {
    problems.push(`正文过短(${content.length} 字符)，要求 800-2000 字`);
  }
  for (const banned of ["值得注意的是", "至关重要", "此外", "与此同时", "situation", "workedExample"]) {
    if (content.includes(banned)) problems.push(`出现禁用词/模板区块残留: ${banned}`);
  }
  // 逐个渲染公式
  const formulas = [...content.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((m) => [m[1], true]);
  const stripped = content.replace(/\$\$[\s\S]+?\$\$/g, "");
  for (const m of stripped.matchAll(/\$([^$\n]+?)\$/g)) formulas.push([m[1], false]);
  if (formulas.length === 0) problems.push("没有任何公式（大多数章节应有公式，确认是否合理）");
  for (const [latex, display] of formulas) {
    try {
      renderToString(latex.trim(), { displayMode: display, throwOnError: true });
    } catch (error) {
      problems.push(`公式渲染失败 [$${display ? "$" : ""}${latex.trim()}${display ? "$" : ""}$]: ${error.message.split("\n")[0]}`);
    }
  }
  if (chapter.prev === undefined && chapter.slug !== "ch01") problems.push("缺少 prev（ch01 除外）");
  if (chapter.next === undefined && chapter.slug !== "ch46") problems.push("缺少 next（ch46 除外）");
  if (!/ch\d{2}/.test(chapter.slug ?? "")) problems.push(`slug 异常: ${chapter.slug}`);

  if (problems.length === 0) {
    console.log(`[OK] ${file}  ${content.length} 字, ${formulas.length} 个公式`);
  } else {
    failed = true;
    console.error(`[FAIL] ${file}`);
    for (const p of problems) console.error(`  - ${p}`);
  }
}
process.exit(failed ? 1 : 0);
