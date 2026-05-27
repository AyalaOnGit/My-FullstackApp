using DTOs;
using Entitys;
using Repository;

namespace Servers
{
    public interface IOrdersService
    {

        Task<OrderDTO> AddOrder(OrderDTO order);
        Task<OrderDTO> GetOrderById(int id);
        Task<IEnumerable<OrderDTO>> GetAllOrders();
        Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId);
        Task<bool> UpdateOrderStatus(int id, string status);
    }
}