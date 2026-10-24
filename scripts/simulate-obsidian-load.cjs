/**
 * Simulates Obsidian's plugin bootstrap for the vault, matching the real
 * loader's behaviour: iterate every manifest.json under .obsidian/plugins and
 * load each whose manifest id is enabled in community-plugins.json.
 *
 *   node simulate-obsidian-load.cjs <vaultRoot>
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");

const vault = process.argv[2];
// Plugins whose bundles touch the renderer DOM at require() time cannot load
// outside a real Obsidian window; list them explicitly so they show as SKIP
// instead of poisoning the result. Example: --skip=obsidian-excalidraw-plugin
const skipArg = (process.argv.find((a) => a.startsWith("--skip=")) || "").slice(7);
const skip = new Set(skipArg ? skipArg.split(",") : []);
if (!vault) {
  console.error("usage: node simulate-obsidian-load.cjs <vaultRoot> [--skip=id,id]");
  process.exit(2);
}

const mockPath = path.join(__dirname, "mock-obsidian.cjs");
// The real Obsidian app bundles and provides @codemirror/* and @lezer/* to
// plugins; stub them so third-party bundles that rely on the host resolve too.
const stubPath = path.join(__dirname, "stub-module.cjs");
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request) {
  if (request === "obsidian") return mockPath;
  if (/^@codemirror\//.test(request) || /^@lezer\//.test(request)) return stubPath;
  return origResolve.apply(this, arguments);
};

const pluginsDir = path.join(vault, ".obsidian", "plugins");
const enabled = JSON.parse(fs.readFileSync(path.join(vault, ".obsidian", "community-plugins.json"), "utf8"));
console.log("enabled plugin ids: " + JSON.stringify(enabled));

let failures = 0;

(async () => {
  for (const entry of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(pluginsDir, entry.name);
    const manifestPath = path.join(dir, "manifest.json");
    if (!fs.existsSync(manifestPath)) continue;
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (e) {
      console.log("[" + entry.name + "] FAIL: manifest.json is not valid JSON - " + e.message);
      failures++;
      continue;
    }
    process.stdout.write("[" + entry.name + " -> " + manifest.id + "] ");
    if (!enabled.includes(manifest.id)) {
      console.log("skipped (disabled)");
      continue;
    }
    if (skip.has(manifest.id)) {
      console.log("SKIP (renderer-DOM bundle, cannot load outside Obsidian; unrelated to other plugins)");
      continue;
    }
    const mainPath = path.join(dir, "main.js");
    if (!fs.existsSync(mainPath)) {
      console.log("FAIL: main.js missing");
      failures++;
      continue;
    }
    let mod;
    try {
      mod = require(mainPath);
    } catch (e) {
      console.log("FAIL: require() threw -> " + e.constructor.name + ": " + e.message.split("\n")[0]);
      failures++;
      continue;
    }
    const PluginClass = mod && mod.default ? mod.default : mod;
    if (typeof PluginClass !== "function") {
      console.log("FAIL: module does not export a class");
      failures++;
      continue;
    }
    const app = {
      vault: { on: () => ({}), cachedRead: async () => "" },
      metadataCache: { on: () => ({}) },
      workspace: { getActiveFile: () => null, on: () => ({}), getLeavesOfType: () => [], onLayoutReady: (cb) => cb() },
    };
    const plugin = new PluginClass(app, manifest);
    try {
      await plugin.onload();
      console.log("OK: loaded " + manifest.name + " v" + manifest.version +
        " (commands=" + ((plugin._commands || []).length) +
        ", ribbon=" + ((plugin._ribbons || []).length) +
        ", settingsTab=" + ((plugin._settingTabs || []).length) + ")");
    } catch (e) {
      console.log("FAIL: onload() threw -> " + e.constructor.name + ": " + e.message.split("\n")[0]);
      failures++;
    }
  }

  console.log("\n" + (failures === 0 ? "RESULT: all enabled plugins load cleanly" : "RESULT: " + failures + " plugin(s) failed to load"));
  process.exit(failures === 0 ? 0 : 1);
})();
