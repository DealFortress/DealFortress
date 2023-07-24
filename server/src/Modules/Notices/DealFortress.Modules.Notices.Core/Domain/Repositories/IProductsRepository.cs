namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface IProductsRepository : IRepository<Product>
{
    IEnumerable<Product> GetAllWithEverything();
    Product? GetByIdWithEverything(int id);
}
