$ErrorActionPreference = "Stop"

$token = "VERCEL_TOKEN_ENV_VAR"
$projectId = "prj_wBlADbfn0HwJN9MFnXccrzb8p8hR"
$aliasDomain = "punkstudios.vercel.app"

$indexBytes = [System.IO.File]::ReadAllBytes("index.html")
$indexB64 = [System.Convert]::ToBase64String($indexBytes)
$tee1Bytes = [System.IO.File]::ReadAllBytes("public\images\tee-green-affliction.jpg")
$tee1B64 = [System.Convert]::ToBase64String($tee1Bytes)
$tee2Bytes = [System.IO.File]::ReadAllBytes("public\images\tee-brown-centipede.jpg")
$tee2B64 = [System.Convert]::ToBase64String($tee2Bytes)
$tee3Bytes = [System.IO.File]::ReadAllBytes("public\images\tee-skull-tribal-full.webp")
$tee3B64 = [System.Convert]::ToBase64String($tee3Bytes)
$tee4Bytes = [System.IO.File]::ReadAllBytes("public\images\tee-skull-tribal-detail.webp")
$tee4B64 = [System.Convert]::ToBase64String($tee4Bytes)

$body = @{
    name = "punk-thrift-studio"
    project = $projectId
    files = @(
        @{ file = "index.html"; data = $indexB64; encoding = "base64" },
        @{ file = "images/tee-green-affliction.jpg"; data = $tee1B64; encoding = "base64" },
        @{ file = "images/tee-brown-centipede.jpg"; data = $tee2B64; encoding = "base64" },
        @{ file = "images/tee-skull-tribal-full.webp"; data = $tee3B64; encoding = "base64" },
        @{ file = "images/tee-skull-tribal-detail.webp"; data = $tee4B64; encoding = "base64" }
    )
    target = "production"
} | ConvertTo-Json -Depth 5

$headers = @{ "Authorization" = "Bearer $token" }
$deployRes = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method POST -Headers $headers -Body $body -ContentType "application/json; charset=utf-8"
$deployId = $deployRes.id
Write-Host "ID: $deployId"

$status = $deployRes.readyState
$attempts = 0
while ($status -ne "READY" -and $attempts -lt 30) {
    Start-Sleep -Seconds 2; $attempts++
    $check = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments/$deployId" -Method GET -Headers $headers
    $status = $check.readyState
    Write-Host "Attempt $attempts : $status"
}

if ($status -eq "READY") {
    $aliasBody = @{ alias = $aliasDomain } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.vercel.com/v2/deployments/$deployId/aliases" -Method POST -Headers $headers -Body $aliasBody -ContentType "application/json" | Out-Null
    Write-Host "LIVE: https://$aliasDomain"
} else {
    Write-Host "DEPLOY STATUS: $status"
}
