export const BASE_CSS: string = String.raw`/* ==========================================================================
   hx-export - base stylesheet (layout, typography, chrome)
   --------------------------------------------------------------------------
   Every colour, type and shape decision is read from a var(--hx-*) design
   token, so a theme only has to swap tokens plus a little personality CSS.
   The only hard-coded values here are semantic callout fallbacks, and even
   those are overridable by a theme token (--hx-callout-*).
   ========================================================================== */

/* ---------- reset / canvas ---------- */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
  /* keep anchored headings clear of the fixed progress bar */
  scroll-padding-top: 5.5rem;
}

body {
  margin: 0 auto;
  max-width: var(--hx-max-width);
  background: var(--hx-bg);
  color: var(--hx-text);
  font-family: var(--hx-font-body);
  font-size: clamp(1rem, 0.96rem + 0.22vw, 1.09rem);
  line-height: 1.75;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-wrap: break-word;
}

::selection {
  background: var(--hx-selection, color-mix(in srgb, var(--hx-accent) 28%, transparent));
  color: var(--hx-text);
}

:focus-visible {
  outline: 2px solid var(--hx-accent);
  outline-offset: 3px;
  border-radius: 2px;
}

/* ---------- reading progress ---------- */

.hx-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 3px;
  z-index: 60;
  background: color-mix(in srgb, var(--hx-border) 55%, transparent);
  pointer-events: none;
}

.hx-progress > span {
  display: block;
  width: 0;
  height: 100%;
  background: var(--hx-accent);
  transition: width 0.12s linear;
}

/* ---------- shell / layout grid ---------- */

.hx-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  /* bottom padding clears the fixed floating controls */
  padding: clamp(1.4rem, 3.5vw, 3rem) clamp(1.1rem, 4vw, 2.6rem) 7rem;
  column-gap: clamp(2rem, 4vw, 3.25rem);
}

.hx-shell > .hx-header,
.hx-shell > .hx-footer {
  grid-column: 1 / -1;
}

.hx-content {
  min-width: 0;
  grid-column: 1 / -1;
}

/* two columns once a TOC is present and the viewport can carry it */
@media (min-width: 980px) {
  .hx-shell:has(> .hx-toc) {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .hx-shell:has(> .hx-toc) > .hx-content {
    grid-column: 2;
  }
}

/* optional inner wrapper: <div class="hx-main"><nav class="hx-toc">...</nav><article class="hx-content">...</article></div> */
.hx-main,
.hx-layout,
.hx-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: clamp(2rem, 4vw, 3.25rem);
  align-items: start;
}

@media (min-width: 980px) {
  .hx-main:has(> .hx-toc),
  .hx-layout:has(> .hx-toc),
  .hx-body:has(> .hx-toc) {
    grid-template-columns: 240px minmax(0, 1fr);
  }
}

/* ---------- header ---------- */

.hx-header {
  position: relative;
  margin-bottom: clamp(1.8rem, 4vw, 3rem);
  padding-bottom: clamp(1.2rem, 2.5vw, 1.9rem);
  border-bottom: 1px solid var(--hx-border);
}

.hx-badge {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 0.9rem;
  padding: 0.38rem 0.6rem;
  overflow-wrap: anywhere;
  word-break: break-word;
  border-radius: calc(var(--hx-radius) * 0.5);
  background: var(--hx-accent);
  color: var(--hx-accent-contrast);
  font-family: var(--hx-font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hx-header h1,
.hx-title {
  margin: 0 0 0.5rem;
  font-family: var(--hx-font-heading);
  font-size: clamp(1.95rem, 1.45rem + 2vw, 2.9rem);
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.02em;
  color: var(--hx-text);
  text-wrap: balance;
}

.hx-subtitle {
  margin: 0 0 1rem;
  max-width: 62ch;
  color: var(--hx-text-muted);
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.13rem);
  line-height: 1.6;
}

.hx-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.5rem;
  margin-top: 1.1rem;
  font-size: 0.78rem;
}

.hx-meta > * {
  max-width: 100%;
  padding: 0.22rem 0.62rem;
  border: 1px solid var(--hx-border);
  border-radius: 999px;
  background: var(--hx-surface-alt);
  color: var(--hx-text-muted);
  letter-spacing: 0.02em;
  /* was nowrap: a long vault path or frontmatter value pushed the page wide */
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* ---------- table of contents ---------- */

.hx-toc {
  align-self: start;
  margin-bottom: 2.5rem;
  padding-left: 0;
  font-size: 0.855rem;
  line-height: 1.55;
}

@media (min-width: 980px) {
  .hx-toc {
    position: sticky;
    top: 4.5rem;
    max-height: calc(100vh - 6.5rem);
    overflow-y: auto;
    overscroll-behavior: contain;
    margin-bottom: 0;
    padding-right: 0.6rem;
    scrollbar-width: thin;
  }
}

.hx-toc-title {
  margin: 0 0 0.7rem;
  font-family: var(--hx-font-body);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--hx-text-muted);
}

.hx-toc ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.hx-toc ul ul {
  padding-left: 0.85rem;
  border-left: 1px solid var(--hx-border);
  margin-left: 0.1rem;
}

.hx-toc li {
  margin: 0.18rem 0;
}

.hx-toc a {
  display: block;
  padding: 0.2rem 0 0.2rem 0.6rem;
  margin-left: -0.62rem;
  border-left: 2px solid transparent;
  color: var(--hx-text-muted);
  text-decoration: none;
  border-radius: 0 calc(var(--hx-radius) * 0.4) calc(var(--hx-radius) * 0.4) 0;
  transition: color 0.16s ease, border-color 0.16s ease, background 0.16s ease;
}

.hx-toc a:hover {
  color: var(--hx-text);
  background: color-mix(in srgb, var(--hx-text) 4%, transparent);
}

.hx-toc a.is-active {
  color: var(--hx-accent);
  border-left-color: var(--hx-accent);
  font-weight: 600;
  background: color-mix(in srgb, var(--hx-accent) 8%, transparent);
}

/* ---------- content typography ---------- */

.hx-content {
  --hx-co-note: var(--hx-callout-note, var(--hx-accent));
  --hx-co-info: var(--hx-callout-info, color-mix(in srgb, var(--hx-accent) 45%, #2f6feb));
  --hx-co-tip: var(--hx-callout-tip, color-mix(in srgb, var(--hx-accent) 25%, #1f9d55));
  --hx-co-warning: var(--hx-callout-warning, color-mix(in srgb, var(--hx-accent) 20%, #c98a00));
  --hx-co-danger: var(--hx-callout-danger, color-mix(in srgb, var(--hx-accent) 18%, #d92d20));
}

.hx-content > :first-child {
  margin-top: 0;
}

.hx-content > :last-child {
  margin-bottom: 0;
}

.hx-content h1,
.hx-content h2,
.hx-content h3,
.hx-content h4,
.hx-content h5,
.hx-content h6 {
  font-family: var(--hx-font-heading);
  color: var(--hx-text);
  line-height: 1.26;
  letter-spacing: -0.014em;
  text-wrap: balance;
  scroll-margin-top: 5rem;
}

.hx-content h1 {
  margin: 2.4em 0 0.6em;
  font-size: clamp(1.75rem, 1.35rem + 1.6vw, 2.4rem);
  font-weight: 700;
}

.hx-content h2 {
  margin: 2.6em 0 0.65em;
  padding-bottom: 0.32em;
  border-bottom: 1px solid var(--hx-border);
  font-size: clamp(1.42rem, 1.2rem + 0.95vw, 1.88rem);
  font-weight: 700;
}

.hx-content h3 {
  margin: 2.1em 0 0.5em;
  font-size: clamp(1.18rem, 1.08rem + 0.45vw, 1.36rem);
  font-weight: 650;
}

.hx-content h4 {
  margin: 1.9em 0 0.45em;
  font-size: 1.06rem;
  font-weight: 650;
  letter-spacing: 0;
}

.hx-content h5,
.hx-content h6 {
  margin: 1.7em 0 0.4em;
  font-size: 0.95rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--hx-text-muted);
}

.hx-content p {
  margin: 0 0 1.15em;
}

.hx-content p + p {
  margin-top: 0;
}

.hx-content strong,
.hx-content b {
  font-weight: 680;
  color: var(--hx-text);
}

.hx-content em,
.hx-content i {
  font-style: italic;
}

.hx-content del {
  color: var(--hx-text-muted);
}

.hx-content small {
  font-size: 0.86em;
  color: var(--hx-text-muted);
}

.hx-content a {
  color: var(--hx-link, var(--hx-accent));
  text-decoration: underline;
  text-decoration-thickness: 0.07em;
  text-underline-offset: 0.22em;
  text-decoration-color: color-mix(in srgb, currentColor 38%, transparent);
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
}

.hx-content a:hover {
  text-decoration-color: currentColor;
}

.hx-content sup,
.hx-content sub {
  font-size: 0.72em;
  line-height: 0;
}

/* lists */

.hx-content ul,
.hx-content ol {
  margin: 0 0 1.15em;
  padding-left: 1.45em;
}

.hx-content li {
  margin: 0.34em 0;
}

.hx-content li > ul,
.hx-content li > ol {
  margin: 0.34em 0 0.5em;
}

.hx-content ul ul {
  list-style: circle;
}

.hx-content ul ul ul {
  list-style: square;
}

.hx-content li::marker {
  color: var(--hx-text-muted);
}

.hx-content ol > li::marker {
  color: var(--hx-text-muted);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

/* task lists */

.hx-content .contains-task-list {
  padding-left: 0.2em;
  list-style: none;
}

.hx-content .task-list-item {
  display: flex;
  gap: 0.55em;
  align-items: flex-start;
  list-style: none;
}

.hx-content .task-list-item > input[type="checkbox"] {
  flex: 0 0 auto;
  width: 1em;
  height: 1em;
  margin: 0.42em 0 0;
  accent-color: var(--hx-accent);
  cursor: default;
}

.hx-content .task-list-item.is-checked,
.hx-content .task-list-item:has(> input:checked) {
  color: var(--hx-text-muted);
}

/* quotes, rules */

.hx-content blockquote {
  margin: 1.9em 0;
  padding: 0.15em 0 0.15em 1.15em;
  border-left: 3px solid var(--hx-accent);
  color: var(--hx-text-muted);
  font-style: italic;
}

.hx-content blockquote > :last-child {
  margin-bottom: 0;
}

.hx-content blockquote blockquote {
  margin: 0.8em 0;
  border-left-color: var(--hx-border);
}

.hx-content hr {
  height: 0;
  margin: 2.6em 0;
  border: 0;
  border-top: 1px solid var(--hx-border);
}

/* media */

.hx-content img,
.hx-content video,
.hx-content svg {
  max-width: 100%;
  height: auto;
}

.hx-content img {
  display: block;
  border-radius: var(--hx-radius);
  border: 1px solid var(--hx-border);
}

.hx-figure {
  margin: 2em 0;
}

.hx-figure img {
  width: 100%;
}

.hx-caption,
.hx-figure figcaption,
.hx-content figcaption {
  margin-top: 0.65em;
  color: var(--hx-text-muted);
  font-size: 0.84rem;
  line-height: 1.55;
  text-align: center;
}

/* tables */

.hx-table-wrap {
  margin: 1.9em 0;
  overflow-x: auto;
  border: 1px solid var(--hx-border);
  border-radius: var(--hx-radius);
  background: var(--hx-surface);
  -webkit-overflow-scrolling: touch;
}

.hx-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.93em;
  font-variant-numeric: tabular-nums;
}

.hx-content th,
.hx-content td {
  padding: 0.58em 0.85em;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--hx-border);
}

.hx-content thead th {
  background: var(--hx-surface-alt);
  border-bottom: 2px solid var(--hx-border);
  font-weight: 650;
  color: var(--hx-text);
  white-space: nowrap;
}

.hx-content tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--hx-text) 3.5%, transparent);
}

.hx-content tbody tr:hover {
  background: color-mix(in srgb, var(--hx-accent) 7%, transparent);
}

.hx-content tbody tr:last-child td {
  border-bottom: 0;
}

.hx-table-wrap > table {
  margin: 0;
}

.hx-table-wrap > table th:first-child,
.hx-table-wrap > table td:first-child {
  padding-left: 1rem;
}

/* code */

.hx-content code,
.hx-content kbd,
.hx-content samp,
.hx-content pre {
  font-family: var(--hx-font-mono);
  font-variant-ligatures: none;
}

.hx-content :not(pre) > code {
  overflow-wrap: anywhere;
  padding: 0.14em 0.4em;
  border: 1px solid var(--hx-border);
  border-radius: calc(var(--hx-radius) * 0.6);
  background: var(--hx-code-bg, var(--hx-surface-alt));
  color: var(--hx-code-text, var(--hx-text));
  font-size: 0.86em;
}

.hx-content kbd {
  padding: 0.12em 0.4em;
  border: 1px solid var(--hx-border);
  border-bottom-width: 2px;
  border-radius: calc(var(--hx-radius) * 0.6);
  background: var(--hx-surface-alt);
  font-size: 0.82em;
}

.hx-content pre,
.hx-code-block {
  position: relative;
  margin: 1.85em 0;
  padding: 1.15rem 1.25rem;
  overflow-x: auto;
  border: 1px solid var(--hx-border);
  border-radius: var(--hx-radius);
  background: var(--hx-code-bg, var(--hx-surface-alt));
  color: var(--hx-code-text, var(--hx-text));
  font-size: 0.875rem;
  line-height: 1.65;
  tab-size: 2;
  -webkit-overflow-scrolling: touch;
}

.hx-content pre > code {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-size: 1em;
  white-space: pre;
}

.hx-copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  padding: 0.28rem 0.5rem;
  border: 1px solid var(--hx-border);
  border-radius: calc(var(--hx-radius) * 0.5);
  background: var(--hx-surface);
  color: var(--hx-text-muted);
  font-family: var(--hx-font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.16s ease, transform 0.16s ease, color 0.16s ease,
    border-color 0.16s ease;
}

.hx-content pre:hover .hx-copy-btn,
.hx-content pre:focus-within .hx-copy-btn,
.hx-code-block:hover .hx-copy-btn,
.hx-copy-btn:focus-visible,
.hx-copy-btn.is-copied {
  opacity: 1;
  transform: none;
}

.hx-copy-btn:hover,
.hx-copy-btn.is-copied {
  color: var(--hx-accent);
  border-color: var(--hx-accent);
}

/* callouts */

.hx-callout {
  --hx-co: var(--hx-co-note);
  position: relative;
  margin: 1.85em 0;
  padding: 0.95rem 1.15rem;
  border: 1px solid color-mix(in srgb, var(--hx-co) 28%, var(--hx-border));
  border-left: 4px solid var(--hx-co);
  border-radius: var(--hx-radius);
  background: var(--hx-surface-alt);
  background: color-mix(in srgb, var(--hx-co) 7%, var(--hx-surface));
  color: var(--hx-text);
}

.hx-callout[data-callout="note"],
.hx-callout[data-callout="abstract"],
.hx-callout[data-callout="summary"] {
  --hx-co: var(--hx-co-note);
}

.hx-callout[data-callout="info"],
.hx-callout[data-callout="todo"],
.hx-callout[data-callout="question"],
.hx-callout[data-callout="example"] {
  --hx-co: var(--hx-co-info);
}

.hx-callout[data-callout="tip"],
.hx-callout[data-callout="hint"],
.hx-callout[data-callout="success"],
.hx-callout[data-callout="check"],
.hx-callout[data-callout="done"] {
  --hx-co: var(--hx-co-tip);
}

.hx-callout[data-callout="warning"],
.hx-callout[data-callout="caution"],
.hx-callout[data-callout="attention"] {
  --hx-co: var(--hx-co-warning);
}

.hx-callout[data-callout="danger"],
.hx-callout[data-callout="error"],
.hx-callout[data-callout="failure"],
.hx-callout[data-callout="fail"],
.hx-callout[data-callout="bug"],
.hx-callout[data-callout="missing"] {
  --hx-co: var(--hx-co-danger);
}

.hx-callout > .hx-callout-title {
  margin: 0 0 0.4em;
  color: var(--hx-co);
  font-family: var(--hx-font-body);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.hx-callout > :last-child {
  margin-bottom: 0;
}

.hx-callout > :first-child:not(.hx-callout-title) {
  margin-top: 0;
}

/* embeds / links produced by the exporter */

.hx-embed-missing {
  display: block;
  margin: 1.4em 0;
  padding: 0.85rem 1rem;
  border: 1px dashed var(--hx-border);
  border-radius: var(--hx-radius);
  background: var(--hx-surface-alt);
  color: var(--hx-text-muted);
  font-family: var(--hx-font-mono);
  font-size: 0.82rem;
  font-style: normal;
}

.hx-embed-missing::before {
  content: "\26A0  ";
  color: var(--hx-co-warning, var(--hx-accent));
}

.hx-wikilink {
  color: var(--hx-link, var(--hx-accent));
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 0.22em;
}

.hx-wikilink[data-unresolved="true"] {
  color: var(--hx-text-muted);
}

/* ---------- footer ---------- */

.hx-footer {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
  padding-top: 1.25rem;
  /* Reserve a band at the very end of the scroll range: the theme switcher is
     fixed at the bottom, so without this its pill would come to rest on top of
     the footer's last lines at maximum scroll. Sized to pill + bottom offset. */
  padding-bottom: 7rem;
  border-top: 1px solid var(--hx-border);
  color: var(--hx-text-muted);
  font-size: 0.8rem;
  line-height: 1.6;
}

.hx-footer a {
  color: var(--hx-text-muted);
}

/* ---------- floating controls ---------- */

.hx-totop {
  position: fixed;
  right: clamp(0.9rem, 2.5vw, 2rem);
  /* sit ABOVE the theme switcher: same bottom offset + pill height + gap,
     so the two fixed controls can never overlap */
  bottom: calc(clamp(0.9rem, 2.5vw, 2rem) + 3.5rem);
  z-index: 50;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid var(--hx-border);
  border-radius: 999px;
  background: var(--hx-surface);
  color: var(--hx-text-muted);
  font-size: 1rem;
  line-height: 1;
  box-shadow: var(--hx-shadow);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(0.6rem);
  transition: opacity 0.22s ease, transform 0.22s ease, color 0.16s ease,
    border-color 0.16s ease;
}

.hx-totop.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}

.hx-totop:hover {
  color: var(--hx-accent);
  border-color: var(--hx-accent);
}

.hx-theme-switcher {
  position: fixed;
  left: 50%;
  bottom: clamp(0.9rem, 2.5vw, 2rem);
  z-index: 50;
  display: flex;
  /* One row, always: eight labels must never stack into a tall band that
     covers the article. If they exceed the cap the strip scrolls instead. */
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 0.3rem;
  /* never wider than the viewport, even when every theme label is long */
  max-width: min(calc(100% - 1.6rem), 52rem);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0.35rem;
  border: 1px solid var(--hx-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--hx-surface) 88%, transparent);
  backdrop-filter: blur(10px) saturate(140%);
  box-shadow: var(--hx-shadow);
  transform: translateX(-50%);
}

.hx-theme-switcher::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.hx-theme-switcher button {
  flex: 0 0 auto;
  padding: 0.32rem 0.66rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: none;
  color: var(--hx-text-muted);
  font-family: var(--hx-font-body);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.hx-theme-switcher button:hover {
  color: var(--hx-text);
  background: var(--hx-surface-alt);
}

.hx-theme-switcher button.is-active {
  color: var(--hx-accent-contrast);
  background: var(--hx-accent);
  border-color: var(--hx-accent);
}

/* ---------- responsive ---------- */

@media (max-width: 979px) {
  .hx-toc {
    margin-bottom: 2.25rem;
    padding: 0.9rem 1rem;
    border: 1px solid var(--hx-border);
    border-radius: var(--hx-radius);
    background: var(--hx-surface-alt);
  }

  .hx-shell,
  .hx-main,
  .hx-layout,
  .hx-body {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Narrow screens: the theme switcher must stay ONE row tall. Eight labels
   never fit, so it becomes a horizontally scrollable strip instead of growing
   upward into the article text. */
@media (max-width: 720px) {
  .hx-theme-switcher {
    /* pin to both edges instead of centring a shrink-to-fit box, so the strip
       always fills the available width and never overflows the viewport */
    left: 0.8rem;
    right: 0.8rem;
    transform: none;
    width: auto;
    /* edges are pinned, so width is already viewport-bounded; clearing
       max-width avoids 100vw (which counts the scrollbar) re-introducing overflow */
    max-width: none;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    border-radius: 999px;
  }

  .hx-theme-switcher button {
    flex: 0 0 auto;
    scroll-snap-align: center;
  }

  /* the base .hx-totop offset already clears the pill; only tighten it */
  .hx-totop {
    bottom: calc(clamp(0.9rem, 2.5vw, 2rem) + 3.2rem);
  }
}

@media (max-width: 560px) {
  body {
    font-size: 1rem;
    line-height: 1.7;
  }

  .hx-content pre {
    font-size: 0.82rem;
    padding: 0.95rem 1rem;
    border-radius: calc(var(--hx-radius) * 0.8);
  }

  .hx-theme-switcher {
    bottom: 0.75rem;
    gap: 0.2rem;
    padding: 0.28rem;
  }

  .hx-footer {
    padding-bottom: 4rem;
  }

  .hx-theme-switcher button {
    padding: 0.3rem 0.5rem;
    font-size: 0.68rem;
  }

  .hx-totop {
    bottom: 4.4rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* ---------- print ---------- */

@media print {
  .hx-progress,
  .hx-toc,
  .hx-totop,
  .hx-copy-btn,
  .hx-theme-switcher {
    display: none !important;
  }

  html,
  body {
    max-width: none;
    background: #ffffff !important;
    color: #111111 !important;
    font-size: 11pt;
    line-height: 1.55;
  }

  .hx-shell {
    display: block;
    padding: 0;
  }

  .hx-content,
  .hx-content p,
  .hx-content li,
  .hx-content td,
  .hx-content th,
  .hx-content h1,
  .hx-content h2,
  .hx-content h3,
  .hx-content h4,
  .hx-content h5,
  .hx-content h6,
  .hx-content blockquote,
  .hx-content figcaption,
  .hx-header h1,
  .hx-subtitle,
  .hx-meta > *,
  .hx-footer {
    color: #111111 !important;
  }

  .hx-header h1 {
    font-size: 22pt;
  }

  .hx-badge {
    background: #111111 !important;
    color: #ffffff !important;
  }

  .hx-meta > * {
    border-color: #cccccc !important;
    background: #f6f6f6 !important;
  }

  .hx-header,
  .hx-footer,
  .hx-content h2 {
    border-color: #cccccc !important;
  }

  .hx-content a,
  .hx-wikilink {
    color: #111111 !important;
    text-decoration: underline;
  }

  .hx-content pre,
  .hx-code-block,
  .hx-content :not(pre) > code,
  .hx-content kbd {
    background: #f5f5f5 !important;
    color: #111111 !important;
    border-color: #dddddd !important;
  }

  .hx-content pre,
  .hx-code-block,
  .hx-content table,
  .hx-table-wrap,
  .hx-figure,
  .hx-callout,
  .hx-content blockquote,
  .hx-content img {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .hx-content h2,
  .hx-content h3,
  .hx-content h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  .hx-content h2 {
    break-inside: avoid;
  }

  /* ::marker / ::before pseudo-elements beat the inherited colour above,
     so muted list bullets and counters need their own print override. */
  .hx-content li::marker,
  .hx-content ol > li::marker,
  .hx-content ul li::marker,
  .hx-content small,
  .hx-content del,
  .hx-caption {
    color: #444444 !important;
  }

  .hx-content thead {
    display: table-header-group;
  }

  .hx-content tr,
  .hx-content img {
    break-inside: avoid;
  }

  .hx-table-wrap {
    border-color: #cccccc !important;
    background: #ffffff !important;
    overflow: visible;
  }

  .hx-content th,
  .hx-content td {
    border-color: #cccccc !important;
  }

  .hx-content thead th,
  .hx-content tbody tr:nth-child(even) {
    background: #f6f6f6 !important;
  }

  .hx-callout {
    background: #fafafa !important;
    border-color: #cccccc !important;
    border-left-color: #666666 !important;
  }

  .hx-embed-missing {
    border-color: #cccccc !important;
    background: #fafafa !important;
    color: #555555 !important;
  }

  .hx-content a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #555555;
    word-break: break-all;
  }
}

/* ---------- motion preferences ---------- */

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`;
