# 🎁 GiftForU — Fullstack App
### **Angular 21 | .NET 9 | Python FastAPI | Redis | Kafka | JWT | Docker**

---

## 📖 סקירה כללית

**GiftForU** הוא אתר מתנות מלא — Angular בפרונט, .NET 9 בבאקאנד, ו-Python FastAPI לשירות ה-AI. האפליקציה מיישמת ארכיטקטורת שכבות, JWT, Redis cache, Kafka לעיבוד הזמנות, ו-Maya — סוכן צ'אט חכם.

---

## 🏗️ ארכיטקטורה

```
Angular (frontend) — nginx proxy
    ↕ /api/*
.NET 9 WebAPIShop (backend)
    ↕ EF Core       ↕ Redis cache    ↕ Kafka (KafkaProducerService)
  SQL Server      redis:6379       kafka:9092
    ↕ HTTP
Python FastAPI (ai_service) ← OpenAI
```

---

## 📁 מבנה הפרויקט

```text
├── frontend/           # Angular 21
│   ├── Dockerfile      # Multi-stage: Node build + nginx serve
│   └── nginx.conf      # Proxy /api/ ו-/productsImages/ לבאקאנד
├── backend/
│   ├── WebAPIShop/     # Entry point, controllers, middleware
│   ├── Servers/        # Business logic — כולל KafkaProducerService
│   ├── Repository/     # Data access
│   ├── Entitys/        # EF Core domain models
│   ├── DTOs/           # Record-based DTOs
│   ├── KafkaConsumer/  # Worker service — מאזין להזמנות
│   ├── TestProject1/   # xUnit tests
│   ├── sql-init/       # init.sql + init.sh — טעינת DB אוטומטית
│   ├── Dockerfile
│   └── docker-compose.yml
└── ai_service/         # Python FastAPI — Maya AI + Semantic Search
    └── Dockerfile
```

---

## 🛡️ אבטחה ותכונות

| תכונה | תיאור |
|-------|-------|
| **JWT** | Token נוצר ב-`UserService` בעת לוגין/הרשמה, מועבר כ-HttpOnly cookie |
| **Role-based Auth** | `[Authorize]` למשתמש מחובר, `[AdminOnly]` למנהל מערכת |
| **Rate Limiting** | Sliding Window — 30 בקשות/דקה לפי IP+User |
| **Redis Cache** | GET עם TTL מ-config, invalidation בכל שינוי |
| **Kafka** | `KafkaProducerService` (Singleton) שולח הזמנות ל-topic `orders`, KafkaConsumer מאזין ומדפיס ללוג |
| **NLog** | לוגים מפורטים לקובץ JSON |
| **Global Error Handling** | Middleware שתופס כל exception ומחזיר 500 עם לוג |
| **Traffic Monitoring** | כל בקשה נרשמת לטבלת RATING |
| **Maya AI** | סוכן צ'אט GPT-4o-mini עם ניווט חכם |
| **Semantic Search** | חיפוש לפי משמעות עם text-embedding-3-large |

---

## 🚀 הרצה מקומית

### דרישות
- .NET 9 SDK
- Node.js + Angular CLI
- Python 3.10+
- Docker Desktop

### 1. Docker (Redis + Kafka)
```bash
cd backend
docker compose up -d redis kafka kafka-ui
```

### 2. Python AI Service
```bash
cd ai_service
pip install -r requirements.txt
uvicorn chat_service:app --port 8001 --reload
```

### 3. .NET Backend
```bash
cd backend/WebAPIShop
dotnet run
```

### 4. Angular Frontend
```bash
cd frontend
npm install
ng serve
```

> **חשוב:** Python חייב לרוץ לפני .NET — הבאקאנד טוען את ה-embeddings בעליית השרת.

---

## 🐳 Docker — הרצת הכל

```bash
cd backend
docker compose up --build
```

שירותים:
- Frontend: `http://localhost:4200`
- API: `http://localhost:8080`
- AI Service: `http://localhost:8001`
- Kafka UI: `http://localhost:8090`
- Redis: `localhost:6379`
- SQL Server: `localhost:1433`

> **הערה:** צור קובץ `backend/.env` לפי `backend/.env.example` לפני ההרצה.

---

## 🧪 טסטים

```bash
cd backend
dotnet test
```

---

## 🛠️ Tech Stack

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | Angular 21, TypeScript |
| Backend | .NET 9, C#, ASP.NET Core |
| ORM | Entity Framework Core (DB-First) |
| Auth | JWT Bearer + HttpOnly Cookie |
| Cache | Redis (StackExchange.Redis) |
| Messaging | Apache Kafka (Confluent.Kafka) |
| Mapping | AutoMapper |
| Logging | NLog |
| Testing | xUnit, Moq |
| AI | Python FastAPI, OpenAI GPT-4o-mini |
| Container | Docker, Docker Compose |

---

## 📄 רישיון

MIT License

---
![צילום מסך של האתר1](/frontend/public/1.png)
![צילום מסך של האתר2](/frontend/public/2.png)
---
**Ayala**
<small>2026</small>
