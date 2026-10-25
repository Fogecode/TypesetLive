import { BASE_CSS } from "../themes/base.css";
import type { DocumentOptions, Theme, TocEntry } from "../types";
import { RUNTIME_JS } from "./runtime";

/** Escape text for HTML text nodes and double-quoted attribute values. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Normalise a theme token key to its CSS custom property name. */
function tokenName(key: string): string {
  if (key.startsWith("--")) return key;
  return "--hx-" + key;
}

/** Emit one theme's design tokens as a body[data-theme] rule. */
function themeTokenBlock(theme: Theme): string {
  const declarations: string[] = [];
  for (const key of Object.keys(theme.tokens)) {
    const value = theme.tokens[key];
    if (typeof value !== "string" || value.length === 0) continue;
    declarations.push("  " + tokenName(key) + ": " + value + ";");
  }
  return 'body[data-theme="' + esc(theme.id) + '"] {\n' + declarations.join("\n") + "\n}";
}

/** All theme CSS: the base system, every token block, then each theme's rules. */
function buildStylesheet(opts: DocumentOptions): string {
  const parts: string[] = [BASE_CSS];
  const tokens: string[] = [];
  const extras: string[] = [];
  for (const theme of opts.allThemes) {
    tokens.push(themeTokenBlock(theme));
    if (theme.css && theme.css.trim().length > 0) {
      extras.push("/* ---- " + theme.id + " ---- */\n" + theme.css.trim());
    }
  }
  parts.push(tokens.join("\n\n"));
  if (extras.length > 0) parts.push(extras.join("\n\n"));
  return parts.join("\n\n");
}

/** Render the nested table of contents. */
function renderToc(entries: TocEntry[]): string {
  if (entries.length === 0) return "";
  const items = entries.map((entry) => {
    const link = '<a href="#' + esc(entry.id) + '">' + esc(entry.text) + "</a>";
    const nested = entry.children.length > 0 ? renderToc(entry.children) : "";
    return "<li>" + link + nested + "</li>";
  });
  return "<ul>" + items.join("") + "</ul>";
}

/** Render frontmatter entries as header badges. */
function renderBadges(frontmatter: DocumentOptions["frontmatter"]): string {
  if (frontmatter.length === 0) return "";
  const chips = frontmatter.slice(0, 12).map((entry) => {
    return (
      '<span class="hx-badge" title="' + esc(entry.key) + '">' +
      '<span class="hx-badge-key">' + esc(entry.key) + "</span> " +
      '<span class="hx-badge-value">' + esc(entry.value) + "</span>" +
      "</span>"
    );
  });
  return '<div class="hx-frontmatter">' + chips.join("") + "</div>";
}

/** Meta chips: word count, reading time, section count, export stamp, source. */
function renderMeta(opts: DocumentOptions): string {
  const chips: string[] = [];
  chips.push("<span>" + opts.meta.wordCount.toLocaleString("en-US") + " words</span>");
  chips.push("<span>" + opts.meta.readingMinutes + " min read</span>");
  if (opts.meta.headingCount > 0) {
    chips.push("<span>" + opts.meta.headingCount + " sections</span>");
  }
  if (opts.meta.exportedAt) chips.push("<span>Exported " + esc(opts.meta.exportedAt) + "</span>");
  if (opts.sourcePath) {
    chips.push('<span title="' + esc(opts.sourcePath) + '">' + esc(opts.sourcePath) + "</span>");
  }
  return '<div class="hx-meta">' + chips.join("") + "</div>";
}

