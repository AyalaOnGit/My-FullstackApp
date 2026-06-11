namespace Servers;

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
    private readonly IKafkaProducerService _kafkaProducer;

    public OrdersService(IOrderRepository orderRepository, IMapper mapper, IProductRepository productRepository, ILogger<OrdersService> logger, IKafkaProducerService kafkaProducer)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
        _productRepository = productRepository;
        _logger = logger;
        _kafkaProducer = kafkaProducer;
    }

    public async Task<OrderDTO> GetOrderById(int id)
    {
        return _mapper.Map<Order, OrderDTO>(await _orderRepository.GetOrderById(id));
    }

    public async Task<OrderDTO> AddOrder(OrderDTO order)
    {
        double realSum = 0;
        foreach (OrderItemDTO item in order.OrderItems)
        {
            Product product = await _productRepository.GetProductById(item.ProductId);
            if (product != null)
                realSum += product.Price * item.Quantity;
        }
        if (realSum != order.OrderSum)
        {
            _logger.LogWarning("Order sum mismatch for user {UserId}. Client sent: {ClientSum}, Server calculated: {ServerSum}", order.UserId, order.OrderSum, realSum);
            order = order with { OrderSum = realSum };
        }

        Order o = _mapper.Map<OrderDTO, Order>(order);
        OrderDTO createdOrder = _mapper.Map<Order, OrderDTO>(await _orderRepository.AddOrder(o));
        try { await _kafkaProducer.PublishOrderCreatedAsync(createdOrder); }
        catch (Exception ex) { _logger.LogWarning("Kafka unavailable, order saved without event: {Message}", ex.Message); }
        return createdOrder;
    }

    public async Task<IEnumerable<OrderDTO>> GetAllOrders()
    {
        var orders = await _orderRepository.GetAllOrders();
        return _mapper.Map<IEnumerable<Order>, IEnumerable<OrderDTO>>(orders);
    }

    public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
    {
        var allOrders = await _orderRepository.GetAllOrders();
        return _mapper.Map<IEnumerable<Order>, IEnumerable<OrderDTO>>(allOrders.Where(o => o.UserId == userId));
    }

    public async Task<bool> UpdateOrderStatus(int id, string status)
    {
        var order = await _orderRepository.GetOrderById(id);
        if (order == null) return false;
        order.Status = status;
        return await _orderRepository.UpdateOrder(order);
    }

}
