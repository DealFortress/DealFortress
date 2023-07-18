using DealFortress.Api.Repositories;

namespace DealFortress.Api.Modules.Categories;

    public class CategoriesRepository: Repository<Category>, ICategoriesRepository
    {
        public CategoriesRepository(CategoryContext context) : base(context)
        {

        }

        public CategoryContext CategoryContext 
        {
            get { return Context as CategoryContext; }
        }
    }
