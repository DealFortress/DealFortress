using System.Runtime.CompilerServices;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Api")]

namespace DealFortress.Api.Modules.Notices.Extensions
{
    internal static class Extensions
    {
        public static IServiceCollection AddCore(this IServiceCollection service, IConfiguration configuration)
        {
            return service
                .AddDbContext<NoticesContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")))
                .AddScoped<INoticesRepository, NoticesRepository>()
                .AddScoped<IProductsRepository, ProductsRepository>();
        }

    }
}