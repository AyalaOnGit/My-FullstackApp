using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servers;
using DTOs;

namespace WebAPIShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> Get(int id)
        {
            UserDTO user = await _userService.GetUserById(id);
            if (user != null)
                return Ok(user);
            return NotFound();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Post([FromBody] UserDTO user, [FromQuery] string password)
        {
            ResultValidUser<(UserDTO user, string token)> result = await _userService.AddUser(user, password);
            if (result.data.user != null)
            {
                Response.Cookies.Append("jwt", result.data.token, new CookieOptions { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax });
                return CreatedAtAction(nameof(Get), new { id = result.data.user.UserId }, result.data.user);
            }
            if (result.InvalidPassword)
                return BadRequest("Password is not strong enough");
            if (result.IsValidEmail)
                return BadRequest("Email is not valid");
            return BadRequest("This email is already in use");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Login([FromBody] LoginUserDTO loginUser)
        {
            if (loginUser == null || string.IsNullOrWhiteSpace(loginUser.UserEmail))
                return BadRequest("Email is required");
            (UserDTO user, string token) = await _userService.Login(loginUser.UserEmail, loginUser.UserPassword);
            if (user != null)
            {
                _logger.LogInformation("Login attempted with User Name, {0} and password {1}", loginUser.UserEmail, loginUser.UserPassword);
                Response.Cookies.Append("jwt", token, new CookieOptions { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax });
                return Ok(user);
            }
            return Unauthorized("Invalid email or password");
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> Put(int id, [FromBody] UserDTO user, [FromQuery] string password)
        {
            ResultValidUser<(UserDTO user, string token)> result = await _userService.UpdateUser(id, user, password);
            if (result.data.user != null)
                return Ok(result.data.user);
            if (result.InvalidPassword)
                return BadRequest("Password is not strong enough");
            if (result.IsValidEmail)
                return BadRequest("Email is not valid");
            return BadRequest("This email is already in use");
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }
    }
}
