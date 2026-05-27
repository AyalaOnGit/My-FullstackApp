using Entitys;
using Repository;
using DTOs;

namespace Servers
{
    public interface ICategoryService
    {
        Task<List<CategoryDTO>> GetCategories();
    }
}