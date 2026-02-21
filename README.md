# InterviewLabPro - AI-Powered Interview Practice Platform

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## ðŸŽ¯ Overview

InterviewLabPro is an enterprise-grade AI-powered interview practice platform built with **microservices architecture**. It helps developers prepare for technical coding interviews through mock sessions with instant AI feedback powered by GPT-4.

### Key Features
- ðŸ” **JWT Authentication** - Secure user authentication and authorization
- ðŸ’» **Monaco Code Editor** - VS Code-quality editing experience with syntax highlighting
- ðŸŽ¤ **Voice Recording** - RecordRTC integration for recording explanations
- ðŸ¤– **AI Feedback** - GPT-4 powered code analysis and scoring (0-100)
- ðŸ“Š **Progress Tracking** - Real-time analytics, streaks, and performance metrics
- ðŸ’³ **Stripe Payments** - Subscription management (Free, Pro $29/mo, Enterprise $99/mo)
- ðŸ“ˆ **Analytics Dashboard** - Track completion rates, average scores, and session history
- ðŸŽ¯ **400+ Questions** - Curated coding challenges with difficulty levels and categories

---

## ðŸ—ï¸ Architecture

### Microservices Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    React Frontend (Port 3000)                     â”‚
â”‚         TypeScript â€¢ TailwindCSS â€¢ Monaco Editor â€¢ Zustand       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚ HTTP/REST
                             â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                   API Gateway (Port 8080)                         â”‚
â”‚          JWT Validation â€¢ Routing â€¢ Rate Limiting                â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                             â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                Eureka Server (Port 8761)                          â”‚
â”‚              Service Discovery â€¢ Health Checks                    â”‚
â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
      â”‚
      â”œâ”€â”€â–¶ Auth Service (8081)        - User authentication & JWT
      â”œâ”€â”€â–¶ Question Service (8082)    - Question repository (400+)
      â”œâ”€â”€â–¶ Interview Service (8083)   - Session management & timing
      â”œâ”€â”€â–¶ User Service (8084)        - Progress tracking & streaks
      â”œâ”€â”€â–¶ AI Service (8085)          - GPT-4 feedback & scoring
      â””â”€â”€â–¶ Payment Service (8086)     - Stripe subscriptions
```

### Technology Stack

**Backend (Spring Boot Microservices)**
- Java 17
- Spring Boot 3.2+
- Spring Cloud (Eureka, Config Server, Gateway)
- Spring Security with JWT
- PostgreSQL (production) / H2 (development)
- Maven
- Lombok

**Frontend (React)**
- React 18 with TypeScript
- Vite 5 (build tool)
- TailwindCSS 3.4
- Monaco Editor (code editing)
- RecordRTC (audio recording)
- Stripe.js (payments)
- Zustand (state management)
- Axios (HTTP client)

**External APIs**
- OpenAI GPT-4 (code feedback & scoring)
- Stripe (payment processing)
- ElevenLabs (text-to-speech, optional)

---

## ðŸš€ Quick Start

### Prerequisites
- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker Desktop** (optional, for containerized deployment)

### 1. Start Backend Microservices

```powershell
# Start all 9 microservices
.\start-microservices.ps1
```

This starts:
- Eureka Server (8761)
- Config Server (8888)
- API Gateway (8080)
- Auth Service (8081)
- Question Service (8082)
- Interview Service (8083)
- User Service (8084)
- AI Service (8085)
- Payment Service (8086)

Wait **60-90 seconds** for services to register with Eureka.

### 2. Start React Frontend

```powershell
cd interviewlabpro-frontend
npm install    # First time only
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3. Verify Services

Check Eureka Dashboard: **http://localhost:8761**  
All 6 business services should show as **UP** (green)

---

## ðŸ“¦ Service Details

### Infrastructure Services

#### Eureka Server (8761)
- Service discovery and registration
- Health monitoring dashboard
- Automatic load balancing

