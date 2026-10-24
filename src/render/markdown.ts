import { Marked, Renderer } from "marked";
import hljs from "highlight.js";
import type { RenderContext, RenderResult, TocEntry } from "../types";

/** Fallback titles for callouts that omit an explicit one. */
const CALLOUT_TITLE: Record<string, string> = {
  note: "Note",
  abstract: "Abstract",
  summary: "Summary",
  info: "Info",
  todo: "Todo",
  tip: "Tip",
  hint: "Hint",
  important: "Important",
  success: "Success",
  check: "Check",
  done: "Done",
  question: "Question",
  help: "Help",
  faq: "FAQ",
  warning: "Warning",
  caution: "Caution",
  attention: "Attention",
  failure: "Failure",
  fail: "Fail",
  missing: "Missing",
  danger: "Danger",
  error: "Error",
  bug: "Bug",
  example: "Example",
  quote: "Quote",
  cite: "Cite",
};

/** Maps Obsidian callout aliases onto the five variants BASE_CSS colours. */
const CALLOUT_VARIANT: Record<string, string> = {
  abstract: "info",
  summary: "info",
  todo: "info",
  question: "info",
  help: "info",
  faq: "info",
  example: "info",
  hint: "tip",
  success: "tip",
  check: "tip",
  done: "tip",
  caution: "warning",
  attention: "warning",
  important: "warning",
  failure: "danger",
  fail: "danger",
  missing: "danger",
  error: "danger",
  bug: "danger",
  cite: "quote",
};

const FENCE_OPEN = /^(?:\u0020{0,3})(\u0060{3,}|~{3,})/;

/** Escape text for safe interpolation into HTML text or attribute values. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Remove HTML tags, leaving readable text. */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * CJK-safe heading slug: keeps ideographs and kana, lowercases latin, turns
 * whitespace into dashes and drops punctuation. Deduplicates with -1, -2…
 */
export class Slugger {
  private readonly used = new Map<string, number>();

  slug(text: string): string {
    let base = text
      .toLowerCase()
      .replace(/[\u0000-\u001f]/g, "")
      .replace(/[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!base) base = "section";

    const seen = this.used.get(base);
    if (seen === undefined) {
      this.used.set(base, 1);
      return base;
    }
    let next = seen;
    let candidate = base + "-" + next;
    while (this.used.has(candidate)) {
      next += 1;
      candidate = base + "-" + next;
    }
    this.used.set(base, next + 1);
    this.used.set(candidate, 1);
    return candidate;
  }
}

/** Strip a leading YAML frontmatter block from the raw note source. */
export function stripFrontmatter(markdown: string): string {
  const match = /^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/.exec(markdown);
  if (!match) return markdown;
  return markdown.slice(match[0].length);
}

/** Split markdown into fenced-code and prose segments. */
function splitFences(markdown: string): Array<{ code: boolean; text: string }> {
  const lines = markdown.split(/\r?\n/);
  const segments: Array<{ code: boolean; text: string }> = [];
  let buffer: string[] = [];
  let fence: string | null = null;

  const flush = (code: boolean): void => {
    if (buffer.length === 0) return;
    segments.push({ code, text: buffer.join("\n") });
    buffer = [];
  };

  for (const line of lines) {
    if (fence === null) {
      const open = FENCE_OPEN.exec(line);
      if (open) {
        flush(false);
        fence = open[1][0].repeat(open[1].length);
        buffer.push(line);
        continue;
      }
      buffer.push(line);
    } else {
      buffer.push(line);
      const marker = line.trim();
      if (marker.length >= fence.length && marker[0] === fence[0] && /^(\u0060+|~+)$/.test(marker)) {
        if (marker.length >= fence.length) {
          flush(true);
          fence = null;
        }
      }
    }
  }
  flush(fence !== null);
  return segments;
}

/** Run an async replacer over every match of a global regex. */
async function replaceAsync(
  input: string,
  pattern: RegExp,
  replacer: (match: string, ...groups: string[]) => Promise<string>
): Promise<string> {
  const jobs: Array<Promise<string>> = [];
  const rebuilt: string[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const scanner = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");

  while ((match = scanner.exec(input)) !== null) {
    rebuilt.push(input.slice(last, match.index));
    rebuilt.push("\u0000" + jobs.length + "\u0000");
    jobs.push(replacer(match[0], ...match.slice(1)));
    last = match.index + match[0].length;
    if (match[0].length === 0) scanner.lastIndex += 1;
  }
  rebuilt.push(input.slice(last));

  let output = rebuilt.join("");
  const values = await Promise.all(jobs);
  output = output.replace(/\u0000(\d+)\u0000/g, (_m, index: string) => values[Number(index)] ?? "");
  return output;
}

/** Replace ![[embed]] tokens, inlining images as data URLs when possible. */
async function replaceEmbeds(
  text: string,
  ctx: RenderContext,
  warnings: string[]
): Promise<string> {
  return replaceAsync(text, /!\[\[([^\]\n]+)\]\]/g, async (_match, raw: string) => {
    const pipe = raw.indexOf("|");
    const target = (pipe >= 0 ? raw.slice(0, pipe) : raw).trim();
    const sizeText = pipe >= 0 ? raw.slice(pipe + 1).trim() : "";
    const notePath = target.split("#")[0].trim();

    if (!notePath) {
      warnings.push("Empty embed target: " + raw);
      return '<span class="hx-embed-missing">[embed: ' + escapeHtml(raw) + "]</span>";
    }

    let dataUrl: string | null = null;
    if (ctx.resolveEmbed) {
      try {
        dataUrl = await ctx.resolveEmbed(raw);
      } catch (error) {
        console.error("[typeset] resolveEmbed failed for " + notePath, error);
        dataUrl = null;
      }
    }

    if (!dataUrl) {
      warnings.push("Could not embed: " + notePath);
      return '<span class="hx-embed-missing">[embed: ' + escapeHtml(notePath) + "]</span>";
    }

    let style = "";
    if (/^\d+$/.test(sizeText)) {
      style = ' style="width:' + Number(sizeText) + 'px"';
    } else if (/^\d+%$/.test(sizeText)) {
      style = ' style="width:' + escapeHtml(sizeText) + '"';
    }

    const caption = escapeHtml(notePath);
    return (
      '<figure class="hx-figure">' +
      '<img src="' + dataUrl + '" alt="' + caption + '"' + style + ' loading="lazy" decoding="async">' +
      '<figcaption class="hx-caption">' + caption + "</figcaption>" +
      '</figure>'
    );
  });
}

/** Replace [[wikilink]] tokens with styled anchors (display text preserved). */
function replaceWikilinks(text: string): string {
  return text.replace(/\[\[([^\]\n]+)\]\]/g, (_match, raw: string) => {
    const pipe = raw.indexOf("|");
    let target = (pipe >= 0 ? raw.slice(0, pipe) : raw).trim();
    const alias = pipe >= 0 ? raw.slice(pipe + 1).trim() : "";

    let display = alias;
    if (!display) {
      const hash = target.indexOf("#");
      if (hash >= 0) {
        const heading = target.slice(hash + 1).trim();
        display = heading || target.slice(0, hash).trim();
      } else {
        display = target;
      }
    }
    target = target.split("#")[0].trim() || display;
    if (!display) display = raw;

    return (
      '<a class="hx-wikilink" href="#" data-note="' + escapeHtml(target) + '">' +
      escapeHtml(display) +
      "</a>"
    );
  });
}

