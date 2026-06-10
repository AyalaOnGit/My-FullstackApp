using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Servers;
using DTOs;

namespace WebAPIShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;

        public OrdersController(IOrdersService ordersService)
        {
            _ordersService = ordersService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDTO>> Get(int id)
        {
            OrderDTO order = await _ordersService.GetOrderById(id);
            if (order != null)
                return Ok(order);
            return NoContent();
        }

        [HttpGet]
        [AdminOnly]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> Get()
        {
            var orders = await _ordersService.GetAllOrders();
            return orders != null ? Ok(orders) : NoContent();
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetByUser(int userId)
        {
            var orders = await _ordersService.GetOrdersByUserId(userId);
            return orders != null ? Ok(orders) : NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<OrderDTO>> Post([FromBody] OrderDTO order)
        {
            OrderDTO createdOrder = await _ordersService.AddOrder(order);
            if (createdOrder != null)
                return CreatedAtAction(nameof(Get), new { id = createdOrder.OrderId }, createdOrder);
            return BadRequest("Order not accepted");
        }

        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _ordersService.GetOrderById(id);
            if (order == null) return NotFound();

            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && order.UserId != userId)
                return Forbid();

            if (!isAdmin && status != "הגיע")
                return BadRequest("משתמש רגיל יכול לעדכן רק ל-'הגיע'");

            var updated = await _ordersService.UpdateOrderStatus(id, status);
            if (updated) return Ok();
            return BadRequest("Could not update status");
        }
    }
}
