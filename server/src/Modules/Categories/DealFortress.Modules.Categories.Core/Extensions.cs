using System.Runtime.CompilerServices;
using DealFortress.Modules.Categories.Core.DAL;
using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Services;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Categories.Api")]

namespace DealFortress.Modules.Categories.Core.Extensions;
    internal static class Extensions
    {
        public static IServiceCollection AddCore(this IServiceCollection services, string connectionString)
        {
            return services
                .AddDbContext<CategoriesContext>(options =>
                    options.UseSqlServer(connectionString))
                .AddScoped<ICategoriesRepository, CategoriesRepository>()
                .AddScoped<ICategoriesService, CategoriesService>()
                .AddAutoMapper
        }
    }
