# Pickora

Pickora 是一个原生微信小程序，用于帮助用户在低风险日常场景中快速做选择。

## 功能

- 模板选择：吃什么、去哪玩、买哪个、先做什么、自定义
- 候选项输入与去重
- 基于六象的娱乐化推荐结果
- 本地选项库
- 最近选择记录

## 技术栈

- 微信小程序原生框架
- TypeScript
- Vitest

## 项目结构

| 路径 | 说明 |
| --- | --- |
| `miniprogram/` | 唯一真实微信小程序 UI 源码 |
| `miniprogram/pages/` | 小程序页面 |
| `miniprogram/core/` | 核心纯函数与业务规则 |
| `scripts/` | 本地辅助脚本 |
| `project.config.json` | 微信开发者工具项目配置 |
| `tsconfig*.json` | TypeScript 配置 |

更详细的目录边界见 [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)。

## 本地开发

默认环境：Windows 11 + PowerShell 7+。

```powershell
npm install
npm run typecheck
```

当前 `npm test` 可能因为测试文件不足而失败，不等同于小程序运行失败。核心逻辑测试后续优先补在 `miniprogram/core/` 对应的纯函数上。

## 微信开发者工具

微信开发者工具必须从仓库根目录导入，不要从 `miniprogram/` 子目录导入。

关键配置：

- `project.config.json` 位于仓库根目录
- `miniprogramRoot` 指向 `miniprogram/`
- 不要擅自修改 `appid`

可用脚本：

```powershell
npm run devtools:open
```

## UI 审查

后续 UI 审查以微信开发者工具中的真实小程序截图为准。

- 自动截图链路已移除。
- 截图由人工从微信开发者工具获取后上传审查或手动归档。

后续 UI 修改只改 `miniprogram/` 下的真实小程序源码，不再维护浏览器镜像。

## 常用命令

```powershell
npm install
npm run typecheck
npm run devtools:open
```

## 注意事项

- 本项目仅用于低风险日常选择辅助，不适用于医疗、法律、投资等重要决策。
- 修改真实小程序 UI 时，优先最小改动 `miniprogram/pages/index/index.wxss`。
- 修改核心算法时，优先补充 `miniprogram/core/` 纯函数测试。
- 不要随意移动 `project.config.json`、`package.json` 或 `miniprogram/` 目录。
