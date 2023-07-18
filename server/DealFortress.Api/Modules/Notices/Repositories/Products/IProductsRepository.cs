using DealFortress.Api.Repositories;

namespace DealFortress.Api.Modules.Notices;

public interface IProductsRepository : IRepository<Product>
{
    IEnumerable<Product> GetAllWithEverything();
    Product? GetByIdWithEverything(int id);
}
