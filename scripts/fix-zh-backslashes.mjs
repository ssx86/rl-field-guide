// 一次性修复：把章节源码模板字符串里"单反斜杠+字母/花括号"补成双反斜杠。
// 背景：模板字符串里 \theta 的 \t 是合法转义（TAB），\sum 的 \s 是非法转义（被 ESLint 抓到），
// 两种情况都会吞掉反斜杠导致公式损坏。正确写法必须是 \\theta、\\sum。
// 用法: node scripts/fix-zh-backslashes.mjs [--check]   (--check 只报告不修改)
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const checkOnly = process.argv.includes("--check");
// 源码层面：单个反斜杠（前面不是反斜杠）后面紧跟字母或花括号 → 是被吞的反斜杠
const SINGLE_BACKSLASH = /(^|[^\\])\\(?=[a-zA-Z{}])/g;

const KNOWN_COMMANDS = [
  "sum", "max", "min", "hat", "frac", "mathbb", "epsilon", "varepsilon", "theta", "lambda",
  "gamma", "alpha", "beta", "pi", "nabla", "sim", "approx", "times", "cdot", "sqrt", "log",
  "exp", "delta", "phi", "varphi", "psi", "mu", "sigma", "rho", "tau", "omega", "infty",
  "partial", "left", "right", "quad", "bar", "vec", "tilde", "underset", "overset", "text",
  "argmax", "argmin", "mathrm", "operatorname", "forall", "exists", "leq", "geq", "neq",
  "rightarrow", "leftarrow", "Rightarrow", "leftrightarrow", "dots", "ldots", "cdots",
];

// 运行时层面：公式里出现"没有反斜杠前缀的命令名" → 反斜杠已被模板字符串吞掉
function findBareCommands(content) {
  const problems = [];
  const formulas = [
    ...[...content.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((m) => m[1]),
    ...[...content.replace(/\$\$[\s\S]+?\$\$/g, "").matchAll(/\$([^$\n]+?)\$/g)].map((m) => m[1]),
  ];
  for (const f of formulas) {
    for (const cmd of KNOWN_COMMANDS) {
      let idx = f.indexOf(cmd);
      while (idx !== -1) {
        const before = idx > 0 ? f[idx - 1] : "";
        const after = f[idx + cmd.length] ?? "";
        const isWordChar = (c) => /[a-zA-Z]/.test(c);
        if (before !== "\\" && !isWordChar(before) && !isWordChar(after) && before !== "{" && after !== "}") {
          problems.push(`公式内裸命令 "${cmd}"（疑似反斜杠被吞）: $${f.trim().slice(0, 50)}$`);
          break;
        }
        idx = f.indexOf(cmd, idx + 1);
      }
    }
  }
  return problems;
}

let totalFixed = 0;
const runtimeProblems = [];

for (let i = 1; i <= 46; i++) {
  const slug = `ch${String(i).padStart(2, "0")}`;
  const file = `src/content/zh-chapters/${slug}.ts`;
  let src = readFileSync(file, "utf8");
  const matches = src.match(SINGLE_BACKSLASH) ?? [];
  if (matches.length > 0) {
    if (!checkOnly) {
      src = src.replace(SINGLE_BACKSLASH, "$1\\\\");
      writeFileSync(file, src);
      totalFixed += matches.length;
    }
    console.log(`${file}: ${matches.length} 处单反斜杠${checkOnly ? "待修" : "已修复"}`);
  }

  const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
  const chapter = Object.values(mod)[0];
  const issues = [];
  for (const ch of chapter.content) {
    if ("\b\t\v\f\r".includes(ch)) issues.push(`控制字符 U+${ch.charCodeAt(0).toString(16)}（转义吞反斜杠的痕迹）`);
  }
  if (chapter.content.trim().replace(/\n\s*\n/g, "").includes("\n")) issues.push("段落内存在单个换行（格式约定为空行分段）");
  issues.push(...findBareCommands(chapter.content));
  if (issues.length > 0) runtimeProblems.push([file, issues]);
}

if (runtimeProblems.length > 0) {
  console.error("\n运行时复检发现问题：");
  for (const [file, list] of runtimeProblems) {
    console.error(`  ${file}`);
    for (const p of list) console.error(`    - ${p}`);
  }
  process.exit(1);
}
console.log(checkOnly ? "检查完成：无单反斜杠残留，无运行时损坏" : `修复完成：共补 ${totalFixed} 处反斜杠；运行时复检全部通过`);
