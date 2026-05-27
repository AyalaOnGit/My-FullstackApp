using System.Text.Json;
using Entitys;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Repository
{
    public class CategoriesRepository : ICategoriesRepository
    {
        dbSHOPContext _dbSHOPContext;

        public CategoriesRepository(dbSHOPContext dbSHOPContext)
        { 
            _dbSHOPContext= dbSHOPContext;
        }
        public async Task<List<Category>> GetCategories()
        {
            return await _dbSHOPContext.Categories.ToListAsync();
        }
        public async Task<Category> GetCategoryByName(string name)
        {
            return await _dbSHOPContext.Categories
                .FirstOrDefaultAsync(c => c.CategoryName == name);
        }

    }
}
