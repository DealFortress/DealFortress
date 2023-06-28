using DealFortress.Api.Models;

namespace DealFortress.Api.Repositories
{
    public class CategoriesRepository: Repository<Category>, ICategoriesRepository
    {
        public CategoriesRepository(DealFortressContext context) : base(context)
        {

        }

        public DealFortressContext DealFortressContext 
        {
            get { return Context as DealFortressContext; }
        }
    }
}