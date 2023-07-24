using DealFortress.Shared.Abstractions.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Entities;

namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface INoticesRepository : IRepository<Notice>
{
    IEnumerable<Notice> GetAllWithProducts();

    Notice? GetByIdWithProducts(int id);
}
