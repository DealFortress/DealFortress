using Microsoft.EntityFrameworkCore;

[assembly: InternalVisibleTo("DealFortress.Modules.Notices.Api")]

namespace DealFortress.Api.Modules.Notices.Extensions
{
    internal static class Extensions
    {
        public static IServiceCollection AddCore(this IServiceCollection service, IConfiguration configuration)
        {
            return services
                .AddDbContext<NoticesContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")))
                .AddScoped<INoticesRepository, NoticesRepository>()
                .AddScoped<IProductsRepository, ProductsRepository>();
        }

    }
}