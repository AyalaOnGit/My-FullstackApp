namespace Servers;

using System;
using AutoMapper;
using Confluent.Kafka;
using DTOs;
using Entitys;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Repository;
using System.Text.Json;

public class OrdersService : IOrdersService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<OrdersService> _logger;
    private readonly IConfiguration _configuration;

    public OrdersService(IOrderRepository orderRepository, IMapper mapper, IProductRepository productRepository, ILogger<OrdersService> logger, IConfiguration configuration)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
        _productRepository = productRepository;
        _logger = logger;
        _configuration = configuration;
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
        await SendToKafkaAsync(createdOrder);
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

    private async Task SendToKafkaAsync(OrderDTO order)
    {
        try
        {
            var config = new ProducerConfig
            {
                BootstrapServers = _configuration["Kafka:BootstrapServers"],
                MessageTimeoutMs = 3000,
                RequestTimeoutMs = 3000
            };
            var topic = _configuration["Kafka:Topic"];
            using var producer = new ProducerBuilder<Null, string>(config).Build();
            var message = JsonSerializer.Serialize(order);
            await producer.ProduceAsync(topic, new Message<Null, string> { Value = message });
            _logger.LogInformation("Order {OrderId} sent to Kafka topic '{Topic}'", order.OrderId, topic);
        }
        catch (Exception ex)
        {
            _logger.LogError("Failed to send order to Kafka: {Message}", ex.Message);
        }
    }
}