/** Theme switcher buttons; the active one is marked. */
function renderSwitcher(opts: DocumentOptions): string {
  if (!opts.features.themeSwitcher) return "";
  const buttons = opts.allThemes.map((theme) => {
    const active = theme.id === opts.theme.id ? " is-active" : "";
    return (
      '<button type="button" data-theme="' + esc(theme.id) + '"' +
      ' data-name="' + esc(theme.name) + '"' +
      ' class="hx-theme-btn' + active + '" title="' + esc(theme.description) + '">' +
      esc(theme.name) +
      "</button>"
    );
  });
  // The pill is an absolutely positioned highlight that glides between
  // buttons when the theme changes (positioned by the page runtime).
  const pill = '<span class="hx-theme-pill" aria-hidden="true"></span>';
  return '<div class="hx-theme-switcher" role="group" aria-label="Visual style">' + pill + buttons.join("") + "</div>";
}

/** Guess the document language from its body text. */
function detectLang(bodyHtml: string): string {
  const cjk = (bodyHtml.match(/[\u4e00-\u9fff]/g) || []).length;
  const latin = (bodyHtml.match(/[A-Za-z]/g) || []).length;
  return cjk > latin * 0.15 ? "zh-CN" : "en";
}

/** Build the complete standalone HTML document. */
export function buildDocument(opts: DocumentOptions): string {
  const lang = detectLang(opts.bodyHtml);
  const stylesheet = buildStylesheet(opts);
  const tocHtml = opts.features.toc ? renderToc(opts.toc) : "";
  const tocBlock = tocHtml
    ? '<nav class="hx-toc" aria-label="Contents"><p class="hx-toc-title">Contents</p>' + tocHtml + "</nav>"
    : "";

  const progress = opts.features.progressBar ? '<div class="hx-progress"><span></span></div>' : "";
  const totop = opts.features.backToTop
    ? '<button class="hx-totop" type="button" aria-label="Back to top" title="Back to top">\u2191</button>'
    : "";

  const body: string[] = [];
  body.push('<div class="hx-shell">');
  body.push('  <header class="hx-header">');
  body.push('    <div class="hx-badge hx-badge-export">HTML</div>');
  body.push('    <h1 class="hx-title">' + esc(opts.title) + "</h1>");
  const badges = renderBadges(opts.frontmatter);
  if (badges) body.push("    " + badges);
  body.push("    " + renderMeta(opts));
  body.push("  </header>");
  if (tocBlock) body.push("  " + tocBlock);
  body.push('  <article class="hx-content">');
  body.push(opts.bodyHtml);
  body.push("  </article>");
  body.push('  <footer class="hx-footer">');
  body.push("    <span>Exported from Obsidian \u00b7 " + esc(opts.sourcePath || opts.title) + "</span>");
  body.push('    <span>Theme: <strong data-theme-name>' + esc(opts.theme.name) + "</strong></span>");
  body.push("  </footer>");
  body.push("</div>");

  const needsScript =
    opts.features.themeSwitcher ||
    opts.features.progressBar ||
    opts.features.backToTop ||
    opts.features.copyButtons;
  const script = needsScript ? "<script>" + RUNTIME_JS + "</scr" + "ipt>" : "";

  // The switcher lives at the TOP of the page now: an invisible hover zone
  // just above it reveals the bar when the pointer approaches the top edge,
  // and it hides again when the pointer leaves. Both must precede the shell
  // so the sibling selector (.hx-theme-hotzone:hover ~ .hx-theme-switcher)
  // can drive the reveal in pure CSS.
  const switcher = renderSwitcher(opts);
  const hotzone = switcher ? '<div class="hx-theme-hotzone" aria-hidden="true"></div>' : "";

  return [
    "<!DOCTYPE html>",
    '<html lang="' + lang + '">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="generator" content="Obsidian Typeset">',
    '<meta name="color-scheme" content="' + (opts.theme.mode === "dark" ? "dark light" : "light dark") + '">',
    "<title>" + esc(opts.title) + "</title>",
    "<style>",
    stylesheet,
    "</style>",
    "</head>",
    '<body data-theme="' + esc(opts.theme.id) + '">',
    progress,
    hotzone,
    switcher,
    body.join("\n"),
    totop,
    script,
    "</body>",
    "</html>",
    ""
  ].join("\n");
}
