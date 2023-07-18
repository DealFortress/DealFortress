using DealFortress.Api.Models;
using DealFortress.Api.Repositories;

namespace DealFortress.Api.Modules.Notices;

public interface INoticesRepository : IRepository<Notice>
{
    IEnumerable<Notice> GetAllWithProducts();

    Notice? GetByIdWithProducts(int id);
}
