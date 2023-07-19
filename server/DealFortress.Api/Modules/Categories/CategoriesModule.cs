
namespace DealFortress.Api.Modules.Categories
{
    public class CategoriesModule
    {
        public CategoriesController Controller;

        public CategoriesModule(CategoriesContext context, ICategoriesRepository repo)
        {
            Controller = new CategoriesController(repo);
        }


    }
}