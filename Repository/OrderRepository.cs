using System.Text.Json;
using Entitys;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Repository
{
    public class OrderRepository : IOrderRepository
    {
        dbSHOPContext _dbSHOPContext;
        public OrderRepository(dbSHOPContext dbSHOPContext)
        {
            _dbSHOPContext = dbSHOPContext;
        }

        public async Task<Order> GetOrderById(int id)
        {
            //return await _dbSHOPContext.FindAsync<Order>(id);
            Order order = await _dbSHOPContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi=>oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);
            return order;
        }


        public async Task<Order> AddOrder(Order order)
        {
            await _dbSHOPContext.AddAsync(order);
            await _dbSHOPContext.SaveChangesAsync();
            return await GetOrderById(order.OrderId);// await _dbSHOPContext.Orders.FindAsync(order.OrderId);
        }
        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await _dbSHOPContext.Orders
                .Include(o => o.OrderItems) // חשוב! כדי לראות מה קנו
                .ThenInclude(oi => oi.Product) // כדי לראות את שם המוצר והמחיר
                .ToListAsync();
        }
        public async Task<bool> UpdateOrder(Order order)
        {
            _dbSHOPContext.Orders.Update(order);
            await _dbSHOPContext.SaveChangesAsync();
            return true;
        }

    }
}
