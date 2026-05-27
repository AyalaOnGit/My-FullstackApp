using Entitys;

namespace Repository
{
    public interface ICategoriesRepository
    {
        Task<List<Category>> GetCategories();
        Task<Category> GetCategoryByName(string name);
    }
}