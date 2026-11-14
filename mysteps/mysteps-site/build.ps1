# Rebuilds public/ from the MySteps page source (..\mysteps.html) and photos.
# Run from this folder after editing mysteps.html:  powershell -ExecutionPolicy Bypass -File .\build.ps1
param([string]$Source = (Join-Path $PSScriptRoot '..\mysteps.html'))

$pub = Join-Path $PSScriptRoot 'public'
New-Item -ItemType Directory -Force (Join-Path $pub 'photos') | Out-Null
Copy-Item (Join-Path (Split-Path $Source) 'photos\*.jpg') (Join-Path $pub 'photos') -Force

$page = [System.IO.File]::ReadAllText((Resolve-Path $Source))
$head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="MySteps helps every person at Central Union know where they are, what''s next, and how to grow."><script>window.MYSTEPS_API="/api/submit";window.MYSTEPS_PROFILE_API="/api/profile";</script><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
$html = $head + $page + '</body></html>'
[System.IO.File]::WriteAllText((Join-Path $pub 'index.html'), $html, (New-Object System.Text.UTF8Encoding $false))
Write-Output "Built $(Join-Path $pub 'index.html')"
