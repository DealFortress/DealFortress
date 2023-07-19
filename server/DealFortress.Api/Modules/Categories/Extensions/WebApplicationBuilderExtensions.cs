

using Microsoft.EntityFrameworkCore;

namespace DealFortress.Api.Modules.Categories.Extensions
{
    public static class WebApplicationBuilderExtensions
    {
        public static WebApplicationBuilder AddCategories(this WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<CategoriesContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
            builder.Services.AddScoped<CategoriesModule>();


            builder.Services.AddControllers();

            return builder;
        }
    }
}