import { ItemView, Notice, setIcon, TFile, WorkspaceLeaf } from "obsidian";
import { injectPreviewBridge } from "./bridge";
import type TypesetLivePlugin from "./main";
import { describeError, renderNoteDocument } from "./renderdoc";
import { THEMES } from "./themes";

export const VIEW_TYPE = "typeset-live-preview";

/**
 * Workspace tab that renders the current note as a standalone web page and
 * shows it inside Obsidian via a sandboxed srcdoc iframe.
 */
export class TypesetLiveView extends ItemView {
  private readonly plugin: TypesetLivePlugin;
  private frame: HTMLIFrameElement | null = null;
  private themeSelect: HTMLSelectElement | null = null;
  private followBtn: HTMLButtonElement | null = null;
  private deviceBtn: HTMLButtonElement | null = null;
  private statusEl: HTMLElement | null = null;
  private currentFile: TFile | null = null;
  private lastScrollY = 0;
  private mobile = false;
  private renderSeq = 0;

  constructor(leaf: WorkspaceLeaf, plugin: TypesetLivePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "网页预览";
  }

  getIcon(): string {
    return "globe";
  }

  async onOpen(): Promise<void> {
    const root = this.contentEl;
    root.empty();
    root.addClass("typeset-live-view");

    const bar = root.createDiv({ cls: "typeset-live-toolbar" });

    const themeWrap = bar.createDiv({ cls: "typeset-live-toolbar-item" });
    themeWrap.createSpan({ cls: "typeset-live-toolbar-label", text: "主题" });
    this.themeSelect = themeWrap.createEl("select", { cls: "typeset-live-theme-select" });
    for (const theme of THEMES) {
      const option = this.themeSelect.createEl("option");
      option.value = theme.id;
      option.textContent = theme.name;
    }
    this.themeSelect.value = this.plugin.settings.themeId;
    this.themeSelect.addEventListener("change", () => {
      const id = this.themeSelect ? this.themeSelect.value : "";
      this.plugin.settings.themeId = id;
      void this.plugin.saveSettings();
      this.postToFrame({ type: "set-theme", id });
    });

    const refreshBtn = bar.createEl("button", {
      cls: "typeset-live-icon-btn",
      attr: { type: "button", title: "重新渲染", "aria-label": "重新渲染" },
    });
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.addEventListener("click", () => this.refresh());

    this.followBtn = bar.createEl("button", {
      cls: "typeset-live-icon-btn",
      attr: { type: "button", title: "跟随当前笔记", "aria-label": "跟随当前笔记" },
    });
    this.followBtn.addEventListener("click", () => void this.plugin.toggleFollow());
    this.updateFollowButton();

    this.deviceBtn = bar.createEl("button", {
      cls: "typeset-live-icon-btn",
      attr: { type: "button", title: "手机宽度 / 全宽", "aria-label": "手机宽度 / 全宽" },
    });
    const deviceBtn = this.deviceBtn;
    setIcon(deviceBtn, "smartphone");
    deviceBtn.addEventListener("click", () => {
      this.mobile = !this.mobile;
      root.classList.toggle("typeset-live-mobile", this.mobile);
      setIcon(deviceBtn, this.mobile ? "monitor" : "smartphone");
    });

    this.statusEl = bar.createSpan({ cls: "typeset-live-status", text: "" });

    this.frame = root.createEl("iframe", {
      cls: "typeset-live-frame",
      attr: { title: "Typeset Live preview", sandbox: "allow-scripts" },
    });

    this.registerDomEvent(window, "message", (event: MessageEvent) => this.onFrameMessage(event));

    const file = this.app.workspace.getActiveFile();
    if (file) {
      await this.show(file);
    } else {
      this.showEmpty("还没有可预览的笔记——打开一篇笔记后，点工具栏里的刷新或重新执行命令。");
    }
  }

  async onClose(): Promise<void> {
    this.frame = null;
    this.contentEl.empty();
  }

  /** The note currently shown; the plugin routes edit events through this. */
  get file(): TFile | null {
    return this.currentFile;
  }

