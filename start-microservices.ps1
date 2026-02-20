$ErrorActionPreference = 'Stop'

Write-Host "Starting InterviewAce services..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
@"
DB_PASSWORD=interviewace123
JWT_SECRET=$(New-Guid)
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "Created .env file with defaults at ./.env" -ForegroundColor Yellow
}

try {
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose up -d failed"
    }
    Write-Host "Docker services started." -ForegroundColor Green
    docker compose ps
    exit 0
}
catch {
    Write-Host "Docker compose start failed. Falling back to local startup..." -ForegroundColor Yellow
}

$services = @(
    "eureka-server",
    "config-server",
    "api-gateway",
    "auth-service",
    "question-service",
    "interview-service",
    "user-service",
    "ai-service",
    "payment-service"
)

foreach ($service in $services) {
    $servicePath = Join-Path "interviewace-backend" $service
    if (Test-Path $servicePath) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\$servicePath'; mvn spring-boot:run"
        Write-Host "Started $service locally" -ForegroundColor Green
        Start-Sleep -Seconds 3
    }
}

if (Test-Path "interviewace-frontend\package.json") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\interviewace-frontend'; npm run dev"
    Write-Host "Started frontend locally" -ForegroundColor Green
}
