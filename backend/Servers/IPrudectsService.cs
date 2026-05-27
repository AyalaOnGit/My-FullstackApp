using DTOs;
using Entitys;
using Repository;

namespace Servers
{
    public interface IPrudectsService
    {
        Task<PageResponseDTO<ProductDTO>> GetProducts(string? name, int? minPrice, int? maxprice, int[]? categoriesId,
            int? limit, string? orderby, int? offset);
        Task DeleteProduct(int id);
        Task<ProductDTO> GetProductById(int id);
        Task<ProductDTO> AddProduct(ProductDTO productDto);
        Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto);

    }
}