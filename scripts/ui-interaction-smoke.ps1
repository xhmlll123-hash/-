$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location $projectRoot

New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null

Write-Host "打开微信开发者工具..."
npx weapp open -p

Write-Host "重启到首页..."
npx weapp relaunch pages/index/index -p .

Write-Host "截图：首页初始状态"
npx weapp screenshot -p . --page pages/index/index --output .tmp/01-home.png --json

Write-Host "获取当前页面..."
npx weapp current-page -p .

Write-Host "获取首页页面数据..."
npx weapp page-data -p . pages/index/index

Write-Host "尝试点击自定义模板..."
npx weapp tap ".template-card" -p .

Write-Host "截图：点击模板后"
npx weapp screenshot -p . --page pages/index/index --output .tmp/02-after-template.png --json

Write-Host "尝试向输入框输入测试选项..."
npx weapp input ".option-input" "火锅 烧烤" -p .

Write-Host "截图：输入后"
npx weapp screenshot -p . --page pages/index/index --output .tmp/03-after-input.png --json

Write-Host "UI interaction smoke 完成。截图目录：.tmp/"