  /** Render a note into the frame. Same-path calls are no-ops unless forced. */
  async show(file: TFile | null, force = false): Promise<void> {
    if (!file) {
      this.currentFile = null;
      this.lastScrollY = 0;
      this.showEmpty("没有可预览的笔记。");
      return;
    }
    if (!force && this.currentFile && this.currentFile.path === file.path) return;
    if (!this.currentFile || this.currentFile.path !== file.path) this.lastScrollY = 0;
    this.currentFile = file;

    const seq = ++this.renderSeq;
    this.setStatus("渲染中… " + file.basename);
    try {
      const { html, result } = await renderNoteDocument(this.plugin, file, this.plugin.settings.themeId);
      if (seq !== this.renderSeq || !this.frame) return;
      if (this.themeSelect) this.themeSelect.value = this.plugin.settings.themeId;
      this.frame.srcdoc = injectPreviewBridge(html);
      const warn = result.warnings.length > 0 ? " · " + result.warnings.length + " 个警告" : "";
      this.setStatus(file.basename + warn);
    } catch (error) {
      if (seq !== this.renderSeq) return;
      this.showEmpty("渲染失败：" + describeError(error));
    }
  }

  /** Re-render the current note, keeping the scroll position. */
  refresh(): void {
    if (this.currentFile) void this.show(this.currentFile, true);
  }

  /** Push a theme change into the page without re-rendering (keeps scroll). */
  applyThemeFromSettings(): void {
    if (this.themeSelect) this.themeSelect.value = this.plugin.settings.themeId;
    this.postToFrame({ type: "set-theme", id: this.plugin.settings.themeId });
  }

  updateFollowButton(): void {
    if (!this.followBtn) return;
    const on = this.plugin.settings.followActiveNote;
    this.followBtn.classList.toggle("is-pressed", on);
    this.followBtn.setAttribute("title", on ? "跟随当前笔记：开" : "跟随当前笔记：关");
    setIcon(this.followBtn, on ? "link" : "unlink");
  }

  private showEmpty(message: string): void {
    if (!this.frame) return;
    this.frame.srcdoc = emptyDoc(message);
    this.setStatus("—");
  }

  private setStatus(text: string): void {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  private postToFrame(message: unknown): void {
    const target = this.frame ? this.frame.contentWindow : null;
    if (target) target.postMessage(message, "*");
  }

  private onFrameMessage(event: MessageEvent): void {
    if (!this.frame || event.source !== this.frame.contentWindow) return;
    const data = event.data as { type?: unknown; [key: string]: unknown };
    if (!data || typeof data !== "object" || typeof data.type !== "string") return;

    switch (data.type) {
      case "preview-ready":
        if (this.lastScrollY > 0) this.postToFrame({ type: "scroll-to", y: this.lastScrollY });
        break;
      case "preview-scroll":
        this.lastScrollY = Number(data.y) || 0;
        break;
      case "theme-changed":
        if (typeof data.id === "string" && data.id.length > 0) {
          this.plugin.settings.themeId = data.id;
          void this.plugin.saveSettings();
          if (this.themeSelect) this.themeSelect.value = data.id;
        }
        break;
      case "open-note": {
        const note = String(data.note ?? "");
        if (note) void this.app.workspace.openLinkText(note, "", false);
        break;
      }
      case "open-external": {
        const url = String(data.url ?? "");
        if (/^(https?:|obsidian:|mailto:)/i.test(url)) {
          const opened = window.open(url, "_blank");
          if (!opened) new Notice("无法打开外部链接：" + url);
        }
        break;
      }
      case "copy-code": {
        const text = String(data.text ?? "");
        void copyThroughHost(
          text,
          () => this.postToFrame({ type: "copy-done", ok: true }),
          () => this.postToFrame({ type: "copy-done", ok: false })
        );
        break;
      }
    }
  }
}

/** Copy text from the host context; the sandboxed frame cannot. */
function copyThroughHost(text: string, onDone: () => void, onFail: () => void): Promise<void> {
  const fallback = (): void => {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (ok) onDone();
      else onFail();
    } catch {
      onFail();
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(onDone, fallback);
  }
  fallback();
  return Promise.resolve();
}

function emptyDoc(message: string): string {
  const safe = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    "<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;" +
    "background:#f8f8f6;color:#8b8b85;font-family:system-ui,-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;" +
    "font-size:14px;line-height:1.8;padding:24px;text-align:center}</style></head><body><div>" +
    safe +
    "</div></body></html>"
  );
}
