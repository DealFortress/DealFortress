using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface INoticesService
{
    Task<IEnumerable<NoticeResponse>> GetAllAsync();

    Task<NoticeResponse?> GetByIdAsync(int id);

    Task<NoticeResponse> PostAsync(NoticeRequest request);

    Task<NoticeResponse?> PutByIdAsync(int id, NoticeRequest request);

    Task<Notice?> DeleteByIdAsync(int id);

    NoticeResponse ToNoticeResponseDTO(Notice notice);

    Notice ToNotice(NoticeRequest request);
}