using DealFortress.Modules.Messages.Core.Domain.Entities;
using DealFortress.Modules.Messages.Core.DTO;

namespace DealFortress.Modules.Messages.Core.Domain.Services;

public interface IMessagesService
{
    IEnumerable<MessageResponse> GetAll();

    MessageResponse? GetById(int id);

    MessageResponse Post(MessageRequest request);

    MessageResponse ToMessageResponseDTO(Message message);

    Message ToMessage(MessageRequest request);
}
