# DTOs / Entities (`DTOs`, `Entitys`)

Responsibilities
- DTOs: transport objects for API input/output; contain validation attributes only and minimal logic.
- Entities: EF Core persistence models representing DB schema and navigation properties.

Naming Conventions
- DTO classes should end with `DTO` (e.g., `OrderDTO`, `ProductDTO`).
- Entity classes use domain nouns (e.g., `Order`, `Product`).
- Note: the entities project is named `Entitys` in this codebase.

Key DTOs
- `UserDTO` — user without password; returned by API.
- `LoginUserDTO` — email + password for login.
- `ResultValidUser<T>` — wraps service validation results: `InvalidPassword`, `UserAlreadyExists`, `IsValidEmail`, `data`.

Dependencies
- DTOs consumed by Controllers and Services; should not depend on Repositories or DbContext.
- Entities consumed by Repositories and Services; avoid referencing DTOs in entity classes.
- Mapping configurations live in `AutoMapping.cs` in `WebAPIShop`.

Notes
- `UserDTO` does NOT contain the password. Passwords are sent via query string or separate field and hashed with BCrypt.
- `User.Role` field drives JWT `ClaimTypes.Role` ("Admin" or "User").
