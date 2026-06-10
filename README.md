# 🎁 GiftForU — Fullstack App
### **Angular 21 | .NET 9 | Python FastAPI | Redis | Kafka | JWT | Docker**

---

## 📖 סקירה כללית

**GiftForU** הוא אתר מתנות מלא — Angular בפרונט, .NET 9 בבאקאנד, ו-Python FastAPI לשירות ה-AI. האפליקציה מיישמת ארכיטקטורת שכבות, JWT, Redis cache, Kafka לעיבוד הזמנות, ו-Maya — סוכן צ'אט חכם.

---

## 🏗️ ארכיטקטורה

```
Angular (frontend)
    ↕ HTTP (CORS)
.NET 9 WebAPIShop (backend)
    ↕ EF Core          ↕ Redis cache      ↕ Kafka
  SQL Server        localhost:6379     localhost:9093
    ↕ HTTP proxy
Python FastAPI (ai_service) ← OpenAI
```

---

## 📁 מבנה הפרויקט

```text
├── frontend/           # Angular 21
├── backend/
│   ├── WebAPIShop/     # Entry point, controllers, middleware
│   ├── Servers/        # Business logic (Services layer)
│   ├── Repository/     # Data access
│   ├── Entitys/        # EF Core domain models
│   ├── DTOs/           # Record-based DTOs
│   ├── KafkaConsumer/  # Worker service — מאזין להזמנות
│   ├── TestProject1/   # xUnit tests
│   ├── Dockerfile
│   └── docker-compose.yml
└── ai_service/         # Python FastAPI — Maya AI + Semantic Search
```

---

## 🛡️ אבטחה ותכונות

| תכונה | תיאור |
|-------|-------|
| **JWT** | Token נוצר ב-`UserService` בעת לוגין/הרשמה, מועבר כ-HttpOnly cookie |
| **Role-based Auth** | `[Authorize]` למשתמש מחובר, `[AdminOnly]` למנהל מערכת |
| **Rate Limiting** | Sliding Window — 30 בקשות/דקה לפי IP+User |
| **Redis Cache** | GET עם TTL מ-config, invalidation בכל שינוי |
| **Kafka** | הזמנות חדשות נשלחות ל-topic `orders`, KafkaConsumer מאזין |
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

### 2. .NET Backend
```bash
cd backend/WebAPIShop
dotnet run
```

### 3. Python AI Service
```bash
cd ai_service
pip install -r requirements.txt
uvicorn chat_service:app --port 8001 --reload
```

### 4. Angular Frontend
```bash
cd frontend
npm install
ng serve
```

> **חשוב:** Python חייב לרוץ לפני .NET (טעינת embeddings בעליית השרת).

---

## 🐳 Docker — הרצת הכל

```bash
cd backend
docker compose up --build
```

שירותים:
- API: `http://localhost:8080`
- Kafka UI: `http://localhost:8090`
- Redis: `localhost:6379`

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
**Ayala**
<small>2026</small>
