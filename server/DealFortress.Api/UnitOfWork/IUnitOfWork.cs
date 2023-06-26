using DealFortress.Api.Repositories;


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