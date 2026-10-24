import type { Theme } from "../types";

/**
 * Solarized Light - Ethan Schoonover's base3 paper with the base0 ink and the
 * #b58900 yellow accent; link blue stays #268bd2 so it reads as Solarized.
 */
export const solarized: Theme = {
  id: "solarized",
  name: "Solarized Light",
  description: "Classic Solarized Light: base3 paper, base0 ink, #b58900 accent.",
  mode: "light",
  tokens: {
    bg: "#fdf6e3",
    surface: "#fdf6e3",
    "surface-alt": "#eee8d5",
    text: "#657b83",
    "text-muted": "#93a1a1",
    accent: "#b58900",
    "accent-contrast": "#fdf6e3",
    border: "#e0d8c0",
    radius: "4px",
    shadow: "0 1px 2px rgba(101, 123, 131, 0.1), 0 10px 24px -18px rgba(101, 123, 131, 0.35)",
    "font-body":
      "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, 'Noto Sans SC', 'PingFang SC', sans-serif",
    "font-heading":
      "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, 'Noto Sans SC', 'PingFang SC', sans-serif",
    "font-mono": "'SF Mono', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace",
    "max-width": "66rem",
    link: "#268bd2",
    "code-bg": "#eee8d5",
    "code-text": "#586e75",
    selection: "#eee8d5",
  },
  css: String.raw`
    body[data-theme="solarized"] .hx-content h1,
    body[data-theme="solarized"] .hx-content h2,
    body[data-theme="solarized"] .hx-content h3,
    body[data-theme="solarized"] .hx-content h4,
    body[data-theme="solarized"] .hx-title {
      color: #586e75;
      letter-spacing: -0.008em;
      font-weight: 600;
    }

    body[data-theme="solarized"] .hx-content h2 {
      border-bottom: 2px solid var(--hx-surface-alt);
      padding-bottom: 0.3em;
    }

    body[data-theme="solarized"] .hx-content strong {
      color: #586e75;
    }

    body[data-theme="solarized"] .hx-content blockquote {
      border-left: 3px solid #b58900;
      background: #f5efdc;
      padding: 0.8rem 1.1rem;
      border-radius: 0 var(--hx-radius) var(--hx-radius) 0;
      color: #657b83;
      font-style: italic;
    }

    body[data-theme="solarized"] .hx-content blockquote blockquote {
      border-left-color: #93a1a1;
      background: transparent;
    }

    body[data-theme="solarized"] .hx-content pre,
    body[data-theme="solarized"] .hx-code-block {
      background: #eee8d5;
      border-color: #ddd6c1;
      color: #586e75;
    }

    body[data-theme="solarized"] .hx-content :not(pre) > code {
      background: #eee8d5;
      border-color: #e0d8c0;
      color: #cb4b16;
    }

    body[data-theme="solarized"] .hx-content kbd {
      background: #eee8d5;
      color: #586e75;
    }

    body[data-theme="solarized"] .hx-content a,
    body[data-theme="solarized"] .hx-wikilink {
      color: #268bd2;
      text-decoration-color: rgba(38, 139, 210, 0.4);
    }

    body[data-theme="solarized"] .hx-content a:hover {
      color: #2aa198;
      text-decoration-color: currentColor;
    }

    body[data-theme="solarized"] .hx-content thead th {
      background: #eee8d5;
      border-bottom-color: #ddd6c1;
      color: #586e75;
    }

    body[data-theme="solarized"] .hx-content tbody tr:nth-child(even) {
      background: #f7f1de;
    }

    body[data-theme="solarized"] .hx-content tbody tr:hover {
      background: #eee8d5;
    }

    body[data-theme="solarized"] .hx-table-wrap {
      background: #fdf6e3;
      border-color: #e0d8c0;
    }

    body[data-theme="solarized"] .hx-badge {
      background: #b58900;
      color: #fdf6e3;
      font-weight: 700;
    }

    body[data-theme="solarized"] .hx-meta > * {
      background: #eee8d5;
      border-color: #e0d8c0;
      color: #93a1a1;
    }

    body[data-theme="solarized"] .hx-content img {
      border-color: #e0d8c0;
    }

    body[data-theme="solarized"] .hx-callout {
      background: #f7f1de;
    }

    body[data-theme="solarized"] .hx-callout > .hx-callout-title {
      color: #b58900;
    }

    body[data-theme="solarized"] .hx-totop,
    body[data-theme="solarized"] .hx-theme-switcher {
      background: #fdf6e3;
      border-color: #e0d8c0;
    }

    body[data-theme="solarized"] .hx-theme-switcher button.is-active {
      background: #b58900;
      color: #fdf6e3;
    }

    body[data-theme="solarized"] .hx-content hr {
      border-top-color: #e0d8c0;
    }
  `,
};
