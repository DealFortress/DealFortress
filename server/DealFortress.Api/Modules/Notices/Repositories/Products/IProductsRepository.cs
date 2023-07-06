using DealFortress.Api.Notices;
using DealFortress.Api.Repositories;

namespace DealFortress.Api.Notices
{
    public interface IProductsRepository: IRepository<Product>
    {
        IEnumerable<Product> GetAllWithEverything();
        Product? GetByIdWithEverything(int id);
    }
}