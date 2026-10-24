import type { Theme } from "../types";

/**
 * Magazine - a print feature spread: oversized display serif headline,
 * centred masthead with double rules, a drop cap opening the article and a
 * narrow measure. Warm oxblood accent (#b23a2f).
 */
export const magazine: Theme = {
  id: "magazine",
  name: "Magazine",
  description: "Print feature spread: display serif masthead, drop cap, oxblood accent.",
  mode: "light",
  tokens: {
    bg: "#fbf9f6",
    surface: "#ffffff",
    "surface-alt": "#f3efea",
    text: "#1c1a18",
    "text-muted": "#6f675f",
    accent: "#b23a2f",
    "accent-contrast": "#ffffff",
    border: "#ded7cf",
    radius: "2px",
    shadow: "0 1px 1px rgba(28, 26, 24, 0.05), 0 18px 40px -28px rgba(28, 26, 24, 0.4)",
    "font-body":
      "Georgia, 'Iowan Old Style', 'Times New Roman', 'Songti SC', 'Noto Serif CJK SC', serif",
    "font-heading":
      "'Playfair Display', 'Didot', 'Bodoni MT', Georgia, 'Times New Roman', 'Songti SC', serif",
    "font-mono": "'SF Mono', ui-monospace, Menlo, Consolas, monospace",
    "max-width": "74rem",
    link: "#b23a2f",
    "code-bg": "#f3efea",
    "code-text": "#3b3330",
    selection: "rgba(178, 58, 47, 0.15)",
  },
  css: String.raw`
    /* Masthead type: display serif at poster size, centred, tight leading. */
    body[data-theme="magazine"] .hx-title {
      font-size: clamp(2.4rem, 1.6rem + 3.6vw, 4.4rem);
      line-height: 1.02;
      letter-spacing: -0.028em;
      font-weight: 700;
      max-width: 24ch;
      margin-left: auto;
      margin-right: auto;
    }

    body[data-theme="magazine"] .hx-subtitle {
      margin-left: auto;
      margin-right: auto;
      font-style: italic;
      font-size: clamp(1.02rem, 0.95rem + 0.4vw, 1.24rem);
      color: var(--hx-text-muted);
      max-width: 52ch;
    }

    body[data-theme="magazine"] .hx-meta {
      justify-content: center;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.68rem;
    }

    body[data-theme="magazine"] .hx-meta > * {
      border: 0;
      background: transparent;
      padding: 0 0.55rem;
      border-right: 1px solid var(--hx-border);
      border-radius: 0;
    }

    body[data-theme="magazine"] .hx-meta > *:last-child {
      border-right: 0;
    }

    body[data-theme="magazine"] .hx-badge {
      background: transparent;
      color: var(--hx-accent);
      border: 1px solid var(--hx-accent);
      border-radius: 0;
      letter-spacing: 0.3em;
    }

    /* Narrow editorial measure inside the wider grid. */
    body[data-theme="magazine"] .hx-content {
      max-width: 44rem;
      font-size: clamp(1.03rem, 0.98rem + 0.28vw, 1.15rem);
      line-height: 1.78;
    }

    body[data-theme="magazine"] .hx-content h1 {
      font-size: clamp(1.9rem, 1.4rem + 2vw, 2.7rem);
      letter-spacing: -0.024em;
      line-height: 1.1;
    }

    body[data-theme="magazine"] .hx-content h2 {
      border-bottom: 0;
      padding-bottom: 0;
      margin-top: 2.8em;
      font-size: clamp(1.5rem, 1.25rem + 1.1vw, 2rem);
      letter-spacing: -0.02em;
      line-height: 1.14;
    }

    body[data-theme="magazine"] .hx-content h2::before {
      content: "";
      display: block;
      width: 3.4rem;
      height: 3px;
      margin-bottom: 0.5em;
      background: var(--hx-accent);
    }

    body[data-theme="magazine"] .hx-content h3 {
      font-style: italic;
      font-weight: 600;
      letter-spacing: -0.01em;
      font-size: clamp(1.16rem, 1.06rem + 0.5vw, 1.38rem);
    }

    /* Drop cap on the opening paragraph. */
    body[data-theme="magazine"] .hx-content > p:first-of-type::first-letter {
      float: left;
      font-family: var(--hx-font-heading);
      font-size: 3.9em;
      line-height: 0.82;
      font-weight: 700;
      padding: 0.06em 0.12em 0 0;
      margin-right: 0.04em;
      color: var(--hx-accent);
    }

    body[data-theme="magazine"] .hx-content blockquote {
      border-left: 0;
      padding: 0.4rem 0 0.4rem 0;
      margin: 2.2em 0;
      text-align: center;
      font-size: 1.22em;
      font-style: italic;
      line-height: 1.55;
      color: var(--hx-text);
      border-top: 1px solid var(--hx-border);
      border-bottom: 1px solid var(--hx-border);
      padding: 1.1rem 0;
    }

    body[data-theme="magazine"] .hx-content blockquote::before {
      content: "\201C";
      display: block;
      font-family: var(--hx-font-heading);
      font-size: 2.6em;
      line-height: 0.5;
      color: var(--hx-accent);
      margin-bottom: 0.28em;
    }

    body[data-theme="magazine"] .hx-content a,
    body[data-theme="magazine"] .hx-wikilink {
      color: var(--hx-accent);
      text-decoration-color: rgba(178, 58, 47, 0.35);
    }

    body[data-theme="magazine"] .hx-content pre,
    body[data-theme="magazine"] .hx-code-block {
      font-size: 0.83rem;
      border-left: 3px solid var(--hx-accent);
    }

    body[data-theme="magazine"] .hx-content thead th {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.72em;
      font-family: var(--hx-font-body);
    }

    body[data-theme="magazine"] .hx-content hr {
      border-top: 1px solid var(--hx-border);
      width: 34%;
      margin-left: auto;
      margin-right: auto;
    }

    body[data-theme="magazine"] .hx-content img {
      border: 0;
      border-radius: 0;
    }

    body[data-theme="magazine"] .hx-footer {
      text-align: center;
      font-style: italic;
      letter-spacing: 0.04em;
    }
  `,
};
