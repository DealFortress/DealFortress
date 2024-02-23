using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;
using DealFortress.Shared.Abstractions.Entities;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface INoticesService
{
    PaginatedList<NoticeResponse> GetAllPaginated(PaginatedParams param);
    Task<NoticeResponse?> GetByIdAsync(int id);

    Task<NoticeResponse> PostAsync(NoticeRequest request);

    Task<NoticeResponse?> PutByIdAsync(int id, NoticeRequest request);

    Task<Notice?> DeleteByIdAsync(int id);

}