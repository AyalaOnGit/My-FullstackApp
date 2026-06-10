# Services / Business Logic (`Servers`)

Responsibilities
- Implement and enforce business rules, coordinate multiple repositories, and manage transactions and cross-cutting concerns.
- Transform between domain entities and DTOs (use `AutoMapper`).
- Generate JWT tokens on login and registration.
- Manage Redis cache: read-through on GET, invalidate on write.
- Do not perform HTTP concerns, controller-level responsibilities, or direct DbContext management.

Naming Conventions
- Interfaces prefixed with `I` and implementations suffixed with `Service` (e.g., `IOrdersService` / `OrdersService`).
- Method names should describe behavior.

Dependencies
- Services may depend on repository interfaces, other services, `IMapper`, `ILogger<T>`, `IDistributedCache`, and `IConfiguration` via constructor DI.
- Services SHOULD NOT instantiate repositories or DbContext directly.

Key patterns
- JWT: generated in `UserService.GenerateToken(UserDTO)` using `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` from config.
- BCrypt: use `BC.HashPassword` on save and `BC.Verify` on login. Never store plain-text passwords.
- Redis cache: TTL from `Redis:TTL` config key. Always wrap cache calls in try/catch — if Redis is down, fall through to DB.
- Kafka: `OrdersService.SendToKafkaAsync` publishes to `Kafka:Topic`. Failures are logged but do not break the request.

Error Handling
- Validate inputs and return `ResultValidUser<T>` for user operations.
- Log warnings for business anomalies (e.g., order sum mismatch).
