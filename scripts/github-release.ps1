# Publishes a GitHub release with a zip asset for this repository.
# The token is read from the git credential store at runtime and never printed.
#
#   pwsh -NoProfile -File scripts/github-release.ps1 -Tag v1.1.0 -Zip plugin/typeset-live-1.1.0.zip
param(
    [Parameter(Mandatory = $true)][string]$Tag,
    [Parameter(Mandatory = $true)][string]$Zip,
    [string]$Repo = 'Fogecode/TypesetLive',
    [string]$Name = '',
    [string]$Body = ''
)

$ErrorActionPreference = 'Stop'

# --- token from git credential store (never echoed) ---
$fill = "protocol=https`nhost=github.com`n`n" | git credential fill
$map = @{}
foreach ($line in ($fill -split "`n")) {
    if ($line -match '^([^=]+)=(.*)$') { $map[$matches[1]] = $matches[2] }
}
$token = $map['password']
if (-not $token) { throw 'no github.com credential found in git credential store' }

$headers = @{
    Authorization = "token $token"
    Accept        = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
}

# --- release id: reuse an existing release for the tag or create one ---
try {
    $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/tags/$Tag" -Headers $headers
    Write-Host "existing release found: $($rel.tag_name) (id $($rel.id))"
} catch {
    if (-not $Name) { $Name = $Tag }
    $payload = @{
        tag_name  = $Tag
        name      = $Name
        body      = $Body
        draft     = $false
        prerelease = $false
    } | ConvertTo-Json
    $rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases" -Method Post -Headers $headers -Body $payload -ContentType 'application/json; charset=utf-8'
    Write-Host "release created: $($rel.tag_name) (id $($rel.id))"
}

# --- upload (or replace) the zip asset ---
$zipName = Split-Path -Leaf $Zip
foreach ($asset in @($rel.assets)) {
    if ($asset.name -eq $zipName) {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/assets/$($asset.id)" -Method Delete -Headers $headers | Out-Null
        Write-Host "old asset removed: $zipName"
    }
}
$uploaded = Invoke-RestMethod -Uri "https://uploads.github.com/repos/$Repo/releases/$($rel.id)/assets?name=$zipName" -Method Post -Headers $headers -InFile $Zip -ContentType 'application/zip'
Write-Host "asset uploaded: $($uploaded.name) ($([math]::Round($uploaded.size / 1KB)) KB)"
Write-Host "release url: $($rel.html_url)"
