using System.Text.Json;
using Entitys;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Repository
{
    public class ProductRepository : IProductRepository
    {
        dbSHOPContext _dbSHOPContext;

        public ProductRepository(dbSHOPContext dbSHOPContext)
        {
            _dbSHOPContext = dbSHOPContext;
        }

        public async Task<Product> GetProductById(int id)
        {
            return await _dbSHOPContext.Products
                .Include(p => p.Category) // זה יגרום לקטגוריה להיטען ולא להיות null
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public async Task<(List<Product> Items, int TotalCount)> GetProducts(string? description, int? minPrice, int? maxPrice, int[]? categoryIds,
    int? limit, string? orderby, int? position)
        {
            // 1. נתחיל משאילתה בסיסית
            var query = _dbSHOPContext.Products.AsQueryable();

            // 2. נוסיף סינונים רק אם הפרמטרים באמת נשלחו
            if (!string.IsNullOrEmpty(description))
            {
                query = query.Where(p => p.Description.Contains(description));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // בדיקה חשובה: גם null וגם שלא יהיה מערך ריק
            if (categoryIds != null && categoryIds.Length > 0)
            {
                query = query.Where(p => categoryIds.Contains(p.CategoryId));
            }

            // 3. מיון
            query = query.OrderBy(p => p.Price);

            // 4. חישוב כמות כוללת (לפני ה-Skip וה-Take)
            int total = await query.CountAsync();

            // 5. חלוקה לעמודים (Paging)
            int pageSize = limit ?? 20;
            int currentPage = position ?? 1;

            List<Product> products = await query
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Include(p => p.Category)
                .ToListAsync();

            return (products, total);
        }
        public async Task DeleteProduct(int id)
        {
            var product = await _dbSHOPContext.Products.FindAsync(id);
            if (product != null)
            {
                _dbSHOPContext.Products.Remove(product);
                await _dbSHOPContext.SaveChangesAsync();
            }
        }

        // Repository/ProductRepository.cs
        public async Task<Product> AddProduct(Product product)
        {
            _dbSHOPContext.Products.Add(product);
            await _dbSHOPContext.SaveChangesAsync();
            return product;
        }

        public async Task UpdateProduct(int id, Product product)
        {
            product.ProductId = id; // מבטיח שה-ID מעודכן
            _dbSHOPContext.Products.Update(product);
            await _dbSHOPContext.SaveChangesAsync();
        }

    }

}
