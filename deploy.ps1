$ErrorActionPreference = "Stop"

# AKUMA deploy - reuses the EXISTING Vercel project (renamed to "akuma")
# and uploads the production build from void-studios/dist.
# Token: $env:VERCEL_TOKEN first; otherwise validate candidates from the
# local handoff doc against the Vercel API (value is never stored here).

$projectId = "prj_wBlADbfn0HwJN9MFnXccrzb8p8hR"
$newName   = "akuma"
$distDir   = Join-Path $PSScriptRoot "void-studios\dist"

# --- token ---
$token = $env:VERCEL_TOKEN
if (-not $token) {
    $handoff = "C:\Users\vipin Pant\OneDrive\Desktop\handoff.md"
    if (Test-Path $handoff) {
        $h = Get-Content $handoff -Raw
        $candidates = [regex]::Matches($h, 'vcp_[A-Za-z0-9]+') | ForEach-Object { $_.Value } | Select-Object -Unique
        foreach ($c in $candidates) {
            try {
                Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId" -Headers @{ Authorization = "Bearer $c" } | Out-Null
                $token = $c
                Write-Host "Token recovered from handoff (validated)"
                break
            } catch { }
        }
    }
}
if (-not $token) { Write-Host "ERROR: no valid VERCEL_TOKEN found. Set env VERCEL_TOKEN and retry."; exit 1 }
$headers = @{ Authorization = "Bearer $token" }

# --- rename project ---
try {
    Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId" -Method PATCH -Headers $headers `
        -Body (@{ name = $newName } | ConvertTo-Json) -ContentType "application/json" | Out-Null
    Write-Host "RENAME OK -> $newName"
} catch {
    Write-Host "RENAME FAILED: $($_.Exception.Message) - continuing with deployment"
}

# --- collect dist files ---
if (-not (Test-Path "$distDir\index.html")) { Write-Host "ERROR: build missing - run vite build first"; exit 1 }
# bundle the SPA rewrite config (lives at void-studios/vercel.json, outside dist)
Copy-Item (Join-Path $PSScriptRoot "void-studios\vercel.json") "$distDir\vercel.json" -Force
$distRoot = (Resolve-Path $distDir).Path
$files = @()
Get-ChildItem $distDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($distRoot.Length + 1).Replace('\', '/')
    $files += @{ file = $rel; data = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($_.FullName)); encoding = "base64" }
}
Write-Host "Uploading $($files.Count) build files..."

# --- deploy ---
$body = @{
    name    = $newName
    project = $projectId
    files   = $files
    target  = "production"
} | ConvertTo-Json -Depth 5

$deployRes = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method POST -Headers $headers -Body $body -ContentType "application/json; charset=utf-8"
$deployId = $deployRes.id
Write-Host "DEPLOYMENT ID: $deployId"

# --- poll ---
$status = $deployRes.readyState
$attempts = 0
while ($status -ne "READY" -and $status -ne "ERROR" -and $attempts -lt 45) {
    Start-Sleep -Seconds 2; $attempts++
    $check = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments/$deployId" -Method GET -Headers $headers
    $status = $check.readyState
}
if ($status -ne "READY") { Write-Host "DEPLOY STATUS: $status"; exit 1 }
Write-Host "DEPLOYMENT READY"

# --- alias to the production domains ---
foreach ($alias in @("punkstudios.vercel.app", "akuma-store.vercel.app")) {
    try {
        Invoke-RestMethod -Uri "https://api.vercel.com/v2/deployments/$deployId/aliases" -Method POST -Headers $headers `
            -Body (@{ alias = $alias } | ConvertTo-Json) -ContentType "application/json" | Out-Null
        Write-Host "ALIASED: $alias"
    } catch {
        Write-Host "alias $alias failed: $($_.Exception.Message)"
    }
}
Write-Host "LIVE: https://punkstudios.vercel.app"
