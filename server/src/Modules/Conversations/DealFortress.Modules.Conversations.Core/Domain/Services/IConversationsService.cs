using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;
public interface IConversationsService
{
    Task<IEnumerable<ConversationResponse>> GetAllByAuthIdAsync(string authId);

    Task<ConversationResponse?> GetByIdAsync(int id);

    Task<ConversationResponse> PostAsync(ConversationRequest request);

    ConversationResponse ToConversationResponseDTO(Conversation Conversation);

    Conversation ToConversation(ConversationRequest request); 
}
