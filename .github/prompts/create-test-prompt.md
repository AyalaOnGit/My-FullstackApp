# Create Test Prompt for this repository

Purpose
- This document tells the AI how to generate new unit tests matching this project's style and conventions.

Analysis of current test style
- Test framework: xUnit (`[Fact]`, `public async Task ...`).
- Mocking: `Moq` for interfaces and `Moq.EntityFrameworkCore` for mocking `DbSet` and `DbContext`.
- Test class naming: `*UnitTest` or `*IntegrationTest`.
- Test method naming: `Method_Scenario_Result` (clear, descriptive, underscores used).
- Structure: AAA pattern — `// Arrange`, `// Act`, `// Assert`.
- Note: service layer namespace is `Servers`, entities namespace is `Entitys`, DbContext is `dbSHOPContext`.

The 'Boom' Template (boilerplate)

```csharp
using Xunit;
using Moq;
using Moq.EntityFrameworkCore;
using Entitys;
using Repository;
using Servers;
using DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestProject1
{
    public class {ClassName}UnitTest
    {
        private readonly Mock<I{Dependency}> _{dependency}Mock;
        private readonly {ClassUnderTest} _sut;

        public {ClassName}UnitTest()
        {
            _{dependency}Mock = new Mock<I{Dependency}>();
            _sut = new {ClassUnderTest}(_{dependency}Mock.Object);
        }

        [Fact]
        public async Task {MethodName}_{Scenario}_{ExpectedResult}()
        {
            // Arrange
            var data = new List<{Entity}> { /* seed objects */ };
            var mockContext = new Mock<dbSHOPContext>();
            mockContext.Setup(c => c.{DbSetName}).ReturnsDbSet(data);

            // Act
            var result = await _sut.{MethodUnderTest}(/* args */);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedValue, result.{Property});
        }
    }
}
```

Rules
- File/class naming: `{Feature}UnitTest.cs` or `{Feature}IntegrationTest.cs`.
- Test method naming: `Method_Scenario_Result`.
- Always include `// Arrange`, `// Act`, `// Assert` markers.
- Use `Moq` and `Moq.EntityFrameworkCore` for EF-related tests.
- Tests should be `public async Task`.
- Verify important interactions (e.g., `SaveChangesAsync`) with `mock.Verify(...)`.
