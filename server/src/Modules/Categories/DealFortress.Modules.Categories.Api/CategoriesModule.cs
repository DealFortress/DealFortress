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
    public static WebApplicationBuilder AddCategoriesModule(this WebApplicationBuilder builder, IConfiguration configuration)
    {
        
        builder.Services.AddControllers();

        builder.Services.AddCore(configuration);

        return builder;
    }
}
