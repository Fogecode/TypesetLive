import type { Theme } from "../types";

/**
 * GitHub - the Primer look: system UI type, white canvas, #d0d7de hairlines,
 * #0969da links, #f6f8fa grey code blocks, 6px radii, no shadows anywhere.
 */
export const github: Theme = {
  id: "github",
  name: "GitHub",
  description: "Primer-style docs: system UI type, hairline borders, blue links.",
  mode: "light",
  tokens: {
    bg: "#ffffff",
    surface: "#ffffff",
    "surface-alt": "#f6f8fa",
    text: "#1f2328",
    "text-muted": "#59636e",
    accent: "#0969da",
    "accent-contrast": "#ffffff",
    border: "#d0d7de",
    radius: "6px",
    shadow: "none",
    "font-body":
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, 'Noto Sans SC', sans-serif",
    "font-heading":
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, 'Noto Sans SC', sans-serif",
    "font-mono":
      "ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    "max-width": "68rem",
    link: "#0969da",
    "code-bg": "#f6f8fa",
    "code-text": "#1f2328",
    selection: "#b6e3ff",
  },
  css: String.raw`
    body[data-theme="github"] .hx-title {
      font-size: clamp(1.8rem, 1.5rem + 1.3vw, 2.4rem);
      font-weight: 600;
      letter-spacing: -0.014em;
      line-height: 1.25;
    }

    body[data-theme="github"] .hx-content h1,
    body[data-theme="github"] .hx-content h2,
    body[data-theme="github"] .hx-content h3,
    body[data-theme="github"] .hx-content h4 {
      font-weight: 600;
      letter-spacing: -0.008em;
    }

    body[data-theme="github"] .hx-content h2 {
      border-bottom: 1px solid var(--hx-border);
      padding-bottom: 0.3em;
      font-size: 1.5em;
    }

    body[data-theme="github"] .hx-content h3 {
      font-size: 1.25em;
    }

    body[data-theme="github"] .hx-content h4 {
      font-size: 1em;
    }

    body[data-theme="github"] .hx-content a,
    body[data-theme="github"] .hx-wikilink {
      color: var(--hx-link);
      text-decoration: none;
    }

    body[data-theme="github"] .hx-content a:hover,
    body[data-theme="github"] .hx-wikilink:hover {
      text-decoration: underline;
      text-decoration-thickness: 1px;
    }

    body[data-theme="github"] .hx-content blockquote {
      border-left: 0.25em solid var(--hx-border);
      color: var(--hx-text-muted);
      padding: 0 1em;
      font-style: normal;
    }

    body[data-theme="github"] .hx-content pre,
    body[data-theme="github"] .hx-code-block {
      background: var(--hx-code-bg);
      border-color: var(--hx-border);
      border-radius: 6px;
      padding: 1rem 1.1rem;
    }

    body[data-theme="github"] .hx-content :not(pre) > code {
      background: rgba(129, 139, 152, 0.12);
      border: 0;
      border-radius: 6px;
      padding: 0.16em 0.36em;
      font-size: 85%;
      color: #1f2328;
    }

    body[data-theme="github"] .hx-content kbd {
      background: var(--hx-surface-alt);
      border: 1px solid var(--hx-border);
      border-bottom-color: #afb8c1;
      border-radius: 6px;
      box-shadow: inset 0 -1px 0 #afb8c1;
      color: var(--hx-text);
    }

    body[data-theme="github"] .hx-table-wrap {
      border-color: var(--hx-border);
      border-radius: 6px;
    }

    body[data-theme="github"] .hx-content thead th {
      background: var(--hx-surface-alt);
      border-bottom: 1px solid var(--hx-border);
      font-weight: 600;
    }

    body[data-theme="github"] .hx-content tbody tr:nth-child(even) {
      background: var(--hx-surface-alt);
    }

    body[data-theme="github"] .hx-content tbody tr:hover {
      background: #eef2f6;
    }

    body[data-theme="github"] .hx-content hr {
      height: 1px;
      border: 0;
      background: var(--hx-border);
    }

    body[data-theme="github"] .hx-content img {
      border-color: var(--hx-border);
      border-radius: 6px;
    }

    body[data-theme="github"] .hx-callout {
      border-radius: 6px;
      border-left-width: 4px;
      background: var(--hx-surface-alt);
    }

    body[data-theme="github"] .hx-callout > .hx-callout-title {
      text-transform: none;
      letter-spacing: 0;
      font-size: 0.92rem;
      font-weight: 600;
    }

    body[data-theme="github"] .hx-badge {
      background: var(--hx-surface-alt);
      color: var(--hx-text-muted);
      border: 1px solid var(--hx-border);
      border-radius: 999px;
      font-family: var(--hx-font-body);
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: none;
    }

    body[data-theme="github"] .hx-meta > * {
      background: var(--hx-surface-alt);
      border-color: var(--hx-border);
      border-radius: 999px;
    }

    body[data-theme="github"] .hx-totop,
    body[data-theme="github"] .hx-theme-switcher {
      background: var(--hx-surface);
      border-color: var(--hx-border);
      box-shadow: 0 3px 12px rgba(31, 35, 40, 0.12);
    }

    body[data-theme="github"] .hx-copy-btn {
      border-radius: 6px;
      background: var(--hx-surface);
    }

    body[data-theme="github"] .hx-content .task-list-item > input[type="checkbox"] {
      accent-color: var(--hx-accent);
    }
  `,
};
