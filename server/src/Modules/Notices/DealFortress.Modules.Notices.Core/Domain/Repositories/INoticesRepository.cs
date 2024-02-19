using DealFortress.Shared.Abstractions.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface INoticesRepository : IRepository<Notice>
{
    PaginatedList<Notice> GetAllPaginated(int? userId, int pageIndex, int pageSize);
}
