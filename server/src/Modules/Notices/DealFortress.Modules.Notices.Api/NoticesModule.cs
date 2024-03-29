using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Notices.Extensions;
using DealFortress.Modules.Notices.Api.Controllers;
using DealFortress.Modules.Notices.Core.Domain.Data;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Notices.Api;

internal static class NoticesModule
{
    public static IServiceCollection AddNoticesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<NoticesController>()
            .AddScoped<ProductsController>();

         return services;
    }

    public static void SeedNotices(this IServiceProvider serviceProvider) {
        SeedData.Initialize(serviceProvider);
    }
}
