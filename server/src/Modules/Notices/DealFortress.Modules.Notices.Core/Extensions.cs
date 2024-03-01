using System.Runtime.CompilerServices;
using Abstractions.Automapper;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Data;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Services;
using Elasticsearch.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nest;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Api")]

namespace DealFortress.Api.Modules.Notices.Extensions;
internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection services, string connectionString)
    {
        return services
            .AddDbContext<NoticesContext>(options =>
                options.UseSqlServer(connectionString))
            .AddScoped<INoticesRepository, NoticesRepository>()
            .AddScoped<IProductsRepository, ProductsRepository>()
            .AddScoped<INoticesService, NoticesService>()
            .AddScoped<IProductsService, ProductsService>()
            .AddScoped<IImagesService, ImagesService>()
            .AddAutoMapper(typeof(AutoMappingNoticeProfiles).Assembly)
            .AddSingleton<IElasticClient>(sp => 
            {
                var config = sp.GetRequiredService<IConfiguration>();

                var settings = new ConnectionSettings(
                    config["elasticCloudId"], 
                    new ApiKeyAuthenticationCredentials(config["elasticApiKey"])
                );

                return new ElasticClient(settings);
            });
    }
}
