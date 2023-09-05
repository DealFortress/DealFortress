using System.Runtime.CompilerServices;
using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Extensions;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Categories.Api;

internal static class CategoriesModule
{
    public static void AddCategoriesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<CategoriesController>()
            .AddControllers();
    }
}
