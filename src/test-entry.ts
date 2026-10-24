/**
 * Second bundle entry used only by the offline/browser verification scripts.
 * It re-exports the renderer and the bridge so tests exercise exactly the
 * code the plugin ships, without needing the obsidian runtime.
 */
export { describeError, renderNoteDocument } from "./renderdoc";
export type { RenderHost, RenderedNote } from "./renderdoc";
export { injectPreviewBridge, PREVIEW_BRIDGE_JS } from "./bridge";
