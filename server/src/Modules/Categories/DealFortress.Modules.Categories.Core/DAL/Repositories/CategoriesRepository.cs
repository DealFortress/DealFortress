using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;

namespace DealFortress.Modules.Categories.Core.DAL.Repositories;

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
