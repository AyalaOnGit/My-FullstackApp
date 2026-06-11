using Confluent.Kafka;
using DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Servers;

public class KafkaProducerService : IKafkaProducerService, IDisposable
{
    private readonly IProducer<string, string> _producer;
    private readonly string _topic;
    private readonly ILogger<KafkaProducerService> _logger;

    public KafkaProducerService(IConfiguration configuration, ILogger<KafkaProducerService> logger)
    {
        _logger = logger;
        _topic = configuration["Kafka:OrderTopic"]!;

        var config = new ProducerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"],
            MessageTimeoutMs = 3000,
            SocketTimeoutMs = 2000
        };

        _producer = new ProducerBuilder<string, string>(config).Build();
    }

    public async Task PublishOrderCreatedAsync(OrderDTO order)
    {
        var message = new Message<string, string>
        {
            Key = order.UserId.ToString(),
            Value = JsonSerializer.Serialize(order)
        };

        var result = await _producer.ProduceAsync(_topic, message);

        _logger.LogInformation(
            "Order event published → Topic: {Topic} | Partition: {Partition} | Offset: {Offset} | UserId: {UserId} | OrderId: {OrderId} | Sum: {Sum}",
            result.Topic, result.Partition.Value, result.Offset.Value,
            order.UserId, order.OrderId, order.OrderSum);
    }

    public void Dispose()
    {
        try { _producer?.Flush(TimeSpan.FromSeconds(1)); } catch { }
        _producer?.Dispose();
    }
}
