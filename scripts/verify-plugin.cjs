// Offline verification: loads the built main.js exactly like Obsidian does
// (CommonJS require + mod.default), then drives commands, the preview view and
// the follow / live-refresh routing against a read-only mock over a real vault.
//
//   node verify-plugin.cjs [pluginDir] [vaultRoot] [noteRelPath]
const fs = require("fs");
const path = require("path");
const Module = require("module");

const root = path.join(__dirname, "..");
const pluginDir = process.argv[2] || path.join(root, "data", "plugin", "typeset-live");
const vaultRoot = process.argv[3] || "E:\\Markdown\\Obsidian\\wiki";
const noteRel = (process.argv[4] || "Java/接口(interface).md").replace(/\\/g, "/");

const mockPath = path.join(__dirname, "mock-obsidian.cjs");
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request) {
  if (request === "obsidian") return mockPath;
  return origResolve.apply(this, arguments);
};
const { TFile } = require(mockPath);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- real vault, read-only -------------------------------------------------
function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}
const allFiles = walk(vaultRoot, []).map((abs) => ({
  abs,
  rel: path.relative(vaultRoot, abs).split(path.sep).join("/"),
}));
const byRel = new Map(allFiles.map((f) => [f.rel, f]));
function findNote(link) {
  if (byRel.has(link)) return byRel.get(link);
  if (byRel.has(link + ".md")) return byRel.get(link + ".md");
  const base = link.split("/").pop().toLowerCase();
  for (const f of allFiles) {
    const lower = f.rel.toLowerCase();
    if (lower === base || lower.endsWith("/" + base)) return f;
  }
  return null;
}
const makeTFile = (rel) => {
  const f = byRel.get(rel);
  return f ? Object.assign(new TFile(rel), { abs: f.abs }) : null;
};

// ---- mock app --------------------------------------------------------------
const handlers = {};
const leaves = [];
const openedNotes = [];
let currentActive = null;

const app = {
  vault: {
    cachedRead: async (file) => fs.readFileSync(file.abs, "utf8"),
    readBinary: async (file) => {
      const b = fs.readFileSync(file.abs);
      return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    },
    on: (name, cb) => { (handlers["vault:" + name] = handlers["vault:" + name] || []).push(cb); return {}; },
    getAbstractFileByPath: (p) => (byRel.has(p) ? new TFile(p) : null),
  },
  metadataCache: {
    getFirstLinkpathDest: (link) => {
      const f = findNote(link);
      return f ? Object.assign(new TFile(f.rel), { abs: f.abs }) : null;
    },
  },
  workspace: {
    getActiveFile: () => currentActive,
    on: (name, cb) => { (handlers["ws:" + name] = handlers["ws:" + name] || []).push(cb); return {}; },
    getLeavesOfType: (type) => leaves.filter((l) => l.viewType === type),
    getLeaf: () => {
      const leaf = {
        app,
        viewType: null,
        view: null,
        async setViewState(state) {
          this.viewType = state.type;
          const factory = plugin._viewFactories && plugin._viewFactories[state.type];
          if (!factory) throw new Error("view not registered: " + state.type);
          this.view = factory(this);
          await this.view.load();
        },
      };
      leaves.push(leaf);
      return leaf;
    },
    setActiveLeaf: () => {},
    openLinkText: (note) => {
      openedNotes.push(note);
      const f = findNote(note);
      if (f) currentActive = Object.assign(new TFile(f.rel), { abs: f.abs });
    },
  },
};

// ---- load the plugin exactly like Obsidian --------------------------------
const mod = require(path.join(pluginDir, "main.js"));
const manifest = JSON.parse(fs.readFileSync(path.join(pluginDir, "manifest.json"), "utf8"));
const PluginClass = mod && mod.default ? mod.default : mod;
const plugin = new PluginClass(app, manifest);

const results = [];
const check = (name, pass, extra) => {
  results.push({ name, pass });
  console.log((pass ? "PASS" : "FAIL") + "  " + name + (extra !== undefined ? "  [" + extra + "]" : ""));
};

