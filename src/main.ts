import {
  Editor,
  MarkdownFileInfo,
  MarkdownView,
  Notice,
  Plugin,
  TAbstractFile,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import { DEFAULT_SETTINGS, TypesetLiveSettingTab } from "./settings";
import type { LivePreviewSettings } from "./types";
import { TypesetLiveView, VIEW_TYPE } from "./view";

const LIVE_EDIT_DELAY_MS = 600;
const LEAF_SWITCH_DELAY_MS = 200;

/** Obsidian entry point: preview view, commands, ribbon icon and settings. */
export default class TypesetLivePlugin extends Plugin {
  /** Never aliases DEFAULT_SETTINGS, so writes cannot leak into the defaults. */
  settings: LivePreviewSettings = {
    ...DEFAULT_SETTINGS,
    features: { ...DEFAULT_SETTINGS.features },
  };

  private editTimer: number | null = null;
  private leafTimer: number | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addSettingTab(new TypesetLiveSettingTab(this.app, this));
    this.registerView(VIEW_TYPE, (leaf: WorkspaceLeaf) => new TypesetLiveView(leaf, this));

    this.addRibbonIcon("globe", "打开当前笔记的网页预览", () => void this.openPreview());

    this.addCommand({
      id: "open-preview",
      name: "打开当前笔记的网页预览",
      callback: () => void this.openPreview(),
    });

    this.addCommand({
      id: "refresh-preview",
      name: "刷新网页预览",
      callback: () => this.activeView()?.refresh(),
    });

    this.addCommand({
      id: "toggle-follow",
      name: "切换「跟随当前笔记」",
      callback: () => void this.toggleFollow(),
    });

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => this.onActiveLeafChange(leaf))
    );
    this.registerEvent(
      this.app.workspace.on("editor-change", (editor: Editor, info: MarkdownView | MarkdownFileInfo) =>
        this.onLiveEdit(info)
      )
    );
    this.registerEvent(this.app.vault.on("modify", (file: TAbstractFile) => this.onVaultModify(file)));
    this.registerEvent(
      this.app.vault.on("rename", (file: TAbstractFile, oldPath: string) => this.onVaultRename(file, oldPath))
    );
    this.registerEvent(this.app.vault.on("delete", (file: TAbstractFile) => this.onVaultDelete(file)));
  }

  async loadSettings(): Promise<void> {
    const stored = (await this.loadData()) as Partial<LivePreviewSettings> | null;
    const merged = Object.assign({}, DEFAULT_SETTINGS, stored ?? {});
    // Features live one level deeper, so merge them separately to survive
    // data.json files written by an older version.
    merged.features = Object.assign({}, DEFAULT_SETTINGS.features, (stored && stored.features) || {});
    this.settings = merged as LivePreviewSettings;
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  /** The single live preview view, if one is open. */
  activeView(): TypesetLiveView | null {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length === 0) return null;
    const view = leaves[0].view;
    return view instanceof TypesetLiveView ? view : null;
  }

  /** Open (or reveal) the preview tab and render the active note in it. */
  async openPreview(): Promise<void> {
    // Capture the file first: once the preview leaf activates it is no longer
    // backed by an editor and getActiveFile() may return null.
    const file = this.app.workspace.getActiveFile();

    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    let leaf: WorkspaceLeaf;
    if (existing.length > 0) {
      leaf = existing[0];
    } else {
      leaf = await this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.setActiveLeaf(leaf, { focus: false });

    const view = leaf.view;
    if (view instanceof TypesetLiveView) {
      if (file) await view.show(file);
      else new Notice("当前没有打开的笔记。");
    }
  }

  /** Toggle follow mode (toolbar / command) and sync the button state. */
  async toggleFollow(): Promise<void> {
    this.settings.followActiveNote = !this.settings.followActiveNote;
    await this.saveSettings();
    this.activeView()?.updateFollowButton();
    new Notice(
      this.settings.followActiveNote ? "网页预览：跟随当前笔记（已开）" : "网页预览：跟随当前笔记（已关）"
    );
    if (this.settings.followActiveNote) {
      const file = this.app.workspace.getActiveFile();
      if (file) await this.activeView()?.show(file);
    }
  }

  /** Called from the settings tab after a theme change. */
  pushThemeToView(): void {
    this.activeView()?.applyThemeFromSettings();
  }

  /** Called from the settings tab after feature / image changes. */
  refreshView(): void {
    this.activeView()?.refresh();
  }

  private isPreviewLeaf(leaf: WorkspaceLeaf | null): boolean {
    const view = leaf ? leaf.view : undefined;
    if (!view) return false;
    const getter = (view as unknown as { getViewType?: unknown }).getViewType;
    return typeof getter === "function" && (getter as () => string).call(view) === VIEW_TYPE;
  }

  private onActiveLeafChange(leaf: WorkspaceLeaf | null): void {
    if (!this.settings.followActiveNote) return;
    if (this.isPreviewLeaf(leaf)) return;
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== "md") return;
    if (this.leafTimer !== null) window.clearTimeout(this.leafTimer);
    this.leafTimer = window.setTimeout(() => {
      this.leafTimer = null;
      void this.activeView()?.show(file);
    }, LEAF_SWITCH_DELAY_MS);
  }

  private onLiveEdit(info: MarkdownView | MarkdownFileInfo): void {
    if (!this.settings.liveRefresh) return;
    const view = this.activeView();
    const target = view ? view.file : null;
    if (!view || !target || !info.file || info.file.path !== target.path) return;
    this.scheduleEditRefresh();
  }

  private onVaultModify(file: TAbstractFile): void {
    if (!this.settings.liveRefresh) return;
    const view = this.activeView();
    const target = view ? view.file : null;
    if (!view || !target || !(file instanceof TFile) || file.path !== target.path) return;
    this.scheduleEditRefresh();
  }

  private scheduleEditRefresh(): void {
    if (this.editTimer !== null) window.clearTimeout(this.editTimer);
    this.editTimer = window.setTimeout(() => {
      this.editTimer = null;
      this.activeView()?.refresh();
    }, LIVE_EDIT_DELAY_MS);
  }

  private onVaultRename(file: TAbstractFile, oldPath: string): void {
    const view = this.activeView();
    const target = view ? view.file : null;
    if (!view || !target) return;
    if ((file instanceof TFile && file.path === target.path) || oldPath === target.path) {
      void view.show(file instanceof TFile ? file : target, true);
    }
  }

  private onVaultDelete(file: TAbstractFile): void {
    const view = this.activeView();
    const target = view ? view.file : null;
    if (view && target && file.path === target.path) void view.show(null);
  }
}
