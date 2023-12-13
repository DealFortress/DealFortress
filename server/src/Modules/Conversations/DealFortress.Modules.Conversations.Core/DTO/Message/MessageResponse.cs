

namespace DealFortress.Modules.Conversations.Core.DTO;
public class MessageResponse
{
    public required int Id { get; set; }
    public required int ConversationId { get; set; }
    public required string Text { get; set; }
    public required int SenderId { get; set; }
    public required DateTime CreatedAt { get; set; }
}
