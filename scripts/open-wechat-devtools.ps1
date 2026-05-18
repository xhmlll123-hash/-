$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path "$PSScriptRoot\.."

$requiredFiles = @(
  "project.config.json",
  "package.json",
  "miniprogram\app.json"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $projectRoot $file
  if (-not (Test-Path $path)) {
    throw "当前目录不像项目根目录，缺少：$file"
  }
}

$candidates = @(
  "$env:LOCALAPPDATA\微信开发者工具\cli.bat",
  "$env:LOCALAPPDATA\Programs\微信开发者工具\cli.bat",
  "${env:ProgramFiles(x86)}\Tencent\微信web开发者工具\cli.bat",
  "$env:ProgramFiles\Tencent\微信web开发者工具\cli.bat",
  "${env:ProgramFiles(x86)}\微信web开发者工具\cli.bat",
  "$env:ProgramFiles\微信web开发者工具\cli.bat"
)

$cli = $candidates |
  Where-Object { $_ -and (Test-Path $_) } |
  Select-Object -First 1

if (-not $cli) {
  Write-Host "未自动找到微信开发者工具 cli.bat。" -ForegroundColor Yellow
  Write-Host "请用 Everything 或资源管理器搜索 cli.bat，然后把路径手动写入此脚本。" -ForegroundColor Yellow
  Write-Host "常见位置：" -ForegroundColor Yellow
  $candidates | ForEach-Object { Write-Host "  $_" }
  exit 1
}

Write-Host "微信开发者工具 CLI: $cli"
Write-Host "项目根目录: $projectRoot"

Start-Process -FilePath $cli -ArgumentList @("open", "--project", "$projectRoot")

Write-Host "已发送打开项目命令。请在微信开发者工具中确认项目是否已打开。"
