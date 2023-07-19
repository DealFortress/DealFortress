using DealFortress.Api.Repositories;

namespace DealFortress.Api.Modules.Categories;

    public class CategoriesRepository: Repository<Category>, ICategoriesRepository
    {
        public CategoriesRepository(CategoriesContext context) : base(context)
        {

        }

        public CategoriesContext CategoriesContext 
        {
            get { return Context as CategoriesContext; }
        }
    }
