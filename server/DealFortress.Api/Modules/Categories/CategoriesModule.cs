
namespace DealFortress.Api.Modules.Categories
{
    public class CategoriesModule
    {
        public CategoriesController Controller;
        public CategoriesRepository Repo;

        public CategoriesModule(DealFortressContext context)
        {
            Repo = new CategoriesRepository(context);
            Controller = new CategoriesController(context, Repo);
        }


    }
}