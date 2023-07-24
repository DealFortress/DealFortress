using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Repositories;

namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface IProductsRepository : IRepository<Product>
{
    IEnumerable<Product> GetAllWithEverything();
    Product? GetByIdWithEverything(int id);
}
