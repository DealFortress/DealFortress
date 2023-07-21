

using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Modules.Notices.Extensions
{
    public static class WebApplicationBuilderExtensions
    {
        public static WebApplicationBuilder AddNotices(this WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<NoticesContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<INoticesRepository, NoticesRepository>();
            builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
            builder.Services.AddScoped<ProductsService>();
            builder.Services.AddScoped<NoticesService>();
            builder.Services.AddScoped<NoticesModule>();


            builder.Services.AddControllers();

            return builder;
        }
    }
}