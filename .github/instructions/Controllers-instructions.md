# API / Controllers (`WebAPIShop/Controllers`)

Responsibilities
- Accept HTTP requests, validate inputs, map request DTOs to service calls, and return appropriate HTTP responses.
- Translate service results into `ActionResult<T>` and status codes (e.g., `200`, `201`, `400`, `404`).
- Do not contain business logic, direct database access, or long-running operations.

Naming Conventions
- Controller classes SHOULD be suffixed with `Controller` (e.g., `OrdersController`).
- Action methods SHOULD use clear verbs and may include `Async` for async methods (e.g., `GetOrderByIdAsync`).
- Use `ActionResult<T>` or `IActionResult` as return types for endpoints.
- Route templates should be explicit (e.g., `[Route("api/[controller]")]`).

Dependencies
- Controllers MUST depend only on service interfaces (inject via constructor DI), e.g., `IOrdersService`, `IUserService` from the `Servers` project.
- Use `ILogger<T>` via DI for logging.
- Do NOT instantiate `dbSHOPContext` or repositories directly.

Authorization
- Use `[Authorize]` for endpoints that require a logged-in user.
- Use `[AdminOnly]` (custom attribute) for admin-only endpoints.
- Use `[AllowAnonymous]` explicitly on public endpoints (login, register).
- JWT is extracted from the `jwt` HttpOnly cookie automatically via middleware in `Program.cs`.

Error Handling
- Delegate domain errors to services. Return HTTP-friendly responses for expected errors.
- Avoid catching broad exceptions in controllers; rely on centralized `ErrorHandlingMiddleware`.

Testing Guidance
- Unit test controllers by mocking service interfaces and asserting returned `ActionResult` and status codes.
