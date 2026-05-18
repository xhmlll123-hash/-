# Pickora UI 截图基准

说明：
这些截图来自微信开发者工具中的真实小程序界面，用于后续 UI 回归审查。它们不是自动化截图产物，也不要求像素级一致。

## 文件说明

| 文件 | 对应状态 |
|---|---|
| home.png | 首页首屏 |
| edit-empty.png | 编辑页空候选项状态 |
| edit-with-options.png | 编辑页已有 3-5 个候选项 |
| edit-all-excluded.png | 编辑页全部候选项被排除后的状态 |
| result-normal.png | 普通常用签牌结果页 |
| result-quickstart.png | 极速起局结果页 |
| acceptance-cover.png | 接受结果后的“已定”封面 |
| library.png | 个人选项库页 |

## 使用规则

- 每轮 UI 修改后，只对照相关页面截图。
- 如果 UI 是有意升级，允许更新对应截图。
- 更新截图时必须人工确认来自微信开发者工具真实小程序。
- 不使用 preview、浏览器镜像或自动截图工具生成这些截图。
- 不提交临时截图、系统缓存、构建产物。

## 更新建议

一次只更新与本轮修改相关的截图。
例如：
- 只改首页：只更新 home.png。
- 只改选项库：只更新 library.png。
- 只改结果页：更新 result-normal.png 和 result-quickstart.png。