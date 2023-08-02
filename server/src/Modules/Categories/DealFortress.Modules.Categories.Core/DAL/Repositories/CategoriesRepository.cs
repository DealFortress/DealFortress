using System.Runtime.CompilerServices;
using DealFortress.Modules.Categories.Core.Domain.Entities;
using DealFortress.Modules.Categories.Core.Domain.Repositories;
using DealFortress.Shared.Abstractions.Repositories;

[assembly: InternalsVisibleTo("DealFortress.Bootstrapper")]
[assembly: InternalsVisibleTo("DealFortress.Modules.Categories.Tests.Integration")]


namespace DealFortress.Modules.Categories.Core.DAL.Repositories;

    internal class CategoriesRepository: Repository<Category>, ICategoriesRepository
    {
        public CategoriesRepository(CategoriesContext context) : base(context)
        {

        }

        public CategoriesContext? CategoriesContext 
        {
            get { return Context as CategoriesContext; }
        }
    }
