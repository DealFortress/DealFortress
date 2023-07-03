using DealFortress.Api.Categories;
using DealFortress.Api.Notices;
using DealFortress.Api.Products;

namespace DealFortress.Api.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        INoticesRepository Notices { get; }
        ICategoriesRepository Categories { get; }
        IProductsRepository Products { get; }
        int Complete();
    }
}