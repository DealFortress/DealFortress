using DealFortress.Api.Models;

namespace DealFortress.Api.Repositories
{
    public interface INoticesRepository: IRepository<Notice>
    {
        IEnumerable<Notice> GetAllWithProducts();

        Notice? GetByIdWithProducts(int id);
    }
}