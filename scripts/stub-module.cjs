// Host-provided module stub for the offline loader simulation.
// Mirrors Obsidian bundling @codemirror/* and @lezer/* into the app: plugins
// require them without shipping their own copies. The stub only has to exist;
// third-party onload() paths that actually call into these APIs are out of
// scope for the simulation.
module.exports = new Proxy({}, {
  get(target, prop) {
    if (prop === "__esModule") return true;
    return new Proxy(function stub() {}, {
      get: () => function stub() {},
      apply: () => undefined,
      construct: () => ({}),
    });
  },
});
