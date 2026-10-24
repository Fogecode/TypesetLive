import type { Theme } from "../types";

/**
 * Neo-brutalist - the user's spec, verbatim: 4px solid #101010 borders,
 * 10px 10px 0 #101010 hard shadow, zero radius, #FFDD00 accent, weight-900
 * headings, monospace body. Every block element carries the border and the
 * offset shadow, not just the page background.
 */
export const neoBrutalist: Theme = {
  id: "neo-brutalist",
  name: "Neo-Brutalist",
  description: "4px black borders, hard offset shadows, acid yellow, zero radius.",
  mode: "light",
  tokens: {
    bg: "#fffdf2",
    surface: "#ffffff",
    "surface-alt": "#fff3b0",
    text: "#101010",
    "text-muted": "#4a4a4a",
    accent: "#FFDD00",
    "accent-contrast": "#101010",
    border: "#101010",
    radius: "0px",
    shadow: "10px 10px 0 #101010",
    "font-body":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace",
    "font-heading":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace",
    "font-mono":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace",
    "max-width": "70rem",
    link: "#101010",
    "code-bg": "#fff3b0",
    "code-text": "#101010",
    selection: "#FFDD00",
  },
  css: String.raw`
    body[data-theme="neo-brutalist"] {
      background-image: linear-gradient(
        to right,
        rgba(16, 16, 16, 0.05) 1px,
        transparent 1px
      );
      background-size: 22px 22px;
    }

    body[data-theme="neo-brutalist"] .hx-content h1,
    body[data-theme="neo-brutalist"] .hx-content h2,
    body[data-theme="neo-brutalist"] .hx-content h3,
    body[data-theme="neo-brutalist"] .hx-content h4,
    body[data-theme="neo-brutalist"] .hx-title {
      font-weight: 900;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    body[data-theme="neo-brutalist"] .hx-content h2 {
      border-bottom: 4px solid #101010;
      padding-bottom: 0.24em;
    }

    body[data-theme="neo-brutalist"] .hx-content blockquote,
    body[data-theme="neo-brutalist"] .hx-content pre,
    body[data-theme="neo-brutalist"] .hx-code-block,
    body[data-theme="neo-brutalist"] .hx-table-wrap,
    body[data-theme="neo-brutalist"] .hx-callout,
    body[data-theme="neo-brutalist"] .hx-content img,
    body[data-theme="neo-brutalist"] .hx-figure img {
      border: 4px solid #101010;
      border-radius: 0;
      box-shadow: 10px 10px 0 #101010;
      background: #ffffff;
    }

    body[data-theme="neo-brutalist"] .hx-content blockquote {
      padding: 1rem 1.25rem;
      font-style: normal;
      color: #101010;
      background: #fff3b0;
    }

    body[data-theme="neo-brutalist"] .hx-content pre,
    body[data-theme="neo-brutalist"] .hx-code-block {
      background: #fffdf2;
    }

    body[data-theme="neo-brutalist"] .hx-table-wrap {
      overflow-x: auto;
    }

    body[data-theme="neo-brutalist"] .hx-content table {
      border-collapse: collapse;
    }

    body[data-theme="neo-brutalist"] .hx-content th,
    body[data-theme="neo-brutalist"] .hx-content td {
      border-bottom: 2px solid #101010;
    }

    body[data-theme="neo-brutalist"] .hx-content thead th {
      background: #FFDD00;
      border-bottom: 4px solid #101010;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    body[data-theme="neo-brutalist"] .hx-content tbody tr:nth-child(even) {
      background: #fff8cf;
    }

    body[data-theme="neo-brutalist"] .hx-content tbody tr:hover {
      background: #FFDD00;
    }

    body[data-theme="neo-brutalist"] .hx-callout {
      background: #ffffff;
      border-left-width: 4px;
      border-left-color: #101010;
      padding: 1rem 1.15rem;
    }

    body[data-theme="neo-brutalist"] .hx-callout > .hx-callout-title {
      display: inline-block;
      padding: 0.1em 0.4em;
      background: #FFDD00;
      color: #101010;
      font-weight: 900;
      letter-spacing: 0.08em;
    }

    body[data-theme="neo-brutalist"] .hx-content :not(pre) > code,
    body[data-theme="neo-brutalist"] .hx-content kbd {
      border: 2px solid #101010;
      background: #FFDD00;
      color: #101010;
      font-weight: 700;
    }

    body[data-theme="neo-brutalist"] .hx-content a,
    body[data-theme="neo-brutalist"] .hx-wikilink {
      color: #101010;
      text-decoration-thickness: 3px;
      text-underline-offset: 0.18em;
      text-decoration-color: #101010;
      background: linear-gradient(transparent 62%, #FFDD00 62%);
    }

    body[data-theme="neo-brutalist"] .hx-content a:hover {
      background: #FFDD00;
    }

    body[data-theme="neo-brutalist"] .hx-badge {
      background: #FFDD00;
      color: #101010;
      border: 3px solid #101010;
      box-shadow: 4px 4px 0 #101010;
      font-weight: 900;
    }

    body[data-theme="neo-brutalist"] .hx-meta > * {
      border: 3px solid #101010;
      border-radius: 0;
      background: #ffffff;
      box-shadow: 3px 3px 0 #101010;
      color: #101010;
      font-weight: 700;
    }

    body[data-theme="neo-brutalist"] .hx-content hr {
      border-top: 4px solid #101010;
    }

    body[data-theme="neo-brutalist"] .hx-copy-btn {
      border: 3px solid #101010;
      border-radius: 0;
      background: #FFDD00;
      color: #101010;
      font-weight: 700;
      box-shadow: 3px 3px 0 #101010;
      opacity: 1;
      transform: none;
    }

    body[data-theme="neo-brutalist"] .hx-copy-btn:hover {
      background: #101010;
      color: #FFDD00;
    }

    body[data-theme="neo-brutalist"] .hx-totop {
      border: 4px solid #101010;
      border-radius: 0;
      background: #FFDD00;
      color: #101010;
      font-weight: 900;
      box-shadow: 5px 5px 0 #101010;
    }

    body[data-theme="neo-brutalist"] .hx-theme-switcher {
      border: 4px solid #101010;
      border-radius: 0;
      background: #ffffff;
      box-shadow: 8px 8px 0 #101010;
      backdrop-filter: none;
    }

    body[data-theme="neo-brutalist"] .hx-theme-switcher button {
      border-radius: 0;
      font-family: var(--hx-font-mono);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    body[data-theme="neo-brutalist"] .hx-theme-switcher button.is-active {
      background: #FFDD00;
      color: #101010;
      border-color: #101010;
      font-weight: 700;
    }

    body[data-theme="neo-brutalist"] .hx-content .task-list-item > input[type="checkbox"] {
      accent-color: #101010;
      outline: 2px solid #101010;
      outline-offset: 1px;
    }

    @media print {
      body[data-theme="neo-brutalist"] .hx-content blockquote,
      body[data-theme="neo-brutalist"] .hx-content pre,
      body[data-theme="neo-brutalist"] .hx-code-block,
      body[data-theme="neo-brutalist"] .hx-table-wrap,
      body[data-theme="neo-brutalist"] .hx-callout,
      body[data-theme="neo-brutalist"] .hx-content img {
        box-shadow: none !important;
      }
    }
  `,
};
