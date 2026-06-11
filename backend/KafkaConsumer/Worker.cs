using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace KafkaConsumer;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IConfiguration _configuration;

    public Worker(ILogger<Worker> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() =>
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = _configuration["Kafka:BootstrapServers"],
                GroupId = "order-consumer-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe(_configuration["Kafka:OrderTopic"]);
            _logger.LogInformation("Kafka Consumer started, listening to topic '{Topic}'", _configuration["Kafka:OrderTopic"]);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var result = consumer.Consume(stoppingToken);
                    _logger.LogInformation("New Order received: {Message}", result.Message.Value);
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex) { _logger.LogError("Error consuming message: {Error}", ex.Message); }
            }
            consumer.Close();
        }, stoppingToken);
    }
}
