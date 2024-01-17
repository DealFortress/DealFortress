using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.DTO;
public class NestedMessageRequest : IMessageRequest
{
    public required int ConversationId { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
}
