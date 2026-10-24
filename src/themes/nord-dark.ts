import type { Theme } from "../types";

/**
 * Nord Dark - #2e3440 ground with the Nord frost accent, low-contrast and
 * deliberately roomy so long notes stay comfortable at night.
 */
export const nordDark: Theme = {
  id: "nord-dark",
  name: "Nord Dark",
  description: "Nord palette: deep slate ground, frost accent, long-reading comfort.",
  mode: "dark",
  tokens: {
    bg: "#2e3440",
    surface: "#3b4252",
    "surface-alt": "#353c4a",
    text: "#d8dee9",
    "text-muted": "#9aa6ba",
    accent: "#88c0d0",
    "accent-contrast": "#2e3440",
    border: "#434c5e",
    radius: "6px",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.28), 0 14px 34px -18px rgba(0, 0, 0, 0.55)",
    "font-body":
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Helvetica Neue', 'Noto Sans SC', sans-serif",
    "font-heading":
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Helvetica Neue', 'Noto Sans SC', sans-serif",
    "font-mono": "'SF Mono', ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace",
    "max-width": "68rem",
    link: "#8fbcbb",
    "code-bg": "#272c36",
    "code-text": "#d8dee9",
    selection: "rgba(136, 192, 208, 0.28)",
  },
  css: String.raw`
    body[data-theme="nord-dark"] .hx-content {
      line-height: 1.82;
    }

    body[data-theme="nord-dark"] .hx-content h1,
    body[data-theme="nord-dark"] .hx-content h2,
    body[data-theme="nord-dark"] .hx-content h3,
    body[data-theme="nord-dark"] .hx-title {
      letter-spacing: -0.008em;
      font-weight: 600;
    }

    body[data-theme="nord-dark"] .hx-content h2 {
      border-bottom: 1px solid var(--hx-border);
      padding-bottom: 0.34em;
    }

    body[data-theme="nord-dark"] .hx-content h3 {
      color: #e5e9f0;
    }

    body[data-theme="nord-dark"] .hx-content h4 {
      color: var(--hx-accent);
      letter-spacing: 0.02em;
    }

    body[data-theme="nord-dark"] .hx-content strong {
      color: #eceff4;
    }

    body[data-theme="nord-dark"] .hx-content blockquote {
      border-left: 3px solid var(--hx-accent);
      border-radius: 0 var(--hx-radius) var(--hx-radius) 0;
      background: rgba(59, 66, 82, 0.7);
      padding: 0.85rem 1.1rem;
      color: #c3ccdb;
      font-style: normal;
    }

    body[data-theme="nord-dark"] .hx-content pre,
    body[data-theme="nord-dark"] .hx-code-block {
      border-color: #2b313c;
      background: var(--hx-code-bg);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    body[data-theme="nord-dark"] .hx-content :not(pre) > code {
      border-color: #3f4859;
      background: #272c36;
      color: #a3d4de;
    }

    body[data-theme="nord-dark"] .hx-content a {
      text-decoration-color: rgba(143, 188, 187, 0.45);
    }

    body[data-theme="nord-dark"] .hx-content a:hover {
      color: #9fd4dc;
      text-decoration-color: currentColor;
    }

    body[data-theme="nord-dark"] .hx-content thead th {
      background: #3b4252;
      border-bottom-color: #4c566a;
      color: #eceff4;
    }

    body[data-theme="nord-dark"] .hx-content th,
    body[data-theme="nord-dark"] .hx-content td {
      border-bottom-color: #3f4859;
    }

    body[data-theme="nord-dark"] .hx-content tbody tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.022);
    }

    body[data-theme="nord-dark"] .hx-content tbody tr:hover {
      background: rgba(136, 192, 208, 0.09);
    }

    body[data-theme="nord-dark"] .hx-table-wrap {
      background: #343b49;
      border-color: #434c5e;
    }

    body[data-theme="nord-dark"] .hx-content img {
      border-color: #434c5e;
      box-shadow: var(--hx-shadow);
    }

    body[data-theme="nord-dark"] .hx-callout {
      background: color-mix(in srgb, var(--hx-co) 11%, #3b4252);
      border-color: #46506380;
    }

    body[data-theme="nord-dark"] .hx-badge {
      background: var(--hx-accent);
      color: #2e3440;
      font-weight: 700;
    }

    body[data-theme="nord-dark"] .hx-meta > * {
      background: #3b4252;
      border-color: #434c5e;
      color: #a9b4c6;
    }

    body[data-theme="nord-dark"] .hx-content hr {
      border-top-color: #434c5e;
    }

    body[data-theme="nord-dark"] .hx-totop,
    body[data-theme="nord-dark"] .hx-theme-switcher {
      background: #3b4252;
      border-color: #4c566a;
    }

    body[data-theme="nord-dark"] .hx-theme-switcher button.is-active {
      background: var(--hx-accent);
      color: #2e3440;
      font-weight: 700;
    }

    body[data-theme="nord-dark"] .hx-content .task-list-item > input[type="checkbox"] {
      accent-color: var(--hx-accent);
    }
  `,
};
