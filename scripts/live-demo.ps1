# Run LifeDrop in production mode on this machine and expose it
# through a free Cloudflare quick tunnel. Prints the public URL.
# Requires: Java 17, MySQL running locally, cloudflared on PATH
# (or set $env:CLOUDFLARED to its full path).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

# 1. Build the frontend and embed it in the backend jar
Push-Location "$root/lifedrop-frontend"
npm run build
Pop-Location

$static = "$root/BloodDonationManagement/src/main/resources/static"
Remove-Item -Recurse -Force $static -ErrorAction SilentlyContinue
Copy-Item -Recurse "$root/lifedrop-frontend/dist" $static

# 2. Package and start the backend (HTTPS cookie for the public URL)
Push-Location "$root/BloodDonationManagement"
& .\mvnw.cmd -q -DskipTests package
Pop-Location

$env:SERVER_SERVLET_SESSION_COOKIE_SECURE = "true"
$jar = (Get-ChildItem "$root/BloodDonationManagement/target/*SNAPSHOT.jar" |
    Select-Object -First 1).FullName

# Quote the jar path: the repo folder name contains a space
$server = Start-Process java -ArgumentList "-jar `"$jar`"" -PassThru `
    -RedirectStandardOutput "$env:TEMP/lifedrop-server.log"

Start-Sleep -Seconds 20

# 3. Open the tunnel; cloudflared prints the URL on stderr
$cloudflared = if ($env:CLOUDFLARED) { $env:CLOUDFLARED } else { "cloudflared" }
$tunnel = Start-Process $cloudflared `
    -ArgumentList "tunnel --url http://localhost:8080 --no-autoupdate" -PassThru `
    -RedirectStandardOutput "$env:TEMP/lifedrop-tunnel.log" `
    -RedirectStandardError "$env:TEMP/lifedrop-tunnel.err"

Start-Sleep -Seconds 8
$match = Select-String -Path "$env:TEMP/lifedrop-tunnel.err" `
    -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1

Write-Host ""
if ($match) {
    Write-Host "LifeDrop is live at: $($match.Matches[0].Value)"
} else {
    Write-Host "Tunnel URL not found yet - check $env:TEMP/lifedrop-tunnel.err"
}
Write-Host "Server PID: $($server.Id)  Tunnel PID: $($tunnel.Id)"
Write-Host "Stop both with: Stop-Process -Id $($server.Id), $($tunnel.Id)"
