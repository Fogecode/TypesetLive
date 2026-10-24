// ============================================================
// CONTRACT FILE — owned by Lead. Do not edit from other scopes.
// Every module in this plugin compiles against these types.
// ============================================================

/** A single heading entry in the generated table of contents. */
export interface TocEntry {
  /** Heading level, 2..4 (h1 is the document title and is excluded). */
  level: number;
  /** Heading text with inline markdown stripped. */
  text: string;
  /** Anchor id present on the emitted heading element. */
  id: string;
  /** Nested children, one level deeper. */
  children: TocEntry[];
}

/** Result of converting one note's markdown into themed HTML. */
export interface RenderResult {
  /** Body HTML only — no <html>/<head>/<body>. */
  html: string;
  /** Ordered table of contents. */
  toc: TocEntry[];
  /** Non-fatal problems worth surfacing to the user (unresolved embeds, etc). */
  warnings: string[];
  /** Plain-text word count of the source (CJK chars count as words). */
  wordCount: number;
  /** Estimated reading time in whole minutes, minimum 1. */
  readingMinutes: number;
}

/** Context handed to the markdown renderer. */
export interface RenderContext {
  /** Vault-relative path of the note, e.g. "前端决策流程图.md". */
  notePath: string;
  /** Note basename without extension. */
  noteName: string;
  /**
   * Resolve an Obsidian embed target (inside ![[...]]) to a data URL or null.
   * Implemented by the plugin layer; the renderer must degrade gracefully to
   * null and push a warning when it cannot resolve.
   */
  resolveEmbed?: (target: string) => Promise<string | null>;
}

/** One selectable visual style. */
export interface Theme {
  /** Stable id, kebab-case, also used as data-theme attribute value. */
  id: string;
  /** Human label shown in the picker. */
  name: string;
  /** One-line description for settings UI. */
  description: string;
  /** Base colour scheme of the theme. */
  mode: "light" | "dark";
  /**
   * Design tokens, written WITHOUT the leading "--hx-" prefix by convention
   * but MAY include it; the shell normalises keys to --hx-*.
   * Required keys (see REQUIRED_TOKENS) must all be present.
   */
  tokens: Record<string, string>;
  /**
   * Extra CSS for this theme only. Selectors must be scoped under
   * body[data-theme="<id>"] or plain element selectors, and must not
   * target the shell chrome classes (.hx-shell, .hx-toc, .hx-header).
   */
  css: string;
}

/** Token keys every theme MUST define. */
export const REQUIRED_TOKENS = [
  "bg",
  "surface",
  "surface-alt",
  "text",
  "text-muted",
  "accent",
  "accent-contrast",
  "border",
  "radius",
  "shadow",
  "font-body",
  "font-heading",
  "font-mono",
  "max-width",
] as const;

/** Runtime feature switches exposed in settings. */
export interface ExportFeatures {
  toc: boolean;
  themeSwitcher: boolean;
  progressBar: boolean;
  copyButtons: boolean;
  backToTop: boolean;
}

/** Everything the page shell needs to emit a standalone document. */
export interface DocumentOptions {
  title: string;
  sourcePath: string;
  /** Frontmatter key/value pairs, already stringified. */
  frontmatter: Array<{ key: string; value: string }>;
  bodyHtml: string;
  toc: TocEntry[];
  meta: {
    wordCount: number;
    readingMinutes: number;
    exportedAt: string;
    headingCount: number;
  };
  theme: Theme;
  /** All themes, embedded so the exported file can switch style offline. */
  allThemes: Theme[];
  features: ExportFeatures;
}

/** Settings persisted by the Typeset Live preview plugin. */
export interface LivePreviewSettings {
  themeId: string;
  /** Re-render the preview whenever another note becomes active. */
  followActiveNote: boolean;
  /** Re-render while the previewed note is being edited. */
  liveRefresh: boolean;
  /** Inline vault images as data URLs so the preview needs no disk access. */
  embedImages: boolean;
  features: ExportFeatures;
}

/** Plugin settings persisted in data.json. */
export interface HtmlExporterSettings {
  themeId: string;
  outputFolder: string;
  openAfterExport: "browser" | "preview" | "none";
  embedImages: boolean;
  features: ExportFeatures;
}
