using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.Domain.Services;
public interface IConversationsService
{
    IEnumerable<ConversationResponse> GetAllByAuthId(string authId);

    ConversationResponse? GetById(int id);

    ConversationResponse Post(ConversationRequest request);

    ConversationResponse ToConversationResponseDTO(Conversation Conversation);

    Conversation ToConversation(ConversationRequest request); 
}
