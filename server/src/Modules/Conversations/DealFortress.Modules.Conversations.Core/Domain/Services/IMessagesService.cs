using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;

public interface IMessagesService
{
    // IEnumerable<MessageResponse> GetAllByAuthId(string authId);

    MessageResponse? GetById(int id);

    MessageResponse? Post(MessageRequest request);

    MessageResponse ToMessageResponseDTO(Message message);

    Message ToMessage(MessageRequest request, Conversation conversation);
}
