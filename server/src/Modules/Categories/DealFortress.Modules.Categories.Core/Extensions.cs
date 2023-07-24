using System.Runtime.CompilerServices;
using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Categories.Api")]

namespace DealFortress.Modules.Categories.Core.Extensions;
    internal static class Extensions
    {
        // public static IServiceCollection AddCore(this WebApplicationBuilder builder)
        // {
        //     builder.Services.AddDbContext<CategoriesContext>(options =>
        //         options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
        //     builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
        //     // builder.Services.AddScoped<CategoriesModule>();
        //     builder.Services.AddControllers();

        //     return builder.Services;
        // }

        public static IServiceCollection AddCore(this IServiceCollection services, IConfiguration configuration)
        {
            return services
                .AddDbContext<CategoriesContext>(options =>
                    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")))
                .AddScoped<ICategoriesRepository, CategoriesRepository>();
                // .AddScoped<ICategoriesController, C
                // .AddScoped<CategoriesModule>();
        }
    }
