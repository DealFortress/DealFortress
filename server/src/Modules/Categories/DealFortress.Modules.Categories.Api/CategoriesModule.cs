using DealFortress.Api.Modules.Categories.Extensions;
using DealFortress.Modules.Categories.Api.Controllers;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Modules.Categories.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DealFortress.Modules.Categories.Api
{
    public class CategoriesModule
    {
        public CategoriesController Controller;

        public CategoriesModule(CategoriesContext context, ICategoriesRepository repo, CategoriesService service)
        {
            Controller = new CategoriesController(repo, service);
        }

        public void Register(IServiceCollection services)
        {
            services.AddCore();
        }

    }
}