using DTOs;
using Entitys;
using Microsoft.AspNetCore.Mvc;
using Repository;
using Servers;
using System.Text.Json;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPIShop.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly IPrudectsService _prudectsService;
        
        public ProductsController(IPrudectsService prudectsService)
        {
            _prudectsService = prudectsService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDTO>>> Get(string? description, int? minPrice, int? maxPrice, [FromQuery] int[]? categoriesId,
            int? limit, string? orderby, int offset=1) 
        {

            PageResponseDTO <ProductDTO> metaData= await _prudectsService.GetProducts(description, minPrice,maxPrice,categoriesId,limit,orderby,offset);
            if (metaData != null)
            {
                return Ok(metaData);
            }
            return NoContent();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetById(int id)
        {
            var product = await _prudectsService.GetProductById(id);
            if (product == null) return NotFound();
            return Ok(product);
        }
        [HttpPost]
        [AdminOnly]
        public async Task<ActionResult<ProductDTO>> Create([FromBody] ProductDTO productDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var createdProduct = await _prudectsService.AddProduct(productDto);
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductId }, createdProduct);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [AdminOnly]
        public async Task<ActionResult<ProductDTO>> Update(int id, [FromBody] ProductDTO productDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != productDto.ProductId) return BadRequest("ID mismatch");
            await _prudectsService.UpdateProduct(id, productDto);
            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        [AdminOnly]
        public async Task<ActionResult> Delete(int id)
        {
            var product = await _prudectsService.GetProductById(id);
            if (product == null) return NotFound();
            await _prudectsService.DeleteProduct(id);
            return NoContent();
        }


    }
}
