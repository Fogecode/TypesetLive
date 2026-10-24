# Installs the built Typeset Live plugin into an Obsidian vault:
#   1. backs up community-plugins.json into data/backups/
#   2. copies main.js / manifest.json / styles.css / versions.json
#   3. atomically rewrites community-plugins.json with "typeset-live" enabled
# Rollback: restore the newest data/backups/community-plugins.*.json and delete
# .obsidian/plugins/typeset-live.
param(
    [string]$Vault = 'E:\\Markdown\\Obsidian\\wiki',
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$src = Join-Path $project 'data\\plugin\\typeset-live'
$dst = Join-Path $Vault '.obsidian\\plugins\\typeset-live'
$cpJson = Join-Path $Vault '.obsidian\\community-plugins.json'
$backupDir = Join-Path $project 'data\\backups'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

foreach ($f in 'main.js', 'manifest.json', 'styles.css', 'versions.json') {
    if (-not (Test-Path -LiteralPath (Join-Path $src $f))) { throw "missing build output: $src\$f (run node build.mjs first)" }
}
if (-not (Test-Path -LiteralPath $cpJson)) { throw "community-plugins.json not found: $cpJson" }

if ($DryRun) {
    Write-Host "[dry-run] would copy 4 files to $dst and enable typeset-live in $cpJson"
    exit 0
}

# 1. backup (outside the object being modified)
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$backup = Join-Path $backupDir "community-plugins.$stamp.json"
Copy-Item -LiteralPath $cpJson -Destination $backup -Force
Write-Host "backup: $backup"

# 2. plugin files
New-Item -ItemType Directory -Force -Path $dst | Out-Null
foreach ($f in 'main.js', 'manifest.json', 'styles.css', 'versions.json') {
    Copy-Item -LiteralPath (Join-Path $src $f) -Destination (Join-Path $dst $f) -Force
}
Write-Host "installed: $dst"

# 3. atomic enable-list update
$list = @(Get-Content -LiteralPath $cpJson -Raw | ConvertFrom-Json)
if ($list -notcontains 'typeset-live') { $list = @($list) + 'typeset-live' }
$json = ($list | ConvertTo-Json -Depth 3)
if ($list.Count -eq 1) { $json = "[" + $json + "]" }
$tmp = $cpJson + '.tmp'
[System.IO.File]::WriteAllText($tmp, $json + "`n", [System.Text.UTF8Encoding]::new($false))
Move-Item -LiteralPath $tmp -Destination $cpJson -Force
Write-Host "enabled plugins now: $json"
Write-Host "done - reload Obsidian (Ctrl+P -> Reload app without saving) to activate"
