$ErrorActionPreference = 'SilentlyContinue'

Write-Host "Stopping InterviewLabPro services..." -ForegroundColor Cyan

try {
    docker compose down
    Write-Host "Docker services stopped." -ForegroundColor Green
}
catch {
    Write-Host "Docker compose down failed or Docker unavailable." -ForegroundColor Yellow
}

$javaProcesses = Get-Process -Name java
if ($javaProcesses) {
    $javaProcesses | Stop-Process -Force
    Write-Host "Stopped local Java processes." -ForegroundColor Green
}

$nodeProcesses = Get-Process -Name node
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "Stopped local Node processes." -ForegroundColor Green
}

Write-Host "Stop operation complete." -ForegroundColor Green
