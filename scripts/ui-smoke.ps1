$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location $projectRoot

New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null

function Invoke-OptionalNpmScript {
  param(
    [string]$Label,
    [string]$ScriptName,
    [int]$TimeoutSeconds = 45
  )

  Write-Host $Label

  $stdoutPath = Join-Path ".tmp" "$ScriptName.out.log"
  $stderrPath = Join-Path ".tmp" "$ScriptName.err.log"
  Remove-Item -Force -ErrorAction SilentlyContinue $stdoutPath, $stderrPath

  $process = Start-Process -FilePath "npm.cmd" `
    -ArgumentList @("run", $ScriptName) `
    -WorkingDirectory $projectRoot `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath `
    -NoNewWindow `
    -PassThru

  if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    Write-Warning "$ScriptName 超时，已跳过。"
    return
  }

  if (Test-Path $stdoutPath) {
    Get-Content $stdoutPath -Encoding UTF8 | Write-Host
  }

  if ($process.ExitCode -ne 0) {
    if (Test-Path $stderrPath) {
      Get-Content $stderrPath -Encoding UTF8 | Write-Warning
    }
    Write-Warning "$ScriptName 失败，已跳过。"
  }
}

Write-Host "打开微信开发者工具..."
npx weapp open -p

Write-Host "截取首页..."
npm run ui:capture

Invoke-OptionalNpmScript "获取当前页面..." "ui:current"
Invoke-OptionalNpmScript "获取页面栈..." "ui:stack"
Invoke-OptionalNpmScript "获取首页页面数据..." "ui:data"

Write-Host "UI smoke 完成。截图位置：.tmp/home.png"
