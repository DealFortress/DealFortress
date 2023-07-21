using DealFortress.Modules.Categories.Core.DAL.Repositories;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DealFortress.Api.Modules.Categories.Extensions
{
    public static class WebApplicationBuilderExtensions
    {
        public static WebApplicationBuilder AddCategories(this WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<CategoriesContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
            // builder.Services.AddScoped<CategoriesModule>();


            builder.Services.AddControllers();

            return builder;
        }
    }
}