using DealFortress.Modules.Notices.Core.Domain.Entities;
using DealFortress.Modules.Notices.Core.DTO;

namespace DealFortress.Modules.Notices.Core.Domain.Services;

public interface INoticesService
{
    IEnumerable<NoticeResponse> GetAll();

    NoticeResponse? GetById(int id);

    NoticeResponse Post(NoticeRequest request);

    NoticeResponse? PutById(int id, NoticeRequest request);

    Notice? DeleteById(int id);

    NoticeResponse ToNoticeResponseDTO(Notice notice);

    Notice ToNotice(NoticeRequest request);
}