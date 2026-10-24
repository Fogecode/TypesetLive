import type { Theme } from "../types";

/**
 * Swiss - Helvetica/Inter grid typography, hairline rules, #e30613 red as the
 * single accent, tight tracking and a lot of air. No shadows, no ornament.
 */
export const swiss: Theme = {
  id: "swiss",
  name: "Swiss",
  description: "International-style grid: Helvetica, hairlines, one red accent.",
  mode: "light",
  tokens: {
    bg: "#ffffff",
    surface: "#ffffff",
    "surface-alt": "#f4f4f4",
    text: "#111111",
    "text-muted": "#6b6b6b",
    accent: "#e30613",
    "accent-contrast": "#ffffff",
    border: "#d8d8d8",
    radius: "0px",
    shadow: "none",
    "font-body":
      "'Inter', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans SC', 'PingFang SC', sans-serif",
    "font-heading":
      "'Inter', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans SC', 'PingFang SC', sans-serif",
    "font-mono": "'SF Mono', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace",
    "max-width": "72rem",
    link: "#111111",
    "code-bg": "#f4f4f4",
    "code-text": "#111111",
    selection: "#ffe1e3",
  },
  css: String.raw`
    body[data-theme="swiss"] .hx-title {
      font-weight: 700;
      letter-spacing: -0.038em;
      line-height: 1.02;
      font-size: clamp(2.1rem, 1.5rem + 2.6vw, 3.4rem);
    }

    body[data-theme="swiss"] .hx-content h1,
    body[data-theme="swiss"] .hx-content h2,
    body[data-theme="swiss"] .hx-content h3 {
      letter-spacing: -0.03em;
      font-weight: 700;
    }

    /* Hairline above every section heading: the grid does the decorating. */
    body[data-theme="swiss"] .hx-content h2 {
      border-bottom: 0;
      border-top: 1px solid var(--hx-border);
      padding-top: 0.62em;
      padding-bottom: 0;
      margin-top: 2.9em;
    }

    body[data-theme="swiss"] .hx-content h3 {
      font-size: 1.02rem;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      font-weight: 600;
      margin-top: 2.4em;
    }

    body[data-theme="swiss"] .hx-badge {
      background: transparent;
      color: var(--hx-accent);
      border: 1px solid var(--hx-accent);
      border-radius: 0;
      letter-spacing: 0.24em;
    }

    body[data-theme="swiss"] .hx-meta > * {
      border: 0;
      border-radius: 0;
      background: transparent;
      padding: 0 0.7rem 0 0;
      border-right: 1px solid var(--hx-border);
      color: var(--hx-text-muted);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.09em;
    }

    body[data-theme="swiss"] .hx-meta > *:last-child {
      border-right: 0;
    }

    body[data-theme="swiss"] .hx-content blockquote {
      border-left: 0;
      border-top: 2px solid var(--hx-accent);
      padding: 0.85rem 0 0;
      font-style: normal;
      font-size: 1.16rem;
      line-height: 1.55;
      color: var(--hx-text);
      letter-spacing: -0.012em;
    }

    body[data-theme="swiss"] .hx-content pre,
    body[data-theme="swiss"] .hx-code-block {
      border-radius: 0;
      border-color: var(--hx-border);
      border-left: 3px solid var(--hx-accent);
      background: #fafafa;
    }

    body[data-theme="swiss"] .hx-content :not(pre) > code {
      border: 0;
      border-radius: 0;
      background: #f4f4f4;
      padding: 0.1em 0.3em;
    }

    body[data-theme="swiss"] .hx-content a,
    body[data-theme="swiss"] .hx-wikilink {
      color: var(--hx-text);
      text-decoration-color: var(--hx-accent);
      text-decoration-thickness: 1px;
      text-underline-offset: 0.24em;
    }

    body[data-theme="swiss"] .hx-content a:hover {
      color: var(--hx-accent);
      text-decoration-color: var(--hx-accent);
    }

    body[data-theme="swiss"] .hx-content thead th {
      background: transparent;
      border-bottom: 1px solid var(--hx-border);
      text-transform: uppercase;
      font-size: 0.76em;
      letter-spacing: 0.09em;
      font-weight: 600;
      white-space: normal;
    }

    body[data-theme="swiss"] .hx-content tbody tr:nth-child(even) {
      background: transparent;
    }

    body[data-theme="swiss"] .hx-content tbody tr:hover {
      background: #fafafa;
    }

    body[data-theme="swiss"] .hx-table-wrap {
      border: 0;
      border-top: 2px solid var(--hx-text);
      border-bottom: 1px solid var(--hx-border);
      border-radius: 0;
    }

    body[data-theme="swiss"] .hx-content hr {
      border-top: 1px solid var(--hx-text);
    }

    body[data-theme="swiss"] .hx-content img {
      border-radius: 0;
      border: 0;
    }

    body[data-theme="swiss"] .hx-callout {
      border-radius: 0;
      border-left-width: 3px;
      border-color: var(--hx-border);
      background: #fafafa;
    }

    body[data-theme="swiss"] .hx-totop {
      border-radius: 0;
      box-shadow: none;
      border-color: var(--hx-text);
      color: var(--hx-text);
    }

    body[data-theme="swiss"] .hx-theme-switcher {
      border-radius: 0;
      box-shadow: none;
      background: #ffffff;
    }

    body[data-theme="swiss"] .hx-theme-switcher button {
      border-radius: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.66rem;
    }
  `,
};
