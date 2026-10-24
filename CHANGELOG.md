# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-10-24

首个版本。

### 新增

- 在 Obsidian 标签页内实时预览当前笔记的网页渲染（沙箱 iframe + postMessage 桥，不写盘、不开浏览器）
- 工具栏 8 套主题即时切换，与页面内切换器双向同步
- 跟随当前笔记：切换笔记时预览自动跟随
- 编辑实时刷新：600ms 防抖自动重渲染，保持滚动位置
- 预览内 wiki 内链与相对 .md 链接在 Obsidian 内打开，外部链接走系统浏览器
- 代码复制按钮经宿主剪贴板（沙箱内可用）
- 手机宽度模拟（390px 居中）
- 设置页：主题、跟随当前笔记、编辑实时刷新、图片内嵌、5 项页面功能开关

### 技术说明

- 插件以 CommonJS 格式打包，入口为 export default class extends Plugin
- 渲染管线与 [Typeset](https://github.com/Fogecode/Typeset) 导出器同源：同一套 markdown 渲染、8 套主题
- 预览 iframe 使用 sandbox="allow-scripts"，与宿主的所有交互（主题/复制/链接/滚动）经显式消息契约中转
