using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Notices.Extensions;
using DealFortress.Modules.Notices.Api.Controllers;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Notices.Api;

internal static class NoticesModule
{
    public static void AddNoticesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<NoticesController>()
            .AddScoped<ProductsController>()
            .AddControllers();
    }
}
