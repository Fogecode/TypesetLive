import { App, PluginSettingTab, Setting } from "obsidian";
import type TypesetLivePlugin from "./main";
import { DEFAULT_THEME_ID, THEMES } from "./themes";
import type { ExportFeatures, LivePreviewSettings } from "./types";

/** Settings used when data.json is missing or incomplete. */
export const DEFAULT_SETTINGS: LivePreviewSettings = {
  themeId: DEFAULT_THEME_ID,
  followActiveNote: true,
  liveRefresh: true,
  embedImages: true,
  features: {
    toc: true,
    themeSwitcher: true,
    progressBar: true,
    copyButtons: true,
    backToTop: true,
  },
};

/** One row per runtime feature switch shown in settings. */
const FEATURE_ROWS: Array<{ key: keyof ExportFeatures; name: string; desc: string }> = [
  {
    key: "toc",
    name: "目录侧栏",
    desc: "在页面里显示由笔记标题生成的目录。",
  },
  {
    key: "themeSwitcher",
    name: "页面内主题切换器",
    desc: "读者可在页面内切换 8 套主题，工具栏下拉会同步。",
  },
  {
    key: "progressBar",
    name: "阅读进度条",
    desc: "页面顶部显示一条随滚动前进的进度条。",
  },
  {
    key: "copyButtons",
    name: "代码复制按钮",
    desc: "每个代码块配一个复制按钮（经 Obsidian 宿主剪贴板，预览里也可用）。",
  },
  {
    key: "backToTop",
    name: "回到顶部按钮",
    desc: "滚动一段距离后显示回到顶部按钮。",
  },
];

/** Settings UI, mounted under Settings -> Community plugins -> Typeset Live. */
export class TypesetLiveSettingTab extends PluginSettingTab {
  plugin: TypesetLivePlugin;

  constructor(app: App, plugin: TypesetLivePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    // styles.css targets this id; keep it stable.
    containerEl.id = "typeset-live-settings";

    new Setting(containerEl).setName("外观").setHeading();

    new Setting(containerEl)
      .setName("主题")
      .setDesc("预览使用的视觉风格。页面内嵌全部 8 套主题，随时可切。")
      .addDropdown((dropdown) => {
        for (const theme of THEMES) {
          dropdown.addOption(theme.id, theme.name + " — " + theme.description);
        }
        dropdown.setValue(this.plugin.settings.themeId);
        dropdown.onChange(async (value) => {
          this.plugin.settings.themeId = value;
          await this.plugin.saveSettings();
          this.plugin.pushThemeToView();
        });
        return dropdown;
      });

    new Setting(containerEl).setName("行为").setHeading();

    new Setting(containerEl)
      .setName("跟随当前笔记")
      .setDesc("切换到别的笔记时，预览自动跟着渲染那一篇。")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.followActiveNote);
        toggle.onChange(async (value) => {
          this.plugin.settings.followActiveNote = value;
          await this.plugin.saveSettings();
          this.plugin.activeView()?.updateFollowButton();
        });
        return toggle;
      });

    new Setting(containerEl)
      .setName("编辑实时刷新")
      .setDesc("编辑当前笔记时自动重新渲染（保持滚动位置）。")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.liveRefresh);
        toggle.onChange(async (value) => {
          this.plugin.settings.liveRefresh = value;
          await this.plugin.saveSettings();
        });
        return toggle;
      });

    new Setting(containerEl)
      .setName("内嵌图片")
      .setDesc("把仓库图片以 base64 内嵌进预览，效果与导出一致。")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.embedImages);
        toggle.onChange(async (value) => {
          this.plugin.settings.embedImages = value;
          await this.plugin.saveSettings();
          this.plugin.refreshView();
        });
        return toggle;
      });

    new Setting(containerEl).setName("页面功能").setHeading();

    for (const row of FEATURE_ROWS) {
      new Setting(containerEl)
        .setName(row.name)
        .setDesc(row.desc)
        .addToggle((toggle) => {
          toggle.setValue(this.plugin.settings.features[row.key]);
          toggle.onChange(async (value) => {
            this.plugin.settings.features[row.key] = value;
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          });
          return toggle;
        });
    }
  }
}
