// Bundles src/main.ts -> ./main.js (CommonJS), which Obsidian loads via require().
// Also builds the verification bundle into data/ (gitignored) used by the
// scripts/ verification harness.
import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes("--watch");

const options = {
  entryPoints: [resolve(root, "src", "main.ts")],
  outfile: resolve(root, "main.js"),
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: ["es2018"],
  // Provided by the Obsidian runtime, never bundled.
  external: ["obsidian", "electron", "@codemirror/*", "@lezer/*"],
  logLevel: "info",
  sourcemap: false,
  minify: false,
  legalComments: "none",
};

const testOptions = {
  entryPoints: [resolve(root, "src", "test-entry.ts")],
  outfile: resolve(root, "data", "test-bundle.cjs"),
  bundle: true,
  format: "cjs",
  platform: "node",
  target: ["es2018"],
  logLevel: "info",
  sourcemap: false,
  minify: false,
  legalComments: "none",
};

async function run() {
  await esbuild.build(options);
  mkdirSync(resolve(root, "data"), { recursive: true });
  await esbuild.build(testOptions);
}

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("[build] watching...");
} else {
  await run();
}
