import type { Theme } from "../types";

/**
 * Terminal - a calm phosphor terminal: near-black #0b0f0b ground, #33ff66
 * accent used sparingly, monospace everywhere, readable contrast and line
 * height. Personality comes from prompt-style headings, not from glow.
 */
export const terminal: Theme = {
  id: "terminal",
  name: "Terminal",
  description: "Calm phosphor terminal: near-black ground, green prompt accents.",
  mode: "dark",
  tokens: {
    bg: "#0b0f0b",
    surface: "#121a12",
    "surface-alt": "#101711",
    text: "#cfe0cf",
    "text-muted": "#7f9a80",
    accent: "#33ff66",
    "accent-contrast": "#04120a",
    border: "#233323",
    radius: "2px",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.5), 0 16px 36px -20px rgba(0, 0, 0, 0.8)",
    "font-body":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    "font-heading":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    "font-mono":
      "ui-monospace, 'JetBrains Mono', 'Cascadia Mono', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    "max-width": "70rem",
    link: "#33ff66",
    "code-bg": "#0d130d",
    "code-text": "#cfe0cf",
    selection: "rgba(51, 255, 102, 0.22)",
  },
  css: String.raw`
    body[data-theme="terminal"] {
      background-image: radial-gradient(
        120% 80% at 50% 0%,
        rgba(51, 255, 102, 0.045),
        transparent 62%
      );
      background-repeat: no-repeat;
      font-size: clamp(0.94rem, 0.9rem + 0.16vw, 1rem);
      line-height: 1.8;
    }

    body[data-theme="terminal"] .hx-content h1,
    body[data-theme="terminal"] .hx-content h2,
    body[data-theme="terminal"] .hx-content h3,
    body[data-theme="terminal"] .hx-content h4,
    body[data-theme="terminal"] .hx-title {
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    body[data-theme="terminal"] .hx-title {
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    /* Blinking block cursor after the document title. */
    body[data-theme="terminal"] .hx-title::after {
      content: "\258C";
      color: var(--hx-accent);
      margin-left: 0.12em;
      font-weight: 400;
      animation: hx-terminal-blink 1.1s step-end infinite;
    }

    @keyframes hx-terminal-blink {
      0%,
      49% {
        opacity: 1;
      }
      50%,
      100% {
        opacity: 0;
      }
    }

    /* Prompt-style section markers: ## and ### in muted accent. */
    body[data-theme="terminal"] .hx-content h2 {
      border-bottom: 1px solid var(--hx-border);
      padding-bottom: 0.3em;
      color: #e4f2e4;
    }

    body[data-theme="terminal"] .hx-content h2::before {
      content: "## ";
      color: var(--hx-accent);
      opacity: 0.6;
      font-weight: 400;
    }

    body[data-theme="terminal"] .hx-content h3::before {
      content: "### ";
      color: var(--hx-accent);
      opacity: 0.42;
      font-weight: 400;
    }

    body[data-theme="terminal"] .hx-content h4 {
      color: var(--hx-accent);
      text-transform: none;
      letter-spacing: 0;
      font-size: 1rem;
    }

    body[data-theme="terminal"] .hx-content h4::before {
      content: "\203A ";
      color: var(--hx-accent);
      opacity: 0.7;
    }

    body[data-theme="terminal"] .hx-content strong {
      color: #eafbea;
      font-weight: 700;
    }

    body[data-theme="terminal"] .hx-content em {
      color: #a9d9ae;
    }

    body[data-theme="terminal"] .hx-content blockquote {
      border-left: 2px solid var(--hx-accent);
      background: #0f1710;
      color: #a9c4aa;
      font-style: normal;
      padding: 0.75rem 1rem;
    }

    /* Prompt chevron sits in the gutter so the quote text keeps its measure. */
    body[data-theme="terminal"] .hx-content blockquote {
      position: relative;
      padding-left: 1.9rem;
    }

    body[data-theme="terminal"] .hx-content blockquote::before {
      content: ">";
      position: absolute;
      top: 0.75rem;
      left: 0.6rem;
      color: var(--hx-accent);
      font-weight: 700;
    }

    body[data-theme="terminal"] .hx-content pre,
    body[data-theme="terminal"] .hx-code-block {
      background: var(--hx-code-bg);
      border-color: #1e2d1e;
      border-left: 2px solid rgba(51, 255, 102, 0.5);
      box-shadow: inset 0 1px 0 rgba(51, 255, 102, 0.06);
    }

    body[data-theme="terminal"] .hx-content :not(pre) > code {
      background: #162016;
      border-color: #24361f;
      color: #7dff9b;
      border-radius: 2px;
    }

    body[data-theme="terminal"] .hx-content kbd {
      background: #162016;
      border-color: #2a3d26;
      color: #b9f5c4;
    }

    body[data-theme="terminal"] .hx-content a,
    body[data-theme="terminal"] .hx-wikilink {
      color: var(--hx-accent);
      text-decoration-color: rgba(51, 255, 102, 0.35);
    }

    body[data-theme="terminal"] .hx-content a:hover {
      color: #8bffab;
      text-decoration-color: currentColor;
    }

    body[data-theme="terminal"] .hx-content thead th {
      background: #141d14;
      border-bottom-color: #2a3d26;
      color: #d8f0d8;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-size: 0.78em;
    }

    body[data-theme="terminal"] .hx-content th,
    body[data-theme="terminal"] .hx-content td {
      border-bottom-color: #1e2b1e;
    }

    body[data-theme="terminal"] .hx-content tbody tr:nth-child(even) {
      background: rgba(51, 255, 102, 0.028);
    }

    body[data-theme="terminal"] .hx-content tbody tr:hover {
      background: rgba(51, 255, 102, 0.07);
    }

    body[data-theme="terminal"] .hx-table-wrap {
      background: #0f1710;
      border-color: #233323;
    }

    body[data-theme="terminal"] .hx-content img {
      border-color: #233323;
      border-radius: 2px;
      opacity: 0.94;
    }

    body[data-theme="terminal"] .hx-content img:hover {
      opacity: 1;
    }

    body[data-theme="terminal"] .hx-callout {
      background: color-mix(in srgb, var(--hx-co) 8%, #101711);
      border-color: #24361f;
      border-left-color: var(--hx-co);
    }

    body[data-theme="terminal"] .hx-callout > .hx-callout-title {
      letter-spacing: 0.12em;
    }

    body[data-theme="terminal"] .hx-badge {
      background: transparent;
      color: var(--hx-accent);
      border: 1px solid rgba(51, 255, 102, 0.45);
      border-radius: 2px;
      letter-spacing: 0.2em;
    }

    body[data-theme="terminal"] .hx-badge::before {
      content: "\25CF ";
      font-size: 0.8em;
      vertical-align: 0.06em;
    }

    body[data-theme="terminal"] .hx-meta > * {
      background: #121a12;
      border-color: #233323;
      border-radius: 2px;
      color: #7f9a80;
    }

    body[data-theme="terminal"] .hx-content hr {
      border-top: 1px dashed #2a3d26;
    }

    body[data-theme="terminal"] .hx-totop,
    body[data-theme="terminal"] .hx-theme-switcher {
      background: #121a12;
      border-color: #2a3d26;
    }

    body[data-theme="terminal"] .hx-totop:hover {
      color: var(--hx-accent);
      border-color: rgba(51, 255, 102, 0.5);
    }

    body[data-theme="terminal"] .hx-theme-switcher button.is-active {
      background: var(--hx-accent);
      color: #04120a;
      font-weight: 700;
    }

    body[data-theme="terminal"] .hx-footer {
      color: #6f8a70;
      border-top-color: #233323;
    }

    body[data-theme="terminal"] .hx-content .task-list-item > input[type="checkbox"] {
      accent-color: var(--hx-accent);
    }

    @media (prefers-reduced-motion: reduce) {
      body[data-theme="terminal"] .hx-title::after {
        animation: none;
      }
    }
  `,
};
