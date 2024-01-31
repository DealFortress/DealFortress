using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;
using DealFortress.Modules.Conversations.Core.DTO.Message;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;

public interface IMessagesService
{
    Task<MessageResponse?> GetByIdAsync(int id);

    Task<MessageResponse?> PostAsync(StandaloneMessageRequest request);

    Task<MessageResponse?> PatchAsync(PatchMessageIsReadRequest request);

    MessageResponse ToMessageResponseDTO(Message message);

    Message ToMessage(IMessageRequest request, Conversation conversation);
}