#### Config Server (8888)
- Centralized configuration management
- Environment-specific configs
- Refresh configurations without restart

#### API Gateway (8080)
- Single entry point for all requests
- JWT token validation
- Route `/api/auth/**` â†’ Auth Service
- Route `/api/questions/**` â†’ Question Service
- Route `/api/interviews/**` â†’ Interview Service
- Route `/api/users/**` â†’ User Service
- Route `/api/ai/**` â†’ AI Service
- Route `/api/payments/**` â†’ Payment Service

### Business Services

#### Auth Service (8081)
**Endpoints:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login (returns JWT)
- `GET /auth/validate` - Validate token
- `GET /auth/user` - Get user details

**Database:** `auth_db` (PostgreSQL)

#### Question Service (8082)
**Endpoints:**
- `GET /questions` - List all questions (filter by difficulty, category)
- `GET /questions/{id}` - Get question details
- `GET /questions/random` - Random question

**Database:** `questions_db` with 10 pre-seeded questions

#### Interview Service (8083)
**Endpoints:**
- `POST /interviews/start` - Create new session
- `GET /interviews/{id}` - Get session details
- `POST /interviews/{id}/submit` - Submit code
- `POST /interviews/{id}/complete` - Finish session
- `GET /interviews/user` - User's session history

**Database:** `interviews_db` (tracks time, code, feedback, scores)

#### User Service (8084)
**Endpoints:**
- `GET /users/progress` - Get user progress stats
- `POST /users/progress/update` - Update progress (increment counters)
- `GET /users/streak` - Get current streak

**Features:**
- Tracks easy/medium/hard problem counts
- Calculates streaks (consecutive days)
- Computes average scores
- Total time spent tracking

#### AI Service (8085)
**Endpoints:**
- `POST /ai/feedback` - GPT-4 code analysis
- `POST /ai/score` - GPT-4 scoring (0-100)
- `POST /ai/transcribe` - Whisper audio transcription
- `POST /ai/speak` - ElevenLabs text-to-speech

**Integration:** OpenAI API (requires API key in `.env`)

#### Payment Service (8086)
**Endpoints:**
- `POST /payments/checkout` - Create Stripe checkout session
- `GET /payments/subscription` - Get subscription status
- `POST /payments/cancel` - Cancel subscription

**Integration:** Stripe API (requires keys in `.env`)

---

## ðŸŽ¨ Frontend Pages

### 1. QuestionsPage
- **Search & Filter**: Text search, difficulty (Easy/Medium/Hard), 17 categories
- **Question Grid**: Browse all questions with colored difficulty badges
- **Monaco Preview**: Read-only code preview with syntax highlighting
- **Start Interview**: One-click session creation

### 2. InterviewPage
- **Live Timer**: Countdown with red warning at <5 minutes
- **Monaco Editor**: Full-featured code editor (vs-dark theme, 500px)
- **Audio Recording**: RecordRTC microphone integration
- **AI Workflow**:
  1. Submit code â†’ GPT-4 analysis
  2. Get score (0-100)
  3. Display detailed feedback
  4. Update user progress

### 3. DashboardPage
- **4 Key Metrics**: Total Sessions, Completed, Average Score, Streak
- **Progress Bars**: Visual progress for Easy/Medium/Hard
- **Activity Stats**: Time spent, longest streak, completion rate
- **Recent Sessions**: Table of last 5 sessions with status/score

### 4. SubscriptionPage
- **3 Tiers**: FREE, PRO ($29/mo), ENTERPRISE ($99/mo)
- **Stripe Checkout**: Redirect to Stripe hosted checkout
- **Cancel Subscription**: With confirmation dialog
- **FAQ Section**: Common questions

---

## ðŸ”§ Configuration

### 1. Environment Variables

Create `.env` file in project root:

