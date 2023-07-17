using DealFortress.Api.UnitOfWork;

namespace DealFortress.Api.Modules.Categories
{
    public class CategoriesModule
    {
        public CategoriesController Controller;

        public CategoriesModule(DealFortressContext context, IUnitOfWork unitOfWork)
        {
            Controller = new CategoriesController(context, unitOfWork);
        }


    }
}