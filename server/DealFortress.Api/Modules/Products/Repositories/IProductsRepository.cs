using DealFortress.Api.Models;

namespace DealFortress.Api.Repositories
{
    public interface IProductsRepository: IRepository<Product>
    {
        IEnumerable<Product> GetAllWithEverything();
        Product? GetByIdWithEverything(int id);
    }
}