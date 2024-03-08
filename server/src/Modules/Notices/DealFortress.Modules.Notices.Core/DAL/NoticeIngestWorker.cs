using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nest;

namespace DealFortress.Modules.Notices.Core.DAL;
public class NoticeIngestWorker : BackgroundService
{
    private readonly IElasticClient _client;
    private readonly IHostApplicationLifetime _applicationLifetime;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public NoticeIngestWorker(IElasticClient client, IHostApplicationLifetime applicationLifetime, IServiceScopeFactory serviceScopeFactory)
    {
        _client = client;
        _applicationLifetime = applicationLifetime;
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var service = scope.ServiceProvider.GetService<INoticesService>();
            var entities =  service?.GetAll();

            if (entities is null) {
                return;
            }

            var bulkAll = _client.BulkAll(entities, b => b
            .Index("notices-index-v1")
            .BackOffRetries(2)
            .BackOffTime("30s")
            .MaxDegreeOfParallelism(4)
            .RetryDocumentPredicate((item, doc) => { return true; })
            .DroppedDocumentCallback((item, doc) => {
                Console.WriteLine($"Could not index doc.{Environment.NewLine}{item}{Environment.NewLine}{System.Text.Json.JsonSerializer.Serialize(doc)}");
            })
            .ContinueAfterDroppedDocuments()
            .Size(1000)
            .RefreshOnCompleted()
            );

            bulkAll.Wait(TimeSpan.FromMinutes(10), _ => Console.WriteLine("indexed"));

            await _client.Indices.PutAliasAsync("notices-index-v1", "notices-index", ct: cancellationToken);
        }
    }
    }
