using System.Runtime.CompilerServices;
using DealFortress.Api.Modules.Notices.Extensions;
using DealFortress.Modules.Notices.Api.Controllers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]

namespace DealFortress.Modules.Notices.Api;

internal static class NoticesModule
{
    // public NoticesController NoticeController;
    // public ProductsController ProductController;

    // public NoticesModule(NoticesContext context, IProductsRepository productRepo, INoticesRepository noticeRepo, CategoriesModule categoriesModule, ProductsService productsService, NoticesService noticesService)
    // {
    //     ProductController = new ProductsController(productRepo, productsService);

    //     NoticeController = new NoticesController(noticeRepo, noticesService);
    // }

    public static void AddNoticesModule(this IServiceCollection services, string connectionString)
    {
        services
            .AddCore(connectionString)
            .AddScoped<NoticesController>()
            .AddScoped<ProductsController>()
            .AddControllers();

    }
}
