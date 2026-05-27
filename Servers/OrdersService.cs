namespace Servers;

using System;
using AutoMapper;
using DTOs;
using Entitys;
using Microsoft.Extensions.Logging;
using Repository;


public class OrdersService : IOrdersService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<OrdersService> _logger;

    public OrdersService(IOrderRepository orderRepository, IMapper mapper,IProductRepository productRepository, ILogger<OrdersService> logger)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
        _productRepository= productRepository;
        _logger = logger;
    }

    public async Task<OrderDTO> GetOrderById(int id)
    {
        return _mapper.Map<Order, OrderDTO>( await _orderRepository.GetOrderById(id));
    }

    public async Task<OrderDTO> AddOrder(OrderDTO order)
    {
        double userSum = order.OrderSum;
        double realSum = 0;
        ICollection<OrderItemDTO> orderItems=order.OrderItems;
        foreach (OrderItemDTO item in orderItems)
        {
            Product product= await _productRepository.GetProductById(item.ProductId);
            if (product != null) {
               double priceForUnit= product.Price;
                realSum += priceForUnit*item.Quantity;
            }
        }
        if(realSum != userSum)
        {
            _logger.LogWarning("Order sum mismatch for user {UserId}. Client sent: {ClientSum}, Server calculated: {ServerSum} 😖", order.UserId, order.OrderSum, realSum);
            order = order with { OrderSum = realSum };

        }

        Order o = _mapper.Map<OrderDTO, Order>(order);
        return _mapper.Map < Order, OrderDTO > (await _orderRepository.AddOrder(o));

    }
    public async Task<IEnumerable<OrderDTO>> GetAllOrders()
    {
        var orders = await _orderRepository.GetAllOrders(); // את זה ניצור ב-Repository מיד
        return _mapper.Map<IEnumerable<Order>, IEnumerable<OrderDTO>>(orders);
    }

    // שליפת הזמנות למשתמש ספציפי (לפרופיל אישי)
    public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
    {
        var allOrders = await _orderRepository.GetAllOrders();
        // מסננים ב-Service (או ב-Repository אם רוצים להיות יעילים יותר)
        var userOrders = allOrders.Where(o => o.UserId == userId);
        return _mapper.Map<IEnumerable<Order>, IEnumerable<OrderDTO>>(userOrders);
    }
    public async Task<bool> UpdateOrderStatus(int id, string status)
    {
        var order = await _orderRepository.GetOrderById(id);
        if (order == null) return false;

        order.Status = status;
        return await _orderRepository.UpdateOrder(order);
    }
}
