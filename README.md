# FocusAlert

> 一款基于 Tauri + Vue3 的极简专注计时桌面应用，支持多平台打包，适合学习、工作时提升专注力。

---

## ✨ 功能特性

- ⏳ **专注计时**：自定义专注时长范围，自动循环专注与休息。
- 🔔 **音频提醒**：每轮专注/休息结束自动播放提示音。
- 🌈 **美观界面**：渐变背景、圆形动画、响应式设计。
- 🖥️ **跨平台**：支持 Windows、macOS、Linux 桌面端。
- 🛠️ **Tauri 打包**：体积小、性能高、原生体验。
- 🧩 **可自定义**：支持自定义循环次数、专注/休息时长。

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/little-chaseheart/FocusAlert.git
cd FocusAlert
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发环境

- 启动前端（Vite）：
  ```bash
  npm run dev
  ```
- 启动桌面端（Tauri）：
  ```bash
  npx tauri dev
  ```

### 4. 打包应用

```bash
npx tauri build
```

打包产物在 `src-tauri/target/release/bundle/` 目录下。

---

## 🖼️ 界面预览

![screenshot](./screenshot.png) <!-- 你可以自行添加应用截图 -->

---

## ⚙️ 主要技术栈

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Element Plus](https://element-plus.org/) 组件库
- [Tauri](https://tauri.app/) 跨平台桌面应用框架
- [Vite](https://vitejs.dev/) 前端构建工具

---

## 📁 目录结构

```
FocusAlert/
  ├─ src/                # 前端源码
  ├─ src-tauri/          # Tauri 配置与 Rust 后端
  ├─ public/             # 静态资源
  ├─ package.json
  └─ README.md
```

---

## 📝 自定义与配置

- **专注/休息时长**：可在界面右上角设置。
- **音频提醒**：可替换 `src/assets/钟声.mp3` 或 `src/assets/闹钟声音1.mp3`。
- **应用图标**：替换 `src-tauri/icons/` 下的图标文件，并在 `tauri.conf.json` 配置。

---

## 📦 跨平台打包

- macOS、Windows、Linux 各平台需在对应系统下打包，或使用 GitHub Actions 自动打包（见下方）。
- [Tauri 官方打包文档](https://tauri.app/v2/guides/distribution/)

---

## 🤖 自动化打包（GitHub Actions）

可参考 `.github/workflows/tauri.yml`，实现全平台自动打包与发布。

---

> 欢迎 Star、Fork、提 Issue！
