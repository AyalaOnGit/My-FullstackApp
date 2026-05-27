using Microsoft.AspNetCore.Mvc;
using Servers;

namespace WebAPIShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly IPrudectsService _productService;

        public SearchController(IHttpClientFactory factory, IPrudectsService productService)
        {
            _http = factory.CreateClient();
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SearchQuery req)
        {
            var products = await _productService.GetProducts(null, null, null, null, 50, null, 1);

            var productList = products.Data.Select(p => new {
                name = p.ProductName,
                price = p.Price,
                description = p.Description,
                category = p.Category?.CategoryName,
                inStock = true
            }).ToList();

            var res = await _http.PostAsJsonAsync(
                "http://localhost:8001/search",
                new { query = req.Query, products = productList, top_k = 5 });

            var data = await res.Content.ReadFromJsonAsync<SearchResponse>();
            return Ok(data);
        }
    }

    public record SearchQuery(string Query);
    public record SearchResponse(List<object> Results);
}
