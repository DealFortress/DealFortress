
using DealFortress.Modules.Conversations.Core.Domain.Entities;

namespace DealFortress.Modules.Conversations.Core.DTO;
public class MessageRequest
{
    // public required int ConversationId { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
}
