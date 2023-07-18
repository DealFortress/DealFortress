
namespace DealFortress.Api.Modules.Categories
{
    public class CategoriesModule
    {
        public CategoriesController Controller;
        private CategoryContext _context;
        private readonly CategoriesRepository _repo;

        public CategoriesModule(CategoryContext context)
        {
            _context = context;
            _repo = new CategoriesRepository(context);
            Controller = new CategoriesController( _repo);
        }


    }
}