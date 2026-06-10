using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
namespace Servers;
using Entitys;
using Repository;
using DTOs;

public class CategoryService : ICategoryService
{
    private readonly ICategoriesRepository _categoryRepository;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly IConfiguration _configuration;

    public CategoryService(ICategoriesRepository categoryRepository, IMapper mapper, IDistributedCache cache, IConfiguration configuration)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
        _cache = cache;
        _configuration = configuration;
    }

    public async Task<List<CategoryDTO>> GetCategories()
    {
        const string cacheKey = "categories";
        try
        {
            var cached = await _cache.GetStringAsync(cacheKey);
            if (cached != null)
                return JsonSerializer.Deserialize<List<CategoryDTO>>(cached);
        }
        catch (Exception ex) { Console.WriteLine($"Redis error on Get: {ex.Message}"); }

        var categories = _mapper.Map<List<Category>, List<CategoryDTO>>(await _categoryRepository.GetCategories());

        try
        {
            var ttl = int.TryParse(_configuration["Redis:TTL"], out var t) ? t : 3600;
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(categories),
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(ttl) });
        }
        catch (Exception ex) { Console.WriteLine($"Redis error on Set: {ex.Message}"); }

        return categories;
    }
}