```env
# OpenAI API (required for AI feedback)
OPENAI_API_KEY=sk-...

# Stripe API (required for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...

# Database (optional - defaults to H2)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/interviewlabpro
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

# JWT Secret (optional - auto-generated if not set)
JWT_SECRET=your-secret-key-here
```

### 2. Stripe Configuration

Update [SubscriptionPage.tsx](interviewlabpro-frontend/src/pages/SubscriptionPage.tsx#L4):

```typescript
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');
```

Update price IDs in [SubscriptionPage.tsx](interviewlabpro-frontend/src/pages/SubscriptionPage.tsx#L20):

```typescript
const tiers = [
  { name: 'PRO', priceId: 'price_YOUR_PRO_PRICE_ID' },
  { name: 'ENTERPRISE', priceId: 'price_YOUR_ENTERPRISE_PRICE_ID' }
];
```

---

## ðŸ§ª Testing

### API Testing Script

```powershell
# Test all API endpoints
.\test-api-complete.ps1
```

This tests:
- âœ… User signup
- âœ… User login
- âœ… Get questions
- âœ… Start interview session
- âœ… Submit code
- âœ… Get AI feedback
- âœ… Get user progress

### Manual Testing Flow

1. **Sign Up**: http://localhost:3000/signup
2. **Login**: Use new credentials
3. **Browse Questions**: Filter by difficulty/category
4. **Start Interview**: Click question â†’ Start Interview
5. **Code Solution**: Edit in Monaco Editor
6. **Submit**: Get AI feedback and score
7. **Dashboard**: View progress and stats
8. **Upgrade**: Test Stripe checkout (use test card: `4242 4242 4242 4242`)

---

## ðŸ“Š API Reference

### Authentication

#### Sign Up
```http
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response: { "token": "eyJ...", "userId": 1, "subscriptionTier": "FREE" }
```

### Questions

```http
GET http://localhost:8080/api/questions
Authorization: Bearer <token>

# Filter examples:
GET /api/questions?difficulty=MEDIUM
GET /api/questions?category=ARRAYS
GET /api/questions?company=Google
```

### Interviews

```http
# Start session
POST http://localhost:8080/api/interviews/start
Authorization: Bearer <token>
Content-Type: application/json

{ "questionId": 1 }

# Submit code
POST http://localhost:8080/api/interviews/{id}/submit
Authorization: Bearer <token>
Content-Type: application/json

{ "code": "public int[] twoSum(...) { ... }" }
```

### AI Feedback

```http
POST http://localhost:8080/api/ai/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "your code here",
  "questionTitle": "Two Sum",
  "questionDescription": "..."
}

Response: { "feedback": "Excellent solution using..." }
```

---

## ðŸ³ Docker Deployment

### Build & Run with Docker Compose

```powershell
# Build all services
docker-compose build

# Start all containers
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

### pgAdmin (PostgreSQL UI)

```powershell
# Start PostgreSQL + pgAdmin
docker compose up -d postgres pgadmin
```

- **URL**: http://localhost:5050
- **Email**: `admin@interviewlabpro.com`
- **Password**: `interviewlabpro123`
- **Preloaded databases**: `auth_db`, `questions_db`, `interviews_db`, `users_db`, `payments_db`

> You can override login credentials with `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` in your environment.

#### Troubleshooting pgAdmin

- **Port 5050 already in use**
  ```powershell
  docker ps --format "table {{.Names}}\t{{.Ports}}"
  # change mapping in docker-compose.yml, e.g. "5051:80"
  docker compose up -d pgadmin
  ```

- **Container not healthy/running**
  ```powershell
  docker compose ps postgres pgadmin
  docker compose logs --tail=100 postgres pgadmin
  ```

- **Reset pgAdmin admin password**
  ```powershell
  docker compose down pgadmin
  docker rm -f interviewlabpro-pgadmin
  $env:PGADMIN_DEFAULT_PASSWORD="newStrongPassword123"
  docker compose up -d pgadmin
  ```

### Individual Service Build

```powershell
cd interviewlabpro-backend/auth-service
docker build -t interviewlabpro/auth-service .
docker run -p 8081:8081 interviewlabpro/auth-service
```

---

## ðŸ› ï¸ Development

### Project Structure

```
interviewace/
├── interviewace-backend/
│   ├── eureka-server/         # Service discovery
│   ├── config-server/         # Configuration management
│   ├── api-gateway/           # API Gateway
│   ├── auth-service/          # Authentication
│   ├── question-service/      # Question repository
│   ├── interview-service/     # Session management
│   ├── user-service/          # User progress
│   ├── ai-service/            # AI integration
│   └── payment-service/       # Stripe payments
├── interviewace-frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── services/          # API services
│   │   ├── store/             # Zustand state
│   │   └── lib/               # Utilities
│   └── package.json
├── docker-compose.yml         # Docker orchestration
├── start-microservices.ps1    # Start script
├── stop-microservices.ps1     # Stop script
└── README.md                  # This file
```

### Adding a New Service

1. Create service directory in `interviewlabpro-backend/`
2. Add Spring Boot dependencies in `pom.xml`
3. Configure Eureka client in `application.yml`
4. Add route in API Gateway
5. Update `docker-compose.yml`
6. Update start/stop scripts

---

## ðŸŽ¯ Roadmap

### Completed âœ…
- [x] Microservices architecture (9 services)
- [x] JWT authentication
- [x] React frontend with TypeScript
- [x] Monaco code editor integration
- [x] AI feedback with GPT-4
- [x] Stripe payment integration
- [x] Progress tracking & analytics
- [x] Audio recording (RecordRTC)

### In Progress ðŸš§
- [ ] Audio transcription (Whisper API)
- [ ] Charts for dashboard (Chart.js installed)
- [ ] Code execution with Judge0 API
- [ ] Real-time AI feedback (WebSocket)

### Future ðŸ”®
- [ ] Mobile app (React Native)
- [ ] Video recording
- [ ] Peer-to-peer mock interviews
- [ ] Company-specific question sets
- [ ] Kubernetes deployment
- [ ] Redis caching
- [ ] GraphQL API

---

## ðŸ“ License

MIT License - see LICENSE file for details

---

## ðŸ¤ Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## ðŸ“ž Support

- **Issues**: https://github.com/yourusername/interviewlabpro/issues
- **Email**: support@interviewlabpro.com
- **Docs**: Full documentation in this README

---

## ðŸ™ Acknowledgments

- Spring Boot Team for excellent microservices framework
- OpenAI for GPT-4 API
- Stripe for payment infrastructure
- Monaco Editor for VS Code-quality editing
- React Team for the amazing frontend library

---

**Built with ❤️ by the InterviewAce Team**
| **H2 Console** | http://localhost:8080/h2-console | Database Management |

### H2 Database Console
- **JDBC URL**: `jdbc:h2:mem:interviewlabpro`
- **Username**: `sa`
- **Password**: (leave empty)

## ðŸ“¡ API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/{id}` - Get question by ID
- `GET /api/questions/random` - Get random question
- `GET /api/questions/difficulty/{difficulty}` - Filter by difficulty (EASY, MEDIUM, HARD)
- `GET /api/questions/category/{category}` - Filter by category
- `GET /api/questions/company/{company}` - Filter by company

### Interview Sessions
- `POST /api/interviews/start` - Start new interview session
- `POST /api/interviews/{sessionId}/submit` - Submit code and get feedback
- `GET /api/users/{userId}/sessions` - Get user's interview history

### Feedback
- `GET /api/feedback/{sessionId}` - Get feedback for session

### User
- `GET /api/users/{userId}/progress` - Get user progress statistics

## ðŸ“± User Interface Pages

The frontend service provides the following pages:

- **Landing Page** (`/`) - Marketing and feature showcase
- **Sign Up** (`/signup.html`) - User registration
- **Login** (`/login.html`) - User authentication
- **Dashboard** (`/dashboard.html`) - User stats and session history
- **Questions** (`/questions.html`) - Browse and filter questions
- **Interview** (`/interview.html`) - Live coding interface with timer

## ðŸ§ª Testing the Application

### Complete User Flow

1. **Sign Up**
   - Navigate to http://localhost:3000/signup.html
   - Enter your details and create an account
   - Automatically redirected to dashboard

2. **Browse Questions**
   - Click "Browse Questions" from dashboard
   - Filter by difficulty, category, or company
   - View 10 pre-loaded coding questions

3. **Start Interview**
   - Click "Start Interview" on any question
   - Write your solution in the code editor
   - Use hints if needed
   - Submit when ready

4. **View Feedback**
   - See AI-generated feedback modal
   - Review score breakdown (Correctness, Efficiency, Code Quality)
   - Return to dashboard or try another question

### API Testing with PowerShell

See [test-api.ps1](test-api.ps1) for complete API testing examples.

Quick test:
```powershell
# Get all questions
Invoke-RestMethod -Uri "http://localhost:8080/api/questions"
```

## Database Schema

###ðŸ—„ï¸ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **questions** - Coding interview questions
- **interview_sessions** - Active and completed sessions
- **feedback** - AI-generated feedback for submissions
- **user_progress** - Tracking statistics and achievements

See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for detailed schema.

## ðŸ’³Tier | Price | Features |
|------|-------|----------|
| FREE | $0 | 3 interviews/month, basic feedback |
| PREMIUM | $29/month | Unlimited interviews, detailed feedback, progress tracking |
| LIFETIME | $149 one-time | All Premium features, lifetime access |

## Development

##**FREE** | $0 | 3 interviews/month, basic feedback, progress tracking |
| **PREMIUM** | $29/month | Unlimited interviews, detailed AI feedback, analytics |
| **ENTERPRISE** | Custom | Team management, custom questions, dedicated support |

## ðŸ› ï¸ Development

### Project Structure
```
interviewace/
├── src/main/java/              # Backend (Spring Boot)
├── src/main/resources/         # Backend resources
├── frontend-service/           # Frontend (Node.js)
│   ├── public/                 # Static files (HTML/CSS/JS)
│   ├── server.js               # Express server
│   └── package.json            # Dependencies
├── start-all.ps1               # Start both services
├── stop-all.ps1                # Stop both services
└── pom.xml                     # Maven config
```

### Running Tests
```powershell
# Backend tests
mvn test

# Frontend (manual testing)
# See TESTING_GUIDE.md
```

### Building for Production
```powershell
# Backend JAR
mvn clean package

# Frontend
cd frontend-service
npm install --production
```

## ðŸ“š Documentation

- **[MICROSERVICES_GUIDE.md](MICROSERVICES_GUIDE.md)** - Microservices architecture details
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete project documentation
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing instructions
- **[API_TESTING.md](API_TESTING.md)** - API endpoint documentation
- **[Frontend README](frontend-service/README.md)** - Frontend service details

## ðŸš¢ Deployment

### Frontend Deployment
- Deploy to Heroku, Azure App Service, or AWS
- Configure BACKEND_URL environment variable
- See [frontend-service/README.md](frontend-service/README.md)

### Backend Deployment
- Package: `mvn clean package`
- Deploy Spring Boot JAR to cloud platform
- Configure database (PostgreSQL for production)
- Set JWT_SECRET environment variable

## ðŸ”’ Security

- JWT-based authentication (24-hour expiration)
- BCrypt password hashing
- CORS configured for microservices
- SQL injection prevention (JPA)
- XSS protection headers

## ðŸ¤ Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ðŸ“ License

This project is for educational purposes.

---

**Built with â¤ï¸ for interview success**JWT_EXPIRATION` - Token expiration time in milliseconds

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Contact
For support, email support@interviewlabpro.com

---

Built with â¤ï¸ by developers, for developers
