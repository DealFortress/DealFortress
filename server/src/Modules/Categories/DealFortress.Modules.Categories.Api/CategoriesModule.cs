using System.Runtime.CompilerServices;
using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Extensions;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Categories.Api;

internal static class CategoriesModule
{
    // public CategoriesController Controller;

    // public CategoriesModule(ICategoriesRepository repo, CategoriesService service)
    // {
    //     Controller = new CategoriesController(repo, service);
    // }

    public static void AddCategoriesModule(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddCore(configuration)
            .AddScoped<CategoriesController>()
            .AddControllers();
            
            // .AddApplicationPart(typeof(WebApplicationBuilder).Assembly);
    }

}
