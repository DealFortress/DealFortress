using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;

public interface IMessagesService
{
    Task<MessageResponse?> GetByIdAsync(int id);

    Task<MessageResponse?> PostAsync(StandaloneMessageRequest request, string? authId = null);
}
