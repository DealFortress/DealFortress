using DealFortress.Modules.Conversations.Core.Domain.Entities;
using DealFortress.Modules.Conversations.Core.DTO.Conversation;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;
public interface IConversationsService
{
    Task<IEnumerable<ConversationResponse>> GetAllByAuthIdAsync(string authId);

    Task<ConversationResponse?> GetByIdAsync(int id);

    Task<ConversationResponse?> PostAsync(ConversationRequest request, string? authId = null);

    Task<ConversationResponse?> PatchLastReadMessageAsync(PatchLastMessageReadRequest request, string authId );

    Task<Conversation?> DeleteByIdAsync(int it);

    ConversationResponse ToConversationResponseDTO(Conversation Conversation);

    Conversation ToConversation(ConversationRequest request); 
}
