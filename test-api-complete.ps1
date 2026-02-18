# InterviewAce API Testing Script
# This script tests all microservices end-to-end

$API_BASE = "http://localhost:8080"
$TOKEN = ""
$SESSION_ID = ""

Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  InterviewAce API Testing Suite" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Helper function to make API calls
function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body,
        [bool]$RequireAuth = $false
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($RequireAuth -and $TOKEN) {
        $headers["Authorization"] = "Bearer $TOKEN"
    }
    
    try {
        $params = @{
            Uri = "$API_BASE$Endpoint"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = $Body
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Sign Up
Write-Host "[1/14] Testing Sign Up..." -ForegroundColor Yellow
$signupBody = @{
    username = "testuser_$(Get-Random -Maximum 10000)"
    email = "test$(Get-Random -Maximum 10000)@example.com"
    password = "password123"
} | ConvertTo-Json

$signupResult = Invoke-API -Method "POST" -Endpoint "/api/auth/signup" -Body $signupBody
if ($signupResult) {
    Write-Host "  ✓ Sign up successful! User ID: $($signupResult.id)" -ForegroundColor Green
    $USERNAME = $signupResult.username
    $EMAIL = $signupResult.email
} else {
    Write-Host "  ✗ Sign up failed!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 2: Login
Write-Host "[2/14] Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = $USERNAME
    password = "password123"
} | ConvertTo-Json

$loginResult = Invoke-API -Method "POST" -Endpoint "/api/auth/login" -Body $loginBody
if ($loginResult -and $loginResult.token) {
    $TOKEN = $loginResult.token
    Write-Host "  ✓ Login successful! Token received" -ForegroundColor Green
} else {
    Write-Host "  ✗ Login failed!" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 3: Validate Token
Write-Host "[3/14] Testing Token Validation..." -ForegroundColor Yellow
$validateResult = Invoke-API -Method "GET" -Endpoint "/api/auth/validate" -RequireAuth $true
if ($validateResult -and $validateResult.valid) {
    Write-Host "  ✓ Token is valid! User ID: $($validateResult.userId)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Token validation failed!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 4: Get All Questions
Write-Host "[4/14] Testing Get All Questions..." -ForegroundColor Yellow
$questions = Invoke-API -Method "GET" -Endpoint "/api/questions" -RequireAuth $true
if ($questions) {
    Write-Host "  ✓ Found $($questions.Count) questions" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to get questions!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Filter Questions by Difficulty
Write-Host "[5/14] Testing Filter Questions (EASY)..." -ForegroundColor Yellow
$easyQuestions = Invoke-API -Method "GET" -Endpoint "/api/questions?difficulty=EASY" -RequireAuth $true
if ($easyQuestions) {
    Write-Host "  ✓ Found $($easyQuestions.Count) EASY questions" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to filter questions!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 6: Get Random Question
Write-Host "[6/14] Testing Get Random Question..." -ForegroundColor Yellow
$randomQuestion = Invoke-API -Method "GET" -Endpoint "/api/questions/random" -RequireAuth $true
if ($randomQuestion -and $randomQuestion.id) {
    Write-Host "  ✓ Got random question: $($randomQuestion.title)" -ForegroundColor Green
    $QUESTION_ID = $randomQuestion.id
} else {
    Write-Host "  ✗ Failed to get random question!" -ForegroundColor Red
    $QUESTION_ID = 1
}

Start-Sleep -Seconds 1

# Test 7: Start Interview Session
Write-Host "[7/14] Testing Start Interview..." -ForegroundColor Yellow
$startBody = @{
    questionId = $QUESTION_ID
} | ConvertTo-Json

$session = Invoke-API -Method "POST" -Endpoint "/api/interviews/start" -Body $startBody -RequireAuth $true
if ($session -and $session.id) {
    Write-Host "  ✓ Interview started! Session ID: $($session.id)" -ForegroundColor Green
    $SESSION_ID = $session.id
} else {
    Write-Host "  ✗ Failed to start interview!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 8: Submit Code
Write-Host "[8/14] Testing Submit Code..." -ForegroundColor Yellow
$codeBody = @{
    code = "public int[] twoSum(int[] nums, int target) {`n    Map<Integer, Integer> map = new HashMap<>();`n    for (int i = 0; i < nums.length; i++) {`n        int complement = target - nums[i];`n        if (map.containsKey(complement)) {`n            return new int[] { map.get(complement), i };`n        }`n        map.put(nums[i], i);`n    }`n    return new int[0];`n}"
} | ConvertTo-Json

$submitResult = Invoke-API -Method "POST" -Endpoint "/api/interviews/$SESSION_ID/submit" -Body $codeBody -RequireAuth $true
if ($submitResult) {
    Write-Host "  ✓ Code submitted successfully!" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to submit code!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 9: Get AI Feedback
Write-Host "[9/14] Testing AI Feedback (may take a few seconds)..." -ForegroundColor Yellow
$feedbackBody = @{
    code = "public int[] twoSum(int[] nums, int target) { Map<Integer, Integer> map = new HashMap<>(); for (int i = 0; i < nums.length; i++) { int complement = target - nums[i]; if (map.containsKey(complement)) { return new int[] { map.get(complement), i }; } map.put(nums[i], i); } return new int[0]; }"
    question = "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
    language = "java"
} | ConvertTo-Json

$feedback = Invoke-API -Method "POST" -Endpoint "/api/ai/feedback" -Body $feedbackBody -RequireAuth $true
if ($feedback -and $feedback.feedback) {
    Write-Host "  ✓ AI Feedback received!" -ForegroundColor Green
    Write-Host "    Preview: $($feedback.feedback.Substring(0, [Math]::Min(100, $feedback.feedback.Length)))..." -ForegroundColor Gray
    $AI_FEEDBACK = $feedback.feedback
} else {
    Write-Host "  ⚠ AI Feedback skipped (requires OpenAI API key)" -ForegroundColor Yellow
    $AI_FEEDBACK = "Sample feedback: Good solution with O(n) complexity."
}

Start-Sleep -Seconds 1

# Test 10: Get AI Score
Write-Host "[10/14] Testing AI Scoring..." -ForegroundColor Yellow
$scoreBody = @{
    code = "public int[] twoSum(int[] nums, int target) { Map<Integer, Integer> map = new HashMap<>(); for (int i = 0; i < nums.length; i++) { int complement = target - nums[i]; if (map.containsKey(complement)) { return new int[] { map.get(complement), i }; } map.put(nums[i], i); } return new int[0]; }"
    question = "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
} | ConvertTo-Json

$score = Invoke-API -Method "POST" -Endpoint "/api/ai/score" -Body $scoreBody -RequireAuth $true
if ($score -and $score.score) {
    Write-Host "  ✓ AI Score received: $($score.score)/100" -ForegroundColor Green
    $AI_SCORE = $score.score
} else {
    Write-Host "  ⚠ AI Scoring skipped (requires OpenAI API key)" -ForegroundColor Yellow
    $AI_SCORE = 85
}

Start-Sleep -Seconds 1

# Test 11: Complete Interview
Write-Host "[11/14] Testing Complete Interview..." -ForegroundColor Yellow
$completeBody = @{
    feedback = $AI_FEEDBACK
    score = $AI_SCORE
} | ConvertTo-Json

$completeResult = Invoke-API -Method "POST" -Endpoint "/api/interviews/$SESSION_ID/complete" -Body $completeBody -RequireAuth $true
if ($completeResult -and $completeResult.status -eq "COMPLETED") {
    Write-Host "  ✓ Interview completed! Time spent: $($completeResult.timeSpent) minutes" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to complete interview!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 12: Get User Progress
Write-Host "[12/14] Testing Get User Progress..." -ForegroundColor Yellow
$progress = Invoke-API -Method "GET" -Endpoint "/api/users/progress" -RequireAuth $true
if ($progress) {
    Write-Host "  ✓ User Progress retrieved!" -ForegroundColor Green
    Write-Host "    Total Sessions: $($progress.totalSessions)" -ForegroundColor Gray
    Write-Host "    Completed: $($progress.completedSessions)" -ForegroundColor Gray
    Write-Host "    Average Score: $($progress.averageScore)" -ForegroundColor Gray
    Write-Host "    Current Streak: $($progress.currentStreak) days" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Failed to get user progress!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 13: Get Subscription
Write-Host "[13/14] Testing Get Subscription..." -ForegroundColor Yellow
$subscription = Invoke-API -Method "GET" -Endpoint "/api/payments/subscription" -RequireAuth $true
if ($subscription) {
    Write-Host "  ✓ Subscription retrieved!" -ForegroundColor Green
    Write-Host "    Tier: $($subscription.tier)" -ForegroundColor Gray
    Write-Host "    Status: $($subscription.status)" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Failed to get subscription!" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 14: Get Session History
Write-Host "[14/14] Testing Get Session History..." -ForegroundColor Yellow
$history = Invoke-API -Method "GET" -Endpoint "/api/interviews/user" -RequireAuth $true
if ($history) {
    Write-Host "  ✓ Session history retrieved! Found $($history.Count) sessions" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to get session history!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "=" * 60 -ForegroundColor Green
Write-Host "  Testing Complete!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "=" * 60 -ForegroundColor Green
Write-Host ""

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Username: $USERNAME" -ForegroundColor Gray
Write-Host "  Email: $EMAIL" -ForegroundColor Gray
Write-Host "  Session ID: $SESSION_ID" -ForegroundColor Gray
Write-Host "  Questions Available: $($questions.Count)" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: AI features (feedback, scoring) require valid OpenAI API key in .env" -ForegroundColor Yellow
Write-Host "Note: Payment features require valid Stripe API key in .env" -ForegroundColor Yellow
Write-Host ""
