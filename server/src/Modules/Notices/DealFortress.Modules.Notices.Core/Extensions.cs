using System.Runtime.CompilerServices;
using DealFortress.Modules.Notices.Core.DAL;
using DealFortress.Modules.Notices.Core.DAL.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Services;
using DealFortress.Modules.Notices.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Modules.Notices.Api")]

namespace DealFortress.Api.Modules.Notices.Extensions;
internal static class Extensions
{
    public static IServiceCollection AddCore(this IServiceCollection service, string connectionString)
    {
        return service
            .AddDbContext<NoticesContext>(options =>
                options.UseSqlServer(connectionString))
            .AddScoped<INoticesRepository, NoticesRepository>()
            .AddScoped<IProductsRepository, ProductsRepository>()
            .AddScoped<INoticesService, NoticesService>()
            .AddScoped<IProductsService, ProductsService>()
            .AddScoped<IImagesService, ImagesService>();
            // .AddAutoMapper(typeof(AutoMappingNoticeProfiles).Assembly);
    }
}
