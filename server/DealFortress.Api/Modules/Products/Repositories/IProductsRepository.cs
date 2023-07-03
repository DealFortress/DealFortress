using DealFortress.Api.Products;
using DealFortress.Api.Repositories;

namespace DealFortress.Api.Products
{
    public interface IProductsRepository: IRepository<Product>
    {
        IEnumerable<Product> GetAllWithEverything();
        Product? GetByIdWithEverything(int id);
    }
}