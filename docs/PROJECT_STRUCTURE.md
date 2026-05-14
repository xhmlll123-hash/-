# 项目结构说明

本文档说明 Pickora 当前目录边界，避免把真实小程序源码和辅助脚本混用。

## 根目录结构

```text
.
├─ README.md
├─ AGENTS.md
├─ package.json
├─ package-lock.json
├─ project.config.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.test.json
├─ vitest.config.ts
├─ docs/
│  └─ PROJECT_STRUCTURE.md
├─ miniprogram/
└─ scripts/
```

## miniprogram/

`miniprogram/` 是唯一真实微信小程序 UI 源码目录。

主要内容：

- `app.json`、`app.ts`、`app.wxss`：小程序入口与全局配置
- `pages/`：页面目录
- `pages/index/`：当前主页面
- `core/`：核心纯函数、模板、选项库、会话与存储逻辑

修改原则：

- 修 UI 时优先改 `miniprogram/pages/index/index.wxss`
- 修页面交互时优先改 `miniprogram/pages/index/index.ts`
- 修核心算法时才改 `miniprogram/core/`
- UI 变更以微信开发者工具真实小程序截图作为验收标准

## UI 审查口径

浏览器镜像已移除，不再作为同步目标。

后续 UI 审查以微信开发者工具真实截图为准。截图自动化不稳定时，使用人工截图作为验收依据。

不要按浏览器 DOM 还原小程序 UI，也不要重新引入浏览器镜像作为 UI 同步源。

## scripts/

`scripts/` 放本地辅助脚本。

当前脚本：

- `open-wechat-devtools.ps1`：打开微信开发者工具
- `capture-home.ps1`：包装微信开发者工具截图命令，带重试和降级
- `ui-smoke.ps1`：基础 UI smoke 流程
- `ui-interaction-smoke.ps1`：最小交互 smoke 流程

这些脚本只用于本地开发和审查，不应承载业务逻辑。

## 配置文件说明

- `project.config.json`：微信开发者工具项目配置，必须保留在仓库根目录。
- `project.private.config.json`：开发者工具本地私有配置，已被 `.gitignore` 忽略。
- `package.json`：根项目脚本和开发依赖。
- `tsconfig.app.json`：小程序 TypeScript 检查配置。
- `tsconfig.test.json`：测试 TypeScript 检查配置。
- `vitest.config.ts`：Vitest 配置。

## 修改边界

- 不要把 `project.config.json` 移入 `miniprogram/`。
- 不要把 `package.json` 移入 `miniprogram/`。
- 不要擅自修改 `appid`。
- 不要为了 UI 审查扩大到目录重构。
- 不要把截图过程产物、构建产物或 `node_modules/` 提交到 Git。

## 后续开发建议

1. 真实小程序修改后，优先运行：

```powershell
npm run typecheck
```

2. 涉及 UI 的修改，在微信开发者工具中编译并查看真实小程序截图。
3. 核心逻辑质量优先用 Vitest 测 `miniprogram/core/` 纯函数。
