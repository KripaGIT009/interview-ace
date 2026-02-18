# 🛑 Stop All InterviewAce Microservices

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║      Stopping All InterviewAce Microservices              ║" -ForegroundColor Red
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Red

$choice = Read-Host "Stop using (1) Docker or (2) Local processes? [1/2]"

if ($choice -eq "1") {
    Write-Host "`n🐳 Stopping Docker containers..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ All Docker containers stopped" -ForegroundColor Green
    
} elseif ($choice -eq "2") {
    Write-Host "`n🛑 Stopping Java processes..." -ForegroundColor Yellow
    $javaProcesses = Get-Process | Where-Object {$_.ProcessName -eq 'java'}
    if ($javaProcesses) {
        $javaProcesses | Stop-Process -Force
        Write-Host "✅ All Java services stopped" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No Java processes running" -ForegroundColor Gray
    }
    
    Write-Host "`n🛑 Stopping Node.js processes..." -ForegroundColor Yellow
    $nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq 'node'}
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        Write-Host "✅ React frontend stopped" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No Node.js processes running" -ForegroundColor Gray
    }
    
    # Free up ports
    Write-Host "`n🧹 Cleaning up ports..." -ForegroundColor Yellow
    $ports = @(8080, 8081, 8082, 8083, 8084, 8085, 8086, 8761, 8888, 3000)
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "   ✅ Freed port $port" -ForegroundColor Green
        }
    }
}

Write-Host "`n✅ All services stopped successfully!`n" -ForegroundColor Green
