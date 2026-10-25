# Publishes a Gitee release with a zip attach file for this repository.
# The token is read from the git credential store at runtime and never printed.
#   pwsh -NoProfile -File scripts/gitee-release.ps1 -Tag v1.1.0 -Zip plugin/typeset-live-1.1.0.zip
param(
    [Parameter(Mandatory = $true)][string]$Tag,
    [Parameter(Mandatory = $true)][string]$Zip,
    [string]$Repo = 'fogelern/typeset-live',
    [string]$Name = '',
    [string]$Body = ''
)

$ErrorActionPreference = 'Stop'

$fill = "protocol=https`nhost=gitee.com`n`n" | git credential fill
$map = @{}
foreach ($line in ($fill -split "`n")) {
    if ($line -match '^([^=]+)=(.*)$') { $map[$matches[1]] = $matches[2] }
}
$token = $map['password']
if (-not $token) { throw 'no gitee.com credential found in git credential store' }

# token must be a personal access token for API use - verify first
try {
    $me = Invoke-RestMethod -Uri ('https://gitee.com/api/v5/user?access_token=' + $token) -Method Get
    Write-Host ('token ok, acting as: ' + $me.login)
} catch {
    throw 'stored gitee credential is not a valid API personal access token - create one at gitee.com settings -> private tokens'
}

if (-not $Name) { $Name = $Tag }
$rel = Invoke-RestMethod -Uri ('https://gitee.com/api/v5/repos/' + $Repo + '/releases') -Method Post -Body @{
    access_token      = $token
    tag_name          = $Tag
    target_commitish  = 'main'
    name              = $Name
    body              = $Body
}
Write-Host ('release created: ' + $rel.tag_name)

# NOTE: the attach_files endpoint ignores multipart token fields - pass the
# token as a query parameter instead (verified 2026-10-25).
$file = Invoke-RestMethod -Uri ('https://gitee.com/api/v5/repos/' + $Repo + '/releases/' + $rel.id + '/attach_files?access_token=' + $token) -Method Post -Form @{
    file = Get-Item -LiteralPath $Zip
}
Write-Host ('attach uploaded: ' + $file.file_name + ' -> ' + $file.browser_download_url)
