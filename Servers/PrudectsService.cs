namespace Servers;

using AutoMapper;
using DTOs;
using Entitys;
using Repository;


public class PrudectsService : IPrudectsService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoriesRepository _categoryRepository;
    IMapper _mapper;

    public PrudectsService(IProductRepository productRepository, IMapper mapper, ICategoriesRepository categoryRepository)
    {
        _productRepository = productRepository;
        _mapper = mapper;
        _categoryRepository = categoryRepository;
    }

    public async Task<PageResponseDTO<ProductDTO>> GetProducts(string? description, int? minPrice, int? maxprice, int[]? categoriesId,
            int? limit, string? orderby, int? offset)
    {
        (List<Product> items, int totalCount )= await _productRepository.GetProducts(description, minPrice, maxprice, categoriesId, limit, orderby, offset);

        List<ProductDTO> itemsDTO=_mapper.Map<List<Product>, List<ProductDTO>>(items);
        PageResponseDTO < ProductDTO > responseDTO = new PageResponseDTO<ProductDTO>()
        {
            Data = itemsDTO,
            TotalItems=totalCount,
            CurrentPage= (offset ?? 1),
            PageSize = (limit ?? 20),
            HasPreviousPage = ((offset ?? 1) > 1),
            HasNextPage = ((offset ?? 1) * (limit ?? 20) < totalCount)
        };
        return responseDTO;
    }
    public async Task DeleteProduct(int id)
    {
        await _productRepository.DeleteProduct(id);
    }
    public async Task<ProductDTO> GetProductById(int id)
    {
        var product = await _productRepository.GetProductById(id);
        return _mapper.Map<Product, ProductDTO>(product);
    }
    // Servers/PrudectsService.cs
    public async Task<ProductDTO> AddProduct(ProductDTO productDto)
    {
        var product = _mapper.Map<ProductDTO, Product>(productDto);

        // שליפת הקטגוריה לפי השם שמגיע מהאנגולר
        var category = await _categoryRepository.GetCategoryByName(productDto.Category.CategoryName);

        if (category == null) throw new Exception("Category not found");

        product.CategoryId = category.CategoryId;

        var newProduct = await _productRepository.AddProduct(product);
        return _mapper.Map<Product, ProductDTO>(newProduct);
    }

    public async Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto)
    {
        var product = _mapper.Map<ProductDTO, Product>(productDto);

        var category = await _categoryRepository.GetCategoryByName(productDto.Category.CategoryName);
        if (category != null)
        {
            product.CategoryId = category.CategoryId;
        }

        await _productRepository.UpdateProduct(id, product);
        return productDto;
    }
}
