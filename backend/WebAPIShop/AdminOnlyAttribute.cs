using Microsoft.AspNetCore.Authorization;

namespace WebAPIShop
{
    public class AdminOnlyAttribute : AuthorizeAttribute
    {
        public AdminOnlyAttribute() => Roles = "Admin";
    }
}
