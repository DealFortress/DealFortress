
using DealFortress.Api.Repositories;

namespace DealFortress.Api.Notices
{
    public interface INoticesRepository: IRepository<Notice>
    {
        IEnumerable<Notice> GetAllWithProducts();

        Notice? GetByIdWithProducts(int id);
    }
}