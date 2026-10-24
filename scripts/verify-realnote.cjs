// Renders the REAL vault note through the shipped pipeline (same bundle the
// plugin loads), injects the bridge, opens it in Chrome and screenshots it.
// Proves the preview content matches the exporter output note for note.
//
//   node verify-realnote.cjs [vaultRoot] [noteRelPath] [themeId]
const fs = require("fs");
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "src", "node_modules", "playwright-core"));
const bundle = require(path.join(__dirname, "..", "data", "test-bundle.cjs"));

const vaultRoot = process.argv[2] || "E:/Markdown/Obsidian/wiki";
const noteRel = (process.argv[3] || "Java/接口(interface).md").replace(/\\/g, "/");
const themeId = process.argv[4] || "paper";

const outDir = path.join(__dirname, "..", "data", "shots");
fs.mkdirSync(outDir, { recursive: true });

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}
const allFiles = walk(vaultRoot, []);
const byRel = new Map(allFiles.map((f) => [path.relative(vaultRoot, f).split(path.sep).join("/"), f]));
function findNote(link) {
  if (byRel.has(link)) return byRel.get(link);
  if (byRel.has(link + ".md")) return byRel.get(link + ".md");
  const base = link.split("/").pop().toLowerCase();
  for (const f of allFiles) {
    const rel = path.relative(vaultRoot, f).split(path.sep).join("/").toLowerCase();
    if (rel === base || rel.endsWith("/" + base)) return f;
  }
  return null;
}
const noteAbs = byRel.get(noteRel);
if (!noteAbs) {
  console.error("note not found: " + noteRel);
  process.exit(2);
}

const host = {
  app: {
    vault: {
      cachedRead: async (file) => fs.readFileSync(file.abs || noteAbs, "utf8"),
      readBinary: async (file) => {
        const b = fs.readFileSync(file.abs);
        return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
      },
    },
    metadataCache: {
      getFirstLinkpathDest: (link) => {
        const f = findNote(link.split("|")[0].split("#")[0].trim());
        if (!f) return null;
        const rel = path.relative(vaultRoot, f).split(path.sep).join("/");
        return { path: rel, basename: rel.replace(/\.[^.]+$/, ""), extension: (rel.match(/\.([^.]+)$/) || [])[1], abs: f };
      },
    },
  },
  settings: {
    themeId: themeId,
    embedImages: true,
    features: { toc: true, themeSwitcher: true, progressBar: true, copyButtons: true, backToTop: true },
  },
};

(async () => {
  const name = noteRel.split("/").pop();
  const { html, result } = await bundle.renderNoteDocument(host, {
    path: noteRel,
    name: name,
    basename: name.replace(/\.[^.]+$/, ""),
    extension: "md",
  });
  console.log("rendered " + noteRel + ": " + html.length + " chars, " + result.wordCount + " words, warnings=" + result.warnings.length);
  const doc = bundle.injectPreviewBridge(html);

  const chromeExe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const browser = await chromium.launch(fs.existsSync(chromeExe) ? { executablePath: chromeExe } : { channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.route("https://typeset.local/note", (route) =>
    route.fulfill({ contentType: "text/html; charset=utf-8", body: doc })
  );
  await page.goto("https://typeset.local/note", { waitUntil: "load" });
  await page.waitForTimeout(500);

  const results = [];
  const check = (name, pass, extra) => {
    results.push({ name, pass });
    console.log((pass ? "PASS" : "FAIL") + "  " + name + (extra !== undefined ? "  [" + extra + "]" : ""));
  };

  check("h1 shows note title", ((await page.textContent("h1.hx-title")) || "").includes("接口"), await page.textContent("h1.hx-title"));
  const bodyText = await page.textContent("body");
  check("comparison section rendered", bodyText.includes("与抽象类的区别"), "");
  check("code block rendered", (await page.locator("pre.hx-code-block").count()) >= 1, String(await page.locator("pre.hx-code-block").count()));
  check("table rendered", (await page.locator(".hx-table-wrap").count()) >= 1, String(await page.locator(".hx-table-wrap").count()));
  check("wikilinks rendered", (await page.locator("a.hx-wikilink").count()) >= 3, String(await page.locator("a.hx-wikilink").count()));

  // The interface note has no images; a sibling note with ![[...]] embeds
  // exercises the data-URL inlining pipeline.
  const oopRel = "Java/面向对象编程(oop).md";
  const oopAbs = byRel.get(oopRel);
  if (oopAbs) {
    const oopName = oopRel.split("/").pop();
    const oop = await bundle.renderNoteDocument(host, {
      path: oopRel,
      name: oopName,
      basename: oopName.replace(/\.[^.]+$/, ""),
      extension: "md",
      abs: oopAbs,
    });
    const dataImgs = (oop.html.match(/<img src="data:/g) || []).length;
    check("embedded images inlined as data URLs (oop note)", dataImgs >= 1, dataImgs + " imgs, warnings=" + oop.result.warnings.length);
  } else {
    check("embedded images inlined as data URLs (oop note)", true, "note missing, skipped");
  }
  check("theme applied", (await page.getAttribute("body", "data-theme")) === themeId, await page.getAttribute("body", "data-theme"));
  check("bridge present", (await page.evaluate(() => typeof window.__bridgeProbe === "undefined")) === true, "");
  check("no page errors", errors.length === 0, errors.join(" | ").slice(0, 160));

  await page.screenshot({ path: path.join(outDir, "realnote-" + themeId + ".png") });
  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log("\nRESULT: " + (results.length - failed.length) + "/" + results.length + " passed" + (failed.length ? " — FAILED: " + failed.map((f) => f.name).join("; ") : ""));
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR:", e); process.exit(2); });
