# Microservices Extraction Plan — GiftForU

> תכנון בלבד — לא ממומש. המסמך הזה מתאר את הדרך לפצל את המונוליט לשירותים קטנים.

## Bounded Contexts מוצעים

| שירות | Entities | Controllers | תיאור |
|-------|----------|-------------|-------|
| **UserService** | User | UsersController, PasswordController | ניהול משתמשים, אימות, JWT |
| **ProductService** | Product, Category | ProductsController, CategoriesController, UploadController | קטלוג מוצרים |
| **OrderService** | Order, OrderItem | OrdersController | הזמנות + Kafka |
| **AIService** | — | ChatController, SearchController | Python FastAPI, embeddings |

---

## שלבי החילוץ

1. **זיהוי הגבולות** — לאתר את כל ה-Controllers, Services, Repositories, DTOs ו-Entities הרלוונטיים.
2. **יצירת skeleton** — תיקייה חדשה `services/{name}` עם: `API`, `Domain`, `Repository`, `Services`, `DTOs`, `Tests`.
3. **הגדרת חוזה API** — OpenAPI/Swagger עם versioned routes (e.g., `/api/v1/orders`).
4. **מיגרציית DB** — כל שירות מחזיק DbContext משלו ו-migrations ייעודיים.
5. **לוגיקה עסקית** — העברת הלוגיקה מ-`Servers/` לשירות החדש.
6. **תקשורת** — REST סינכרוני בין שירותים; Kafka לאירועים async (e.g., `OrderCreated`).
7. **טסטים** — xUnit עם AAA, Moq, שמות `Method_Scenario_Result`.
8. **Cutover** — API Gateway + strangler pattern, ואז הסרת הקוד מהמונוליט.

---

## Checklist לפני מיזוג

- [ ] השירות בונה ועובר בטסטים
- [ ] OpenAPI contract נוצר
- [ ] DB migrations כלולים
- [ ] Event contracts מוגדרים אם יש Kafka
- [ ] CI/CD pipeline + Docker image
- [ ] Health endpoint מוגדר
- [ ] Authorization (JWT/mTLS) מיושם

---

## המלצות תפעוליות

- הרצה על Kubernetes עם centralized logging (OpenTelemetry + ELK)
- JWT לבקשות חיצוניות, mTLS בין שירותים
- Blue/green או canary deployments
