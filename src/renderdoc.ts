import type { App, TFile } from "obsidian";
import { renderMarkdown } from "./render/markdown";
import { buildDocument } from "./render/template";
import { THEMES, getTheme } from "./themes";
import type { ExportFeatures, RenderContext, RenderResult } from "./types";

/**
 * Minimal host surface the renderer needs. Kept as a narrow interface so the
 * offline test harness can drive the exact pipeline without Obsidian.
 */
export interface RenderHost {
  app: App;
  settings: {
    themeId: string;
    embedImages: boolean;
    features: ExportFeatures;
  };
}

/** Result of rendering a note without writing anything to disk. */
export interface RenderedNote {
  /** Complete standalone HTML document. */
  html: string;
  /** Renderer output, including warnings and stats. */
  result: RenderResult;
}

/** Extension -> MIME type map used when inlining vault images as data URLs. */
const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
};

function pad2(value: number): string {
  return value < 10 ? "0" + value : String(value);
}

/** Local "YYYY-MM-DD HH:mm" stamp, independent of locale settings. */
function localStamp(date: Date): string {
  return (
    date.getFullYear() +
    "-" +
    pad2(date.getMonth() + 1) +
    "-" +
    pad2(date.getDate()) +
    " " +
    pad2(date.getHours()) +
    ":" +
    pad2(date.getMinutes())
  );
}

/**
 * Parse the YAML frontmatter block into flat key/value strings.
 * Only simple `key: value` lines are handled; array-ish values are joined
 * with ", " so they can be shown in the document header.
 */
export function parseFrontmatter(markdown: string): Array<{ key: string; value: string }> {
  const entries: Array<{ key: string; value: string }> = [];
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) return entries;

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (!key) continue;
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim().replace(/^["']|["']$/g, ""))
        .filter((part) => part.length > 0)
        .join(", ");
    }
    if (!value) continue;
    entries.push({ key, value });
  }
  return entries;
}

/** Encode an ArrayBuffer as base64 without relying on Node's Buffer. */
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.prototype.slice.call(bytes.subarray(i, i + chunkSize)) as number[]
    );
  }
  return btoa(binary);
}

/** Strip Obsidian embed decoration (`![[img.png|300]]`, `#heading`) from a target. */
function cleanEmbedTarget(target: string): string {
  const withoutPipe = target.split("|")[0];
  const withoutHash = withoutPipe.split("#")[0];
  return withoutHash.trim();
}

/** Build the resolveEmbed callback handed to the renderer. */
function makeResolveEmbed(
  host: RenderHost,
  file: TFile
): ((target: string) => Promise<string | null>) | undefined {
  if (!host.settings.embedImages) return undefined;

  return async (target: string): Promise<string | null> => {
    const linkpath = cleanEmbedTarget(target);
    if (!linkpath) return null;
    if (/^(https?:|data:)/i.test(linkpath)) return null;

    try {
      const dest = host.app.metadataCache.getFirstLinkpathDest(linkpath, file.path);
      if (!dest) return null;

      const extension = dest.extension.toLowerCase();
      const mime = IMAGE_MIME[extension];
      if (!mime) return null;

      const binary = await host.app.vault.readBinary(dest);
      return "data:" + mime + ";base64," + toBase64(binary);
    } catch (error) {
      console.error("[typeset-live] failed to embed " + linkpath, error);
      return null;
    }
  };
}

/** Count every TOC node recursively (headings h2..h4). */
function countHeadings(entries: RenderResult["toc"]): number {
  let total = 0;
  for (const entry of entries) {
    total += 1 + countHeadings(entry.children);
  }
  return total;
}

/** Render a note into a full standalone HTML document without writing it. */
export async function renderNoteDocument(
  host: RenderHost,
  file: TFile,
  themeId?: string
): Promise<RenderedNote> {
  const markdown = await host.app.vault.cachedRead(file);
  const frontmatter = parseFrontmatter(markdown);
  const resolveEmbed = makeResolveEmbed(host, file);

  const context: RenderContext = {
    notePath: file.path,
    noteName: file.basename,
    ...(resolveEmbed ? { resolveEmbed } : {}),
  };

  const result = await renderMarkdown(markdown, context);

  const theme = getTheme(themeId ?? host.settings.themeId);

  const html = buildDocument({
    title: file.basename,
    sourcePath: file.path,
    frontmatter,
    bodyHtml: result.html,
    toc: result.toc,
    meta: {
      wordCount: result.wordCount,
      readingMinutes: result.readingMinutes,
      exportedAt: localStamp(new Date()),
      headingCount: countHeadings(result.toc),
    },
    theme,
    allThemes: THEMES,
    features: host.settings.features,
  });

  return { html, result };
}

/** Human-readable message for an unknown thrown value. */
export function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
