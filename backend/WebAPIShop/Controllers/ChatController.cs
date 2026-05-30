using Microsoft.AspNetCore.Mvc;
using Servers;

namespace WebAPIShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly IPrudectsService _productService;
        private static List<object>? _cachedProducts;

        public ChatController(IHttpClientFactory factory, IPrudectsService productService)
        {
            _http = factory.CreateClient();
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest req)
        {
            if (_cachedProducts == null)
            {
                var products = await _productService.GetProducts(null, null, null, null, 20, null, 1);
                _cachedProducts = products.Data.Select(p => (object)new {
                    productId = p.ProductId,
                    name = p.ProductName,
                    price = p.Price,
                    description = p.Description != null && p.Description.Length > 60
                        ? p.Description.Substring(0, 60)
                        : p.Description,
                    category = p.Category?.CategoryName,
                    inStock = true
                }).ToList();
            }

            var payload = new { message = req.Message, history = req.History, products = _cachedProducts };

            var res = await _http.PostAsJsonAsync("http://localhost:8001/chat", payload);
            if (!res.IsSuccessStatusCode)
                return StatusCode(500, "AI service unavailable");

            var data = await res.Content.ReadFromJsonAsync<ChatResponse>();
            return Ok(data);
        }
    }

    public record ChatRequest(string Message, List<HistoryItem> History);
    public record HistoryItem(string Role, string Content);
    public record ChatResponse(string Reply);
}
