// Minimal but faithful stand-in for Obsidian's "obsidian" module.
// Used only by the offline verification harness: it lets us require() the
// built main.js exactly the way Obsidian does (CommonJS + module.exports.default)
// and drive the real preview pipeline against a real vault folder.
//
// Extended for Typeset Live: ItemView with a makeEl DOM, view-factory capture,
// setAttribute, and onOpen/onClose lifecycle support.

globalThis.window = globalThis; // the plugin calls window.setTimeout / registerDomEvent(window, ...)

class Notice {
  constructor(message, timeout) {
    this.message = String(message);
    this.timeout = timeout;
    Notice.instances.push(this);
  }
  setMessage(m) { this.message = String(m); return this; }
  hide() {}
}
Notice.instances = [];

function applyOpts(el, o) {
  if (!o) return el;
  if (o.cls) el.addClass(o.cls);
  if (o.text !== undefined && o.text !== null) el.setText(String(o.text));
  if (o.attr) {
    for (const key of Object.keys(o.attr)) el.setAttribute(key, String(o.attr[key]));
  }
  if (o.value !== undefined && o.value !== null) el.value = o.value;
  return el;
}

function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(),
    children: [],
    style: {},
    dataset: {},
    attrs: {},
    value: "",
    classList: {
      _s: new Set(),
      add(...c) { c.forEach((x) => this._s.add(x)); },
      remove(...c) { c.forEach((x) => this._s.delete(x)); },
      toggle(c, force) { const on = force === undefined ? !this._s.has(c) : !!force; if (on) this._s.add(c); else this._s.delete(c); return on; },
      contains(c) { return this._s.has(c); },
    },
    textContent: "",
    innerHTML: "",
    id: "",
    empty() { this.children.length = 0; return this; },
    createEl(t, o) { const c = applyOpts(makeEl(t), o); this.children.push(c); return c; },
    createDiv(o) { return this.createEl("div", o); },
    createSpan(o) { return this.createEl("span", o); },
    addClass(...c) { c.forEach((x) => this.classList.add(x)); return this; },
    removeClass(...c) { c.forEach((x) => this.classList.remove(x)); return this; },
    setText(t) { this.textContent = String(t); return this; },
    setAttr(k, v) { this.attrs[k] = String(v); return this; },
    setAttribute(k, v) { this.attrs[k] = String(v); return this; },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; },
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {},
    removeEventListener() {},
    remove() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }; },
  };
  return el;
}

class Component {
  constructor() { this._loaded = false; this._children = []; }
  load() {
    this._loaded = true;
    if (this.onOpen) return this.onOpen();
    if (this.onload) return this.onload();
  }
  unload() {
    if (this.onClose) this.onClose();
    if (this.onunload) this.onunload();
    this._loaded = false;
  }
  addChild(c) { this._children.push(c); return c; }
  register() {}
  registerEvent() {}
  registerDomEvent() {}
  registerInterval() {}
}

class Plugin extends Component {
  constructor(app, manifest) {
    super();
    this.app = app;
    this.manifest = manifest;
    this._data = null;
    this._commands = [];
    this._ribbons = [];
    this._settingTabs = [];
    this._viewFactories = {};
  }
  async loadData() { return this._data; }
  async saveData(d) { this._data = JSON.parse(JSON.stringify(d)); }
  addRibbonIcon(icon, title, cb) {
    const el = { icon, title, cb, addClass() {}, remove() {} };
    this._ribbons.push(el);
    return el;
  }
  addCommand(cmd) { this._commands.push(cmd); return cmd; }
  addSettingTab(tab) { this._settingTabs.push(tab); }
  registerView(type, factory) { this._viewFactories[type] = factory; }
  async onload() {}
  onunload() {}
}

class PluginSettingTab {
  constructor(app, plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = makeEl("div");
  }
  display() {}
  hide() {}
}

class Modal {
  constructor(app) {
    this.app = app;
    this.containerEl = makeEl("div");
    this.modalEl = makeEl("div");
    this.titleEl = makeEl("div");
    this.contentEl = makeEl("div");
  }
  open() { this.onOpen && this.onOpen(); }
  close() { this.onClose && this.onClose(); }
  setTitle(t) { this.titleEl.textContent = t; return this; }
}

class SuggestModal extends Modal {
  constructor(app) { super(app); this.inputEl = makeEl("input"); this.resultContainerEl = makeEl("div"); }
  setPlaceholder() {}
  getSuggestions() { return []; }
  renderSuggestion() {}
  onChooseSuggestion() {}
}

class ItemView extends Component {
  constructor(leaf) {
    super();
    this.leaf = leaf;
    this.app = leaf && leaf.app;
    this.contentEl = makeEl("div");
  }
}

class Setting {
  constructor(containerEl) { this.containerEl = containerEl; this.settingEl = makeEl("div"); }
  setName() { return this; }
  setDesc() { return this; }
  setHeading() { return this; }
  addText(cb) { cb({ setPlaceholder() { return this; }, setValue() { return this; }, onChange() { return this; }, inputEl: makeEl("input") }); return this; }
  addDropdown(cb) {
    cb({ addOption() { return this; }, setValue() { return this; }, onChange() { return this; }, selectEl: makeEl("select") });
    return this;
  }
  addToggle(cb) { cb({ setValue() { return this; }, onChange() { return this; } }); return this; }
  addButton(cb) { cb({ setButtonText() { return this; }, setCta() { return this; }, onClick() { return this; } }); return this; }
  addExtraButton(cb) { cb({ setIcon() { return this; }, setTooltip() { return this; }, onClick() { return this; } }); return this; }
  addTextArea(cb) { cb({ setValue() { return this; }, onChange() { return this; } }); return this; }
}

class TFile {
  constructor(path) {
    this.path = path;
    this.name = path.split("/").pop();
    this.basename = this.name.replace(/\.[^.]+$/, "");
    this.extension = (this.name.match(/\.([^.]+)$/) || [, ""])[1];
  }
}

const normalizePath = (p) => String(p).replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(/^\.\//, "");

module.exports = {
  Notice,
  Component,
  Plugin,
  PluginSettingTab,
  Setting,
  Modal,
  SuggestModal,
  TFile,
  TAbstractFile: TFile,
  MarkdownView: class {},
  MarkdownFileInfo: class {},
  WorkspaceLeaf: class {},
  ItemView,
  Platform: { isDesktop: true, isMobile: false, isMacOS: false, isWin: true },
  normalizePath,
  requestUrl: async () => { throw new Error("network disabled in harness"); },
  setIcon: (el, icon) => { if (el) el.__icon = icon; },
  debounce: (fn) => fn,
  moment: () => ({ format: () => "" }),
};