(async () => {
  await plugin.onload();
  check("module exports plugin class via default", typeof PluginClass === "function");
  check("3 commands registered", (plugin._commands || []).length === 3, (plugin._commands || []).map((c) => c.id).join(","));
  check("ribbon icon registered", (plugin._ribbons || []).length === 1);
  check("settings tab registered", (plugin._settingTabs || []).length === 1);
  check("view factory registered", !!(plugin._viewFactories && plugin._viewFactories["typeset-live-preview"]));

  // open the preview for a real vault note
  const noteFile = makeTFile(noteRel);
  check("target note exists in vault", !!noteFile, noteRel);
  currentActive = noteFile;
  await plugin.openPreview();
  const leaf = leaves.find((l) => l.viewType === "typeset-live-preview");
  check("preview leaf opened as a tab", !!leaf);
  const view = leaf && leaf.view;
  check("view exposes show/refresh", !!view && typeof view.show === "function" && typeof view.refresh === "function");
  const srcdoc = view.frame ? String(view.frame.srcdoc || "") : "";
  check("iframe srcdoc rendered", srcdoc.length > 2000, srcdoc.length + " chars");
  check("srcdoc contains note title", srcdoc.includes("<title>接口(interface)</title>"), "");
  check("srcdoc contains bridge", srcdoc.includes("preview-ready"));
  check("srcdoc contains themed shell", srcdoc.includes('data-theme="paper"'));
  check("theme dropdown has 8 options", view.themeSelect ? view.themeSelect.children.length === 8 : false, view.themeSelect ? view.themeSelect.children.length : "none");
  check("iframe is sandboxed allow-scripts", view.frame ? view.frame.getAttribute("sandbox") === "allow-scripts" : false, view.frame ? view.frame.getAttribute("sandbox") : "none");

  // follow: switching the active note re-renders the preview after debounce
  const oopRel = "Java/面向对象编程(oop).md";
  const oopFile = makeTFile(oopRel);
  check("second note exists", !!oopFile, oopRel);
  currentActive = oopFile;
  (handlers["ws:active-leaf-change"] || []).forEach((cb) => cb({ view: { getViewType: () => "markdown" } }));
  await sleep(500);
  check("preview follows active note", String(view.frame.srcdoc).includes("<title>面向对象编程(oop)</title>"), "");

  // live edit: editor-change on the previewed note re-renders it
  (handlers["ws:editor-change"] || []).forEach((cb) => cb({}, { file: oopFile }));
  await sleep(900);
  check("editor-change re-renders without error", String(view.frame.srcdoc).includes("<title>面向对象编程(oop)</title>"), "");

  // vault modify on the previewed note also refreshes
  (handlers["vault:modify"] || []).forEach((cb) => cb(oopFile));
  await sleep(900);
  check("vault modify re-renders without error", String(view.frame.srcdoc).length > 2000, "");

  // follow off: switching notes must NOT change the preview
  await plugin.toggleFollow();
  check("toggleFollow switches follow off", plugin.settings.followActiveNote === false);
  currentActive = noteFile;
  (handlers["ws:active-leaf-change"] || []).forEach((cb) => cb({ view: { getViewType: () => "markdown" } }));
  await sleep(500);
  check("preview stays when follow is off", String(view.frame.srcdoc).includes("<title>面向对象编程(oop)</title>"));
  await plugin.toggleFollow();
  // turning follow back on shows the active note again
  await sleep(100);
  check("toggleFollow back on follows current note", String(view.frame.srcdoc).includes("<title>接口(interface)</title>"));

  // clicking into the preview itself must not re-route the preview
  (handlers["ws:active-leaf-change"] || []).forEach((cb) => cb({ view: { getViewType: () => "typeset-live-preview" } }));
  await sleep(400);
  check("preview leaf activation ignored", String(view.frame.srcdoc).includes("<title>接口(interface)</title>"));

  // refresh command
  const refreshCmd = (plugin._commands || []).find((c) => c.id === "refresh-preview");
  refreshCmd.callback();
  await sleep(300);
  check("refresh command re-renders", String(view.frame.srcdoc).length > 2000, "");

  const failed = results.filter((r) => !r.pass);
  console.log("\nRESULT: " + (results.length - failed.length) + "/" + results.length + " passed" + (failed.length ? " — FAILED: " + failed.map((f) => f.name).join("; ") : ""));
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error("HARNESS ERROR:", e);
  process.exit(2);
});
