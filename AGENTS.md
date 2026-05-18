# Project Rules

## 基本环境

- 默认系统：Windows 11
- 默认终端：PowerShell 7+
- 默认编码：UTF-8
- 当前项目：原生微信小程序 + TypeScript
- 小程序源码目录：miniprogram/
- 页面目录：miniprogram/pages/
- 核心逻辑目录：miniprogram/core/

## 微信开发者工具

- 微信开发者工具必须从仓库根目录导入。
- 不要从 miniprogram/ 子目录导入。
- project.config.json 保持在仓库根目录。
- miniprogramRoot 指向 miniprogram/。
- 不要擅自修改 appid。
- 不要把 project.config.json 移入 miniprogram/。
- 不要把 package.json 移入 miniprogram/。

## 修改边界

- 修 UI：优先只改 WXSS。
- 修页面交互：优先改 miniprogram/pages/index/index.ts。
- 修核心算法：只在明确要求时改 miniprogram/core/。
- 不要无关重构。
- 不要引入新框架。
- 不要新增组件库。
- 不要新增无关依赖。
- 不要重写已正常工作的目录结构。

## 验证优先级

每次修改后优先运行：

```powershell
npm run typecheck
```

如果涉及样式或小程序运行效果，还需要在微信开发者工具里实际编译和预览。

当前 `npm test` 可能因为没有测试文件而失败，这不一定代表当前修改有问题。

## UI 审查

- 真实小程序源码在 `miniprogram/`，后续 UI 改动以真实微信开发者工具截图为准。
- 不要新建浏览器 preview 镜像。
- 不要按浏览器 DOM 还原小程序 UI。
- UI 修改必须基于微信开发者工具真实截图。
- 每轮 UI 修改只处理一个页面或一个模块。
- 微信开发者工具截图自动化不稳定时，使用人工截图作为验收依据。
- 核心逻辑质量优先用 Vitest 测 `miniprogram/core/` 纯函数。
