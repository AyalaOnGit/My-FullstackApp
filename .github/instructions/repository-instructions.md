# Repository / Data Access (`Repository`)

Responsibilities
- Encapsulate EF Core `dbSHOPContext` interactions: queries, persistence, and mapping to entities.
- Provide a concise API for CRUD operations and queries specific to the domain.
- Do not implement business rules or HTTP concerns.

Naming Conventions
- Interfaces prefixed with `I` (e.g., `IOrderRepository`) and implementations suffixed with `Repository` (e.g., `OrderRepository`).
- Async DB methods MUST end with `Async` (e.g., `GetByIdAsync`, `AddAsync`).
- Return entity types; avoid returning DTOs from repositories.

Dependencies
- Repositories should depend only on `Entitys`, `dbSHOPContext`, and `ILogger`.
- Inject `dbSHOPContext` via constructor DI.
- Use `AsNoTracking()` for read-only queries where appropriate.

Notes
- The namespace for entities is `Entitys` (not `Entities`) in this project.
- The DbContext is `dbSHOPContext` (in `Repository` namespace).

Error Handling
- Let EF Core exceptions bubble up for middleware to translate.
- Never swallow exceptions silently.

Testing Guidance
- Unit test repositories with in-memory or SQLite test DB.
- Use `Moq.EntityFrameworkCore` for mocking `DbSet`.
