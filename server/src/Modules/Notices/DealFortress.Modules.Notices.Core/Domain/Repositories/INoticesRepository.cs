using DealFortress.Shared.Abstractions.Repositories;
using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Domain.Repositories;

public interface INoticesRepository : IRepository<Notice>
{
    IQueryable<Notice> GetAllPaged(GetNoticesParams param);
}
