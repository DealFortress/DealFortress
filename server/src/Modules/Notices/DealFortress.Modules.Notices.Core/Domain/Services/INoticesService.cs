using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Services;

public interface INoticesService
{
    IEnumerable<NoticeResponse> GetAllDTO();

    NoticeResponse? GetDTOById(int id);

    NoticeResponse PostDTO(NoticeRequest request);

    NoticeResponse ToNoticeResponseDTO(Notice notice);

    Notice ToNotice(NoticeRequest request);
}