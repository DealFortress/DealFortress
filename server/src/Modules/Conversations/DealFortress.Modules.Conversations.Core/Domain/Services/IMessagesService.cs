using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;

public interface IMessagesService
{
    Task<MessageResponse?> GetByIdAsync(int id);

    Task<MessageResponse?> PostAsync(MessageRequest request);

    MessageResponse ToMessageResponseDTO(Message message);

    Message ToMessage(MessageRequest request, Conversation conversation);
}
