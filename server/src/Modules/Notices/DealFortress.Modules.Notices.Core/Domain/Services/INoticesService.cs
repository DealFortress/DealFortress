using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface INoticesService
{
    IEnumerable<NoticeResponse> GetAllDTO();

    NoticeResponse? GetDTOById(int id);

    NoticeResponse PostDTO(NoticeRequest request);

    NoticeResponse PutDTOById(int id, NoticeRequest request);

    Notice? DeleteById(int id);

    NoticeResponse ToNoticeResponseDTO(Notice notice);

    Notice ToNotice(NoticeRequest request);
}