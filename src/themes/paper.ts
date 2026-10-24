import type { Theme } from "../types";

/**
 * Paper - the default. Warm off-white stock, serif headings, editorial
 * spacing and letterpress restraint: the note should read like a printed
 * essay rather than a web page.
 */
export const paper: Theme = {
  id: "paper",
  name: "Paper",
  description: "Warm off-white stock, serif headings, quiet editorial rhythm.",
  mode: "light",
  tokens: {
    bg: "#faf7f0",
    surface: "#fffdf8",
    "surface-alt": "#f3ede1",
    text: "#2f2b26",
    "text-muted": "#7a7066",
    accent: "#8c3b26",
    "accent-contrast": "#fffaf3",
    border: "#e2d8c8",
    radius: "3px",
    shadow: "0 1px 2px rgba(60, 45, 30, 0.06), 0 10px 26px -16px rgba(60, 45, 30, 0.22)",
    "font-body":
      "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Songti SC', 'Noto Serif CJK SC', serif",
    "font-heading":
      "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', serif",
    "font-mono": "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    "max-width": "66rem",
    link: "#8c3b26",
    "code-bg": "#f2ecdf",
    "code-text": "#4a3a2c",
    selection: "rgba(140, 59, 38, 0.16)",
  },
  css: String.raw`
    /* Serif display: tighter, softer, slightly smaller than the generic h1. */
    body[data-theme="paper"] .hx-content h1,
    body[data-theme="paper"] .hx-content h2 {
      letter-spacing: -0.012em;
    }

    body[data-theme="paper"] .hx-content h2 {
      border-bottom: 0;
      padding-bottom: 0;
      font-weight: 600;
    }

    /* A hairline that starts under the heading, like a chapter rule. */
    body[data-theme="paper"] .hx-content h2::after {
      content: "";
      display: block;
      width: 2.6rem;
      height: 1px;
      margin-top: 0.42em;
      background: var(--hx-accent);
      opacity: 0.55;
    }

    body[data-theme="paper"] .hx-content h4 {
      font-variant: small-caps;
      letter-spacing: 0.06em;
      font-size: 1.02rem;
    }

    body[data-theme="paper"] .hx-title {
      letter-spacing: -0.016em;
    }

    body[data-theme="paper"] .hx-badge {
      background: transparent;
      color: var(--hx-accent);
      border: 1px solid var(--hx-border);
      letter-spacing: 0.22em;
    }

    body[data-theme="paper"] .hx-content blockquote {
      border-left: 3px double var(--hx-accent);
      font-size: 1.06em;
      padding-left: 1.35em;
    }

    body[data-theme="paper"] .hx-content hr {
      border-top: 3px double var(--hx-border);
    }

    body[data-theme="paper"] .hx-content pre,
    body[data-theme="paper"] .hx-code-block {
      border-left: 3px solid var(--hx-accent);
    }

    body[data-theme="paper"] .hx-content thead th {
      font-variant: small-caps;
      letter-spacing: 0.04em;
      border-bottom-width: 1px;
    }

    body[data-theme="paper"] .hx-content img {
      border-radius: 2px;
      box-shadow: 0 1px 2px rgba(60, 45, 30, 0.1), 0 12px 28px -20px rgba(60, 45, 30, 0.35);
    }
  `,
};
