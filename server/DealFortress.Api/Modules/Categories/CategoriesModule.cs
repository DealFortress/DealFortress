
namespace DealFortress.Api.Modules.Categories
{
    public class CategoriesModule
    {
        public CategoriesController Controller;
        private CategoryContext _context;
        private readonly ICategoriesRepository _repo;

        public CategoriesModule(CategoryContext context, ICategoriesRepository repo)
        {
            _context = context;
            _repo = repo;
            Controller = new CategoriesController( _repo);
        }


    }
}