/** Apply Obsidian-only syntax to prose segments, leaving code untouched. */
async function transformProse(
  text: string,
  ctx: RenderContext,
  warnings: string[]
): Promise<string> {
  // Split on inline code spans so backticked text is never rewritten.
  const parts = text.split(/(\u0060+[^\u0060]*\u0060+)/g);
  const output: string[] = [];
  for (const part of parts) {
    if (part.length === 0) continue;
    if (/^\u0060/.test(part)) {
      output.push(part);
      continue;
    }
    let segment = await replaceEmbeds(part, ctx, warnings);
    segment = replaceWikilinks(segment);
    output.push(segment);
  }
  return output.join("");
}

/** Pre-process the whole document: Obsidian syntax outside code fences. */
async function transformObsidian(
  markdown: string,
  ctx: RenderContext,
  warnings: string[]
): Promise<string> {
  const segments = splitFences(markdown);
  const output: string[] = [];
  for (const segment of segments) {
    output.push(segment.code ? segment.text : await transformProse(segment.text, ctx, warnings));
  }
  return output.join("\n");
}

/** Turn Obsidian callout blockquotes into styled callout blocks. */
function convertCallouts(html: string): string {
  let output = "";
  let cursor = 0;

  for (;;) {
    const start = html.indexOf("<blockquote>", cursor);
    if (start < 0) {
      output += html.slice(cursor);
      break;
    }
    output += html.slice(cursor, start);

    let depth = 0;
    let scan = start;
    let end = -1;
    while (scan < html.length) {
      if (html.startsWith("<blockquote>", scan)) {
        depth += 1;
        scan += "<blockquote>".length;
        continue;
      }
      if (html.startsWith("</blockquote>", scan)) {
        depth -= 1;
        scan += "</blockquote>".length;
        if (depth === 0) {
          end = scan;
          break;
        }
        continue;
      }
      scan += 1;
    }

    if (end < 0) {
      output += html.slice(start);
      break;
    }

    const inner = html.slice(start + "<blockquote>".length, end - "</blockquote>".length);
    output += renderBlockquote(inner);
    cursor = end;
  }
  return output;
}

/** Render one blockquote, promoting Obsidian callouts to .hx-callout blocks. */
function renderBlockquote(inner: string): string {
  const marker = /^\s*<p>\s*\[!([A-Za-z][\w-]*)\]([+-]?)[ \t]*([\s\S]*?)<\/p>/.exec(inner);

  if (!marker) {
    return "<blockquote>" + inner + "</blockquote>";
  }

  const kind = marker[1].toLowerCase();
  const titleText = stripTags(marker[3] ?? "");
  const variant = CALLOUT_VARIANT[kind] ?? kind;
  const title = titleText || CALLOUT_TITLE[kind] || kind.charAt(0).toUpperCase() + kind.slice(1);
  const body = inner.slice(marker[0].length).trim();

  return (
    '<div class="hx-callout" data-callout="' + escapeHtml(variant) + '">' +
    '<p class="hx-callout-title">' + escapeHtml(title) + "</p>" +
    (body ? '<div class="hx-callout-body">' + body + "</div>" : "") +
    "</div>"
  );
}

