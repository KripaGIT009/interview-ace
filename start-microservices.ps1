# 🚀 InterviewAce Microservices - Complete Setup Script
# This script will build and start all microservices

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   InterviewAce - Microservices Architecture Setup        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java 17+ required. Please install Java." -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mavenVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Host "✅ Maven: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven required. Please install Maven." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 18+ required. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
    $useDocker = $true
} catch {
    Write-Host "⚠️  Docker not found. Will run services locally." -ForegroundColor Yellow
    $useDocker = $false
}

Write-Host "`n📦 Choose deployment method:" -ForegroundColor Cyan
Write-Host "1. Docker Compose (Recommended - All services in containers)" -ForegroundColor White
Write-Host "2. Local Development (Services run locally)" -ForegroundColor White
$choice = Read-Host "`nEnter choice (1 or 2)"

if ($choice -eq "1" -and $useDocker) {
    Write-Host "`n🐳 Starting services with Docker Compose..." -ForegroundColor Cyan
    
    # Check if .env exists
    if (-not (Test-Path ".env")) {
        Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
        @"
# Database
DB_PASSWORD=interviewace123

# JWT
JWT_SECRET=$(New-Guid)

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs (Get from https://elevenlabs.io/)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
"@ | Out-File -FilePath ".env" -Encoding UTF8
        
        Write-Host "⚠️  Please edit .env file with your API keys!" -ForegroundColor Yellow
        Write-Host "   Press any key to continue after editing..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    Write-Host "`n🔨 Building Docker images..." -ForegroundColor Yellow
    docker-compose build
    
    Write-Host "`n🚀 Starting all services..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host "`n✅ All services started!" -ForegroundColor Green
    Write-Host "`n📊 Service URLs:" -ForegroundColor Cyan
    Write-Host "   Eureka Dashboard: http://localhost:8761" -ForegroundColor White
    Write-Host "   API Gateway:      http://localhost:8080" -ForegroundColor White
    Write-Host "   React Frontend:   http://localhost:3000" -ForegroundColor White
    
    Write-Host "`n📝 Useful commands:" -ForegroundColor Yellow
    Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor Gray
    Write-Host "   Stop services:    docker-compose down" -ForegroundColor Gray
    Write-Host "   Restart service:  docker-compose restart <service-name>" -ForegroundColor Gray
    
} elseif ($choice -eq "2") {
    Write-Host "`n💻 Starting Local Development Mode..." -ForegroundColor Cyan
    
    # Build all services
    Write-Host "`n🔨 Building Microservices..." -ForegroundColor Yellow
    
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
        $servicePath = "interviewace-backend\$service"
        if (Test-Path $servicePath) {
            Write-Host "   Building $service..." -ForegroundColor Gray
            Set-Location $servicePath
            mvn clean package -DskipTests -q
            Set-Location ..\..
            Write-Host "   ✅ $service built" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $service not found (will be created)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n🚀 Starting Services..." -ForegroundColor Cyan
    Write-Host "   Services will start in separate terminal windows`n" -ForegroundColor Gray
    
    # Start Eureka Server
    Write-Host "1️⃣  Starting Eureka Server (Port 8761)..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\eureka-server'; Write-Host 'Eureka Server - Service Discovery' -ForegroundColor Magenta; mvn spring-boot:run"
    Start-Sleep -Seconds 15
    
    # Start Config Server
    Write-Host "2️⃣  Starting Config Server (Port 8888)..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\config-server'; Write-Host 'Config Server - Centralized Configuration' -ForegroundColor Magenta; mvn spring-boot:run"
    Start-Sleep -Seconds 10
    
    # Start Auth Service
    Write-Host "3️⃣  Starting Auth Service (Port 8081)..." -ForegroundColor Cyan
    if (Test-Path "interviewace-backend\auth-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\auth-service'; Write-Host 'Auth Service' -ForegroundColor Cyan; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start Question Service
    Write-Host "4️⃣  Starting Question Service (Port 8082)..." -ForegroundColor Cyan
    if (Test-Path "interviewace-backend\question-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\question-service'; Write-Host 'Question Service' -ForegroundColor Cyan; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start Interview Service
    Write-Host "5️⃣  Starting Interview Service (Port 8083)..." -ForegroundColor Cyan
    if (Test-Path "interviewace-backend\interview-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\interview-service'; Write-Host 'Interview Service' -ForegroundColor Cyan; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start User Service
    Write-Host "6️⃣  Starting User Service (Port 8084)..." -ForegroundColor Cyan
    if (Test-Path "interviewace-backend\user-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\user-service'; Write-Host 'User Service' -ForegroundColor Cyan; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start AI Service
    Write-Host "7️⃣  Starting AI Service (Port 8085)..." -ForegroundColor Green
    if (Test-Path "interviewace-backend\ai-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\ai-service'; Write-Host 'AI Service - GPT-4 & Whisper' -ForegroundColor Green; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start Payment Service
    Write-Host "8️⃣  Starting Payment Service (Port 8086)..." -ForegroundColor Yellow
    if (Test-Path "interviewace-backend\payment-service") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\payment-service'; Write-Host 'Payment Service - Stripe' -ForegroundColor Yellow; mvn spring-boot:run"
        Start-Sleep -Seconds 5
    }
    
    # Start API Gateway
    Write-Host "9️⃣  Starting API Gateway (Port 8080)..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-backend\api-gateway'; Write-Host 'API Gateway - Main Entry Point' -ForegroundColor Magenta; mvn spring-boot:run"
    Start-Sleep -Seconds 10
    
    # Start React Frontend
    Write-Host "🔟 Starting React Frontend (Port 3000)..." -ForegroundColor Green
    if (Test-Path "interviewace-frontend\package.json") {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\interviewace-frontend'; Write-Host 'React Frontend' -ForegroundColor Green; npm run dev"
    } else {
        Write-Host "   ⚠️  React frontend not yet created" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ All Services Started!" -ForegroundColor Green
    
} else {
    Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              🎉 InterviewAce is Ready!                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📱 Access Points:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "   🔗 API Gateway:      http://localhost:8080" -ForegroundColor White
Write-Host "   📊 Eureka Dashboard: http://localhost:8761" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait for all services to register (check Eureka Dashboard)" -ForegroundColor Gray
Write-Host "   2. Open http://localhost:3000 in your browser" -ForegroundColor Gray
Write-Host "   3. Create an account and start practicing!" -ForegroundColor Gray

Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Check Eureka Dashboard to see registered services" -ForegroundColor Gray
Write-Host "   • Each service has its own terminal window" -ForegroundColor Gray
Write-Host "   • Use stop-all-microservices.ps1 to stop everything" -ForegroundColor Gray

Write-Host "`n✨ Happy Coding! ✨`n" -ForegroundColor Green
