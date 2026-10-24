// Browser verification of the preview bridge: renders a sample note with the
// exact shipped pipeline, injects the bridge exactly like the view does, loads
// the document into real Chrome and checks the postMessage contract end to end.
//
//   node verify-bridge.cjs
const fs = require("fs");
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "src", "node_modules", "playwright-core"));
const bundle = require(path.join(__dirname, "..", "data", "test-bundle.cjs"));

const outDir = path.join(__dirname, "..", "data", "shots");
fs.mkdirSync(outDir, { recursive: true });

const SAMPLE_MD = [
  "---",
  "tags: [java, note]",
  "---",
  "",
  "# 接口(interface) 测试样张",
  "",
  "## 概念",
  "",
  "接口是……参见 [[面向对象编程(oop)]] 与 [[Java(java)|Java 语言概述]]，外部资料看 [DeepSeek](https://example.com/deepseek) 与 [相对链接](./封装(encapsulation).md)。",
  "",
  "> [!tip] 提示",
  "> 接口中的变量默认是 public static final。",
  "",
  "```java",
  "interface Animal {",
  "    void eat();",
  "}",
  "```",
  "",
  "| 特性 | 接口 | 抽象类 |",
  "| --- | --- | --- |",
  "| 实例化 | 不能 | 不能 |",
  "",
  "## 长文滚动测试",
  "",
  "段落一：接口不能实例化，接口没有构造方法。",
  "段落二：一个类可以实现多个接口，弥补单继承的不足。",
  "段落三：接口中的变量默认是 public static final。",
  "段落四：JDK 8 以后接口可以包含默认方法与静态方法。",
  "段落五：面向对象三大特性是封装、继承、多态。",
  "段落六：抽象类用于模板设计，接口用于能力约定。",
  "段落七：多态的前提是继承或实现，以及方法重写。",
  "段落八：组合优于继承，接口隔离原则提醒我们保持小接口。",
  "",
].join("\n");

const host = {
  app: {
    vault: {
      cachedRead: async () => SAMPLE_MD,
      readBinary: async () => { throw new Error("no embeds in sample"); },
    },
    metadataCache: { getFirstLinkpathDest: () => null },
  },
  settings: {
    themeId: "paper",
    embedImages: true,
    features: { toc: true, themeSwitcher: true, progressBar: true, copyButtons: true, backToTop: true },
  },
};

(async () => {
  const { html } = await bundle.renderNoteDocument(host, {
    path: "测试/样张.md",
    name: "样张.md",
    basename: "样张",
    extension: "md",
  });
  const doc = bundle.injectPreviewBridge(html);

  const chromeExe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const browser = await chromium.launch(fs.existsSync(chromeExe) ? { executablePath: chromeExe } : { channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.addInitScript(() => {
    window.__msgs = [];
    window.addEventListener("message", (e) => {
      if (e && e.data && typeof e.data.type === "string") window.__msgs.push(e.data);
    });
  });
  // NOTE: addInitScript does not run for setContent in this playwright-core
  // build (verified by probe-init.cjs), so serve the document over a route.
  await page.route("https://typeset.local/sample", (route) =>
    route.fulfill({ contentType: "text/html; charset=utf-8", body: doc })
  );
  await page.goto("https://typeset.local/sample", { waitUntil: "load" });
  await page.waitForTimeout(400);

  const results = [];
  const check = (name, pass, extra) => {
    results.push({ name, pass });
    console.log((pass ? "PASS" : "FAIL") + "  " + name + (extra !== undefined ? "  [" + extra + "]" : ""));
  };
  const msgs = () => page.evaluate(() => window.__msgs);

  const m1 = await msgs();
  check("bridge reports preview-ready on load", m1.some((m) => m.type === "preview-ready"));

  await page.click(".hx-wikilink >> nth=0");
  await page.waitForTimeout(200);
  const m2 = await msgs();
  const openNote = m2.filter((m) => m.type === "open-note").pop();
  check("wikilink click sends open-note", !!openNote && openNote.note === "面向对象编程(oop)", openNote ? openNote.note : "none");
  check("wikilink navigation prevented", page.url() === "https://typeset.local/sample", page.url());

  await page.click('a[href^="https"]');
  await page.waitForTimeout(200);
  const m3 = await msgs();
  const ext = m3.filter((m) => m.type === "open-external").pop();
  check("external link sends open-external", !!ext && ext.url === "https://example.com/deepseek", ext ? ext.url : "none");

  await page.click('a[href$=".md"]');
  await page.waitForTimeout(200);
  const m4 = await msgs();
  const rel = m4.filter((m) => m.type === "open-note").pop();
  check("relative md link becomes open-note", !!rel && rel.note === "封装(encapsulation)", rel ? rel.note : "none");

  await page.evaluate(() => window.postMessage({ type: "set-theme", id: "terminal" }, "*"));
  await page.waitForTimeout(200);
  const themeNow = await page.getAttribute("body", "data-theme");
  check("set-theme switches body theme", themeNow === "terminal", themeNow);
  const label = ((await page.textContent("[data-theme-name]")) || "").trim();
  check("footer theme label follows", label === "Terminal", label);

  await page.screenshot({ path: path.join(outDir, "sample-terminal.png") });

  await page.click('.hx-theme-btn[data-theme="github"]');
  await page.waitForTimeout(200);
  const m6 = await msgs();
  const changed = m6.filter((m) => m.type === "theme-changed").pop();
  check("in-page switcher notifies host", !!changed && changed.id === "github", changed ? changed.id : "none");
  check("in-page switcher applied theme", (await page.getAttribute("body", "data-theme")) === "github", await page.getAttribute("body", "data-theme"));

  await page.click(".hx-copy-btn >> nth=0");
  await page.waitForTimeout(200);
  const m7 = await msgs();
  const copy = m7.filter((m) => m.type === "copy-code").pop();
  check("copy click routed to host", !!copy && String(copy.text).includes("interface Animal"), copy ? JSON.stringify(copy.text).slice(0, 40) : "none");
  await page.evaluate(() => window.postMessage({ type: "copy-done", ok: true }, "*"));
  await page.waitForTimeout(100);
  const btnText = ((await page.textContent(".hx-copy-btn >> nth=0")) || "").trim();
  check("copy-done flashes button", btnText === "Copied!", btnText);

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(400);
  const m8 = await msgs();
  const scroll = m8.filter((m) => m.type === "preview-scroll").pop();
  check("scroll reported to host", !!scroll && Number(scroll.y) > 300, scroll ? String(scroll.y) : "none");
  // BASE_CSS uses smooth scrolling; wait for the animation to settle.
  await page.evaluate(() => window.postMessage({ type: "scroll-to", y: 120 }, "*"));
  await page.waitForTimeout(900);
  const y = await page.evaluate(() => window.pageYOffset);
  check("scroll-to restores position", Math.abs(y - 120) < 2, String(y));

  check("no page errors", errors.length === 0, errors.join(" | ").slice(0, 200));

  await page.screenshot({ path: path.join(outDir, "sample-github.png") });
  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log("\nRESULT: " + (results.length - failed.length) + "/" + results.length + " passed" + (failed.length ? " — FAILED: " + failed.map((f) => f.name).join("; ") : ""));
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR:", e); process.exit(2); });