/** Count words: every CJK glyph counts once, latin runs count as one word. */
export function countWords(text: string): number {
  const cjk = text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g);
  const latin = text.match(/[A-Za-z0-9]+(?:['\u2019-][A-Za-z0-9]+)*/g);
  return (cjk ? cjk.length : 0) + (latin ? latin.length : 0);
}

/** Build the markdown -> HTML pipeline for one document. */
export async function renderMarkdown(markdown: string, ctx: RenderContext): Promise<RenderResult> {
  const warnings: string[] = [];
  const source = stripFrontmatter(markdown);
  const prepared = await transformObsidian(source, ctx, warnings);

  const slugger = new Slugger();
  const tocRoot: TocEntry[] = [];
  const stack: TocEntry[] = [];

  const renderer = {
    heading(this: any, token: any): string {
      const depth: number = token.depth;
      const inner: string = this.parser.parseInline(token.tokens);
      const plain = stripTags(inner) || "Section";
      const id = slugger.slug(plain);

      if (depth >= 2 && depth <= 4) {
        const entry: TocEntry = { level: depth, text: plain, id, children: [] };
        while (stack.length > 0 && stack[stack.length - 1].level >= depth) stack.pop();
        if (stack.length > 0) stack[stack.length - 1].children.push(entry);
        else tocRoot.push(entry);
        stack.push(entry);
      }

      return "<h" + depth + ' id="' + escapeHtml(id) + '">' + inner + "</h" + depth + ">\n";
    },

    code(this: any, token: any): string {
      const rawLang = typeof token.lang === "string" ? token.lang.trim() : "";
      const lang = rawLang.split(/\s+/)[0].toLowerCase();
      const sourceText = typeof token.text === "string" ? token.text : "";
      let body = escapeHtml(sourceText);
      let languageClass = "";

      if (lang && hljs.getLanguage(lang)) {
        try {
          body = hljs.highlight(sourceText, { language: lang, ignoreIllegals: true }).value;
          languageClass = "hljs language-" + lang;
        } catch (error) {
          console.error("[typeset] highlight failed for " + lang, error);
          body = escapeHtml(sourceText);
        }
      }

      return (
        '<pre class="hx-code-block">' +
        '<button class="hx-copy-btn" type="button" aria-label="Copy code">Copy</button>' +
        '<code class="' + languageClass + '" data-lang="' + escapeHtml(lang || "text") + '">' +
        body +
        "</code></pre>\n"
      );
    },

    table(this: any, token: any): string {
      const table: string = (Renderer.prototype as any).table.call(this, token);
      return '<div class="hx-table-wrap">' + table + "</div>\n";
    },

    list(this: any, token: any): string {
      const html: string = (Renderer.prototype as any).list.call(this, token);
      const isTaskList = Array.isArray(token.items) && token.items.some((item: any) => item.task);
      if (!isTaskList) return html;
      return html.replace(/^<(ul|ol)([^>]*)>/, (_m: string, tag: string, attrs: string) => {
        if (/class=/.test(attrs)) return "<" + tag + attrs.replace(/class="/, 'class="contains-task-list ') + ">";
        return "<" + tag + attrs + ' class="contains-task-list">';
      });
    },

    listitem(this: any, item: any): string {
      const html: string = (Renderer.prototype as any).listitem.call(this, item);
      if (!item.task) return html;
      return html.replace(/^<li(\s*)>/, '<li class="task-list-item">');
    },

    image(this: any, token: any): string {
      const href = typeof token.href === "string" ? token.href : "";
      const alt = typeof token.text === "string" ? token.text : "";
      const title = token.title ? ' title="' + escapeHtml(String(token.title)) + '"' : "";
      return (
        '<img src="' + escapeHtml(href) + '" alt="' + escapeHtml(alt) + '"' + title +
        ' loading="lazy" decoding="async">'
      );
    },

    link(this: any, token: any): string {
      const inner: string = this.parser.parseInline(token.tokens);
      const href = typeof token.href === "string" ? token.href : "#";
      const title = token.title ? ' title="' + escapeHtml(String(token.title)) + '"' : "";
      const external = /^(https?:|mailto:)/i.test(href);
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<a href="' + escapeHtml(href) + '"' + title + rel + ">" + inner + "</a>";
    },
  };

  const engine = new Marked({ gfm: true, breaks: false });
  engine.use({ renderer: renderer as any });

  let html = await engine.parse(prepared);
  html = convertCallouts(html);

  const wordCount = countWords(source);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 300));

  return { html, toc: tocRoot, warnings, wordCount, readingMinutes };
}
