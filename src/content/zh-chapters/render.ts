// 章节纯文本 → HTML：\n\n 分段、## 二级标题、**加粗**、$行内公式$、$$独立公式$$
import katex from "katex";

const BOLD = /\*\*([^*]+)\*\*/g;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderText(text: string): string {
  return escapeHtml(text).replace(BOLD, "<strong>$1</strong>");
}

function renderMath(latex: string, display: boolean): string {
  return katex.renderToString(latex.trim(), {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });
}

// 先取 $$...$$（独立公式），再取 $...$（行内公式），其余按普通文本转义加粗
function renderInline(text: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf("$", i);
    if (dollar === -1) {
      out += renderText(text.slice(i));
      break;
    }
    if (text.startsWith("$$", dollar)) {
      const end = text.indexOf("$$", dollar + 2);
      if (end === -1) {
        out += renderText(text.slice(i, dollar + 1));
        i = dollar + 1;
        continue;
      }
      out += renderText(text.slice(i, dollar));
      out += renderMath(text.slice(dollar + 2, end), true);
      i = end + 2;
    } else {
      const end = text.indexOf("$", dollar + 1);
      if (end === -1 || text.startsWith("$$", end)) {
        out += renderText(text.slice(i, dollar + 1));
        i = dollar + 1;
        continue;
      }
      out += renderText(text.slice(i, dollar));
      out += renderMath(text.slice(dollar + 1, end), false);
      i = end + 1;
    }
  }
  return out;
}

export function renderChapterHtml(content: string): string {
  return content
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) =>
      block.startsWith("## ")
        ? `<h2>${renderInline(block.slice(3))}</h2>`
        : `<p>${renderInline(block)}</p>`,
    )
    .join("");
}
